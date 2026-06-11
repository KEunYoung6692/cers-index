# Design Decisions

## 2026-06-10: Batch Owns Scoring

- 결정: CERs 점수 계산은 `CERsIndex-batch` F05만 수행한다.
- 이유: 공개 대시보드와 배치가 서로 다른 계산을 만들면 같은 기업에 상충하는
  점수가 노출된다.
- 결과: 점수가 없으면 프론트는 데이터 부족 상태를 표시하며 임의 보간하지 않는다.

## 2026-06-10: Compatibility Views Separate Schemas

- 결정: batch 기본 테이블을 프론트가 직접 조회하지 않고 `docs/views.sql`의
  compatibility views를 사용한다.
- 이유: 파이프라인 저장 구조와 공개 화면 계약의 변경 주기가 다르다.
- 결과: 계약 변경은 SQL view, TypeScript 타입, 서버 쿼리를 함께 갱신한다.

## 2026-06-10: Locale Wrappers Stay Explicit

- 결정: 기본 영어 라우트와 `/[locale]` wrapper 구조를 유지한다.
- 이유: 공유 렌더러를 재사용하면서 `ko/en/ja` URL 계약을 보존한다.
- 결과: 지역화 페이지는 locale 검증 후 비지역화 모듈의 렌더러를 호출한다.

## 2026-06-10: Verification Is Command Driven

- 결정: 완료 기준은 `npm run check`와 피처별 runtime verification 결과다.
- 이유: 코드 작성 여부나 에이전트의 자신감은 통합 동작을 증명하지 못한다.
- 결과: `passing` 상태에는 실행 증거가 필요하고 CI도 동일한 `npm run check`를
  실행한다.
