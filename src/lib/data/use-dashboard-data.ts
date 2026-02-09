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

export function useDashboardData() {
  const [data, setData] = useState<DashboardData>(DATA_SOURCE === "db" ? EMPTY_DASHBOARD_DATA : mockDashboardData);
  const [loading, setLoading] = useState(DATA_SOURCE === "db");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (DATA_SOURCE !== "db") return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/dashboard")
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
  }, []);

  return {
    data,
    loading,
    error,
    source: DATA_SOURCE,
  };
}
