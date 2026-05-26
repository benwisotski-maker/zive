// Zive — Portfolio & Investors sub-pages
// All designs are original — Zive visual system, not literal recreations.
const { useState: useStateSP, useMemo: useMemoSP } = React;

// ════════════════════════════════════════════════════════════════
// Shared bits used by sub-pages
// ════════════════════════════════════════════════════════════════

// "MetricStrip" — the three highlighted KPI tiles seen at top of every Portfolio page
function MetricStrip({ items }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 12, marginBottom: 14 }}>
      {items.map((m, i) => (
        <div key={i} style={{
          padding: "16px 18px",
          borderRadius: 14,
          background: "var(--surface)",
          boxShadow: "inset 0 0 0 1px var(--border)",
          display: "flex", alignItems: "center", gap: 14,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10,
            background: m.tint || "var(--accent-tint)",
            color: m.color || "var(--accent)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "inset 0 0 0 1px " + (m.ring || "var(--accent-ring-18)"),
            flexShrink: 0,
          }}>
            <Icon name={m.icon} size={18} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
              <span style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{m.label}</span>
              {m.tag && <Pill tone={m.tagTone || "outline"}>{m.tag}</Pill>}
            </div>
            <div className="num" style={{ fontSize: 19, fontWeight: 500, letterSpacing: -0.3, color: m.valueColor || "var(--fg)" }}>
              {m.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// "GeneralMetrics" — secondary band of smaller chips with mini KPIs
function GeneralMetrics({ items }) {
  return (
    <div style={{
      padding: "10px 12px",
      borderRadius: 12,
      background: "var(--surface)",
      boxShadow: "inset 0 0 0 1px var(--border)",
      marginBottom: 22,
    }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "4px 6px 8px",
        borderBottom: "1px solid var(--border)",
        marginBottom: 8,
      }}>
        <Icon name="info" size={12} color="var(--muted-2)" />
        <span style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500, letterSpacing: 0.2 }}>General metrics</span>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${items.length}, 1fr)`, gap: 8 }}>
        {items.map((m, i) => (
          <div key={i} style={{ padding: "8px 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: "var(--muted-2)" }}>{m.label}</span>
              {m.tag && <Pill tone={m.tagTone || "outline"}>{m.tag}</Pill>}
            </div>
            <div className="num" style={{ fontSize: 13.5, fontWeight: 500, color: m.color || "var(--fg)" }}>{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Reusable empty state inside a card
function EmptyTable({ msg = "No data available" }) {
  return (
    <div style={{ padding: "60px 20px", textAlign: "center", fontSize: 12.5, color: "var(--muted-2)" }}>
      {msg}
    </div>
  );
}

// Tab strip used inside cards (Summary / QuickBooks / Manual etc)
function TabStrip({ tabs, value, onChange, underline = true, size = "md" }) {
  return (
    <div style={{
      display: "flex", gap: size === "sm" ? 18 : 22,
      borderBottom: underline ? "1px solid var(--border)" : "none",
      padding: "0 2px",
    }}>
      {tabs.map(t => {
        const active = value === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            background: "transparent", border: "none",
            padding: size === "sm" ? "8px 0 9px" : "10px 0 12px",
            color: active ? "var(--fg)" : "var(--muted)",
            fontSize: size === "sm" ? 12.5 : 13,
            fontWeight: active ? 500 : 400,
            fontFamily: "inherit",
            cursor: "pointer",
            position: "relative",
            transition: "color 120ms ease",
          }}>
            {t.label}
            {active && (
              <span style={{
                position: "absolute", left: 0, right: 0, bottom: -1,
                height: 2, background: "var(--fg)", borderRadius: 1,
              }} />
            )}
          </button>
        );
      })}
    </div>
  );
}

// Date pill
function DatePill({ value = "04/29/2026" }) {
  return (
    <button style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      height: 30, padding: "0 12px",
      borderRadius: 8, background: "var(--surface)",
      border: "1px solid var(--border)",
      fontSize: 12, color: "var(--fg-2)", fontFamily: "inherit",
      cursor: "pointer",
    }}>
      <Icon name="calendar" size={12} color="var(--muted-2)" />
      <span className="num">{value}</span>
      <Icon name="chevronD" size={11} color="var(--muted-2)" />
    </button>
  );
}

// Standard portfolio header (title + 3 main KPI tiles + general metrics)
function PortfolioHeader({ title, subTabs, page, setPage }) {
  const main = [
    { icon: "pie",       label: "Investments", tag: "Active",     value: "11" },
    { icon: "accounting", label: "Cost",       value: "$9,210,387.00" },
    { icon: "transfer",  label: "Value",       value: "$13,763,681.04",
      tint: "var(--pos-tint)", color: "var(--pos)", ring: "rgba(34,197,94,0.22)" },
  ];
  const general = [
    { label: "Gain/Loss", tag: "Unrealized", tagTone: "outline", value: "$4,553,294.04", color: "var(--pos)" },
    { label: "Companies", tag: "Active", tagTone: "outline", value: "7" },
    { label: "Companies", tag: "Total", tagTone: "outline", value: "7" },
    { label: "Total invested", value: "$9,210,387.00" },
    { label: "Lifetime value", value: "$9,210,387.00" },
    { label: "Investments", tag: "Inactive", tagTone: "outline", value: "5" },
  ];
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button title="Pages" onClick={() => {}} style={{
            width: 30, height: 30, borderRadius: 7, border: "none", background: "transparent",
            display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--muted)",
          }}><Icon name="menu" size={15} /></button>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 500, letterSpacing: -0.5 }}>{title}</h1>
        </div>
        {subTabs && <PageMenu items={subTabs} value={page} onChange={setPage} />}
      </div>
      <MetricStrip items={main} />
      <GeneralMetrics items={general} />
    </>
  );
}

// Investor header (different KPIs for investor pages)
function InvestorHeader({ title, subTabs, page, setPage, kind = "default" }) {
  // For "commitment history" the screenshots show a different stat row
  let main;
  if (kind === "commitments") {
    main = [
      { icon: "accounting", label: "Total Commitment", tag: "History", value: "$43,655,144.00" },
      { icon: "checklist",  label: "Total Committed Recorded", value: "$0.00" },
      { icon: "trendUp",    label: "Increase", value: "$0.00",
        tint: "var(--pos-tint)", color: "var(--pos)", ring: "rgba(34,197,94,0.22)" },
      { icon: "trendDown",  label: "Decrease", value: "$0.00",
        tint: "var(--neg-tint)", color: "var(--neg)", ring: "rgba(239,68,68,0.22)" },
      { icon: "investor",   label: "Num. LPs", value: "10" },
    ];
  }
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button title="Pages" style={{
            width: 30, height: 30, borderRadius: 7, border: "none", background: "transparent",
            display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--muted)",
          }}><Icon name="menu" size={15} /></button>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 500, letterSpacing: -0.5 }}>{title}</h1>
        </div>
        {subTabs && <PageMenu items={subTabs} value={page} onChange={setPage} />}
      </div>
      {main && <MetricStrip items={main} />}
    </>
  );
}

// ════════════════════════════════════════════════════════════════
// Portfolio sub-pages
// ════════════════════════════════════════════════════════════════

const SOI_GROUPS = [
  { co: "CircuitWorks Inc.", cost: 31250, value: 31250, orb: 0,
    rounds: [{ name: "Series A-2 Preferred", date: "03/30/2025", shares: 12500, cost: 31250, value: 31250, costPps: "$2.50", curPps: "$2.50" }] },
  { co: "Hexagon Systems", cost: 2955891, value: 2955891, orb: 1,
    rounds: [
      { name: "Series B Preferred", date: "11/14/2024", shares: 1250000, cost: 1875000, value: 1875000, costPps: "$1.50", curPps: "$1.50" },
      { name: "Series A Preferred", date: "06/02/2023", shares: 980000, cost: 1080891, value: 1080891, costPps: "$1.10", curPps: "$1.10" },
    ] },
  { co: "Horizon Capital", cost: 850000, value: 850000, orb: 2,
    rounds: [{ name: "Safe (Post-Money)", date: "08/22/2024", shares: 0, cost: 850000, value: 850000, costPps: "—", curPps: "—" }] },
  { co: "Nova AI", cost: 2128159, value: 2128159, orb: 3,
    rounds: [{ name: "Series Seed", date: "04/11/2024", shares: 760000, cost: 2128159, value: 2128159, costPps: "$2.80", curPps: "$2.80" }] },
];

function SchedulePage({ initialView, initialScope } = {}) {
  const [view, setView] = useStateSP(initialView || "grid");
  const [scope, setScope] = useStateSP(initialScope || "direct");
  const [includeSafe, setIncludeSafe] = useStateSP(true);

  const total = { cost: SOI_GROUPS.reduce((s, x) => s + x.cost, 0), value: SOI_GROUPS.reduce((s, x) => s + x.value, 0) };

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontSize: 12.5, color: "var(--fg-2)" }}>Include SAFE Markups</span>
          <Toggle on={includeSafe} onClick={() => setIncludeSafe(v => !v)} />
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <SegSwitch options={[{ id: "direct", label: "Direct" }, { id: "fund", label: "Fund" }]} value={scope} onChange={setScope} />
          <SegSwitch options={[{ id: "grid", label: "Grid" }, { id: "list", label: "List" }]} value={view} onChange={setView} />
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--muted)" }}>
          <Icon name="folder" size={12} />
          <span>{scope === "direct" ? "Direct Investments" : "Fund Investments"}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <DatePill />
          <Button variant="solid" size="sm" icon="download">Export</Button>
        </div>
      </div>

      {view === "grid" ? <SoiGrid groups={SOI_GROUPS} /> : <SoiList groups={SOI_GROUPS} total={total} />}
    </>
  );
}

// Color blocks for grid view — solid brand-aligned colors keyed off the same orb palette.
const SOI_TILE_COLORS = [
  ["#8E7CFF", "#5B4ED1"], // iris
  ["#6AE1FF", "#2C8FB3"], // cyan
  ["#FF9D6A", "#C76435"], // orange
  ["#8BDE9A", "#3E8B57"], // green
  ["#FF7DB8", "#B0467E"], // pink
  ["#FFD56A", "#B58A2A"], // amber
  ["#A89BFF", "#6E5FCF"], // violet
  ["#7BE0D3", "#37968D"], // teal
];

function SoiTile({ seed = 0 }) {
  const [a, b] = SOI_TILE_COLORS[seed % SOI_TILE_COLORS.length];
  return (
    <div style={{
      height: 180, width: "100%",
      background: `linear-gradient(135deg, ${a} 0%, ${b} 100%)`,
      borderTopLeftRadius: 14, borderTopRightRadius: 14,
      position: "relative", overflow: "hidden",
    }}>
      {/* subtle decorative band */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(circle at 75% 25%, rgba(255,255,255,0.18), transparent 55%)`,
      }} />
    </div>
  );
}

function SoiGrid({ groups }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {groups.map(g => {
        const totalShares = g.rounds.reduce((s, r) => s + (r.shares || 0), 0);
        return (
          <Card key={g.co} padding={0} style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <SoiTile seed={g.orb} />
            <div style={{ padding: "16px 18px 6px" }}>
              <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>{g.co}</div>
              <Pill tone="outline">Investments&nbsp;&nbsp;<span style={{ color: "var(--muted)", fontWeight: 500 }}>{g.rounds.length}</span></Pill>
            </div>
            <div style={{
              margin: "12px 0 0", padding: "12px 18px 16px",
              background: "var(--surface)", display: "grid", rowGap: 6,
            }}>
              <SoiKv k="Shares" v={totalShares ? totalShares.toLocaleString() : "—"} />
              <SoiKv k="Cost" v={`$${fmtMoney(g.cost)}.00`} />
              <SoiKv k="Value" v={`$${fmtMoney(g.value)}.00`} />
              <SoiKv k="Gain/Loss" v="—" muted />
            </div>
          </Card>
        );
      })}
    </div>
  );
}

function SoiKv({ k, v, muted }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5 }}>
      <span style={{ color: "var(--muted)" }}>{k}</span>
      <span className="num" style={{ color: muted ? "var(--muted-3)" : "var(--fg-2)", fontWeight: 500 }}>{v}</span>
    </div>
  );
}

function SoiList({ groups, total }) {
  return (
    <>
      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.6fr 110px 110px 130px 130px 110px 110px 110px",
          gap: 12, padding: "10px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div>Investment</div>
          <div>Date</div>
          <div style={{ textAlign: "right" }}>Shares</div>
          <div style={{ textAlign: "right" }}>Cost</div>
          <div style={{ textAlign: "right" }}>Value</div>
          <div style={{ textAlign: "right" }}>Gain/Loss</div>
          <div style={{ textAlign: "right" }}>Cost (PPS)</div>
          <div style={{ textAlign: "right" }}>Current (PPS)</div>
        </div>

        {SOI_GROUPS.map((g, gi) => (
          <div key={g.co}>
            {/* Company group row */}
            <div style={{
              display: "grid", gridTemplateColumns: "1.6fr 110px 110px 130px 130px 110px 110px 110px",
              gap: 12, alignItems: "center", padding: "14px 22px",
              background: "var(--surface)",
              borderBottom: "1px solid var(--border)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Icon name="chevronD" size={11} color="var(--muted-2)" />
                <Orb seed={g.orb} size={22} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{g.co}</span>
              </div>
              <div />
              <div />
              <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 500, color: "var(--accent)" }}>${fmtMoney(g.cost)}.00</div>
              <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 500, color: "var(--accent)" }}>${fmtMoney(g.value)}.00</div>
              <div />
              <div />
              <div />
            </div>
            {/* Round rows */}
            {g.rounds.map((r, ri) => (
              <div key={r.name} className="row-hover" style={{
                display: "grid", gridTemplateColumns: "1.6fr 110px 110px 130px 130px 110px 110px 110px",
                gap: 12, alignItems: "center", padding: "12px 22px",
                borderBottom: gi === SOI_GROUPS.length - 1 && ri === g.rounds.length - 1 ? "none" : "1px solid var(--border)",
              }}>
                <div style={{ paddingLeft: 38, fontSize: 12.5, color: "var(--fg-2)" }}>{r.name}</div>
                <div className="num" style={{ fontSize: 12, color: "var(--muted)" }}>{r.date}</div>
                <div className="num" style={{ fontSize: 12, color: "var(--muted)", textAlign: "right" }}>{r.shares ? r.shares.toLocaleString() : "—"}</div>
                <div className="num" style={{ fontSize: 12.5, textAlign: "right", color: "var(--accent)" }}>${fmtMoney(r.cost)}.00</div>
                <div className="num" style={{ fontSize: 12.5, textAlign: "right", color: "var(--accent)" }}>${fmtMoney(r.value)}.00</div>
                <div className="num" style={{ fontSize: 12, color: "var(--muted-3)", textAlign: "right" }}>—</div>
                <div className="num" style={{ fontSize: 12, color: "var(--muted)", textAlign: "right" }}>{r.costPps}</div>
                <div className="num" style={{ fontSize: 12, color: "var(--muted)", textAlign: "right" }}>{r.curPps}</div>
              </div>
            ))}
          </div>
        ))}

        {/* Totals row */}
        <div style={{
          display: "grid", gridTemplateColumns: "1.6fr 110px 110px 130px 130px 110px 110px 110px",
          gap: 12, alignItems: "center", padding: "14px 22px",
          borderTop: "1px solid var(--border-strong)",
          background: "var(--surface)",
        }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.4 }}>Total</div>
          <div /><div />
          <div className="num" style={{ fontSize: 13, fontWeight: 600, textAlign: "right" }}>${fmtMoney(total.cost)}.00</div>
          <div className="num" style={{ fontSize: 13, fontWeight: 600, textAlign: "right" }}>${fmtMoney(total.value)}.00</div>
          <div /><div /><div />
        </div>
      </Card>
    </>
  );
}

const IRR_ROWS = [
  { co: "CircuitWorks Inc.", cost: 31250, proceeds: 0, fmv: 31250, total: 31250, gl: 0, mult: 1.0, irr: 0.0, orb: 0 },
  { co: "Hexagon Systems", cost: 2955891, proceeds: 0, fmv: 2955891, total: 2955891, gl: 0, mult: 1.0, irr: 0.0, orb: 1 },
  { co: "Horizon Capital", cost: 850000, proceeds: 0, fmv: 850000, total: 850000, gl: 0, mult: 1.0, irr: 0.0, orb: 2 },
  { co: "Nova AI", cost: 2128159, proceeds: 0, fmv: 2128159, total: 2128159, gl: 0, mult: 1.0, irr: 0.0, orb: 3 },
  { co: "QuantumLeap Labs", cost: 2901337, proceeds: 0, fmv: 2901337, total: 2901337, gl: 0, mult: 1.0, irr: 0.0, orb: 4 },
  { co: "Summit Ventures", cost: 312500, proceeds: 0, fmv: 312500, total: 312500, gl: 0, mult: 1.0, irr: 0.0, orb: 5 },
  { co: "Zephyr Innovations", cost: 31250, proceeds: 0, fmv: 31250, total: 31250, gl: 0, mult: 1.0, irr: 0.0, orb: 0 },
];

function DealIRRPage() {
  const [includeSafe, setIncludeSafe] = useStateSP(true);
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 12.5, color: "var(--fg-2)" }}>
          <span>Include SAFE Markups</span>
          <Toggle on={includeSafe} onClick={() => setIncludeSafe(v => !v)} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <DatePill />
          <Button variant="solid" size="sm" icon="download">Export</Button>
        </div>
      </div>

      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.6fr 130px 110px 140px 140px 100px 80px 110px",
          gap: 12, padding: "10px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div>Company</div>
          <div style={{ textAlign: "right" }}>Cost</div>
          <div style={{ textAlign: "right" }}>Proceeds</div>
          <div style={{ textAlign: "right" }}>Fair Market Value</div>
          <div style={{ textAlign: "right" }}>Total Value</div>
          <div style={{ textAlign: "right" }}>Gain/Loss</div>
          <div style={{ textAlign: "right" }}>Multiple</div>
          <div style={{ textAlign: "right" }}>Daily Gross IRR</div>
        </div>
        {IRR_ROWS.map((r, i) => (
          <div key={r.co} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "1.6fr 130px 110px 140px 140px 100px 80px 110px",
            gap: 12, alignItems: "center", padding: "13px 22px",
            borderBottom: i < IRR_ROWS.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Orb seed={r.orb} size={24} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>{r.co}</span>
            </div>
            <div className="num" style={{ fontSize: 12.5, textAlign: "right" }}>${fmtMoney(r.cost)}.00</div>
            <div className="num" style={{ fontSize: 12.5, color: "var(--muted)", textAlign: "right" }}>$0.00</div>
            <div className="num" style={{ fontSize: 12.5, textAlign: "right" }}>${fmtMoney(r.fmv)}.00</div>
            <div className="num" style={{ fontSize: 12.5, fontWeight: 500, textAlign: "right" }}>${fmtMoney(r.total)}.00</div>
            <div className="num" style={{ fontSize: 12.5, color: "var(--muted-3)", textAlign: "right" }}>—</div>
            <div className="num" style={{ fontSize: 12.5, color: "var(--muted)", textAlign: "right" }}>{r.mult.toFixed(1)}x</div>
            <div className="num" style={{ fontSize: 12.5, textAlign: "right", color: "var(--accent)", textDecoration: "underline", textDecorationColor: "var(--accent-ring-40)" }}>0.00%</div>
          </div>
        ))}
      </Card>
    </>
  );
}

const COMPANIES_SOI = [
  { name: "Hexagon Systems", invested: 2955891, value: 2955891, orb: 1 },
  { name: "QuantumLeap Labs", invested: 2901337, value: 2901337, orb: 4 },
  { name: "Nova AI", invested: 2128159, value: 2128159, orb: 3 },
  { name: "Horizon Capital", invested: 850000, value: 850000, orb: 2 },
  { name: "Summit Ventures", invested: 312500, value: 312500, orb: 5 },
  { name: "CircuitWorks Inc.", invested: 31250, value: 31250, orb: 0 },
  { name: "Zephyr Innovations", invested: 31250, value: 31250, orb: 0 },
];

function CompanyOverviewPage() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12, gap: 8 }}>
        <Button variant="solid" size="sm" icon="plus">Add Company</Button>
      </div>
      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 160px 160px 80px",
          gap: 12, padding: "10px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div>Name</div>
          <div style={{ textAlign: "right" }}>Invested Amount</div>
          <div style={{ textAlign: "right" }}>Current Value</div>
          <div style={{ textAlign: "right" }}>Actions</div>
        </div>
        {COMPANIES_SOI.map((c, i) => (
          <div key={c.name} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "2fr 160px 160px 80px",
            gap: 12, alignItems: "center", padding: "16px 22px",
            borderBottom: i < COMPANIES_SOI.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Orb seed={c.orb} size={26} />
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{c.name}</div>
            </div>
            <div className="num" style={{ fontSize: 13, textAlign: "right" }}>${fmtMoney(c.invested)}.00</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right" }}>${fmtMoney(c.value)}.00</div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button style={{
                width: 28, height: 28, borderRadius: 6,
                border: "1px solid var(--border)", background: "var(--surface)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--muted)",
              }}><Icon name="more" size={13} /></button>
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}

function PortfolioMetricsPage({ initialSrc, initialSection, initialPeriod } = {}) {
  const [src, setSrc] = useStateSP(initialSrc || "summary");
  const [section, setSection] = useStateSP(initialSection || "burn");
  const [period, setPeriod] = useStateSP(initialPeriod || "annual");
  const [company, setCompany] = useStateSP("CircuitWorks Inc.");

  const sources = [
    { id: "summary", label: "Summary" },
    { id: "qb",      label: "QuickBooks" },
    { id: "manual",  label: "Manual" },
  ];
  const sections = [
    { id: "charts",     label: "Charts" },
    { id: "rev",        label: "Revenue and Expenses" },
    { id: "burn",       label: "Burn - Actual" },
    { id: "ownership",  label: "Ownership Information" },
    { id: "notes",      label: "Notes" },
  ];
  const periods = [
    { id: "annual",   label: "Revenue & Expense (Annual)" },
    { id: "quarterly", label: "Revenue & Expense (Quarterly)" },
    { id: "monthly",  label: "Revenue & Expense (Monthly)" },
    { id: "cash-m",   label: "Change in Cash (Monthly)" },
    { id: "cash-y",   label: "End Cash (Annual)" },
  ];

  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 14, marginBottom: 14 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 280 }}>
            <span style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500 }}>Select Company</span>
            <button style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              height: 38, padding: "0 14px",
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 9, color: "var(--fg)", fontSize: 13,
              fontFamily: "inherit", cursor: "pointer",
            }}>
              <span>{company}</span>
              <Icon name="chevronD" size={12} color="var(--muted-2)" />
            </button>
          </div>
          <Pill tone="warn">QuickBooks Not Connected</Pill>
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="solid" size="sm" icon="doc">PDF</Button>
            <Button variant="primary" size="sm" icon="download">Excel</Button>
          </div>
        </div>

        <TabStrip tabs={sources} value={src} onChange={setSrc} />
        <div style={{ marginTop: 4 }}>
          <TabStrip tabs={sections} value={section} onChange={setSection} size="sm" />
        </div>

        <div style={{
          marginTop: 14,
          padding: "12px 14px",
          borderRadius: 10,
          background: "var(--surface)",
          boxShadow: "inset 0 0 0 1px var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12.5 }}>
            <span style={{ color: "var(--muted)", fontWeight: 500 }}>Data Source:</span>
            <Pill tone="outline">Internal Summary</Pill>
            <Pill tone="accent">Internal Summary</Pill>
          </div>
          <div style={{ marginTop: 8, fontSize: 11.5, color: "var(--accent)", display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="check" size={11} /> Internal summary with projections
          </div>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{ padding: "10px 14px 0" }}>
          <TabStrip tabs={periods} value={period} onChange={setPeriod} size="sm" />
        </div>
        <div style={{ padding: "16px 22px 22px" }}>
          <div style={{
            padding: 14, borderRadius: 10,
            background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--border)",
            fontSize: 12.5, color: "var(--fg-2)", fontWeight: 500, marginBottom: 14,
          }}>
            Revenue & Expense (Annual) — Summary Data
          </div>

          {/* Synthetic mini chart */}
          <BarChartMini />

          <div style={{ marginTop: 18, display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            {[
              { label: "Revenue YoY", v: "+18%", tone: "pos" },
              { label: "Burn (mo. avg)", v: "$182k", tone: "neutral" },
              { label: "Runway", v: "16 mo", tone: "accent" },
              { label: "Gross margin", v: "62%", tone: "pos" },
            ].map(s => (
              <div key={s.label} style={{
                padding: 12, borderRadius: 10,
                background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--border)",
              }}>
                <div style={{ fontSize: 11, color: "var(--muted-2)", marginBottom: 4 }}>{s.label}</div>
                <div className="num" style={{ fontSize: 16, fontWeight: 500, color: s.tone === "pos" ? "var(--pos)" : s.tone === "accent" ? "var(--accent)" : "var(--fg)" }}>{s.v}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </>
  );
}

function BarChartMini() {
  // Synthetic 6-quarter revenue/expense bars (CSS bars; no SVG of any complexity)
  const data = [
    { q: "Q1'24", rev: 0.42, exp: 0.55 },
    { q: "Q2'24", rev: 0.48, exp: 0.58 },
    { q: "Q3'24", rev: 0.55, exp: 0.6  },
    { q: "Q4'24", rev: 0.62, exp: 0.6  },
    { q: "Q1'25", rev: 0.72, exp: 0.65 },
    { q: "Q2'25", rev: 0.85, exp: 0.7  },
  ];
  return (
    <div style={{
      padding: "16px 4px 8px",
      borderRadius: 10,
      background: "var(--surface)",
      boxShadow: "inset 0 0 0 1px var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 24, height: 160, padding: "0 22px" }}>
        {data.map(d => (
          <div key={d.q} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 130 }}>
              <div style={{ width: 14, height: `${d.rev * 100}%`, background: "var(--accent)", borderRadius: "3px 3px 0 0" }} />
              <div style={{ width: 14, height: `${d.exp * 100}%`, background: "var(--muted-3)", opacity: 0.55, borderRadius: "3px 3px 0 0" }} />
            </div>
            <span style={{ fontSize: 10.5, color: "var(--muted-2)", fontFamily: "var(--font-mono)" }}>{d.q}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 10, fontSize: 11, color: "var(--muted-2)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--accent)" }} /> Revenue
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: "var(--muted-3)", opacity: 0.55 }} /> Expense
        </span>
      </div>
    </div>
  );
}

function EquitySchedulePage() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 12 }}>
        <DatePill />
      </div>
      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "1.4fr 130px 130px 140px 130px 130px 130px 130px",
          gap: 12, padding: "10px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div>Company</div>
          <div>Vesting Start Date</div>
          <div>Vesting Duration (years)</div>
          <div>Vesting Schedule</div>
          <div style={{ textAlign: "right" }}>Total Granted Shares</div>
          <div style={{ textAlign: "right" }}>Vested Shares</div>
          <div style={{ textAlign: "right" }}>Remaining Shares</div>
          <div style={{ textAlign: "right" }}>Percentage Vested</div>
        </div>
        <EmptyTable />
        <div style={{
          padding: "10px 22px", borderTop: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: 12, color: "var(--muted-2)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={pagerBtn}><Icon name="chevronL" size={11} /></button>
            <span>Page</span>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 22, border: "1px solid var(--border)", borderRadius: 5, fontFamily: "var(--font-mono)" }}>1</span>
            <span>of 1</span>
            <button style={pagerBtn}><Icon name="chevronR" size={11} /></button>
          </div>
          <div>0 - 0 of 0 &nbsp;&nbsp; Rows <span style={{ marginLeft: 6, fontFamily: "var(--font-mono)" }}>25</span> ▾</div>
        </div>
      </Card>
    </>
  );
}

const pagerBtn = {
  width: 22, height: 22, border: "1px solid var(--border)", background: "var(--surface)",
  borderRadius: 5, display: "inline-flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", color: "var(--muted-2)",
};

// ════════════════════════════════════════════════════════════════
// Investors sub-pages
// ════════════════════════════════════════════════════════════════

function CapitalStatementPage() {
  const [partner, setPartner] = useStateSP("Admin Ventures GP, LLC");

  const summary = [
    { label: "Beginning balance", period: 361616.40, ytd: 361616.40, itd: 0 },
    { label: "Capital contribution", period: 0, ytd: 0, itd: 312500 },
    { label: "Unrealized gain (loss)", period: 0, ytd: 0, itd: 65188.39 },
    { label: "Net operating income (loss)", period: 0, ytd: 0, itd: -16071.98 },
    { label: "Ending balance", period: 361616.40, ytd: 361616.40, itd: 361616.40, total: true },
  ];
  const commit = [
    { label: "Initial commitment", period: 625000, ytd: 625000, itd: 625000 },
    { label: "Contributions", period: 0, ytd: 0, itd: 312500 },
    { label: "Recallable distributions", period: 0, ytd: 0, itd: 0 },
    { label: "Unfunded commitment", period: 0, ytd: 0, itd: 312500, total: true },
  ];

  return (
    <>
      <FilterBar>
        <FilterField label="Select Partner" value={partner} chevron />
        <FilterField label="Select Period" value="Last Quarter" chevron />
        <FilterField label="From Date" value="01/01/2026" icon="calendar" chevron />
        <FilterField label="To Date"   value="03/31/2026" icon="calendar" chevron />
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500 }}>Generate Period</span>
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="solid" size="sm" icon="doc">All Statements <span style={{ marginLeft: 6, fontSize: 9.5, color: "var(--muted-2)", letterSpacing: 0.6 }}>PDF</span></Button>
            <Button variant="solid" size="sm" icon="doc">Statement <span style={{ marginLeft: 6, fontSize: 9.5, color: "var(--muted-2)", letterSpacing: 0.6 }}>PDF</span></Button>
          </div>
        </div>
      </FilterBar>

      <CapitalCard title="Capital Summary" rows={summary} />
      <div style={{ height: 16 }} />
      <CapitalCard title="Commitment Summary" rows={commit} />
    </>
  );
}

function CapitalCard({ title, rows }) {
  return (
    <Card padding={0}>
      <div style={{ padding: "12px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name="folder" size={12} color="var(--muted-2)" />
        <span style={{ fontSize: 13, fontWeight: 500 }}>{title}</span>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "2fr 160px 160px 160px",
        gap: 12, padding: "10px 22px", borderBottom: "1px solid var(--border)",
        fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
      }}>
        <div>Account Summary</div>
        <div style={{ textAlign: "right" }}>Statement period</div>
        <div style={{ textAlign: "right" }}>Year to date</div>
        <div style={{ textAlign: "right" }}>Inception to date</div>
      </div>
      {rows.map((r, i) => (
        <div key={r.label} className="row-hover" style={{
          display: "grid", gridTemplateColumns: "2fr 160px 160px 160px",
          gap: 12, alignItems: "center", padding: "12px 22px",
          borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none",
          background: r.total ? "var(--surface)" : "transparent",
        }}>
          <div style={{ fontSize: 12.5, color: "var(--fg-2)", fontWeight: r.total ? 500 : 400 }}>{r.label}</div>
          {[r.period, r.ytd, r.itd].map((v, j) => {
            const isZero = v === 0;
            const isNeg = v < 0;
            const display = isZero ? "$0.00" :
              isNeg ? "-$" + fmtMoney(Math.abs(v), 2) :
              "$" + fmtMoney(v, 2);
            return (
              <div key={j} className="num" style={{
                fontSize: 12.5, textAlign: "right",
                fontWeight: r.total ? 500 : 400,
                color: isZero ? "var(--accent)" : isNeg ? "var(--neg)" : (r.total ? "var(--fg)" : "var(--accent)"),
              }}>{display}</div>
            );
          })}
        </div>
      ))}
    </Card>
  );
}

function FilterBar({ children }) {
  return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", gap: 14, alignItems: "flex-end", flexWrap: "wrap" }}>
        {children}
      </div>
    </Card>
  );
}

function FilterField({ label, value, icon, chevron, w = 200 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: w }}>
      <span style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500 }}>{label}</span>
      <button style={{
        display: "flex", alignItems: "center", gap: 8,
        height: 36, padding: "0 12px",
        background: "var(--surface)", border: "1px solid var(--border)",
        borderRadius: 9, color: "var(--fg)", fontSize: 12.5,
        fontFamily: "inherit", cursor: "pointer", textAlign: "left",
        width: "100%",
      }}>
        {icon && <Icon name={icon} size={12} color="var(--muted-2)" />}
        <span style={{ flex: 1 }} className={icon === "calendar" ? "num" : ""}>{value}</span>
        {chevron && <Icon name="chevronD" size={11} color="var(--muted-2)" />}
      </button>
    </div>
  );
}

function PartnerRollForwardsPage() {
  const lps = [
    { name: "Baron T. Hayes / Lakeshore Heritage Trust", taxId: "***-**-4421", type: "Individual", pct: 2.71, beg: 442160.59, contrib: 118422.50 },
    { name: "Ben Wisotski", taxId: "—", type: "Individual", pct: 0, beg: 0, contrib: 0 },
    { name: "Carter Torres / Prairie Sky Ventures LLC", taxId: "**-***0173", type: "Entity", pct: 2.56, beg: 417937.85, contrib: 111935.00 },
    { name: "Charles L. Greene / Admin Ventures GP, LLC", taxId: "**-***6610", type: "Entity", pct: 1.43, beg: 245859.68, contrib: 62500.00 },
    { name: "Evelyn Chen", taxId: "***-**-2241", type: "Individual", pct: 26.85, beg: 4375727.37, contrib: 1171937.50 },
    { name: "Harlow Simmons", taxId: "***-**-7790", type: "Individual", pct: 1.36, beg: 221691.70, contrib: 59375.00 },
    { name: "Jonathan D. Harris", taxId: "***-**-1140", type: "Individual", pct: 14.26, beg: 2324614.78, contrib: 622594.38 },
    { name: "Joseph A. Martin / Blue Ridge Family Trust", taxId: "**-***5589", type: "Trust", pct: 10.16, beg: 1656853.73, contrib: 443750.00 },
    { name: "Maplewood Solutions LLC / Ironclad Solutions Corp.", taxId: "**-***2207", type: "Entity", pct: 1.43, beg: 233359.68, contrib: 62500.00 },
    { name: "Redwood Creek Holdings, Inc.", taxId: "**-***9911", type: "Entity", pct: 32.79, beg: 5515686.68, contrib: 1431250.00 },
    { name: "Whitestone Capital", taxId: "**-***4406", type: "Entity", pct: 6.44, beg: 1050118.56, contrib: 281250.00 },
  ];
  const totals = lps.reduce((acc, r) => ({ beg: acc.beg + r.beg, contrib: acc.contrib + r.contrib }), { beg: 0, contrib: 0 });

  return (
    <>
      <FilterBar>
        <FilterField label="Select Period" value="Inception-to-Date (ITD)" chevron />
        <FilterField label="From Date" value="01/01/2023" icon="calendar" chevron />
        <FilterField label="To Date"   value="04/29/2026" icon="calendar" chevron />
        <div style={{ flex: 1 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          <span style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500 }}>Export</span>
          <Button variant="solid" size="sm" icon="download">Export</Button>
        </div>
      </FilterBar>

      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 110px 110px 100px 150px 150px",
          gap: 12, padding: "10px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div>Investor legal name</div>
          <div>Tax ID</div>
          <div>Tax Type</div>
          <div style={{ textAlign: "right" }}>Commitment (%)</div>
          <div style={{ textAlign: "right" }}>Beginning Balance</div>
          <div style={{ textAlign: "right" }}>Capital contribution</div>
        </div>
        {lps.map((r, i) => (
          <div key={r.name} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "2fr 110px 110px 100px 150px 150px",
            gap: 12, alignItems: "center", padding: "13px 22px",
            borderBottom: i < lps.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ fontSize: 12.5, color: "var(--fg)", fontWeight: 450 }}>{r.name}</div>
            <div className="num" style={{ fontSize: 11.5, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{r.taxId}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.type}</div>
            <div className="num" style={{ fontSize: 12.5, textAlign: "right", color: r.pct === 0 ? "var(--muted-3)" : "var(--fg-2)" }}>{r.pct.toFixed(2)}%</div>
            <div className="num" style={{ fontSize: 12.5, textAlign: "right", color: r.beg === 0 ? "var(--muted-3)" : "var(--fg)" }}>{r.beg === 0 ? "$0.00" : "$" + fmtMoney(r.beg, 2)}</div>
            <div className="num" style={{ fontSize: 12.5, textAlign: "right", color: r.contrib === 0 ? "var(--muted-3)" : "var(--fg)" }}>{r.contrib === 0 ? "$0.00" : "$" + fmtMoney(r.contrib, 2)}</div>
          </div>
        ))}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 110px 110px 100px 150px 150px",
          gap: 12, alignItems: "center", padding: "13px 22px",
          borderTop: "1px solid var(--border-strong)",
          background: "var(--surface)",
        }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)" }}>Total</div>
          <div /><div /><div />
          <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 600 }}>${fmtMoney(totals.beg, 2)}</div>
          <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 600 }}>${fmtMoney(totals.contrib, 2)}</div>
        </div>
      </Card>
    </>
  );
}

const TXN_ROWS = [
  { date: "Feb 12 2025", event: "CAPITAL CALL", desc: "CC #2", account: "Capital Call Receivable - GP", debit: 62500.00 },
  { date: "Feb 12 2025", event: "CAPITAL CALL", desc: "CC #2", account: "Contributed Capital - GP", debit: 0 },
  { date: "Feb 12 2025", event: "MIGRATION",    desc: "Contribution", account: "Capital Call Receivable - GP", debit: 0 },
];

function TransactionsPage() {
  return (
    <>
      <FilterBar>
        <FilterField label="Select Partner" value="Admin Ventures GP, LLC" chevron />
        <FilterField label="Select Period" value="Inception-to-Date (ITD)" chevron />
        <FilterField label="From Date" value="01/01/2023" icon="calendar" chevron />
        <FilterField label="To Date"   value="04/29/2026" icon="calendar" chevron />
      </FilterBar>

      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "32px 130px 150px 1fr 220px 130px",
          gap: 12, padding: "10px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div><Checkbox /></div>
          <div>Event Date</div>
          <div>Event</div>
          <div>Description</div>
          <div>Account</div>
          <div style={{ textAlign: "right" }}>Debit</div>
        </div>
        {TXN_ROWS.map((r, i) => (
          <div key={i} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "32px 130px 150px 1fr 220px 130px",
            gap: 12, alignItems: "center", padding: "14px 22px",
            borderBottom: i < TXN_ROWS.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <Checkbox />
            <div className="num" style={{ fontSize: 12, color: "var(--muted)" }}>{r.date}</div>
            <div><EventBadge kind={r.event} /></div>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{r.desc}</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{r.account}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 500, color: r.debit ? "var(--fg)" : "var(--muted-3)" }}>
              {r.debit ? "$" + fmtMoney(r.debit, 2) : "$0.00"}
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}

function EventBadge({ kind }) {
  const map = {
    "CAPITAL CALL": { c: "var(--accent)", b: "var(--accent-tint)" },
    "DISTRIBUTION": { c: "var(--pos)", b: "var(--pos-tint)" },
    "MIGRATION":    { c: "var(--muted)", b: "var(--surface-2)" },
  };
  const t = map[kind] || map.MIGRATION;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "3px 8px", borderRadius: 5,
      background: t.b, color: t.c,
      fontSize: 10.5, fontWeight: 600, letterSpacing: 0.6,
      fontFamily: "var(--font-mono)",
    }}>{kind}</span>
  );
}

function Checkbox({ checked = false }) {
  return (
    <span style={{
      width: 16, height: 16, borderRadius: 4,
      background: checked ? "var(--accent)" : "var(--surface)",
      boxShadow: checked ? "none" : "inset 0 0 0 1px var(--border-strong)",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      cursor: "pointer",
    }}>
      {checked && <Icon name="check" size={10} color="#fff" />}
    </span>
  );
}

const PNL_ROWS = [
  { date: "Apr 02, 2025", type: "Management fees", amount: 0 },
  { date: "Mar 30, 2025", type: "Net operating income (loss)", amount: -1013.71 },
  { date: "Jan 02, 2025", type: "Management fees", amount: 0 },
  { date: "Jul 02, 2024", type: "Net operating income (loss)", amount: -4027.30 },
  { date: "Mar 30, 2024", type: "Management fees", amount: 0 },
  { date: "Dec 31, 2023", type: "Management fees", amount: 0 },
  { date: "Dec 30, 2023", type: "Unrealized gain (loss)", amount: 65188.39 },
  { date: "Sep 30, 2023", type: "Net operating income (loss)", amount: -2863.35 },
  { date: "Jul 02, 2023", type: "Net operating income (loss)", amount: -4027.30 },
  { date: "Dec 31, 2022", type: "Management fees", amount: 0 },
  { date: "Sep 30, 2022", type: "Net operating income (loss)", amount: -1276.97 },
  { date: "Sep 30, 2022", type: "Net operating income (loss)", amount: -2863.35 },
];

function PNLPage() {
  return (
    <>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
          <FilterField label="Select Partner" value="Admin Ventures GP, LLC" chevron w={260} />
          <div style={{ flex: 1 }} />
          <div style={{ display: "flex", gap: 8 }}>
            <Button variant="solid" size="sm" icon="download">Export</Button>
            <Button variant="solid" size="sm" icon="plus">Add</Button>
            <Button variant="primary" size="sm" icon="upload">Bulk Upload</Button>
          </div>
        </div>
      </Card>

      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "32px 1fr 1.4fr 130px 80px",
          gap: 12, padding: "10px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <Checkbox />
          <div>Date</div>
          <div>Type</div>
          <div style={{ textAlign: "right" }}>Amount</div>
          <div style={{ textAlign: "right" }}>Actions</div>
        </div>
        {PNL_ROWS.map((r, i) => {
          const isNeg = r.amount < 0;
          const isZero = r.amount === 0;
          return (
            <div key={i} className="row-hover" style={{
              display: "grid", gridTemplateColumns: "32px 1fr 1.4fr 130px 80px",
              gap: 12, alignItems: "center", padding: "13px 22px",
              borderBottom: i < PNL_ROWS.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <Checkbox />
              <div className="num" style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.date}</div>
              <div style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{r.type}</div>
              <div className="num" style={{
                fontSize: 12.5, textAlign: "right", fontWeight: 500,
                color: isZero ? "var(--muted-3)" : isNeg ? "var(--neg)" : "var(--pos)",
              }}>
                {isZero ? "$0.00" : isNeg ? `($${fmtMoney(Math.abs(r.amount), 2)})` : `$${fmtMoney(r.amount, 2)}`}
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button style={{
                  width: 26, height: 26, borderRadius: 6,
                  border: "1px solid var(--border)", background: "var(--surface)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "var(--muted)",
                }}><Icon name="more" size={12} /></button>
              </div>
            </div>
          );
        })}
        <div style={{
          padding: "12px 22px", borderTop: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: 12, color: "var(--muted-2)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={pagerBtn}><Icon name="chevronL" size={11} /></button>
            <span>Page</span>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 22, border: "1px solid var(--border)", borderRadius: 5, fontFamily: "var(--font-mono)" }}>1</span>
            <span>of 1</span>
            <button style={pagerBtn}><Icon name="chevronR" size={11} /></button>
          </div>
          <div>1 - 12 of 12 &nbsp;&nbsp; Rows <span style={{ marginLeft: 6, fontFamily: "var(--font-mono)" }}>25</span> ▾</div>
        </div>
      </Card>
    </>
  );
}

const COMMIT_LPS = [
  { name: "Harlow Simmons", commit: 593750, recorded: 0 },
  { name: "Redwood Creek Holdings, Inc.", commit: 14312500, recorded: 0 },
  { name: "Evelyn Chen", commit: 11719375, recorded: 0 },
  { name: "Blue Ridge Family Trust", commit: 4437500, recorded: 0 },
  { name: "Admin Ventures GP, LLC", commit: 625000, recorded: 0 },
  { name: "Whitestone Capital", commit: 2812500, recorded: 0 },
  { name: "Lakeshore Heritage Trust", commit: 1184225, recorded: 0 },
  { name: "Ironclad Solutions Corp.", commit: 625000, recorded: 0 },
  { name: "Jonathan D. Harris", commit: 6225944, recorded: 0 },
  { name: "Prairie Sky Ventures LLC", commit: 1119350, recorded: 0 },
];

function CommitmentHistoryPage() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <DatePill />
      </div>
      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "32px 2fr 160px 160px 200px",
          gap: 12, padding: "10px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div />
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>LP Name <Icon name="chevronD" size={10} color="var(--accent)" /></div>
          <div style={{ textAlign: "right" }}>Commitment</div>
          <div style={{ textAlign: "right" }}>Commitment (History)</div>
          <div style={{ textAlign: "right" }}>Variance</div>
        </div>
        {COMMIT_LPS.map((r, i) => (
          <div key={r.name} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "32px 2fr 160px 160px 200px",
            gap: 12, alignItems: "center", padding: "13px 22px",
            borderBottom: i < COMMIT_LPS.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="chevronR" size={11} color="var(--muted-3)" />
            </div>
            <div style={{ fontSize: 12.5, color: "var(--fg)", fontWeight: 450 }}>{r.name}</div>
            <div className="num" style={{ fontSize: 12.5, textAlign: "right" }}>${fmtMoney(r.commit)}.00</div>
            <div className="num" style={{ fontSize: 12.5, textAlign: "right", color: "var(--muted)" }}>$0.00</div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 10px", borderRadius: 999,
                background: "var(--neg-tint)",
                color: "var(--neg)",
                boxShadow: "inset 0 0 0 1px rgba(239,68,68,0.3)",
                fontSize: 11.5, fontWeight: 500,
              }}>
                Mismatch
                <span className="num" style={{ fontFamily: "var(--font-mono)" }}>${fmtMoney(r.commit)}.00</span>
              </span>
            </div>
          </div>
        ))}
        <div style={{
          padding: "12px 22px", borderTop: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          fontSize: 12, color: "var(--muted-2)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={pagerBtn}><Icon name="chevronL" size={11} /></button>
            <span>Page</span>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 22, border: "1px solid var(--border)", borderRadius: 5, fontFamily: "var(--font-mono)" }}>1</span>
            <span>of 1</span>
            <button style={pagerBtn}><Icon name="chevronR" size={11} /></button>
          </div>
          <div>1 - 10 of 10 &nbsp;&nbsp; Rows <span style={{ marginLeft: 6, fontFamily: "var(--font-mono)" }}>100</span> ▾</div>
        </div>
      </Card>
    </>
  );
}

// SegSwitch — pill segmented control
function SegSwitch({ options, value, onChange }) {
  return (
    <div style={{
      display: "inline-flex", padding: 3, borderRadius: 8,
      background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--border)",
    }}>
      {options.map(o => {
        const active = o.id === value;
        return (
          <button key={o.id} onClick={() => onChange(o.id)} style={{
            padding: "5px 14px", borderRadius: 6,
            background: active ? "var(--surface-3)" : "transparent",
            border: "none",
            color: active ? "var(--fg)" : "var(--muted)",
            fontSize: 12, fontWeight: 500,
            boxShadow: active ? "inset 0 0 0 1px var(--border-strong)" : "none",
            cursor: "pointer", fontFamily: "inherit",
            transition: "all 120ms ease",
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

// Toggle clickable
function Toggle({ on, onClick }) {
  return (
    <div onClick={onClick} style={{
      width: 32, height: 18, borderRadius: 999,
      background: on ? "var(--accent)" : "var(--surface-3)",
      position: "relative", cursor: "pointer",
      boxShadow: on ? "0 0 12px var(--accent-ring-35)" : "inset 0 0 0 1px var(--border)",
      transition: "background 120ms ease",
      flexShrink: 0,
    }}>
      <div style={{
        position: "absolute", top: 2, left: on ? 16 : 2,
        width: 14, height: 14, borderRadius: 999, background: "#fff",
        transition: "left 120ms ease",
        boxShadow: "0 1px 2px rgba(0,0,0,0.3)",
      }} />
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Quarterly Report — Preview
// ════════════════════════════════════════════════════════════════

const QR_COMPANIES_DATA = [
  { name: "CircuitWorks Inc.", sector: "Sensors", stage: "Seed",
    invested: 31250, value: 31250, gain: 0, multiple: 1.0,
    valuation: 8200000, pps: 2.50, pct: 0.38,
    highlights: [
      "Closed Series A-2 extension at $8.2M post; 18 mo runway.",
      "Two pilot programs converted to multi-year contracts in Q1.",
      "First production line online; unit cost down 22% QoQ.",
    ],
  },
  { name: "Hexagon Systems", sector: "Industrial IoT", stage: "Series B",
    invested: 2955891, value: 2955891, gain: 0, multiple: 1.0,
    valuation: 142000000, pps: 1.50, pct: 2.08,
    highlights: [
      "ARR crossed $24M; net retention 132%.",
      "Closed enterprise deal with top-3 logistics carrier.",
      "Hired CRO from Samsara — sales org rebuilt around verticals.",
    ],
  },
  { name: "Horizon Capital", sector: "Fintech", stage: "Late Seed",
    invested: 850000, value: 850000, gain: 0, multiple: 1.0,
    valuation: 18500000, pps: null, pct: 4.59,
    highlights: [
      "Beta launched in 3 states; 2,400 wait-list converted.",
      "MTU growth 41% MoM through Q1.",
      "Term sheet for Series A under review.",
    ],
  },
  { name: "Nova AI", sector: "Applied AI", stage: "Seed",
    invested: 2128159, value: 2128159, gain: 0, multiple: 1.0,
    valuation: 22000000, pps: 2.80, pct: 9.67,
    highlights: [
      "Foundation-model fine-tuning platform GA in Feb.",
      "Closed first $500k+ ACV customer; pipeline at $4.1M.",
      "Co-development partnership signed with NVIDIA Inception.",
    ],
  },
  { name: "QuantumLeap Labs", sector: "Quantum Compute", stage: "Series A",
    invested: 2901337, value: 2901337, gain: 0, multiple: 1.0,
    valuation: 65000000, pps: 4.10, pct: 4.46,
    highlights: [
      "Demonstrated 142-qubit error-corrected operation in lab.",
      "Joint research grant awarded with DOE labs.",
      "Burn reduced 18% after platform consolidation.",
    ],
  },
  { name: "Summit Ventures", sector: "Climate", stage: "Seed",
    invested: 312500, value: 312500, gain: 0, multiple: 1.0,
    valuation: 12000000, pps: 1.20, pct: 2.60,
    highlights: [
      "First commercial pilot deployed in Q1; 14-month payback.",
      "Hired VP Operations from Heliogen.",
      "Grant funding extended runway by 9 months.",
    ],
  },
  { name: "Zephyr Innovations", sector: "Aerospace", stage: "Pre-seed",
    invested: 31250, value: 31250, gain: 0, multiple: 1.0,
    valuation: 6500000, pps: null, pct: 0.48,
    highlights: [
      "Successful flight demo of unmanned cargo prototype.",
      "Department-of-Defense innovation award shortlist.",
      "Hiring against a $1.4M SAFE for engineering team.",
    ],
  },
];

function QRPreview({ report, onBack }) {
  const [activeCompany, setActiveCompany] = useStateSP(QR_COMPANIES_DATA[0].name);
  const [companySearch, setCompanySearch] = useStateSP("");
  const company = QR_COMPANIES_DATA.find(c => c.name === activeCompany) || QR_COMPANIES_DATA[0];
  const filteredCos = QR_COMPANIES_DATA.filter(c => c.name.toLowerCase().includes(companySearch.toLowerCase()));

  const totalInvested = QR_COMPANIES_DATA.reduce((s, c) => s + c.invested, 0);
  const totalValue    = QR_COMPANIES_DATA.reduce((s, c) => s + c.value, 0);
  const irr = 0; // matches dummy data — placeholder

  const summaryItems = [
    { icon: "pie",        label: "Companies",      tag: "Total",     value: "7" },
    { icon: "checklist",  label: "Active",         value: "7" },
    { icon: "transfer",   label: "Companies",      tag: "Active",    value: "7" },
    { icon: "accounting", label: "Capital Called", tag: "Value",     value: `$${fmtMoney(totalInvested)}.00` },
    { icon: "trendUp",    label: "Distributed",    value: "$0.00" },
    { icon: "wallet",     label: "Market Value",   value: `$${fmtMoney(totalValue)}.00` },
    { icon: "investor",   label: "Portfolio Net Asset Value", value: "49.10%", color: "var(--pos)" },
    { icon: "info",       label: "Unrealized Gain/Loss", value: "$4.55M", color: "var(--pos)" },
    { icon: "trendUp",    label: "Loss",           value: "$0.00",   color: "var(--muted-3)" },
    { icon: "users",      label: "MOIC",           value: "1" },
    { icon: "transfer",   label: "Gross IRR",      value: "0.00%",   color: "var(--accent)" },
    { icon: "investor",   label: "Net IRR",        value: "1.20%",   color: "var(--accent)" },
  ];

  return (
    <div style={{ background: "var(--bg)", minHeight: "100%" }}>
      {/* Toolbar */}
      <div style={{
        position: "sticky", top: 0, zIndex: 5,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 28px",
        background: "color-mix(in srgb, var(--bg) 85%, transparent)",
        backdropFilter: "blur(14px)",
        WebkitBackdropFilter: "blur(14px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button onClick={onBack} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "6px 12px", background: "transparent",
            border: "1px solid var(--border)", borderRadius: 7,
            color: "var(--muted)", fontSize: 12.5, fontFamily: "inherit",
            cursor: "pointer",
          }}>
            <Icon name="chevronL" size={11} /> Back
          </button>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            <span style={{ color: "var(--fg)", fontWeight: 500 }}>{report.title}</span>
            {report.draft && <span style={{ marginLeft: 10 }}><Pill tone="accent">Draft</Pill></span>}
            {!report.draft && <span style={{ marginLeft: 10 }}><Pill tone="pos">Sent</Pill></span>}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Button variant="solid" size="sm" icon="share">Share link</Button>
          <Button variant="solid" size="sm" icon="download" onClick={() => alert("Download started: " + report.title + ".pdf")}>Download PDF</Button>
          {report.draft && <Button variant="primary" size="sm" icon="send">Send to LPs</Button>}
        </div>
      </div>

      {/* Document */}
      <div style={{ padding: "32px 28px 80px", display: "flex", justifyContent: "center" }}>
        <div style={{
          width: "100%", maxWidth: 1140,
          display: "flex", flexDirection: "column", gap: 18,
        }}>

          {/* Page 1 — Cover */}
          <QRPage>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "8px 4px 24px" }}>
              <span style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.6, fontWeight: 500, textTransform: "uppercase" }}>Quarterly LP Report</span>
              <h1 style={{ margin: 0, fontSize: 36, fontWeight: 500, letterSpacing: -0.8, color: "var(--fg)" }}>
                {report.title.replace("Quarterly Report — ", "Quarterly Report — ")}
              </h1>
              <div style={{ fontSize: 13, color: "var(--muted)" }}>{report.period}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, padding: "16px 4px 4px", borderTop: "1px solid var(--border)" }}>
              <CrumbStat label="Firm" value="Admin Ventures" icon="logo" />
              <CrumbStat label="Fund" value="Admin Ventures IV" icon="folder" />
              <CrumbStat label="Quarter" value={report.quarter} icon="calendar" mono />
              <CrumbStat label="Year" value={String(report.year)} icon="calendar" mono />
            </div>
          </QRPage>

          {/* Page 2 — Fund information */}
          <QRPage section="01" title="Fund information">
            <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderRadius: 10, background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--border)" }}>
              <Orb seed={4} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Admin Ventures IV</div>
                <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>Admin Ventures</div>
              </div>
              <Pill tone="outline">Active</Pill>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 12, border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              <KVCell label="Vintage" value="2023" mono />
              <KVCell label="Term" value="10 years" />
              <KVCell label="Legal Form" value="Limited Partnership" />
              <KVCell label="Structure" value="Closed-End" last />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: -1, border: "1px solid var(--border)", borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden" }}>
              <KVCell label="Currency" value="USD" mono />
              <KVCell label="Domicile" value="Delaware, USA" />
              <KVCell label="Strategy" value="Early Stage Venture" />
              <KVCell label="Auditor" value="Grant Thornton" last />
            </div>

            <div style={{ marginTop: 14 }}>
              <div style={{ fontSize: 11.5, color: "var(--muted-2)", letterSpacing: 0.4, fontWeight: 500, textTransform: "uppercase", marginBottom: 8 }}>General Partner</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 9, background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--border)" }}>
                <Orb seed={3} size={24} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>Admin Ventures GP, LLC</span>
              </div>
            </div>

            <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--muted)" }}>
              <Icon name="info" size={11} color="var(--muted-2)" />
              Address Unknown
            </div>
          </QRPage>

          {/* Page 3 — Partners Note & AGM */}
          <QRPage section="02" title="Partners Note & AGM">
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--fg-2)", margin: "0 0 14px" }}>
              Dear Limited Partners — we are pleased to present the {report.quarter} {report.year} Limited Partner report. This quarter we made significant strides in executing on our investment strategy, focusing on top-quartile early-stage managers. We will continue to invest patiently, support portfolio companies through value-creation initiatives, and selectively rebalance when market conditions or pacing warrant action.
            </p>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--fg-2)", margin: "0 0 14px" }}>
              Our portfolio is weighted toward applied AI, climate infrastructure, and industrial automation — sectors where we see durable demand and pricing power. Over the next two quarters we expect to call additional capital across {report.funds} active funds and recycle proceeds from two early secondaries.
            </p>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "var(--fg-2)", margin: 0 }}>
              We will host the Annual General Meeting on June 12 at our offices in San Francisco. An invitation with the agenda and dial-in details will follow under separate cover. As always, please reach out with any questions or feedback.
            </p>

            <div style={{ marginTop: 22, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderRadius: 9, background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--border)" }}>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 500 }}>Annual General Meeting</div>
                <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>June 12, {report.year} · San Francisco · Hybrid</div>
              </div>
              <Button variant="solid" size="sm" icon="calendar">Add to calendar</Button>
            </div>
          </QRPage>

          {/* Page 4 — Portfolio summary */}
          <QRPage section="03" title="Portfolio summary">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {summaryItems.map((m, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "12px 14px", borderRadius: 9,
                  background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--border)",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 7,
                    background: "var(--accent-tint)", color: m.color || "var(--accent)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0,
                  }}>
                    <Icon name={m.icon} size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 11, color: "var(--muted-2)" }}>{m.label}</span>
                      {m.tag && <Pill tone="outline">{m.tag}</Pill>}
                    </div>
                    <div className="num" style={{ fontSize: 14, fontWeight: 500, color: m.color || "var(--fg)" }}>{m.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </QRPage>

          {/* Page 5 — Big NAV hero */}
          <QRPage>
            <div style={{
              padding: "44px 36px",
              borderRadius: 14,
              background: "linear-gradient(180deg, var(--accent-ring-10), var(--accent-ring-06) 60%, transparent)",
              boxShadow: "inset 0 0 0 1px var(--border)",
            }}>
              <div style={{ fontSize: 11.5, color: "var(--muted-2)", letterSpacing: 0.6, fontWeight: 500, textTransform: "uppercase", marginBottom: 14 }}>Total NAV — Admin Ventures IV</div>
              <div className="num" style={{ fontSize: 88, fontWeight: 500, letterSpacing: -3, lineHeight: 1, color: "var(--fg)" }}>
                ${(report.nav / 1_000_000).toFixed(2)}M
              </div>
              <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 22, fontSize: 12.5, color: "var(--muted)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--pos)" }} /> +$4.55M unrealized</span>
                <span>·</span>
                <span>{report.funds} funds covered</span>
                <span>·</span>
                <span>{QR_COMPANIES_DATA.length} active companies</span>
                <span>·</span>
                <span>As of {report.period.split(",")[0].split("–")[1].trim()}, {report.year}</span>
              </div>
            </div>
          </QRPage>

          {/* Page 6 — Active companies */}
          <QRPage section="04" title="Active companies">
            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 0, border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              {/* Sidebar list */}
              <div style={{ borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", background: "var(--surface)" }}>
                <div style={{ padding: 10, borderBottom: "1px solid var(--border)" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 10px", background: "var(--bg)",
                    border: "1px solid var(--border)", borderRadius: 7,
                  }}>
                    <Icon name="search" size={11} color="var(--muted-2)" />
                    <input
                      value={companySearch}
                      onChange={e => setCompanySearch(e.target.value)}
                      placeholder="Search company"
                      style={{
                        flex: 1, background: "transparent", border: "none", outline: "none",
                        color: "var(--fg)", fontSize: 12, fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>
                <div style={{ flex: 1, overflowY: "auto", maxHeight: 380 }}>
                  {filteredCos.map(c => {
                    const active = c.name === activeCompany;
                    return (
                      <button key={c.name} onClick={() => setActiveCompany(c.name)} style={{
                        display: "flex", alignItems: "center", gap: 10, width: "100%",
                        padding: "11px 12px",
                        background: active ? "var(--bg)" : "transparent",
                        border: "none", borderLeft: active ? "2px solid var(--accent)" : "2px solid transparent",
                        cursor: "pointer", color: active ? "var(--fg)" : "var(--muted)",
                        fontFamily: "inherit", textAlign: "left",
                        fontSize: 12.5, fontWeight: active ? 500 : 450,
                      }}>
                        <Orb seed={QR_COMPANIES_DATA.indexOf(c)} size={20} />
                        <span style={{ flex: 1 }}>{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Detail panel */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {/* Hero band */}
                <div style={{
                  height: 110,
                  background: "linear-gradient(135deg, var(--accent-ring-18), rgba(106,225,255,0.10))",
                  borderBottom: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "0 22px",
                }}>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 500 }}>{company.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 4, display: "flex", gap: 10 }}>
                      <span>{company.sector}</span>
                      <span>·</span>
                      <span>{company.stage}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 10.5, color: "var(--muted-2)" }}>Last valuation</span>
                    <span className="num" style={{ fontSize: 18, fontWeight: 500 }}>${fmtMoney(company.valuation)}</span>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ display: "flex", gap: 8, padding: "14px 22px 6px", borderBottom: "1px solid var(--border)" }}>
                  <Pill tone="accent">{company.sector}</Pill>
                  <Pill tone="outline">{company.stage}</Pill>
                </div>

                {/* Stats grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", padding: "16px 22px", gap: 18 }}>
                  <Stat label="Invested" value={`$${fmtMoney(company.invested)}.00`} />
                  <Stat label="Current Value" value={`$${fmtMoney(company.value)}.00`} />
                  <Stat label="Fair Market Value" value={`$${fmtMoney(company.value)}.00`} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", padding: "0 22px 18px", gap: 18, borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <Stat label="Valuation"     value={`$${fmtMoney(company.valuation)}`} small />
                    <Stat label="Total Shares"  value="1,250,000" small mono />
                    <Stat label="Price PPS"     value={company.pps !== null ? `$${company.pps.toFixed(2)}` : "—"} small />
                  </div>
                  <div>
                    <Stat label="Investment Cost" value={`$${fmtMoney(company.invested)}.00`} small />
                    <Stat label="Multiple"        value={`${company.multiple.toFixed(1)}x`} small />
                    <Stat label="Ownership"       value={`${company.pct.toFixed(2)}%`} small />
                  </div>
                </div>

                {/* Highlights */}
                <div style={{ padding: "16px 22px 4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
                    <Icon name="sparkle" size={12} color="var(--accent)" />
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-2)" }}>Highlights</span>
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
                    {company.highlights.map((h, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.5 }}>
                        <span style={{ width: 4, height: 4, borderRadius: 999, background: "var(--accent)", marginTop: 7, flexShrink: 0 }} />
                        <span style={{ flex: 1 }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </QRPage>

          {/* Footer */}
          <div style={{ textAlign: "center", padding: 14, fontSize: 11, color: "var(--muted-3)" }}>
            End of report · {report.title} · Confidential — for Limited Partners only
          </div>
        </div>
      </div>
    </div>
  );
}

function QRPage({ section, title, children }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: 14,
      padding: 28,
      boxShadow: "var(--shadow-card)",
    }}>
      {(section || title) && (
        <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
          {section && <span className="num" style={{ fontSize: 11, color: "var(--muted-2)", fontFamily: "var(--font-mono)", letterSpacing: 0.6 }}>{section}</span>}
          {title && <span style={{ fontSize: 13, fontWeight: 500 }}>{title}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

function CrumbStat({ label, value, icon, mono }) {
  return (
    <div style={{ padding: "10px 12px", borderRight: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
        {icon && <Icon name={icon} size={11} color="var(--muted-2)" />}
        <span style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.4, fontWeight: 500, textTransform: "uppercase" }}>{label}</span>
      </div>
      <div className={mono ? "num" : ""} style={{ fontSize: 14, fontWeight: 500, fontFamily: mono ? "var(--font-mono)" : "inherit" }}>{value}</div>
    </div>
  );
}

function KVCell({ label, value, mono, last }) {
  return (
    <div style={{
      padding: "12px 14px",
      borderRight: last ? "none" : "1px solid var(--border)",
    }}>
      <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.5, fontWeight: 500, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div className={mono ? "num" : ""} style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

function Stat({ label, value, small, mono }) {
  return (
    <div style={{ marginBottom: small ? 8 : 0 }}>
      <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.4, fontWeight: 500, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div className={mono ? "num" : ""} style={{ fontSize: small ? 13 : 17, fontWeight: 500, fontFamily: mono ? "var(--font-mono)" : "inherit" }}>{value}</div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Accounting sub-pages
// ════════════════════════════════════════════════════════════════

// Standard accounting header (title + KPI strip + page menu)
function AccountingHeader({ title, subTabs, page, setPage, kind = "default" }) {
  let main;
  if (kind === "ledger") {
    main = [
      { icon: "accounting", label: "Total Debits",   value: "$2,184,512.00" },
      { icon: "transfer",   label: "Total Credits",  value: "$2,184,512.00",
        tint: "var(--pos-tint)", color: "var(--pos)", ring: "rgba(34,197,94,0.22)" },
      { icon: "checklist",  label: "Entries",        tag: "MTD", value: "147" },
    ];
  } else if (kind === "trial") {
    main = [
      { icon: "accounting", label: "Debit Total",  value: "$13,857,221.00" },
      { icon: "transfer",   label: "Credit Total", value: "$13,857,221.00",
        tint: "var(--pos-tint)", color: "var(--pos)", ring: "rgba(34,197,94,0.22)" },
      { icon: "checklist",  label: "Variance",     value: "$0.00", tag: "Balanced" },
    ];
  } else if (kind === "balance") {
    main = [
      { icon: "accounting", label: "Total Assets",       value: "$13,985,221.00" },
      { icon: "transfer",   label: "Total Liabilities",  value: "$221,540.00" },
      { icon: "trendUp",    label: "Total Equity",       value: "$13,763,681.00",
        tint: "var(--pos-tint)", color: "var(--pos)", ring: "rgba(34,197,94,0.22)" },
    ];
  } else if (kind === "chart") {
    main = [
      { icon: "tree",       label: "Total Accounts", value: "84" },
      { icon: "checklist",  label: "Active",         value: "72" },
      { icon: "trendDown",  label: "Inactive",       value: "12" },
    ];
  } else if (kind === "journal") {
    main = [
      { icon: "checklist",  label: "Entries",  tag: "MTD",     value: "147" },
      { icon: "doc",        label: "Drafts",                   value: "3" },
      { icon: "shieldCheck",label: "Posted",                   value: "144",
        tint: "var(--pos-tint)", color: "var(--pos)", ring: "rgba(34,197,94,0.22)" },
    ];
  }
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18, gap: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button title="Pages" style={{
            width: 30, height: 30, borderRadius: 7, border: "none", background: "transparent",
            display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--muted)",
          }}><Icon name="menu" size={15} /></button>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 500, letterSpacing: -0.5 }}>{title}</h1>
        </div>
        {subTabs && <PageMenu items={subTabs} value={page} onChange={setPage} />}
      </div>
      {main && <MetricStrip items={main} />}
    </>
  );
}

// ───── General Ledger ─────
const GL_ROWS = [
  { date: "Apr 21, 2025", entry: "JE-2025-0147", memo: "Distribution received — Meridian Growth II", account: "Distribution Flow-Thru — Mercury", debit: 0, credit: 142500 },
  { date: "Apr 18, 2025", entry: "JE-2025-0146", memo: "Capital call issued — Sigma Ventures IV #7", account: "Capital Call Receivable — LP", debit: 185000, credit: 0 },
  { date: "Apr 18, 2025", entry: "JE-2025-0146", memo: "Capital call issued — Sigma Ventures IV #7", account: "Contributed Capital — LP", debit: 0, credit: 185000 },
  { date: "Apr 15, 2025", entry: "JE-2025-0145", memo: "Mgmt fee — Q1 2025 — Northwind", account: "Management Fee Expense", debit: 12500, credit: 0 },
  { date: "Apr 15, 2025", entry: "JE-2025-0145", memo: "Mgmt fee — Q1 2025 — Northwind", account: "Operating — Mercury", debit: 0, credit: 12500 },
  { date: "Apr 11, 2025", entry: "JE-2025-0144", memo: "Tax withholding — Harbor RE V K-1", account: "Tax Escrow — Mercury", debit: 4820, credit: 0 },
  { date: "Apr 11, 2025", entry: "JE-2025-0144", memo: "Tax withholding — Harbor RE V K-1", account: "Withholding Liability", debit: 0, credit: 4820 },
  { date: "Apr 08, 2025", entry: "JE-2025-0143", memo: "Distribution received — Northwind Buyout III", account: "Distribution Flow-Thru — Mercury", debit: 87250, credit: 0 },
  { date: "Apr 08, 2025", entry: "JE-2025-0143", memo: "Distribution received — Northwind Buyout III", account: "Realized Gain on Investment", debit: 0, credit: 87250 },
  { date: "Apr 02, 2025", entry: "JE-2025-0142", memo: "Bank fees — April",                      account: "Bank Fees Expense", debit: 142.50, credit: 0 },
];

function GeneralLedgerPage({ initialScope } = {}) {
  const [scope, setScope] = useStateSP(initialScope || "all");
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <SegSwitch options={[{ id: "all", label: "All accounts" }, { id: "cash", label: "Cash" }, { id: "expense", label: "Expense" }]} value={scope} onChange={setScope} />
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <DatePill />
          <Button variant="solid" size="sm" icon="filter">Filter</Button>
          <Button variant="solid" size="sm" icon="download">Export</Button>
        </div>
      </div>

      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "110px 130px 1.6fr 1.4fr 130px 130px",
          gap: 14, padding: "10px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div>Date</div>
          <div>Entry</div>
          <div>Memo</div>
          <div>Account</div>
          <div style={{ textAlign: "right" }}>Debit</div>
          <div style={{ textAlign: "right" }}>Credit</div>
        </div>
        {GL_ROWS.map((r, i) => (
          <div key={i} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "110px 130px 1.6fr 1.4fr 130px 130px",
            gap: 14, alignItems: "center", padding: "13px 22px",
            borderBottom: i < GL_ROWS.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div className="num" style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.date}</div>
            <div className="num" style={{ fontSize: 12.5, color: "var(--accent)" }}>{r.entry}</div>
            <div style={{ fontSize: 13 }}>{r.memo}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.account}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", color: r.debit ? "var(--fg)" : "var(--muted-3)" }}>{r.debit ? "$" + fmtMoney(r.debit) : "—"}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", color: r.credit ? "var(--pos)" : "var(--muted-3)" }}>{r.credit ? "$" + fmtMoney(r.credit) : "—"}</div>
          </div>
        ))}
        <div style={{
          display: "grid", gridTemplateColumns: "110px 130px 1.6fr 1.4fr 130px 130px",
          gap: 14, padding: "14px 22px", background: "var(--surface)",
          borderTop: "1px solid var(--border)",
        }}>
          <div></div><div></div><div></div>
          <div style={{ fontSize: 12, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4, textAlign: "right" }}>Totals</div>
          <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 500 }}>$202,462.50</div>
          <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 500, color: "var(--pos)" }}>$432,070.00</div>
        </div>
      </Card>
    </>
  );
}

// ───── Trial Balance ─────
const TB_ROWS = [
  { code: "1010", account: "Operating — Mercury",          type: "Asset",     debit: 1284650.00, credit: 0 },
  { code: "1020", account: "Capital Reserve — Mercury",    type: "Asset",     debit: 3935000.00, credit: 0 },
  { code: "1030", account: "Distribution Flow-Thru",       type: "Asset",     debit: 142500.00,  credit: 0 },
  { code: "1040", account: "Tax Escrow — Mercury",         type: "Asset",     debit: 285400.00,  credit: 0 },
  { code: "1200", account: "Investments — at FMV",         type: "Asset",     debit: 8337671.00, credit: 0 },
  { code: "2010", account: "Accrued Mgmt Fees Payable",    type: "Liability", debit: 0,          credit: 35840.00 },
  { code: "2020", account: "Withholding Liability",        type: "Liability", debit: 0,          credit: 28700.00 },
  { code: "2030", account: "Accrued Expenses",             type: "Liability", debit: 0,          credit: 157000.00 },
  { code: "3010", account: "Contributed Capital — LP",     type: "Equity",    debit: 0,          credit: 11400000.00 },
  { code: "3020", account: "Contributed Capital — GP",     type: "Equity",    debit: 0,          credit: 1245000.00 },
  { code: "3030", account: "Retained Earnings",            type: "Equity",    debit: 0,          credit: 1118681.00 },
  { code: "4010", account: "Realized Gain on Investment",  type: "Revenue",   debit: 0,          credit: 87250.00 },
  { code: "5010", account: "Management Fee Expense",       type: "Expense",   debit: 750000.00,  credit: 0 },
  { code: "5020", account: "Bank Fees Expense",            type: "Expense",   debit: 1850.00,    credit: 0 },
  { code: "5030", account: "Professional Services",        type: "Expense",   debit: 26200.00,   credit: 0 },
];

function TrialBalancePage() {
  const debitTotal = TB_ROWS.reduce((s, r) => s + r.debit, 0);
  const creditTotal = TB_ROWS.reduce((s, r) => s + r.credit, 0);
  const typeTone = { Asset: "outline", Liability: "warn", Equity: "accent", Revenue: "pos", Expense: "outline" };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: "var(--muted)" }}>As of <span style={{ color: "var(--fg-2)", fontWeight: 500 }}>Apr 30, 2025</span> · USD</div>
        <div style={{ display: "flex", gap: 8 }}>
          <DatePill />
          <Button variant="solid" size="sm" icon="download">Export</Button>
        </div>
      </div>

      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "90px 1.8fr 130px 150px 150px",
          gap: 14, padding: "10px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div>Code</div>
          <div>Account</div>
          <div>Type</div>
          <div style={{ textAlign: "right" }}>Debit</div>
          <div style={{ textAlign: "right" }}>Credit</div>
        </div>
        {TB_ROWS.map((r, i) => (
          <div key={r.code} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "90px 1.8fr 130px 150px 150px",
            gap: 14, alignItems: "center", padding: "13px 22px",
            borderBottom: i < TB_ROWS.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div className="num" style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.code}</div>
            <div style={{ fontSize: 13 }}>{r.account}</div>
            <div><Pill tone={typeTone[r.type] || "outline"}>{r.type}</Pill></div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", color: r.debit ? "var(--fg)" : "var(--muted-3)" }}>{r.debit ? "$" + fmtMoney(r.debit) : "—"}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", color: r.credit ? "var(--fg)" : "var(--muted-3)" }}>{r.credit ? "$" + fmtMoney(r.credit) : "—"}</div>
          </div>
        ))}
        <div style={{
          display: "grid", gridTemplateColumns: "90px 1.8fr 130px 150px 150px",
          gap: 14, padding: "16px 22px", background: "var(--surface)",
          borderTop: "1px solid var(--border)",
        }}>
          <div></div>
          <div style={{ fontSize: 12, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4 }}>Totals</div>
          <div></div>
          <div className="num" style={{ fontSize: 14, textAlign: "right", fontWeight: 600 }}>${fmtMoney(debitTotal)}</div>
          <div className="num" style={{ fontSize: 14, textAlign: "right", fontWeight: 600 }}>${fmtMoney(creditTotal)}</div>
        </div>
      </Card>
    </>
  );
}

// ───── Balance Sheet ─────
const BS_SECTIONS = [
  { title: "Assets", total: 13985221, rows: [
    { name: "Operating — Mercury",       amt: 1284650 },
    { name: "Capital Reserve — Mercury", amt: 3935000 },
    { name: "Distribution Flow-Thru",    amt: 142500 },
    { name: "Tax Escrow — Mercury",      amt: 285400 },
    { name: "Investments — at FMV",      amt: 8337671 },
  ]},
  { title: "Liabilities", total: 221540, rows: [
    { name: "Accrued Mgmt Fees Payable", amt: 35840 },
    { name: "Withholding Liability",     amt: 28700 },
    { name: "Accrued Expenses",          amt: 157000 },
  ]},
  { title: "Equity", total: 13763681, rows: [
    { name: "Contributed Capital — LP",  amt: 11400000 },
    { name: "Contributed Capital — GP",  amt: 1245000 },
    { name: "Retained Earnings",         amt: 1118681 },
  ]},
];

function BalanceSheetPage() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: "var(--muted)" }}>As of <span style={{ color: "var(--fg-2)", fontWeight: 500 }}>Apr 30, 2025</span> · USD · Accrual basis</div>
        <div style={{ display: "flex", gap: 8 }}>
          <DatePill />
          <SegSwitch options={[{ id: "summary", label: "Summary" }, { id: "detail", label: "Detail" }]} value="summary" onChange={() => {}} />
          <Button variant="solid" size="sm" icon="download">Export</Button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {BS_SECTIONS.slice(0, 2).map(sec => <BSCard key={sec.title} sec={sec} />)}
        <div style={{ gridColumn: "1 / -1" }}><BSCard sec={BS_SECTIONS[2]} /></div>
        <Card padding={20} style={{ gridColumn: "1 / -1", background: "var(--surface)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 11, color: "var(--muted-2)", letterSpacing: 0.4, fontWeight: 500, textTransform: "uppercase", marginBottom: 4 }}>Liabilities + Equity</div>
              <div className="num" style={{ fontSize: 22, fontWeight: 500 }}>$13,985,221.00</div>
            </div>
            <Pill tone="pos">Balanced</Pill>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "var(--muted-2)", letterSpacing: 0.4, fontWeight: 500, textTransform: "uppercase", marginBottom: 4 }}>Total Assets</div>
              <div className="num" style={{ fontSize: 22, fontWeight: 500 }}>$13,985,221.00</div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}

function BSCard({ sec }) {
  return (
    <Card padding={0}>
      <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{sec.title}</div>
        <div className="num" style={{ fontSize: 13.5, fontWeight: 500 }}>${fmtMoney(sec.total)}.00</div>
      </div>
      {sec.rows.map((r, i) => (
        <div key={r.name} className="row-hover" style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          padding: "13px 22px",
          borderBottom: i < sec.rows.length-1 ? "1px solid var(--border)" : "none",
        }}>
          <div style={{ fontSize: 13, color: "var(--fg-2)" }}>{r.name}</div>
          <div className="num" style={{ fontSize: 13, color: "var(--fg)", fontWeight: 500 }}>${fmtMoney(r.amt)}.00</div>
        </div>
      ))}
    </Card>
  );
}

// ───── Chart of Accounts ─────
const COA_GROUPS = [
  { label: "1000 — Assets",       tone: "outline", rows: [
    { code: "1010", name: "Operating — Mercury",          sub: "Cash · Checking", active: true,  bal: 1284650 },
    { code: "1020", name: "Capital Reserve — Mercury",    sub: "Cash · Savings",  active: true,  bal: 3935000 },
    { code: "1030", name: "Distribution Flow-Thru",       sub: "Cash · Checking", active: true,  bal: 142500 },
    { code: "1040", name: "Tax Escrow — Mercury",         sub: "Cash · Savings",  active: true,  bal: 285400 },
    { code: "1200", name: "Investments — at FMV",         sub: "Long-term",       active: true,  bal: 8337671 },
    { code: "1300", name: "Capital Call Receivable — LP", sub: "Receivable",      active: true,  bal: 0 },
  ]},
  { label: "2000 — Liabilities",  tone: "warn", rows: [
    { code: "2010", name: "Accrued Mgmt Fees Payable",    sub: "Current",         active: true,  bal: 35840 },
    { code: "2020", name: "Withholding Liability",        sub: "Current",         active: true,  bal: 28700 },
    { code: "2030", name: "Accrued Expenses",             sub: "Current",         active: true,  bal: 157000 },
    { code: "2040", name: "Deferred Carry Liability",     sub: "Long-term",       active: false, bal: 0 },
  ]},
  { label: "3000 — Equity",       tone: "accent", rows: [
    { code: "3010", name: "Contributed Capital — LP",     sub: "Equity",          active: true,  bal: 11400000 },
    { code: "3020", name: "Contributed Capital — GP",     sub: "Equity",          active: true,  bal: 1245000 },
    { code: "3030", name: "Retained Earnings",            sub: "Equity",          active: true,  bal: 1118681 },
  ]},
  { label: "4000 — Revenue",      tone: "pos", rows: [
    { code: "4010", name: "Realized Gain on Investment",  sub: "Revenue",         active: true,  bal: 87250 },
    { code: "4020", name: "Interest Income",              sub: "Revenue",         active: true,  bal: 4216 },
    { code: "4030", name: "Dividend Income",              sub: "Revenue",         active: false, bal: 0 },
  ]},
  { label: "5000 — Expense",      tone: "outline", rows: [
    { code: "5010", name: "Management Fee Expense",       sub: "Operating",       active: true,  bal: 750000 },
    { code: "5020", name: "Bank Fees Expense",            sub: "Operating",       active: true,  bal: 1850 },
    { code: "5030", name: "Professional Services",        sub: "Operating",       active: true,  bal: 26200 },
    { code: "5040", name: "Travel & Entertainment",       sub: "Operating",       active: false, bal: 0 },
  ]},
];

function ChartOfAccountsPage() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 12.5, color: "var(--muted)" }}>5 categories · 84 accounts · Last edit 04/12/2025</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Button variant="solid" size="sm" icon="filter">Active only</Button>
          <Button variant="primary" size="sm" icon="plus">New account</Button>
        </div>
      </div>

      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "90px 1.6fr 1fr 110px 150px",
          gap: 14, padding: "10px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div>Code</div>
          <div>Name</div>
          <div>Subtype</div>
          <div>Status</div>
          <div style={{ textAlign: "right" }}>Balance</div>
        </div>
        {COA_GROUPS.map((g, gi) => (
          <div key={g.label}>
            <div style={{
              padding: "10px 22px", background: "var(--surface)",
              borderBottom: "1px solid var(--border)",
              fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <Icon name="chevronD" size={11} color="var(--muted-2)" />
              {g.label}
            </div>
            {g.rows.map((r, i) => (
              <div key={r.code} className="row-hover" style={{
                display: "grid", gridTemplateColumns: "90px 1.6fr 1fr 110px 150px",
                gap: 14, alignItems: "center", padding: "13px 22px",
                borderBottom: "1px solid var(--border)",
                opacity: r.active ? 1 : 0.55,
              }}>
                <div className="num" style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.code}</div>
                <div style={{ fontSize: 13 }}>{r.name}</div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.sub}</div>
                <div><Pill tone={r.active ? "pos" : "outline"}>{r.active ? "Active" : "Inactive"}</Pill></div>
                <div className="num" style={{ fontSize: 13, textAlign: "right", color: r.bal ? "var(--fg)" : "var(--muted-3)", fontWeight: 500 }}>
                  {r.bal ? "$" + fmtMoney(r.bal) + ".00" : "—"}
                </div>
              </div>
            ))}
          </div>
        ))}
      </Card>
    </>
  );
}

// ───── Journal Entries ─────
const JE_ROWS = [
  { id: "JE-2025-0147", date: "Apr 21, 2025", memo: "Distribution received — Meridian Growth II", amount: 142500, status: "Posted",   lines: 2, source: "AI Upload" },
  { id: "JE-2025-0146", date: "Apr 18, 2025", memo: "Capital call issued — Sigma Ventures IV #7", amount: 185000, status: "Posted",   lines: 2, source: "Manual" },
  { id: "JE-2025-0145", date: "Apr 15, 2025", memo: "Mgmt fee — Q1 2025 — Northwind",             amount: 12500,  status: "Posted",   lines: 2, source: "Recurring" },
  { id: "JE-2025-0144", date: "Apr 11, 2025", memo: "Tax withholding — Harbor RE V K-1",          amount: 4820,   status: "Posted",   lines: 2, source: "AI Upload" },
  { id: "JE-2025-0143", date: "Apr 08, 2025", memo: "Distribution received — Northwind Buyout III", amount: 87250, status: "Posted",  lines: 3, source: "AI Upload" },
  { id: "JE-2025-0142", date: "Apr 02, 2025", memo: "Bank fees — April",                          amount: 142.50, status: "Posted",   lines: 2, source: "Bank feed" },
  { id: "JE-2025-D003", date: "Apr 28, 2025", memo: "Carry accrual — Q2 estimate",                amount: 48200,  status: "Draft",    lines: 4, source: "Manual" },
  { id: "JE-2025-D002", date: "Apr 26, 2025", memo: "Reclass — Hexagon Series B",                 amount: 1875000,status: "Draft",    lines: 2, source: "Manual" },
  { id: "JE-2025-D001", date: "Apr 24, 2025", memo: "Adjust — accrued professional services",     amount: 8400,   status: "Review",   lines: 2, source: "Recurring" },
];

function JournalEntriesPage({ initialFilter } = {}) {
  const [filter, setFilter] = useStateSP(initialFilter || "all");
  const filtered = JE_ROWS.filter(r =>
    filter === "all" ? true :
    filter === "posted" ? r.status === "Posted" :
    filter === "drafts" ? r.status === "Draft" :
    r.status === "Review"
  );
  const tone = { Posted: "pos", Draft: "outline", Review: "warn" };
  return (
    <>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
        <SegSwitch
          options={[
            { id: "all",     label: "All" },
            { id: "posted",  label: "Posted" },
            { id: "drafts",  label: "Drafts" },
            { id: "review",  label: "Review" },
          ]}
          value={filter} onChange={setFilter}
        />
        <div style={{ display: "flex", gap: 8 }}>
          <DatePill />
          <Button variant="solid" size="sm" icon="download">Export</Button>
          <Button variant="primary" size="sm" icon="plus">New entry</Button>
        </div>
      </div>

      <Card padding={0}>
        <div style={{
          display: "grid", gridTemplateColumns: "150px 130px 1.8fr 70px 130px 140px 120px",
          gap: 14, padding: "10px 22px", borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div>Entry</div>
          <div>Date</div>
          <div>Memo</div>
          <div style={{ textAlign: "right" }}>Lines</div>
          <div style={{ textAlign: "right" }}>Amount</div>
          <div>Source</div>
          <div>Status</div>
        </div>
        {filtered.map((r, i) => (
          <div key={r.id} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "150px 130px 1.8fr 70px 130px 140px 120px",
            gap: 14, alignItems: "center", padding: "13px 22px",
            borderBottom: i < filtered.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div className="num" style={{ fontSize: 12.5, color: "var(--accent)", fontWeight: 500 }}>{r.id}</div>
            <div className="num" style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.date}</div>
            <div style={{ fontSize: 13 }}>{r.memo}</div>
            <div className="num" style={{ fontSize: 12.5, textAlign: "right", color: "var(--muted)" }}>{r.lines}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 500 }}>${fmtMoney(r.amount)}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.source}</div>
            <div><Pill tone={tone[r.status]}>{r.status}</Pill></div>
          </div>
        ))}
      </Card>
    </>
  );
}

Object.assign(window, {
  PortfolioHeader, InvestorHeader, AccountingHeader,
  SchedulePage, DealIRRPage, CompanyOverviewPage, PortfolioMetricsPage, EquitySchedulePage,
  CapitalStatementPage, PartnerRollForwardsPage, TransactionsPage, PNLPage, CommitmentHistoryPage,
  GeneralLedgerPage, TrialBalancePage, BalanceSheetPage, ChartOfAccountsPage, JournalEntriesPage,
  QRPreview,
});
