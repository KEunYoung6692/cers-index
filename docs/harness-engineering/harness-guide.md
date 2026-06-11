# CERsIndex-batch 하네스 엔지니어링 가이드

> 출처: `docs/reference/harness-engineering/lecture/` 12강 + `docs/reference/harness-engineering/m.md` (OpenAI 실제 운영 사례) 학습 내용을 이 프로젝트에 맞게 정리한 문서.

---

## 1. 핵심 원칙

**"모델이 부족한 게 아니라 하네스가 부족한 것이다."**

- 에이전트 실패의 원인은 대부분 모델 성능이 아니라 실행 환경의 구조적 결함이다.
- 모델 교체 전에 반드시 하네스 5개 레이어를 먼저 점검해야 한다.
- 하네스 = 모델 가중치를 제외한 모든 엔지니어링 인프라 (지시, 도구, 환경, 상태, 피드백).

**실패 귀인 5개 레이어**

| 레이어 | 질문 | 이 프로젝트에서 담당 파일 |
|--------|------|--------------------------|
| 작업 명세 | 무엇을 해야 하는지 명확한가? | `AGENTS.md`, `feature_list.json` |
| 컨텍스트 | 필요한 지식이 레포에 있는가? | `docs/ARCHITECTURE.md`, 모듈별 `ARCHITECTURE.md` |
| 실행 환경 | 의존성, 버전, 실행 명령이 갖춰졌는가? | `init.sh`, `.env` |
| 검증 피드백 | 완료 판단을 실행 결과로 하는가? | `AGENTS.md` 검증 명령 섹션 |
| 상태 관리 | 세션 간 진행 상태가 보존되는가? | `claude-progress.md`, `session-handoff.md` |

---

## 2. 이 프로젝트의 하네스 현황

### 이미 갖춰진 것

| 구성요소 | 파일 | 역할 |
|----------|------|------|
| 지시 진입점 | `AGENTS.md` | 프로젝트 개요, 작업 규칙, Hard Rules |
| 모듈 지식 지도 | `docs/ARCHITECTURE.md` 외 | 각 모듈 책임/인터페이스 |
| 피처 목록 | `feature_list.json` | 작업 단위 추적 (구조 있음) |
| 진행 상태 | `claude-progress.md` | 세션 간 상태 연속성 |
| 세션 인수인계 | `session-handoff.md` | 미완료 작업·컨텍스트 전달 |
| 클린 상태 체크 | `clean-state-checklist.md` | 세션 종료 전 검증 |
| 초기화 스크립트 | `init.sh` | 환경 셋업 |
| DB 제약 | `docs/database-rules.md` | DB 조작 하드 컨스트레인트 |

### 주의: 상태 파일들이 비어 있음

`claude-progress.md`, `session-handoff.md`, `feature_list.json`, `clean-state-checklist.md`, `init.sh`가 현재 모두 빈 파일 상태이다.
파일 구조는 올바르게 잡혀 있지만 **내용이 채워지지 않으면 하네스가 작동하지 않는다**.

---

## 3. 5개 서브시스템 적용

### 3.1 지시(Instructions) 서브시스템

**원칙**: 진입 파일(`AGENTS.md`)은 라우터여야 한다. 백과사전이 아니라.

- `AGENTS.md`는 현재 100줄 이하 — 적절한 수준.
- Hard Rules 섹션에 금지 사항이 명확히 열거되어 있음 — 잘 설계됨.
- 모듈별 `ARCHITECTURE.md` 링크가 Knowledge Map에 포함됨 — "Reveal on Demand" 패턴.

**주의사항**:
- 규칙 추가 전 "이것이 주제별 문서(`docs/`)에 들어가야 하지 않을까?" 먼저 질문하라.
- `AGENTS.md`에 규칙이 누적되어 300줄을 초과하면 분리 리팩토링이 필요하다.
- 중요 제약은 반드시 파일의 상단 또는 하단에 배치하라. 중간에 묻히면 에이전트가 놓친다 ("Lost in the Middle" 효과).

### 3.2 도구(Tools) 서브시스템

**이 프로젝트에서 에이전트가 사용하는 도구**:
- 파일 읽기/쓰기 (파싱 결과, 스코어링 결과 등)
- 쉘 명령 실행 (배치 스크립트, 검증 명령)
- DB 조작 (db_loading 단계)

**규칙**: 에이전트가 검증 명령을 실행할 수 없으면 완료 판단이 불가능하다. 최소한 다음 명령은 실행 가능해야 한다:
```
검증 명령을 init.sh 또는 AGENTS.md에 명시해야 함
예시: python -m pytest tests/ -x
     python -m mypy src/ --strict
```

### 3.3 환경(Environment) 서브시스템

**`init.sh` 체크리스트** (현재 비어 있음 — 반드시 채울 것):
```bash
# 최소 구성 예시
pip install -r requirements.txt   # 의존성 설치
python -c "import src"            # 임포트 검증
python -m pytest tests/ -x -q    # 예제 테스트 1개 이상 통과
echo "환경 준비 완료"
```

**`init.sh`의 성공 기준**: 새 에이전트 세션이 이 파일만 실행하면 작업 시작 가능한 상태.

### 3.4 상태(State) 서브시스템

**세션 간 컨텍스트 손실 방지가 이 프로젝트의 핵심 과제**:

배치 파이프라인은 단계별로 나뉘어 있어 세션이 중간에 끊기면 어느 단계까지 완료됐는지 파악이 어렵다. `claude-progress.md`에 반드시 기록해야 할 내용:

```markdown
## 현재 상태
- 최신 커밋: [해시] ([설명])
- 활성 단계: [reference_data / data_collection / ... 중 하나]
- 검증 상태: [테스트 통과 현황]

## 완료된 작업
- [x] 완료된 피처 목록

## 진행 중
- [ ] 현재 작업 중인 피처 (90% — 막힌 이유)

## 알려진 이슈
- 이슈 설명

## 다음 작업
1. 즉시 해야 할 것
2. 그 다음
```

### 3.5 피드백(Feedback) 서브시스템

**"에이전트는 체계적으로 과신한다."** 코드가 완성된 것처럼 보인다고 해서 완성된 것이 아니다.

이 프로젝트에서의 완료 판단은 반드시 실행 결과를 기반으로 해야 한다:

**3단계 종료 검증** (배치 파이프라인 적용):

| 단계 | 검증 내용 | 완료 조건 |
|------|-----------|-----------|
| 1단계: 정적 검사 | lint, type check | 오류 0개 |
| 2단계: 단위 테스트 | 단일 모듈 테스트 | 해당 모듈 테스트 통과 |
| 3단계: 파이프라인 통합 | 전체 파이프라인 실행 | 최종 출력 정합성 확인 |

---

## 4. 배치 파이프라인 특화 규칙

### 4.1 WIP=1 원칙 (파이프라인 단계별 적용)

6개 배치 단계(reference_data → data_collection → data_parsing → data_preprocessing → scoring → db_loading) 중 **한 번에 하나의 단계만 활성 작업 상태**로 두어야 한다.

```
작업 규칙 (AGENTS.md에 이미 반영되어 있음):
- 현재 단계의 피처가 passing 상태가 되기 전에 다음 단계로 이동하지 않는다.
- 한 단계 작업 중 다른 단계를 "겸사겸사" 수정하지 않는다.
```

**왜**: 단계를 동시에 건드리면 파이프라인의 어느 지점에서 데이터 정합성이 깨졌는지 추적이 불가능해진다.

### 4.2 피처 목록(`feature_list.json`)을 하네스 프리미티브로 활용

현재 `feature_list.json`이 비어 있다. 이것은 단순한 메모가 아니라 **스케줄러, 검증기, 인수인계 리포터가 모두 의존하는 구조체**여야 한다.

**최소 필드 구조**:
```json
{
  "id": "F01",
  "stage": "reference_data",
  "behavior": "기업 기본 메타데이터 수집 후 DB에 저장",
  "verification": "python -m pytest tests/reference_data/ -x -q",
  "state": "not_started | active | blocked | passing",
  "evidence": ""
}
```

**상태 전환 규칙**:
- `not_started` → `active`: 에이전트가 작업 시작 시 직접 변경.
- `active` → `passing`: **검증 명령이 성공해야만** 변경 가능. 에이전트 판단으로 직접 passing 처리 금지.
- `passing` → 되돌림 없음: passing된 피처는 재활성화하지 않는다.

### 4.3 아키텍처 경계를 린트 레벨로 강제

문서에 적힌 아키텍처 규칙은 에이전트가 무시할 수 있다. **기계적으로 강제해야 한다.**

OpenAI 사례: 각 비즈니스 도메인을 고정된 레이어(Types → Config → Repo → Service → UI)로 나누고, 허용되지 않는 의존성은 커스텀 린터로 자동 차단.

이 프로젝트 배치 파이프라인에 적용하면:

```python
# 예시: 모듈 간 의존성 위반 감지
# data_parsing이 scoring을 직접 임포트하면 오류
# 파이프라인은 항상 단방향이어야 함
# reference_data → data_collection → data_parsing → data_preprocessing → scoring → db_loading
```

**에러 메시지에 수정 방법 포함** (핵심):
```
나쁜 예: "ImportError: 모듈 의존성 위반"
좋은 예: "ImportError: src/data_parsing 에서 src/scoring 을 직접 임포트할 수 없습니다.
         파이프라인 단방향 규칙 위반 (docs/ARCHITECTURE.md 참조).
         수정: 두 단계 간 데이터는 DB 또는 파일을 통해 전달하세요."
```

**"황금 원칙" (Golden Rules) — 레포에 인코딩해야 할 불변 조건**:

1. **경계에서 데이터를 검증하라**: 각 파이프라인 단계의 입력/출력을 Pydantic 모델 또는 명시적 스키마로 정의한다. 딕셔너리를 그냥 넘기지 않는다.
   ```python
   # 나쁜 예 (YOLO 추측)
   def parse(data: dict) -> dict: ...
   
   # 좋은 예 (경계 검증)
   def parse(data: RawReportInput) -> ParsedReportOutput: ...
   ```

2. **공유 유틸리티를 중복 구현하지 마라**: 비슷한 헬퍼가 이미 있다면 새로 만들지 말고 기존 것을 쓴다.

3. **스코어링 로직을 데이터 접근 로직과 섞지 마라**: `scoring/` 모듈은 계산만, `db_loading/` 모듈은 적재만 담당한다.

### 4.4 파이프라인 통합 검증

단위 테스트만으로는 **파이프라인 단계 간 데이터 계약(인터페이스)** 위반을 잡을 수 없다.

예시: 파싱 단계가 `{"company_id": int}` 형식으로 출력했는데 스코어링이 `{"corp_id": str}`을 기대한다면, 각 단계의 단위 테스트는 모두 통과하지만 파이프라인 전체 실행은 실패한다.

**파이프라인 통합 검증 조건** (단계 간 변경 시 필수):
- 업스트림 단계의 출력 스키마가 다운스트림 입력과 일치하는가?
- 전체 파이프라인 실행 시 데이터 유실 없이 최종 DB에 적재되는가?

---

## 5. 세션 운영 규칙

### 5.1 세션 시작 시 (Clock In)

```
1. claude-progress.md 읽기 — 현재 상태 확인
2. session-handoff.md 읽기 — 미완료·블로커 확인
3. feature_list.json 읽기 — 활성 피처 확인
4. init.sh 실행 또는 검증 명령 실행 — 레포가 일관된 상태인지 확인
5. claude-progress.md의 "다음 작업"에서 이어서 시작
```

### 5.2 세션 종료 시 (Clock Out)

```
1. claude-progress.md 업데이트 (완료/진행중/다음 작업)
2. feature_list.json 상태 업데이트
3. clean-state-checklist.md 체크 실행
4. 완료된 작업 커밋 (작업 단위별 atomic commit)
5. session-handoff.md 업데이트 (미완료 작업이 있는 경우)
```

### 5.3 세션 종료 조건 (Clean State 5개 차원)

| 차원 | 확인 내용 | 실패 시 처리 |
|------|-----------|-------------|
| 빌드 | 코드 임포트 오류 없음 | 수정 후 재검증 |
| 테스트 | 기존 테스트 + 신규 테스트 통과 | 수정 후 재검증 |
| 진행 기록 | `claude-progress.md` 업데이트됨 | 세션 종료 전 작성 |
| 임시 아티팩트 | 디버그 코드, 임시 파일 없음 | 정리 후 커밋 |
| 시작 경로 | 다음 세션이 `init.sh`로 시작 가능 | 스크립트 수정 |

"나중에 정리하자"는 "절대 정리 안 한다"는 뜻이다. 엔트로피 증가는 기본 상태다.

---

## 6. 레포지토리를 단일 진실 공급원으로

**에이전트에게 레포에 없는 정보는 존재하지 않는다.**

### 6.1 신선 세션 테스트 (현재 이 레포 기준)

새 에이전트 세션이 레포 내용만 보고 다음 5가지 질문에 답할 수 있는가?

| 질문 | 정답을 찾을 수 있는 파일 |
|------|--------------------------|
| 이 시스템은 무엇인가? | `AGENTS.md`, `docs/PRODUCT.md` |
| 어떻게 구성되어 있는가? | `docs/ARCHITECTURE.md`, 각 모듈 `ARCHITECTURE.md` |
| 어떻게 실행하는가? | `init.sh` (현재 비어 있음 — 채워야 함) |
| 어떻게 검증하는가? | `AGENTS.md` 검증 섹션 (현재 없음 — 추가 필요) |
| 현재 어디까지 왔는가? | `claude-progress.md` (현재 비어 있음 — 채워야 함) |

### 6.2 docs/ 디렉토리 구조 (권장)

OpenAI 실제 운영 사례에서 가장 효과적으로 검증된 구조:

```
docs/
├── generated/          # 자동 생성 문서 — 절대 수동 편집 금지
│   └── db-schema.md    # 현재 DB 스키마 자동 덤프 (에이전트가 항상 최신 스키마 참조)
├── references/         # 외부 의존성 LLM-친화 문서
│   ├── dart-api.md     # DART 오픈 API 사용법 요약
│   ├── krx-api.md      # KRX API 사용법 요약
│   └── edinet-api.md   # EDINET API 사용법 요약
├── exec-plans/         # 실행 계획 (1급 아티팩트)
│   ├── active/         # 현재 진행 중인 계획
│   ├── completed/      # 완료된 계획 (의사결정 로그 보존)
│   └── tech-debt-tracker.md  # 알려진 기술 부채 목록
├── ARCHITECTURE.md     # 전체 시스템 아키텍처
├── PRODUCT.md          # 제품 목표 및 요구사항
├── RELIABILITY.md      # 신뢰성 요구사항
├── database-rules.md   # DB 조작 하드 컨스트레인트
└── schema-design-rules.md
```

**`docs/generated/` 원칙**: 코드나 DB에서 자동 생성되는 문서를 저장. 에이전트가 "현재 실제 스키마"를 항상 참조할 수 있도록 한다. 이 프로젝트에서는 DB 스키마 재설계 후 `db-schema.md`를 자동 갱신하는 스크립트를 만들어야 한다.

**`docs/references/` 원칙**: 외부 서비스(DART, KRX, EDINET) API 문서를 레포 내부로 내재화한다. 에이전트가 외부 URL에 접근할 수 없을 때 이 파일이 유일한 참조 소스가 된다.

**`exec-plans/` 원칙**: 실행 계획을 1급 아티팩트로 취급한다. 버전 관리되고, 같은 위치에 보관되어 에이전트가 외부 컨텍스트 없이도 작업할 수 있어야 한다. `claude-progress.md`는 세션 상태용이고, `exec-plans/active/`는 설계 의사결정이 필요한 복잡한 작업용이다.

### 6.3 지식 위치 원칙

- **코드 옆에 지식을 둔다**: API 인증 규칙은 해당 모듈 `ARCHITECTURE.md`에, 전역 제약은 `AGENTS.md`에.
- **코드 변경과 문서 업데이트는 동시에**: 코드를 바꾸면 해당 `ARCHITECTURE.md`도 업데이트한다.
- **오래된 문서는 없는 것보다 위험하다**: 잘못된 정보가 에이전트를 틀린 방향으로 유도한다.

### 6.4 Hard Constraints 작성 원칙 (`AGENTS.md` 현재 잘 적용됨)

```
MUST / MUST NOT 언어 사용:
  "CERs 방법론을 임의로 발명하지 말 것"
  "scoring 로직을 문서 없이 구현하지 말 것"
  "모듈 간 로직을 레포 문서 없이 이동하지 말 것"
```

---

## 7. 에이전트가 일찍 완료를 선언하는 것을 막는 방법

### 7.1 완료 판단 외부화

완료 판단은 에이전트 자신이 내리지 않는다. **실행 결과가 판단한다.**

```markdown
## Definition of Done (AGENTS.md에 추가 권장)
- 피처 완료 = 검증 명령 통과, "코드가 작성됨"이 아님
- 검증 순서:
  1. 단위 테스트 통과
  2. 타입 체크 통과
  3. 파이프라인 통합 검증 통과 (단계 간 변경 시)
- 1단계 실패 시 2단계로 이동하지 않음
```

### 7.2 에러 메시지는 수정 방법을 포함해야 한다

```
나쁜 예: "테스트 실패"
좋은 예: "테스트 실패: test_company_score.py::test_score_range
         기대값: 0.0 ~ 1.0 사이의 float
         실제값: None (스코어링 로직이 None을 반환)
         수정: src/scoring/scorer.py의 calculate() 반환값 확인"
```

### 7.3 "겸사겸사 리팩토링" 금지

핵심 기능이 검증되기 전에 코드 스타일, 성능 최적화, 관련 없는 파일 정리를 하지 않는다. 검증 전 리팩토링은 이미 암묵적으로 맞았던 코드 경로를 깨뜨릴 수 있다.

---

## 8. DB 스키마 자동 문서화

DB를 재설계할 때마다 `docs/generated/db-schema.md`를 자동으로 갱신해야 한다. 에이전트가 항상 최신 스키마를 참조할 수 있어야 하기 때문이다.

**스키마 덤프 스크립트 (권장)**:
```python
# scripts/dump_schema.py
# 실행: python scripts/dump_schema.py > docs/generated/db-schema.md
# DB 스키마 변경 후 반드시 실행
```

이 스크립트를 `init.sh` 또는 `AGENTS.md`의 "DB 작업 후" 체크리스트에 포함시킨다. 에이전트가 스키마를 수정하면 자동으로 문서도 갱신되어야 한다.

---

## 9. 하네스 유지보수 원칙

### 9.1 하네스도 기술 부채가 쌓인다

- `AGENTS.md`의 규칙은 출처, 적용 조건, 폐기 조건을 함께 관리하라.
- 더 이상 필요 없는 제약은 삭제하라. 미래를 위해 남겨두는 규칙은 노이즈가 된다.
- 모델 성능이 향상되면 일부 하네스 컴포넌트가 불필요해진다. 주기적으로 임시 비활성화 테스트를 통해 확인하라.

### 9.2 하네스 강화 루프

```
에이전트 실수 발견
→ 원인 귀인: 5개 레이어 중 어느 것?
→ 해당 레이어 수정 (규칙 추가, 문서 업데이트, 검증 명령 추가)
→ 같은 방식으로 다시 실패하지 않음
```

코드 리뷰에서 반복되는 지적 사항이 있으면 → 자동화 체크로 변환하라.

---

## 10. 당장 해야 할 것

아래 파일들이 비어 있어 하네스가 실질적으로 작동하지 않는다. 첫 번째 구현 세션 시작 전에 반드시 채워야 한다:

| 파일/디렉토리 | 해야 할 것 |
|--------------|-----------|
| `init.sh` | 의존성 설치 + 환경 검증 + 예제 테스트 실행 명령 |
| `claude-progress.md` | 현재 상태, 완료/진행중/다음 작업 |
| `feature_list.json` | 모든 피처 항목 (id, stage, behavior, verification, state) |
| `clean-state-checklist.md` | 세션 종료 체크리스트 항목 |
| `AGENTS.md` 검증 섹션 | 각 단계별 실행 가능한 검증 명령 |
| `docs/generated/db-schema.md` | DB 재설계 완료 후 스키마 자동 덤프 스크립트 작성 및 실행 |
| `docs/references/` | DART, KRX, EDINET API 문서 내재화 |
| `docs/exec-plans/active/` | 현재 DB 재설계 계획 문서 작성 |
