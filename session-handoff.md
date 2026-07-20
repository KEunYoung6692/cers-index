# Session Handoff

## Current State — 2026-07-20 (Batch Schema Sync)

### Database Compatibility

- `docs/views.sql` 최신 정의를 실 DB에 적용 완료
- 공개 정제값은 reported/current/found/company-level만 사용하며 조직 단위 값은 제외
- Scope 2는 MB > 일반 > LB 순으로 단일 표시값 선택
- 복수 감축목표는 `record_key`별로 분리되고 `baseline_year`/`target_year`는
  `val_year`를 사용
- 신규 `co_scope3`, `doc_assur_stmt` 뷰가 실제 DB에 존재
- 원본 batch 테이블과 적재 데이터는 변경하지 않음

### Verification

- 뷰 행 수: metric 39, target 79, scope3 30, assurance 13
- 일본: 회사 11, metric 20, target 50
- 공개 지표 중복 0, 목표 ID 중복 0, 미승인·조직 단위 지표 유입 0
- `npm run check` 통과
- `/ja/companies/23922`, `/api/companies/23922/report` HTTP 200

### Follow-up

- `published_date`는 원본에 발행일 계약이 없어 NULL 유지 (`down_at`은 다운로드 시각)
- `assur_provider`는 batch 변수에 검증기관명이 없어 NULL 유지
- 위 두 필드의 원천 계약은 현재 저장소 기준 `확인 안 됨`

## Current State — 2026-07-20

### Navigation Performance

- `getCersDashboardData`는 locale별 5분 서버 메모리 TTL 캐시를 사용함
- 기업 목록은 목록 전용 경량 객체만 Client Component에 전달함
- 기업 검색·필터 결과는 한 화면에 24개씩 렌더링함
- 실제 DB dev warm 측정: `/ko` 0.25초, `/ko/companies` 0.17초,
  `/ko/industries` 0.23초
- 기업 목록 응답 크기는 약 16.6MB에서 3.7MB로 감소
- `npm run check` 통과

### Next Work

- 홈·업종·비교도 전용 경량 서버 계약으로 분리해 약 6MB 응답을 추가 축소
- 기업 목록의 URL 공유 가능한 서버 페이지네이션은 필터를 서버 계약으로 옮길 때 검토
- F01 브라우저 전체 흐름과 hydration console 최종 확인

## Current State — 2026-07-09

### Home UI

- 홈 최상단 소개·방법론 위젯은 JSX 주석 처리되어 렌더링되지 않음
- 홈과 `/companies/score-list`의 CERs Index List 헤더는 `KPI1`~`KPI4`로 표시
- 카테고리 데이터 및 방법론/About 화면의 정식 명칭은 변경하지 않음

### Verification

- `npm run check` 통과
- dev 홈 HTML에서 숨긴 소개 문구 미노출 확인
- DB 점수 0건으로 KPI 표 자체는 런타임 미노출 상태

## Current State — 2026-07-08

### Runtime Hydration

- `/` 홈에서 발생하던 React recoverable hydration warning 대응 완료
- 원인으로 보이는 구조: `AppShell` 내부 첫 자식인 `SiteHeader` 전체가
  `useSearchParams()` 때문에 Suspense fallback으로 서버 렌더됨
- 수정:
  - `src/components/cers/app-shell.tsx`: 헤더 전체 Suspense fallback 제거
  - `src/components/cers/site-header.tsx`: `useSearchParams()` 제거, mount 후
    `window.location.search`를 읽어 query string/search input 상태 동기화
- 검증:
  - `npm run check` 통과
  - dev 서버 `127.0.0.1:3001`에서 `/`와 `/ko` HTML 확인
  - 두 응답 모두 `AppShell` root `<div>` 다음 실제 `<header>`가 바로 렌더됨

### Product State

- F01 홈 검증은 계속 유일한 `active` 항목
- 점수 적재는 아직 0건이며 F05/F09는 batch F05 결과 전까지 blocked 유지
- 현재 환경에 Playwright/브라우저 런타임이 없어 브라우저 콘솔 자동 검증은 미수행

### Next Work

- 브라우저에서 `/` 또는 `/ko`를 열어 hydration warning이 사라졌는지 최종 확인
- 이후 F01 완료 조건 전체를 실제 DB 화면 흐름으로 검증하고 evidence/state 갱신

## Current State — 2026-06-29

### Methodology

- `docs/LOGIC/CERs Index for Company_ver2.md`를 단일 기준으로 코드 전반 재대조 완료
- score-logic-v3.tsx의 12개 변수 산식은 문서와 정확히 일치 (수정 불필요 확인)
- 남아 있던 v1.4 잔재 제거: KPI2 영어 라벨 "ambition" → "design & delivery"
  (i18n en 4곳 + public.ts·fallback-data.ts 카테고리 라벨), fallback methodologyVersion
  "CERs v0.1" → "CERs v1.5", dead code score-logic.tsx(v1.4 16변수) 삭제
- feature_list F07/F08 설명을 v1.5/12변수로 동기화, 관련 테스트 단언 갱신
- `npm run check:quick` 통과, src 전수 스캔 잔재 0건

### Next Work

- 소비 화면(홈/기업/비교/섹터)의 12개 변수 개별 점수 표시는 batch 변수별 점수 계약
  확정 후 Phase 2로 구현 (현재 4 KPI 카테고리 수준 렌더)
- F05/F09는 여전히 batch F05 점수 적재 전까지 blocked

## Current State — 2026-06-24

### Methodology

- About와 상세 로직 화면은 CERs Index ver2(v1.5) 기준으로 전환됨
- 4개 KPI와 12개 변수(n1=2, n2=2, n3=4, n4=4), 두 단계 동일가중 평균
- 변수 구조: KPI1 V1·V2 / KPI2 W1(설계)·W2(이행) / KPI3 C1~C4 / KPI4 A1~A4
- ko/en/ja 콘텐츠와 12개 변수 렌더링 테스트 갱신, `npm run check:quick` 통과
- dead code `score-logic.tsx`(v1.4 16변수)는 미import 상태로 남아 있음(제거 후보)

## Current State — 2026-06-11

### Methodology

- About와 상세 로직 화면은 CERs Index v1.4 기준으로 전환됨(과거 기록)
- 4개 KPI와 16개 변수, KPI 내부 및 KPI 간 동일가중 평균을 사용
- 한국어, 영어, 일본어 콘텐츠와 렌더링 테스트가 추가됨
- 화면 개편 기획서는 `docs/screen/README.md`에 있음
- 홈의 공개 탄소감축 대시보드 표와 점수소개 영역은 유지 대상으로 확정

### Verification

- Node.js 20.19.0에서 `npm run check:quick` 통과
- Vitest 2 files, 7 tests 통과
- `npm run check`와 production build 통과
- `/about`, `/about/logic`, `/score-logic`과 다국어 라우트 생성 확인

### Product State

- DB 강제 목데이터 반환은 제거되어 실제 DB 조회 경로를 사용함
- F01 홈 검증이 유일한 `active` 항목
- F05/F09는 CERsIndex-batch F05 점수 결과 적재 전까지 blocked
- 점수 계산은 계속 batch 소유이며 프론트에서는 계산하지 않음

## Current State — 2026-06-10

### Harness

- 진입 규칙: `AGENTS.md`
- 상세 문서:
  - `docs/ENVIRONMENT.md`
  - `docs/ARCHITECTURE.md`
  - `docs/TESTING.md`
  - `docs/DECISIONS.md`
  - `docs/QUALITY.md`
- 상태 프리미티브: `feature_list.json`
- 자동 검사: `scripts/check-harness.mjs`
- 로컬/CI 전체 검증: `npm run check`

### Verification

- `npm run check:quick`: 통과
- `npm run build`: Node 20.19에서 통과
- `npm run dev`: Ready 확인
- 실제 HTTP 사용자 흐름은 WSL 안정성 때문에 이번 세션에서 중단

### Product State

- DB compatibility views 11개는 적용 완료
- 실제 넷제로 기업 데이터 노출 확인 이력 있음
- F01 홈 검증이 유일한 `active` 항목
- F04 보고서 뷰어는 기업별 파일 경로 계약 미확정으로 blocked
- F05/F09 점수 화면은 CERsIndex-batch F05 결과 미적재로 blocked

### Next Work

1. 웹 프로세스 실행 전 사용자에게 WSL 상태 확인
2. F01 verification을 실제 DB 데이터로 완료하고 evidence 갱신
3. 이후 `feature_list.json`에서 다음 항목 하나만 active로 전환

### Constraints

- npm 명령 전 `nvm use`
- 웹/E2E 검증은 WSL 안정성 때문에 자동으로 장시간 실행하지 않음
- 점수 계산은 프론트에서 구현하지 않음
- 화면 구조와 `docs/views.sql`은 명시적 요청 없이 변경하지 않음

## Existing Worktree Changes

이번 하네스 작업 전부터 존재:

- `.env.example` 삭제
- `docs/harness-engineering/` 미추적
- `claude-progress.txt` 수정

사용자 변경으로 간주하며 임의로 되돌리지 않는다.
