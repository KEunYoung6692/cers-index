import "server-only";

import { access } from "node:fs/promises";
import path from "node:path";

export type CompanyReportAsset = {
  companyId: string;
  storageKey: string;
  sourcePath: string;
};

// This currently points every company to the same local fixture.
// When S3 is introduced, swap `sourcePath` for a signed object lookup using `storageKey`.
export function getCompanyReportAsset(companyId: string): CompanyReportAsset {
  return {
    companyId,
    storageKey: `companies/${companyId}/reports/2025/main.pdf`,
    sourcePath: path.join(process.cwd(), "config", "삼성전자_2025.pdf"),
  };
}

export async function hasCompanyReportAsset(companyId: string) {
  try {
    await access(getCompanyReportAsset(companyId).sourcePath);
    return true;
  } catch {
    return false;
  }
}

export function getCompanyReportApiPath(companyId: string) {
  return `/api/companies/${companyId}/report`;
}
