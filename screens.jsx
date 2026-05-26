// Zive — Screens (Mercury-inspired dark)
const { useState: useStateS, useEffect: useEffectS } = React;

// ────────────── Data ──────────────
const FUNDS = [
  { id: "sigma-iv", name: "Sigma Ventures IV", strategy: "Venture — Early Stage", vintage: 2022, commitment: 2500000, called: 1625000, nav: 2980450, dpi: 0.18, tvpi: 1.83, irr: 0.242, orb: 0, spark: [62,64,63,66,68,71,70,74,78,82,85,89] },
  { id: "meridian-ii", name: "Meridian Growth II", strategy: "Growth Equity", vintage: 2020, commitment: 1500000, called: 1500000, nav: 2145300, dpi: 0.42, tvpi: 1.72, irr: 0.187, orb: 1, spark: [50,52,55,54,58,62,66,64,68,72,74,78] },
  { id: "harbor-re", name: "Harbor Real Estate V", strategy: "Real Estate — Value-Add", vintage: 2021, commitment: 1000000, called: 820000, nav: 980250, dpi: 0.08, tvpi: 1.28, irr: 0.094, orb: 2, spark: [40,42,41,43,44,46,47,48,49,51,53,55] },
  { id: "northwind-pe", name: "Northwind Buyout III", strategy: "Buyout — Mid-Market", vintage: 2019, commitment: 2000000, called: 1920000, nav: 3148800, dpi: 0.38, tvpi: 1.94, irr: 0.214, orb: 3, spark: [45,48,52,55,59,63,66,70,74,78,83,88] },
  { id: "aster-credit", name: "Aster Credit Partners II", strategy: "Private Credit", vintage: 2023, commitment: 1200000, called: 540000, nav: 580400, dpi: 0.02, tvpi: 1.08, irr: 0.063, orb: 4, spark: [48,49,50,50,51,52,52,53,54,55,56,57] },
  { id: "kinetic-vc", name: "Kinetic Ventures III", strategy: "Venture — Growth", vintage: 2021, commitment: 1800000, called: 1260000, nav: 1890300, dpi: 0.12, tvpi: 1.61, irr: 0.168, orb: 5, spark: [55,58,60,62,64,67,68,70,72,74,77,80] },
];

const ACTIVITY = [
  { id: 1, date: "Apr 21", icon: "deposit", kind: "Distribution", from: "Meridian Growth II", amount: 142500, sign: 1, meta: "Cash + 12,400 shares" },
  { id: 2, date: "Apr 18", icon: "arrowUR", kind: "Capital call", from: "Sigma Ventures IV", amount: -185000, sign: -1, meta: "Call #7 • Due Apr 28" },
  { id: 3, date: "Apr 15", icon: "doc", kind: "Q1 Statement", from: "Northwind Buyout III", amount: 0, sign: 0, meta: "Posted" },
  { id: 4, date: "Apr 11", icon: "receipt", kind: "K-1 received", from: "Harbor Real Estate V", amount: 0, sign: 0, meta: "2025 tax year" },
  { id: 5, date: "Apr 8",  icon: "deposit", kind: "Distribution", from: "Northwind Buyout III", amount: 87250, sign: 1, meta: "Q1 income" },
  { id: 6, date: "Apr 4",  icon: "arrowUR", kind: "Capital call", from: "Aster Credit Partners II", amount: -60000, sign: -1, meta: "Call #3" },
  { id: 7, date: "Apr 2",  icon: "doc", kind: "Side letter executed", from: "Kinetic Ventures III", amount: 0, sign: 0, meta: "Amendment #2" },
];

const TASKS = [
  { id: 1, title: "Sign Sigma Ventures IV Capital Call #7", due: "Apr 28", fund: "Sigma Ventures IV", priority: "high" },
  { id: 2, title: "Review Q1 statement from Northwind Buyout III", due: "Apr 25", fund: "Northwind Buyout III", priority: "med" },
  { id: 3, title: "Upload 2025 K-1 to your tax folder", due: "Apr 30", fund: "Harbor Real Estate V", priority: "med" },
  { id: 4, title: "Approve recallable distribution election", due: "May 3", fund: "Meridian Growth II", priority: "low" },
  { id: 5, title: "Wire $60,000 for Aster Credit Call #3", due: "May 8", fund: "Aster Credit Partners II", priority: "low" },
];

const NAV_SERIES = [
  6.8, 7.1, 7.0, 7.3, 7.6, 7.9, 8.1, 8.0, 8.3, 8.7, 9.1, 9.4,
  9.3, 9.6, 10.0, 10.2, 10.6, 10.9, 11.2, 11.1, 11.5, 11.8, 12.1, 11.72,
];

const fmtMoney = (n, dec = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec });

const fmtMoneyDec = (n) => {
  const abs = Math.abs(n);
  const [w, d] = abs.toFixed(2).split(".");
  return [parseInt(w).toLocaleString("en-US"), d];
};

// ────────────── Investment firms ──────────────
const INVESTMENT_FIRMS = [
  { id: "eagle", name: "Eagle Ventures", icon: "🦅", color: "#1F1F1F", funds: 6, size: "$2.4B", netIrr: "22.24%", grossIrr: "27.15%", strategy: "Multi-stage venture", aum: 2400000000, mark: "+0.8%" },
  { id: "contra", name: "Contra Ventures", icon: "▲", color: "#0F0F12", funds: 12, size: "$3.2B", netIrr: "19.28%", grossIrr: "23.29%", strategy: "Growth equity", aum: 3200000000, mark: "+0.4%" },
  { id: "sprout", name: "VentureSprout", icon: "🌱", color: "#1A2E1A", funds: 6, size: "$2.4B", netIrr: "22.24%", grossIrr: "27.15%", strategy: "Seed & Series A", aum: 2400000000, mark: "+1.2%" },
  { id: "x", name: "X Ventures", icon: "✕", color: "#2A1F0A", funds: 6, size: "$2.4B", netIrr: "22.24%", grossIrr: "27.15%", strategy: "Late-stage growth", aum: 2400000000, mark: "−0.2%" },
];

// ────────────── Home (Advisor view) ──────────────
function HomeScreen({ onOpenFund, onAskAI, onOpenEntity }) {
  const [askVal, setAskVal] = useStateS("");
  const totalNAV = FUNDS.reduce((s, f) => s + f.nav, 0);
  const totalCommit = FUNDS.reduce((s, f) => s + f.commitment, 0);
  const totalCalled = FUNDS.reduce((s, f) => s + f.called, 0);
  const uncalled = totalCommit - totalCalled;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const suggestedAsks = [
    { icon: "sparkle", text: "What's my unfunded commitment for the next 12 months?" },
    { icon: "chart", text: "Summarize Northwind Buyout III Q1 performance" },
    { icon: "pie", text: "Show my exposure by sector across all funds" },
    { icon: "tx", text: "When is my next capital call due?" },
    { icon: "receipt", text: "Have I received all my 2025 K-1s?" },
  ];
  const _quickActionsLegacy = [
    { icon: "pie", label: "Funds", tone: "#7BB6FF" },
    { icon: "chart", label: "Metrics", tone: "#9FE89B" },
    { icon: "investor", label: "Users", tone: "#FFD56A" },
    { icon: "store", label: "Marketplace", tone: "#FF8FA3" },
    { icon: "tree", label: "Models", tone: "var(--accent-text)" },
  ];

  return (
    <div style={{ minHeight: "calc(100vh - 56px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 40px" }} className="fade-up">
      <div style={{ width: "100%", maxWidth: 920 }}>
      {/* Greeting */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: -0.6 }}>{greeting}, Morgan</h1>
        <div style={{ fontSize: 13, color: "var(--muted-2)", marginTop: 8 }}>Pick an entity to get started, or check today's activity below.</div>
      </div>

      {/* Your funds & entities */}
      <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="building" size={14} color="var(--muted)" />
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--muted)", letterSpacing: 0.1 }}>Your entities</h2>
          <span className="num" style={{
            fontSize: 11, padding: "1px 7px", borderRadius: 999,
            background: "var(--chip)", color: "var(--muted-2)",
          }}>3</span>
        </div>
        <Button variant="solid" size="sm" icon="plus">Add entity</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 36 }}>
        {[
          { id: "admin", name: "Admin Ventures / VCFO Admin", kind: "VCFO", role: "ADMIN", seed: 4, nav: 26200000, irr: "—", tag: "VCFO admin", tone: "accent", isVCFO: true },
          { id: "admin-iv", name: "Admin Ventures IV", kind: "FUND", role: "ADMIN", seed: 0, nav: 13763681, irr: "22.24%", tag: "Active fund", tone: "pos" },
          { id: "admin-v",  name: "Admin Ventures V",  kind: "FUND", role: "USER",  seed: 1, nav: 8240108,  irr: "18.60%", tag: "Investing", tone: "accent" },
        ].map(ent => (
          <div key={ent.id} onClick={() => onOpenEntity(ent.id)} className="row-hover" style={{
            background: "var(--surface)", borderRadius: 14,
            boxShadow: "inset 0 0 0 1px var(--border)",
            cursor: "pointer", padding: "18px 20px",
            display: "flex", flexDirection: "column", gap: 14,
            transition: "box-shadow 160ms ease",
          }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--border-strong), 0 4px 12px -4px rgba(24,24,27,0.10)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--border)"}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Orb seed={ent.seed} size={36} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14.5, fontWeight: 500 }}>{ent.name}</div>
                <div style={{ fontSize: 10.5, color: "var(--muted-2)", marginTop: 3, letterSpacing: 0.5, fontWeight: 500, textTransform: "uppercase" }}>{ent.kind} · {ent.role}</div>
              </div>
              <Pill tone={ent.tone}>{ent.tag}</Pill>
            </div>
            {ent.isVCFO ? (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 10.5, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500, marginBottom: 4 }}>Funds</div>
                  <div className="num" style={{ fontSize: 16, fontWeight: 500 }}>4</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500, marginBottom: 4 }}>AUM</div>
                  <div className="num" style={{ fontSize: 16, fontWeight: 500 }}>${fmtMoney(ent.nav)}</div>
                </div>
              </div>
            ) : ent.nav !== null && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontSize: 10.5, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500, marginBottom: 4 }}>NAV</div>
                  <div className="num" style={{ fontSize: 16, fontWeight: 500 }}>${fmtMoney(ent.nav)}</div>
                </div>
                <div>
                  <div style={{ fontSize: 10.5, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500, marginBottom: 4 }}>Net IRR</div>
                  <div className="num" style={{ fontSize: 16, fontWeight: 500, color: "var(--pos)" }}>{ent.irr}</div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Your activity quick strip */}
      <div style={{ marginBottom: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="bell" size={14} color="var(--muted)" />
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 500, color: "var(--muted)", letterSpacing: 0.1 }}>Today</h2>
        </div>
        <Button variant="text" size="sm" iconRight="chevronR">View all activity</Button>
      </div>

      <Card padding={0}>
        {ACTIVITY.slice(0, 4).map((a, i) => (
          <div key={a.id} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "60px 28px 1fr auto",
            alignItems: "center", gap: 12,
            padding: "13px 18px",
            borderBottom: i < 3 ? "1px solid var(--border)" : "none",
          }}>
            <span style={{ fontSize: 11.5, color: "var(--muted-2)" }} className="num">{a.date}</span>
            <div style={{
              width: 26, height: 26, borderRadius: 7,
              background: a.sign > 0 ? "var(--pos-tint)" : a.sign < 0 ? "var(--neg-tint)" : "var(--chip)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={a.icon} size={12} color={a.sign > 0 ? "var(--pos)" : a.sign < 0 ? "var(--neg)" : "var(--muted)"} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 450 }}>{a.kind} — {a.from}</div>
              <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 1 }}>{a.meta}</div>
            </div>
            {a.amount !== 0 ? (
              <span className="num" style={{ fontSize: 12.5, fontWeight: 500, color: a.sign > 0 ? "var(--pos)" : "var(--fg)" }}>
                {a.sign > 0 ? "+" : a.sign < 0 ? "−" : ""}${fmtMoney(Math.abs(a.amount))}
              </span>
            ) : <span style={{ fontSize: 11, color: "var(--muted-2)" }}>—</span>}
          </div>
        ))}
      </Card>
      </div>
    </div>
  );
}

const pillSrcBtn = {
  display: "inline-flex", alignItems: "center", gap: 5,
  height: 24, padding: "0 9px",
  background: "transparent", border: "1px solid var(--border)",
  borderRadius: 999, color: "var(--muted)",
  fontSize: 11, fontFamily: "inherit", cursor: "pointer", fontWeight: 500,
};

function FirmCard({ firm, onOpen }) {
  return (
    <div onClick={onOpen} className="row-hover" style={{
      background: "var(--surface)",
      borderRadius: 14,
      boxShadow: "inset 0 0 0 1px var(--border)",
      cursor: "pointer",
      transition: "box-shadow 160ms ease, transform 160ms ease",
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--border-strong), 0 4px 12px -4px rgba(24,24,27,0.10)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--border)"}
    >
      {/* Top: name row */}
      <div style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "16px 20px",
        borderBottom: "1px solid var(--border)",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: firm.color,
          boxShadow: "inset 0 0 0 1px var(--border)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, color: "#fff",
          flexShrink: 0,
        }}>{firm.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 14.5, fontWeight: 500, letterSpacing: -0.2 }}>{firm.name}</div>
          <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 2 }}>{firm.strategy}</div>
        </div>
        <Pill tone={firm.mark.startsWith("+") ? "pos" : "neg"}>{firm.mark} this month</Pill>
        <Icon name="chevronR" size={14} color="var(--muted-3)" />
      </div>

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", padding: "14px 20px" }}>
        {[
          { label: "Funds", value: firm.funds },
          { label: "Size", value: firm.size },
          { label: "Net IRR", value: firm.netIrr, tone: "pos" },
          { label: "Gross IRR", value: firm.grossIrr, tone: "pos" },
        ].map((s, i) => (
          <div key={s.label} style={{
            paddingLeft: i > 0 ? 18 : 0,
            borderLeft: i > 0 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ fontSize: 10.5, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
            <div className="num" style={{ fontSize: 17, fontWeight: 500, letterSpacing: -0.3, color: s.tone === "pos" ? "var(--pos)" : "var(--fg)" }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Legacy LP dashboard — kept as reference, no longer called
function HomeScreenLegacy({ onOpenFund, onAskAI }) {
  const totalNAV = FUNDS.reduce((s, f) => s + f.nav, 0);
  const totalCommit = FUNDS.reduce((s, f) => s + f.commitment, 0);
  const totalCalled = FUNDS.reduce((s, f) => s + f.called, 0);
  const uncalled = totalCommit - totalCalled;

  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }} className="fade-up">
      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: -0.6 }}>Welcome back, Morgan</h1>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
        <Button variant="primary" icon="send">Fund capital call</Button>
        <Button variant="ghost" icon="deposit">Log distribution</Button>
        <Button variant="ghost" icon="upload">Upload document</Button>
        <Button variant="ghost" icon="plus">Add investment</Button>
        <div style={{ flex: 1 }} />
        <Button variant="text" icon="settings" size="sm">Customize</Button>
      </div>

      {/* Hero: Portfolio + Accounts */}
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 16, marginBottom: 16 }}>
        <Card hero padding={0}>
          <div style={{ padding: "20px 24px 0" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>Portfolio NAV</span>
                  <Icon name="help" size={13} color="var(--muted-3)" />
                </div>
                <BigNum value={(totalNAV / 1).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2})} size={42} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                  <span style={{ fontSize: 12, color: "var(--muted-2)" }}>As of Apr 22, 2026</span>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    color: "var(--pos)", fontSize: 12, fontWeight: 500,
                  }}>
                    <Icon name="arrowUR" size={12} />+$412,840 <span style={{ color: "var(--muted-2)", fontWeight: 400 }}>this month</span>
                  </span>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                {["1M", "3M", "YTD", "1Y", "All"].map(r => (
                  <button key={r} style={{
                    padding: "4px 10px", fontSize: 12, fontWeight: 500,
                    color: r === "YTD" ? "var(--fg)" : "var(--muted-2)",
                    background: r === "YTD" ? "var(--chip-strong)" : "transparent",
                    borderRadius: 6,
                  }}>{r}</button>
                ))}
              </div>
            </div>
          </div>
          <div style={{ padding: "0 12px" }}>
            <AreaChart data={NAV_SERIES} h={200} highlightX={0.82} labels={["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"].slice(0,12)} />
          </div>
        </Card>

        <Card padding={0}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px 12px" }}>
            <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>Capital position</span>
            <Button variant="text" size="sm" icon="moreV" />
          </div>
          <div style={{ padding: "0 20px 16px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 11, color: "var(--muted-2)", marginBottom: 6 }}>Total committed</div>
            <BigNum value={fmtMoney(totalCommit) + ".00"} size={28} />
            <div style={{ display: "flex", gap: 12, marginTop: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--muted-2)" }}>Called</div>
                <div className="num" style={{ fontSize: 14, fontWeight: 500, marginTop: 2 }}>${fmtMoney(totalCalled)}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--muted-2)" }}>Uncalled</div>
                <div className="num" style={{ fontSize: 14, fontWeight: 500, marginTop: 2, color: "var(--accent-text)" }}>${fmtMoney(uncalled)}</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Progress segments={[
                { value: totalCalled, color: "var(--accent)" },
                { value: uncalled * 0.6, color: "var(--accent-ring-45)" },
              ]} max={totalCommit} height={5} />
            </div>
          </div>
          <div style={{ padding: "14px 20px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <span style={{ fontSize: 12, color: "var(--muted)" }}>Upcoming</span>
              <Pill tone="warn">2 capital calls</Pill>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { name: "Sigma Ventures IV", amt: 185000, date: "Apr 28", seed: 0 },
                { name: "Aster Credit II", amt: 60000, date: "May 8", seed: 4 },
              ].map(c => (
                <div key={c.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Orb seed={c.seed} size={24} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 500 }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted-2)" }}>Due {c.date}</div>
                  </div>
                  <div className="num" style={{ fontSize: 13, fontWeight: 500 }}>${fmtMoney(c.amt)}</div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
        {[
          { label: "TVPI", value: "1.72x", sub: "+0.08 vs. Q4", tone: "pos" },
          { label: "DPI",  value: "0.24x", sub: "$2.38M distributed", tone: "neutral" },
          { label: "Net IRR", value: "18.4%", sub: "+0.6 pts QoQ", tone: "pos" },
          { label: "Cash yield 12M", value: "4.2%", sub: "vs 3.8% benchmark", tone: "pos" },
        ].map(k => (
          <Card key={k.label} padding={16}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 500 }}>{k.label}</span>
              {k.tone === "pos" && <Icon name="arrowUR" size={12} color="var(--pos)" />}
            </div>
            <div className="num" style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.5 }}>{k.value}</div>
            <div style={{ fontSize: 11, color: k.tone === "pos" ? "var(--pos)" : "var(--muted-2)", marginTop: 4 }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      {/* Funds table */}
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 500 }}>Your funds</h2>
          <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 3 }}>{FUNDS.length} active • Last sync 2 min ago</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <Button variant="solid" size="sm" icon="filter">Filters</Button>
          <Button variant="solid" size="sm" icon="sort">Sort</Button>
          <Button variant="solid" size="sm" icon="download" />
        </div>
      </div>

      <Card padding={0} style={{ marginBottom: 28 }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1.2fr 40px",
          padding: "12px 20px",
          borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500,
          textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div>Fund</div>
          <div style={{ textAlign: "right" }}>Commitment</div>
          <div style={{ textAlign: "right" }}>NAV</div>
          <div style={{ textAlign: "right" }}>TVPI</div>
          <div style={{ textAlign: "right" }}>Net IRR</div>
          <div style={{ textAlign: "right" }}>12M Trend</div>
          <div />
        </div>
        {FUNDS.map(f => (
          <FundRow key={f.id} f={f} onClick={() => onOpenFund(f.id)} />
        ))}
      </Card>

      {/* Activity + Tasks */}
      <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 16 }}>
        <Card padding={0}>
          <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Recent activity</span>
            <Button variant="text" size="sm" iconRight="chevronR">View all</Button>
          </div>
          {ACTIVITY.slice(0, 5).map((a, i) => (
            <div key={a.id} className="row-hover" style={{
              display: "grid", gridTemplateColumns: "64px 32px 1fr auto",
              alignItems: "center", gap: 12,
              padding: "12px 20px",
              borderTop: i === 0 ? "1px solid var(--border)" : "none",
              borderBottom: i < 4 ? "1px solid var(--border)" : "none",
            }}>
              <span style={{ fontSize: 12, color: "var(--muted-2)" }} className="num">{a.date}</span>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: a.sign > 0 ? "var(--pos-tint)" : a.sign < 0 ? "var(--neg-tint)" : "var(--chip)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={a.icon} size={13} color={a.sign > 0 ? "var(--pos)" : a.sign < 0 ? "var(--neg)" : "var(--muted)"} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 450, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.kind} — {a.from}</div>
                <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>{a.meta}</div>
              </div>
              {a.amount !== 0 ? (
                <span className="num" style={{ fontSize: 13, fontWeight: 500, color: a.sign > 0 ? "var(--pos)" : "var(--fg)" }}>
                  {a.sign > 0 ? "+" : a.sign < 0 ? "−" : ""}${fmtMoney(Math.abs(a.amount))}
                </span>
              ) : <span style={{ fontSize: 12, color: "var(--muted-2)" }}>—</span>}
            </div>
          ))}
        </Card>

        <Card padding={0}>
          <div style={{ padding: "16px 20px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>Tasks</span>
              <Pill tone="accent">{TASKS.length}</Pill>
            </div>
            <Button variant="text" size="sm" iconRight="chevronR">All tasks</Button>
          </div>
          {TASKS.slice(0, 5).map((t, i) => (
            <TaskRow key={t.id} t={t} first={i === 0} last={i === 4} />
          ))}
        </Card>
      </div>

      {/* Ask Zive footer banner */}
      <div onClick={onAskAI} style={{
        marginTop: 28, padding: "16px 20px",
        background: "linear-gradient(135deg, var(--accent-ring-14), var(--accent-ring-06))",
        borderRadius: 16,
        boxShadow: "inset 0 0 0 1px var(--accent-ring-25)",
        display: "flex", alignItems: "center", gap: 14, cursor: "pointer",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 20px rgba(97,95,255,0.35)",
        }}>
          <ZMark size={36} radius={10} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
            Ask <ZMark size={14} radius={3} /><IveWordmark height={9} color="var(--fg)" /> about your portfolio
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>"What's my unfunded commitment next quarter?" or "Summarize Northwind Q1"</div>
        </div>
        <span className="num" style={{
          fontSize: 11, padding: "3px 6px",
          background: "var(--active-bg)", color: "var(--muted)",
          borderRadius: 4, fontFamily: "var(--font-mono)",
        }}>⌘K</span>
      </div>
    </div>
  );
}

function FundRow({ f, onClick }) {
  const [w, d] = fmtMoneyDec(f.nav);
  const pctCalled = f.called / f.commitment;
  return (
    <div onClick={onClick} className="row-hover" style={{
      display: "grid",
      gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1.2fr 40px",
      padding: "14px 20px",
      borderBottom: "1px solid var(--border)",
      alignItems: "center", cursor: "pointer",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
        <Orb seed={f.orb} size={32} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, letterSpacing: -0.1 }}>{f.name}</div>
          <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>{f.strategy} • Vintage {f.vintage}</div>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div className="num" style={{ fontSize: 13, fontWeight: 450 }}>${fmtMoney(f.commitment)}</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 5, marginTop: 4 }}>
          <div style={{ width: 52, height: 3, borderRadius: 999, background: "var(--surface-3)", overflow: "hidden" }}>
            <div style={{ width: `${pctCalled * 100}%`, height: "100%", background: "var(--accent)" }} />
          </div>
          <span style={{ fontSize: 10, color: "var(--muted-2)" }}>{Math.round(pctCalled * 100)}%</span>
        </div>
      </div>
      <div style={{ textAlign: "right" }} className="display-num">
        <span style={{ fontSize: 14, fontWeight: 450 }}>${w}<span className="cents">.{d}</span></span>
      </div>
      <div className="num" style={{ textAlign: "right", fontSize: 13, fontWeight: 450 }}>{f.tvpi.toFixed(2)}x</div>
      <div className="num" style={{ textAlign: "right", fontSize: 13, fontWeight: 450, color: f.irr >= 0.15 ? "var(--pos)" : "var(--fg)" }}>{(f.irr * 100).toFixed(1)}%</div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Sparkline data={f.spark} w={100} h={30} color={f.irr >= 0.15 ? "#4ADE80" : "#8E7CFF"} />
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Icon name="chevronR" size={14} color="var(--muted-3)" />
      </div>
    </div>
  );
}

function TaskRow({ t, first, last }) {
  const [done, setDone] = useState(false);
  const priColor = { high: "var(--neg)", med: "var(--warn)", low: "var(--muted-2)" }[t.priority];
  return (
    <div className="row-hover" style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "12px 20px",
      borderTop: first ? "1px solid var(--border)" : "none",
      borderBottom: !last ? "1px solid var(--border)" : "none",
    }}>
      <button onClick={() => setDone(!done)} style={{
        width: 18, height: 18, borderRadius: 5,
        boxShadow: `inset 0 0 0 1.5px ${done ? "var(--accent)" : "var(--border-bright)"}`,
        background: done ? "var(--accent)" : "transparent",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {done && <Icon name="check" size={11} color="#fff" strokeWidth={2.5} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 450,
          color: done ? "var(--muted-2)" : "var(--fg)",
          textDecoration: done ? "line-through" : "none",
        }}>{t.title}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
          <span style={{ width: 4, height: 4, borderRadius: 999, background: priColor }} />
          <span style={{ fontSize: 11, color: "var(--muted-2)" }}>{t.fund} • Due {t.due}</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { HomeScreen, FUNDS, ACTIVITY, TASKS, NAV_SERIES, fmtMoney, fmtMoneyDec });
