// Accounting page sub-tabs — distinct content per tab.
// Renders inside VCFOAccounting (vcfo.jsx). Light/dark theme via CSS vars.

const { useState: useStateAT } = React;

// ────────────────────────────────────────────────────────────────────────
// Shared primitives
// ────────────────────────────────────────────────────────────────────────
const AT_FUND = "Admin Ventures V";

const atFmt = (n, opts = {}) => {
  if (n == null) return "—";
  const min = opts.dec ?? 0;
  return "$" + Number(n).toLocaleString(undefined, { minimumFractionDigits: min, maximumFractionDigits: min });
};

const atSectionTitle = { fontSize: 14, fontWeight: 600, color: "var(--fg)", marginBottom: 12 };
const atOverviewLabel = { fontSize: 11.5, color: "var(--muted)", marginBottom: 6 };
const atOverviewValue = { fontSize: 22, fontWeight: 600, letterSpacing: -0.4, color: "var(--fg)" };

// Toolbar — Fund / Period / Search + Export Excel
function ATToolbar({ searchPlaceholder = "Search...", showPeriod = true, period = "Q4 2025", onExport }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-end", gap: 22,
      padding: "18px 22px",
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      marginBottom: 24,
    }}>
      <div>
        <div style={atLbl}>FUND NAME</div>
        <SoftSelect width={150} value={AT_FUND} options={FUNDS_LIST.map(f => f.name)} />
      </div>
      {showPeriod && (
        <div>
          <div style={atLbl}>PERIOD</div>
          <SoftSelect width={120} value={period} options={["Q4 2025", "Q3 2025", "Q2 2025", "Q1 2025"]} />
        </div>
      )}
      <div style={{ flex: 1 }}>
        <div style={atLbl}>SEARCH</div>
        <div style={{ position: "relative", maxWidth: 320 }}>
          <Icon name="search" size={11} color="var(--muted-2)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
          <input placeholder={searchPlaceholder}
            style={{ ...apiInputStyle, height: 36, paddingLeft: 32, fontSize: 12.5 }} />
        </div>
      </div>
      <button style={atOutlineBtn} onClick={onExport}>
        <Icon name="aiUpload" size={11} color="var(--muted)" /> Export Excel
      </button>
    </div>
  );
}

const atLbl = { fontSize: 10, color: "var(--muted-2)", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 6, fontWeight: 500 };
const atOutlineBtn = {
  display: "inline-flex", alignItems: "center", gap: 7,
  height: 36, padding: "0 14px",
  background: "var(--surface)", border: "1px solid var(--border-strong)",
  borderRadius: 8, color: "var(--fg-2)", fontSize: 12.5, fontWeight: 500,
  cursor: "pointer", fontFamily: "inherit",
};
const atFilledBtn = {
  ...atOutlineBtn,
  background: "var(--fg)", color: "var(--bg)", border: "1px solid var(--fg)",
};
const atPrimaryBtn = {
  ...atOutlineBtn,
  background: "var(--accent)", color: "#fff", border: "1px solid var(--accent)",
};
const atGhostIconBtn = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 32, height: 32,
  background: "var(--surface)", border: "1px solid var(--border)",
  borderRadius: 7, cursor: "pointer",
};

// ────────────── Action Items grid (4 columns) ──────────────
function ActionItemsRow({ groups }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={atSectionTitle}>Action Items</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
        {groups.map((g, i) => <ActionItemCard key={i} {...g} />)}
      </div>
    </div>
  );
}
function ActionItemCard({ tone, title, items }) {
  const tones = {
    up:    { dot: "#22C55E" },
    urgent:{ dot: "#F59E0B" },
    prio:  { dot: "#3B82F6" },
    open:  { dot: "#EF4444" },
  };
  const t = tones[tone] || tones.up;
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 10, padding: "14px 16px",
      minHeight: 132,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
        <span style={{ width: 7, height: 7, borderRadius: 99, background: t.dot, flexShrink: 0 }} />
        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)" }}>{title}</span>
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 5 }}>
        {items.map((it, i) => (
          <li key={i} style={{ fontSize: 12, color: "var(--muted)" }}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

// ────────────── KPI overview card ──────────────
function ATOverviewCard({ label, value, valueColor }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 10, padding: "16px 18px",
    }}>
      <div style={atOverviewLabel}>{label}</div>
      <div className="num" style={{ ...atOverviewValue, color: valueColor || atOverviewValue.color }}>{value}</div>
    </div>
  );
}
function ATOverviewGrid({ title, items, cols = 4 }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {title && <div style={atSectionTitle}>{title}</div>}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols},1fr)`, gap: 14 }}>
        {items.map((it, i) => <ATOverviewCard key={i} {...it} />)}
      </div>
    </div>
  );
}

// ────────────── Panel (white card with title row) ──────────────
function ATPanel({ title, subtitle, actions, children, padding = 18 }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 10,
      marginBottom: 24,
      overflow: "hidden",
    }}>
      {(title || actions) && (
        <div style={{
          display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          padding: "16px 22px 14px",
          borderBottom: subtitle ? "none" : "1px solid var(--border)",
          gap: 12,
        }}>
          <div>
            {title && <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>{title}</div>}
            {subtitle && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{subtitle}</div>}
          </div>
          <div style={{ display: "flex", gap: 8 }}>{actions}</div>
        </div>
      )}
      <div style={{ padding: typeof padding === "number" ? padding : 18 }}>{children}</div>
    </div>
  );
}

// Two-column inner panel (used inside larger panels)
function ATSubPanel({ title, actions, children }) {
  return (
    <div style={{
      background: "var(--surface-2, transparent)",
      border: "1px solid var(--border)",
      borderRadius: 9, padding: "14px 16px",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)" }}>{title}</div>
        {actions}
      </div>
      {children}
    </div>
  );
}

// KV row
function ATKV({ k, v, vColor, mono = true, last = false, prefix }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "9px 0",
      borderBottom: last ? "none" : "1px solid var(--border)",
      gap: 8,
    }}>
      <span style={{ fontSize: 12.5, color: "var(--fg-2)", display: "flex", alignItems: "center", gap: 6 }}>
        {prefix}{k}
      </span>
      <span className={mono ? "num" : ""} style={{ fontSize: 12.5, color: vColor || "var(--fg)", fontWeight: 500 }}>{v}</span>
    </div>
  );
}

// Striped table with blue-tinted rows (matches screenshots)
function ATTable({ columns, rows, indented = false, hasColumnsBtn = true, footer }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      overflow: "hidden",
    }}>
      {hasColumnsBtn && (
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, padding: "8px 10px", borderBottom: "1px solid var(--border)" }}>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 6, height: 26, padding: "0 10px",
            background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6,
            fontSize: 11.5, color: "var(--fg-2)", cursor: "pointer",
          }}>
            <Icon name="sort" size={10} color="var(--muted)" /> Columns
          </button>
          <button style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 28, height: 26, background: "var(--surface)",
            border: "1px solid var(--border)", borderRadius: 6, cursor: "pointer",
          }} title="Reset filters">
            <Icon name="filter" size={10} color="var(--accent)" />
          </button>
        </div>
      )}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: "var(--accent-tint-2, rgba(66,165,245,0.10))" }}>
              {columns.map((c, i) => (
                <th key={i} style={{
                  padding: "10px 14px",
                  textAlign: c.align || "left",
                  fontWeight: 600, fontSize: 11, color: "var(--fg-2)",
                  whiteSpace: "nowrap",
                  borderBottom: "1px solid var(--border)",
                }}>{c.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} style={{
                background: "var(--accent-tint-3, rgba(66,165,245,0.045))",
                borderTop: "1px solid var(--border)",
              }}>
                {r.map((cell, j) => (
                  <td key={j} className={columns[j]?.mono ? "num" : ""} style={{
                    padding: "10px 14px",
                    textAlign: columns[j]?.align || "left",
                    color: "var(--fg-2)",
                    fontWeight: cell?.bold ? 600 : 400,
                    paddingLeft: cell?.indent ? 28 : undefined,
                    whiteSpace: "nowrap",
                  }}>{cell?.bold ? <span style={{ color: "var(--fg)", fontWeight: 600 }}>{cell.v}</span>
                      : cell?.indent ? <span style={{ color: "var(--muted)" }}>· {cell.v}</span>
                      : (cell && typeof cell === "object" ? cell.v : cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {footer && (
        <div style={{
          padding: "8px 12px", borderTop: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: 11.5, color: "var(--muted)",
        }}>{footer}</div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 1. CAPITAL ACCOUNTS
// ════════════════════════════════════════════════════════════════════════
function ATCapitalAccounts() {
  const investors = [
    { code: "TC", name: "Thomas E. Calderon", type: "LIMITED PARTNER", commit: 356250, called: 296875, dist: 0, balance: 301973.08, own: 1.36 },
    { code: "RG", name: "Rivermark Advisory Group", type: "LIMITED PARTNER", commit: 8587500, called: 7156250, dist: 0, balance: 7880265.56, own: 32.79 },
    { code: "EW", name: "Elaine M. Whitford", type: "LIMITED PARTNER", commit: 7031625, called: 5859688, dist: 0, balance: 5960312.87, own: 26.85 },
    { code: "HT", name: "Hawthorne Ridge Trust", type: "LIMITED PARTNER", commit: 2662500, called: 2218750, dist: 0, balance: 2256851.44, own: 10.16 },
    { code: "AL", name: "Admin Ventures GP, LLC", type: "GENERAL PARTNER", commit: 375000, called: 312500, dist: 0, balance: 361616.40, own: 1.43 },
    { code: "CS", name: "Crestline Services", type: "LIMITED PARTNER", commit: 1687500, called: 1406250, dist: 0, balance: 1430398.81, own: 6.44 },
    { code: "RV", name: "Redwood Harbor Ventures", type: "LIMITED PARTNER", commit: 710535, called: 592113, dist: 0, balance: 602280.54, own: 2.71 },
    { code: "MK", name: "Margaret L. Keaton", type: "LIMITED PARTNER", commit: 375000, called: 312500, dist: 0, balance: 317866.40, own: 1.43 },
    { code: "IL", name: "Ironclad Management GP, LLC", type: "LIMITED PARTNER", commit: 3735566, called: 3112972, dist: 0, balance: 3166429.30, own: 14.26 },
    { code: "JE", name: "Jonathan P. Ellery", type: "LIMITED PARTNER", commit: 671610, called: 559675, dist: 0, balance: 569286.01, own: 2.56 },
  ];

  return (
    <>
      <ATToolbar searchPlaceholder="Search investors..." showPeriod={false} />

      <div style={atSectionTitle}>Quick Overview</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 26 }}>
        <ATOverviewCard label="Total Committed · Amount" value="$26,193,086" />
        <ATOverviewCard label="Total Called · Amount" value="$21,827,572" />
        <ATOverviewCard label="Distributions · Amount" value="$0" />
        <ATOverviewCard label="Active Investors · Count" value="10" />
      </div>

      <ATPanel
        title="Individual Capital Accounts"
        actions={<>
          <button style={atOutlineBtn}><Icon name="aiUpload" size={11} color="var(--muted)" /> Export</button>
          <button style={atOutlineBtn}><Icon name="filter" size={11} color="var(--muted)" /> Filter</button>
        </>}
        padding={0}
      >
        <ATTable
          columns={[
            { label: "Investor" },
            { label: "Commitment", align: "right", mono: true },
            { label: "Called Capital", align: "right", mono: true },
            { label: "Distributions", align: "right", mono: true },
            { label: "Current Balance", align: "right", mono: true },
            { label: "Ownership %", align: "right", mono: true },
            { label: "Actions", align: "center" },
          ]}
          rows={investors.map(inv => [
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={atChip}>{inv.code}</div>
              <div>
                <div style={{ color: "var(--fg)", fontWeight: 500 }}>{inv.name}</div>
                <div style={{ fontSize: 10, color: "var(--muted-2)", letterSpacing: 0.5 }}>{inv.type}</div>
              </div>
            </div>,
            atFmt(inv.commit),
            atFmt(inv.called),
            atFmt(inv.dist, { dec: 2 }),
            atFmt(inv.balance, { dec: 2 }),
            inv.own.toFixed(2) + "%",
            <button style={atDotsBtn}><Icon name="more" size={12} color="var(--muted)" /></button>,
          ])}
          footer={<>
            <span>Page <strong style={{ color: "var(--fg)" }}>1</strong> of 1</span>
            <span>1 – 10 of 10 · Rows 25</span>
          </>}
        />
      </ATPanel>
    </>
  );
}

const atChip = {
  width: 28, height: 28, borderRadius: 7,
  background: "var(--surface-2)", border: "1px solid var(--border)",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  fontSize: 10.5, fontWeight: 600, color: "var(--fg-2)", flexShrink: 0,
};
const atDotsBtn = {
  width: 24, height: 24, padding: 0, borderRadius: 6,
  background: "var(--surface)", border: "1px solid var(--border)",
  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
};

// ════════════════════════════════════════════════════════════════════════
// 2. CAPITAL CALLS
// ════════════════════════════════════════════════════════════════════════
function ATCapitalCalls() {
  return (
    <>
      <ATToolbar searchPlaceholder="Search capital calls..." />

      <ActionItemsRow groups={[
        { tone: "up", title: "Up to Date", items: [] },
        { tone: "urgent", title: "Urgent", items: [] },
        { tone: "prio", title: "Priority", items: [] },
        { tone: "open", title: "Open Issue", items: [] },
      ]} />

      <div style={atSectionTitle}>Capital Calls Overview – Admin Ventures V</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 26 }}>
        <ATOverviewCard label="Total Called to Date" value="$21,827,571.9" />
        <ATOverviewCard label="Total Fund Size" value="$26,193,086.3" />
        <ATOverviewCard label="Remaining Capital" value="$4,365,514.4" />
        <ATOverviewCard label="Total Calls" value="0" />
      </div>

      <ATPanel title="Fund Details — Admin Ventures V">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 22, rowGap: 18 }}>
          <FundDetail k="Partnership Name" v="Admin Ventures V" />
          <FundDetail k="GP Commitment" v="$375,000.0" mono />
          <FundDetail k="Total Primary Close Size" v="$26,193,086.3" mono />
          <FundDetail k="Date of Inception (Initial Close)" v="January 1, 2020" />
          <FundDetail k="LP Commitment" v="$25,818,086.3" mono />
          <FundDetail k="Primary Capital Called to Date" v="$21,827,571.9" mono />
          <FundDetail k="Date of End of Initial Fund Term" v="Not set" muted />
          <span />
          <span />
        </div>
      </ATPanel>

      <ATPanel
        title="Capital Letter Modeling"
        actions={<button style={atFilledBtn}><Icon name="plus" size={11} color="var(--bg)" /> Create New Letter</button>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, rowGap: 16 }}>
          <FormFieldAT label="Capital Call Name *">
            <input placeholder="Enter capital call name" style={apiInputStyle} />
          </FormFieldAT>
          <FormFieldAT label="Due Date">
            <button style={{ ...apiInputStyle, display: "flex", alignItems: "center", justifyContent: "space-between", color: "var(--muted)" }}>
              <span><Icon name="calendar" size={11} color="var(--muted-2)" />  Select a date</span>
              <Icon name="chevronD" size={11} color="var(--muted-2)" />
            </button>
          </FormFieldAT>
          <FormFieldAT label="Allocation Method *">
            <SoftSelect width="100%" value="Pro-rata" options={["Pro-rata", "Custom", "Fixed Amount"]} />
          </FormFieldAT>
          <FormFieldAT label="Total Capital *">
            <input placeholder="Enter total capital amount" style={apiInputStyle} />
          </FormFieldAT>
          <FormFieldAT label="Bank *">
            <SoftSelect width="100%" value="— Select —" options={["First Republic", "JPM", "Goldman Sachs"]} />
          </FormFieldAT>
          <FormFieldAT label="Select Partners *">
            <SoftSelect width="100%" value="— Select —" options={["All LPs", "GP only", "Custom selection"]} />
          </FormFieldAT>
          <FormFieldAT label="Notes" span={2}>
            <input placeholder="Enter any additional notes" style={apiInputStyle} />
          </FormFieldAT>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
          <button style={atOutlineBtn}>Preview Letter</button>
          <button style={atFilledBtn}>Save Draft</button>
        </div>
      </ATPanel>

      <ATPanel title="Capital Calls History" padding={0}>
        <ATTable
          columns={[
            { label: "Call #" },
            { label: "Call Date" },
            { label: "Due Date" },
            { label: "Amount", align: "right", mono: true },
            { label: "Purpose" },
            { label: "Status" },
            { label: "Actions", align: "center" },
          ]}
          rows={[]}
        />
        <div style={{ padding: "32px 0", textAlign: "center", color: "var(--muted-2)", fontSize: 12.5 }}>No data available</div>
      </ATPanel>
    </>
  );
}

function FundDetail({ k, v, mono, muted }) {
  return (
    <div>
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>{k}</div>
      <div className={mono ? "num" : ""} style={{ fontSize: 13, color: muted ? "var(--muted)" : "var(--fg)", fontWeight: 500 }}>{v}</div>
    </div>
  );
}

function FormFieldAT({ label, children, span }) {
  return (
    <div style={{ gridColumn: span ? `span ${span}` : undefined }}>
      <div style={{ fontSize: 11.5, color: "var(--accent)", marginBottom: 6, fontWeight: 500 }}>{label}</div>
      {children}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 3. COMPARATIVE ANALYSIS
// ════════════════════════════════════════════════════════════════════════
function ATComparativeAnalysis() {
  const rows = [
    ["7Labs AI",           1085361, 1085361, 1276896, 1276896, 191534, 0, 127690, 63845, 0, 0, 0],
    ["CloudB Capital",      159375,  159375,  187500,  187500,  28125, 0,  18750,  9375, 0, 0, 0],
    ["InfraLoop, Inc.",      15938,   15938,   18750,   18750,   2813, 0,   1875,   938, 0, 0, 0],
    ["MicroEdge Partners",  433500,  433500,  510000,  510000,  76500, 0,  51000, 25500, 0, 0, 0],
    ["NovaCore Systems",     15938,   15938,   18750,   18750,   2813, 0,   1875,   938, 0, 0, 0],
    ["OctaThink Solutions",1507505, 1507505, 1773535, 1773535, 266030, 0, 177353, 88677, 0, 0, 0],
    ["Quantum Inc.",       1479682, 1479682, 1740802, 1740802, 261120, 0, 174080, 87040, 0, 0, 0],
  ];
  const c = atFmt;
  return (
    <>
      <ATToolbar searchPlaceholder="Search analysis..." showPeriod={false} />

      <ActionItemsRow groups={[
        { tone: "up", title: "Up to Date", items: ["Q4 vs Q3 analysis complete", "YTD variance report ready"] },
        { tone: "urgent", title: "Urgent", items: ["Portfolio valuation updates needed", "Unrealized gain/loss review"] },
        { tone: "prio", title: "Priority", items: ["Follow-on investment tracking", "Capital call impact analysis"] },
        { tone: "open", title: "Open Issue", items: ["Valuation methodology changes", "Cost basis reconciliation"] },
      ]} />

      <div style={atSectionTitle}>Comparative Analysis Overview – Admin Ventures V</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
        <ATOverviewCard label="Current Portfolio Value" value="$5,526,232.22" />
        <ATOverviewCard label="Quarter Change" value="0.0%" />
        <ATOverviewCard label="Unrealized Gains" value="—" />
        <ATOverviewCard label="New Investments" value="$0.6M" />
      </div>

      <ATPanel title="Analysis Parameters">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18 }}>
          <FormFieldAT label="Comparison Type">
            <SoftSelect width="100%" value="Q3 2025 vs Q4 2025" options={["Q3 2025 vs Q4 2025", "Q4 2024 vs Q4 2025", "YTD"]} />
          </FormFieldAT>
          <FormFieldAT label="Base Period">
            <SoftSelect width="100%" value="Q3 2025" options={["Q3 2025", "Q2 2025", "Q1 2025"]} />
          </FormFieldAT>
          <FormFieldAT label="Current Period">
            <SoftSelect width="100%" value="Q4 2025" options={["Q4 2025", "Q3 2025"]} />
          </FormFieldAT>
        </div>
      </ATPanel>

      <ATPanel title="Portfolio Investment Comparative Analysis" padding={0}>
        <ATTable
          columns={[
            { label: "Portfolio Investment" },
            { label: "Previous Cost", align: "right", mono: true },
            { label: "Previous Value", align: "right", mono: true },
            { label: "Current Cost", align: "right", mono: true },
            { label: "Current Value", align: "right", mono: true },
            { label: "Cost Change", align: "right", mono: true },
            { label: "Value Change", align: "right", mono: true },
            { label: "New Investments", align: "right", mono: true },
            { label: "Follow-Ons/Cap Int", align: "right", mono: true },
            { label: "Realized Gain (Loss)", align: "right", mono: true },
            { label: "Unrealized Gain (Loss)", align: "right", mono: true },
            { label: "Net Gain (Loss)", align: "right", mono: true },
          ]}
          rows={rows.map(r => [
            { v: r[0], bold: true },
            c(r[1]), c(r[2]), c(r[3]), c(r[4]), c(r[5]), c(r[6]), c(r[7]), c(r[8]), c(r[9]), c(r[10]), c(r[11]),
          ])}
          footer={<>
            <span>Page <strong style={{ color: "var(--fg)" }}>1</strong> of 1</span>
            <span>1 – 7 of 7 · Rows 25</span>
          </>}
        />
      </ATPanel>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 4. DISTRIBUTIONS
// ════════════════════════════════════════════════════════════════════════
function ATDistributions() {
  return (
    <>
      <ATToolbar searchPlaceholder="Search distributions..." showPeriod={false} />

      <ActionItemsRow groups={[
        { tone: "up", title: "Up to Date", items: ["Distribution Letters", "Waterfall Calculations", "LP Notices Sent"] },
        { tone: "urgent", title: "Urgent", items: ["Pending Approvals", "Tax Withholdings"] },
        { tone: "prio", title: "Priority", items: ["Carry Calculations", "GP Catch-up Review"] },
        { tone: "open", title: "Open Issues", items: ["Distribution Timing", "LP Queries"] },
      ]} />

      <div style={atSectionTitle}>Distributions Overview – Admin Ventures V</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
        <ATOverviewCard label="Total Distributable" value="$8.4M" />
        <ATOverviewCard label="Distributed YTD" value="$6.2M" />
        <ATOverviewCard label="GP Carry" value="$1.8M" />
        <ATOverviewCard label="Distributions" value="12" />
      </div>

      <ATPanel title="Distribution Waterfall">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <ATSubPanel title="Waterfall Sequence">
            <ATKV k="1. Return of Capital" v="$12.5M" />
            <ATKV k="2. Preferred Return (8%)" v="$2.1M" />
            <ATKV k="3. GP Catch-up (20%)" v="$0.7M" />
            <ATKV k="4. Carried Interest (80/20)" v="$1.8M" last />
          </ATSubPanel>
          <ATSubPanel title="Distribution Amounts">
            <ATKV k="GP Amount Received" v="$2.5M" />
            <ATKV k="LP Amount Received" v="$13.9M" />
            <ATKV k="Venture Partner Catch-up" v="$0.3M" />
            <ATKV k="Total Distributed" v="$16.7M" vColor="var(--accent)" last />
          </ATSubPanel>
        </div>
      </ATPanel>

      <ATPanel title="Distributable Income Sources">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <ATSubPanel title="Realizations & Sales">
            <ATKV k="TechCorp Inc. Exit" v="$3.2M" />
            <ATKV k="HealthStart Sale" v="$2.8M" />
            <ATKV k="AI Solutions IPO" v="$1.95M" />
            <ATKV k="Other Realizations" v="$0.95M" />
            <ATKV k="Total Realizations & Sales" v="$8.9M" vColor="var(--accent)" last />
          </ATSubPanel>
          <ATSubPanel title="Other Income">
            <ATKV k="Dividend Income" v="$250K" />
            <ATKV k="Interest Income" v="$150K" />
            <ATKV k="Management Fees" v="$120K" />
            <ATKV k="Advisory Fees" v="$80K" />
            <ATKV k="Other Miscellaneous" v="$30K" />
            <ATKV k="Total Other Income" v="$630K" vColor="var(--accent)" last />
          </ATSubPanel>
        </div>
      </ATPanel>

      <ATPanel
        title="Distribution Letter Creator"
        actions={<button style={atFilledBtn}>Generate Letter</button>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <ATSubPanel title="Letter Details">
            <FormFieldAT label="Distribution Name">
              <input placeholder="Q4 2025 Distribution" style={apiInputStyle} />
            </FormFieldAT>
            <div style={{ marginTop: 12 }}>
              <FormFieldAT label="Distribution Date">
                <button style={{ ...apiInputStyle, textAlign: "left", color: "var(--muted)" }}>
                  <Icon name="calendar" size={11} color="var(--muted-2)" /> Select date
                </button>
              </FormFieldAT>
            </div>
            <div style={{ marginTop: 12 }}>
              <FormFieldAT label="Total Amount">
                <input placeholder="$0.00" style={apiInputStyle} />
              </FormFieldAT>
            </div>
          </ATSubPanel>
          <ATSubPanel title="Tax Information">
            <ATKV k="Taxable Income" v="$980,000" />
            <ATKV k="Return of Capital" v="$320,000" />
            <ATKV k="Long-term Capital Gain" v="$540,000" />
            <ATKV k="Withholdings (FATCA/State)" v="$48,000" last />
          </ATSubPanel>
        </div>
      </ATPanel>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 5. FINANCIALS
// ════════════════════════════════════════════════════════════════════════
function ATFinancials() {
  return (
    <>
      <ATToolbar searchPlaceholder="Search financials..." />

      <ActionItemsRow groups={[
        { tone: "up", title: "Up to Date", items: ["Balance Sheet Q4", "Income Statement", "Capital Changes"] },
        { tone: "urgent", title: "Urgent", items: ["Footnote Disclosures", "Audit Adjustments"] },
        { tone: "prio", title: "Priority", items: ["Fair Value Updates", "Subsequent Events"] },
        { tone: "open", title: "Open Issues", items: ["Valuation Queries", "Missing Documentation"] },
      ]} />

      <div style={atSectionTitle}>Financials Overview – Admin Ventures V</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
        <ATOverviewCard label="Total Assets" value="—" />
        <ATOverviewCard label="Net Assets" value="—" />
        <ATOverviewCard label="Net Income YTD" value="$3.4M" />
        <ATOverviewCard label="ROI" value="12.8%" />
      </div>

      <ATPanel title="Financial Statements" subtitle="Comprehensive financial statements and summaries for Admin Ventures V">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <ATSubPanel title={<span><Icon name="trendUp" size={12} color="var(--accent)" /> Balance Sheet Summary</span>}>
            <ATKV k="Assets" v="$45,250,000" vColor="var(--fg)" />
            <ATKV k="Cash & Cash Equivalents" v="$8,500,000" prefix={<span style={{ width: 12 }} />} />
            <ATKV k="Investments at Fair Value" v="$35,200,000" prefix={<span style={{ width: 12 }} />} />
            <ATKV k="Other Assets" v="$1,550,000" prefix={<span style={{ width: 12 }} />} />
            <div style={{ height: 8 }} />
            <ATKV k="Liabilities" v="$6,550,000" />
            <ATKV k="Accrued Expenses" v="$750,000" prefix={<span style={{ width: 12 }} />} />
            <ATKV k="Management Fee Payable" v="$1,200,000" prefix={<span style={{ width: 12 }} />} />
            <ATKV k="Due to General Partner" v="$4,600,000" prefix={<span style={{ width: 12 }} />} />
            <div style={{ height: 8 }} />
            <ATKV k={<strong style={{ fontWeight: 600 }}>Net Assets</strong>} v="$38,700,000" vColor="var(--accent)" last />
          </ATSubPanel>
          <ATSubPanel title={<span><Icon name="pie" size={12} color="var(--accent)" /> Income Statement Summary</span>}>
            <ATKV k="Investment Income" v="$4,850,000" />
            <ATKV k="Realized Gains" v="$2,100,000" prefix={<span style={{ width: 12 }} />} />
            <ATKV k="Unrealized Gains" v="$2,450,000" prefix={<span style={{ width: 12 }} />} />
            <ATKV k="Interest & Dividends" v="$300,000" prefix={<span style={{ width: 12 }} />} />
            <div style={{ height: 8 }} />
            <ATKV k="Expenses" v="($1,450,000)" vColor="#EF4444" />
            <ATKV k="Management Fees" v="($900,000)" prefix={<span style={{ width: 12 }} />} />
            <ATKV k="Professional Fees" v="($350,000)" prefix={<span style={{ width: 12 }} />} />
            <ATKV k="Other Operating Expenses" v="($200,000)" prefix={<span style={{ width: 12 }} />} />
            <div style={{ height: 8 }} />
            <ATKV k={<strong style={{ fontWeight: 600 }}>Net Income</strong>} v="$3,400,000" vColor="var(--accent)" last />
          </ATSubPanel>

          <ATSubPanel title={<span><Icon name="users" size={12} color="var(--accent)" /> Statement of Changes in Partners' Capital</span>}>
            <div style={{ fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Capital Changes</div>
            <ATKV k="Beginning Capital" v="$35,300,000" />
            <ATKV k="Capital Contributions" v="$5,200,000" />
            <ATKV k="Net Income" v="$3,400,000" />
            <ATKV k="Distributions" v="($5,200,000)" vColor="#EF4444" />
            <div style={{ height: 8 }} />
            <ATKV k={<strong style={{ fontWeight: 600 }}>Ending Capital</strong>} v="$38,700,000" vColor="var(--accent)" last />
          </ATSubPanel>
          <ATSubPanel title={<span><Icon name="info" size={12} color="#F59E0B" /> Footnotes & Disclosures</span>}>
            <div style={{ fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>Required Disclosures</div>
            <ul style={atBulletList}>
              <li>Fair value measurement methodologies</li>
              <li>Significant accounting policies</li>
              <li>Concentration of investments</li>
              <li>Commitments and contingencies</li>
            </ul>
            <div style={{ fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 14, marginBottom: 6 }}>Items to Consider</div>
            <ul style={atBulletList}>
              <li>Subsequent events review</li>
              <li>Related party transactions</li>
              <li>Risk factors disclosure</li>
              <li>Investment strategy changes</li>
            </ul>
          </ATSubPanel>
        </div>
      </ATPanel>
    </>
  );
}

const atBulletList = {
  margin: 0, padding: 0, listStyle: "none",
  display: "flex", flexDirection: "column", gap: 4,
  fontSize: 12.5, color: "var(--fg-2)",
};

// ════════════════════════════════════════════════════════════════════════
// 6. GL & TB
// ════════════════════════════════════════════════════════════════════════
function ATGLTB() {
  const trial = [
    ["1000", "Bank"],
    ["1100", "Investment"],
    ["1200", "Investment - Unrealized Gain/Loss"],
    ["1210", "Capital Call Receivable - GP"],
    ["1601", "Capital Call Receivable - LP"],
    ["2500", "Management Fee Payable"],
    ["3000", "Contributed Capital - LP"],
    ["3050", "Contributed Capital - GP"],
    ["5100", "Management Fees"],
    ["5229", "Audit Fees"],
    ["5301", "Tax Prep Fees"],
    ["5303", "Legal Fees"],
    ["5305", "Other Professional Fees"],
  ];
  return (
    <>
      <ATToolbar searchPlaceholder="Search GL/TB..." />

      <ActionItemsRow groups={[
        { tone: "up", title: "Up to Date", items: ["• Q4 Trial Balance", "• GL Reconciliation", "• Account Summaries"] },
        { tone: "urgent", title: "Urgent", items: ["• Adjusting Entries", "• Period Close"] },
        { tone: "prio", title: "Priority", items: ["• Account Analysis", "• Journal Entry Review"] },
        { tone: "open", title: "Open Issues", items: ["• Unbalanced Entries", "• Pending Approvals"] },
      ]} />

      <div style={atSectionTitle}>GL & TB Overview – Admin Ventures V</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
        <ATOverviewCard label="Total Assets" value="$23,019,494.06" />
        <ATOverviewCard label="Total Liabilities" value="$172,213.22" />
        <ATOverviewCard label="Net Equity" value="$0.00" />
        <ATOverviewCard label="GL Entries" value="0" />
      </div>

      <ATPanel title="Sorting & Filters">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 18 }}>
          <FormFieldAT label="Account Type">
            <SoftSelect width="100%" value="All Types" options={["All Types", "Asset", "Liability", "Equity", "Revenue", "Expense"]} />
          </FormFieldAT>
          <FormFieldAT label="Search Account">
            <input placeholder="Search by name, code, or description" style={apiInputStyle} />
          </FormFieldAT>
        </div>
      </ATPanel>

      <ATPanel
        title="General Ledger – Q4 2025"
        actions={<>
          <button style={atOutlineBtn}>Excel</button>
          <button style={atOutlineBtn}>CSV</button>
          <button style={atOutlineBtn}>PDF</button>
        </>}
      >
        <div style={{ padding: "40px 0", textAlign: "center", color: "var(--muted)", fontSize: 12.5 }}>
          No General Ledger data available for the selected period.
        </div>
      </ATPanel>

      <ATPanel
        title="Trial Balance – Q4 2025"
        actions={<>
          <button style={atOutlineBtn}>Excel</button>
          <button style={atOutlineBtn}>CSV</button>
          <button style={atOutlineBtn}>PDF</button>
        </>}
        padding={0}
      >
        <ATTable
          columns={[
            { label: "Account Code" },
            { label: "Account Name" },
            { label: "Debit", align: "right", mono: true },
            { label: "Credit", align: "right", mono: true },
          ]}
          rows={trial.map(r => [r[0], r[1], "", ""])}
        />
      </ATPanel>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 7. SCHEDULE OF INVESTMENT
// ════════════════════════════════════════════════════════════════════════
function ATScheduleOfInvestment() {
  const investments = [
    { co: "7Labs AI",            rows: [["Common Stock", "Jun 11, 2021", 1276895.56]] },
    { co: "CloudB Capital",      rows: [["Series C Preferred", "Nov 22, 2016", 187499.81]] },
    { co: "InfraLoop, Inc.",     rows: [["Series A-2 Preferred", "Mar 30, 2025", 18750]] },
    { co: "MicroEdge Partners",  rows: [
      ["Series Seed Preferred", "Feb 18, 2020", 416250],
      ["Common Stock - Private", "Mar 30, 2021", 0.01],
      ["Convertible Promissory Note", "Feb 22, 2021", 93750],
    ]},
    { co: "NovaCore Systems",    rows: [["Convertible Promissory Note", "Mar 30, 2025", 18750]] },
    { co: "OctaThink Solutions", rows: [
      ["Series B Preferred", "May 30, 2016", 1125000],
      ["Series C Preferred", "Oct 29, 2019", 648534.75],
      ["Series B-1 Warrants", "Oct 1, 2021", 0.01],
    ]},
    { co: "Quantum Inc.",        rows: [["Series A Preferred", "Mar 30, 2025", 1740802.09]] },
  ];

  const tblRows = [];
  investments.forEach(inv => {
    const total = inv.rows.reduce((s, r) => s + r[2], 0);
    tblRows.push([
      { v: inv.co, bold: true }, "",
      { v: atFmt(total, { dec: 2 }), bold: true },
      "", "60000000", "—", "—", "4", "4",
      { v: atFmt(total, { dec: 2 }), bold: true }, "—",
      <button style={atDotsBtn}><Icon name="more" size={12} color="var(--muted)" /></button>,
    ]);
    inv.rows.forEach(r => {
      tblRows.push([
        { v: r[0], indent: true }, r[1], atFmt(r[2], { dec: 2 }),
        "", "60000000", "—", "—", "4", "—", atFmt(r[2], { dec: 2 }), "—",
        <button style={atDotsBtn}><Icon name="more" size={12} color="var(--muted)" /></button>,
      ]);
    });
  });

  return (
    <>
      <ATToolbar searchPlaceholder="Search investments..." />

      <ActionItemsRow groups={[
        { tone: "up", title: "Up to Date", items: ["Investment Valuations", "Ownership Tracking", "Portfolio Updates"] },
        { tone: "urgent", title: "Urgent", items: ["Mark-to-Market Review", "Exit Analysis Pending"] },
        { tone: "prio", title: "Priority", items: ["Due Diligence Reports", "Investment Committee"] },
        { tone: "open", title: "Open Issues", items: ["Valuation Discrepancies", "Legal Documentation"] },
      ]} />

      <div style={atSectionTitle}>Schedule of Investments Overview – Admin Ventures V</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
        <ATOverviewCard label="Total Investments" value="7" />
        <ATOverviewCard label="Total Invested" value="$21,827,571.88" />
        <ATOverviewCard label="Current Value" value="$22,847,280.42" />
        <ATOverviewCard label="TVPI Multiple" value="1.05x" />
      </div>

      <ATPanel
        title="Schedule of Investments"
        subtitle="Track investment details, ownership, valuations, and waterfall analysis."
        actions={<button style={atOutlineBtn}><Icon name="report" size={11} color="var(--muted)" /> Build Pro-Forma / Waterfall</button>}
        padding={0}
      >
        <ATTable
          columns={[
            { label: "Company" },
            { label: "Investment Date" },
            { label: "Amount Invested", align: "right", mono: true },
            { label: "Last Round Date" },
            { label: "Last Round Pre-Money", align: "right", mono: true },
            { label: "Amount Raised", align: "right", mono: true },
            { label: "Last Round Post-Money", align: "right", mono: true },
            { label: "Initial Ownership", align: "right", mono: true },
            { label: "Current Ownership", align: "right", mono: true },
            { label: "Current Value", align: "right", mono: true },
            { label: "Competitors" },
            { label: "Actions", align: "center" },
          ]}
          rows={tblRows}
        />
      </ATPanel>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 8. CASH RECONCILIATION
// ════════════════════════════════════════════════════════════════════════
function ATCashReconciliation() {
  return (
    <>
      <ATToolbar searchPlaceholder="Search transactions..." />

      <ActionItemsRow groups={[
        { tone: "up", title: "Up to Date", items: ["Coming Soon"] },
        { tone: "urgent", title: "Urgent", items: ["Coming Soon"] },
        { tone: "prio", title: "Priority", items: ["Coming Soon"] },
        { tone: "open", title: "Open Issues", items: ["Coming Soon"] },
      ]} />

      <div style={atSectionTitle}>Cash Reconciliation Overview – Admin Ventures V</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
        <ATOverviewCard label="Total Cash Balance" value="Coming Soon" />
        <ATOverviewCard label="Reconciliation Rate" value="Coming Soon" />
        <ATOverviewCard label="Unmatched Items" value="Coming Soon" />
        <ATOverviewCard label="Active Accounts" value="Coming Soon" />
      </div>

      <ATPanel title="Current Reconciliation Status">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          {[
            { icon: "check", color: "#22C55E", title: "Completed Reconciliations" },
            { icon: "calendar", color: "#F59E0B", title: "In Progress" },
            { icon: "flag", color: "#EF4444", title: "Pending Review" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "14px 16px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 9,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                <Icon name={s.icon} size={12} color={s.color} />
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)" }}>{s.title}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted)" }}>
                <span>Coming Soon</span><span>Coming Soon</span>
              </div>
            </div>
          ))}
        </div>
      </ATPanel>

      <ATPanel
        title="Unmatched Reconciliation Items"
        subtitle="Items requiring manual review and matching"
        padding={0}
      >
        <ATTable
          columns={[
            { label: "Date" },
            { label: "Account" },
            { label: "Description" },
            { label: "Amount", align: "right", mono: true },
            { label: "Type" },
            { label: "Action", align: "center" },
          ]}
          rows={[
            ["", "Coming Soon", "Coming Soon", "Coming Soon", "Coming Soon",
              <button style={atDotsBtn}><Icon name="more" size={12} color="var(--muted)" /></button>],
          ]}
        />
      </ATPanel>

      <ATPanel title="Common Reconciliation Patterns">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <ATSubPanel title="Frequent Matches">
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--muted)" }}>
              <span>Coming Soon</span><span>Coming Soon</span>
            </div>
          </ATSubPanel>
          <ATSubPanel title="Fund Status Summary">
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--muted)" }}>
              <span>Coming Soon</span><span>Coming Soon</span>
            </div>
          </ATSubPanel>
        </div>
      </ATPanel>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 9. EXPENSES
// ════════════════════════════════════════════════════════════════════════
function ATExpenses() {
  return (
    <>
      <ATToolbar searchPlaceholder="Search expenses..." />

      <ActionItemsRow groups={[
        { tone: "up", title: "Up to Date", items: ["Q4 Expense Reports", "Management Fees", "Legal Expenses"] },
        { tone: "urgent", title: "Urgent", items: ["Missing Receipts", "Approval Required"] },
        { tone: "prio", title: "Priority", items: ["Expense Categorization", "Budget Variance Review"] },
        { tone: "open", title: "Open Issues", items: ["Unreconciled Items", "Disputed Charges"] },
      ]} />

      <div style={atSectionTitle}>Expenses Overview – Admin Ventures V</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
        <ATOverviewCard label="Total Expenses" value="$485K" />
        <ATOverviewCard label="Pending Approval" value="$125K" />
        <ATOverviewCard label="Upcoming" value="$75K" />
        <ATOverviewCard label="Reconciled" value="92%" />
      </div>

      <ATPanel
        title="Upload & AI Analysis"
        actions={<>
          <button style={atOutlineBtn}><Icon name="settings" size={11} color="var(--muted)" /> Settings</button>
          <button style={atFilledBtn}><Icon name="aiUpload" size={11} color="var(--bg)" /> Upload Files</button>
        </>}
      >
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.1fr 1.1fr", gap: 16 }}>
          {/* Upload zone */}
          <div>
            <div style={{
              border: "1px dashed var(--border-strong)",
              borderRadius: 10,
              minHeight: 220,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 10, color: "var(--muted-2)", fontSize: 12,
              padding: 18, textAlign: "center",
            }}>
              <Icon name="aiUpload" size={20} color="var(--muted-2)" />
              <div>Invoices, Receipts, Expense Reports, Bank Statements</div>
            </div>
            <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 10 }}>Recent uploads:</div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--fg-2)", marginTop: 4 }}>
              <span>invoice_2025_1847.pdf</span><Icon name="check" size={11} color="#22C55E" />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--fg-2)", marginTop: 4 }}>
              <span>expense_report_q4.xlsx</span>
              <span style={{ width: 11, height: 11, borderRadius: 99, border: "2px solid var(--accent)", borderTopColor: "transparent" }} />
            </div>
          </div>

          {/* AI Ingested Analysis */}
          <ATSubPanel
            title="AI Ingested Analysis"
            actions={<span style={{ fontSize: 11, padding: "3px 9px", borderRadius: 5, background: "var(--fg)", color: "var(--bg)", fontWeight: 500 }}>Processing Complete</span>}
          >
            <ReadOnlyField label="Fund Name" value="Venture Fund I" />
            <ReadOnlyField label="Invoice Sender" value="Wilson & Associates LLP" />
            <ReadOnlyField label="Amount" value="$15,250.00" />
            <ReadOnlyField label="Invoice Number" value="INV-2025-1847" />
            <ReadOnlyField label="GL Name & Code" value="Legal & Professional Fees - 6100" />
            <ReadOnlyField label="Additional Details" value={<>
              Q4 2025 Portfolio Company Due Diligence
              <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>Date: December 15, 2025 | Terms: Net 30</div>
            </>} />
            <ReadOnlyField label="Historical Consistency Check" value={<>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "#22C55E", fontWeight: 500, fontSize: 12 }}>
                <Icon name="check" size={11} color="#22C55E" /> Consistent with past invoices
              </span>
              <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>Average: $14,800 | Last 6 invoices: $13K-$17K range</div>
            </>} />
          </ATSubPanel>

          {/* Invoice Allocation Split */}
          <ATSubPanel
            title="Invoice Allocation Split"
            actions={<button style={{
              background: "transparent", border: "none", color: "var(--accent)",
              fontSize: 12, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "inherit",
            }}><Icon name="plus" size={10} /> Add Entity</button>}
          >
            <AllocEntity label="Entity 1" name="Venture Fund I GP" pct="" amt="$0.00" />
            <AllocEntity label="Entity 2" name="Management Company" pct="40" amt="6,100" />
            <AllocEntity label="Entity 3" name="Venture Fund I LP" pct="60" amt="9,150" />
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "10px 0", marginTop: 8,
              fontSize: 12,
            }}>
              <span style={{ color: "var(--fg-2)" }}>Total Allocation:</span>
              <span style={{ color: "#22C55E", fontWeight: 600 }}>100%  $15,250.00</span>
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
              <button style={{ ...atOutlineBtn, flex: 1, justifyContent: "center" }}>Save Draft</button>
              <button style={{ ...atFilledBtn, flex: 1, justifyContent: "center", background: "#0C2E4D", borderColor: "#0C2E4D", color: "#fff" }}>Apply Split</button>
            </div>
          </ATSubPanel>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
          <ATSubPanel title="Allocation Rules" actions={<button style={{
            background: "transparent", border: "none", color: "var(--accent)",
            fontSize: 11.5, cursor: "pointer", fontFamily: "inherit",
          }}><Icon name="settings" size={10} /> Edit Rules</button>}>
            <ATKV k="Management Fees:" v="100% Management Company" />
            <ATKV k="Legal Fees:" v="60% Fund / 40% Management" />
            <ATKV k="Audit Fees:" v="100% Fund" last />
          </ATSubPanel>
          <ATSubPanel title="Processing Status">
            <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
              <ProcStep done label="Document extracted" />
              <ProcStep done label="Invoice details parsed" />
              <ProcStep spin label="Allocation rules applied" />
              <ProcStep label="Pending approval" />
            </div>
          </ATSubPanel>
        </div>
      </ATPanel>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
        <ATPanel title="Reconciled Expenses" actions={<span style={{ fontSize: 11, color: "var(--muted)" }}>24 items</span>}>
          <ExpenseListItem name="Wilson & Associates LLP" amt="$15,250" />
          <ExpenseListItem name="KPMG LLP" amt="$48,200" />
          <ExpenseListItem name="Bloomberg Terminal" amt="$24,500" />
        </ATPanel>
        <ATPanel title="Outstanding Expenses" actions={<span style={{ fontSize: 11, color: "var(--muted)" }}>8 items</span>}>
          <ExpenseListItem name="Carta Inc." amt="$8,400" tone="#F59E0B" />
          <ExpenseListItem name="DocuSign" amt="$3,200" tone="#F59E0B" />
          <ExpenseListItem name="Iron Mountain" amt="$1,850" tone="#F59E0B" />
        </ATPanel>
        <ATPanel title="Upcoming Expenses" actions={<span style={{ fontSize: 11, color: "var(--muted)" }}>12 items</span>}>
          <ExpenseListItem name="Annual LP Meeting Venue" amt="$32,000" tone="#3B82F6" />
          <ExpenseListItem name="D&O Insurance Renewal" amt="$48,500" tone="#3B82F6" />
          <ExpenseListItem name="Q1 Tax Filings" amt="$22,000" tone="#3B82F6" />
        </ATPanel>
      </div>
    </>
  );
}

function ReadOnlyField({ label, value }) {
  return (
    <div style={{ padding: "8px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 7, marginBottom: 8 }}>
      <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.4 }}>{label}</div>
      <div style={{ fontSize: 12.5, color: "var(--fg)", marginTop: 2 }}>{value}</div>
    </div>
  );
}
function AllocEntity({ label, name, pct, amt }) {
  return (
    <div style={{ marginBottom: 10, padding: "10px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 7 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.4 }}>{label}</span>
        <Icon name="close" size={10} color="var(--muted-2)" />
      </div>
      <div style={{ fontSize: 12.5, color: "var(--fg)", marginBottom: 6 }}>{name}</div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input value={pct} readOnly style={{ ...apiInputStyle, height: 28, padding: "0 8px", fontSize: 11.5 }} placeholder="%" />
        </div>
        <input value={amt} readOnly style={{ ...apiInputStyle, height: 28, padding: "0 8px", fontSize: 11.5 }} />
      </div>
    </div>
  );
}
function ProcStep({ done, spin, label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: done ? "var(--fg-2)" : "var(--muted-2)" }}>
      {done ? <Icon name="check" size={11} color="#22C55E" />
        : spin ? <span style={{ width: 11, height: 11, borderRadius: 99, border: "2px solid var(--accent)", borderTopColor: "transparent" }} />
        : <span style={{ width: 9, height: 9, borderRadius: 99, border: "2px solid var(--border-strong)" }} />}
      {label}
    </div>
  );
}
function ExpenseListItem({ name, amt, tone }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "9px 0", borderBottom: "1px solid var(--border)", fontSize: 12.5,
    }}>
      <span style={{ color: "var(--fg-2)" }}>{name}</span>
      <span className="num" style={{ color: tone || "var(--fg)", fontWeight: 500 }}>{amt}</span>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 10. FOF
// ════════════════════════════════════════════════════════════════════════
function ATFOF() {
  const underlying = [
    ["Alpha Ventures IV", "Early Stage VC", 5000000, 3800000, 6200000, "18.5%", "1.6x", "Active"],
    ["Beta Growth II", "Growth Equity", 8000000, 7200000, 12800000, "22.1%", "1.8x", "Active"],
    ["Gamma Buyout III", "Mid-Market BO", 3500000, 3500000, 4100000, "8.2%", "1.2x", "Harvesting"],
    ["Delta Emerging I", "Emerging Markets", 2000000, 1100000, 900000, "-5.2%", "0.8x", "Active"],
  ];
  const accounting = [
    ["Alpha Ventures IV", "$2.8M", "$2.1M", "$700K", "$0", "$700K", "75%"],
    ["Beta Growth II", "$4.5M", "$3.2M", "$1.3M", "$0", "$1.3M", "71%"],
    ["Gamma Buyout III", "$1.2M", "$950K", "$250K", "$0", "$250K", "79%"],
  ];

  return (
    <>
      <ATToolbar searchPlaceholder="Search FOF..." />

      <ActionItemsRow groups={[
        { tone: "up", title: "Up to Date", items: ["Q4 FOF Valuations", "Fund Performance Reports", "Commitment Tracking"] },
        { tone: "urgent", title: "Urgent", items: ["Capital Call Notices", "NAV Reconciliation"] },
        { tone: "prio", title: "Priority", items: ["Due Diligence Updates", "Portfolio Monitoring"] },
        { tone: "open", title: "Open Issues", items: ["Valuation Adjustments", "Pending Distributions"] },
      ]} />

      <div style={atSectionTitle}>FOF Overview – Admin Ventures V</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
        <ATOverviewCard label="Total NAV" value="$85.2M" />
        <ATOverviewCard label="Underlying Funds" value="24" />
        <ATOverviewCard label="Net IRR" value="12.4%" />
        <ATOverviewCard label="TVPI Multiple" value="1.8x" />
      </div>

      <ATPanel title="Fund of Funds Management" subtitle="Manage fund of funds investments, underlying fund performance, and portfolio allocation strategies.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
          <ATSubPanel title="Portfolio Allocation">
            <ATKV k="Venture Capital" v="45%" />
            <ATKV k="Growth Equity" v="35%" />
            <ATKV k="Buyout" v="15%" />
            <ATKV k="Special Situations" v="5%" last />
          </ATSubPanel>
          <ATSubPanel title="Geographic Distribution">
            <ATKV k="North America" v="60%" />
            <ATKV k="Europe" v="25%" />
            <ATKV k="Asia-Pacific" v="12%" />
            <ATKV k="Other" v="3%" last />
          </ATSubPanel>
          <ATSubPanel title="Vintage Year Analysis">
            <ATKV k="2023-2025" v="40%" />
            <ATKV k="2020-2022" v="35%" />
            <ATKV k="2017-2019" v="20%" />
            <ATKV k="Pre-2017" v="5%" last />
          </ATSubPanel>
        </div>
      </ATPanel>

      <ATPanel title="Underlying Fund Performance" padding={0}>
        <ATTable
          columns={[
            { label: "Fund Name" },
            { label: "Strategy" },
            { label: "Commitment", align: "right", mono: true },
            { label: "Funded", align: "right", mono: true },
            { label: "NAV", align: "right", mono: true },
            { label: "IRR", align: "right", mono: true },
            { label: "Multiple", align: "right", mono: true },
            { label: "Status" },
          ]}
          rows={underlying.map(r => [
            { v: r[0], bold: true }, r[1], atFmt(r[2]), atFmt(r[3]), atFmt(r[4]), r[5], r[6],
            <span style={{
              fontSize: 11, padding: "2px 8px", borderRadius: 5,
              background: r[7] === "Active" ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)",
              color: r[7] === "Active" ? "#22C55E" : "#F59E0B",
            }}>{r[7]}</span>,
          ])}
          footer={<>
            <span>Page <strong style={{ color: "var(--fg)" }}>1</strong> of 1</span>
            <span>1 – 4 of 4 · Rows 25</span>
          </>}
        />
      </ATPanel>

      <ATPanel title="Fund of Funds Accounting" subtitle="Return of capital vs. realized gain (loss) analysis" padding={0}>
        <ATTable
          columns={[
            { label: "Fund Name" },
            { label: "Total Distributions", align: "right", mono: true },
            { label: "Return of Capital", align: "right", mono: true },
            { label: "Realized Gain", align: "right", mono: true },
            { label: "Realized Loss", align: "right", mono: true },
            { label: "Net Realized", align: "right", mono: true },
            { label: "% ROC", align: "right", mono: true },
          ]}
          rows={accounting.map(r => [{ v: r[0], bold: true }, r[1], r[2], r[3], r[4], r[5], r[6]])}
        />
      </ATPanel>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════════
// 11. ALLOCATIONS
// ════════════════════════════════════════════════════════════════════════
function ATAllocations() {
  return (
    <>
      <ATToolbar searchPlaceholder="Search allocations..." />

      <ActionItemsRow groups={[
        { tone: "up", title: "Up to Date", items: ["Deal-by-Deal Tracking", "Carry Escrow", "True-up Calculations"] },
        { tone: "urgent", title: "Urgent", items: ["Interim Clawback", "Deal Grouping Review"] },
        { tone: "prio", title: "Priority", items: ["Loss Allocation", "Deal-Level Returns"] },
        { tone: "open", title: "Open Issues", items: ["Escrow Reconciliation", "Deal Classification"] },
      ]} />

      <div style={atSectionTitle}>Quick Overview</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 26 }}>
        <ATOverviewCard label="Fund Size" value="$50M" />
        <ATOverviewCard label="GP Carry" value="20%" />
        <ATOverviewCard label="Preferred Return" value="8%" />
        <ATOverviewCard label="Carry Escrow" value="15%" />
      </div>

      <ATPanel
        title="European Waterfall Model & Allocations"
        subtitle="Configure fund structure, fees, and distribution waterfall for GP and LP allocations."
        actions={<>
          <button style={atFilledBtn}><Icon name="report" size={11} color="var(--bg)" /> Calculate Waterfall</button>
          <button style={atOutlineBtn}><Icon name="aiUpload" size={11} color="var(--muted)" /> Export Model</button>
        </>}
      >
        <ATSubPanel title="Document Ingestion & Automation">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11.5, color: "var(--accent)", marginBottom: 8, fontWeight: 500 }}>Limited Partnership Agreement</div>
              <div style={{
                border: "1px dashed var(--border-strong)",
                borderRadius: 8, padding: "26px 16px", textAlign: "center",
                color: "var(--muted-2)", fontSize: 12,
              }}>
                <Icon name="aiUpload" size={16} color="var(--muted-2)" style={{ marginBottom: 6 }} />
                <div>Supports PDF, DOCX formats up to 50MB</div>
              </div>
              <DocChip name="Venture Fund I LPA.pdf" status="Processed" tone="green" />
            </div>
            <div>
              <div style={{ fontSize: 11.5, color: "var(--accent)", marginBottom: 8, fontWeight: 500 }}>Side Letters</div>
              <div style={{
                border: "1px dashed var(--border-strong)",
                borderRadius: 8, padding: "26px 16px", textAlign: "center",
                color: "var(--muted-2)", fontSize: 12,
              }}>
                <Icon name="aiUpload" size={16} color="var(--muted-2)" style={{ marginBottom: 6 }} />
                <div>Multiple files supported</div>
              </div>
              <DocChip name="LP A Side Letter.pdf" status="Processing" tone="amber" />
              <DocChip name="LP B Side Letter.pdf" status="Processed" tone="green" />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 18, padding: "10px 0", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: "#22C55E" }} />
              AI Processing Status: <strong style={{ color: "var(--fg)", fontWeight: 500 }}>Active</strong>
              <span style={{ marginLeft: 6 }}>Last processed: <strong style={{ color: "var(--fg-2)", fontWeight: 500 }}>15 minutes ago</strong></span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={atFilledBtn}><Icon name="docStudio" size={11} color="var(--bg)" /> Auto-Extract Terms</button>
              <button style={atOutlineBtn}><Icon name="eye" size={11} color="var(--muted)" /> Review Extractions</button>
            </div>
          </div>

          <div style={{ marginTop: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", marginBottom: 10 }}>Extracted Key Terms</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, fontSize: 12, color: "var(--fg-2)" }}>
              <KeyTerm k="Waterfall Type:" v="American (Deal-by-Deal)" />
              <KeyTerm k="Carry Escrow:" v="15% of distributions" />
              <KeyTerm k="Deal Grouping:" v="Allowed by vintage" />
              <KeyTerm k="True-up Frequency:" v="Annual" />
              <KeyTerm k="Loss Netting:" v="Yes, against future deals" />
              <KeyTerm k="Interim Clawback:" v="Yes, annual testing" />
            </div>
          </div>
        </ATSubPanel>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 18 }}>
          <ATSubPanel title="Fund Structure">
            <FormFieldAT label="Fund Name">
              <input value="Venture Fund I" readOnly style={apiInputStyle} />
            </FormFieldAT>
            <div style={{ marginTop: 10 }}>
              <FormFieldAT label="Fund Size (Committed Capital)">
                <input value="$50,000,000" readOnly style={apiInputStyle} />
              </FormFieldAT>
            </div>
            <div style={{ marginTop: 10 }}>
              <FormFieldAT label="Vintage Year">
                <SoftSelect width="100%" value="2023" options={["2023", "2024", "2025"]} />
              </FormFieldAT>
            </div>
          </ATSubPanel>

          <ATSubPanel title="Hurdle & Carry">
            <FormFieldAT label="Preferred Return Type">
              <SoftSelect width="100%" value="IRR" options={["IRR", "Cumulative", "Non-Cumulative"]} />
            </FormFieldAT>
            <div style={{ marginTop: 10 }}>
              <FormFieldAT label="Preferred Return Rate (%)">
                <input value="8" readOnly style={apiInputStyle} />
              </FormFieldAT>
            </div>
            <div style={{ marginTop: 10 }}>
              <FormFieldAT label="Carry Rate (%)">
                <input value="20" readOnly style={apiInputStyle} />
              </FormFieldAT>
            </div>
          </ATSubPanel>

          <ATSubPanel title="Clawback Settings">
            <FormFieldAT label="Clawback Type">
              <SoftSelect width="100%" value="Fund-Level" options={["Fund-Level", "Deal-Level", "Hybrid"]} />
            </FormFieldAT>
            <div style={{ marginTop: 10 }}>
              <FormFieldAT label="Escrow Percentage (%)">
                <input value="20" readOnly style={apiInputStyle} />
              </FormFieldAT>
            </div>
            <div style={{ marginTop: 10 }}>
              <FormFieldAT label="Test Frequency">
                <SoftSelect width="100%" value="End of Fund Term" options={["End of Fund Term", "Annual", "Per Exit"]} />
              </FormFieldAT>
            </div>
          </ATSubPanel>
        </div>
      </ATPanel>
    </>
  );
}

function DocChip({ name, status, tone }) {
  const tones = {
    green: { bg: "rgba(34,197,94,0.12)", color: "#22C55E" },
    amber: { bg: "rgba(245,158,11,0.12)", color: "#F59E0B" },
  };
  const t = tones[tone] || tones.green;
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "8px 12px", marginTop: 8,
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 7,
      fontSize: 12,
    }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "var(--fg-2)" }}>
        <Icon name="file" size={11} color="var(--muted)" /> {name}
      </span>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 5, background: t.bg, color: t.color }}>{status}</span>
        <Icon name="close" size={10} color="var(--muted-2)" style={{ cursor: "pointer" }} />
      </span>
    </div>
  );
}
function KeyTerm({ k, v }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2, padding: "6px 0" }}>
      <span style={{ fontSize: 11, color: "var(--muted)" }}>{k}</span>
      <span style={{ fontSize: 12.5, color: "var(--fg)", fontWeight: 500 }}>{v}</span>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────
// Public registry — consumed by VCFOAccounting
// ────────────────────────────────────────────────────────────────────────
window.AccountingTabs = {
  ca:   ATCapitalAccounts,
  cc:   ATCapitalCalls,
  comp: ATComparativeAnalysis,
  dist: ATDistributions,
  fin:  ATFinancials,
  gltb: ATGLTB,
  schi: ATScheduleOfInvestment,
  cash: ATCashReconciliation,
  exp:  ATExpenses,
  fof:  ATFOF,
  alloc: ATAllocations,
};
