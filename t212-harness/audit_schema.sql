-- T212 Paper-Trading Audit Log Schema
-- Card: t_932391ac
-- SQLite-compatible; also accepted by Postgres with minor type adjustments.
-- Every event (paper trade, blocked attempt, policy violation) writes a row.

CREATE TABLE IF NOT EXISTS t212_audit_events (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    logged_at       TEXT    NOT NULL,               -- ISO-8601 UTC timestamp
    event_type      TEXT    NOT NULL,               -- PAPER_TRADE | LIVE_ORDER_BLOCKED | POLICY_VIOLATION
    instrument      TEXT,                           -- ticker symbol, e.g. AMZN
    side            TEXT CHECK (side IN ('BUY','SELL',NULL)),
    qty             REAL,
    price_usd       REAL,
    notional_usd    REAL,                           -- qty * price_usd
    thesis          TEXT,                           -- AI-generated rationale (required for paper trades)
    data_sources    TEXT,                           -- comma-separated source labels
    mode            TEXT CHECK (mode IN ('PAPER','PROPOSAL','LIVE_BLOCKED')),
    kill_switch_on  INTEGER NOT NULL DEFAULT 1,     -- 1 = live disabled, 0 = live enabled
    approval_token  TEXT,                           -- NULL unless a token was supplied (never logged in plain)
    approval_present INTEGER NOT NULL DEFAULT 0,    -- 1 if token was present, 0 otherwise
    block_reason    TEXT,                           -- populated when event_type = LIVE_ORDER_BLOCKED
    policy_field    TEXT,                           -- which policy field was violated
    raw_json        TEXT                            -- full JSON payload for forensics
);

-- Index for time-range audit queries
CREATE INDEX IF NOT EXISTS idx_t212_audit_logged_at ON t212_audit_events(logged_at);

-- Index for filtering by event type
CREATE INDEX IF NOT EXISTS idx_t212_audit_event_type ON t212_audit_events(event_type);

-- View: proposed-but-blocked orders (Hafs review surface)
CREATE VIEW IF NOT EXISTS v_blocked_live_orders AS
    SELECT id, logged_at, instrument, side, qty, notional_usd, block_reason
    FROM   t212_audit_events
    WHERE  event_type = 'LIVE_ORDER_BLOCKED'
    ORDER  BY logged_at DESC;

-- View: paper trade history
CREATE VIEW IF NOT EXISTS v_paper_trades AS
    SELECT id, logged_at, instrument, side, qty, price_usd, notional_usd, thesis
    FROM   t212_audit_events
    WHERE  event_type = 'PAPER_TRADE'
    ORDER  BY logged_at DESC;
