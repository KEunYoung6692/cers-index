import { isLanguage, type Language } from "@/lib/i18n";

const LOGIC_HTML_BY_LANGUAGE: Record<Language, string> = {
  KR: String.raw`<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Cer’s Index 산출 가이드</title>

  <!-- KaTeX (수식 렌더링) -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
          onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false}]});"></script>

  <style>
    :root { --fg:#111; --muted:#666; --border:#e5e7eb; --bg:#fff; --code:#0b1020; --codebg:#f6f8fa; }
    body { margin:0; padding:32px 18px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
           color:var(--fg); background:var(--bg); line-height:1.65; }
    main { max-width: 980px; margin: 0 auto; }
    h1 { font-size: 28px; margin: 0 0 8px; }
    h2 { font-size: 20px; margin: 28px 0 10px; padding-top: 10px; border-top: 1px solid var(--border); }
    h3 { font-size: 16px; margin: 18px 0 8px; }
    p { margin: 8px 0; }
    .meta { color: var(--muted); font-size: 13px; margin-bottom: 20px; }
    .callout { border:1px solid var(--border); border-radius: 10px; padding: 12px 14px; background:#fafafa; }
    .formula { padding: 10px 12px; border:1px dashed var(--border); border-radius: 10px; background:#fff; overflow-x:auto; }
    code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    pre { background: var(--codebg); padding: 10px 12px; border-radius: 10px; overflow:auto; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0 0; }
    th, td { border: 1px solid var(--border); padding: 10px 10px; vertical-align: top; }
    th { background: #fafafa; text-align: left; }
    a { color:#0b57d0; text-decoration: none; }
    a:hover { text-decoration: underline; }
    ol { margin: 8px 0 0 20px; }
    .small { font-size: 13px; color: var(--muted); }
    .hr { height:1px; background: var(--border); margin: 22px 0; }
  </style>
</head>

<body>
<main>
  <h1>Cer’s Index 산출 가이드</h1>
  

  <section class="callout">
    <p><strong>목적</strong>: 기업의 <em>탄소 감축 기여도</em>를 정량 점수(0–100)로 산출하여, <strong>금융거래(대출·투자) 의사결정의 참조 KPI</strong>로 활용합니다.</p>
  </section>

  <h2>1. 산식 개요 (최종 산식)</h2>
  <p>PCRC는 3개 모듈 점수의 가중합으로 정의합니다.</p>
  <div class="formula">$$\mathrm{PCRC}_i=\sum_{j}(x_{ij}\times w_j),\; j\in\{RI,\;TAG,\;MMS\}$$</div>
  <ul>
    <li><strong>RI</strong> (Reduction Intensity Score): 감축 집약도 점수 (기본 60%)</li>
    <li><strong>TAG</strong> (Target Alignment Gap Score): 목표 정렬 격차 점수 (기본 20%)</li>
    <li><strong>MMS</strong> (Management Maturity Score): 탄소경영 성숙도 점수 (기본 20%)</li>
    <li><strong>가중치 \(w_j\)</strong>: 2장에서 정의되는 최종 가중치로, 엔트로피 가중치법(EWM) 결과(또는 정책 입력)입니다.</li>
  </ul>

  <h2>2. 가중치 \(w\) 산정 로직 (엔트로피 가중치법, EWM)</h2>

  <h3>2.1. 도입 근거(논리)</h3>
  <p>
    정량평가에서 가중치가 전문가 주관에 좌우되면, 기관·평가자에 따라 결과가 달라지는
    “평가 불확실성(ambiguity)” 문제가 발생합니다. EWM은 지표별 기업 간 편차(변별력)가 큰 지표에
    더 큰 가중치를 부여하는 데이터 기반(객관식) 가중치 산정 방식으로, 금융기관의 스크리닝 목적과 정합적입니다.
  </p>

  <h3>2.2. 산식 (수정 없이 유지)</h3>
  <p class="small">\(m\): 비교대상 기업(또는 관측치) 수, \(j\in\{RI,TAG,MMS\}\)</p>
  <div class="formula">$$
\begin{aligned}
X &= [x_{ij}], \quad i=1,\dots,m,\;  \\
P_{ij} &= \frac{x_{ij}}{\sum_{r=1}^{m} x_{rj}} \\
k &= \frac{1}{\ln(m)} \\
E_j &= -k\sum_{i=1}^{m} P_{ij}\ln(P_{ij}) \\
d_j &= 1 - E_j \\
w_j &= \frac{d_j}{\sum_{j} d_j}
\end{aligned}
$$</div>
  <p class="small"><strong>표기 주의</strong>: 원식의 <strong>MSS</strong>는 본 문서의 <strong>MMS</strong>와 동일 의미로 사용합니다(원식 표기 유지).</p>
  <p class="small">
    <strong>시드 가중치(초기 정책 가중치)</strong> \(\,w_j^{(0)}\,\) 는 하이퍼 파라미터로서,
    EWM의 입력 행렬 \(X=[x_{ij}]\) 구성에만 사용합니다(예: \(x_{ij}=w_j^{(0)}\times S_{ij}\)).
  </p>
  <h3>2.3. 변수 주석(정의)</h3>
  <ul>
    <li>\(S_{ij}\): 기업 \(i\)의 모듈 \(j\) 점수(예: 0–100)</li>\n    <li>\(w_j^{(0)}\): <strong>시드 가중치(초기 정책 가중치)</strong> — 내부 파라미터(웹에서는 숨김)</li>\n    <li>\(x_{ij}\): EWM 입력용 <strong>가중 원점수</strong>로, \(x_{ij}=w_j^{(0)}\times S_{ij}\)</li>
    <li>\(P_{ij}\): 모듈 \(j\)에서 기업 \(i\) 점수의 비중(정규화 분포)</li>
    <li>\(E_j\): 모듈 \(j\)의 엔트로피(불확실성)</li>
    <li>\(d_j\): 모듈 \(j\)의 변별력(정보 효용)</li>
    <li>\(w_j\): 모듈 \(j\)의 최종 가중치</li>
  </ul>

  <h3>2.4. 운영 규칙(권장, 수식 변경 아님)</h3>
  <ul>
    <li><strong>비음수 조건</strong>: \(x_{ij}\ge 0\)을 전제(엔트로피 해석 가능성 확보)</li>
    <li><strong>0/결측 처리</strong>: \(\sum_r x_{rj}=0\)인 모듈은 분포 정의 불가 → 해당 회차 가중치 산정에서 제외하거나, 별도 정책(예: 고정 가중치) 적용</li>
    <li><strong>척도 통일</strong>: \(x_{ij}\) 스케일(0–100 등)을 모듈 간 일관되게 유지</li>
  </ul>

  <h2>3. 모듈별 산출 로직</h2>

  <h3>3.1. RI (Reduction Intensity) — 효율성 기반 실적(집약도 개선)</h3>
  <p>
    절대배출량은 경기/가동률/성장에 의해 왜곡될 수 있으므로, 경제활동 단위당 배출 효율(집약도)의
    개선율을 평가하여 기업의 탈동조화(Decoupling) 역량을 측정합니다.
  </p>
  <p><strong>정의</strong>: \(Intensity = \dfrac{\text{Scope 1+2 배출량}}{\text{분모(매출액 또는 생산량 등)}}\)</p>

  <p><strong>산식 (수정 없이 유지)</strong></p>
  <div class="formula">$$
RI_{score} = \text{Base Score} + \left( \frac{Intensity_{t-1} - Intensity_{t}}{Intensity_{t-1}} \times 100 \times \alpha \right)
$$</div>
  <ul>
    <li>\(t\): 평가연도, \(t-1\): 직전연도</li>
    <li><strong>Base Score</strong>: 운영상 상수(기본 0점 등)로 두되, 금융상품 목적에 따라 설정</li>
    <li>\(\alpha\): 산업 난이도 계수(Hard-to-Abate 업종에 가점)</li>
  </ul>

  <h3>3.2. TAG (Target Alignment Gap) — 목표 정렬 및 경로 이행도</h3>
  <p>
    기업 감축목표가 과학적 기준(예: SBTi)과 정합적인지, 실제 실적이 목표 경로(Linear Pathway)를
    준수하는지 평가합니다.
  </p>
  <p><strong>산식 (수정 없이 유지)</strong></p>
  <div class="formula">$$
TAG_{score} =
\begin{cases}
100 & (\text{if 실제} \ge \text{목표}) \\
\left( \dfrac{\text{실제 감축률}}{\text{목표 감축률}} \right)\times 100 & (\text{if 실제} < \text{목표})
\end{cases}
$$</div>
  <ul>
    <li>연도별 목표치가 명확할 경우 선형 보간법으로 해당 연도 목표치를 산정하여 비교</li>
    <li>BAU 수준으로 보수적인 목표는 정보량이 낮으므로 감점(정책 룰)</li>
  </ul>

  <h3>3.3. MMS (Management Maturity Score) — 탄소경영 성숙도(정성→정량)</h3>
  <p>
    데이터 기준/가용성의 차이로 횡적 비교가 어렵기 때문에, 탄소경영의 질적 수준(거버넌스·검증·커버리지·전략 통합)을 점수화하여
    미래 성과(leading indicator)를 보완합니다.
  </p>

  <table>
    <thead>
      <tr>
        <th style="width:18%">항목</th>
        <th>핵심 체크포인트(예시)</th>
        <th style="width:28%">근거/증빙</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>데이터 신뢰성</strong></td>
        <td>제3자 검증 여부 및 수준(Limited vs Reasonable Assurance)</td>
        <td>Assurance statement</td>
      </tr>
      <tr>
        <td><strong>커버리지</strong></td>
        <td>Scope 3 산정·관리 범위(핵심 카테고리 포함 여부)</td>
        <td>Scope 3 공시표/방법론</td>
      </tr>
      <tr>
        <td><strong>전략적 통합</strong></td>
        <td>ICP, MAC/CBA 등 의사결정 도구 활용</td>
        <td>내부 정책/투자 의사결정 프로세스</td>
      </tr>
      <tr>
        <td><strong>거버넌스</strong></td>
        <td>이사회/위원회 관여, KPI·보상 연동, 전담조직</td>
        <td>거버넌스 차트/보수규정/위원회 활동</td>
      </tr>
    </tbody>
  </table>

  <h2>4. 데이터 품질(신뢰도) 계층 — 결측/비대칭 환경 대응</h2>
  <p>정보 비대칭 환경에서 모델 안정성을 높이기 위해 “데이터 계층(Data Hierarchy)”를 적용합니다.</p>
  <ul>
    <li><strong>Level 1 (Verified Data)</strong>: 제3자 검증된 배출량 직접 입력 (가중치 100% 인정)</li>
    <li><strong>Level 2 (Self-Reported)</strong>: 기업 자체 공시 (신뢰도 할인율 10% 적용)</li>
    <li><strong>Level 3 (Proxy/Estimated)</strong>: 프록시·추정치 (신뢰도 할인율 30% 적용)</li>
  </ul>
  <p class="small">할인율 적용 위치(입력값 vs 점수)는 시스템 설계에서 일관되게 고정(감사 가능성 확보).</p>

  <h2>5. 구현(웹/DB) 관점의 최소 요구사항</h2>
  <h3>5.1. 필수 입력</h3>
  <ul>
    <li>연도 \(t, t-1\)의 Scope 1+2 배출량(단위 통일: tCO\(_2\)e)</li>
    <li>분모(매출액/생산량 등) 및 단위</li>
    <li>기준연도·목표연도 및 목표 감축률(또는 연도별 목표치)</li>
    <li>검증 여부/수준, Scope 3 커버리지, ICP/MAC/CBA, 거버넌스 증빙(문서/URL)</li>
  </ul>

  <h3>5.2. 감사 가능성(Auditability) — 권장 메타데이터</h3>
  <ul>
    <li>출처(보고서명/URL), 페이지/표/각주 위치</li>
    <li>산정경계(조직경계/운영경계), Scope 2 방법(시장기반/위치기반)</li>
    <li>배출계수 버전 및 적용 기준(국가/공급자)</li>
  </ul>

  <h2>6. 참고문헌(공식·권위 문서 중심)</h2>
  <ol>
    <li><a href="https://ghgprotocol.org/sites/default/files/standards/ghg-protocol-revised.pdf" target="_blank" rel="noopener">GHG Protocol — Corporate Accounting and Reporting Standard (Revised Edition)</a></li>
    <li><a href="https://ghgprotocol.org/sites/default/files/2023-03/Scope%202%20Guidance.pdf" target="_blank" rel="noopener">GHG Protocol — Scope 2 Guidance (PDF)</a></li>
    <li><a href="https://ghgprotocol.org/sites/default/files/standards/Corporate-Value-Chain-Accounting-Reporing-Standard_041613_2.pdf" target="_blank" rel="noopener">GHG Protocol — Corporate Value Chain (Scope 3) Standard (PDF)</a></li>
    <li><a href="https://files.sciencebasedtargets.org/production/files/Second-Consultation-CNZS-V2-Target-Setting-Methods-Documentation.pdf" target="_blank" rel="noopener">SBTi — Corporate Net-Zero Standard V2.0 Target-Setting Methods Documentation</a></li>
    <li><a href="https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards-issb/english/2023/issued/part-a/issb-2023-a-ifrs-s2-climate-related-disclosures.pdf?bypass=on" target="_blank" rel="noopener">IFRS/ISSB — IFRS S2 Climate-related Disclosures (June 2023)</a></li>
    <li><a href="https://assets.bbhub.io/company/sites/60/2021/10/FINAL-2017-TCFD-Report.pdf" target="_blank" rel="noopener">FSB/TCFD — Final Report: Recommendations of the TCFD (2017)</a></li>
    <li><a href="https://carbonaccountingfinancials.com/files/downloads/PCAF-Global-GHG-Standard.pdf" target="_blank" rel="noopener">PCAF — Global GHG Accounting and Reporting Standard for the Financial Industry (Part A: Financed Emissions, 2nd ed., 2022)</a></li>
    <li><a href="https://www.lma.eu.com/sustainable-lending/resources" target="_blank" rel="noopener">LMA — Sustainability-Linked Loan Principles / Guidance (Resources)</a></li>
    <li><a href="https://assets.ctfassets.net/v7uy4j80khf8/6njIGp3LOGfXHDs3AmzM2j/6d87731daccb0298f2cb73505398ff86/CDP_Full_Corporate_Scoring_Introduction_2025.pdf" target="_blank" rel="noopener">CDP — Full Corporate Scoring Introduction (2025)</a></li>
    <li><a href="https://resources.ecovadis.com/whitepapers/ecovadis-ratings-methodology-overview-and-principles-2022-neutral" target="_blank" rel="noopener">EcoVadis — Ratings Methodology Overview and Principles</a></li>
    <li><a href="https://ia803209.us.archive.org/27/items/bstj27-3-379/bstj27-3-379_text.pdf" target="_blank" rel="noopener">Shannon, C. E. (1948) — A Mathematical Theory of Communication</a></li>
    <li><a href="https://www.sciencedirect.com/science/article/abs/pii/S0377221703001462" target="_blank" rel="noopener">Xu, X. (2004) — Note on subjective/objective integrated approach (entropy in MCDM)</a></li>
  </ol>

  <div class="hr"></div>

</main>
</body>
</html>` ,
  EN: String.raw`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>PCRC — Cer’s Index Calculation Guide (EN)</title>

<!-- KaTeX (math rendering) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
        onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false}]});"></script>
  <style>
:root { --fg:#111; --muted:#666; --border:#e5e7eb; --bg:#fff; --code:#0b1020; --codebg:#f6f8fa; }
    body { margin:0; padding:32px 18px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
           color:var(--fg); background:var(--bg); line-height:1.65; }
    main { max-width: 980px; margin: 0 auto; }
    h1 { font-size: 28px; margin: 0 0 8px; }
    h2 { font-size: 20px; margin: 28px 0 10px; padding-top: 10px; border-top: 1px solid var(--border); }
    h3 { font-size: 16px; margin: 18px 0 8px; }
    p { margin: 8px 0; }
    .meta { color: var(--muted); font-size: 13px; margin-bottom: 20px; }
    .callout { border:1px solid var(--border); border-radius: 10px; padding: 12px 14px; background:#fafafa; }
    .formula { padding: 10px 12px; border:1px dashed var(--border); border-radius: 10px; background:#fff; overflow-x:auto; }
    code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    pre { background: var(--codebg); padding: 10px 12px; border-radius: 10px; overflow:auto; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0 0; }
    th, td { border: 1px solid var(--border); padding: 10px 10px; vertical-align: top; }
    th { background: #fafafa; text-align: left; }
    a { color:#0b57d0; text-decoration: none; }
    a:hover { text-decoration: underline; }
    ol { margin: 8px 0 0 20px; }
    .small { font-size: 13px; color: var(--muted); }
    .hr { height:1px; background: var(--border); margin: 22px 0; }
  </style>
</head>
<body>
<main>
  <h1>PCRC — Cer’s Index Calculation Guide</h1>
  <div class="meta">Examples/intro omitted · formulas, notation, rationale, references only</div>

  <section class="callout">
    <p><strong>Purpose</strong>: Quantify a company’s <em>practical contribution to carbon reduction</em> as a 0–100 reference score for financial decision-making (lending/investment).</p>
  </section>


<h2>1. Formula Overview (Final Definition)</h2>
<p>PCRC is defined as a weighted sum of three module scores.</p>
<div class="formula">$$\mathrm{PCRC}_i=\sum_{j}(x_{ij}\times w_j),\; j\in\{RI,\;TAG,\;MMS\}$$</div>
<ul>
  <li><strong>RI</strong> (Reduction Intensity Score): performance via intensity improvement (default 60%)</li>
  <li><strong>TAG</strong> (Target Alignment Gap Score): alignment between targets and realized trajectory (default 20%)</li>
  <li><strong>MMS</strong> (Management Maturity Score): quality/maturity of carbon management (default 20%)</li>
  <li><strong>Final weights \(w_j\)</strong>: final module weights defined in Section 2 (EWM output or policy input).</li>
</ul>

<h2>2. Weight Derivation \(w\) (Entropy Weight Method, EWM)</h2>
<h3>2.1 Rationale</h3>
<p>
  EWM is a data-driven weighting approach that assigns larger weights to modules with higher cross-company discrimination (information content),
  reducing reliance on purely subjective expert weights.
</p>

<h3>2.2 Equations (kept unchanged)</h3>
<p class="small">\(m\): number of companies/observations; \(j\in\{RI,TAG,MMS\}\)</p>
<div class="formula">$$
\begin{aligned}
X &= [x_{ij}], \quad i=1,\dots,m,\; j=\{\,j \mid RI,\; TAG,\; MSS\,\} \\
P_{ij} &= \frac{x_{ij}}{\sum_{r=1}^{m} x_{rj}} \\
k &= \frac{1}{\ln(m)} \\
E_j &= -k\sum_{i=1}^{m} P_{ij}\ln(P_{ij}) \\
d_j &= 1 - E_j \\
w_j &= \frac{d_j}{\sum_{j} d_j}
\end{aligned}
$$</div>
<p class="small"><strong>Notation</strong>: MSS is treated as equivalent to MMS (equation symbol kept as-is).</p>
<p class="small">
  <strong>Seed weights</strong> \(w_j^{(0)}\) are internal parameters used only to build \(X=[x_{ij}]\):
  \(x_{ij}=w_j^{(0)}\times S_{ij}\). Numerical seeds are intentionally undisclosed.
</p>

<h3>2.3 Variable definitions</h3>
<ul>
  <li>\(S_{ij}\): module score (e.g., 0–100)</li>
  <li>\(w_j^{(0)}\): seed weight (internal; hidden)</li>
  <li>\(x_{ij}\): weighted raw score for EWM input, \(x_{ij}=w_j^{(0)}\times S_{ij}\)</li>
  <li>\(w_j\): final weight</li>
</ul>

<h2>3. Module Computation</h2>
<h3>3.1 RI</h3>
<p><strong>Definition</strong>: \(Intensity = \dfrac{\text{Scope 1+2 emissions}}{\text{Denominator (revenue or output, etc.)}}\)</p>
<div class="formula">$$
RI_{score} = \text{Base Score} + \left( \frac{Intensity_{t-1} - Intensity_{t}}{Intensity_{t-1}} \times 100 \times \alpha \right)
$$</div>

<h3>3.2 TAG</h3>
<div class="formula">$$
TAG_{score} =
\begin{cases}
100 & (\text{if Actual} \ge \text{Target}) \\
\left( \dfrac{\text{Actual reduction rate}}{\text{Target reduction rate}} \right)\times 100 & (\text{if Actual} < \text{Target})
\end{cases}
$$</div>

<h3>3.3 MMS</h3>
<p>
  To complement limited quantitative data, MMS scores qualitative carbon management maturity
  (governance, verification, coverage, strategic integration) as a leading indicator.
</p>
<table>
  <thead>
    <tr>
      <th style="width:18%">Category</th>
      <th>Key checkpoints (examples)</th>
      <th style="width:28%">Evidence</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Data reliability</strong></td>
      <td>Third-party assurance and level (Limited vs Reasonable)</td>
      <td>Assurance statement</td>
    </tr>
    <tr>
      <td><strong>Coverage</strong></td>
      <td>Scope 3 coverage and management (key categories)</td>
      <td>Scope 3 disclosure table/methodology</td>
    </tr>
    <tr>
      <td><strong>Strategic integration</strong></td>
      <td>Use of ICP, MAC/CBA in decision making</td>
      <td>Internal policy/investment process</td>
    </tr>
    <tr>
      <td><strong>Governance</strong></td>
      <td>Board/committee involvement, KPI/comp linkage, dedicated team</td>
      <td>Governance chart, compensation policy, committee records</td>
    </tr>
  </tbody>
</table>

<h2>4. Data Quality Tiers — handling missing/asymmetric data</h2>
<p>Apply a data hierarchy to improve model stability in information-asymmetry environments.</p>
<ul>
  <li><strong>Level 1 (Verified Data)</strong>: third-party verified emissions (100% weight).</li>
  <li><strong>Level 2 (Self-Reported)</strong>: company-reported data (10% discount).</li>
  <li><strong>Level 3 (Proxy/Estimated)</strong>: proxy/estimated values (30% discount).</li>
</ul>
<p class="small">Keep the discount application point (inputs vs scores) consistent for auditability.</p>

<h2>5. Minimum Requirements (web/DB)</h2>
<h3>5.1 Required inputs</h3>
<ul>
  <li>Scope 1+2 emissions for years \(t\) and \(t-1\) (unit: tCO\(_2\)e)</li>
  <li>Denominator (revenue or production) and unit</li>
  <li>Base year, target year, and target reduction rate (or annual target path)</li>
  <li>Assurance status/level, Scope 3 coverage, ICP/MAC/CBA, governance evidence (docs/URLs)</li>
</ul>

<h3>5.2 Auditability — recommended metadata</h3>
<ul>
  <li>Source (report name/URL), page/table/footnote location</li>
  <li>Boundary (organizational/operational), Scope 2 method (market-based/location-based)</li>
  <li>Emission factor version and applied standard (country/supplier)</li>
</ul>


  <h2>References</h2>
  <ol>
  <li><a href="https://ghgprotocol.org/sites/default/files/standards/ghg-protocol-revised.pdf" target="_blank" rel="noopener">GHG Protocol — Corporate Accounting and Reporting Standard (Revised Edition)</a></li>
  <li><a href="https://ghgprotocol.org/sites/default/files/2023-03/Scope%202%20Guidance.pdf" target="_blank" rel="noopener">GHG Protocol — Scope 2 Guidance (PDF)</a></li>
  <li><a href="https://ghgprotocol.org/sites/default/files/standards/Corporate-Value-Chain-Accounting-Reporing-Standard_041613_2.pdf" target="_blank" rel="noopener">GHG Protocol — Corporate Value Chain (Scope 3) Standard (PDF)</a></li>
  <li><a href="https://files.sciencebasedtargets.org/production/files/Second-Consultation-CNZS-V2-Target-Setting-Methods-Documentation.pdf" target="_blank" rel="noopener">SBTi — Corporate Net-Zero Standard v2.0: Target-Setting Methods Documentation</a></li>
  <li><a href="https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards-issb/english/2023/issued/part-a/issb-2023-a-ifrs-s2-climate-related-disclosures.pdf?bypass=on" target="_blank" rel="noopener">IFRS/ISSB — IFRS S2 Climate-related Disclosures (June 2023)</a></li>
  <li><a href="https://assets.bbhub.io/company/sites/60/2021/10/FINAL-2017-TCFD-Report.pdf" target="_blank" rel="noopener">FSB/TCFD — Final Report: Recommendations of the TCFD (2017)</a></li>
  <li><a href="https://carbonaccountingfinancials.com/files/downloads/PCAF-Global-GHG-Standard.pdf" target="_blank" rel="noopener">PCAF — Global GHG Accounting and Reporting Standard for the Financial Industry (Part A: Financed Emissions, 2nd ed., 2022)</a></li>
  <li><a href="https://www.lma.eu.com/sustainable-lending/resources" target="_blank" rel="noopener">LMA — Sustainability-Linked Loan Principles / Guidance (Resources)</a></li>
  <li><a href="https://assets.ctfassets.net/v7uy4j80khf8/6njIGp3LOGfXHDs3AmzM2j/6d87731daccb0298f2cb73505398ff86/CDP_Full_Corporate_Scoring_Introduction_2025.pdf" target="_blank" rel="noopener">CDP — Full Corporate Scoring Introduction</a></li>
  <li><a href="https://resources.ecovadis.com/whitepapers/ecovadis-ratings-methodology-overview-and-principles-2022-neutral" target="_blank" rel="noopener">EcoVadis — Ratings Methodology Overview and Principles</a></li>
  <li><a href="https://ia803209.us.archive.org/27/items/bstj27-3-379/bstj27-3-379_text.pdf" target="_blank" rel="noopener">Shannon, C. E. (1948) — A Mathematical Theory of Communication</a></li>
  <li><a href="https://www.sciencedirect.com/science/article/abs/pii/S0377221703001462" target="_blank" rel="noopener">Xu, X. (2004) — Entropy weighting in MCDM (reference)</a></li>
</ol>

  <div class="hr"></div>
  <p class="small">Math rendering: KaTeX (CDN). If CDN is blocked, self-host KaTeX assets.</p>
</main>
</body>
</html>` ,
  JP: String.raw`<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>PCRC — Cer’s Index 算出ガイド（JP）</title>

<!-- KaTeX (math rendering) -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/contrib/auto-render.min.js"
        onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'\\(',right:'\\)',display:false}]});"></script>
  <style>
:root { --fg:#111; --muted:#666; --border:#e5e7eb; --bg:#fff; --code:#0b1020; --codebg:#f6f8fa; }
    body { margin:0; padding:32px 18px; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple SD Gothic Neo", "Noto Sans KR", "Malgun Gothic", sans-serif;
           color:var(--fg); background:var(--bg); line-height:1.65; }
    main { max-width: 980px; margin: 0 auto; }
    h1 { font-size: 28px; margin: 0 0 8px; }
    h2 { font-size: 20px; margin: 28px 0 10px; padding-top: 10px; border-top: 1px solid var(--border); }
    h3 { font-size: 16px; margin: 18px 0 8px; }
    p { margin: 8px 0; }
    .meta { color: var(--muted); font-size: 13px; margin-bottom: 20px; }
    .callout { border:1px solid var(--border); border-radius: 10px; padding: 12px 14px; background:#fafafa; }
    .formula { padding: 10px 12px; border:1px dashed var(--border); border-radius: 10px; background:#fff; overflow-x:auto; }
    code, pre { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }
    pre { background: var(--codebg); padding: 10px 12px; border-radius: 10px; overflow:auto; }
    table { width: 100%; border-collapse: collapse; margin: 10px 0 0; }
    th, td { border: 1px solid var(--border); padding: 10px 10px; vertical-align: top; }
    th { background: #fafafa; text-align: left; }
    a { color:#0b57d0; text-decoration: none; }
    a:hover { text-decoration: underline; }
    ol { margin: 8px 0 0 20px; }
    .small { font-size: 13px; color: var(--muted); }
    .hr { height:1px; background: var(--border); margin: 22px 0; }
  </style>
</head>
<body>
<main>
  <h1>PCRC — Cer’s Index 算出ガイド</h1>
  <div class="meta">事例・序文は省略 · 数式／定義／根拠／参考文献のみ</div>

  <section class="callout">
    <p><strong>目的</strong>：企業の<strong>実効的な炭素削減貢献</strong>を 0–100 の参照スコアとして定量化し、金融取引（融資・投資）の意思決定に活用します。</p>
  </section>


<h2>1. 算式概要（最終定義）</h2>
<p>PCRC は 3 つのモジュール得点の加重和として定義します。</p>
<div class="formula">$$\mathrm{PCRC}_i=\sum_{j}(x_{ij}\times w_j),\; j\in\{RI,\;TAG,\;MMS\}$$</div>
<ul>
  <li><strong>RI</strong>：原単位改善による実績評価（標準 60%）</li>
  <li><strong>TAG</strong>：目標と実績経路の整合性評価（標準 20%）</li>
  <li><strong>MMS</strong>：マネジメント成熟度（標準 20%）</li>
  <li><strong>最終重み \(w_j\)</strong>：第 2 章で定義（EWM 結果またはポリシー入力）</li>
</ul>

<h2>2. 重み \(w\) の導出（エントロピー重み法, EWM）</h2>
<p>
  EWM は企業間の差（識別力・情報量）が大きいモジュールにより高い重みを付与するデータ駆動型の方法です。
</p>

<h3>2.2 算式（変更なし）</h3>
<div class="formula">$$
\begin{aligned}
X &= [x_{ij}], \quad i=1,\dots,m,\; j=\{\,j \mid RI,\; TAG,\; MSS\,\} \\
P_{ij} &= \frac{x_{ij}}{\sum_{r=1}^{m} x_{rj}} \\
k &= \frac{1}{\ln(m)} \\
E_j &= -k\sum_{i=1}^{m} P_{ij}\ln(P_{ij}) \\
d_j &= 1 - E_j \\
w_j &= \frac{d_j}{\sum_{j} d_j}
\end{aligned}
$$</div>
<p class="small"><strong>表記</strong>：MSS は MMS と同義（記号は原式のまま）。</p>
<p class="small">
  <strong>シード重み</strong> \(w_j^{(0)}\) は内部パラメータで、\(X\) の構成にのみ使用：\(x_{ij}=w_j^{(0)}\times S_{ij}\)。数値は非開示。
</p>

<h2>3. モジュール別算出</h2>
<h3>3.1 RI</h3>
<p><strong>定義</strong>：\(Intensity = \dfrac{\text{Scope 1+2 排出量}}{\text{分母（売上高または生産量等）}}\)</p>
<div class="formula">$$
RI_{score} = \text{Base Score} + \left( \frac{Intensity_{t-1} - Intensity_{t}}{Intensity_{t-1}} \times 100 \times \alpha \right)
$$</div>

<h3>3.2 TAG</h3>
<div class="formula">$$
TAG_{score} =
\begin{cases}
100 & (\text{if 実績} \ge \text{目標}) \\
\left( \dfrac{\text{実績削減率}}{\text{目標削減率}} \right)\times 100 & (\text{if 実績} < \text{目標})
\end{cases}
$$</div>

<h3>3.3 MMS</h3>
<p>
  定量データの制約を補完するため、MMS では炭素経営の質的成熟度
  （ガバナンス・検証・カバレッジ・戦略統合）を先行指標として評価します。
</p>
<table>
  <thead>
    <tr>
      <th style="width:18%">評価項目</th>
      <th>主要チェックポイント（例）</th>
      <th style="width:28%">根拠/証拠</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>データ信頼性</strong></td>
      <td>第三者検証の有無と水準（Limited vs Reasonable）</td>
      <td>Assurance statement</td>
    </tr>
    <tr>
      <td><strong>カバレッジ</strong></td>
      <td>Scope 3 の算定・管理範囲（主要カテゴリ含む）</td>
      <td>Scope 3 開示表/方法論</td>
    </tr>
    <tr>
      <td><strong>戦略的統合</strong></td>
      <td>ICP、MAC/CBA の意思決定への活用</td>
      <td>内部方針/投資意思決定プロセス</td>
    </tr>
    <tr>
      <td><strong>ガバナンス</strong></td>
      <td>取締役会/委員会の関与、KPI・報酬連動、専任組織</td>
      <td>ガバナンス図、報酬規程、委員会記録</td>
    </tr>
  </tbody>
</table>

<h2>4. データ品質階層 — 欠損/非対称データへの対応</h2>
<p>情報非対称の環境でモデルの安定性を高めるため、データ階層を適用します。</p>
<ul>
  <li><strong>Level 1 (Verified Data)</strong>: 第三者検証済み排出量（100% 反映）</li>
  <li><strong>Level 2 (Self-Reported)</strong>: 企業自己開示（10% 割引）</li>
  <li><strong>Level 3 (Proxy/Estimated)</strong>: 代理/推計値（30% 割引）</li>
</ul>
<p class="small">割引の適用箇所（入力値/スコア）は監査可能性のため一貫させます。</p>

<h2>5. 実装（Web/DB）での最小要件</h2>
<h3>5.1 必須入力</h3>
<ul>
  <li>\(t, t-1\) 年の Scope 1+2 排出量（単位: tCO\(_2\)e）</li>
  <li>分母（売上または生産量）と単位</li>
  <li>基準年・目標年・目標削減率（または年次目標値）</li>
  <li>検証の有無/水準、Scope 3 カバレッジ、ICP/MAC/CBA、ガバナンス証拠（文書/URL）</li>
</ul>

<h3>5.2 監査可能性 — 推奨メタデータ</h3>
<ul>
  <li>出典（報告書名/URL）、ページ/表/脚注位置</li>
  <li>算定境界（組織/運用）、Scope 2 方式（市場基準/ロケーション基準）</li>
  <li>排出係数のバージョンと適用基準（国/サプライヤ）</li>
</ul>


  <h2>参考文献</h2>
  <ol>
  <li><a href="https://ghgprotocol.org/sites/default/files/standards/ghg-protocol-revised.pdf" target="_blank" rel="noopener">GHG Protocol — Corporate Accounting and Reporting Standard (Revised Edition)</a></li>
  <li><a href="https://ghgprotocol.org/sites/default/files/2023-03/Scope%202%20Guidance.pdf" target="_blank" rel="noopener">GHG Protocol — Scope 2 Guidance (PDF)</a></li>
  <li><a href="https://ghgprotocol.org/sites/default/files/standards/Corporate-Value-Chain-Accounting-Reporing-Standard_041613_2.pdf" target="_blank" rel="noopener">GHG Protocol — Corporate Value Chain (Scope 3) Standard (PDF)</a></li>
  <li><a href="https://files.sciencebasedtargets.org/production/files/Second-Consultation-CNZS-V2-Target-Setting-Methods-Documentation.pdf" target="_blank" rel="noopener">SBTi — Corporate Net-Zero Standard v2.0: Target-Setting Methods Documentation</a></li>
  <li><a href="https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards-issb/english/2023/issued/part-a/issb-2023-a-ifrs-s2-climate-related-disclosures.pdf?bypass=on" target="_blank" rel="noopener">IFRS/ISSB — IFRS S2 Climate-related Disclosures (June 2023)</a></li>
  <li><a href="https://assets.bbhub.io/company/sites/60/2021/10/FINAL-2017-TCFD-Report.pdf" target="_blank" rel="noopener">FSB/TCFD — Final Report: Recommendations of the TCFD (2017)</a></li>
  <li><a href="https://carbonaccountingfinancials.com/files/downloads/PCAF-Global-GHG-Standard.pdf" target="_blank" rel="noopener">PCAF — Global GHG Accounting and Reporting Standard for the Financial Industry (Part A: Financed Emissions, 2nd ed., 2022)</a></li>
  <li><a href="https://www.lma.eu.com/sustainable-lending/resources" target="_blank" rel="noopener">LMA — Sustainability-Linked Loan Principles / Guidance (Resources)</a></li>
  <li><a href="https://assets.ctfassets.net/v7uy4j80khf8/6njIGp3LOGfXHDs3AmzM2j/6d87731daccb0298f2cb73505398ff86/CDP_Full_Corporate_Scoring_Introduction_2025.pdf" target="_blank" rel="noopener">CDP — Full Corporate Scoring Introduction</a></li>
  <li><a href="https://resources.ecovadis.com/whitepapers/ecovadis-ratings-methodology-overview-and-principles-2022-neutral" target="_blank" rel="noopener">EcoVadis — Ratings Methodology Overview and Principles</a></li>
  <li><a href="https://ia803209.us.archive.org/27/items/bstj27-3-379/bstj27-3-379_text.pdf" target="_blank" rel="noopener">Shannon, C. E. (1948) — A Mathematical Theory of Communication</a></li>
  <li><a href="https://www.sciencedirect.com/science/article/abs/pii/S0377221703001462" target="_blank" rel="noopener">Xu, X. (2004) — Entropy weighting in MCDM (reference)</a></li>
</ol>

  <div class="hr"></div>
  <p class="small">数式レンダリング：KaTeX（CDN）。CDN 制限時は自社ホスト推奨。</p>
</main>
</body>
</html>` ,
};

const extractTitle = (html: string) => {
  const match = html.match(/<title>([^<]*)<\/title>/i);
  return match?.[1]?.trim();
};

const DEFAULT_LOGIC_LANGUAGE: Language = "EN";

export const getLogicLanguage = (value: string | null | undefined): Language =>
  isLanguage(value) ? value : DEFAULT_LOGIC_LANGUAGE;

export const getLogicHtml = (value: string | null | undefined): string =>
  LOGIC_HTML_BY_LANGUAGE[getLogicLanguage(value)].replaceAll("\\n", "\n");

export const getLogicTitle = (value: string | null | undefined): string =>
  extractTitle(getLogicHtml(value)) ?? "CERS Index";
