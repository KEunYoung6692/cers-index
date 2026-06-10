# Session Handoff

## 2026-06-10 (최신) — 하네스 엔지니어링 + 스키마 통일 views

### 완료
- `docs/views.sql`: batch 스키마 → 프론트 매핑 views 11개 작성
- `CLAUDE.md`, `AGENTS.md`, `feature_list.json`, `clean-state-checklist.md` 신규
- vitest 수정 (1 pass)
- 구버전 파일 30여 개 삭제 커밋 (`cers_index_ver2` 브랜치, `22d95ac`)

### ⚠️ 미완료: DB Views 적용 필요

**views.sql 이 DB에 적용되지 않았다.** 프론트는 현재 fallback(샘플 데이터)를 표시함.

적용 방법:
```bash
psql "postgresql://postgres.lqwerolxuszvepbtnnbd:<PW>@aws-1-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require" \
     -f docs/views.sql
```
또는 Supabase Dashboard → SQL Editor.

적용 후 확인:
```bash
npm run dev
# http://localhost:3000 → 기업 카드에 실제 한국 기업 이름 표시되면 성공
```

### 다음 우선순위

1. **views DB 적용** (위 명령어 실행)
2. **보고서 뷰어 경로 확인** (F04)
   - `src/app/api/companies/[companyId]/report/route.ts` 에서 PDF 파일 경로가
     CERsIndex-batch `data/data_collection/reports/{corp_code}/` 와 일치하는지 확인
3. **CERsIndex-batch F05 스코어링 엔진 구현** → 완료 시 자동으로 점수 표시

---

## 이전 세션 상태

브랜치 `cers_index_ver2`, 마지막 커밋 `ea6b5c7` (2026-05-11):
- 보고서 뷰어 페이지 추가
- CERs v0.3 스코어 로직 페이지 (`score-logic-v3.tsx`)
- `config/cers_v3.md` (내부 산식 정의서 R1) 추가
- 다크모드 조정
