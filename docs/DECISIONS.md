# Design Decisions

## 2026-07-20: Public Views Expose Approved Company-Level Values Only

- 결정: 공개 대시보드 compatibility view는 `clean_val`의 현재값 중
  `is_found = true`, `data_state = 'reported'`, `org_unit_id IS NULL`인 회사 단위
  값만 사용한다. `boundary_type`은 검수 메타데이터로 보존하되 공개 여부를 결정하는
  필터로 사용하지 않는다.
- 이유: 배치 스키마는 후보·검토·조직 단위 값을 함께 보존한다. 이를 공개 회사 총계와
  섞으면 중복 또는 미승인 값이 화면에 노출되고, 반대로 `mixed`·`unknown` 경계의
  승인된 일본 공시값은 누락될 수 있다.
- 결과: Scope 2는 market-based, 일반 Scope 2, location-based 순으로 회사·연도당
  한 값만 표시한다. 감축목표는 `record_key`별로 묶고 연도형 변수는 `val_year`를
  사용한다. Scope 3 카테고리와 검증 수준은 각각 `co_scope3`, `doc_assur_stmt`로
  투영하며 이 뷰들에서는 점수를 계산하지 않는다.

## 2026-07-20: Public Dashboard Data Uses Short Server Memory Cache

- 결정: 전체 대시보드 DB 조회·조립 결과를 locale별 5분 동안 서버 프로세스
  메모리에서 공유한다.
- 이유: 데이터는 batch가 갱신하지만 모든 동적 화면 이동이 동일한 다중 DB 쿼리를
  반복하고 있었다. 조립 결과가 Next 데이터 캐시의 항목당 2MB 제한도 초과한다.
- 결과: 같은 인스턴스의 반복 이동과 동시 요청은 DB 조회를 공유한다. 인스턴스 재시작과
  TTL 만료 뒤 첫 요청은 최신 DB 데이터를 다시 읽는다.

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
