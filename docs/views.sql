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

-- ─── 1. sector_catalog ← sector + sector_i18n ──────────────────────────────
-- 활성 taxonomy/locale만 모아 화면에서 locale별 이름을 선택할 수 있는 JSON으로 제공
CREATE OR REPLACE VIEW sector_catalog AS
SELECT
    s.id                                              AS sector_id,
    st.code                                           AS taxonomy_code,
    st.country                                        AS taxonomy_country,
    s.code                                            AS sector_code,
    s.source_key,
    jsonb_object_agg(si.locale, si.name ORDER BY sl.sort_no) AS names
FROM sector s
JOIN sector_taxonomy st
  ON st.id = s.taxonomy_id
JOIN sector_i18n si
  ON si.sector_id = s.id
JOIN sector_locale sl
  ON sl.locale = si.locale
 AND sl.is_active
WHERE s.is_active
  AND st.is_active
GROUP BY s.id, st.code, st.country, s.code, s.source_key;

-- ─── 2. companies ← company + company_sector + sector_catalog ──────────────
CREATE OR REPLACE VIEW companies AS
SELECT
    co.id                                                    AS company_id,
    co.corp_name                                             AS company_name_kr,
    co.corp_en                                               AS company_name_en,
    co.stock_code,
    co.country                                               AS country_code,
    co.market                                                AS market_code,
    sc.sector_code::varchar(20)                              AS sector_code,
    co.ind_code                                              AS industry_code,
    CASE WHEN co.is_active THEN 'active' ELSE 'inactive' END AS status,
    sc.sector_id,
    sc.taxonomy_code                                         AS sector_taxonomy_code,
    sc.names                                                 AS sector_names
FROM company co
LEFT JOIN company_sector cs
  ON cs.company_id = co.id
 AND cs.sector_role = 'display'
LEFT JOIN sector_catalog sc
  ON sc.sector_id = cs.sector_id;

-- ─── 3. documents ← report ─────────────────────────────────────────────────
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

-- ─── 4. rpt_period ← clean_val ─────────────────────────────────────────────
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

-- ─── 5. co_metric ← clean_val ──────────────────────────────────────────────
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

-- ─── 6. co_target ← clean_val ──────────────────────────────────────────────
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

-- ─── 7. doc_fw_adopt ← report.frame_json ───────────────────────────────────
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

-- ─── 8. co_scope3 ← scope3_category_status JSON ────────────────────────────
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

-- ─── 9. doc_assur_stmt ← 보고서별 배출량 검증 수준 ─────────────────────────
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

-- 10. score_categories ← kpi  (활성 방법론의 KPI 4개만)
--
-- 2026-08-13 수리: kpi 테이블에는 legacy_v2(id 1~4)와 cers_0730(id 25~28)이
-- **같은 code(KPI1~KPI4)** 로 공존한다. 전부 내보내면 프론트가 code로 중복을
-- 접으면서 먼저 온 legacy 행을 집어, 화면에 옛 방법론 점수가 뜨거나 `—`가 된다.
-- (실측: リクルート 화면 E100.0/T100.0/C100.0/R100.0 = legacy 0~1 점수 ×100.
--  실제 0730 값은 KPI1=649.8 / KPI2=205.9 / KPI3=0.0 / KPI4=31.7)
-- 최신 score_run이 사용한 방법론만 노출한다.
CREATE OR REPLACE VIEW score_categories AS
SELECT
    k.id            AS category_id,
    k.code          AS category_code,
    k.name          AS category_name,
    NULL::numeric   AS category_weight,
    k.sort_no       AS display_order
FROM kpi k
WHERE k.method_id = (SELECT sr.method_id FROM score_run sr ORDER BY sr.id DESC LIMIT 1);

-- 11. method_ver ← score_run
CREATE OR REPLACE VIEW method_ver AS
SELECT
    id                         AS method_ver_id,
    name::varchar(120)         AS version_name,
    spec_ver,
    (run_stat::text = 'done')  AS is_active,
    started_at::date           AS effective_from
FROM score_run;

-- 12. scoring_runs ← final_score  (기업당 최신 run 1행)
--
-- 2026-08-13 수리: grain이 (기업, 연도)라 평가연도 앵커가 바뀐 기업이 화면에
-- 두 번 나왔다(東京エレクトロン: run 18에서 t=2018, run 22에서 t=2021 -> 38개사인데 39행).
CREATE OR REPLACE VIEW scoring_runs AS
SELECT DISTINCT ON (fs.company_id)
    (fs.company_id::bigint * 10000 + fs.rpt_year)::bigint AS scoring_run_id,
    fs.company_id,
    (fs.company_id::bigint * 10000 + fs.rpt_year)::bigint AS period_id,
    sr.run_stat::text                                      AS run_status,
    sr.ended_at                                            AS finished_at,
    fs.run_id                                              AS method_ver_id
FROM final_score fs
JOIN score_run sr ON sr.id = fs.run_id
ORDER BY fs.company_id, fs.run_id DESC, fs.rpt_year DESC;

-- 13. cers_score ← final_score  (원점수 그대로)
--
-- 2026-08-13 수리: `score <= 1.001 THEN 1 + 99 * score`는 legacy_v2가 0~1 점수를
-- 내던 시절의 재척도다. 0730 점수는 이미 0~100 척도라 1.001 이하 값(0점·음수)이
-- 전부 99배로 증폭됐다.
--   HD한국조선해양 -637.6 -> -63,118.4 / セブン&アイ -359.2 -> -35,563.7
--   대한항공 -278.1 -> -27,534.7 / 삼성SDI -103.4 -> -10,232.9
-- 0점 기업은 1.0이 돼 "0점"과 "1점"이 구분되지 않았다.
-- 0730 원문 4.2절은 "점수 범위는 미정, CERs_Index ∈ [??,??]"이므로 절단·재척도
-- 근거가 없다. grain도 기업당 1행으로 맞춘다(scoring_runs와 동일).
CREATE OR REPLACE VIEW cers_score AS
SELECT DISTINCT ON (fs.company_id)
    (fs.company_id::bigint * 10000 + fs.rpt_year)::bigint AS scoring_run_id,
    NULL::numeric                                          AS sbase,
    NULL::numeric                                          AS cef,
    NULL::numeric                                          AS gv,
    ROUND(fs.score, 1)                                     AS cers_score,
    NULL::text     AS score_grade,
    'scored'::text AS index_status
FROM final_score fs
ORDER BY fs.company_id, fs.run_id DESC, fs.rpt_year DESC;

-- 14. category_scores ← kpi_score  (기업×KPI 최신 run, 활성 방법론만)
--
-- 2026-08-13 수리: grain이 (기업, 연도, KPI)라 과거 방법론·과거 앵커 연도의 KPI가
-- 함께 조회됐다(39개 기업에 기대 156행인데 실제 308행). score_categories와 같은
-- 방법론으로 제한하고 기업당 KPI 1행씩만 내보낸다.
CREATE OR REPLACE VIEW category_scores AS
SELECT DISTINCT ON (ks.company_id, ks.kpi_id)
    (ks.company_id::bigint * 10000 + ks.rpt_year)::bigint AS scoring_run_id,
    ks.kpi_id                                              AS category_id,
    ks.score                                               AS category_raw_score,
    NULL::numeric                                          AS category_weighted_score
FROM kpi_score ks
WHERE ks.kpi_id IN (SELECT category_id FROM score_categories)
ORDER BY ks.company_id, ks.kpi_id, ks.run_id DESC;
