# CERS DBML (v1, no refs)

**supabase.postgres.schema**

Table "industry" {
  "industry_id" SERIAL [pk, increment]
  "industry_name" VARCHAR(255) [not null]
  "notes" VARCHAR

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR
}

Table "company" {
  "company_id" SERIAL [pk, increment]
  "company_name" VARCHAR(255) [not null]
  "industry_id" INTEGER
  "country" VARCHAR(100) [default: 'KR']
  "notes" VARCHAR

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR

  Indexes {
    industry_id [name: "idx_company_industry_id"]
  }
}

Table "sub_company" {
  "sub_company_id" SERIAL [pk, increment]
  "company_id" INTEGER [not null]
  "sub_company_name" VARCHAR(255) [not null]
  "is_self" BOOLEAN [not null, default: false]
  "entity_type" VARCHAR(20) // 'site'/'subsidiaries'/'total'/'other'
  "notes" VARCHAR

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR

  Indexes {
    company_id [name: "idx_sub_company_company_id"]
    sub_company_name [name: "idx_sub_company_name"]
    entity_type [name: "idx_sub_company_entity_type"]
  }
}

Table "report" {
  "report_id" SERIAL [pk, increment]
  "company_id" INTEGER [not null]
  "report_year" INTEGER [not null]
  "report_title" VARCHAR(255)
  "publication_date" DATE
  "assurance_org" VARCHAR(255)
  "notes" VARCHAR

  // file info (one file per company/report assumed)
  "file_name" VARCHAR(255)
  "file_path" VARCHAR
  "file_hash" VARCHAR(128)
  "page_count" INTEGER

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR

  Indexes {
    company_id [name: "idx_report_company_id"]
    report_year [name: "idx_report_year"]
  }
}

Table "report_framework" {
  "report_framework_id" SERIAL [pk, increment]
  "report_id" INTEGER [not null]
  "framework" VARCHAR(50) [not null]  // GRI/SASB/TCFD/ISSB/...
  "assurance" VARCHAR(50)                  // none/limited/reasonable/unknown or yes/no
  "notes" VARCHAR

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR

  Indexes {
    report_id [name: "idx_report_framework_report_id"]
    framework_code [name: "idx_report_framework_framework_code"]
  }
}

Table "emission" {
  "emission_id" SERIAL [pk, increment]
  "sub_company_id" INTEGER
  "emission_year" INTEGER [not null]
  "scope" VARCHAR(10) [not null] // 'S1','S2','S1S2','S3','TOTAL'
  "emissions_value" NUMERIC(20,3)
  "unit" VARCHAR(20) [not null, default: 'tCO2e']
  "data_level" INTEGER [not null, default: 2] // 1 verified, 2 self, 3 proxy
  "evidence_page" INTEGER
  "evidence_note" VARCHAR(255)
  "s3_category" VARCHAR
  "notes" VARCHAR

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR

  Indexes {
    company_id [name: "idx_emission_company_id"]
    sub_company_id [name: "idx_emission_sub_company_id"]
    report_id [name: "idx_emission_report_id"]
    emission_year [name: "idx_emission_year"]
    scope [name: "idx_emission_scope"]
  }
}

Table "denominator" {
  "denom_id" SERIAL [pk, increment]
  "company_id" INTEGER [not null]
  "denom_year" INTEGER [not null]
  "denom_type" VARCHAR(50) [not null] // revenue/production/rtk/mwh ...
  "denom_value" NUMERIC(20,6)
  "denom_unit" VARCHAR(50)
  "data_level" INTEGER [not null, default: 2]
  "evidence_page" INTEGER
  "evidence_note" VARCHAR(255)
  "notes" VARCHAR

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR

  Indexes {
    company_id [name: "idx_denominator_company_id"]
    sub_company_id [name: "idx_denominator_sub_company_id"]
    report_id [name: "idx_denominator_report_id"]
    denom_year [name: "idx_denominator_year"]
    denom_type [name: "idx_denominator_type"]
  }
}

Table "emission_target" {
  "target_id" SERIAL [pk, increment]
  "company_id" INTEGER [not null]
  "scope" VARCHAR(10) [not null] // 'S1S2','S1','S2','S3'
  "baseline_year" INTEGER
  "target_year" INTEGER [not null]
  "target_type" VARCHAR(20) [not null, default: 'intensity'] // absolute/intensity
  "target_reduction_pct" NUMERIC(6,3)
  "evidence_page" INTEGER
  "evidence_note" VARCHAR(255)
  "notes" VARCHAR

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR

  Indexes {
    company_id [name: "idx_emission_target_company_id"]
    target_year [name: "idx_emission_target_year"]
    scope [name: "idx_emission_target_scope"]
  }
}

Table "scoring_config" {
  "config_id" SERIAL [pk, increment]
  "config_name" VARCHAR(255) [not null]
  "formula_version" VARCHAR(50) [not null, default: 'v1']

  "w_ri" NUMERIC(10,6) [not null]
  "w_tag" NUMERIC(10,6) [not null]
  "w_mms" NUMERIC(10,6) [not null]

  "ri_max" NUMERIC(10,2) [not null, default: 40]
  "tag_max" NUMERIC(10,2) [not null, default: 30]
  "mms_max" NUMERIC(10,2) [not null, default: 30]
  "pcrc_max" NUMERIC(10,2) [not null, default: 100]

  "notes" VARCHAR

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR
}

Table "scoring_config_alpha" {
  "alpha_id" SERIAL [pk, increment]
  "config_id" INTEGER [not null]
  "industry_id" INTEGER [not null]
  "alpha" NUMERIC(10,6) [not null, default: 1.0]
  "notes" VARCHAR

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR

  Indexes {
    config_id [name: "idx_alpha_config_id"]
    industry_id [name: "idx_alpha_industry_id"]
  }
}

Table "score_run" {
  "score_run_id" SERIAL [pk, increment]
  "config_id" INTEGER [not null]
  "company_id" INTEGER [not null]
  "eval_year" INTEGER [not null]
  "source_report_id" INTEGER

  "ri_score" NUMERIC(10,3)
  "tag_score" NUMERIC(10,3)
  "mms_score" NUMERIC(10,3)
  "pcrc_score" NUMERIC(10,3)

  "notes" VARCHAR

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR

  Indexes {
    config_id [name: "idx_score_run_config_id"]
    company_id [name: "idx_score_run_company_id"]
    eval_year [name: "idx_score_run_eval_year"]
  }
}

Table "mms_indicator_def" {
  "indicator_id" SERIAL [pk, increment]
  "indicator_code" VARCHAR(50) [not null]
  "indicator_name" VARCHAR(255) [not null]
  "max_points" NUMERIC(10,3) [not null, default: 5]
  "description" VARCHAR

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR
}

Table "mms_observation" {
  "obs_id" SERIAL [pk, increment]
  "indicator_id" INTEGER [not null]
  "status" VARCHAR(20) [default: 'unknown'] // yes/no/unknown
  "points_awarded" NUMERIC(10,3) [not null, default: 0]
  "data_level" INTEGER [not null, default: 2]

  "company_id" INTEGER
  "evidence_page" INTEGER
  "evidence_note" VARCHAR(255)
  "notes" VARCHAR

  "reg_date" TIMESTAMP [not null, default: `CURRENT_TIMESTAMP`]
  "registrar" VARCHAR [not null, default: 'admin']
  "update_date" TIMESTAMP
  "updater" VARCHAR
  "update_reason" VARCHAR

  Indexes {
    score_run_id [name: "idx_mms_observation_score_run_id"]
    indicator_id [name: "idx_mms_observation_indicator_id"]
    company_id [name: "idx_mms_observation_company_id"]
  }
}
```
