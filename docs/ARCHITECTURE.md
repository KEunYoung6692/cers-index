# Architecture

## System Boundary

`cers-index`는 읽기 전용 공개 대시보드다. 데이터 수집, 정제, 점수 계산은
`CERsIndex-batch`가 소유하고 이 저장소는 결과를 조회해 표시한다.

```text
CERsIndex-batch
  -> Supabase PostgreSQL base tables
  -> docs/views.sql compatibility views
  -> src/lib/server/*
  -> src/lib/cers/types.ts
  -> Server Components
  -> Client Components
```

## Route Structure

- `src/app/page.tsx`와 비지역화 경로: 기본 영어 렌더러 및 공유 구현
- `src/app/[locale]/**`: `ko`, `en`, `ja` 검증 후 공유 렌더러 호출
- `src/app/api/**`: 서버 전용 route handler

지역화 wrapper는 얇게 유지한다. `[locale]` 경로를 제거하거나 화면 구현을 별도로
복제하지 않는다.

## Module Responsibilities

### `src/lib/server/`

DB와 파일 시스템 접근을 소유한다. 모든 모듈은 `server-only` 경계를 유지한다.

- `db.ts`: 환경 변수 검증과 `pg.Pool` 생명주기
- `cers-dashboard.ts`: 사용 가능한 DB 계약 감지, 쿼리, 화면 데이터 조립
- `report-assets.ts`: 보고서 파일 위치와 API 경로

Client Component는 이 디렉터리를 import할 수 없다. `npm run check:harness`가 해당
경계를 검사한다.

### `src/lib/cers/`

브라우저와 서버가 공유할 수 있는 도메인 계층이다.

- `types.ts`: 직렬화 가능한 도메인 타입
- `public.ts`: DB 접근이 없는 순수 계산과 포매팅
- `i18n.ts`: locale 타입, 문자열, 경로 헬퍼
- `fallback-data.ts`: DB 장애 시 명시적으로 표시되는 샘플 데이터

### `src/components/cers/`

CERs 도메인 UI다. 서버에서 받은 직렬화 데이터만 소비한다.

### `src/components/ui/`

shadcn 기반 범용 UI primitive다. 도메인 로직이나 DB 접근을 두지 않는다.

## Database Contract

batch 기본 테이블명과 프론트 계약은 `docs/views.sql`의 PostgreSQL views로
분리한다. 프론트 쿼리가 batch 내부 테이블명에 직접 결합되지 않게 유지한다.

스키마 작업 시 다음을 함께 검토한다.

1. batch base schema
2. `docs/views.sql`
3. `src/lib/cers/types.ts`
4. `src/lib/server/cers-dashboard.ts`
5. 실제 DB 적용 및 런타임 조회

점수 테이블이 비어 있는 것은 정상적인 부분 상태다. 프론트가 점수를 만들어내면
안 되며, 배출량과 목표 데이터만 표시할 수 있다.

## Enforced Invariants

- Client Component에서 `src/lib/server` import 금지
- 비밀정보와 로컬 산출물 git 추적 금지
- 피처 `active` 상태 최대 하나
- `passing`은 evidence 필수, `blocked`는 blocked_by 필수
- 제품 완료 전 `npm run check` 성공 필수
