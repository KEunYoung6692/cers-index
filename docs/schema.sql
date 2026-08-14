-- =====================================================================
-- CERs Index — Core DB Schema
-- PostgreSQL 15+  |  2026-08 (운영 DB public 스키마 기준으로 동기화)
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
--   6. 원문 공시는 canonical disclosure 레이어에 먼저 적재하고,
--      버전 관리되는 disclosure_variable_map을 통해 raw_val로 투영한다.
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
    'gov_data',          -- 정부 공개 데이터 (GIR 명세서 등 — 보고서 외 구조화 소스)
    'disclosure_map'     -- canonical disclosure + versioned DB mapping 투영
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
    code      varchar(40) NOT NULL UNIQUE,  -- 계산/정제 변수 코드(파서 field_id와 분리)
    name      varchar(160) NOT NULL,
    val_kind  val_kind_t NOT NULL,
    is_list   boolean NOT NULL DEFAULT false,
    unit_std  varchar(20),                  -- 표준 단위 (tCO2e, MWh, %)
    scope_txt varchar(120),                 -- 적용 범위 메모
    src_qno   varchar(15),                  -- CDP 질문번호 (추적용, FK 아님)
    sort_no   smallint NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true
);

-- 국가별 원본 섹터 분류체계. 국가 간 동일 코드 충돌을 taxonomy로 분리한다.
CREATE TABLE sector_taxonomy (
    id          smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code        varchar(30) NOT NULL UNIQUE,
    country     char(2),
    name        varchar(120) NOT NULL,
    source_note text,
    is_active   boolean NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_sector_taxonomy_upd
    BEFORE UPDATE ON sector_taxonomy
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

-- 웹에서 지원하는 섹터 표시 언어. fallback_locale은 요청 언어 미등록 시 사용한다.
CREATE TABLE sector_locale (
    locale          varchar(10) PRIMARY KEY,
    fallback_locale varchar(10) REFERENCES sector_locale(locale),
    is_active       boolean NOT NULL DEFAULT true,
    sort_no         smallint NOT NULL DEFAULT 0
);

CREATE TABLE sector (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    taxonomy_id smallint NOT NULL REFERENCES sector_taxonomy(id),
    code        varchar(40),
    source_key  varchar(160) NOT NULL,
    sort_no     smallint NOT NULL DEFAULT 0,
    is_active   boolean NOT NULL DEFAULT true,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (taxonomy_id, source_key)
);

CREATE UNIQUE INDEX uq_sector_taxonomy_code
    ON sector (taxonomy_id, code) WHERE code IS NOT NULL;

CREATE TRIGGER trg_sector_upd
    BEFORE UPDATE ON sector
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

CREATE TABLE sector_i18n (
    sector_id  bigint NOT NULL REFERENCES sector(id) ON DELETE CASCADE,
    locale     varchar(10) NOT NULL REFERENCES sector_locale(locale),
    name       varchar(160) NOT NULL,
    name_source varchar(80) NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (sector_id, locale)
);

CREATE TRIGGER trg_sector_i18n_upd
    BEFORE UPDATE ON sector_i18n
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

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

-- 기업별 섹터 역할 연결. display와 향후 canonical/scoring 역할을 분리한다.
CREATE TABLE company_sector (
    company_id  bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    sector_role varchar(30) NOT NULL
        CHECK (sector_role IN ('display', 'canonical', 'scoring')),
    sector_id   bigint NOT NULL REFERENCES sector(id),
    source_note varchar(120) NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (company_id, sector_role)
);

CREATE TRIGGER trg_company_sector_upd
    BEFORE UPDATE ON company_sector
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

CREATE TABLE batch_run_log (
    id              bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    batch_code      varchar(100) NOT NULL UNIQUE,
    stage           varchar(30) NOT NULL CHECK (stage IN (
        'reference_data', 'data_collection', 'data_parsing',
        'data_preprocessing', 'scoring', 'db_loading', 'maintenance'
    )),
    country         char(2),
    run_mode        varchar(20) NOT NULL CHECK (run_mode IN (
        'init', 'batch', 'resume', 'backfill', 'dry_run'
    )),
    run_state       varchar(20) NOT NULL CHECK (run_state IN (
        'running', 'completed', 'partial', 'failed', 'blocked'
    )),
    started_at      timestamptz NOT NULL DEFAULT now(),
    ended_at        timestamptz,
    input_count     integer NOT NULL DEFAULT 0 CHECK (input_count >= 0),
    processed_count integer NOT NULL DEFAULT 0 CHECK (processed_count >= 0),
    success_count   integer NOT NULL DEFAULT 0 CHECK (success_count >= 0),
    review_count    integer NOT NULL DEFAULT 0 CHECK (review_count >= 0),
    failure_count   integer NOT NULL DEFAULT 0 CHECK (failure_count >= 0),
    config_json     jsonb NOT NULL DEFAULT '{}'::jsonb,
    result_json     jsonb NOT NULL DEFAULT '{}'::jsonb,
    error_text      text,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now(),
    CHECK (ended_at IS NULL OR ended_at >= started_at)
);

CREATE TRIGGER trg_batch_run_log_upd
    BEFORE UPDATE ON batch_run_log
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

CREATE TABLE collection_status (
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    batch_run_id        bigint NOT NULL REFERENCES batch_run_log(id) ON DELETE CASCADE,
    company_id          bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    source_cd           varchar(30) NOT NULL,
    source_state_raw    varchar(40),
    source_ref          text,
    crawl_state         collection_state_t NOT NULL DEFAULT 'pending',
    confirmed_no_report boolean NOT NULL DEFAULT false,
    candidates_found    integer,
    down_count          integer,
    fail_count          integer,
    dart_filings        integer,
    years_json          jsonb,
    verification_method varchar(80),
    duration_sec        numeric(12,3),
    error_text          text,
    crawled_at          timestamptz,
    retry_after         timestamptz,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ck_collection_no_reports
        CHECK (crawl_state <> 'no_reports' OR confirmed_no_report),
    CONSTRAINT uq_collection_run_company_source
        UNIQUE (batch_run_id, company_id, source_cd)
);

CREATE TRIGGER trg_collection_status_upd
    BEFORE UPDATE ON collection_status
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

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
    lang_cd     varchar(20),           -- 'ko' / 'en' / 'bilingual' / 'ja'
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
-- 9. Canonical 공시 필드 사전 + 공시 표준 카탈로그
--    실제로 확인된 표준 요구사항만 적재한다.
--    ref_s1 / ref_s2 같은 개략 문자열로 요구사항 행을 추론하지 않는다.
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE disclosure_field (
    field_id    varchar(20) PRIMARY KEY,      -- GEN-001 형식 canonical 필드 코드
    esg         varchar(8) NOT NULL,          -- E / S / G / GEN
    topic       varchar(40),
    subtopic    varchar(60),
    name_ko     varchar(120) NOT NULL,
    name_en     varchar(160),
    definition  text,
    object_type varchar(24),
    value_type  varchar(40),
    unit_family varchar(24),
    dimensions  jsonb,
    ref_s1      varchar(60),                  -- IFRS S1 참조 (개략 문자열, FK 아님)
    ref_s2      varchar(60),
    ref_cdp     varchar(60),
    is_catchall boolean NOT NULL DEFAULT false
);

CREATE TABLE disclosure_standard (
    id                 bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    standard_code      varchar(32) NOT NULL,        -- IFRS_S1 / IFRS_S2 / GRI 등
    edition_key        varchar(40) NOT NULL DEFAULT 'unspecified',
    name               varchar(160) NOT NULL,
    version_label      varchar(80),
    issued_on          date,
    effective_on       date,
    catalog_state      varchar(16) NOT NULL DEFAULT 'pending'
        CHECK (catalog_state IN ('pending', 'partial', 'complete')),
    catalog_source_ref text,
    active             boolean NOT NULL DEFAULT true,
    created_at         timestamptz NOT NULL DEFAULT now(),
    updated_at         timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT uq_disclosure_standard_edition UNIQUE (standard_code, edition_key)
);

CREATE TRIGGER trg_disclosure_standard_upd
    BEFORE UPDATE ON disclosure_standard
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

CREATE TABLE disclosure_requirement (
    id                    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    standard_id           bigint NOT NULL REFERENCES disclosure_standard(id) ON DELETE CASCADE,
    requirement_key       varchar(100) NOT NULL,
    paragraph_ref         varchar(120),
    parent_requirement_id bigint REFERENCES disclosure_requirement(id) ON DELETE SET NULL,
    requirement_kind      varchar(40),
    source_ref            text,
    active                boolean NOT NULL DEFAULT true,
    created_at            timestamptz NOT NULL DEFAULT now(),
    updated_at            timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ck_disclosure_requirement_not_self_parent
        CHECK (parent_requirement_id IS NULL OR parent_requirement_id <> id),
    CONSTRAINT uq_disclosure_requirement_key UNIQUE (standard_id, requirement_key)
);

CREATE INDEX ix_disclosure_requirement_standard
    ON disclosure_requirement (standard_id, active, paragraph_ref);

CREATE TRIGGER trg_disclosure_requirement_upd
    BEFORE UPDATE ON disclosure_requirement
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

CREATE TABLE disclosure_requirement_translation (
    requirement_id   bigint NOT NULL REFERENCES disclosure_requirement(id) ON DELETE CASCADE,
    lang_cd          varchar(12) NOT NULL,
    title            text,
    requirement_text text,
    source_ref       text,
    created_at       timestamptz NOT NULL DEFAULT now(),
    updated_at       timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (requirement_id, lang_cd),
    CHECK (title IS NOT NULL OR requirement_text IS NOT NULL)
);

CREATE TRIGGER trg_disclosure_requirement_translation_upd
    BEFORE UPDATE ON disclosure_requirement_translation
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

-- 표준 요구사항 ↔ canonical field 다대다 매핑. 검토를 통과한 행만 confirmed.
CREATE TABLE disclosure_field_requirement (
    requirement_id bigint NOT NULL REFERENCES disclosure_requirement(id) ON DELETE CASCADE,
    field_id       varchar(20) NOT NULL REFERENCES disclosure_field(field_id) ON DELETE CASCADE,
    mapping_role   varchar(16) NOT NULL
        CHECK (mapping_role IN ('direct', 'supporting', 'catchall')),
    mapping_state  varchar(20) NOT NULL DEFAULT 'review_required'
        CHECK (mapping_state IN ('review_required', 'confirmed', 'rejected')),
    source_ref     text,
    notes          text,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (requirement_id, field_id, mapping_role)
);

CREATE INDEX ix_disclosure_field_requirement_field
    ON disclosure_field_requirement (field_id, mapping_state);

CREATE TRIGGER trg_disclosure_field_requirement_upd
    BEFORE UPDATE ON disclosure_field_requirement
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- 10. Canonical 공시 관측값  disclosure
--     추출기는 보고서 원문을 field_id 단위 canonical 관측으로 적재한다.
--     변수(variable) 투영은 disclosure_variable_map이 담당한다.
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE disclosure (
    id                        bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id                bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    report_id                 bigint REFERENCES report(id) ON DELETE SET NULL,
    field_id                  varchar(20) NOT NULL REFERENCES disclosure_field(field_id),
    -- 원문 그대로 (source_*)
    source_label_raw          text,
    source_value_raw          text,
    source_unit_raw           varchar(80),
    source_period_raw         varchar(80),
    source_scope_raw          varchar(120),
    source_object_type        varchar(16),
    source_table_title        text,
    source_row_path           text,
    source_col_path           text,
    -- 정규화 값
    value_numeric             numeric(28,6),
    value_text                text,
    value_boolean             boolean,
    unit_normalized           varchar(40),
    data_year                 smallint,
    base_year                 smallint,
    target_year               smallint,
    dimensions                text,
    value_chain_scope         varchar(24),
    is_estimated              boolean NOT NULL DEFAULT false,
    is_restated               boolean NOT NULL DEFAULT false,
    incident_type             varchar(60),
    incident_status           varchar(30),
    page_no                   integer,
    evidence_text             text,
    confidence                conf_t,
    unmapped_reason           text,
    extraction_model          varchar(40),
    created_at                timestamptz NOT NULL DEFAULT now(),
    -- 문서 위치 및 원문 맥락
    company_name_raw          text,
    report_title_raw          text,
    source_language           varchar(8),
    printed_page              varchar(40),
    section_raw               text,
    subsection_raw            text,
    subsubsection_raw         text,
    source_object_title       text,
    source_footnote_raw       text,
    table_id                  varchar(160),
    figure_id                 varchar(160),
    list_order                integer,
    period_start              date,
    period_end                date,
    -- 차원 (dimensions_json이 정본, *_dimension 컬럼은 조회 편의)
    dimensions_json           jsonb NOT NULL DEFAULT '{}'::jsonb,
    entity_scope              text,
    site_scope                text,
    geography_scope           text,
    workforce_scope           text,
    gender_dimension          text,
    age_dimension             text,
    job_level_dimension       text,
    employment_type_dimension text,
    energy_source_dimension   text,
    ghg_scope_dimension       varchar(24),
    water_source_dimension    text,
    waste_type_dimension      text,
    treatment_method_dimension text,
    incident_date             date,
    currency                  varchar(24),
    methodology_raw           text,
    data_source_raw           text,
    -- 검증(assurance)
    is_assured                boolean,
    assurance_provider        text,
    assurance_level           text,
    assurance_standard        text,
    boundary_type             boundary_t,
    -- 객체 식별 및 중복 관리
    object_key                varchar(200),
    parent_object_key         varchar(200),
    related_object_keys       jsonb NOT NULL DEFAULT '[]'::jsonb,
    duplicate_group_id        varchar(120),
    duplicate_relation        varchar(40),
    retain_source_record      boolean NOT NULL DEFAULT true,
    -- 검수 및 검증 상태
    review_status             varchar(24) NOT NULL DEFAULT 'not_reviewed'
        CHECK (review_status IN ('not_reviewed', 'reviewed', 'revision_required', 'rejected')),
    validation_state          data_state_t NOT NULL DEFAULT 'needs_review',
    validation_issues         jsonb NOT NULL DEFAULT '[]'::jsonb,
    extraction_batch_run_id   bigint REFERENCES batch_run_log(id),
    extracted_at              timestamptz,
    reviewer                  text,
    reviewed_at               timestamptz,
    inventory_source_id       varchar(40),  -- 배치 내 원본 인벤토리 셀 id (사이드카 조인용)
    CONSTRAINT ck_disclosure_dimensions_json_object
        CHECK (jsonb_typeof(dimensions_json) = 'object'),
    CONSTRAINT ck_disclosure_related_object_keys_array
        CHECK (jsonb_typeof(related_object_keys) = 'array'),
    CONSTRAINT ck_disclosure_validation_issues_array
        CHECK (jsonb_typeof(validation_issues) = 'array')
);

CREATE INDEX ix_disclosure_company   ON disclosure (company_id);
CREATE INDEX ix_disclosure_report    ON disclosure (report_id);
CREATE INDEX ix_disclosure_field     ON disclosure (field_id);
CREATE INDEX ix_disclosure_field_yr  ON disclosure (company_id, field_id, data_year);
CREATE INDEX ix_disclosure_esg       ON disclosure (field_id) WHERE field_id LIKE 'GEN-%';
CREATE INDEX ix_disclosure_dimensions_json ON disclosure USING gin (dimensions_json);
CREATE INDEX ix_disclosure_object_key
    ON disclosure (report_id, object_key) WHERE object_key IS NOT NULL;
CREATE INDEX ix_disclosure_validation
    ON disclosure (validation_state, company_id, report_id);

-- 동일 (보고서, 필드, 객체, 연도) + 원문 지문 조합의 중복 적재 방지
CREATE UNIQUE INDEX uq_disclosure_cur ON disclosure (
    report_id,
    field_id,
    COALESCE(object_key, ''),
    COALESCE(data_year::integer, 0),
    md5(
        COALESCE(dimensions_json::text, '{}')  || '|' ||
        COALESCE(source_scope_raw, '')         || '|' ||
        COALESCE(source_object_title, '')      || '|' ||
        COALESCE(source_label_raw, '')         || '|' ||
        COALESCE(source_value_raw, '')         || '|' ||
        COALESCE(value_text, '')               || '|' ||
        COALESCE(value_numeric::text, '')      || '|' ||
        COALESCE(source_table_title, '')       || '|' ||
        COALESCE(source_row_path, '')          || '|' ||
        COALESCE(source_col_path, '')          || '|' ||
        COALESCE(page_no::text, '')
    )
);

CREATE UNIQUE INDEX uq_disclosure_inventory_source
    ON disclosure (report_id, extraction_batch_run_id, inventory_source_id)
    WHERE inventory_source_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────
-- 11. disclosure → variable 투영 매핑 (버전 관리)
--     active/retired 세트는 불변이다. 파서와 점수 수식은 이 관계를
--     코드에 내장하지 않고 반드시 이 테이블을 조회한다.
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE disclosure_mapping_set (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code          varchar(60) NOT NULL,
    version_no    integer NOT NULL CHECK (version_no > 0),
    mapping_state varchar(16) NOT NULL DEFAULT 'draft'
        CHECK (mapping_state IN ('draft', 'active', 'retired')),
    source_ref    text NOT NULL,
    source_hash   varchar(64)
        CHECK (source_hash IS NULL OR source_hash ~ '^[0-9a-fA-F]{64}$'),
    notes         text,
    activated_at  timestamptz,
    retired_at    timestamptz,
    created_at    timestamptz NOT NULL DEFAULT now(),
    updated_at    timestamptz NOT NULL DEFAULT now(),
    UNIQUE (code, version_no),
    CHECK (mapping_state <> 'active' OR activated_at IS NOT NULL)
);

-- active 세트는 전체에서 1개만 존재한다.
CREATE UNIQUE INDEX uq_disclosure_mapping_set_active
    ON disclosure_mapping_set (mapping_state) WHERE mapping_state = 'active';

CREATE TABLE disclosure_variable_map (
    id                  bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    mapping_set_id      bigint NOT NULL REFERENCES disclosure_mapping_set(id) ON DELETE CASCADE,
    field_id            varchar(20) NOT NULL REFERENCES disclosure_field(field_id),
    variable_id         bigint NOT NULL REFERENCES variable(id),
    source_value_path   varchar(40) NOT NULL CHECK (source_value_path IN (
        'value_numeric', 'value_text', 'value_boolean', 'data_year', 'base_year',
        'target_year', 'currency', 'methodology_raw', 'assurance_provider',
        'assurance_level', 'assurance_standard', 'source_value_raw', 'source_scope_raw'
    )),
    transform_code      varchar(32) NOT NULL DEFAULT 'identity'
        CHECK (transform_code IN ('identity', 'reported_presence_true', 'constant')),
    transform_args      jsonb NOT NULL DEFAULT '{}'::jsonb
        CHECK (jsonb_typeof(transform_args) = 'object'),
    selector_json       jsonb NOT NULL DEFAULT '{}'::jsonb
        CHECK (jsonb_typeof(selector_json) = 'object'),
    record_key_strategy varchar(32) NOT NULL DEFAULT 'empty' CHECK (record_key_strategy IN (
        'empty', 'object_key', 'object_key_required', 'dimensions'
    )),
    mapping_role        varchar(20) NOT NULL DEFAULT 'direct'
        CHECK (mapping_role IN ('direct', 'derived_projection')),
    mapping_state       varchar(20) NOT NULL DEFAULT 'review_required'
        CHECK (mapping_state IN ('review_required', 'confirmed', 'rejected')),
    priority            smallint NOT NULL DEFAULT 100,
    source_ref          text NOT NULL,
    notes               text,
    created_at          timestamptz NOT NULL DEFAULT now(),
    updated_at          timestamptz NOT NULL DEFAULT now(),
    UNIQUE (mapping_set_id, field_id, variable_id, source_value_path,
            transform_code, selector_json),
    CHECK (transform_code <> 'constant' OR transform_args ? 'value')
);

CREATE INDEX ix_disclosure_variable_map_field
    ON disclosure_variable_map (field_id, mapping_state);
CREATE INDEX ix_disclosure_variable_map_variable
    ON disclosure_variable_map (variable_id, mapping_state);

-- draft 세트만 수정 가능. active는 retired 전이만, retired는 완전 불변.
CREATE OR REPLACE FUNCTION _guard_disclosure_mapping_set()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        IF OLD.mapping_state <> 'draft' THEN
            RAISE EXCEPTION 'active/retired disclosure mapping set is immutable: %@%',
                OLD.code, OLD.version_no;
        END IF;
        RETURN OLD;
    END IF;
    IF OLD.mapping_state = 'draft' THEN
        RETURN NEW;
    END IF;
    IF to_jsonb(NEW) - 'updated_at' = to_jsonb(OLD) - 'updated_at' THEN
        RETURN NEW;
    END IF;
    IF OLD.mapping_state = 'active' AND NEW.mapping_state = 'retired'
       AND (to_jsonb(NEW) - ARRAY['mapping_state', 'retired_at', 'updated_at'])
           = (to_jsonb(OLD) - ARRAY['mapping_state', 'retired_at', 'updated_at']) THEN
        RETURN NEW;
    END IF;
    RAISE EXCEPTION 'active/retired disclosure mapping set is immutable: %@%',
        OLD.code, OLD.version_no;
END;
$$;

CREATE OR REPLACE FUNCTION _guard_disclosure_variable_map()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    set_state varchar(16);
BEGIN
    IF TG_OP = 'INSERT' THEN
        SELECT mapping_state INTO set_state
        FROM disclosure_mapping_set WHERE id = NEW.mapping_set_id;
        IF set_state <> 'draft' THEN
            RAISE EXCEPTION 'mapping rows can only be inserted into a draft set';
        END IF;
        RETURN NEW;
    END IF;

    SELECT mapping_state INTO set_state
    FROM disclosure_mapping_set WHERE id = OLD.mapping_set_id;
    IF set_state = 'draft' THEN
        IF TG_OP = 'DELETE' THEN
            RETURN OLD;
        END IF;
        RETURN NEW;
    END IF;
    IF TG_OP = 'UPDATE'
       AND to_jsonb(NEW) - 'updated_at' = to_jsonb(OLD) - 'updated_at' THEN
        RETURN NEW;
    END IF;
    RAISE EXCEPTION 'mapping rows in an active/retired set are immutable';
END;
$$;

CREATE TRIGGER trg_disclosure_mapping_set_guard
    BEFORE DELETE OR UPDATE ON disclosure_mapping_set
    FOR EACH ROW EXECUTE FUNCTION _guard_disclosure_mapping_set();

CREATE TRIGGER trg_disclosure_mapping_set_upd
    BEFORE UPDATE ON disclosure_mapping_set
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

CREATE TRIGGER trg_disclosure_variable_map_guard
    BEFORE INSERT OR DELETE OR UPDATE ON disclosure_variable_map
    FOR EACH ROW EXECUTE FUNCTION _guard_disclosure_variable_map();

CREATE TRIGGER trg_disclosure_variable_map_upd
    BEFORE UPDATE ON disclosure_variable_map
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- 12. 추출 원본값  raw_val
--    파서가 추출한 값 그대로. 정제 전.
--    disclosure_id / disclosure_variable_map_id가 있으면
--    canonical disclosure에서 투영된 행이다 (method = 'disclosure_map').
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE raw_val (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id    bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    report_id     bigint REFERENCES report(id) ON DELETE SET NULL,
    variable_id   bigint NOT NULL REFERENCES variable(id),
    boundary_type boundary_t NOT NULL DEFAULT 'unknown',
    org_unit_id   bigint REFERENCES org_unit(id) ON DELETE SET NULL,
    record_key    varchar(80) NOT NULL DEFAULT '',
    candidate_key varchar(64) NOT NULL DEFAULT '',
    data_year     smallint,
    raw_text      text,
    num_val       numeric(24,6),
    bool_val      boolean,
    year_val      smallint,
    date_val      date,
    json_val      jsonb,
    currency      varchar(24),
    unit_raw      varchar(200),
    page_no       integer,
    evid_text     text,
    method        method_t,
    conf          conf_t,
    data_state    data_state_t NOT NULL DEFAULT 'reported',
    note_txt      text,
    -- canonical disclosure 투영 출처 (둘 다 NULL이면 파서 직접 추출)
    disclosure_id              bigint REFERENCES disclosure(id) ON DELETE SET NULL,
    disclosure_variable_map_id bigint REFERENCES disclosure_variable_map(id) ON DELETE SET NULL,
    created_at    timestamptz NOT NULL DEFAULT now()
);

-- ─────────────────────────────────────────────────────────────────────
-- 13. 정제값  clean_val
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
-- 14. 리스트 분해  val_item
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
-- 15. 검수 큐  review_q
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
-- 16. INDEXES
--     (disclosure 계열 인덱스는 각 테이블 정의 옆에 둔다)
-- ─────────────────────────────────────────────────────────────────────

-- company
CREATE INDEX ix_co_name   ON company (corp_name);
CREATE INDEX ix_co_group  ON company (cers_group);
CREATE INDEX ix_co_mkt    ON company (country, market);

-- sector
CREATE INDEX ix_sector_taxonomy ON sector (taxonomy_id, sort_no);
CREATE INDEX ix_company_sector  ON company_sector (sector_id, sector_role);

-- taxonomy
CREATE INDEX ix_cat_area  ON category (area_id);
CREATE INDEX ix_var_cat   ON variable (cat_id);
CREATE INDEX ix_var_code  ON variable (code) WHERE is_active;

-- subsidiary / org_unit
CREATE INDEX ix_sub_par   ON subsidiary (parent_id, rpt_year);
CREATE INDEX ix_ou_co     ON org_unit (company_id, unit_type);
CREATE INDEX ix_ou_par    ON org_unit (parent_id);

-- collection
CREATE INDEX ix_batch_run_state ON batch_run_log (stage, run_state, started_at DESC);
CREATE INDEX ix_coll_co    ON collection_status (company_id, crawled_at DESC);
CREATE INDEX ix_coll_batch ON collection_status (batch_run_id, crawl_state);
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
CREATE INDEX ix_raw_disclosure
    ON raw_val (disclosure_id) WHERE disclosure_id IS NOT NULL;
-- 동일 (disclosure 관측, 매핑 행) 조합의 중복 투영 방지
CREATE UNIQUE INDEX uq_raw_disclosure_projection
    ON raw_val (disclosure_id, disclosure_variable_map_id)
    WHERE disclosure_id IS NOT NULL AND disclosure_variable_map_id IS NOT NULL;

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

CREATE VIEW collection_status_latest AS
SELECT DISTINCT ON (company_id, source_cd)
    id, batch_run_id, company_id, source_cd, source_state_raw, source_ref,
    crawl_state, confirmed_no_report, candidates_found, down_count,
    fail_count, dart_filings, years_json, verification_method, duration_sec,
    error_text, crawled_at, retry_after, created_at, updated_at
FROM collection_status
ORDER BY company_id, source_cd, crawled_at DESC NULLS LAST, id DESC;

-- ─────────────────────────────────────────────────────────────────────
-- 17. VIEW  cur_val — 현재 유효본 + 분류 + 조직단위 결합
--     주의: 운영 DB의 cur_val은 clean_val에 record_key / data_state가
--     추가되기 전 정의를 그대로 유지하고 있어 두 컬럼을 노출하지 않는다.
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
    cv.conf,
    cv.updated_at
FROM  clean_val  cv
JOIN  company    co ON co.id = cv.company_id
JOIN  variable   v  ON v.id  = cv.variable_id
JOIN  category   c  ON c.id  = v.cat_id
JOIN  area       a  ON a.id  = c.area_id
LEFT JOIN org_unit ou ON ou.id = cv.org_unit_id
WHERE cv.is_cur;

-- ─────────────────────────────────────────────────────────────────────
-- 18. VIEW — 다국어 섹터 카탈로그 및 웹 기업 목록
-- ─────────────────────────────────────────────────────────────────────

CREATE VIEW sector_catalog AS
SELECT
    s.id AS sector_id,
    st.code AS taxonomy_code,
    st.country AS taxonomy_country,
    s.code AS sector_code,
    s.source_key,
    jsonb_object_agg(si.locale, si.name ORDER BY sl.sort_no) AS names
FROM sector s
JOIN sector_taxonomy st ON st.id = s.taxonomy_id
JOIN sector_i18n si ON si.sector_id = s.id
JOIN sector_locale sl ON sl.locale = si.locale AND sl.is_active
WHERE s.is_active AND st.is_active
GROUP BY s.id, st.code, st.country, s.code, s.source_key;

-- 결과가 0행이어야 활성 언어 번역이 완전하다.
CREATE VIEW sector_translation_gap AS
SELECT
    s.id AS sector_id,
    st.code AS taxonomy_code,
    s.code AS sector_code,
    s.source_key,
    sl.locale
FROM sector s
JOIN sector_taxonomy st ON st.id = s.taxonomy_id
CROSS JOIN sector_locale sl
LEFT JOIN sector_i18n si ON si.sector_id = s.id AND si.locale = sl.locale
WHERE s.is_active AND st.is_active AND sl.is_active AND si.sector_id IS NULL;

CREATE VIEW companies AS
SELECT
    co.id AS company_id,
    co.corp_name AS company_name_kr,
    co.corp_en AS company_name_en,
    co.stock_code,
    co.country AS country_code,
    co.market AS market_code,
    sc.sector_code::varchar(20) AS sector_code,
    co.ind_code AS industry_code,
    CASE WHEN co.is_active THEN 'active'::text ELSE 'inactive'::text END AS status,
    sc.sector_id,
    sc.taxonomy_code AS sector_taxonomy_code,
    sc.names AS sector_names
FROM company co
LEFT JOIN company_sector cs
    ON cs.company_id = co.id AND cs.sector_role = 'display'
LEFT JOIN sector_catalog sc ON sc.sector_id = cs.sector_id;

-- ─────────────────────────────────────────────────────────────────────
-- 19. VIEW — 공시 표준 커버리지 점검
--     투영 준비도 view(disclosure_projection_gap,
--     disclosure_projection_readiness)는 score_method/score_var를
--     참조하므로 schema_scoring.sql에서 정의한다.
-- ─────────────────────────────────────────────────────────────────────

-- 결과가 0행이어야 활성 표준의 direct 매핑이 완전하다.
CREATE VIEW disclosure_requirement_gap AS
SELECT
    requirement.id AS requirement_id,
    standard.standard_code,
    standard.edition_key,
    requirement.requirement_key,
    requirement.paragraph_ref,
    requirement.requirement_kind,
    requirement.source_ref
FROM disclosure_requirement requirement
JOIN disclosure_standard standard ON standard.id = requirement.standard_id
WHERE requirement.active
  AND standard.active
  AND NOT EXISTS (
      SELECT 1 FROM disclosure_field_requirement mapping
      WHERE mapping.requirement_id = requirement.id
        AND mapping.mapping_role = 'direct'
        AND mapping.mapping_state = 'confirmed'
  );

-- coverage_ready = 카탈로그가 complete이고 모든 요구사항에 confirmed direct 매핑 존재
CREATE VIEW disclosure_standard_readiness AS
SELECT
    standard.id AS standard_id,
    standard.standard_code,
    standard.edition_key,
    standard.name,
    standard.catalog_state,
    COALESCE(stats.requirement_count, 0)::integer AS requirement_count,
    COALESCE(stats.confirmed_direct_count, 0)::integer AS confirmed_direct_count,
    (COALESCE(stats.requirement_count, 0)
     - COALESCE(stats.confirmed_direct_count, 0))::integer AS gap_count,
    standard.catalog_state = 'complete'
      AND COALESCE(stats.requirement_count, 0) > 0
      AND COALESCE(stats.requirement_count, 0)
          = COALESCE(stats.confirmed_direct_count, 0) AS coverage_ready
FROM disclosure_standard standard
LEFT JOIN LATERAL (
    SELECT
        count(*) AS requirement_count,
        count(*) FILTER (WHERE EXISTS (
            SELECT 1 FROM disclosure_field_requirement mapping
            WHERE mapping.requirement_id = requirement.id
              AND mapping.mapping_role = 'direct'
              AND mapping.mapping_state = 'confirmed'
        )) AS confirmed_direct_count
    FROM disclosure_requirement requirement
    WHERE requirement.standard_id = standard.id AND requirement.active
) stats ON true
WHERE standard.active;

COMMIT;
