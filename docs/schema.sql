-- =====================================================================
-- CERs Index — Core DB Schema
-- PostgreSQL 15+  |  2026-06
--
-- 파일 구조
--   schema.sql           ← 이 파일 (DDL: types, tables, indexes, views, triggers)
--   schema_scoring.sql   ← 스코어링 테이블 (schema.sql 선행 필요)
--   seeds/taxonomy.sql   ← area, category seed data
--   seeds/variables.sql  ← variable seed (scripts/seed_var_def.py 생성)
--   seeds/scoring_inputs.sql ← v1.4 고정 입력 변수 (관측 여부와 무관)
--   seeds/scoring.sql    ← kpi, score_var, score_elem 등 스코어링 seed
--   seeds/scoring_0714_draft.sql ← 최신 0714 비운영 방법론 레지스트리
--
-- 설계 원칙
--   1. 안정적·소규모 코드 집합 → enum 타입. 참조 테이블 없음.
--   2. 1:1 관계 병합: report = 수집(doc_file) + 파싱 메타(doc_parse).
--   3. 공시 결측과 파이프라인 실패를 상태 enum으로 구분.
--   4. 파이프라인 실행 로그는 외부 도구에 위임 (job_run 없음).
--   5. 스코어링 DDL은 schema_scoring.sql 별도 분리.
-- =====================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────
-- 1. ENUM TYPES
-- ─────────────────────────────────────────────────────────────────────

CREATE TYPE doc_kind_t AS ENUM (
    'esg_report',   -- ESG/지속가능경영보고서 (기본)
    'biz_report',   -- 사업보고서
    'verify_doc',   -- 검증의견서
    'policy_doc',   -- 정책문서
    'web_page',     -- 웹페이지
    'api_snap',     -- API 스냅샷
    'other'
);

-- 보고경계 유형 (IFRS S1.20 기반)
CREATE TYPE boundary_t AS ENUM (
    'consolidated',  -- 연결기준
    'standalone',    -- 별도기준 (모회사 단독)
    'domestic',      -- 국내 합산
    'overseas',      -- 해외 합산
    'country',       -- 특정 국가 (org_unit 명시)
    'segment',       -- 사업부/세그먼트
    'facility',      -- 사업장/시설
    'entity',        -- 특정 법인 (종속기업)
    'mixed',         -- 복수 경계 병기
    'unknown'        -- 보고서에서 확인 불가
);

CREATE TYPE ghg_method_t AS ENUM (
    'financial_ctrl',    -- 재무통제 기준
    'operational_ctrl',  -- 운영통제 기준 (GHG Protocol)
    'equity_share',      -- 지분율 비례
    'unknown'
);

CREATE TYPE unit_type_t AS ENUM (
    'entity',    -- 법인 (종속기업, 지점)
    'region',    -- 지역/국가 합산
    'segment',   -- 사업부/세그먼트
    'facility'   -- 사업장/공장
);

-- 추출 방법 (파서 extraction_method 값과 1:1 대응)
CREATE TYPE method_t AS ENUM (
    'table',             -- 표 구조 추출
    'table_transposed',  -- 전치 표
    'energy_table',      -- 에너지 표 전용
    'text_table_row',    -- 텍스트 테이블 행
    'energy_text_row',   -- 에너지 텍스트 행
    'text_inline',       -- 텍스트 인라인
    'text_keyword',      -- 키워드 추출
    'text_regex',        -- 정규식 추출
    'category_sum',      -- 카테고리 합산
    'llm',               -- LLM 추출
    'dart_api',          -- DART API
    'gov_data'           -- 정부 공개 데이터 (GIR 명세서 등 — 보고서 외 구조화 소스)
);

CREATE TYPE conf_t AS ENUM ('high', 'medium', 'low');

CREATE TYPE val_kind_t AS ENUM (
    'bool', 'num', 'pct', 'text', 'date', 'year', 'list', 'json', 'raw'
);

CREATE TYPE collection_state_t AS ENUM (
    'pending', 'success', 'no_reports', 'failed', 'js_required',
    'wrong_document', 'appendix_only', 'skipped', 'manual_review'
);

CREATE TYPE parse_state_t AS ENUM (
    'pending', 'parsed', 'not_reported', 'scanned_pdf',
    'rule_failed', 'failed', 'manual_review'
);

CREATE TYPE data_state_t AS ENUM (
    'reported', 'not_reported', 'not_applicable',
    'collection_failed', 'parse_failed', 'needs_review'
);

-- ─────────────────────────────────────────────────────────────────────
-- 2. UPDATED_AT TRIGGER (공용)
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION _set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- ─────────────────────────────────────────────────────────────────────
-- 3. 분류 TAXONOMY
--    area → category → variable
--    seed 데이터: docs/seeds/taxonomy.sql, docs/seeds/variables.sql
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE area (
    id      smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code    varchar(20) NOT NULL UNIQUE,
    name    varchar(80) NOT NULL,
    sort_no smallint NOT NULL DEFAULT 0
);

CREATE TABLE category (
    id      smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    area_id smallint NOT NULL REFERENCES area(id),
    code    varchar(20) NOT NULL UNIQUE,
    name    varchar(120) NOT NULL,
    sort_no smallint NOT NULL DEFAULT 0
);

CREATE TABLE variable (
    id        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    cat_id    smallint NOT NULL REFERENCES category(id),
    code      varchar(40) NOT NULL UNIQUE,  -- 파서 field_name (scope1_total_tco2e 등)
    name      varchar(160) NOT NULL,
    val_kind  val_kind_t NOT NULL,
    is_list   boolean NOT NULL DEFAULT false,
    unit_std  varchar(20),                  -- 표준 단위 (tCO2e, MWh, %)
    scope_txt varchar(120),                 -- 적용 범위 메모
    src_qno   varchar(15),                  -- CDP 질문번호 (추적용, FK 아님)
    sort_no   smallint NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true
);

-- ─────────────────────────────────────────────────────────────────────
-- 4. 기업 마스터
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE company (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dart_code   varchar(20) UNIQUE,     -- DART corp_code (KR)
    edinet_code varchar(20) UNIQUE,     -- EDINET コード (JP)
    stock_code  varchar(20),
    corp_name   varchar(160) NOT NULL,
    corp_en     varchar(160),
    country     char(2) NOT NULL DEFAULT 'KR',
    market      varchar(20),            -- KOSPI/KOSDAQ/TSE_Prime 등
    ceo_name    varchar(120),
    homepage    text,
    phone       varchar(40),
    address     text,
    region      varchar(80),
    ind_code    varchar(20),
    sector_code varchar(20),
    sector_name varchar(120),
    krx_ind     varchar(120),
    cers_group  varchar(80),            -- CERs 업종 집계축
    fiscal_mon  smallint,               -- 결산월
    list_date   date,
    found_date  date,
    is_active   boolean NOT NULL DEFAULT true,
    fetched_at  timestamptz,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_company_upd
    BEFORE UPDATE ON company
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- 5. 종속기업
--    DART /api/otrCprInvstmntSttus.json 은 자회사 corp_code 미제공.
--    sub_dart 는 향후 확보 시 채움.
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE subsidiary (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    parent_id   bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    sub_name    varchar(200) NOT NULL,
    sub_dart    varchar(20),           -- 자회사 DART 코드 (확보 시)
    invest_pct  numeric(10,3),
    is_consol   boolean NOT NULL DEFAULT false,
    ctrl_method varchar(30),           -- 연결 / 지분법 / 원가법
    rpt_year    smallint NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (parent_id, sub_name, rpt_year)
);

-- ─────────────────────────────────────────────────────────────────────
-- 6. 조직단위 (breakdown 공시용)
--    국내/해외, 사업부별, 특정 사업장별 수치 연결 용도
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE org_unit (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id   bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    parent_id    bigint REFERENCES org_unit(id) ON DELETE SET NULL,
    unit_type    unit_type_t NOT NULL,
    unit_name    varchar(160) NOT NULL,
    unit_name_en varchar(160),
    country      char(2),
    dart_code    varchar(20),
    rpt_year     smallint,
    is_active    boolean NOT NULL DEFAULT true,
    UNIQUE (company_id, unit_type, unit_name, rpt_year)
);

-- ─────────────────────────────────────────────────────────────────────
-- 7. 수집 상태 이력
--    no_reports는 실제 미발간이 확인된 경우에만 허용한다.
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE collection_status (
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id          bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    source_cd           varchar(20) NOT NULL,
    crawl_state         collection_state_t NOT NULL DEFAULT 'pending',
    confirmed_no_report boolean NOT NULL DEFAULT false,
    candidates_found    integer,
    down_count          integer,
    fail_count          integer,
    dart_filings        integer,
    years_json          jsonb,
    verification_method varchar(80),
    error_text          text,
    crawled_at          timestamptz,
    retry_after         timestamptz,
    created_at          timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ck_collection_no_reports
        CHECK (crawl_state <> 'no_reports' OR confirmed_no_report)
);

-- ─────────────────────────────────────────────────────────────────────
-- 8. 보고서 (수집 + 파싱 메타 통합)
--
--    상태는 타임스탬프 유무로 판단:
--      down_at IS NOT NULL                      → 다운로드 완료
--      down_err IS NOT NULL                     → 다운로드 실패
--      parsed_at IS NOT NULL                    → 파싱 완료
--      parse_err IS NOT NULL                    → 파싱 실패
--      down_at IS NULL AND source_url IS NOT NULL → URL 확인, 미다운로드
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE report (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id  bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    doc_kind    doc_kind_t NOT NULL DEFAULT 'esg_report',
    source_cd   varchar(20),           -- 'homepage' / 'dart' / 'edinet'
    title       varchar(240),
    rpt_year    smallint,
    lang_cd     varchar(8),            -- 'ko' / 'en' / 'bilingual' / 'ja'
    is_pref     boolean NOT NULL DEFAULT false,  -- 국/영문 대표본 여부
    source_url  text,
    file_name   varchar(240),
    file_path   text UNIQUE,           -- local_path (NULL = 미다운로드)
    file_size   bigint,
    -- 파싱 메타
    n_pages     integer,
    years_json  jsonb,                 -- 보고서에서 추출된 데이터 연도 목록
    frame_json  jsonb,                 -- 채택 프레임워크 (GRI/TCFD/IFRS S2)
    bound_scope boundary_t,
    ghg_method  ghg_method_t,
    bound_txt   text,                  -- 보고경계 원문 요약
    n_obs       integer NOT NULL DEFAULT 0,
    parse_state parse_state_t NOT NULL DEFAULT 'pending',
    parse_reason text,
    ocr_required boolean NOT NULL DEFAULT false,
    -- 파이프라인 타임스탬프
    down_at     timestamptz,
    down_err    text,
    parsed_at   timestamptz,
    parse_err   text,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_report_upd
    BEFORE UPDATE ON report
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- 9. 추출 원본값  raw_val
--    파서가 추출한 값 그대로. 정제 전.
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE raw_val (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id    bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    report_id     bigint REFERENCES report(id) ON DELETE SET NULL,
    variable_id   bigint NOT NULL REFERENCES variable(id),
    boundary_type boundary_t NOT NULL DEFAULT 'consolidated',
    org_unit_id   bigint REFERENCES org_unit(id) ON DELETE SET NULL,
    record_key    varchar(80) NOT NULL DEFAULT '',
    candidate_key varchar(64) NOT NULL DEFAULT '',
    data_year     smallint,
    raw_text      text,
    num_val       numeric(24,6),
    unit_raw      varchar(200),
    page_no       integer,
    evid_text     text,
    method        method_t,
    conf          conf_t,
    data_state    data_state_t NOT NULL DEFAULT 'reported',
    note_txt      text,
    created_at    timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────
-- 10. 정제값  clean_val
--    단위 표준화 / 타입 분리 / 결측 처리 후 스코어링 입력 직전 상태
--
--    data_state가 공시 결측과 수집·파싱 실패를 구분한다.
--    is_found는 기존 소비자 호환용 컬럼이다.
--    is_cur = true : 동일 (기업, 변수, 연도, 조직단위, record_key) 현행 유효본
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE clean_val (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id    bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    variable_id   bigint NOT NULL REFERENCES variable(id),
    raw_id        bigint REFERENCES raw_val(id) ON DELETE SET NULL,
    boundary_type boundary_t NOT NULL DEFAULT 'consolidated',
    org_unit_id   bigint REFERENCES org_unit(id) ON DELETE SET NULL,
    record_key    varchar(80) NOT NULL DEFAULT '',
    data_year     smallint,
    val_bool      boolean,
    val_num       numeric(24,6),
    val_txt       text,
    val_date      date,
    val_year      smallint,
    val_json      jsonb,
    unit_txt      varchar(40),
    is_found      boolean NOT NULL DEFAULT true,
    data_state    data_state_t NOT NULL DEFAULT 'reported',
    clean_rule    varchar(80),
    conf          conf_t,
    is_cur        boolean NOT NULL DEFAULT true,
    ver_no        integer NOT NULL DEFAULT 1,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_clean_upd
    BEFORE UPDATE ON clean_val
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- 11. 리스트 분해  val_item
--     Scope 3 카테고리별, 국가별, GHG 유형별 등
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE val_item (
    id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    clean_id bigint NOT NULL REFERENCES clean_val(id) ON DELETE CASCADE,
    item_no  integer NOT NULL,
    item_key varchar(80),
    item_txt text,
    item_num numeric(24,6),
    unit_txt varchar(40),
    UNIQUE (clean_id, item_no)
);

-- ─────────────────────────────────────────────────────────────────────
-- 12. 검수 큐  review_q
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE review_q (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id  bigint REFERENCES company(id) ON DELETE CASCADE,
    report_id   bigint REFERENCES report(id) ON DELETE CASCADE,
    variable_id bigint REFERENCES variable(id),
    raw_id      bigint REFERENCES raw_val(id),
    clean_id    bigint REFERENCES clean_val(id),
    issue_type  varchar(20) NOT NULL,
    issue_txt   text NOT NULL,
    is_done     boolean NOT NULL DEFAULT false,
    created_at  timestamptz NOT NULL DEFAULT now(),
    done_at     timestamptz
);

-- ─────────────────────────────────────────────────────────────────────
-- 13. INDEXES
-- ─────────────────────────────────────────────────────────────────────

-- company
CREATE INDEX ix_co_name   ON company (corp_name);
CREATE INDEX ix_co_group  ON company (cers_group);
CREATE INDEX ix_co_mkt    ON company (country, market);

-- taxonomy
CREATE INDEX ix_cat_area  ON category (area_id);
CREATE INDEX ix_var_cat   ON variable (cat_id);
CREATE INDEX ix_var_code  ON variable (code) WHERE is_active;

-- subsidiary / org_unit
CREATE INDEX ix_sub_par   ON subsidiary (parent_id, rpt_year);
CREATE INDEX ix_ou_co     ON org_unit (company_id, unit_type);
CREATE INDEX ix_ou_par    ON org_unit (parent_id);

-- collection
CREATE INDEX ix_coll_co    ON collection_status (company_id, crawled_at DESC);
CREATE INDEX ix_coll_retry ON collection_status (retry_after)
    WHERE crawl_state IN ('failed', 'js_required', 'manual_review');

-- report
CREATE INDEX ix_rpt_co    ON report (company_id, rpt_year);
CREATE INDEX ix_rpt_pref  ON report (company_id, rpt_year) WHERE is_pref;
CREATE INDEX ix_rpt_parse ON report (parsed_at) WHERE parsed_at IS NOT NULL;
CREATE INDEX ix_rpt_pstat ON report (parse_state, company_id);

-- raw_val
CREATE INDEX ix_raw_key   ON raw_val (company_id, variable_id, data_year, record_key);
CREATE INDEX ix_raw_rpt   ON raw_val (report_id, variable_id);
CREATE INDEX ix_raw_ou    ON raw_val (org_unit_id) WHERE org_unit_id IS NOT NULL;
CREATE INDEX ix_raw_state ON raw_val (data_state, company_id);
CREATE UNIQUE INDEX uq_raw_candidate
    ON raw_val (report_id, variable_id, candidate_key)
    WHERE candidate_key <> '';

-- clean_val
CREATE INDEX ix_cv_key    ON clean_val (company_id, variable_id, data_year, record_key);
CREATE INDEX ix_cv_found  ON clean_val (company_id, variable_id)
    WHERE data_state = 'reported' AND is_cur;
CREATE INDEX ix_cv_state  ON clean_val (data_state, company_id) WHERE is_cur;
CREATE INDEX ix_cv_ou     ON clean_val (org_unit_id) WHERE org_unit_id IS NOT NULL;

-- (기업, 변수, 데이터연도, 조직단위, 반복 레코드)당 현행 유효본 1개 보장
-- COALESCE(org_unit_id, 0) : NULL(전사 집계)도 중복 방지
CREATE UNIQUE INDEX uq_clean_cur
    ON clean_val (
        company_id, variable_id, data_year,
        COALESCE(org_unit_id, 0), record_key
    )
    WHERE is_cur;

CREATE INDEX ix_item_cv   ON val_item (clean_id);

-- ─────────────────────────────────────────────────────────────────────
-- 14. VIEW  cur_val — 현재 유효본 + 분류 + 조직단위 결합
-- ─────────────────────────────────────────────────────────────────────

CREATE VIEW cur_val AS
SELECT
    cv.id            AS clean_id,
    co.id            AS company_id,
    co.corp_name,
    co.country,
    co.cers_group,
    cv.data_year,
    cv.boundary_type,
    cv.record_key,
    ou.unit_type     AS org_unit_type,
    ou.unit_name     AS org_unit_name,
    ou.country       AS org_unit_country,
    a.code           AS area_code,
    a.name           AS area_name,
    c.code           AS cat_code,
    c.name           AS cat_name,
    v.code           AS var_code,
    v.name           AS var_name,
    v.val_kind,
    cv.val_bool,
    cv.val_num,
    cv.val_txt,
    cv.val_year,
    cv.val_json,
    cv.unit_txt,
    cv.is_found,
    cv.data_state,
    cv.conf,
    cv.updated_at
FROM  clean_val  cv
JOIN  company    co ON co.id = cv.company_id
JOIN  variable   v  ON v.id  = cv.variable_id
JOIN  category   c  ON c.id  = v.cat_id
JOIN  area       a  ON a.id  = c.area_id
LEFT JOIN org_unit ou ON ou.id = cv.org_unit_id
WHERE cv.is_cur;

COMMIT;
