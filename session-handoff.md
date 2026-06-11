# Session Handoff

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
