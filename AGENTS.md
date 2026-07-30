# AGENTS.md — cers-index

## 프로젝트

CERs Index 공개 대시보드. CERsIndex-batch가 Supabase PostgreSQL에 적재한
기업별 탄소감축 데이터를 조회하고 비교한다.

- Runtime: Node.js 20.19.0
- Framework: Next.js 16 App Router + React 18 + TypeScript
- UI: Tailwind CSS + shadcn/ui
- DB: `pg.Pool`, 서버 전용
- Test: Vitest + jsdom
- i18n: `/[locale]` (`ko`, `en`, `zh`, `ja`, `vi`, `ru`, `id`, `th`, `bn`, `es`)

## 시작 순서

1. `nvm use`
2. `claude-progress.txt`와 `session-handoff.md` 읽기
3. `feature_list.json`에서 유일한 `active` 항목과 blocker 확인
4. `git status --short`로 기존 변경 확인
5. `npm run check:quick`으로 기준선 확인

환경 변수 이름과 초기화 방법은 `docs/ENVIRONMENT.md`를 따른다.

## 지식 지도

- `docs/ARCHITECTURE.md` — 라우트, 데이터 흐름, 모듈 경계
- `docs/TESTING.md` — 검증 계층과 피처 상태 전환
- `docs/DECISIONS.md` — 유지해야 할 설계 결정
- `docs/QUALITY.md` — 품질 현황과 기술 부채
- `docs/views.sql` — batch 스키마를 프론트 계약으로 매핑하는 DB views
- `src/lib/server/cers-dashboard.ts` — DB 쿼리와 대시보드 데이터 조립
- `src/lib/cers/types.ts` — 도메인 타입
- `src/lib/cers/public.ts` — DB 없는 순수 도메인 헬퍼

`cers-dashboard.ts`를 변경하기 전에는 파일 전체를 읽는다.

## 작업 규칙

- WIP=1: `feature_list.json`의 `active` 항목은 최대 하나다.
- 현재 항목의 검증이 끝나기 전 관련 없는 피처나 리팩터링을 시작하지 않는다.
- 기존 패턴과 모듈 경계를 우선하며, 새 추상화는 실제 중복이나 복잡도를 줄일 때만 추가한다.
- 사용자 변경을 되돌리지 않는다. 커밋은 사용자 요청이 있을 때만 한다.
- 화면 구조, 라우트, 레이아웃은 명시적 요청 없이 변경하지 않는다.

## 하드 제약

- 점수를 임의 계산하지 않는다. 점수 소유자는 CERsIndex-batch F05다.
- `/[locale]` 라우팅과 `ko/en/zh/ja/vi/ru/id/th/bn/es` 지원을 제거하지 않는다.
- DB 쿼리는 `src/lib/server/`에 두고 Client Component에서 import하지 않는다.
- DB 접속 정보나 비밀번호를 코드와 문서에 실제 값으로 기록하지 않는다.
- DB 계약 변경은 `docs/views.sql`, 관련 타입, 연관 batch 스키마 영향을 함께 검토한다.
- `.env`, `.next`, 로컬 브라우저 산출물을 커밋하지 않는다.

## 피처 상태

- `not_started`: 구현 여부와 무관하게 현재 검증 작업이 시작되지 않음
- `active`: 현재 세션이 검증·완료해야 하는 유일한 항목
- `blocked`: 외부 의존성이 있고 `blocked_by`가 기록됨
- `passing`: 검증 명령과 실제 런타임 증거가 `evidence`에 기록됨

`active -> passing`은 검증 성공 후에만 허용한다. 상태 계약은
`npm run check:harness`가 검사한다.

## 검증

```bash
npm run check:quick  # 하네스 + lint + typecheck + unit test
npm run check        # quick check + production build
npm run dev          # 실제 DB와 사용자 흐름 확인
```

완료 조건:

1. 관련 피처의 검증 명령이 성공한다.
2. `npm run check`가 성공한다.
3. DB/라우트/화면 동작 변경이면 `npm run dev`에서 실제 흐름을 확인한다.
4. `feature_list.json`, `claude-progress.txt`, `session-handoff.md`가 현재 상태와 일치한다.

## 세션 종료

1. `npm run check`
2. 런타임 변경이면 해당 피처를 실제 DB 데이터로 확인
3. 상태 파일과 증거 갱신
4. `git status --short`로 비밀정보·임시 산출물·의도하지 않은 변경 확인
5. 미완료 작업은 구체적인 다음 명령과 blocker를 `session-handoff.md`에 남김
