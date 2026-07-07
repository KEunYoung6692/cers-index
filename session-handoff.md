# Session Handoff

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
