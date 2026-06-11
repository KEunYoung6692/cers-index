import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const errors = [];
const warnings = [];

function fail(message, fix) {
  errors.push({ message, fix });
}

function warn(message) {
  warnings.push(message);
}

function readJson(relativePath) {
  try {
    return JSON.parse(readFileSync(path.join(root, relativePath), "utf8"));
  } catch (error) {
    fail(`${relativePath}를 읽거나 JSON으로 파싱할 수 없습니다: ${error.message}`, `${relativePath} 문법을 수정하세요.`);
    return null;
  }
}

function checkNodeVersion() {
  const [major, minor] = process.versions.node.split(".").map(Number);
  if (major < 20 || (major === 20 && minor < 19)) {
    fail(
      `Node.js ${process.versions.node}가 실행 중입니다. 이 저장소는 Node.js 20.19.0 이상이 필요합니다.`,
      "`nvm use`를 실행한 뒤 명령을 다시 실행하세요.",
    );
  }
}

function checkRequiredFiles() {
  const requiredFiles = [
    "AGENTS.md",
    "docs/ARCHITECTURE.md",
    "docs/DECISIONS.md",
    "docs/ENVIRONMENT.md",
    "docs/QUALITY.md",
    "docs/TESTING.md",
    "feature_list.json",
    "claude-progress.txt",
    "session-handoff.md",
  ];

  for (const relativePath of requiredFiles) {
    if (!existsSync(path.join(root, relativePath))) {
      fail(`${relativePath}가 없습니다.`, "새 세션이 저장소만 보고 상태를 복구할 수 있도록 파일을 복원하세요.");
    }
  }
}

function checkPackageScripts() {
  const packageJson = readJson("package.json");
  if (!packageJson) return;

  const requiredScripts = ["build", "check", "check:harness", "check:quick", "dev", "lint", "test", "typecheck"];
  for (const script of requiredScripts) {
    if (!packageJson.scripts?.[script]) {
      fail(`package.json scripts에 '${script}'가 없습니다.`, `로컬과 CI가 같은 검증 경로를 사용하도록 '${script}'를 복원하세요.`);
    }
  }
}

function checkFeatureList() {
  const features = readJson("feature_list.json");
  if (!features) return;
  if (!Array.isArray(features)) {
    fail("feature_list.json의 루트는 배열이어야 합니다.", "각 피처 객체를 JSON 배열 안에 배치하세요.");
    return;
  }

  const allowedStates = new Set(["not_started", "active", "blocked", "passing"]);
  const ids = new Set();
  let activeCount = 0;

  for (const [index, feature] of features.entries()) {
    const label = feature?.id || `index ${index}`;
    if (!feature || typeof feature !== "object" || Array.isArray(feature)) {
      fail(`피처 ${label}가 객체가 아닙니다.`, "id, behavior, verification, state를 가진 객체로 수정하세요.");
      continue;
    }

    if (!/^F\d{2}$/.test(feature.id ?? "")) {
      fail(`피처 ${label}의 id 형식이 잘못되었습니다.`, "F01 형태의 고유 id를 사용하세요.");
    } else if (ids.has(feature.id)) {
      fail(`중복 피처 id '${feature.id}'가 있습니다.`, "각 피처에 고유 id를 부여하세요.");
    } else {
      ids.add(feature.id);
    }

    for (const field of ["behavior", "verification"]) {
      if (typeof feature[field] !== "string" || feature[field].trim() === "") {
        fail(`피처 ${label}의 ${field}가 비어 있습니다.`, "실행 가능한 완료 계약을 문자열로 기록하세요.");
      }
    }

    if (!allowedStates.has(feature.state)) {
      fail(
        `피처 ${label}의 state '${feature.state}'가 허용되지 않습니다.`,
        "not_started, active, blocked, passing 중 하나를 사용하세요.",
      );
    }

    if (feature.state === "active") activeCount += 1;
    if (feature.state === "blocked" && (typeof feature.blocked_by !== "string" || feature.blocked_by.trim() === "")) {
      fail(`blocked 피처 ${label}에 blocked_by가 없습니다.`, "외부 의존성과 해제 조건을 blocked_by에 기록하세요.");
    }
    if (feature.state === "passing" && (typeof feature.evidence !== "string" || feature.evidence.trim() === "")) {
      fail(`passing 피처 ${label}에 evidence가 없습니다.`, "성공한 명령이나 런타임 확인 결과를 기록하세요.");
    }
  }

  if (activeCount > 1) {
    fail(
      `feature_list.json에 active 피처가 ${activeCount}개입니다.`,
      "WIP=1 규칙에 따라 현재 검증할 피처 하나만 active로 두고 나머지는 not_started 또는 blocked로 변경하세요.",
    );
  }
  if (activeCount === 0) {
    warn("active 피처가 없습니다. 제품 작업을 시작할 때 정확히 하나를 active로 전환하세요.");
  }
}

function checkClientServerBoundary() {
  const sourceRoot = path.join(root, "src");
  const sourceFiles = [];

  function walk(directory) {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const absolutePath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(absolutePath);
      } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
        sourceFiles.push(absolutePath);
      }
    }
  }

  walk(sourceRoot);

  for (const absolutePath of sourceFiles) {
    const source = readFileSync(absolutePath, "utf8");
    if (!/^["']use client["'];/m.test(source)) continue;

    const relativePath = path.relative(root, absolutePath);
    if (/from\s+["'][^"']*lib\/server(?:\/[^"']*)?["']/.test(source)) {
      fail(
        `${relativePath}가 Client Component에서 server 모듈을 import합니다.`,
        "DB/파일 접근은 Server Component 또는 route handler로 이동하고 직렬화된 데이터만 client에 전달하세요.",
      );
    }
  }
}

function checkIgnoredArtifacts() {
  const gitignorePath = path.join(root, ".gitignore");
  if (!existsSync(gitignorePath)) {
    fail(".gitignore가 없습니다.", "비밀정보와 생성물을 추적하지 않도록 .gitignore를 복원하세요.");
    return;
  }

  const gitignore = readFileSync(gitignorePath, "utf8");
  const requiredPatterns = [".env", "/.next/", "/.playwright-mcp/", "/node_modules"];
  for (const pattern of requiredPatterns) {
    if (!gitignore.split("\n").some((line) => line.trim() === pattern)) {
      fail(
        `.gitignore에 '${pattern}' 규칙이 없습니다.`,
        "로컬 비밀정보 또는 생성물이 커밋되지 않도록 ignore 규칙을 복원하세요.",
      );
    }
  }
}

checkNodeVersion();
checkRequiredFiles();
checkPackageScripts();
checkFeatureList();
checkClientServerBoundary();
checkIgnoredArtifacts();

for (const message of warnings) {
  console.warn(`WARN: ${message}`);
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`ERROR: ${error.message}`);
    console.error(`FIX: ${error.fix}`);
  }
  process.exit(1);
}

console.log("Harness checks passed.");
