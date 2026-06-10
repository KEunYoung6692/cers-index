# Clean State Checklist — cers-index

세션 종료 전 4개 차원 체크. 실패 항목은 커밋 전에 해결.

---

## 1. 빌드 — 타입 에러 없음

```bash
npm run build
```

- [ ] 빌드 성공, 에러 0개

---

## 2. 테스트 통과

```bash
npm run test
```

- [ ] `Test Files N passed` 출력 확인

---

## 3. 진행 기록 업데이트

- [ ] `claude-progress.txt` 오늘 작업 내용 기록
- [ ] `feature_list.json` 변경된 피처 `state` 업데이트
  - `active` → `passing`: `npm run dev` 에서 실제 데이터 확인 후에만
- [ ] `session-handoff.md` 미완료 작업 업데이트

---

## 4. 보안·임시 파일

```bash
grep -r "PGPASSWORD\|password\|secret" src/ --include="*.ts" --include="*.tsx"
find . -name "*.tmp" -not -path "./.git/*"
```

- [ ] DB 접속 정보 코드 하드코딩 없음
- [ ] 임시 파일 없음
- [ ] `.env` 파일 스테이징 안 됨

---

## 커밋 전 확인

```bash
git status
git diff --staged
```

**커밋 금지 대상**:
- `.env` (DB 비밀번호 포함)
- `node_modules/`
- `.next/` (빌드 결과물)
