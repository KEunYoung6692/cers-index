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
WHERE data_year IS NOT NULL;

-- ─── 4. co_metric ← clean_val ──────────────────────────────────────────────
-- 배출·에너지 수치 (연결/별도기준). metric_code 를 프론트 alias 로 변환.
CREATE OR REPLACE VIEW co_metric AS
SELECT
    cv.id                                                            AS co_metric_id,
    cv.company_id,
    (cv.company_id::bigint * 10000 + cv.data_year)::bigint           AS period_id,
    CASE v.code
        WHEN 'scope1_total_tco2e'           THEN 'scope1_emissions'
        WHEN 'scope2_total_tco2e'           THEN 'scope2_emissions'
        WHEN 'scope12_combined_tco2e'       THEN 'scope12_emissions'
        WHEN 'total_energy_consumption'     THEN 'total_energy'
        WHEN 'renewable_energy_consumption' THEN 'renewable_energy'
        ELSE v.code
    END                                                              AS metric_code,
    cv.val_num                                                       AS metric_val,
    COALESCE(cv.unit_txt, v.unit_std)                                AS unit,
    CASE WHEN cv.is_found THEN 'reported' ELSE 'missing' END         AS data_status
FROM clean_val cv
JOIN variable v ON v.id = cv.variable_id
WHERE cv.is_cur
  AND cv.data_year IS NOT NULL
  AND cv.val_num IS NOT NULL
  AND cv.boundary_type IN ('consolidated', 'standalone')
  AND v.code IN (
      'scope1_total_tco2e',
      'scope2_total_tco2e',
      'scope12_combined_tco2e',
      'total_energy_consumption',
      'renewable_energy_consumption'
  );

-- ─── 5. co_target ← clean_val ──────────────────────────────────────────────
-- 절대감축목표(target_year 있는 기업) + 넷제로 선언 각각 1행씩
CREATE OR REPLACE VIEW co_target AS
-- 절대감축목표
SELECT
    (co.id * 10 + 1)::bigint                                                       AS co_target_id,
    co.id                                                                          AS company_id,
    'absolute'::text                                                               AS target_type,
    'absolute'::text                                                               AS metric_type,
    MAX(CASE WHEN v.code = 'base_year'              THEN cv.val_year::integer END) AS base_year,
    MAX(CASE WHEN v.code = 'target_year'            THEN cv.val_num::integer  END) AS target_year,
    MAX(CASE WHEN v.code = 'scope_coverage'         THEN cv.val_txt           END) AS target_scope,
    MAX(CASE WHEN v.code = 'target_emissions_tco2e' THEN cv.val_num           END) AS target_val,
    'tCO2e'::text                                                                  AS target_unit,
    MAX(CASE WHEN v.code = 'reduction_rate_pct'     THEN cv.val_num           END) AS target_red_pct,
    NULL::text    AS scen_align_cd,
    NULL::boolean AS sbti_ok,
    NULL::boolean AS residual_def,
    NULL::boolean AS offset_use,
    NULL::numeric AS offset_dep_ratio,
    NULL::boolean AS removal_plan,
    true          AS disclosed_flag
FROM company co
JOIN clean_val cv ON cv.company_id = co.id AND cv.is_cur
JOIN variable v   ON v.id = cv.variable_id
    AND v.code IN ('base_year','target_year','reduction_rate_pct','target_emissions_tco2e','scope_coverage')
GROUP BY co.id
HAVING MAX(CASE WHEN v.code = 'target_year' THEN cv.val_num END) IS NOT NULL

UNION ALL

-- 넷제로 선언
SELECT
    (co.id * 10 + 2)::bigint                                                          AS co_target_id,
    co.id                                                                             AS company_id,
    'netzero'::text                                                                   AS target_type,
    'absolute'::text                                                                  AS metric_type,
    NULL::integer                                                                     AS base_year,
    MAX(CASE WHEN v.code = 'net_zero_target_year'    THEN cv.val_year::integer END)   AS target_year,
    MAX(CASE WHEN v.code = 'net_zero_scope_coverage' THEN cv.val_txt           END)   AS target_scope,
    NULL::numeric AS target_val,
    NULL::text    AS target_unit,
    NULL::numeric AS target_red_pct,
    NULL::text    AS scen_align_cd,
    NULL::boolean AS sbti_ok,
    NULL::boolean AS residual_def,
    NULL::boolean AS offset_use,
    NULL::numeric AS offset_dep_ratio,
    NULL::boolean AS removal_plan,
    true          AS disclosed_flag
FROM company co
JOIN clean_val cv ON cv.company_id = co.id AND cv.is_cur
JOIN variable v   ON v.id = cv.variable_id
    AND v.code IN ('net_zero_target_year','net_zero_scope_coverage')
GROUP BY co.id
HAVING MAX(CASE WHEN v.code = 'net_zero_target_year' THEN cv.val_year END) IS NOT NULL;

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

-- ─── 스코어링 views  (F05 실행 후 데이터 채워짐) ────────────────────────────

-- 7. score_categories ← kpi  (KPI 4개 → category 역할)
CREATE OR REPLACE VIEW score_categories AS
SELECT
    id            AS category_id,
    code          AS category_code,
    name          AS category_name,
    NULL::numeric AS category_weight,
    sort_no       AS display_order
FROM kpi;

-- 8. method_ver ← score_run
CREATE OR REPLACE VIEW method_ver AS
SELECT
    id                         AS method_ver_id,
    name                       AS version_name,
    spec_ver,
    (run_stat::text = 'done')  AS is_active,
    started_at                 AS effective_from
FROM score_run;

-- 9. scoring_runs ← final_score  (기업×연도별 최신 run 1행)
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

-- 10. cers_score ← final_score  (0–1 → 1–100 변환)
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

-- 11. category_scores ← kpi_score  (기업×연도×KPI 최신 run)
CREATE OR REPLACE VIEW category_scores AS
SELECT DISTINCT ON (ks.company_id, ks.rpt_year, ks.kpi_id)
    (ks.company_id::bigint * 10000 + ks.rpt_year)::bigint AS scoring_run_id,
    ks.kpi_id                                              AS category_id,
    ks.score                                               AS category_raw_score,
    NULL::numeric                                          AS category_weighted_score
FROM kpi_score ks
ORDER BY ks.company_id, ks.rpt_year, ks.kpi_id, ks.run_id DESC;
