# Environment

## Runtime

- Node.js: `20.19.0` (`.nvmrc`, `.node-version`)
- Package manager: npm, lockfile은 `package-lock.json`

```bash
nvm use
npm ci
npm run check:quick
```

`npm run check:harness`가 Node 버전을 먼저 검사하며, 잘못된 버전이면 `nvm use`
실행 방법을 포함한 오류를 출력한다.

## Database Variables

실제 값은 git에 포함되지 않는 `.env`에 둔다. 두 연결 방식 중 하나를 사용한다.

### Connection URL

```dotenv
DATABASE_URL=postgresql://...
PGSSLMODE=require
```

### Discrete Variables

```dotenv
PGHOST=...
PGPORT=5432
PGDATABASE=...
PGUSER=...
PGPASSWORD=...
PGSSLMODE=require
```

선택 변수:

```dotenv
PGPOOL_MAX=2
PGPOOL_IDLE_TIMEOUT_MS=10000
PGPOOL_CONNECTION_TIMEOUT_MS=10000
NEXT_PUBLIC_DATA_SOURCE=db
```

인증정보는 코드, 문서, 테스트 fixture에 실제 값으로 기록하지 않는다.

## Runtime Readiness

정적 검증은 DB 없이 실행할 수 있어야 한다.

```bash
npm run check:quick
```

실제 데이터 검증은 `.env`가 준비된 상태에서 수행한다.

```bash
npm run dev
```

애플리케이션이 fallback 경고 없이 실제 기업 데이터를 표시해야 DB 연결이 준비된
것으로 본다.
