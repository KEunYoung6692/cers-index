# Quality Status

등급은 현재 검증 강도와 운영 위험을 기준으로 한다. 코드 양이나 화면 완성도를
평가하지 않는다.

## Harness And Build: B

- Node 버전 고정: 있음
- 단일 검증 명령: 있음
- CI: 있음
- 상태 계약 자동 검사: 있음
- 남은 위험: 로컬 기본 셸이 Node 18일 수 있어 세션 시작 시 `nvm use` 필요

## Domain Helpers: C

- 순수 헬퍼 모듈이 분리되어 있음
- 남은 위험: 현재 Vitest는 smoke test만 있어 도메인 회귀를 잡지 못함

## Database Integration: C

- 서버 전용 경계와 compatibility views가 있음
- 연결 실패 시 fallback 경고 경로가 있음
- 남은 위험: 실제 DB 계약을 검증하는 자동 integration test가 없음

## Runtime User Flows: D

- production build 검증은 있음
- 남은 위험: Playwright 등 자동 E2E가 없고 runtime evidence가 수동임

## Report Viewer: D

- API route와 파일 존재 확인이 구현되어 있음
- 남은 위험: 모든 기업이 동일한 로컬 PDF fixture를 가리킴

## Improvement Order

1. `src/lib/cers/public.ts` 핵심 헬퍼 단위 테스트
2. DB 응답 fixture 기반 `cers-dashboard` 데이터 조립 테스트
3. 홈, 기업 상세, 보고서 경로 Playwright smoke test
4. report asset을 batch 산출물 또는 object storage 계약과 연결

품질 등급은 관련 검증이 추가되거나 제거될 때 갱신한다.
