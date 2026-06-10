# AGENTS.md — cers-index

## 프로그램 개요

CERs Index 공개 대시보드. 기업별 탄소감축 성과를 비교·조회할 수 있는 웹 애플리케이션.
CERsIndex-batch 파이프라인이 Supabase DB에 적재한 데이터를 읽어 표시한다.

**레포지토리**: `cers-index`
**연관 레포**: `CERsIndex-batch` (데이터 파이프라인, 동일 Supabase DB)

## 기술 스택

- **Framework**: Next.js 15 (App Router, Server Components)
- **언어**: TypeScript
- **UI**: Tailwind CSS + shadcn/ui
- **DB**: Supabase PostgreSQL (pg.Pool, server-side only)
- **테스트**: vitest + jsdom
- **i18n**: 자체 구현 (`[locale]` 라우팅, ko/en/ja)

## 소스 파일 지식 지도

작업 전 관련 파일만 읽는다.

**핵심 파일**:
- `src/lib/server/cers-dashboard.ts` — DB 쿼리 + 데이터 조립 (변경 전 반드시 전체 읽기)
- `src/lib/cers/types.ts` — TypeScript 도메인 타입 (스키마 변경 시 함께 수정)
- `src/lib/cers/public.ts` — 순수 헬퍼 (점수 포매팅, 레이블 등)
- `docs/views.sql` — DB views 정의 (스키마 통일 계층)

**설정 파일**:
- `.env` — DB 접속 정보 (절대 코드에 하드코딩 금지)
- `vitest.config.ts` — 테스트 설정
- `tsconfig.json` — TypeScript 경로 alias (`@/` = `src/`)

**하네스 상태 파일**:
- `feature_list.json` — 화면별 피처 추적
- `claude-progress.txt` — 세션별 작업 기록
- `session-handoff.md` — 미완료 작업 핸드오프

## 피처 추적

`feature_list.json` 에서 각 화면의 구현 상태를 관리한다.
- `state: "passing"` — 구현 완료, DB 연결 확인
- `state: "active"` — 구현 됐으나 데이터/연결 미검증
- `state: "blocked"` — 외부 의존성 미완료 (예: F05 스코어링 미구현)

## DB Views 계층

batch 스키마 테이블명과 프론트 기대 테이블명이 다르다.
`docs/views.sql` 의 views 가 이를 매핑한다.
views 변경 시 반드시 `docs/views.sql` 수정 후 DB 재적용:
```bash
psql $DATABASE_URL -f docs/views.sql
```

## 세션 규칙

### 세션 시작
1. `claude-progress.txt` 읽기
2. `session-handoff.md` 읽기
3. `feature_list.json` 읽기
4. `npm run test` 통과 확인

### 세션 종료
1. `claude-progress.txt` 업데이트
2. `npm run build` 에러 없음 확인
3. `npm run test` 통과 확인
4. `session-handoff.md` 업데이트 (미완료 작업)
5. 변경사항 커밋 (사용자 요청 시만)

## 절대 금지

- 점수 계산 로직 임의 구현 — 점수는 CERsIndex-batch F05 가 산출
- `[locale]` 라우팅 제거
- `.env` 파일 커밋
- 화면 구조(페이지 라우트/레이아웃) 지시 없이 변경
- DB 접속 정보 코드 하드코딩

## Definition of Done

피처 `state: "passing"` 조건:
1. `npm run build` 에러 없음
2. `npm run test` 관련 테스트 통과
3. `npm run dev` 로 해당 화면에서 실제 DB 데이터 노출 확인
