# cers-index

CERsIndex-batch가 Supabase에 적재한 데이터를 표시하는 CERs Index 공개
대시보드입니다.

## Quick Start

```bash
nvm use
npm ci
npm run check:quick
npm run dev
```

로컬 DB 연결에는 `.env`가 필요합니다. 필요한 변수 이름은
[`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md)에 정리되어 있습니다.

## Verification

```bash
npm run check:quick  # harness, lint, typecheck, tests
npm run check        # quick checks and production build
```

에이전트 작업 규칙은 [`AGENTS.md`](AGENTS.md), 시스템 구조는
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)를 참고합니다.
