# Cer’s Index 목적

: 탄소 감축에 기여도를 수치로 확인하여 향후 금융거래에 참조정보로 활용

- 기업이 탄소감축을 위해 얼마나 성실하게 임했는가(정책, 활동 등)
- 실제 탄소배출량이 많이 줄었는가
- 실제 활동의 효과
    - 예를 들어, 기대효과 대비 실제 감축 정도에 따른 가중치 또는 패널티 등

# (미확정)KPI

<aside>
📃

1. **탄소 성과(Carbon Performance):** **실제 온실가스 배출량의 수치적 변화**를 의미한다. 이는 Scope 1, 2, 3 배출량의 절대값 감소나 매출액 대비 집약도(Intensity)의 개선으로 나타난다. 탄소 성과는 '과거의 결과(Lagging Indicator)'이며, 기업의 실제 환경 부하를 대변한다.
2. **탄소 경영(Carbon Management):** **탄소 감축을 달성하기 위한 조직의 전략, 정책, 프로세스, 목표 설정을 의미**한다. 이는 거버넌스 구축, 내부 탄소 가격제 도입, 임직원 교육, 공급망 협력 프로그램 등을 포함한다. 탄소 경영은 '미래의 성과를 예측하는 선행 지표(Leading Indicator)'로서의 성격을 가진다.
</aside>

## PCRC (Practical Carbon Reduction Contribution) 모델 개발

본 연구는 앞선 분석과 이론적 배경을 바탕으로 금융 거래 참조용 KPI 모델인 **PCRC(Practical Carbon Reduction Contribution)** 모델을 제안한다. 이 모델은 데이터의 가용성에 따라 유연하게 적용 가능하며, 기업의 현재 성과와 미래 잠재력을 동시에 평가하도록 설계되었다.

### 4.1. 모델의 구조 및 수식

PCRC 점수는 100점 만점으로 환산되며, 크게 세 가지 핵심 모듈의 가중 합으로 구성된다.

$PCRC = (w_1 \times RI) + (w_2 \times TAG) + (w_3 \times MMS)$

여기서,

- $RI$ (Reduction Intensity Score): 감축 집약도 점수 (60%)
- $TAG$ (Target Alignment Gap Score): 목표 정렬 격차 점수 (20%)
- $MMS$ (Management Maturity Score): 경영 성숙도 점수 (20%)

가중치($w$)는 금융 상품의 성격(단기 대출 vs 장기 투자)에 따라 조정될 수 있으나, 기본 모델에서는 실질적인 효율성 개선($RI$)에 가장 높은 비중을 둔다.

### 4.2. 세부 지표 산출 로직

### 4.2.1. RI (Reduction Intensity): 효율성 기반 실적 평가

절대 배출량의 변화가 아닌, 기업의 경제 활동 단위당 배출 효율성의 개선도를 측정한다.

$RI_{score} = \text{Base Score} + \left( \frac{Intensity_{t-1} - Intensity_{t}}{Intensity_{t-1}} \times 100 \times \alpha \right)$

- **지표 정의:** $Intensity = \frac{\text{Scope 1+2 배출량}}{\text{매출액(또는 생산량)}}$
- **평가 논리:** 매출이 성장하면서 배출량이 늘어나는 경우라도, 집약도가 개선되었다면 긍정적으로 평가한다. 아시아나항공과 같이 가동률 회복기에는 매출액 기준 집약도가 적합하며, 제조업은 생산량 기준이 이상적이나 데이터 부재 시 매출액을 대용치로 사용한다.
- **산업 보정:** $\alpha$는 산업별 난이도 계수이다. Hard-to-Abate 산업(철강, 항공)은 작은 개선에도 높은 가점을 부여하기 위해 $\alpha > 1$을 적용한다.

**초기 α(시드) 제안표 : 나중에 데이터 기반 보완 예정**

| 티어 | α(초기) | 업종(사용자 분류 기준) | 이유(요약) |
| --- | --- | --- | --- |
| Very hard | **1.15** | 금속, 비금속, 화학 | 공정배출/고온열/대체기술 성숙도 이슈(대표 HTA) |
| Hard | **1.10** | 전기/가스, 운송/창고 | 설비·인프라 전환/외부 시스템 의존(전력믹스, 연료) |
| Medium | **1.05** | 건설, 기계/장비, 운송장비/부품, 종이/목재, 전기/전자 | 공정 다양·공급망 영향 크지만 레버는 존재 |
| Easier | **1.00** | 유통, 음식료/담배, 섬유/의류, 제약, 일반서비스, 오락/문화 | 운영배출 비중 낮거나 효율/전환 레버 상대적으로 용이 |
| Very easy | **0.95** | IT서비스, 통신, 금융, 부동산 | Scope1 작고 Scope2 중심(구매전력/RE 조달로 개선 가능), 운영 감축 난이도 낮은 편 |

### 4.2.2. TAG (Target Alignment Gap): 목표 달성 및 경로 이행도

기업이 제시한 감축 목표가 과학적 근거(SBTi 등)에 부합하는지, 그리고 실제 이행 경로가 목표 선상에 있는지를 평가한다.

$TAG_{score} = \begin{cases} 100 & (\text{if } \text{실제} \ge \text{목표}) \\ \left( \frac{\text{실제 감축률}}{\text{목표 감축률}} \right) \times 100 & (\text{if } \text{실제} < \text{목표}) \end{cases}$

- **목표 기준:** LG와 같이 2030년 중간 목표가 명확한 경우 선형 보간법을 통해 당해 연도 목표치를 산출하여 비교한다.
- **패널티:** 목표를 미달한 경우뿐만 아니라, 목표가 지나치게 보수적(Business As Usual 대비 개선 없음)인 경우에도 점수를 차감한다.

### 4.2.3. MMS (Management Maturity Score): 정성적 경영 역량 평가

제한된 정량 데이터의 신뢰성을 보완하기 위해 탄소 경영의 질적 수준을 점수화한다. 이는 CDP나 EcoVadis의 평가 방법론을 차용하여 간소화한 것이다.

| **평가 항목** | **세부 기준 (각 2.5점, 총 10점 만점 후 100점 환산)** | **확인 근거 (데이터 소스)** |
| --- | --- | --- |
| **데이터 신뢰성** | 제3자 검증 여부 (KMR, KSA 등) | 검증 의견서 유무 |
| **커버리지** | Scope 3 산정 및 관리 범위 (공급망 포함 여부) | ESG 보고서 내 Scope 3 표기 |
| **전략적 통합** | 내부 탄소 가격제(ICP) 또는 MAC 활용 여부 | LG의 경제성 분석 사례 등 |
| **거버넌스** | C-Level 보상 연동 및 전담 조직 유무 | 이사회 활동 내역 및 보수 규정 |

+데이터 누락 케이스 로직 추가 보완 예정

### **5.2. 시뮬레이션 결과 및 평점**

### **5.2.1. LG그룹: 전략적 투자와 성과의 선순환 (PCRC 점수: 88/100)**

- **RI (35/40):** 2018년 대비 19.3% 감축, 전년 대비 24% 감소라는 압도적인 수치를 기록했다. 매출 성장을 고려한 집약도 개선 효과는 더욱 클 것으로 추정된다.
- **TAG (28/30):** 2030년 목표 달성을 위해 선형 경로를 상회하는 감축 실적을 보이고 있다. 특히 재생에너지 전환율 30% 조기 달성은 목표 정렬 격차를 좁히는 핵심 요인이다.
- **MMS (25/30):** 비용-편익 분석(CBA)과 한계저감비용(MAC)을 활용한 정교한 투자 결정 시스템은 최고 수준의 경영 성숙도를 보여준다. 2,188억 원의 대규모 투자는 실행 의지를 강력하게 뒷받침한다.

### **5.2.2. 세아홀딩스: 고효율 공정의 내실 있는 관리 (PCRC 점수: 76/100)**

- **RI (30/40):** 철강 산업의 평균적인 고로 공정 대비 전기로 공정의 낮은 배출 집약도를 유지하고 있다. 고철 재활용률 100%는 집약도 방어에 결정적이다.
- **TAG (22/30):** 2050 넷제로를 선언했으나, Scope 2 비중이 높아 전력 시장 상황에 따른 불확실성이 존재한다. 자체 감축보다는 외부 요인(그리드) 의존도가 높아 목표 달성 리스크가 일부 반영되었다.
- **MMS (24/30):** 윤리 경영 인증과 Scope 3 관리 확대 등 거버넌스 측면에서 높은 점수를 받았다. EPD 인증 확대로 제품 단위 데이터 신뢰성을 확보한 점이 긍정적이다.

### **5.2.3. 아시아나항공: 효율 개선과 절대 배출의 괴리 (PCRC 점수: 68/100)**

- **RI (28/40):** 신기재 도입으로 연료 효율(RTK당 배출량 등)은 개선되었으나, 여객 수요 폭증으로 인한 절대 배출량 증가(50%↑)가 감점 요인이다. 다만 매출액 대비 집약도는 0.84 수준으로 관리되고 있어 일정 부분 방어했다.
- **TAG (18/30):** SAF 도입을 시작했으나 아직 초기 단계(1% 미만 혼합 등)이며, 2030/2050 목표 달성을 위한 구체적인 SAF 확보 물량이나 경로의 불확실성이 높다.
- **MMS (22/30):** 안전위원회와 연계된 기후 리스크 관리, TCFD 공시 충실도는 우수하나, 지배구조 변경(대한항공 인수)에 따른 전략 지속성 리스크가 존재한다.

### **참고 자료**

1. SBTi FINANCIAL SECTOR AND TCFD REPORTING GUIDANCE, https://files.sciencebasedtargets.org/production/files/TCFC-reporting-guidance.pdf
2. 2024 Progress Report on Climate Related Disclosures, https://www.fsb.org/uploads/P121124.pdf
3. Carbon Accounting Methodologies for Measuring Emissions - Net0, https://net0.com/blog/carbon-accounting-methodologies
4. Improving Greenhouse Gas Emissions Data, https://www.ngfs.net/sites/default/files/medias/documents/ngfs_information_note_on_improving_ghg_emission_data.pdf
5. (최종)세아홀딩스_2025Factbook(KOR)_Oct_vFFFF.pdf
6. Decarbonising Steel: Market Primer - Baker McKenzie, https://www.bakermckenzie.com/-/media/files/insight/publications/resources/decarbonising-steel/decarbonising-steel-report.pdf
7. Reducing emissions from aviation - EU Climate Action, https://climate.ec.europa.eu/eu-action/transport-decarbonisation/reducing-emissions-aviation_en
8. Shaping the Path Beyond the Edges - LG, https://www.lgcorp.com/images/esg_en/download/LG%20Net%20Zero%20Special%20Reporting%202024_EN.pdf
9. LG Chem’s Sustainability Management Outcomes in 2024, https://blog.lgchem.com/en/2025/09/05_esg/
10. Your guide to carbon accounting vs carbon management, https://www.zunocarbon.com/blog/carbon-accounting-vs-carbon-management
11. Understanding the Difference: Carbon Accounting vs ... - NetNada, https://www.netnada.com/post/understanding-the-difference-carbon-accounting-vs-carbon-management-explained
12. Carbon Management vs. Carbon Accounting – What's the difference?, https://www.carbonfact.com/blog/knowledge/carbon-management-vs-carbon-accounting
13. Financed Emissions – Unlisted Equity - Sumday, https://www.sumday.io/blog/financed-emissions-unlisted-equity/
14. Mastering PCAF Carbon Footprint Calculation for Banks - Seneca ESG, https://senecaesg.com/insights/mastering-pcaf-carbon-footprint-calculation-for-banks-a-step-by-step-guide/
15. What are some key performance indicators (KPIs) used to assess ..., https://www.green.earth/faq/what-are-some-key-performance-indicators-kpis-used-to-assess-the-success-of-carbon-offset-initiatives
16. A comprehensive guide to ESG KPIs and metrics: turning data into ..., https://ctrlprint.com/news/a-comprehensive-guide-to-esg-kpis-and-metrics-turning-data-into-measurable-impact-1
17. Absolute Emissions vs. Carbon Intensity - Workiva, https://www.workiva.com/blog/absolute-emissions-vs-carbon-intensity
18. The Use of Carbon Emission Data to Achieve Portfolio Goals, https://rpc.cfainstitute.org/sites/default/files/docs/research-reports/nzg_5_scopeofnetzero_furdak_online.pdf
19. Documentation-of-target-setting-methods.pdf, https://files.sciencebasedtargets.org/production/files/Documentation-of-target-setting-methods.pdf?dm=1742292387
20. Understand your score as a disclosing company - CDP Help Center, https://help.cdp.net/en-us/knowledgebase/article/KA-01160
21. EcoVadis, the rating platform assessing ESG - Apiday, https://www.apiday.com/blog-posts/the-guide-to-ecovadis-certification-frequently-asked-questions
22. Understanding the EcoVadis Rating Methodology - Sunhat, https://www.getsunhat.com/blog/ecovadis-rating-system
23. Sustainability-Linked Loan Framework - Macquarie University, https://www.mq.edu.au/__data/assets/pdf_file/0004/1279741/MQSustainabilityLinkLoanFramework_Web.pdf
24. Climate-related Financial Risk Factors in Compensation Frameworks, https://www.fsb.org/uploads/P204023.pdf
25. Sustainability-Linked Loan: Definition & How to obtain - Regreener,https://www.regreener.earth/blog/sustainability-linked-loan-definition-how-to-obtain