# Clean State Checklist — cers-index

세션 완료는 작업 검증과 저장소 clean-state 검증을 모두 통과해야 한다.

## 1. 자동 검증

```bash
nvm use
npm run check
```

- [ ] 하네스 상태 계약 통과
- [ ] lint 오류 0개
- [ ] typecheck 통과
- [ ] 전체 Vitest 통과
- [ ] production build 통과

## 2. 런타임 검증

화면, 라우트, DB 또는 보고서 파일 동작을 변경한 경우:

```bash
npm run dev
```

- [ ] 해당 `feature_list.json` verification 실행
- [ ] 실제 DB 데이터 또는 기대 fallback 상태 확인
- [ ] 성공 결과를 `evidence`에 기록

## 3. 상태 기록

- [ ] `feature_list.json`에 active 항목이 최대 하나
- [ ] passing 항목은 evidence 보유
- [ ] blocked 항목은 blocked_by 보유
- [ ] `claude-progress.txt`에 이번 세션 결과 기록
- [ ] `session-handoff.md`에 미완료 작업과 다음 명령 기록

## 4. 저장소 위생

```bash
git status --short
git diff --check
```

- [ ] `.env`, `.next`, `.playwright-mcp`, 임시 파일이 추적되지 않음
- [ ] 디버그 코드와 의도하지 않은 변경 없음
- [ ] 사용자 기존 변경을 되돌리지 않음

커밋은 사용자가 요청한 경우에만 수행한다.
