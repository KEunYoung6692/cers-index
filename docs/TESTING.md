# Testing And Verification

## Commands

```bash
npm run check:harness  # 상태 파일, Node, 경계, 추적 파일 검사
npm run lint           # 정적 규칙
npm run typecheck      # TypeScript noEmit 검사
npm run test           # Vitest
npm run check:quick    # 위 네 단계
npm run build          # Next.js production build
npm run check          # quick check + build
```

모든 로컬 및 CI 검증은 Node.js 20.19.0에서 실행한다.

## Validation Hierarchy

1. **Harness/static**: 저장소 상태와 코드 구조가 실행 가능한가
2. **Unit**: 순수 헬퍼와 컴포넌트 계약이 맞는가
3. **Build/integration**: Next.js가 전체 라우트와 서버 경계를 컴파일하는가
4. **Runtime/E2E**: 실제 DB와 사용자 경로가 동작하는가

화면, 라우트, DB 쿼리 또는 파일 서빙을 변경한 작업은 4단계를 생략할 수 없다.
현재 자동 E2E가 없으므로 `feature_list.json`의 verification 절차를 실행하고
관찰한 결과를 evidence에 기록한다.

## Feature State Gate

- `not_started -> active`: 현재 작업으로 선택할 때
- `active -> passing`: verification 성공과 evidence 기록 후
- `active -> blocked`: 저장소 밖 의존성이 확인되고 blocked_by를 기록할 때
- 동시에 둘 이상의 `active`는 허용하지 않음

`npm run check:harness`는 상태 형식만 검증한다. 실제 실행 결과를 대신하지 않는다.
따라서 에이전트의 완료 판단보다 명령 출력과 런타임 관찰이 우선한다.

## Test Placement

- 테스트 파일: `src/**/*.{test,spec}.{ts,tsx}`
- 공통 setup: `src/test/setup.ts`
- 서버 전용 모듈 mock: `src/test/server-only.ts`

새 테스트는 변경한 동작에 가장 가까운 위치에 둔다. DB 쿼리는 실제 자격 증명에
의존하는 단위 테스트 대신 쿼리 조립과 데이터 변환 경계를 분리해 검증한다.

## Error Message Standard

자동 검사는 다음 정보를 포함해야 한다.

```text
ERROR: 무엇이 잘못되었는가
WHY: 어떤 불변 조건을 위반했는가
FIX: 어느 파일이나 명령으로 복구하는가
```

반복되는 리뷰 지적은 문서 규칙으로만 남기지 말고 lint, test 또는
`scripts/check-harness.mjs` 검사로 승격한다.
