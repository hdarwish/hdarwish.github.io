#!/usr/bin/env python3
"""
T212 Paper-Trading Safety Harness
Card: t_932391ac

Guardrails:
- No live broker writes by default (kill switch via env var).
- Any live-order path requires T212_LIVE_ENABLED=true AND a per-order T212_APPROVAL_TOKEN.
- Even then, the live execution stub is not implemented — it exits with an explicit block.
- All events (paper trades, blocks, violations) are appended to audit.jsonl.

Usage:
  python harness.py paper-trade --instrument AMZN --side BUY --qty 2 --price 185.50 --thesis "..."
  python harness.py live-order  --instrument AMZN --side BUY --qty 1   # always blocked
  python harness.py show-policy
  python harness.py show-audit
"""

import os
import sys
import json
import argparse
from datetime import datetime, timezone
from pathlib import Path

# ---------------------------------------------------------------------------
# Kill switch — checked before any broker interaction
# ---------------------------------------------------------------------------
LIVE_ENABLED = os.environ.get("T212_LIVE_ENABLED", "false").lower() == "true"
APPROVAL_TOKEN = os.environ.get("T212_APPROVAL_TOKEN", "")

# ---------------------------------------------------------------------------
# Risk policy (hard-coded defaults; future: load from risk_policy.yaml)
# ---------------------------------------------------------------------------
RISK_POLICY = {
    "max_position_usd": 500.0,
    "max_daily_notional_usd": 1000.0,
    "allowed_instruments": {"AMZN", "AAPL", "MSFT", "GOOGL", "META", "VOO", "VTI", "VWRA"},
    "allowed_order_types": {"MARKET", "LIMIT"},
    "leverage_allowed": False,
    "cfds_allowed": False,
    "options_allowed": False,
}

HARNESS_DIR = Path(__file__).parent
AUDIT_LOG = HARNESS_DIR / "audit.jsonl"

COMPLIANCE_FOOTER = (
    "\nEDUCATIONAL PURPOSES ONLY. Not financial advice. "
    "Capital at risk. No stock picks or buy/sell recommendations."
)

# ---------------------------------------------------------------------------
# Audit
# ---------------------------------------------------------------------------

def _append_audit(record: dict) -> None:
    record.setdefault("logged_at", datetime.now(timezone.utc).isoformat())
    with AUDIT_LOG.open("a") as fh:
        fh.write(json.dumps(record) + "\n")


# ---------------------------------------------------------------------------
# Policy enforcement
# ---------------------------------------------------------------------------

def _check_policy(instrument: str, side: str, qty: float, price: float) -> None:
    violations = []

    if instrument not in RISK_POLICY["allowed_instruments"]:
        violations.append(f"instrument '{instrument}' not in allowlist")

    if "_CFD" in instrument.upper():
        violations.append("CFD instruments are not allowed")

    if instrument.startswith("OPT:"):
        violations.append("options are not allowed")

    notional = qty * price
    if notional > RISK_POLICY["max_position_usd"]:
        violations.append(
            f"notional ${notional:.2f} exceeds max_position_usd "
            f"${RISK_POLICY['max_position_usd']:.2f}"
        )

    if violations:
        record = {
            "event": "POLICY_VIOLATION",
            "instrument": instrument,
            "side": side,
            "qty": qty,
            "price_usd": price,
            "notional_usd": qty * price,
            "violations": violations,
            "kill_switch_on": not LIVE_ENABLED,
        }
        _append_audit(record)
        print("POLICY VIOLATION:", file=sys.stderr)
        for v in violations:
            print(f"  - {v}", file=sys.stderr)
        sys.exit(2)


# ---------------------------------------------------------------------------
# Commands
# ---------------------------------------------------------------------------

def cmd_paper_trade(args: argparse.Namespace) -> None:
    _check_policy(args.instrument, args.side, args.qty, args.price)

    notional = args.qty * args.price
    record = {
        "event": "PAPER_TRADE",
        "instrument": args.instrument,
        "side": args.side,
        "qty": args.qty,
        "price_usd": args.price,
        "notional_usd": round(notional, 4),
        "thesis": args.thesis,
        "data_sources": args.sources,
        "mode": "PAPER",
        "live_order_placed": False,
        "kill_switch_on": not LIVE_ENABLED,
        "approval_present": bool(APPROVAL_TOKEN),
    }
    _append_audit(record)

    print("=" * 60)
    print("PAPER TRADE SIMULATED (no real order placed)")
    print("=" * 60)
    print(f"  Instrument : {args.instrument}")
    print(f"  Side       : {args.side}")
    print(f"  Qty        : {args.qty}")
    print(f"  Mock price : ${args.price:.2f}")
    print(f"  Notional   : ${notional:.2f}")
    print(f"  Thesis     : {args.thesis}")
    print(f"  Sources    : {args.sources}")
    print(f"  Audit log  : {AUDIT_LOG}")
    print(f"  Live mode  : {'ENABLED (token still required)' if LIVE_ENABLED else 'DISABLED (kill switch active)'}")
    print(COMPLIANCE_FOOTER)


def cmd_live_order(args: argparse.Namespace) -> None:
    """Attempt a live order — always blocked by default."""
    reasons = []

    if not LIVE_ENABLED:
        reasons.append("T212_LIVE_ENABLED is not set to 'true' (kill switch active)")

    if not APPROVAL_TOKEN:
        reasons.append("T212_APPROVAL_TOKEN not set (per-order Hafs approval required)")

    # Even if both env vars were set, live execution is not implemented.
    # This ensures there is no code path that reaches a real broker endpoint.
    reasons.append(
        "Live order execution is not implemented in this harness — "
        "a separate approved card is required for any real broker integration"
    )

    record = {
        "event": "LIVE_ORDER_BLOCKED",
        "instrument": args.instrument,
        "side": args.side,
        "qty": args.qty,
        "mode": "LIVE_BLOCKED",
        "kill_switch_on": not LIVE_ENABLED,
        "approval_present": bool(APPROVAL_TOKEN),
        "block_reasons": reasons,
    }
    _append_audit(record)

    print("=" * 60, file=sys.stderr)
    print("LIVE ORDER BLOCKED", file=sys.stderr)
    print("=" * 60, file=sys.stderr)
    for r in reasons:
        print(f"  REASON: {r}", file=sys.stderr)
    print(f"\n  Audit log  : {AUDIT_LOG}", file=sys.stderr)
    sys.exit(1)


def cmd_show_policy(_args: argparse.Namespace) -> None:
    print(json.dumps(
        {k: list(v) if isinstance(v, set) else v for k, v in RISK_POLICY.items()},
        indent=2,
    ))


def cmd_show_audit(_args: argparse.Namespace) -> None:
    if not AUDIT_LOG.exists():
        print("(no audit log yet)")
        return
    with AUDIT_LOG.open() as fh:
        for line in fh:
            line = line.strip()
            if line:
                print(json.dumps(json.loads(line), indent=2))


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def build_parser() -> argparse.ArgumentParser:
    p = argparse.ArgumentParser(
        description="T212 Paper-Trading Safety Harness (card t_932391ac)"
    )
    sub = p.add_subparsers(dest="cmd", required=True)

    pt = sub.add_parser("paper-trade", help="Simulate a paper trade (no real order)")
    pt.add_argument("--instrument", required=True, help="Ticker symbol, e.g. AMZN")
    pt.add_argument("--side", choices=["BUY", "SELL"], required=True)
    pt.add_argument("--qty", type=float, required=True, help="Number of shares")
    pt.add_argument("--price", type=float, default=100.0, help="Mock price in USD (no live feed)")
    pt.add_argument("--thesis", default="No thesis provided", help="Rationale for the trade")
    pt.add_argument("--sources", default="mock-data", help="Data sources used")
    pt.set_defaults(func=cmd_paper_trade)

    lo = sub.add_parser("live-order", help="Attempt live order — always blocked by default")
    lo.add_argument("--instrument", required=True)
    lo.add_argument("--side", choices=["BUY", "SELL"], required=True)
    lo.add_argument("--qty", type=float, required=True)
    lo.set_defaults(func=cmd_live_order)

    sub.add_parser("show-policy", help="Print active risk policy").set_defaults(func=cmd_show_policy)
    sub.add_parser("show-audit", help="Print audit log").set_defaults(func=cmd_show_audit)

    return p


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    args.func(args)


if __name__ == "__main__":
    main()
