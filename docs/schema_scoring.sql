-- =====================================================================
-- CERs Index — Scoring DB Schema
-- PostgreSQL 15+  |  2026-08 (운영 DB public 스키마 기준으로 생성)
--
-- 선행: schema.sql (company, clean_val, variable, _set_updated_at 등)
-- seed: seeds/scoring.sql, seeds/scoring_inputs.sql,
--       seeds/scoring_0714_draft.sql
--
-- 설계 원칙
--   1. 방법론(score_method)은 불변 버전이다. draft만 수정 가능하고
--      active는 retired 전이만, retired는 완전 불변이다 (guard 트리거).
--   2. 모든 정의 테이블(kpi, score_var, score_elem, weight_*)은
--      소속 방법론이 draft일 때만 변경할 수 있다.
--   3. 모든 점수(var_score, kpi_score, final_score)는 run_id에 귀속되며
--      재산출은 새 score_run을 만든다. 기존 run은 덮어쓰지 않는다.
--   4. 점수 소유자는 batch F05다. 프론트는 읽기만 한다.
--
-- 주의: 점수 산출 로직은 이 파일이 아니라 docs/LOGIC/ 및 batch F05가
--       정의한다. 이 파일은 저장 구조만 기술한다.
-- =====================================================================

BEGIN;

-- ─────────────────────────────────────────────────────────────────────
-- 1. ENUM TYPES
-- ─────────────────────────────────────────────────────────────────────

-- 방법론 버전 상태. active는 동시에 여러 개 존재할 수 있으나
-- 운영 산출은 effective 기간으로 결정한다.
CREATE TYPE method_stat_t AS ENUM ('draft', 'active', 'retired');

-- 변수 적용 대상 집합
CREATE TYPE apply_scope_t AS ENUM (
    'common',          -- 전체 기업
    'target_holder',   -- 감축목표 보유 기업
    'scope3_rel',      -- Scope 3 관련 기업
    'netzero_holder',  -- 넷제로 선언 기업
    'finance'          -- 금융업
);

-- 기업별 변수 적용 여부. not_applicable이면 score = NULL이다.
CREATE TYPE apply_stat_t AS ENUM ('applicable', 'not_applicable', 'unknown');

-- 데이터 충족도. 공시 결측과 파이프라인 실패를 구분한다.
CREATE TYPE miss_stat_t AS ENUM (
    'complete', 'partial', 'missing', 'not_reported',
    'collection_failed', 'parse_failed', 'external_failed', 'needs_review'
);

-- 하위요소·변수 결합 연산
CREATE TYPE combine_op_t AS ENUM (
    'weighted_sum', 'product', 'gated_weighted', 'threshold',
    'cov_weighted_mean', 'penalty', 'custom', 'ratio', 'checklist',
    'ordinal', 'trajectory', 'weighted_coverage', 'time_series'
);

-- 하위요소 역할
CREATE TYPE elem_role_t AS ENUM (
    'input',     -- 일반 입력
    'gate',      -- 0이면 변수 전체 0
    'penalty',   -- 차감
    'fallback',  -- 대체 입력
    'factor'     -- 곱 인자
);

-- 스펙 확정 상태. unconfirmed는 스코어링 엔진에서 경고를 발생시킨다.
CREATE TYPE spec_stat_t AS ENUM ('confirmed', 'unconfirmed', 'derived', 'tbd');

CREATE TYPE run_stat_t AS ENUM ('running', 'done', 'failed', 'cancelled');

-- placeholder = 배선 검증용. 실사용 불가.
CREATE TYPE weight_stat_t AS ENUM ('placeholder', 'draft', 'active', 'retired');

-- ─────────────────────────────────────────────────────────────────────
-- 2. 방법론 버전  score_method
--    최신 문서 상태와 운영 활성 상태를 분리한다.
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE score_method (
    id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code           varchar(40) NOT NULL UNIQUE,
    name           varchar(120) NOT NULL,
    status         method_stat_t NOT NULL DEFAULT 'draft',
    parent_id      bigint REFERENCES score_method(id),
    effective_from date,
    effective_to   date,
    src_doc        varchar(200),
    src_hash       varchar(64),   -- 근거 방법론 문서 SHA-256 (변경 감지·재현용)
    config_json    jsonb NOT NULL DEFAULT '{}'::jsonb,
    activated_at   timestamptz,
    retired_at     timestamptz,
    created_at     timestamptz NOT NULL DEFAULT now(),
    updated_at     timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT ck_method_active
        CHECK (status = 'draft' OR activated_at IS NOT NULL),
    CONSTRAINT ck_method_dates
        CHECK (effective_to IS NULL OR effective_from IS NULL
               OR effective_to >= effective_from),
    CONSTRAINT ck_method_hash
        CHECK (src_hash IS NULL OR src_hash ~ '^[0-9a-fA-F]{64}$'),
    CONSTRAINT ck_method_parent
        CHECK (parent_id IS NULL OR parent_id <> id)
);

CREATE INDEX ix_method_status ON score_method (status, effective_from);

-- draft만 자유 수정. active → retired 전이만 허용, 그 외는 불변.
CREATE OR REPLACE FUNCTION _guard_score_method()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        IF OLD.status <> 'draft' THEN
            RAISE EXCEPTION 'active/retired score_method % is immutable', OLD.code;
        END IF;
        RETURN OLD;
    END IF;
    IF OLD.status = 'draft' THEN
        RETURN NEW;
    END IF;
    IF OLD.status = 'active'
       AND NEW.status = 'retired'
       AND (to_jsonb(NEW) - ARRAY['status', 'retired_at', 'updated_at'])
           = (to_jsonb(OLD) - ARRAY['status', 'retired_at', 'updated_at']) THEN
        RETURN NEW;
    END IF;
    RAISE EXCEPTION 'active/retired score_method % is immutable', OLD.code;
END;
$$;

-- method_id를 직접 가진 정의 테이블(kpi, score_var, score_const,
-- weight_set, score_benchmark)용 가드.
CREATE OR REPLACE FUNCTION _guard_method_def()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    old_stat method_stat_t;
    new_stat method_stat_t;
BEGIN
    IF TG_OP <> 'INSERT' THEN
        SELECT status INTO old_stat FROM score_method WHERE id = OLD.method_id;
        IF old_stat IS DISTINCT FROM 'draft'::method_stat_t THEN
            RAISE EXCEPTION 'definitions for score_method id % are immutable', OLD.method_id;
        END IF;
    END IF;
    IF TG_OP <> 'DELETE' THEN
        SELECT status INTO new_stat FROM score_method WHERE id = NEW.method_id;
        IF new_stat IS DISTINCT FROM 'draft'::method_stat_t THEN
            RAISE EXCEPTION 'definitions for score_method id % are immutable', NEW.method_id;
        END IF;
        RETURN NEW;
    END IF;
    RETURN OLD;
END;
$$;

-- score_var를 경유해 방법론에 귀속되는 하위 정의 테이블용 가드.
CREATE OR REPLACE FUNCTION _guard_var_def()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    old_stat method_stat_t;
    new_stat method_stat_t;
BEGIN
    IF TG_OP <> 'INSERT' THEN
        SELECT sm.status INTO old_stat
        FROM score_var sv JOIN score_method sm ON sm.id = sv.method_id
        WHERE sv.id = OLD.var_id;
        IF old_stat IS DISTINCT FROM 'draft'::method_stat_t THEN
            RAISE EXCEPTION 'variable definitions for active/retired method are immutable';
        END IF;
    END IF;
    IF TG_OP <> 'DELETE' THEN
        SELECT sm.status INTO new_stat
        FROM score_var sv JOIN score_method sm ON sm.id = sv.method_id
        WHERE sv.id = NEW.var_id;
        IF new_stat IS DISTINCT FROM 'draft'::method_stat_t THEN
            RAISE EXCEPTION 'variable definitions for active/retired method are immutable';
        END IF;
        RETURN NEW;
    END IF;
    RETURN OLD;
END;
$$;

CREATE TRIGGER trg_method_guard
    BEFORE DELETE OR UPDATE ON score_method
    FOR EACH ROW EXECUTE FUNCTION _guard_score_method();

CREATE TRIGGER trg_method_upd
    BEFORE UPDATE ON score_method
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

-- ─────────────────────────────────────────────────────────────────────
-- 3. 방법론 정의  kpi → score_var → score_elem
--    seed: docs/seeds/scoring.sql
-- ─────────────────────────────────────────────────────────────────────

-- CERs Index v2 KPI 최상위 분류 (KPI1 실질 탄소감축 성과 / KPI2 목표·이행 /
-- KPI3 자본배분 / KPI4 데이터 신뢰성)
CREATE TABLE kpi (
    id        smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    method_id bigint NOT NULL,
    code      varchar(12) NOT NULL,      -- KPI1 / KPI2 / KPI3 / KPI4
    name      varchar(120) NOT NULL,
    sort_no   smallint NOT NULL DEFAULT 0,
    is_active boolean NOT NULL DEFAULT true,
    CONSTRAINT fk_kpi_method FOREIGN KEY (method_id) REFERENCES score_method(id),
    CONSTRAINT uq_kpi_method_code UNIQUE (method_id, code),
    -- score_var가 (method_id, kpi_id)로 참조하기 위한 복합 UNIQUE
    CONSTRAINT uq_kpi_method_id UNIQUE (method_id, id)
);

CREATE INDEX ix_kpi_method ON kpi (method_id, sort_no);

CREATE TRIGGER trg_kpi_method_guard
    BEFORE INSERT OR DELETE OR UPDATE ON kpi
    FOR EACH ROW EXECUTE FUNCTION _guard_method_def();

-- 스코어링 변수 정의 (v2 활성 12개: V1·V2, W1·W2, C1~C4, A1~A4).
-- 각 변수는 0~100점. 제거된 구 변수는 is_active=false로 보존한다.
CREATE TABLE score_var (
    id          smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    method_id   bigint NOT NULL,
    kpi_id      smallint NOT NULL,
    code        varchar(8) NOT NULL,       -- V1·V2 / W1·W2 / C1~C4 / A1~A4
    name        varchar(200) NOT NULL,
    apply_scope apply_scope_t NOT NULL DEFAULT 'common',
    combine_op  combine_op_t NOT NULL,
    is_gated    boolean NOT NULL DEFAULT false,  -- gate 요소가 0이면 변수 전체 0
    score_min   numeric,
    score_max   numeric,
    clamp_score boolean NOT NULL DEFAULT false,  -- true일 때만 min/max로 절사
    formula_txt text,                            -- 스펙 산식 원문 요약
    src_origin  varchar(12),                     -- 구 버전 변수 ID (히스토리 추적)
    spec_stat   spec_stat_t NOT NULL DEFAULT 'confirmed',
    in_index    boolean NOT NULL DEFAULT false,  -- 최종 집계 포함 플래그
    sort_no     smallint NOT NULL DEFAULT 0,
    is_active   boolean NOT NULL DEFAULT true,
    updated_at  timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_score_var_method FOREIGN KEY (method_id) REFERENCES score_method(id),
    CONSTRAINT fk_score_var_method_kpi
        FOREIGN KEY (method_id, kpi_id) REFERENCES kpi(method_id, id),
    CONSTRAINT uq_score_var_method_code UNIQUE (method_id, code),
    CONSTRAINT ck_score_var_bounds
        CHECK (score_min IS NULL OR score_max IS NULL OR score_min <= score_max),
    CONSTRAINT ck_score_var_clamp
        CHECK (NOT clamp_score OR score_min IS NOT NULL OR score_max IS NOT NULL),
    -- 초안(C5/R4 등) 변수는 최종 집계에 들어갈 수 없다
    CONSTRAINT ck_score_var_index
        CHECK (NOT in_index OR (is_active AND spec_stat = 'confirmed'))
);

CREATE INDEX ix_scvar_kpi        ON score_var (kpi_id);
CREATE INDEX ix_scvar_method_kpi ON score_var (method_id, kpi_id);

CREATE TRIGGER trg_scorevar_method_guard
    BEFORE INSERT OR DELETE OR UPDATE ON score_var
    FOR EACH ROW EXECUTE FUNCTION _guard_method_def();

CREATE TRIGGER trg_scorevar_upd
    BEFORE UPDATE ON score_var
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

-- 변수가 요구하는 입력 변수(variable.code) 계약.
-- disclosure_projection_gap이 이 목록을 매핑 커버리지와 대조한다.
CREATE TABLE score_var_input (
    id             bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    var_id         smallint NOT NULL REFERENCES score_var(id) ON DELETE CASCADE,
    input_code     varchar(40) NOT NULL,   -- variable.code
    role_code      varchar(40) NOT NULL,   -- 변수 산식에서의 역할
    is_required    boolean NOT NULL DEFAULT true,
    lookback_years smallint NOT NULL DEFAULT 0,
    note_txt       text,
    UNIQUE (var_id, input_code, role_code)
);

CREATE TRIGGER trg_scorevarinput_method_guard
    BEFORE INSERT OR DELETE OR UPDATE ON score_var_input
    FOR EACH ROW EXECUTE FUNCTION _guard_var_def();

-- 변수 ↔ 원천 질문번호 매핑. 하나의 변수가 여러 질문을 참조할 수 있다.
CREATE TABLE score_var_q (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    var_id      smallint NOT NULL REFERENCES score_var(id) ON DELETE CASCADE,
    q_number    varchar(15) NOT NULL,   -- 원천 질문번호 (7.6, 4.5.1 등)
    role_txt    varchar(40),
    is_excluded boolean NOT NULL DEFAULT false,  -- TRUE = 현 스펙에서 제외 (보존)
    UNIQUE (var_id, q_number)
);

CREATE INDEX ix_scvarq_var ON score_var_q (var_id);
CREATE INDEX ix_scvarq_q   ON score_var_q (q_number);

CREATE TRIGGER trg_scorevarq_method_guard
    BEFORE INSERT OR DELETE OR UPDATE ON score_var_q
    FOR EACH ROW EXECUTE FUNCTION _guard_var_def();

-- 변수 하위요소 트리. parent_id 자기참조로 depth 무제한.
-- elem_weight는 스펙 고정 설계 가중치이며 회귀 대상이 아니다.
CREATE TABLE score_elem (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    var_id      smallint NOT NULL REFERENCES score_var(id) ON DELETE CASCADE,
    parent_id   bigint REFERENCES score_elem(id) ON DELETE CASCADE,
    code        varchar(40) NOT NULL,
    name        varchar(200) NOT NULL,
    elem_weight numeric,                 -- gate/factor 역할 요소는 NULL
    elem_role   elem_role_t NOT NULL DEFAULT 'input',
    combine_op  combine_op_t,
    val_min     numeric,                 -- 정규화 하한 (기본 0)
    val_max     numeric,                 -- 정규화 상한 (기본 1)
    formula_txt text,
    sort_no     smallint NOT NULL DEFAULT 0,
    is_active   boolean NOT NULL DEFAULT true,
    CONSTRAINT ck_score_elem_bounds
        CHECK (val_min IS NULL OR val_max IS NULL OR val_min <= val_max),
    -- 최상위 요소(parent_id IS NULL)끼리도 code 중복을 막는다
    CONSTRAINT uq_score_elem_var_parent_code
        UNIQUE NULLS NOT DISTINCT (var_id, parent_id, code)
);

CREATE INDEX ix_scelem_var ON score_elem (var_id);
CREATE INDEX ix_scelem_par ON score_elem (parent_id);

CREATE TRIGGER trg_scoreelem_method_guard
    BEFORE INSERT OR DELETE OR UPDATE ON score_elem
    FOR EACH ROW EXECUTE FUNCTION _guard_var_def();

-- 스코어링 상수 레지스트리 (SCOPE12_ANNUAL_BENCHMARK, ASSURANCE_* 등)
CREATE TABLE score_const (
    id         smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    method_id  bigint NOT NULL,
    code       varchar(40) NOT NULL,
    val        numeric,                -- unconfirmed면 NULL
    used_by    varchar(80),            -- 이 상수를 쓰는 변수 코드 목록
    spec_stat  spec_stat_t NOT NULL DEFAULT 'confirmed',
    note_txt   text,
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_score_const_method FOREIGN KEY (method_id) REFERENCES score_method(id),
    CONSTRAINT uq_score_const_method_code UNIQUE (method_id, code)
);

CREATE TRIGGER trg_scoreconst_method_guard
    BEFORE INSERT OR DELETE OR UPDATE ON score_const
    FOR EACH ROW EXECUTE FUNCTION _guard_method_def();

-- ─────────────────────────────────────────────────────────────────────
-- 4. 가중치  weight_set → weight_val
-- ─────────────────────────────────────────────────────────────────────

-- 회귀 가중치 모델 버전. set_stat=placeholder는 배선 검증 전용이다.
CREATE TABLE weight_set (
    id          smallint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    method_id   bigint NOT NULL,
    code        varchar(40) NOT NULL,
    method_txt  varchar(40) NOT NULL,   -- regression / expert / equal
    target_txt  varchar(200),           -- 회귀 종속변수 설명
    r2          numeric,
    intercept   numeric,
    norm_txt    varchar(80),            -- 정규화 방법 (z-score, min-max 등)
    set_stat    weight_stat_t NOT NULL DEFAULT 'draft',
    policy_json jsonb NOT NULL DEFAULT '{}'::jsonb,
    trained_at  timestamptz,
    note_txt    text,
    is_active   boolean NOT NULL DEFAULT false,  -- 현행 적용. 1개만 TRUE 권장
    created_at  timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_weight_set_method FOREIGN KEY (method_id) REFERENCES score_method(id),
    CONSTRAINT uq_weight_set_method_code UNIQUE (method_id, code)
);

CREATE TRIGGER trg_weightset_method_guard
    BEFORE INSERT OR DELETE OR UPDATE ON weight_set
    FOR EACH ROW EXECUTE FUNCTION _guard_method_def();

-- 가중치 계수. kpi_id XOR var_id — KPI 레벨 또는 변수 레벨 중 하나.
CREATE TABLE weight_val (
    id       bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    set_id   smallint NOT NULL REFERENCES weight_set(id) ON DELETE CASCADE,
    kpi_id   smallint REFERENCES kpi(id),
    var_id   smallint REFERENCES score_var(id),
    weight   numeric NOT NULL,
    std_err  numeric,
    p_value  numeric,
    note_txt text,
    CONSTRAINT ck_weight_target
        CHECK ((kpi_id IS NOT NULL)::integer + (var_id IS NOT NULL)::integer = 1)
);

CREATE INDEX ix_wval_set ON weight_val (set_id);
CREATE UNIQUE INDEX uq_wval_kpi ON weight_val (set_id, kpi_id) WHERE kpi_id IS NOT NULL;
CREATE UNIQUE INDEX uq_wval_var ON weight_val (set_id, var_id) WHERE var_id IS NOT NULL;

-- 소속 weight_set과 방법론이 모두 draft일 때만 수정 가능
CREATE OR REPLACE FUNCTION _guard_weight_val()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    old_ok boolean;
    new_ok boolean;
BEGIN
    IF TG_OP <> 'INSERT' THEN
        SELECT ws.set_stat = 'draft' AND sm.status = 'draft' INTO old_ok
        FROM weight_set ws JOIN score_method sm ON sm.id = ws.method_id
        WHERE ws.id = OLD.set_id;
        IF old_ok IS DISTINCT FROM true THEN
            RAISE EXCEPTION 'active/retired weights are immutable';
        END IF;
    END IF;
    IF TG_OP <> 'DELETE' THEN
        SELECT ws.set_stat = 'draft' AND sm.status = 'draft' INTO new_ok
        FROM weight_set ws JOIN score_method sm ON sm.id = ws.method_id
        WHERE ws.id = NEW.set_id;
        IF new_ok IS DISTINCT FROM true THEN
            RAISE EXCEPTION 'active/retired weights are immutable';
        END IF;
        RETURN NEW;
    END IF;
    RETURN OLD;
END;
$$;

CREATE TRIGGER trg_weightval_guard
    BEFORE INSERT OR DELETE OR UPDATE ON weight_val
    FOR EACH ROW EXECUTE FUNCTION _guard_weight_val();

-- ─────────────────────────────────────────────────────────────────────
-- 5. 실행 이력  score_run
--    모든 점수는 run_id에 귀속된다. 재산출은 새 run을 만든다.
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE score_run (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    method_id  bigint NOT NULL,
    name       varchar(80),
    spec_ver   varchar(40),    -- KPI 스펙 문서 버전
    code_ver   varchar(80),    -- 스코어링 코드 버전 (git tag/커밋)
    param_json jsonb NOT NULL DEFAULT '{}'::jsonb,  -- 실행 파라미터 스냅샷
    run_stat   run_stat_t NOT NULL DEFAULT 'running',
    started_at timestamptz NOT NULL DEFAULT now(),
    ended_at   timestamptz,
    note_txt   text,
    CONSTRAINT fk_score_run_method FOREIGN KEY (method_id) REFERENCES score_method(id),
    CONSTRAINT ck_score_run_time CHECK (ended_at IS NULL OR ended_at >= started_at)
);

-- 섹터 × 카테고리 기준값. v2 기본 변수 점수에는 미사용(절대 산식).
-- 추후 참조 가중치·랭킹 재산정용 산출 슬롯.
CREATE TABLE score_benchmark (
    id         bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    method_id  bigint NOT NULL,
    bench_code varchar(40) NOT NULL,   -- cov_by_sector 등
    sector_key varchar(80) NOT NULL,   -- company.cers_group
    cat_key    varchar(40) NOT NULL,   -- category.code
    bench_val  numeric,                -- NULL = 미산출
    method_txt varchar(120),           -- median / mean_capped 등
    src_run_id bigint REFERENCES score_run(id) ON DELETE SET NULL,
    spec_stat  spec_stat_t NOT NULL DEFAULT 'derived',
    updated_at timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT fk_score_benchmark_method FOREIGN KEY (method_id) REFERENCES score_method(id),
    CONSTRAINT uq_benchmark_method_key UNIQUE (method_id, bench_code, sector_key, cat_key)
);

CREATE INDEX ix_bench_sector ON score_benchmark (sector_key, cat_key);

CREATE TRIGGER trg_benchmark_method_guard
    BEFORE INSERT OR DELETE OR UPDATE ON score_benchmark
    FOR EACH ROW EXECUTE FUNCTION _guard_method_def();

-- ─────────────────────────────────────────────────────────────────────
-- 6. 점수 결과  var_score → kpi_score → final_score
--    score = NULL 은 apply_stat = 'not_applicable' 을 뜻한다.
--    결측을 0점으로 치환하지 않는다.
-- ─────────────────────────────────────────────────────────────────────

CREATE TABLE var_score (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id  bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    rpt_year    smallint NOT NULL,
    run_id      bigint NOT NULL REFERENCES score_run(id) ON DELETE CASCADE,
    var_id      smallint NOT NULL REFERENCES score_var(id),
    score       numeric,        -- 0~100. NULL = not_applicable
    apply_stat  apply_stat_t NOT NULL DEFAULT 'applicable',
    miss_stat   miss_stat_t NOT NULL DEFAULT 'complete',
    input_json  jsonb,          -- 핵심 입력값 스냅샷 (재현·감사)
    calc_json   jsonb,          -- 하위점수·산식 계산 로그
    unconf_json jsonb,          -- 미확정 상수 사용 항목 목록
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (company_id, rpt_year, run_id, var_id)
);

CREATE INDEX ix_vs_key ON var_score (company_id, rpt_year, var_id);
CREATE INDEX ix_vs_run ON var_score (run_id);

CREATE TRIGGER trg_varscore_upd
    BEFORE UPDATE ON var_score
    FOR EACH ROW EXECUTE FUNCTION _set_updated_at();

-- 변수 점수 → 실제 사용한 clean_val 직접 lineage
CREATE TABLE score_input_link (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    var_score_id bigint NOT NULL REFERENCES var_score(id) ON DELETE CASCADE,
    clean_id     bigint NOT NULL REFERENCES clean_val(id),
    role_code    varchar(40) NOT NULL,
    created_at   timestamptz NOT NULL DEFAULT now(),
    UNIQUE (var_score_id, clean_id, role_code)
);

CREATE INDEX ix_sil_vs    ON score_input_link (var_score_id);
CREATE INDEX ix_sil_clean ON score_input_link (clean_id);

-- 하위요소별 점수. 디버깅 및 잠재 feature 용도.
CREATE TABLE elem_score (
    id           bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    var_score_id bigint NOT NULL REFERENCES var_score(id) ON DELETE CASCADE,
    elem_id      bigint NOT NULL REFERENCES score_elem(id),
    elem_val     numeric,   -- 정규화 값 (0~1). gate=0이면 0, penalty는 차감값
    is_na        boolean NOT NULL DEFAULT false,
    evid_json    jsonb,     -- 근거 데이터 (clean_val.id, 값 스냅샷 등)
    created_at   timestamptz NOT NULL DEFAULT now(),
    UNIQUE (var_score_id, elem_id)
);

CREATE INDEX ix_es_vs ON elem_score (var_score_id);

-- KPI별 롤업. var_score를 weight_set 가중치로 합산.
CREATE TABLE kpi_score (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id  bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    rpt_year    smallint NOT NULL,
    run_id      bigint NOT NULL REFERENCES score_run(id) ON DELETE CASCADE,
    set_id      smallint NOT NULL REFERENCES weight_set(id),
    kpi_id      smallint NOT NULL REFERENCES kpi(id),
    score       numeric,
    n_var_used  smallint,   -- 산출에 사용된 변수 수 (NA 제외)
    na_var_json jsonb,      -- NA로 처리된 변수 코드 목록
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (company_id, rpt_year, run_id, set_id, kpi_id)
);

CREATE INDEX ix_kpi_key ON kpi_score (company_id, rpt_year, set_id);

-- 최종 종합 점수. kpi_score를 KPI 레벨 가중치로 합산.
CREATE TABLE final_score (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    company_id  bigint NOT NULL REFERENCES company(id) ON DELETE CASCADE,
    rpt_year    smallint NOT NULL,
    run_id      bigint NOT NULL REFERENCES score_run(id) ON DELETE CASCADE,
    set_id      smallint NOT NULL REFERENCES weight_set(id),
    score       numeric,
    n_var_used  smallint,
    na_var_json jsonb,
    calc_json   jsonb,      -- 산출 로그 (KPI별 점수, 가중치 스냅샷)
    created_at  timestamptz NOT NULL DEFAULT now(),
    UNIQUE (company_id, rpt_year, run_id, set_id)
);

CREATE INDEX ix_fin_key ON final_score (company_id, rpt_year, set_id);

-- ─────────────────────────────────────────────────────────────────────
-- 7. VIEW  v_score — 변수 점수 + 기업·KPI·방법론 결합
-- ─────────────────────────────────────────────────────────────────────

CREATE VIEW v_score AS
SELECT
    vs.id        AS var_score_id,
    vs.run_id,
    sm.code      AS methodology_code,
    co.id        AS company_id,
    co.corp_name,
    co.cers_group,
    vs.rpt_year,
    k.code       AS kpi_code,
    k.name       AS kpi_name,
    sv.code      AS var_code,
    sv.name      AS var_name,
    sv.apply_scope,
    sv.in_index,
    vs.score,
    vs.apply_stat,
    vs.miss_stat,
    vs.updated_at
FROM var_score vs
JOIN score_run    sr ON sr.id = vs.run_id
JOIN score_method sm ON sm.id = sr.method_id
JOIN company      co ON co.id = vs.company_id
JOIN score_var    sv ON sv.id = vs.var_id AND sv.method_id = sr.method_id
JOIN kpi          k  ON k.id  = sv.kpi_id AND k.method_id = sr.method_id;

-- ─────────────────────────────────────────────────────────────────────
-- 8. VIEW — disclosure 투영 준비도
--    score_var_input(필수 입력)과 confirmed 매핑 커버리지를 대조한다.
--    schema.sql의 disclosure 레이어와 스코어링 정의를 함께 참조하므로
--    이 파일에서 정의한다.
-- ─────────────────────────────────────────────────────────────────────

-- 결과가 0행이어야 활성 방법론의 필수 입력이 모두 매핑되어 있다.
CREATE VIEW disclosure_projection_gap AS
WITH required_input AS (
    SELECT
        score_method.code AS method_code,
        score_var.code    AS score_variable_code,
        score_var_input.input_code,
        score_var_input.role_code
    FROM score_method
    JOIN score_var       ON score_var.method_id = score_method.id
    JOIN score_var_input ON score_var_input.var_id = score_var.id
    WHERE score_method.status = 'active'
      AND score_var.is_active
      AND score_var_input.is_required
), confirmed_map AS (
    SELECT DISTINCT variable.code AS input_code
    FROM disclosure_mapping_set
    JOIN disclosure_variable_map
        ON disclosure_variable_map.mapping_set_id = disclosure_mapping_set.id
    JOIN variable ON variable.id = disclosure_variable_map.variable_id
    WHERE disclosure_mapping_set.mapping_state = 'active'
      AND disclosure_variable_map.mapping_state = 'confirmed'
)
SELECT
    required_input.method_code,
    required_input.score_variable_code,
    required_input.input_code,
    required_input.role_code
FROM required_input
LEFT JOIN confirmed_map ON confirmed_map.input_code = required_input.input_code
WHERE confirmed_map.input_code IS NULL;

-- projection_ready = 활성 방법론의 필수 입력이 모두 confirmed 매핑을 가짐
CREATE VIEW disclosure_projection_readiness AS
WITH required_input AS (
    SELECT
        score_method.id   AS method_id,
        score_method.code AS method_code,
        score_var_input.input_code
    FROM score_method
    JOIN score_var       ON score_var.method_id = score_method.id
    JOIN score_var_input ON score_var_input.var_id = score_var.id
    WHERE score_method.status = 'active'
      AND score_var.is_active
      AND score_var_input.is_required
    GROUP BY score_method.id, score_method.code, score_var_input.input_code
), mapped_input AS (
    SELECT DISTINCT variable.code AS input_code
    FROM disclosure_mapping_set
    JOIN disclosure_variable_map
        ON disclosure_variable_map.mapping_set_id = disclosure_mapping_set.id
    JOIN variable ON variable.id = disclosure_variable_map.variable_id
    WHERE disclosure_mapping_set.mapping_state = 'active'
      AND disclosure_variable_map.mapping_state = 'confirmed'
      AND variable.is_active
)
SELECT
    required_input.method_id,
    required_input.method_code,
    count(*)::integer AS required_input_count,
    count(mapped_input.input_code)::integer AS confirmed_mapping_count,
    (count(*) - count(mapped_input.input_code))::integer AS gap_count,
    count(*) > 0 AND count(*) = count(mapped_input.input_code) AS projection_ready
FROM required_input
LEFT JOIN mapped_input ON mapped_input.input_code = required_input.input_code
GROUP BY required_input.method_id, required_input.method_code;

COMMIT;
