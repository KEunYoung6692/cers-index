import { readFile, stat } from "node:fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { getCompanyReportAsset } from "@/lib/server/report-assets";

export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Accept-Ranges": "bytes",
  "Cache-Control": "private, no-store, no-cache, must-revalidate, max-age=0",
  "Content-Disposition": 'inline; filename="view-only-report.pdf"',
  "Content-Security-Policy": "frame-ancestors 'self'",
  "Content-Type": "application/pdf",
  "Cross-Origin-Resource-Policy": "same-origin",
  Expires: "0",
  Pragma: "no-cache",
  "Referrer-Policy": "same-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "SAMEORIGIN",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
} as const;

function parseByteRange(rangeHeader: string | null, size: number) {
  if (!rangeHeader) return null;

  const match = /^bytes=(\d*)-(\d*)$/.exec(rangeHeader.trim());
  if (!match) return "invalid" as const;

  const [, startToken, endToken] = match;
  if (!startToken && !endToken) return "invalid" as const;

  let start = 0;
  let end = size - 1;

  if (!startToken) {
    const suffixLength = Number(endToken);
    if (!Number.isFinite(suffixLength) || suffixLength <= 0) return "invalid" as const;
    start = Math.max(0, size - suffixLength);
  } else {
    start = Number(startToken);
    end = endToken ? Number(endToken) : size - 1;
  }

  if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end < start || end >= size) {
    return "invalid" as const;
  }

  return { end, start };
}

async function getFileBuffer(companyId: string) {
  const asset = getCompanyReportAsset(companyId);
  const fileStat = await stat(asset.sourcePath);
  const buffer = await readFile(asset.sourcePath);

  return {
    buffer,
    size: fileStat.size,
  };
}

export async function HEAD(
  _request: NextRequest,
  context: { params: Promise<{ companyId: string }> },
) {
  const { companyId } = await context.params;

  try {
    const { size } = await getFileBuffer(companyId);
    return new NextResponse(null, {
      headers: {
        ...CACHE_HEADERS,
        "Content-Length": String(size),
      },
      status: 200,
    });
  } catch {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ companyId: string }> },
) {
  const { companyId } = await context.params;

  try {
    const { buffer, size } = await getFileBuffer(companyId);
    const requestedRange = parseByteRange(request.headers.get("range"), size);

    if (requestedRange === "invalid") {
      return new NextResponse(null, {
        headers: {
          ...CACHE_HEADERS,
          "Content-Range": `bytes */${size}`,
        },
        status: 416,
      });
    }

    if (!requestedRange) {
      return new NextResponse(buffer, {
        headers: {
          ...CACHE_HEADERS,
          "Content-Length": String(size),
        },
        status: 200,
      });
    }

    const chunk = buffer.subarray(requestedRange.start, requestedRange.end + 1);

    return new NextResponse(chunk, {
      headers: {
        ...CACHE_HEADERS,
        "Content-Length": String(chunk.length),
        "Content-Range": `bytes ${requestedRange.start}-${requestedRange.end}/${size}`,
      },
      status: 206,
    });
  } catch {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }
}
