"use client";

import { useEffect, useState } from "react";
import { mockDashboardData, type DashboardData } from "./dashboard";

const DATA_SOURCE = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "mock";
const EMPTY_DASHBOARD_DATA: DashboardData = {
  companies: [],
  scoreRuns: {},
  reports: {},
  emissionsData: {},
  targets: {},
  industryData: {},
  evidenceItems: {},
};

type DashboardFetchScope = "full" | "main";

type UseDashboardDataOptions = {
  scope?: DashboardFetchScope;
  country?: string;
  companyId?: string;
};

export function useDashboardData(options?: UseDashboardDataOptions) {
  const scope = options?.scope ?? "full";
  const country = options?.country?.trim().toUpperCase() || "";
  const companyId = options?.companyId?.trim() || "";
  const [data, setData] = useState<DashboardData>(DATA_SOURCE === "db" ? EMPTY_DASHBOARD_DATA : mockDashboardData);
  const [loading, setLoading] = useState(DATA_SOURCE === "db");
  const [error, setError] = useState<string | null>(null);
  const [resolvedCompanyId, setResolvedCompanyId] = useState<string | null>(null);

  useEffect(() => {
    if (DATA_SOURCE !== "db") return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setResolvedCompanyId(null);

    const params = new URLSearchParams();
    if (scope !== "full") params.set("scope", scope);
    if (country) params.set("country", country);
    if (companyId) params.set("companyId", companyId);
    const query = params.toString();
    const url = query ? `/api/dashboard?${query}` : "/api/dashboard";

    fetch(url)
      .then(async (response) => {
        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          throw new Error(payload?.error || `Failed to load dashboard data (${response.status})`);
        }
        return response.json();
      })
      .then((payload) => {
        if (cancelled) return;
        if (payload?.data) {
          setData(payload.data as DashboardData);
        }
        setResolvedCompanyId(typeof payload?.meta?.selectedCompanyId === "string" ? payload.meta.selectedCompanyId : null);
      })
      .catch((err: Error) => {
        if (cancelled) return;
        setError(err.message);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [scope, country, companyId]);

  return {
    data,
    loading,
    error,
    source: DATA_SOURCE,
    resolvedCompanyId,
  };
}
