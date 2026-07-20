-- =====================================================================
-- cers-index  frontend_compat_views
--
-- batch 스키마(company/report/clean_val/kpi/…) →
-- cers-index 프론트가 기대하는 테이블명으로 매핑하는 views.
--
-- 적용:
--   psql $DATABASE_URL -f docs/views.sql
--   또는 Supabase Dashboard > SQL Editor 에 붙여넣기
--
-- 멱등: CREATE OR REPLACE VIEW 로 재실행 안전
-- 소스 테이블: CERsIndex-batch/docs/schema.sql + schema_scoring.sql
-- =====================================================================

-- ─── 1. companies ← company ────────────────────────────────────────────────
CREATE OR REPLACE VIEW companies AS
SELECT
    id                                                    AS company_id,
    corp_name                                             AS company_name_kr,
    corp_en                                               AS company_name_en,
    stock_code,
    country                                               AS country_code,
    market                                                AS market_code,
    sector_code,
    ind_code                                              AS industry_code,
    CASE WHEN is_active THEN 'active' ELSE 'inactive' END AS status
FROM company;

-- ─── 2. documents ← report ─────────────────────────────────────────────────
-- 다운로드 완료 보고서만 노출
CREATE OR REPLACE VIEW documents AS
SELECT
    id              AS document_id,
    company_id,
    title,
    doc_kind::text  AS document_type,
    source_cd       AS source_type,
    rpt_year        AS report_year,
    NULL::text      AS published_date
FROM report
WHERE down_at IS NOT NULL;

-- ─── 3. rpt_period ← clean_val ─────────────────────────────────────────────
-- 기업×연도 유니크 조합. synthetic period_id = company_id * 10000 + data_year
CREATE OR REPLACE VIEW rpt_period AS
SELECT DISTINCT
    (company_id::bigint * 10000 + data_year)::bigint AS period_id,
    company_id,
    data_year                                        AS fiscal_year,
    (data_year || '-01-01')::date                    AS period_start,
    (data_year || '-12-31')::date                    AS period_end,
    NULL::date                                       AS assessment_date
FROM clean_val
WHERE is_cur
  AND is_found
  AND data_state = 'reported'
  AND org_unit_id IS NULL
  AND data_year IS NOT NULL;

-- ─── 4. co_metric ← clean_val ──────────────────────────────────────────────
-- 승인된 회사 단위 수치. Scope 2는 MB > 일반 > LB 순으로 하나만 노출한다.
CREATE OR REPLACE VIEW co_metric AS
WITH candidates AS (
    SELECT
        cv.id,
        cv.company_id,
        cv.data_year,
        cv.val_num,
        COALESCE(cv.unit_txt, v.unit_std) AS unit,
        CASE v.code
            WHEN 'scope1_total_tco2e'           THEN 'scope1_emissions'
            WHEN 'scope2_total_tco2e'           THEN 'scope2_emissions'
            WHEN 'scope2_lb_total_tco2e'        THEN 'scope2_emissions'
            WHEN 'scope2_mb_total_tco2e'        THEN 'scope2_emissions'
            WHEN 'scope12_combined_tco2e'       THEN 'scope12_emissions'
            WHEN 'total_energy_consumption'     THEN 'total_energy'
            WHEN 'renewable_energy_consumption' THEN 'renewable_energy'
            ELSE v.code
        END AS metric_code,
        CASE v.code
            WHEN 'scope2_mb_total_tco2e' THEN 1
            WHEN 'scope2_total_tco2e'    THEN 2
            WHEN 'scope2_lb_total_tco2e' THEN 3
            ELSE 1
        END AS source_priority
    FROM clean_val cv
    JOIN variable v ON v.id = cv.variable_id
    WHERE cv.is_cur
      AND cv.is_found
      AND cv.data_state = 'reported'
      AND cv.org_unit_id IS NULL
      AND cv.data_year IS NOT NULL
      AND cv.val_num IS NOT NULL
      AND v.code IN (
          'scope1_total_tco2e',
          'scope2_total_tco2e',
          'scope2_lb_total_tco2e',
          'scope2_mb_total_tco2e',
          'scope12_combined_tco2e',
          'total_energy_consumption',
          'renewable_energy_consumption',
          'revenue',
          'green_capex',
          'capex_total',
          'total_capex',
          'ebitda'
      )
), ranked AS (
    SELECT
        candidates.*,
        ROW_NUMBER() OVER (
            PARTITION BY company_id, data_year, metric_code
            ORDER BY source_priority, id DESC
        ) AS rn
    FROM candidates
)
SELECT
    id                                                      AS co_metric_id,
    company_id,
    (company_id::bigint * 10000 + data_year)::bigint        AS period_id,
    metric_code,
    val_num                                                 AS metric_val,
    unit,
    'reported'::text                                        AS data_status
FROM ranked
WHERE rn = 1;

-- ─── 5. co_target ← clean_val ──────────────────────────────────────────────
-- record_key별 감축목표. 파싱 원문을 프론트 표시 계약으로만 분류하며 점수화하지 않는다.
CREATE OR REPLACE VIEW co_target AS
WITH target_values AS (
    SELECT
        cv.id,
        cv.company_id,
        cv.data_year,
        COALESCE(NULLIF(cv.record_key, ''), 'target-' || cv.id::text) AS record_key,
        v.code,
        cv.val_num,
        cv.val_txt,
        cv.val_year
    FROM clean_val cv
    JOIN variable v ON v.id = cv.variable_id
    WHERE cv.is_cur
      AND cv.is_found
      AND cv.data_state = 'reported'
      AND cv.org_unit_id IS NULL
      AND v.code IN (
          'target_type',
          'baseline_year',
          'baseline_emissions_tco2e',
          'baseline_intensity',
          'target_year',
          'reduction_rate_pct',
          'target_emissions_tco2e',
          'target_intensity',
          'target_scope1_coverage_pct',
          'target_scope2_coverage_pct',
          'target_scope3_coverage_pct',
          'sbti_target_status'
      )
), targets AS (
    SELECT
        company_id,
        data_year,
        record_key,
        MIN(id) AS source_id,
        MAX(CASE WHEN code = 'target_type'                  THEN val_txt END)       AS target_text,
        MAX(CASE WHEN code = 'baseline_year'                THEN val_year END)      AS base_year,
        MAX(CASE WHEN code = 'baseline_emissions_tco2e'     THEN val_num END)       AS baseline_emissions,
        MAX(CASE WHEN code = 'baseline_intensity'           THEN val_num END)       AS baseline_intensity,
        MAX(CASE WHEN code = 'target_year'                  THEN val_year END)      AS target_year,
        MAX(CASE WHEN code = 'reduction_rate_pct'           THEN val_num END)       AS target_red_pct,
        MAX(CASE WHEN code = 'target_emissions_tco2e'       THEN val_num END)       AS target_emissions,
        MAX(CASE WHEN code = 'target_intensity'             THEN val_num END)       AS target_intensity,
        MAX(CASE WHEN code = 'target_scope1_coverage_pct'   THEN val_num END)       AS scope1_pct,
        MAX(CASE WHEN code = 'target_scope2_coverage_pct'   THEN val_num END)       AS scope2_pct,
        MAX(CASE WHEN code = 'target_scope3_coverage_pct'   THEN val_num END)       AS scope3_pct,
        MAX(CASE WHEN code = 'sbti_target_status'           THEN val_txt END)       AS sbti_status
    FROM target_values
    GROUP BY company_id, data_year, record_key
)
SELECT
    source_id::bigint                                                              AS co_target_id,
    company_id,
    CASE
        WHEN target_text ~* 'net.?zero|carbon neutral|넷.?제로|탄소.?중립|実質ゼロ|カーボンニュートラル'
            THEN 'netzero'
        WHEN target_text ~* 'intensity|per unit|원단위|原単位'
            THEN 'intensity'
        ELSE 'absolute'
    END                                                                            AS target_type,
    CASE
        WHEN target_text ~* 'intensity|per unit|원단위|原単位' OR target_intensity IS NOT NULL
            THEN 'intensity'
        ELSE 'absolute'
    END                                                                            AS metric_type,
    base_year::integer,
    target_year::integer,
    NULLIF(CONCAT_WS(', ',
        CASE WHEN scope1_pct IS NOT NULL THEN 'Scope 1 ' || scope1_pct || '%' END,
        CASE WHEN scope2_pct IS NOT NULL THEN 'Scope 2 ' || scope2_pct || '%' END,
        CASE WHEN scope3_pct IS NOT NULL THEN 'Scope 3 ' || scope3_pct || '%' END
    ), '')                                                                         AS target_scope,
    COALESCE(target_emissions, target_intensity)                                   AS target_val,
    CASE WHEN target_emissions IS NOT NULL THEN 'tCO2e' ELSE NULL::text END         AS target_unit,
    target_red_pct,
    NULL::text    AS scen_align_cd,
    CASE
        WHEN sbti_status ~* 'approved|validated|승인|인증|認定|承認' THEN true
        WHEN sbti_status IS NOT NULL THEN false
        ELSE NULL::boolean
    END             AS sbti_ok,
    NULL::boolean AS residual_def,
    NULL::boolean AS offset_use,
    NULL::numeric AS offset_dep_ratio,
    NULL::boolean AS removal_plan,
    true          AS disclosed_flag
FROM targets
WHERE target_year IS NOT NULL;

-- ─── 6. doc_fw_adopt ← report.frame_json ───────────────────────────────────
-- 채택 프레임워크 배지 (GRI/TCFD/IFRS S2 등)
CREATE OR REPLACE VIEW doc_fw_adopt AS
SELECT
    r.id      AS document_id,
    fw.value  AS fw_cd,
    fw.value  AS fw_label
FROM report r,
     LATERAL jsonb_array_elements_text(r.frame_json) fw(value)
WHERE r.frame_json IS NOT NULL
  AND jsonb_typeof(r.frame_json) = 'array';

-- ─── 7. co_scope3 ← scope3_category_status JSON ────────────────────────────
CREATE OR REPLACE VIEW co_scope3 AS
SELECT
    (cv.id::bigint * 100 + item.ordinality)::bigint         AS co_scope3_id,
    cv.company_id,
    (cv.company_id::bigint * 10000 + cv.data_year)::bigint AS period_id,
    COALESCE(item.value->>'category', item.ordinality::text) AS category_code,
    COALESCE(item.value->>'status', '') ~* '^(보고|reported|disclosed|공시|報告|開示)$'
                                                            AS disclosed_flag,
    CASE
        WHEN COALESCE(item.value->>'primary_data_ratio', item.value->>'primary_ratio')
             ~ '^[0-9]+([.][0-9]+)?%?$'
        THEN REPLACE(
            COALESCE(item.value->>'primary_data_ratio', item.value->>'primary_ratio'),
            '%', ''
        )::numeric
        ELSE NULL::numeric
    END                                                     AS primary_ratio
FROM clean_val cv
JOIN variable v ON v.id = cv.variable_id
CROSS JOIN LATERAL jsonb_array_elements(
    CASE
        WHEN jsonb_typeof(cv.val_json) = 'array' THEN cv.val_json
        ELSE '[]'::jsonb
    END
) WITH ORDINALITY AS item(value, ordinality)
WHERE cv.is_cur
  AND cv.is_found
  AND cv.data_state = 'reported'
  AND cv.org_unit_id IS NULL
  AND cv.data_year IS NOT NULL
  AND v.code = 'scope3_category_status'
  AND jsonb_typeof(cv.val_json) = 'array';

-- ─── 8. doc_assur_stmt ← 보고서별 배출량 검증 수준 ─────────────────────────
-- 검증기관명은 현재 배치 변수에 없으므로 확인 가능한 수준만 노출한다.
CREATE OR REPLACE VIEW doc_assur_stmt AS
SELECT
    MIN(cv.id)::bigint AS doc_assur_stmt_id,
    rv.report_id       AS document_id,
    NULL::text         AS assur_provider,
    STRING_AGG(DISTINCT cv.val_txt, '; ' ORDER BY cv.val_txt) AS assur_type_cd
FROM clean_val cv
JOIN raw_val rv ON rv.id = cv.raw_id
JOIN variable v ON v.id = cv.variable_id
WHERE cv.is_cur
  AND cv.is_found
  AND cv.data_state = 'reported'
  AND cv.org_unit_id IS NULL
  AND cv.val_txt IS NOT NULL
  AND v.code IN (
      'scope1_assurance_level',
      'scope2_assurance_level',
      'scope3_assurance_level'
  )
GROUP BY rv.report_id;

-- ─── 스코어링 views  (F05 실행 후 데이터 채워짐) ────────────────────────────

-- 9. score_categories ← kpi  (KPI 4개 → category 역할)
CREATE OR REPLACE VIEW score_categories AS
SELECT
    id            AS category_id,
    code          AS category_code,
    name          AS category_name,
    NULL::numeric AS category_weight,
    sort_no       AS display_order
FROM kpi;

-- 10. method_ver ← score_run
CREATE OR REPLACE VIEW method_ver AS
SELECT
    id                         AS method_ver_id,
    name::varchar(120)         AS version_name,
    spec_ver,
    (run_stat::text = 'done')  AS is_active,
    started_at::date           AS effective_from
FROM score_run;

-- 11. scoring_runs ← final_score  (기업×연도별 최신 run 1행)
CREATE OR REPLACE VIEW scoring_runs AS
SELECT DISTINCT ON (fs.company_id, fs.rpt_year)
    (fs.company_id::bigint * 10000 + fs.rpt_year)::bigint AS scoring_run_id,
    fs.company_id,
    (fs.company_id::bigint * 10000 + fs.rpt_year)::bigint AS period_id,
    sr.run_stat::text                                      AS run_status,
    sr.ended_at                                            AS finished_at,
    fs.run_id                                              AS method_ver_id
FROM final_score fs
JOIN score_run sr ON sr.id = fs.run_id
ORDER BY fs.company_id, fs.rpt_year, fs.run_id DESC;

-- 12. cers_score ← final_score  (0–1 → 1–100 변환)
CREATE OR REPLACE VIEW cers_score AS
SELECT DISTINCT ON (fs.company_id, fs.rpt_year)
    (fs.company_id::bigint * 10000 + fs.rpt_year)::bigint AS scoring_run_id,
    NULL::numeric                                          AS sbase,
    NULL::numeric                                          AS cef,
    NULL::numeric                                          AS gv,
    CASE
        WHEN fs.score IS NULL  THEN NULL
        WHEN fs.score <= 1.001 THEN ROUND(1 + 99 * LEAST(fs.score, 1), 1)
        ELSE ROUND(fs.score, 1)
    END                                                    AS cers_score,
    NULL::text     AS score_grade,
    'scored'::text AS index_status
FROM final_score fs
ORDER BY fs.company_id, fs.rpt_year, fs.run_id DESC;

-- 13. category_scores ← kpi_score  (기업×연도×KPI 최신 run)
CREATE OR REPLACE VIEW category_scores AS
SELECT DISTINCT ON (ks.company_id, ks.rpt_year, ks.kpi_id)
    (ks.company_id::bigint * 10000 + ks.rpt_year)::bigint AS scoring_run_id,
    ks.kpi_id                                              AS category_id,
    ks.score                                               AS category_raw_score,
    NULL::numeric                                          AS category_weighted_score
FROM kpi_score ks
ORDER BY ks.company_id, ks.rpt_year, ks.kpi_id, ks.run_id DESC;
