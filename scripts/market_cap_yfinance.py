#!/usr/bin/env python3

import json
import logging
import math
import sys
from typing import Any, Dict, List


def is_valid_market_cap(value: Any) -> bool:
    try:
        number = float(value)
    except (TypeError, ValueError):
        return False
    return math.isfinite(number) and number > 0


def normalize_symbols(raw_symbols: Any) -> List[str]:
    if not isinstance(raw_symbols, list):
        return []

    normalized: List[str] = []
    seen = set()

    for item in raw_symbols:
        if not isinstance(item, str):
            continue
        symbol = item.strip().upper()
        if not symbol or symbol in seen:
            continue
        seen.add(symbol)
        normalized.append(symbol)

    return normalized


def load_input() -> Dict[str, Any]:
    raw = sys.stdin.read()
    if not raw.strip():
        return {}

    try:
        payload = json.loads(raw)
    except json.JSONDecodeError:
        return {"invalid_json": True}

    if not isinstance(payload, dict):
        return {"invalid_json": True}

    return payload


def print_json(payload: Dict[str, Any]) -> None:
    print(json.dumps(payload, ensure_ascii=False))


def extract_market_cap_from_ticker(ticker: Any) -> Any:
    market_cap = None
    internal_errors: List[str] = []

    try:
        fast_info = ticker.fast_info
        market_cap = fast_info.get("market_cap")
        if not is_valid_market_cap(market_cap):
            market_cap = fast_info.get("marketCap")
    except Exception as exc:
        internal_errors.append(f"fast_info:{exc.__class__.__name__}")
        market_cap = None

    if is_valid_market_cap(market_cap):
        return int(float(market_cap)), None

    try:
        info = ticker.info
        if isinstance(info, dict):
            market_cap = info.get("marketCap")
    except Exception as exc:
        internal_errors.append(f"info:{exc.__class__.__name__}")
        market_cap = None

    if is_valid_market_cap(market_cap):
        return int(float(market_cap)), None

    if internal_errors:
        return None, "|".join(internal_errors[:2])

    return None, None


def main() -> int:
    payload = load_input()
    if payload.get("invalid_json"):
        print_json(
            {
                "ok": False,
                "error": "invalid_input_json",
                "results": {},
            }
        )
        return 0

    symbols = normalize_symbols(payload.get("symbols"))
    if not symbols:
        print_json(
            {
                "ok": True,
                "results": {},
                "inputCount": 0,
                "resolvedCount": 0,
            }
        )
        return 0

    try:
        import yfinance as yf
        logging.getLogger("yfinance").setLevel(logging.CRITICAL)
    except Exception as exc:
        print_json(
            {
                "ok": False,
                "missingYfinance": True,
                "error": f"failed_to_import_yfinance:{exc.__class__.__name__}",
                "results": {},
                "inputCount": len(symbols),
                "resolvedCount": 0,
            }
        )
        return 0

    results: Dict[str, int] = {}
    errors: List[str] = []
    network_errors = 0

    try:
        tickers = yf.Tickers(" ".join(symbols))
    except Exception as exc:
        print_json(
            {
                "ok": False,
                "error": f"failed_to_initialize_tickers:{exc.__class__.__name__}",
                "results": {},
                "inputCount": len(symbols),
                "resolvedCount": 0,
            }
        )
        return 0

    for symbol in symbols:
        ticker = tickers.tickers.get(symbol)
        if ticker is None:
            errors.append(f"{symbol}:ticker_not_found")
            continue

        market_cap, detail_error = extract_market_cap_from_ticker(ticker)
        if market_cap is None:
            if detail_error:
                errors.append(f"{symbol}:{detail_error}")
                if "DNSError" in detail_error or "Timeout" in detail_error:
                    network_errors += 1
            else:
                errors.append(f"{symbol}:market_cap_unavailable")
            continue

        results[symbol] = market_cap

    response: Dict[str, Any] = {
        "ok": True,
        "results": results,
        "inputCount": len(symbols),
        "resolvedCount": len(results),
    }

    if errors:
        response["errors"] = errors[:50]

    if network_errors > 0 and len(results) == 0:
        response["ok"] = False
        response["error"] = "network_or_dns_failure"

    print_json(response)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
