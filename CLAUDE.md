# CLAUDE.md — cers-index

## 역할

CERs Index 공개 대시보드. 기업별 탄소감축 성과 점수를 비교·조회하는 Next.js 앱.
CERsIndex-batch 파이프라인이 적재한 Supabase DB에서 데이터를 읽는다.

## 아키텍처

```
src/
  app/[locale]/          ← i18n 라우팅 (ko/en/ja)
  components/cers/       ← 도메인 컴포넌트
  lib/
    server/
      cers-dashboard.ts  ← DB 쿼리 + CersDashboardData 빌드
      db.ts              ← pg.Pool
      report-assets.ts   ← 보고서 파일 서빙
    cers/
      types.ts           ← TypeScript 도메인 타입
      public.ts          ← 순수 헬퍼 (DB 없음)
      i18n.ts            ← 번역 문자열
```

## 개발 명령

```bash
npm run dev      # 개발 서버 (http://localhost:3000)
npm run build    # 프로덕션 빌드
npm run test     # vitest (jsdom)
npm run lint     # eslint
```

## 환경 변수

`.env` 파일에 설정 (`.env.local` 로 오버라이드 가능):

```
PGHOST=aws-1-ap-northeast-2.pooler.supabase.com
PGPORT=5432
PGDATABASE=postgres
PGUSER=postgres.lqwerolxuszvepbtnnbd
PGPASSWORD=<비밀번호>
PGSSLMODE=require
```

## DB 스키마 연결

실제 테이블은 CERsIndex-batch `docs/schema.sql` 기준 (`company`, `report`, `clean_val` 등).
프론트가 기대하는 이름(`companies`, `documents`, `co_metric` 등)은
**`docs/views.sql`** 로 생성한 PostgreSQL views 를 통해 연결된다.

| View | 소스 테이블 | 용도 |
|------|------------|------|
| `companies` | `company` | 기업 목록 |
| `documents` | `report` | 기업별 최신 보고서 |
| `rpt_period` | `clean_val` | 회계연도 조회 |
| `co_metric` | `clean_val` | 배출·에너지 수치 |
| `co_target` | `clean_val` | 감축목표·넷제로 |
| `doc_fw_adopt` | `report.frame_json` | 프레임워크 배지 |
| `scoring_runs` | `final_score` | 점수 run (F05) |
| `cers_score` | `final_score` | 최종 점수 (F05) |
| `category_scores` | `kpi_score` | KPI 점수 (F05) |
| `score_categories` | `kpi` | KPI 메타 |
| `method_ver` | `score_run` | 방법론 버전 |

views 변경 시 `docs/views.sql` 수정 → Supabase SQL Editor 또는 아래 명령으로 재적용:
```bash
psql $DATABASE_URL -f docs/views.sql
```

`cers-dashboard.ts` 의 `resolveDashboardSchema()` 가 런타임에 존재하는 테이블을 감지한다.
스코어링 tables(`scoring_runs`, `cers_score`, `category_scores`)가 비어 있어도 앱은 정상 동작하고,
배출 데이터 + 감축목표만 표시한다.

## Views 적용 방법 (최초 1회)

Supabase MCP 가 read-only 모드이므로 아래 방법 중 하나로 적용한다:

```bash
# 1) psql 직접 (권장)
psql "postgresql://postgres.lqwerolxuszvepbtnnbd:<PW>@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require" \
     -f docs/views.sql

# 2) Supabase Dashboard > SQL Editor > docs/views.sql 내용 붙여넣기
```

## 제약 사항

- 화면 구조(페이지 라우트, 컴포넌트 레이아웃)는 명시적 지시 없이 변경하지 않는다.
- 점수 로직은 발명하지 않는다 — 점수는 CERsIndex-batch F05 가 산출한다.
- `[locale]` 라우팅 유지 — 모든 페이지는 `src/app/[locale]/` 아래에 있다.
- DB 스키마 변경은 batch 프로젝트의 `schema.sql` 과 이 프로젝트의 `views.sql` 을 함께 수정한다.
- 인증 정보(PGPASSWORD 등)를 코드에 하드코딩하지 않는다.

## 세션 시작

1. `claude-progress.txt` 확인
2. 현재 브랜치 확인 (`git status`)
3. `npm run test` 통과 여부 확인

## 세션 종료

1. `claude-progress.txt` 업데이트
2. `npm run build` 에러 없음 확인
3. 변경사항 커밋 (사용자 요청 시만)
