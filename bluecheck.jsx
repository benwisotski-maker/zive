// ────────────── BlueCheck page ──────────────
const { useState: useStateBC } = React;

const BC_DATA = {
  accounting: {
    count: 3,
    description: "Ensure that the commitment history for all LPs is accurate when using date-based records.",
    issues: [
      { id: "a1", severity: "error", msg: "Beginning NAV since inception is not zero", date: "Q1 2026" },
      { id: "a2", severity: "error", msg: "Total of all partners' Profit & Loss (Net of Operating Income and Expenses) -$833,405.96 does not match the Balance Sheet Total Since Inception -$1,122,600.00", date: "Q1 2026" },
      { id: "a3", severity: "error", msg: "Gross IRR is −0%, which is less than Net IRR of 1.24%. Gross IRR should be ≥ Net IRR. Please verify the return calculations.", date: "Q1 2026" },
    ],
  },
  dataroom: {
    count: 11,
    sections: [
      {
        title: "Fund Reports",
        rows: [
          { id: "fr1", msg: "Report for Q1 2026 is missing", date: "Q1 2026" },
        ],
      },
      {
        title: "Capital Statements",
        rows: [
          { id: "cs1", msg: "Q1 2026 for Harlow Simmons is missing", date: "Q1 2026" },
          { id: "cs2", msg: "Q1 2026 for Redwood Creek Holdings, Inc. is missing", date: "Q1 2026" },
          { id: "cs3", msg: "Q1 2026 for Evelyn Chen is missing", date: "Q1 2026" },
          { id: "cs4", msg: "Q1 2026 for Blue Ridge Family Trust is missing", date: "Q1 2026" },
          { id: "cs5", msg: "Q1 2026 for Admin Ventures GP, LLC is missing", date: "Q1 2026" },
          { id: "cs6", msg: "Q1 2026 for Whitestone Capital is missing", date: "Q1 2026" },
          { id: "cs7", msg: "Q1 2026 for Lakeshore Heritage Trust is missing", date: "Q1 2026" },
          { id: "cs8", msg: "Q1 2026 for Ironclad Solutions Corp. is missing", date: "Q1 2026" },
          { id: "cs9", msg: "Q1 2026 for Jonathan D. Harris is missing", date: "Q1 2026" },
          { id: "cs10", msg: "Q1 2026 for Prairie Sky Ventures LLC is missing", date: "Q1 2026" },
        ],
      },
    ],
  },
  alerts: { count: 0 },
};

function BlueCheckPage() {
  const [tab, setTab] = useStateBC("accounting");
  const [bannerOpen, setBannerOpen] = useStateBC(true);
  const [includeHistory, setIncludeHistory] = useStateBC(true);
  const [toDate, setToDate] = useStateBC("07/20/2025");

  const totalIssues = BC_DATA.accounting.count + BC_DATA.dataroom.count + BC_DATA.alerts.count;

  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }} className="fade-up">
      {/* Header */}
      <div style={{ marginBottom: 20, display: "flex", alignItems: "baseline", gap: 14 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: -0.6 }}>BlueCheck</h1>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          height: 22, padding: "0 8px",
          background: "var(--accent-tint)",
          borderRadius: 6,
          fontSize: 11, fontWeight: 600,
          color: "var(--accent)",
          letterSpacing: 0.3, textTransform: "uppercase",
          boxShadow: "inset 0 0 0 1px var(--accent-ring-25)",
        }}>
          <Icon name="sparkle" size={10} />
          Auto-audit
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <Button variant="text" size="sm" icon="reimburse">Re-scan</Button>
          <Button variant="secondary" size="sm" icon="download">Download report</Button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: "1px solid var(--border)", paddingBottom: 0 }}>
        <BCTab active={tab === "accounting"} onClick={() => setTab("accounting")} label="Accounting" count={BC_DATA.accounting.count} tone="error" />
        <BCTab active={tab === "dataroom"} onClick={() => setTab("dataroom")} label="Data Room" count={BC_DATA.dataroom.count} tone="warn" />
        <BCTab active={tab === "alerts"} onClick={() => setTab("alerts")} label="Alerts" count={BC_DATA.alerts.count} tone="neutral" />
      </div>

      {/* Summary banner */}
      {bannerOpen && (
        <div style={{
          marginBottom: 20,
          padding: "14px 16px",
          borderRadius: 12,
          background: "linear-gradient(180deg, rgba(248,113,113,0.08) 0%, rgba(248,113,113,0.04) 100%)",
          border: "1px solid rgba(248,113,113,0.20)",
          display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            background: "rgba(248,113,113,0.14)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--neg)",
          }}>
            <Icon name="shieldCheck" size={16} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)", marginBottom: 2 }}>BlueCheck</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
              You have <span style={{ color: "var(--fg-2)", fontWeight: 500 }}>{totalIssues} unresolved issues</span> across your fund. Review each section below to resolve them.
            </div>
          </div>
          <button onClick={() => setBannerOpen(false)} style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: "var(--muted-2)", padding: 4, borderRadius: 6,
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--fg)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-2)"; }}
          >
            <Icon name="close" size={14} />
          </button>
        </div>
      )}

      {/* Content by tab */}
      {tab === "accounting" && (
        <BCAccounting
          data={BC_DATA.accounting}
          toDate={toDate}
          setToDate={setToDate}
          includeHistory={includeHistory}
          setIncludeHistory={setIncludeHistory}
        />
      )}
      {tab === "dataroom" && <BCDataRoom data={BC_DATA.dataroom} />}
      {tab === "alerts" && <BCAlerts />}
    </div>
  );
}

function BCTab({ label, count, active, onClick, tone = "neutral" }) {
  const countColor = {
    error: "var(--neg)",
    warn: "var(--warn)",
    neutral: "var(--muted-2)",
  }[tone];
  return (
    <button onClick={onClick} style={{
      position: "relative",
      height: 38,
      padding: "0 14px",
      background: "transparent",
      border: "none",
      borderBottom: active ? "2px solid var(--fg)" : "2px solid transparent",
      marginBottom: -1,
      color: active ? "var(--fg)" : "var(--muted)",
      fontSize: 13, fontWeight: active ? 500 : 450,
      cursor: "pointer",
      fontFamily: "inherit",
      display: "inline-flex", alignItems: "center", gap: 8,
      transition: "color 120ms ease",
    }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = "var(--fg-2)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = "var(--muted)"; }}
    >
      {label}
      <span className="num" style={{
        fontSize: 11, fontWeight: 600,
        color: count > 0 ? countColor : "var(--muted-3)",
        background: count > 0 ? "var(--hover-bg-soft)" : "transparent",
        padding: "1px 6px", borderRadius: 4,
        boxShadow: count > 0 ? "inset 0 0 0 1px var(--border)" : "none",
      }}>
        {count} {count === 1 ? "issue" : "issues"}
      </span>
    </button>
  );
}

function BCAccounting({ data, toDate, setToDate, includeHistory, setIncludeHistory }) {
  return (
    <>
      {/* Controls */}
      <div style={{
        marginBottom: 16,
        padding: "16px 18px",
        borderRadius: 12,
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}>
        <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 12 }}>
          {data.description}
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16, flexWrap: "wrap" }}>
          <div style={{ minWidth: 260 }}>
            <div style={{ fontSize: 11, color: "var(--muted-2)", marginBottom: 6, fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4 }}>To date</div>
            <button style={{
              display: "flex", alignItems: "center", gap: 10,
              width: "100%", height: 34, padding: "0 12px",
              background: "var(--surface-2)",
              border: "1px solid var(--border-strong)",
              borderRadius: 8,
              color: "var(--fg-2)",
              fontSize: 13,
              cursor: "pointer",
              fontFamily: "inherit",
            }}>
              <Icon name="invoice" size={13} color="var(--muted-2)" />
              <span className="num" style={{ flex: 1, textAlign: "left" }}>{toDate}</span>
              <Icon name="chevronD" size={12} color="var(--muted-2)" />
            </button>
          </div>
          <BCCheckbox checked={includeHistory} onChange={() => setIncludeHistory(v => !v)} label="Include history" />
        </div>
      </div>

      {/* Issues table */}
      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 140px 110px",
          alignItems: "center", gap: 16,
          padding: "12px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div>Message</div>
          <div>Date</div>
          <div style={{ textAlign: "right" }}>Action</div>
        </div>

        <div style={{
          padding: "10px 22px 8px",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
          background: "var(--hover-bg-soft)",
        }}>
          Issues
        </div>

        {data.issues.map((it, i) => (
          <BCIssueRow key={it.id} it={it} last={i === data.issues.length - 1} />
        ))}
      </Card>
    </>
  );
}

function BCDataRoom({ data }) {
  return (
    <Card padding={0}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 140px 110px",
        alignItems: "center", gap: 16,
        padding: "12px 22px", borderBottom: "1px solid var(--border)",
        fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
      }}>
        <div>Message</div>
        <div>Date</div>
        <div style={{ textAlign: "right" }}>Action</div>
      </div>

      {data.sections.map((sec) => (
        <React.Fragment key={sec.title}>
          <div style={{
            padding: "10px 22px 8px",
            fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
            background: "var(--hover-bg-soft)",
            borderTop: "1px solid var(--border)",
          }}>
            {sec.title} <span className="num" style={{ color: "var(--muted-3)", marginLeft: 4 }}>{sec.rows.length}</span>
          </div>
          {sec.rows.map((r) => (
            <BCIssueRow key={r.id} it={{ ...r, severity: "missing" }} />
          ))}
        </React.Fragment>
      ))}
    </Card>
  );
}

function BCIssueRow({ it, last }) {
  const [hover, setHover] = useStateBC(false);
  const severity = it.severity || "warn";
  const sevMap = {
    error: { icon: "close", color: "var(--neg)", bg: "rgba(248,113,113,0.10)" },
    warn: { icon: "flag", color: "var(--warn)", bg: "rgba(245,158,11,0.10)" },
    missing: { icon: "doc", color: "var(--muted)", bg: "var(--hover-bg-soft)" },
  };
  const s = sevMap[severity] || sevMap.warn;

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "grid", gridTemplateColumns: "1fr 140px 110px",
        alignItems: "center", gap: 16,
        padding: "14px 22px",
        borderBottom: last ? "none" : "1px solid var(--border)",
        background: hover ? "var(--hover-bg-soft)" : "transparent",
        transition: "background 100ms ease",
      }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, minWidth: 0 }}>
        <div style={{
          width: 24, height: 24, borderRadius: 6, flexShrink: 0,
          background: s.bg, color: s.color,
          display: "flex", alignItems: "center", justifyContent: "center",
          marginTop: 1,
        }}>
          <Icon name={s.icon} size={12} />
        </div>
        <div style={{ minWidth: 0, lineHeight: 1.5, fontSize: 13, color: "var(--fg-2)" }}>
          {severity === "error" && (
            <span style={{ color: "var(--neg)", fontWeight: 500, marginRight: 6 }}>Error:</span>
          )}
          {it.msg}
        </div>
      </div>
      <div className="num" style={{ fontSize: 12, color: "var(--muted)" }}>{it.date}</div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
        <button style={{
          height: 28, padding: "0 10px",
          background: hover ? "var(--surface-2)" : "transparent",
          border: "1px solid var(--border)",
          borderRadius: 6,
          color: "var(--muted)",
          fontSize: 12, fontWeight: 500,
          cursor: "pointer",
          fontFamily: "inherit",
          display: "inline-flex", alignItems: "center", gap: 5,
          transition: "all 120ms ease",
          opacity: hover ? 1 : 0.7,
        }}
          onMouseEnter={e => { e.currentTarget.style.color = "var(--fg)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
          onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
        >
          Resolve
          <Icon name="arrowR" size={11} />
        </button>
      </div>
    </div>
  );
}

function BCAlerts() {
  return (
    <Card>
      <div style={{
        padding: "48px 20px",
        textAlign: "center",
        color: "var(--muted)",
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, margin: "0 auto 14px",
          background: "var(--pos-tint)",
          color: "var(--pos)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name="check" size={22} />
        </div>
        <div style={{ fontSize: 15, fontWeight: 500, color: "var(--fg)", marginBottom: 4 }}>No active alerts</div>
        <div style={{ fontSize: 12.5, color: "var(--muted-2)" }}>BlueCheck will notify you here when something needs attention.</div>
      </div>
    </Card>
  );
}

function BCCheckbox({ checked, onChange, label }) {
  return (
    <button onClick={onChange} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      background: "transparent", border: "none",
      cursor: "pointer",
      fontFamily: "inherit",
      color: "var(--fg-2)",
      fontSize: 13,
      padding: "6px 0",
      height: 34,
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: 4,
        background: checked ? "var(--accent)" : "var(--surface-2)",
        border: checked ? "1px solid var(--accent)" : "1px solid var(--border-strong)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 120ms ease",
      }}>
        {checked && <Icon name="check" size={11} color="#fff" strokeWidth={2.5} />}
      </span>
      {label}
    </button>
  );
}

Object.assign(window, { BlueCheckPage });
