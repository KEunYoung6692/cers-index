아래는 **내부 산식/변수 정의서 R1**입니다.
목적은 발표용이 아니라, 사용자가 CERs Index v0.3 점수 계산 구조를 이해하고 나중에 코드로 옮길 수 있게 **모든 계산 변수·판정 기준·산식·출처 우선순위**를 잠그는 것입니다.

---

# CERs Index v0.3 내부 산식·변수 정의서 R1

## 0. 계산 구조 요약

CERs Index는 먼저 변수별 점수 `S_v`를 모두 `0~1`로 산출하고, CDP 질문 매핑 기반 가중치 `W_v,g`를 곱해 내부 점수 `S_total`을 만든 뒤, 최종 표시값을 `1~100점`으로 변환합니다.

```text
S_total(i,t) = Σ_v W_v,g(i) × S_adjusted(v,i,t)

CERs_Index(i,t) = 1 + 99 × clamp(S_total(i,t), 0, 1)
```

| 기호             | 의미                     |
| -------------- | ---------------------- |
| `i`            | 기업                     |
| `t`            | 회계연도                   |
| `v`            | 변수 ID, V1~V9           |
| `g(i)`         | 기업 i의 CERs 산업군         |
| `S_v`          | 변수별 원점수, 0~1           |
| `S_adjusted_v` | P2 신뢰도 플래그 반영 후 변수점수   |
| `W_v,g`        | 산업군 g에서 변수 v의 가중치      |
| `clamp(x,0,1)` | x가 0보다 작으면 0, 1보다 크면 1 |

가중치는 손으로 정하지 않습니다. CDP 2025 Climate Change 방법론은 질문별 scoring criteria와 points available을 제공하므로, CERs는 CDP 질문을 V1~V9에 매핑한 뒤 Management와 Leadership denominator를 합산해 변수별 가중치를 산출합니다. ([Assets][1])

---

## 1. 공통 계산 규칙

### 1.1 점수 범위

| 항목            | 기준      |
| ------------- | ------- |
| 변수 원점수        | `0~1`   |
| 플래그 반영 후 변수점수 | `0~1`   |
| 내부 총점         | `0~1`   |
| 외부 CERs Index | `1~100` |
| 소수점           | 허용      |

---

### 1.2 평균 함수

산식에서 두 가지 평균만 사용합니다.

```text
arithmetic_mean(x1, ..., xn) = Σx / n
```

```text
geometric_mean(x1, ..., xn) = (Πx)^(1/n)
```

**사용 기준**

| 평균   | 사용 위치                        | 이유                          |
| ---- | ---------------------------- | --------------------------- |
| 산술평균 | V5처럼 여러 정보항목이 보완관계일 때        | 일부 항목이 부족해도 다른 항목으로 설명 가능   |
| 기하평균 | V3, V6, V8처럼 필수요건이 결합되어야 할 때 | 핵심요건 하나가 0이면 전체 신뢰도가 크게 훼손됨 |

---

### 1.3 결측, 미공시, 비해당

| 상태    | 정의                        | 처리                    |
| ----- | ------------------------- | --------------------- |
| 미공시   | 기업이 공개하지 않음               | 원칙적으로 0               |
| 산출불가  | 필요한 수치가 없어 계산 자체가 불가능     | 해당 변수 0 또는 Limited 판단 |
| 비해당   | 기업 사업모델상 적용되지 않음이 명확히 공시됨 | 분모 제외                 |
| 수집실패  | 자료는 있을 수 있으나 아직 수집하지 못함   | 점수 확정 금지              |
| 경계불일치 | 배출량·재무·보고경계가 서로 다름        | V8 또는 P2에서 반영         |

**중요:** “자료 없음”은 비해당이 아닙니다. 비해당은 기업이 명확한 사유를 공시했거나 산업분류상 적용 불가능한 경우만 인정합니다.

---

## 2. 산업군과 Scope 3 중요도

V2와 일부 산업별 판정은 CERs 산업군 `G1~G12`를 사용합니다. Scope 3는 GHG Protocol의 15개 카테고리를 기준으로 합니다. GHG Protocol Scope 3 Standard는 기업 가치사슬 배출을 upstream/downstream 15개 카테고리로 회계처리하는 국제 기준입니다. ([GHG Protocol][2])

### 2.1 산업군별 중요 Scope 3 카테고리

| 산업군                                         | 중요 Scope 3 카테고리          |
| ------------------------------------------- | ------------------------ |
| G1 Electric Utilities & Energy Supply       | C3, C11, C12             |
| G2 Fossil Fuels & Refining                  | C3, C11, C12             |
| G3 Materials & Process Industry             | C1, C2, C3, C10, C12     |
| G4 Industrial Manufacturing & Capital Goods | C1, C2, C3, C11, C12     |
| G5 Automobiles & Mobility Equipment         | C1, C2, C3, C11, C12     |
| G6 Transportation & Logistics               | C3, C4, C9               |
| G7 Electronics, Semiconductors & Batteries  | C1, C2, C3, C11, C12     |
| G8 Construction & Real Estate               | C1, C2, C3, C11, C13     |
| G9 Consumer Goods, Food & Retail            | C1, C3, C4, C9, C12, C14 |
| G10 ICT, Telecom & Platform                 | C1, C2, C3, C6, C7       |
| G11 Financials                              | C15                      |
| G12 Healthcare, Bio & Other Services        | C1, C2, C3, C5, C6, C7   |

금융업의 C15는 Investments이며, 금융기관의 대출·투자 관련 배출량을 다루는 Scope 3 카테고리입니다. ([GHG Protocol][3])

---

## 3. V1 Scope 1·2 배출성과

### 3.1 목적

기업의 실제 운영 배출이 개선되고 있는지 평가합니다. 단순히 배출량을 공개했는지가 아니라, **배출집약도가 개선되는지**와 **절대배출이 증가하지 않는지**를 함께 봅니다.

CDP Climate Change 방법론은 Scope 1·2 inventory, intensity metrics, emissions performance를 별도로 평가합니다. CERs는 이를 공개자료 기반 정량 산식으로 변환합니다. ([Assets][1])

---

### 3.2 입력 변수

| 변수       | 정의               |              단위 | 출처 우선순위           |
| -------- | ---------------- | --------------: | ----------------- |
| `E1_t`   | 평가연도 Scope 1 배출량 |           tCO₂e | GIR → 보고서 → 검증의견서 |
| `E2_t`   | 평가연도 Scope 2 배출량 |           tCO₂e | 보고서 → GIR → 검증의견서 |
| `E1_t-3` | 3년 전 Scope 1 배출량 |           tCO₂e | GIR → 보고서         |
| `E2_t-3` | 3년 전 Scope 2 배출량 |           tCO₂e | 보고서 → GIR         |
| `D_t`    | 평가연도 분모          | KRW 매출액 또는 활동분모 | DART → 보고서        |
| `D_t-3`  | 3년 전 분모          |           동일 단위 | DART → 보고서        |

OpenDART 기업개황 API는 기업 식별자인 `corp_code`, `stock_code`, `corp_cls` 등을 제공하므로 기업 마스터와 DART 재무자료 연결의 기준으로 사용합니다. ([OPENDART][4]) GIR는 국가 온실가스 인벤토리와 NGMS를 운영·관리하는 기관이므로 배출량 공적 보조 출처로 사용합니다. ([지식정보처][5])

---

### 3.3 분모 `D_t` 정의

V1의 기본 분모는 **연결 매출액**입니다. 이유는 국내 상장사 전체 커버리지를 확보하기 위해서입니다. 산업별 물리 활동분모는 의미가 크지만 업종별로 수집가능성이 다르기 때문에 v0.3 기본 산식에는 넣지 않고 보조 분석값으로 둡니다.

| 우선순위 | 분모                              |
| ---: | ------------------------------- |
|    1 | 연결 매출액                          |
|    2 | 별도 매출액                          |
|    3 | 산업별 물리 활동분모, 수집 가능한 경우 보조지표로 저장 |
|    4 | 분모 없음 → V1 산출불가                 |

---

### 3.4 산식

```text
E12_t = E1_t + E2_t
E12_t-3 = E1_t-3 + E2_t-3

I_t = E12_t / D_t
I_t-3 = E12_t-3 / D_t-3

r_I,t = 1 - (I_t / I_t-3)^(1/3)
```

`r_I,t`는 3년 연평균 배출집약도 개선률입니다.

```text
R_g = 0.042
S_intensity = clamp(r_I,t / R_g, 0, 1)
```

`R_g`는 전 산업 공통 4.2%로 고정합니다. 이 값은 CDP에서 직접 주는 값이 아니라, SBTi의 cross-sector absolute reduction approach에서 Scope 1·2 목표에 대해 제시하는 최소 연간 감축률 4.2%를 CERs의 보수적 기준으로 차용한 것입니다. ([Science Based Targets][6])

절대배출 증가 보정은 아래처럼 계산합니다.

```text
g_E,t = (E12_t / E12_t-3)^(1/3) - 1
```

```text
S_absolute =
  1,               if g_E,t <= 0
  1 / (1 + g_E,t), if g_E,t > 0
```

최종 V1:

```text
S_V1 = S_intensity × S_absolute
```

---

### 3.5 판정 기준

| 상황                    | 처리                          |
| --------------------- | --------------------------- |
| Scope 1 또는 Scope 2 없음 | V1 산출불가                     |
| 3년 전 값 없음             | 1년 개선률 보조 산식 사용, Limited 표시 |
| 분모 없음                 | V1 산출불가                     |
| 절대배출 감소               | `S_absolute = 1`            |
| 절대배출 증가               | `S_absolute < 1`            |
| 경계 불일치                | V8 및 P2에서 신뢰도 감점            |

---

## 4. V2 Scope 3 중요 카테고리 공개·관리

### 4.1 목적

기업이 자기 산업에서 중요한 가치사슬 배출을 정량 공개하고 관리하는지 평가합니다.

---

### 4.2 입력 변수

| 변수        | 정의                           |
| --------- | ---------------------------- |
| `g`       | CERs 산업군                     |
| `k`       | Scope 3 카테고리 C1~C15          |
| `M_g,k`   | 산업군 g에서 k가 중요하면 1, 아니면 0     |
| `Q_i,t,k` | 기업 i의 연도 t에서 카테고리 k 공개·관리 점수 |

---

### 4.3 `Q_i,t,k` 판정

| 상태                        |    점수 |
| ------------------------- | ----: |
| 카테고리별 정량 배출량 공개 + 산정근거 있음 |   1.0 |
| 카테고리별 정량 배출량 공개, 산정근거 없음  |   0.8 |
| 총량만 있고 카테고리별 값 없음         |   0.3 |
| 정성 설명만 있음                 |   0.5 |
| 중요 카테고리 미공시               |     0 |
| 명확한 비해당 사유 공시             | 분모 제외 |

---

### 4.4 산식

```text
S_V2 = Σ_k (M_g,k × Q_i,t,k) / Σ_k M_g,k
```

비해당으로 인정된 카테고리는 분자와 분모에서 모두 제외합니다.

---

## 5. V3 감축목표 설계 품질

### 5.1 목적

감축목표가 실제로 평가 가능한 구조인지 판단합니다. 넷제로 선언만으로는 고득점을 주지 않습니다.

CDP는 targets에서 조직 전체 범위, Scope 1·2 커버리지, 목표연도, 기준연도 등을 평가하고, IFRS S2는 순배출 목표가 있는 경우 총배출 목표와 탄소크레딧 사용 계획을 별도로 공시하도록 요구합니다. ([Assets][1]) ([IFRS Foundation][7])

---

### 5.2 입력 변수와 판정

| 구성요소       | 변수명                      | 1점                        | 0.5점                  | 0점              |
| ---------- | ------------------------ | ------------------------- | --------------------- | --------------- |
| 기준연도       | `B_base_year`            | YYYY 명시                   | 기준시점은 있으나 불명확         | 없음              |
| 목표연도       | `B_target_year`          | YYYY 명시                   | 장기목표만 있고 중간연도 불명확     | 없음              |
| 감축률        | `B_reduction_rate`       | % 또는 목표배출량 명시             | 방향성만 있음               | 없음              |
| Scope 범위   | `B_scope_coverage`       | Scope 1·2 + 중요 Scope 3 포함 | Scope 1·2만 포함         | Scope 불명 또는 일부만 |
| 목표유형       | `B_target_type`          | 절대량 목표                    | 집약도 목표                | 넷제로 선언만 있음      |
| 단·중기성      | `B_near_mid_term`        | 5~10년 내 목표 있음             | 장기목표만 있음              | 없음              |
| 총배출·순배출 구분 | `B_gross_net_separation` | 총배출과 순배출 구분               | 순배출만 있으나 총배출 자료 별도 있음 | 순배출이 총배출을 가림    |
| 탄소크레딧 투명성  | `B_credit_transparency`  | 아래 별도 표                   | 아래 별도 표               | 아래 별도 표         |

---

### 5.3 `B_credit_transparency`

| 조건                              |  점수 |
| ------------------------------- | --: |
| 순배출·넷제로 목표 없음                   | 1.0 |
| 순배출·넷제로 목표 있음 + 탄소크레딧 사용 안 함 명시 | 1.0 |
| 사용 계획·의존도·유형·인증제도 구체 공시         | 1.0 |
| 사용 계획은 있으나 정량 의존도 없음            | 0.5 |
| 순배출·넷제로 목표 있음 + 탄소크레딧 사용 여부 불명  |   0 |
| 순배출 목표가 총배출 목표를 가리는 구조          |   0 |

IFRS S2는 탄소크레딧 사용 의존 정도, 제3자 인증제도, 크레딧 유형 등을 공시하도록 요구합니다. ([IFRS Foundation][7])

---

### 5.4 산식

```text
S_V3 = geometric_mean(
  B_base_year,
  B_target_year,
  B_reduction_rate,
  B_scope_coverage,
  B_target_type,
  B_near_mid_term,
  B_gross_net_separation,
  B_credit_transparency
)
```

기하평균을 쓰는 이유는 목표의 필수 구성요소 중 하나가 빠지면 목표 추적 가능성이 크게 무너지기 때문입니다.

---

## 6. V4 목표 대비 이행률·감축활동 증거

### 6.1 목적

기업이 목표를 세웠을 뿐 아니라, 목표 경로를 따라 실제 감축을 하고 있는지 평가합니다.

---

### 6.2 입력 변수

| 변수                        | 정의              |
| ------------------------- | --------------- |
| `E_base`                  | 기준연도 배출량 또는 집약도 |
| `E_t`                     | 평가연도 배출량 또는 집약도 |
| `R_target`                | 목표 감축률          |
| `Y_base`                  | 기준연도            |
| `Y_target`                | 목표연도            |
| `Y_t`                     | 평가연도            |
| `B_reduction_initiatives` | 감축활동 증거 점수      |

---

### 6.3 목표 경로 산식

```text
E_target = E_base × (1 - R_target)
```

```text
E_path,t =
E_base - (E_base - E_target)
× ((Y_t - Y_base) / (Y_target - Y_base))
```

```text
S_progress =
clamp((E_base - E_t) / (E_base - E_path,t), 0, 1)
```

최종 V4:

```text
S_V4 = S_progress × B_reduction_initiatives
```

---

### 6.4 `B_reduction_initiatives` 판정

|   점수 | 기준                                           |
| ---: | -------------------------------------------- |
|    0 | 감축활동 없음 또는 일반 선언만 있음                         |
|  0.5 | 재생에너지 확대, 설비효율화, 공정개선 등 활동명은 있으나 대상·기간·성과 없음 |
| 0.75 | 감축량, 투자금액, 대상사업장, 기간 중 일부가 있음                |
|  1.0 | 감축활동, 대상범위, 기간, 감축량 또는 에너지 절감량, 진행상태가 모두 확인됨 |

---

### 6.5 예외 처리

| 상황            | 처리                     |
| ------------- | ---------------------- |
| 목표 없음         | V3에서 반영, V4는 산출불가 또는 0 |
| 기준연도 배출량 없음   | V4 = 0                 |
| 목표연도 없음       | V4 = 0                 |
| 감축률 없음        | V4 = 0                 |
| 평가연도가 기준연도 이전 | V4 산출불가                |
| 목표가 집약도 목표    | `E` 대신 `I` 사용          |

---

## 7. V5 기후 리스크·전환계획 식별

### 7.1 목적

기업이 기후위험과 전환계획을 실제 경영전략으로 인식하고 있는지 평가합니다. IFRS S2는 기후 관련 위험·기회가 기업의 현금흐름, 금융 접근성, 자본비용 등에 영향을 줄 수 있는 정보를 공시하도록 요구합니다. ([IFRS Foundation][8])

---

### 7.2 구성요소

| 구성요소   | 1점                      | 0.5점    | 0점 |
| ------ | ----------------------- | ------- | -- |
| 물리적 위험 | 기업 사업·자산·지역과 연결된 구체 위험  | 일반적 언급  | 없음 |
| 전환위험   | 규제·기술·시장·평판 리스크 구체화     | 일반적 언급  | 없음 |
| 기회     | 제품·시장·비용절감 등 구체 기회      | 일반적 언급  | 없음 |
| 시간범위   | 단기·중기·장기 구분             | 일부 구분   | 없음 |
| 재무영향   | 금액·비율 등 정량              | 정성      | 없음 |
| 전환수단   | 에너지·설비·공정·제품·공급망 수단 명시  | 방향성만 있음 | 없음 |
| 진행상황   | KPI, 진행률, 완료/진행 프로젝트 있음 | 정성 진행상황 | 없음 |

---

### 7.3 산식

```text
S_V5 = arithmetic_mean(
  B_physical_risk,
  B_transition_risk,
  B_opportunity,
  B_time_horizon,
  B_financial_impact,
  B_transition_levers,
  B_progress
)
```

---

## 8. V6 이사회 기후감독·경영진 책임·보상 연계

### 8.1 목적

기후 대응이 이사회 감독, 경영진 책임, 임원 보상체계에 실제 연결되어 있는지 평가합니다. CDP Climate Change 방법론의 Governance 영역은 board oversight, management responsibility, incentives를 포함합니다. ([Assets][1])

---

### 8.2 구성요소

| 구성요소                                         | 1점                                | 0.5점             | 0점 |
| -------------------------------------------- | --------------------------------- | ---------------- | -- |
| `B_board_oversight`                          | 이사회 또는 산하 위원회가 기후 이슈 감독           | ESG 일반 감독만 있음    | 없음 |
| `B_management_responsibility`                | CEO, CFO, CSO, ESG 담당 임원 등 책임자 명시 | 부서 책임만 있음        | 없음 |
| `B_climate_kpi`                              | 탄소감축, 에너지, Scope 3, 전환계획 KPI 명시   | ESG 일반 KPI만 있음   | 없음 |
| `B_compensation_link`                        | 기후 KPI가 임원 보상·성과급·LTI와 연결         | 전사/직원 보상만 연결     | 없음 |
| `B_board_or_compensation_committee_evidence` | 사업보고서, 보상위원회, 이사회 근거로 추적 가능       | 지속가능경영보고서 문구만 있음 | 없음 |

---

### 8.3 산식

```text
S_V6 = geometric_mean(
  B_board_oversight,
  B_management_responsibility,
  B_climate_kpi,
  B_compensation_link,
  B_board_or_compensation_committee_evidence
)
```

일반 이사회 구성, 사외이사 비율, 성별 다양성은 CERs v0.3에서 제외합니다. 이 변수는 일반 G가 아니라 **기후 관련 이사회 감독과 보상 연결성**만 평가합니다.

---

## 9. V7 자본배분·CapEx/DART 교차검증

## 9.1 목적

기업이 기후전환을 말로만 설명하는 것이 아니라, 실제 자본배분으로 집행하고 있는지 평가합니다.

V7은 CDP의 Business strategy, financial planning, CAPEX/OPEX alignment 논리를 국내 공개자료에 맞춘 변수입니다. CDP 2025 Climate Change 방법론은 transition plans, effects on strategy and financial planning, CAPEX/OPEX alignment, CAPEX breakdown을 포함합니다. ([Assets][1])

---

## 9.2 V7 산식

```text
S_V7 =
S_transition_capex
× S_financial_traceability
× S_brown_capex_control
```

곱셈 구조를 쓰는 이유는 세 요소가 대체재가 아니기 때문입니다.
전환투자를 주장하더라도 재무제표에서 추적되지 않거나, 동시에 고탄소 lock-in 투자를 관리하지 않으면 자본배분 신뢰도가 낮아집니다.

---

## 9.3 적용 대상

| 기업 유형                    | V7 적용                             |
| ------------------------ | --------------------------------- |
| `transition_capex` 태그 기업 | 적용                                |
| `cbam_ets_exposed` 태그 기업 | 적용                                |
| G1, G2, G3, G5, G6, G8   | 원칙 적용                             |
| G11 금융업                  | 물리적 CapEx 대신 전환금융·포트폴리오 자본배분으로 적용 |
| G10, G12 low-direct 서비스  | 기후투자 주장 또는 데이터센터·설비투자 공시가 있을 때 적용 |
| 적용 근거 없음                 | V7은 NA, 단 가중치 재정규화 대상             |

---

## 9.4 `S_transition_capex` 구하는 법

### 9.4.1 일반기업

|   점수 | 판정 기준                                   |
| ---: | --------------------------------------- |
|  1.0 | 전환투자 금액 또는 비율, 투자내용, 대상기간, 기후목적이 모두 공시됨 |
| 0.75 | 금액 또는 비율과 투자내용은 있으나 기간 또는 감축효과가 없음      |
|  0.5 | 재생에너지, 설비전환, 에너지효율 등 정성 설명만 있음          |
|    0 | 전환투자 공시 없음                              |

**전환투자로 인정하는 항목**

| 인정            | 조건                        |
| ------------- | ------------------------- |
| 재생에너지 설비 투자   | 발전설비, PPA 인프라, 재생전력 조달 설비 |
| 에너지효율 설비 투자   | 고효율 장비, 공정효율화, 폐열회수       |
| 저탄소 공정 전환     | 전기로, 수소환원, CCUS, 저탄소 원료   |
| 전동화·저탄소 제품 전환 | EV, 배터리, 저탄소 제품 생산설비      |
| 건물 에너지 성능 개선  | 고효율 냉난방, BEMS, 단열, 설비교체   |
| 운송수단 전환       | 전기·수소 차량, 저탄소 연료 인프라      |

**인정하지 않는 항목**

| 불인정        | 이유          |
| ---------- | ----------- |
| ESG 경영 강화  | 투자대상 불명     |
| 친환경 사업 추진  | 금액·대상·기간 불명 |
| 연구개발 일반    | 기후목적 불명     |
| 사회공헌성 환경활동 | CapEx 아님    |
| 단순 구매계약    | 자본배분 증거 부족  |

---

### 9.4.2 금융업

금융업은 물리적 CapEx보다 **전환금융·녹색금융·포트폴리오 자본배분**을 봅니다.

|   점수 | 판정 기준                                 |
| ---: | ------------------------------------- |
|  1.0 | 녹색금융·전환금융 금액, 대상분야, 기간, 포트폴리오 기준이 공시됨 |
| 0.75 | 금액과 대상분야는 있으나 포트폴리오 기준 또는 기간이 약함      |
|  0.5 | 녹색금융 정책 또는 상품 설명만 있음                  |
|    0 | 관련 공시 없음                              |

---

## 9.5 `S_financial_traceability` 구하는 법

### 9.5.1 일반기업

ESG 보고서의 전환투자 주장을 DART 사업보고서 또는 재무제표 주석과 대조합니다.

|   점수 | 판정 기준                                                               |
| ---: | ------------------------------------------------------------------- |
|  1.0 | ESG 보고서의 투자금액이 DART 사업보고서·재무제표 주석의 계정과 동일 연도·동일 경계에서 연결되고 차이가 5% 이하 |
| 0.75 | 금액은 정확히 맞지 않지만 사업보고서의 설비투자·유형자산·건설중인자산·투자활동 현금흐름에서 해당 투자 성격이 확인됨    |
|  0.5 | DART에 관련 투자 계정은 있으나 ESG 보고서 주장과 직접 연결 불가                            |
|    0 | DART에서 관련 근거를 찾을 수 없거나 주장과 재무자료가 충돌                                 |

**확인할 DART 항목**

| 항목           | 확인 목적              |
| ------------ | ------------------ |
| 사업보고서 사업의 내용 | 투자 대상 사업·제품 확인     |
| 투자활동 현금흐름    | 설비투자·유형자산 취득 규모 확인 |
| 유형자산 주석      | 설비·건설중인자산 증가 확인    |
| 무형자산 주석      | 기술·소프트웨어 투자 확인     |
| 건설중인자산       | 대규모 설비 전환 확인       |
| 연구개발비        | 기후 관련 R&D 주장 보조 확인 |
| 세그먼트 정보      | 사업부문별 투자 연결        |

OpenDART는 기업개황, 공시검색, 사업보고서 등 전자공시 API 경로를 제공하므로 ESG 보고서의 자본투자 주장을 공시자료와 연결하는 기준 출처로 사용합니다. ([OPENDART][4])

---

### 9.5.2 금융업

|   점수 | 판정 기준                                          |
| ---: | ---------------------------------------------- |
|  1.0 | 녹색금융·전환금융 금액이 사업보고서, 재무제표 주석, 지속가능금융 보고자료와 연결됨 |
| 0.75 | 금액은 있으나 사업보고서와 일부만 연결됨                         |
|  0.5 | 정책과 상품은 있으나 재무수치 연결 약함                         |
|    0 | 근거 없음                                          |

---

## 9.6 `S_brown_capex_control` 구하는 법

### 9.6.1 일반기업

|   점수 | 판정 기준                                                     |
| ---: | --------------------------------------------------------- |
|  1.0 | 고탄소 lock-in 투자 리스크를 식별하고, 축소·전환·폐쇄·대체 계획을 정량 또는 일정과 함께 공시 |
| 0.75 | 고탄소 투자 리스크를 식별하고 정성적 관리방안을 공시                             |
|  0.5 | 고탄소 투자 관련 공시가 없고, 신규 고탄소 투자도 확인되지 않음                      |
|    0 | 신규 석탄, 화석연료 확장, 고탄소 설비 증설이 확인되나 전환·관리계획 없음                |

**Brown CapEx로 보는 항목**

| 항목                  | 판정                          |
| ------------------- | --------------------------- |
| 석탄발전 신규·수명연장 투자     | Brown                       |
| 화석연료 생산·정제능력 확대     | Brown                       |
| 고탄소 공정 설비 증설        | Brown                       |
| 내연기관 중심 생산능력 확대     | 산업 상황에 따라 Brown             |
| 탄소포집 없는 고배출 설비 장기투자 | Brown                       |
| 단순 유지보수             | Brown 아님, 단 수명연장 효과가 있으면 검토 |

---

### 9.6.2 금융업

|   점수 | 판정 기준                                             |
| ---: | ------------------------------------------------- |
|  1.0 | 석탄·화석연료 금융 제한정책, 포트폴리오 감축목표, sector policy가 모두 있음 |
| 0.75 | 제한정책은 있으나 포트폴리오 감축목표가 약함                          |
|  0.5 | 일반 ESG 여신정책만 있음                                   |
|    0 | 고탄소 익스포저 확대 또는 제한정책 없음                            |

---

## 9.7 V7 최종 처리

| 상황                          | 처리                             |
| --------------------------- | ------------------------------ |
| 적용대상 산업인데 전환투자 공시 없음        | `S_transition_capex = 0`       |
| 적용대상 아니고 투자 주장도 없음          | V7 = NA, 가중치 재정규화              |
| 투자 주장 있음, DART 근거 없음        | `S_financial_traceability = 0` |
| 투자 주장 있음, Brown CapEx 관리 없음 | `S_brown_capex_control ≤ 0.5`  |
| 금융업                         | CapEx 대신 전환금융·포트폴리오 자본배분으로 계산  |

---

## 10. V8 배출량 산정·보고경계 투명성

### 10.1 목적

배출량 숫자가 비교 가능하고 재현 가능한 방식으로 산정됐는지 평가합니다.

---

### 10.2 구성요소

| 구성요소        | 1점                            | 0.5점       | 0점 |
| ----------- | ----------------------------- | ---------- | -- |
| 조직경계        | 연결/별도/사업장 경계 명시               | 일부 명시      | 없음 |
| 운영경계        | 운영통제/재무통제/지분율 접근법 명시          | 일부 명시      | 없음 |
| 재무제표 경계 정합성 | 재무제표 경계와 일치 또는 차이 설명          | 일부 설명      | 없음 |
| 산정기준        | GHG Protocol, ISO, K-ETS 등 명시 | 자체기준만 있음   | 없음 |
| 배출계수        | 국가계수, IPCC, IEA 등 출처 명시       | 일부만 명시     | 없음 |
| Scope 2 방식  | location/market 모두 또는 명확히 구분  | 하나만 명시     | 없음 |
| 재작성 여부      | 재작성 여부와 사유 명시                 | 재작성 여부만 명시 | 없음 |

---

### 10.3 산식

```text
S_V8 = geometric_mean(
  B_organizational_boundary,
  B_operational_boundary,
  B_financial_boundary_alignment,
  B_calculation_standard,
  B_emission_factor,
  B_scope2_method,
  B_restatement_disclosure
)
```

IFRS S2 관련 교육자료는 지속가능성 공시와 재무제표 보고기업 경계의 연결을 설명하며, 배출량 정보가 기업 전망에 미치는 기후 관련 위험·기회와 연결되어야 함을 강조합니다. ([IFRS Foundation][8])

---

## 11. V9 제3자 검증·데이터 신뢰성

### 11.1 목적

배출량과 핵심 기후정보가 독립적으로 검증됐는지 평가합니다.

CDP는 verification에서 검증 여부뿐 아니라 검증 statement, page/section reference, relevant standard, 검증된 배출량 비율 등을 평가합니다. ([Assets][1])

---

### 11.2 산식

```text
S_V9 =
S_assurance_existence
× S_assurance_quality
× S_scope_coverage
```

---

### 11.3 `S_assurance_existence`

| 상태           | 점수 |
| ------------ | -: |
| 독립 제3자 검증 있음 |  1 |
| 독립 검증 없음     |  0 |

---

### 11.4 `S_assurance_quality`

| 상태                   |  점수 |
| -------------------- | --: |
| Reasonable assurance | 1.0 |
| Limited assurance    | 0.7 |
| 검증 있음, 수준 불명         | 0.4 |
| 검증 없음                |   0 |

---

### 11.5 `S_scope_coverage`

```text
S_scope_coverage =
0.4 × A_scope1
+ 0.4 × A_scope2
+ 0.2 × A_scope3_material
```

| 항목                  | 1점                          | 0.5점            | 0점            |
| ------------------- | --------------------------- | --------------- | ------------- |
| `A_scope1`          | Scope 1 검증범위 명시             | 검증 언급 있으나 범위 불명 | 검증 없음         |
| `A_scope2`          | Scope 2 검증범위 명시             | 검증 언급 있으나 범위 불명 | 검증 없음         |
| `A_scope3_material` | 산업별 중요 Scope 3 전부 또는 대부분 검증 | Scope 3 일부 검증   | Scope 3 검증 없음 |

---

## 12. P1 탄소크레딧 의존도

P1은 독립 변수로 계산하지 않고, V3의 `B_credit_transparency`에 흡수합니다.

| 상태                        | 처리         |
| ------------------------- | ---------- |
| 넷제로·순배출 목표 없음             | 감점 없음      |
| 넷제로·순배출 목표 있음 + 사용 안 함 명시 | 감점 없음      |
| 사용 계획·의존도·유형·인증제도 구체 공시   | 감점 없음      |
| 사용 계획은 있으나 정량 의존도 없음      | V3 부분 감점   |
| 사용 여부 불명                  | V3 해당 항목 0 |
| 순배출 목표가 총배출 목표를 가림        | V3 해당 항목 0 |

---

## 13. P2 출처 불일치·그린워싱 플래그

### 13.1 목적

보고서 주장과 GIR·DART·검증의견서가 충돌하는 경우 해당 변수의 신뢰도를 낮춥니다.

---

### 13.2 산식

```text
S_adjusted_v = S_v × K_P2,v
```

---

### 13.3 `K_P2,v` 판정

| 상황                            |         계수 |
| ----------------------------- | ---------: |
| 불일치 없음                        |        1.0 |
| 동일 연도·동일 경계에서 5% 초과 차이, 설명 있음 |        0.9 |
| 동일 연도·동일 경계에서 5% 초과 차이, 설명 없음 |        0.8 |
| 단위·경계 오류 의심, 수동검수 전           |        0.6 |
| 핵심 수치 신뢰 불가                   | 해당 변수 산출불가 |

---

### 13.4 적용 위치

| 불일치 유형                                | 적용 변수      |
| ------------------------------------- | ---------- |
| GIR vs 보고서 Scope 1·2 차이               | V1, V8, V9 |
| Scope 3 총량 vs 카테고리 합계 차이              | V2, V8     |
| ESG 보고서 Green CapEx 주장 vs DART 근거 불일치 | V7         |
| 검증범위와 보고 배출량 범위 불일치                   | V9         |
| 연결/별도 경계 혼재                           | V1, V8     |

---

## 14. 가중치 산정 변수 정의

### 14.1 원칙

가중치는 임의로 정하지 않습니다. CDP 2025 Climate Change scoring methodology의 질문별 point allocation을 CERs 변수에 매핑해 산출합니다.

---

### 14.2 입력 변수

| 변수                           | 정의                                   |
| ---------------------------- | ------------------------------------ |
| `cdp_question_id`            | CDP 질문 ID                            |
| `cdp_module`                 | CDP 모듈                               |
| `cdp_sector`                 | CDP sector notation                  |
| `cers_variable_id`           | V1~V9                                |
| `mapping_strength_q,v`       | 질문 q가 변수 v에 대응되는 정도                  |
| `management_denominator_q,g` | 산업군 g에서 질문 q의 Management denominator |
| `leadership_denominator_q,g` | 산업군 g에서 질문 q의 Leadership denominator |
| `included_in_weighting`      | 가중치 산정 포함 여부                         |

---

### 14.3 `mapping_strength_q,v`

|   값 | 의미                      |
| --: | ----------------------- |
| 1.0 | 질문의 핵심 목적이 해당 변수와 직접 대응 |
| 0.5 | 질문 일부가 해당 변수와 대응        |
|   0 | 대응 없음                   |

---

### 14.4 산식

```text
RawWeight_v,g =
Σ_q [
  mapping_strength_q,v
  × (management_denominator_q,g + leadership_denominator_q,g)
]
```

```text
W_v,g =
RawWeight_v,g / Σ_v RawWeight_v,g
```

Disclosure point를 중심 가중치로 쓰지 않는 이유는 단순 공시량이 많은 기업이 고득점 받는 문제를 피하기 위해서입니다. CERs는 투자자 설득 기준으로 관리체계와 실행력을 보려 하므로 Management와 Leadership denominator만 사용합니다.

---

## 15. 산출 상태

| 상태              | 조건                           | 처리                 |
| --------------- | ---------------------------- | ------------------ |
| Full Index      | V1, V3, V5, V6, V8, V9 산출 가능 | Index 표시           |
| Limited Index   | V1은 가능하나 V6, V7, V9 중 일부 결측  | Index + Limited 표시 |
| Disclosure Only | 배출량 없이 목표·정성공시만 있음           | Index 미표시          |
| Universe Only   | 기업 식별만 가능                    | 점수 없음              |
| Excluded        | SPAC, ETF, ETN 등             | 제외                 |

KRX ESG 포털은 유가증권 상장기업의 ESG 보고서와 ESG 관련 정보를 조회할 수 있는 공식 경로이므로 지속가능경영보고서 탐색 경로로 사용합니다. ([ESG 포털][9])

---

## 16. V7만 다시 요약

V7에 들어가는 3개 변수는 이렇게 구합니다.

```text
S_V7 =
S_transition_capex
× S_financial_traceability
× S_brown_capex_control
```

| 변수                         | 구하는 법                                                             |
| -------------------------- | ----------------------------------------------------------------- |
| `S_transition_capex`       | ESG/지속가능경영보고서에서 전환투자 금액·비율·내용·기간·기후목적을 확인                         |
| `S_financial_traceability` | 해당 투자 주장이 DART 사업보고서, 재무제표 주석, 투자활동 현금흐름, 유형자산·건설중인자산 등과 연결되는지 확인 |
| `S_brown_capex_control`    | 고탄소 lock-in 투자 리스크를 식별·관리하는지, 신규 고탄소 투자 확대가 있는지 확인                |

**V7은 Priority Conditional입니다.**
즉, 중요하지만 전체 상장사에서 항상 산출 가능한 Core 변수는 아닙니다. 적용 산업 또는 투자 주장이 있는 경우 산출하고, 적용 근거가 없으면 NA 후 가중치를 재정규화합니다.

[1]: https://assets.ctfassets.net/v7uy4j80khf8/3hLrhDWAPMGZLanyUd9eg4/6d113562548361be495865d0dd851481/CDP_Full_Corporate_Scoring_Methodology_2025_-_Climate_change.pdf?utm_source=chatgpt.com "CDP Full Corporate Scoring Methodology 2025"
[2]: https://ghgprotocol.org/corporate-value-chain-scope-3-standard?utm_source=chatgpt.com "Corporate Value Chain (Scope 3) Standard"
[3]: https://ghgprotocol.org/sites/default/files/2022-12/Chapter15.pdf?utm_source=chatgpt.com "Category 15: Investments"
[4]: https://opendart.fss.or.kr/guide/detail.do?apiGrpCd=DS001&apiId=2019002&utm_source=chatgpt.com "개발가이드 - 공시정보 - 기업개황 - OpenDART - 금융감독원"
[5]: https://www.gir.go.kr/eng/index.do?menuId=9&utm_source=chatgpt.com "Greenhouse Gas Inventory & Research Center of Korea"
[6]: https://files.sciencebasedtargets.org/production/files/SBTi-Corporate-Manual-v2.1.pdf?utm_source=chatgpt.com "SBTi CORPORATE MANUAL"
[7]: https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards-issb/english/2023/issued/part-a/issb-2023-a-ifrs-s2-climate-related-disclosures.pdf?bypass=on&utm_source=chatgpt.com "issb-2023-a-ifrs-s2-climate-related-disclosures. ..."
[8]: https://www.ifrs.org/content/dam/ifrs/supporting-implementation/ifrs-s2/ghg-ifrs-s2-educational-material.pdf?utm_source=chatgpt.com "Greenhouse Gas Emissions Disclosure requirements ..."
[9]: https://esg.krx.co.kr/?utm_source=chatgpt.com "ESG 포털"
