
# 1) 마스터 테이블

## industry

**목적**: 업종(산업) 기준을 표준화해서 벤치마크/α보정/집계의 기준축으로 사용

* `industry_name` : 업종 표준명(예: IT서비스, 화학 등). **벤치마크 그룹핑의 키**
* `notes` : 업종 정의/분류 기준(내부 룰, KRX/KSIC 매핑 등) 기록

---

## company

**목적**: 평가 단위(상장사/법인)의 기준 마스터

* `company_name` : 회사 표준명(표기 흔들림 방지용 “정규화된 이름”)
* `industry_id` : 업종 FK. **업종 평균/퍼센타일 계산**에 사용
* `country` : 국가 코드(기본 KR). 해외기업/해외법인 확장 시 사용
* `notes` : 회사 범위/특이사항(지배구조, 연결 기준 주석 등)

---

## sub_company

**목적**: 한 회사(메인) 내부에 존재하는 “세부 엔티티”를 표현
(공장/사무소/자회사/전사합계처럼 **보고서 표에 등장하는 단위**를 안전하게 담기 위한 테이블)

* `company_id` : 메인 회사 FK(“어느 회사의 하위 단위인가”)
* `sub_company_name` : 보고서에 나온 표기 그대로(공장명/지역/자회사 등)
* `is_self` : **메인 회사 자체 범위인지 여부**

  * `true` 예: 본사, 공장, 사무소처럼 회사 내부 조직/사이트
  * `false` 예: 자회사(종속법인 묶음), 전사합계(집계행), 그룹합산 등
* `entity_type` : **성격 분류(이게 핵심)**

  * `site` : 공장/사업장/사무소(사이트 단위)
  * `subsidiaries` : 자회사(종속/관계사 묶음)
  * `total` : 전사합계/총계(“집계 행”)
  * `other` : 그 외(분류 불가 시)
* `notes` : “연결/별도” 같은 집계 기준이 섞였을 때 근거 메모(추천)

> 실무 팁: `is_self`만으로는 “전사합계(total)” 같은 집계행을 구분하기 어려워서 `entity_type`가 실제로 매우 중요합니다.

---

# 2) 보고서/근거 테이블

## report

**목적**: “이번 점수/배출/목표”의 **출처가 되는 보고서 메타** + (가정상) 파일 정보 1건

* `company_id` : 보고서 발행 주체(메인 회사)
* `report_year` : 보고서 기준 연도(또는 평가 연도 매핑 기준)
* `publication_date` : 발행일(동일 연도 내 최신본 선택 등)
* `assurance_org` : 제3자 검증기관(있으면 신뢰 배지/가중치에 활용 가능)
* `file_hash` : 동일 파일 중복 방지/버전 추적(파일명 바뀌어도 동일성 유지)
* `page_count` : 근거 페이지 범위 검증(추출 품질 체크에 도움)
* `notes` : 보고 범위, 연결/별도 기준 등 핵심 주석 기록

---

## report_framework

**목적**: 보고서가 따르는 **프레임워크(공시 기준)** 및 **프레임워크 단위의 assurance 상태** 기록

* `report_id` : 대상 보고서
* `framework_code` : 적용 프레임워크 코드(GRI/TCFD/ISSB 등)
* `assurance` : 프레임워크/지표 검증 수준(없음/제한적/합리적/불명 등 내부 분류)
* `notes` : “어떤 섹션만 검증” 등 예외사항

---

# 3) 핵심 데이터 테이블 (배출/분모/목표)

## emission

**목적**: 회사(또는 하위 엔티티)별 연도/스코프 배출량 저장

* `company_id` : 메인 회사
* `sub_company_id` : **공장/자회사/합계 등 세부 엔티티(선택)**
* `report_id` : 출처 보고서(선택; 없으면 외부 데이터/추정치일 수도)
* `emission_year` : 배출량 기준 연도
* `scope` : 스코프 구분(모델 계산의 기준축)

  * `S1`, `S2`, `S1S2`, `S3`, `TOTAL`
* `emissions_value` : 배출량 값
* `data_level` : **데이터 품질/신뢰 등급(핵심)**

  * 1 = verified(검증됨)
  * 2 = self(자체공시)
  * 3 = proxy(추정/대리값)
* `evidence_page`, `evidence_note` : 보고서 내 근거 위치(투명성/검증 대응에 중요)
* `notes` : 계산 방식, 조직경계, 제외항목 등 예외 기록

---

## denominator

**목적**: 집약도(intensity) 계산용 분모 데이터(매출/생산량/수송량 등)

* `company_id`, `sub_company_id`, `report_id`, `denom_year` : 배출과 같은 방식으로 매칭
* `denom_type` : 분모 타입(모델에서 “무엇으로 나눴는지”를 결정)

  * 예: `revenue`, `production`, `mwh`, `rtk` 등
* `denom_value`, `denom_unit` : 분모 값/단위
* `data_level` : 분모 역시 추정치/공시치 혼재 가능 → 신뢰 처리 필요
* `evidence_page`, `evidence_note` : 분모의 근거(“어느 표의 매출/생산량이냐”가 투자자 질문 포인트)

> 실무 팁: MVP에서는 `denom_type`을 업종별로 1개 “대표 분모”로 고정해두면 구현/해석이 쉬워집니다.

---

## emission_target

**목적**: 감축 목표(Forward-looking)를 구조화해서 TAG(목표 신뢰도/경로)에 사용

* `company_id`, `sub_company_id`, `report_id` : 목표의 주체/출처
* `scope` : 목표 적용 범위(보통 `S1S2`가 핵심, 경우에 따라 `S3`)
* `baseline_year` : 기준연도(없을 수 있음)
* `target_year` : 목표 도달 연도
* `target_type` : 목표 형태

  * `absolute` : 절대량 감축
  * `intensity` : 집약도 감축
* `target_reduction_pct` : 감축률(%) (TAG 계산의 핵심 변수)
* `evidence_page`, `evidence_note` : 목표 근거(표/문장 위치)

---

# 4) 점수/설정 테이블 (Index 운영 핵심)

## scoring_config

**목적**: 점수 산식 버전/가중치/상한 등 “정책”을 한 묶음으로 관리
(향후 버전업, 백테스트, 투자자 제출용 산식 고정에 필수)

* `config_name` : 설정 이름(예: “v1-default”, “pilot-2026Q1”)
* `formula_version` : 산식 버전 태그(로그/재현성)
* `w_ri, w_tag, w_mms` : 모듈 가중치(합=1 전제 권장)
* `ri_max, tag_max, mms_max, pcrc_max` : 모듈별/총점 상한(점수 스케일 고정)
* `notes` : 변경 이유/적용 범위 기록

---

## scoring_config_alpha

**목적**: 업종별 난이도/특성을 반영하는 α 보정값 저장

* `config_id` : 어떤 스코어링 정책에 속하는지
* `industry_id` : 대상 업종
* `alpha` : 업종 보정 계수(예: hard-to-abate 업종 가점/패널티)
* `notes` : α 산정 근거(정책 논리, 외부 기준 등)

---

## score_run

**목적**: 특정 회사의 특정 연도 평가 결과(점수 “스냅샷”)를 저장
웹 화면에서 가장 자주 읽는 테이블

* `config_id` : 어떤 설정으로 계산했는지(재현성)
* `company_id` : 평가 대상 회사
* `eval_year` : 평가 연도
* `source_report_id` : 계산에 사용한 기준 보고서(없을 수 있음)
* `ri_score, tag_score, mms_score, pcrc_score` : 모듈별/총점 결과
* `notes` : 예외처리, 결측 처리 요약(운영 시 매우 유용)

> 웹 화면 MVP는 사실상 `score_run` + (trend용 emission/denom) + (벤치마크용 industry)만 있어도 동작합니다.

---

# 5) MMS(경영성숙도) 정의/관측 테이블

## mms_indicator_def

**목적**: MMS를 구성하는 체크 항목의 “정의서”(코드북)

* `indicator_code` : 시스템 키(예: `ASSURANCE`, `GOVERNANCE` 등)
* `indicator_name` : 표시용 이름
* `max_points` : 해당 항목 최대 점수(가점 설계 가능)
* `description` : 판정 기준(yes/no 판단 규칙, 근거 기대 형태)

---

## mms_observation

**목적**: 특정 회사/연도(score_run)에 대해 각 MMS 지표가 “예/아니오/불명”인지 기록

* `score_run_id` : 어떤 평가 실행에 속하는지
* `indicator_id` : 어떤 MMS 지표인지
* `status` : `yes/no/unknown` (unknown을 허용해야 “보고서 한계”를 정직하게 표현 가능)
* `points_awarded` : 실제 부여점수(규칙 기반이든 LLM 기반이든 결과만 저장)
* `data_level` : 이 판정 자체의 신뢰도(예: LLM 추정 vs 명시 문구)
* `sub_company_id` : 특정 공장/자회사에 한정된 MMS라면 연결(대부분은 NULL)
* `evidence_page`, `evidence_note` : 판정 근거 위치

---
