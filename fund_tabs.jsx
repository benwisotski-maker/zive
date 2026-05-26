// Zive — Fund detail screens (Mercury-inspired)

const INVESTMENTS = [
  { co: "Orbital Labs", sector: "Space tech", stage: "Series B", invested: 280000, nav: 612400, mult: 2.19, ownership: 0.028, orb: 0 },
  { co: "Synapse Health", sector: "Digital health", stage: "Series C", invested: 200000, nav: 338200, mult: 1.69, ownership: 0.016, orb: 1 },
  { co: "Lumen Grid", sector: "Climate", stage: "Series A", invested: 150000, nav: 295000, mult: 1.97, ownership: 0.044, orb: 2 },
  { co: "Kestrel AI", sector: "Developer tools", stage: "Seed", invested: 120000, nav: 540000, mult: 4.50, ownership: 0.06, orb: 3 },
  { co: "Meadow Finance", sector: "Fintech — SMB", stage: "Series A", invested: 175000, nav: 268750, mult: 1.54, ownership: 0.021, orb: 4 },
  { co: "Penumbra Robotics", sector: "Industrial robotics", stage: "Series B", invested: 225000, nav: 196200, mult: 0.87, ownership: 0.019, orb: 5 },
  { co: "Harbor Signals", sector: "Defense tech", stage: "Seed", invested: 100000, nav: 428000, mult: 4.28, ownership: 0.038, orb: 6 },
  { co: "Rivulet", sector: "Consumer", stage: "Series A", invested: 140000, nav: 89600, mult: 0.64, ownership: 0.015, orb: 7 },
];

const DOCUMENTS = [
  { name: "Q1 2026 Capital Account Statement", type: "Statement", date: "Apr 15, 2026", size: "1.2 MB" },
  { name: "2025 Schedule K-1", type: "Tax", date: "Mar 28, 2026", size: "412 KB" },
  { name: "Side Letter — Amendment 2", type: "Legal", date: "Mar 10, 2026", size: "328 KB" },
  { name: "Annual Report 2025", type: "Report", date: "Feb 20, 2026", size: "4.8 MB" },
  { name: "Capital Call Notice #7", type: "Notice", date: "Apr 18, 2026", size: "198 KB" },
  { name: "LP Agreement — Fully Executed", type: "Legal", date: "Nov 14, 2022", size: "2.1 MB" },
];

function FundDetail({ fundId, onBack }) {
  const [tab, setTab] = useState("overview");
  const f = FUNDS.find(x => x.id === fundId) || FUNDS[0];
  const [navW, navD] = fmtMoneyDec(f.nav);
  const pctCalled = f.called / f.commitment;

  return (
    <div style={{ padding: "24px 40px 48px", maxWidth: 1360, margin: "0 auto" }} className="fade-up">
      {/* Breadcrumbs */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)",
          padding: "4px 8px", borderRadius: 6,
        }} onMouseEnter={e => e.currentTarget.style.background = "var(--chip)"}
           onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
          <Icon name="chevronL" size={13} /> Home
        </button>
        <Icon name="chevronR" size={12} color="var(--muted-3)" />
        <span style={{ fontSize: 12, color: "var(--fg-2)" }}>Funds</span>
        <Icon name="chevronR" size={12} color="var(--muted-3)" />
        <span style={{ fontSize: 12, color: "var(--fg)" }}>{f.name}</span>
      </div>

      {/* Hero */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 28 }}>
        <Orb seed={f.orb} size={56} />
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <h1 style={{ margin: 0, fontSize: 24, fontWeight: 500, letterSpacing: -0.4 }}>{f.name}</h1>
            <Pill tone="outline">{f.strategy}</Pill>
            <Pill tone="neutral">Vintage {f.vintage}</Pill>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Closed-end • 10-year term • Managed by {f.name.split(" ")[0]} Capital</div>
        </div>
        <Button variant="solid" icon="bookmark">Saved</Button>
        <Button variant="solid" icon="upload">Upload</Button>
        <Button variant="primary" icon="send">Wire capital</Button>
      </div>

      {/* Stats bar */}
      <Card padding={0} style={{ marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)" }}>
          {[
            { label: "Current NAV", value: <span className="display-num">${navW}<span className="cents">.{navD}</span></span> },
            { label: "Commitment", value: `$${fmtMoney(f.commitment)}`, sub: `${Math.round(pctCalled*100)}% called` },
            { label: "TVPI", value: `${f.tvpi.toFixed(2)}x`, sub: "+0.11 vs Q4" },
            { label: "DPI", value: `${f.dpi.toFixed(2)}x`, sub: `$${fmtMoney(f.commitment * f.dpi)} distributed` },
            { label: "Net IRR", value: `${(f.irr * 100).toFixed(1)}%`, sub: "Since inception" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "18px 22px",
              borderRight: i < 4 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{ fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 500, marginBottom: 8 }}>{s.label}</div>
              <div className="num" style={{ fontSize: 20, fontWeight: 500, letterSpacing: -0.4 }}>{s.value}</div>
              {s.sub && <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 4 }}>{s.sub}</div>}
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: "1px solid var(--border)" }}>
        {[
          { id: "overview", label: "Dashboard" },
          { id: "investments", label: "Investments", count: INVESTMENTS.length },
          { id: "statements", label: "Statements" },
          { id: "documents", label: "Documents", count: DOCUMENTS.length },
          { id: "tasks", label: "Tasks", count: 2 },
          { id: "wire", label: "Wire instructions" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            display: "inline-flex", alignItems: "center", gap: 7,
            padding: "10px 14px", fontSize: 13, fontWeight: 450,
            color: tab === t.id ? "var(--fg)" : "var(--muted)",
            borderBottom: `1.5px solid ${tab === t.id ? "var(--fg)" : "transparent"}`,
            marginBottom: -1,
          }}>
            {t.label}
            {t.count != null && (
              <span className="num" style={{
                fontSize: 10, padding: "1px 6px", borderRadius: 4,
                background: "var(--chip)", color: "var(--muted)",
              }}>{t.count}</span>
            )}
          </button>
        ))}
      </div>

      {tab === "overview" && <FundKeyMetrics f={f} />}
      {tab === "investments" && <FundInvestments />}
      {tab === "statements" && <FundStatements />}
      {tab === "documents" && <FundDocuments />}
      {tab === "tasks" && <FundTasks />}
      {tab === "wire" && <FundWire f={f} />}
    </div>
  );
}

const KM_COLS = [
  { key: "p1_cons", label: "04/22/2026 — Consolidated", short: "04/22/2026" },
  { key: "p1_gp", label: "04/22/2026 — GP", short: "GP" },
  { key: "p1_lp", label: "04/22/2026 — LP", short: "LP" },
  { key: "p0_cons", label: "03/31/2026 — Consolidated", short: "03/31/2026" },
  { key: "p0_gp", label: "03/31/2026 — GP", short: "GP" },
  { key: "p0_lp", label: "03/31/2026 — LP", short: "LP" },
];

function FundKeyMetrics({ f }) {
  const [colState, setColState] = useState({
    order: KM_COLS.map(c => c.key),
    visible: Object.fromEntries(KM_COLS.map(c => [c.key, true])),
  });
  // Build two reporting period columns, each split into Consolidated / GP / LP
  const commitment = f.commitment;
  const called = f.called;
  const nav = f.nav;
  const paidIn = called;
  const pctCalled = called / commitment;
  const uncalled = commitment - called;
  const totalValue = nav + commitment * f.dpi;
  const gpShare = 0.015; // 1.5% GP interest
  const lpShare = 1 - gpShare;

  const col = (mult = 1) => ({
    committed: commitment * mult,
    gpCommit: commitment * mult * gpShare,
    lpCommit: commitment * mult * lpShare,
    paidIn: paidIn * mult,
    gpPaid: paidIn * mult * gpShare,
    lpPaid: paidIn * mult * lpShare,
    uncalled: uncalled * mult,
    gpUncalled: uncalled * mult * gpShare,
    lpUncalled: uncalled * mult * lpShare,
    nav: nav * mult,
    gpNav: nav * mult * gpShare,
    lpNav: nav * mult * lpShare,
    totalValue: totalValue * mult,
    gpTv: totalValue * mult * gpShare,
    lpTv: totalValue * mult * lpShare,
  });

  const p1 = col(1.0);
  const p0 = col(0.992);

  const fm = (n, d = 2) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmPct = (n) => (n * 100).toFixed(0) + "%";
  const fmX = (n) => n.toFixed(2) + "x";

  const rows = [
    { label: "Committed Capital", vals: { p1_cons: fm(p1.committed), p1_gp: fm(p1.gpCommit), p1_lp: fm(p1.lpCommit), p0_cons: fm(p0.committed), p0_gp: fm(p0.gpCommit), p0_lp: fm(p0.lpCommit) } },
    { label: "Paid-in Capital", vals: { p1_cons: fm(p1.paidIn), p1_gp: fm(p1.gpPaid), p1_lp: fm(p1.lpPaid), p0_cons: fm(p0.paidIn), p0_gp: fm(p0.gpPaid), p0_lp: fm(p0.lpPaid) } },
    { label: "% Commitment Called", vals: { p1_cons: fmPct(pctCalled), p1_gp: fmPct(pctCalled), p1_lp: fmPct(pctCalled), p0_cons: fmPct(pctCalled*0.99), p0_gp: fmPct(pctCalled*0.99), p0_lp: fmPct(pctCalled*0.99) } },
    { label: "Uncalled Capital", vals: { p1_cons: fm(p1.uncalled), p1_gp: fm(p1.gpUncalled), p1_lp: fm(p1.lpUncalled), p0_cons: fm(p0.uncalled), p0_gp: fm(p0.gpUncalled), p0_lp: fm(p0.lpUncalled) } },
    { label: "Cash Distributions", vals: { p1_cons: "—", p1_gp: "—", p1_lp: "—", p0_cons: "—", p0_gp: "—", p0_lp: "—" }, muted: true },
    { label: "Stock Distributions", vals: { p1_cons: "—", p1_gp: "—", p1_lp: "—", p0_cons: "—", p0_gp: "—", p0_lp: "—" }, muted: true },
    { label: "Cumulative Distributions", vals: { p1_cons: "—", p1_gp: "—", p1_lp: "—", p0_cons: "—", p0_gp: "—", p0_lp: "—" }, muted: true },
    { label: "Net Asset Value", vals: { p1_cons: fm(p1.nav), p1_gp: fm(p1.gpNav), p1_lp: fm(p1.lpNav), p0_cons: fm(p0.nav), p0_gp: fm(p0.gpNav), p0_lp: fm(p0.lpNav) } },
    { label: "Total Value", vals: { p1_cons: fm(p1.totalValue), p1_gp: fm(p1.gpTv), p1_lp: fm(p1.lpTv), p0_cons: fm(p0.totalValue), p0_gp: fm(p0.gpTv), p0_lp: fm(p0.lpTv) } },
    { label: "Distributions / Paid-in Capital (DPI)", vals: { p1_cons: fmX(f.dpi), p1_gp: fmX(f.dpi*1.1), p1_lp: fmX(f.dpi), p0_cons: fmX(f.dpi*0.99), p0_gp: fmX(f.dpi*1.08), p0_lp: fmX(f.dpi*0.98) } },
    { label: "Total Value / Paid-in Capital (TVPI)", vals: { p1_cons: fmX(f.tvpi), p1_gp: fmX(f.tvpi*1.07), p1_lp: fmX(f.tvpi), p0_cons: fmX(f.tvpi*0.99), p0_gp: fmX(f.tvpi*1.06), p0_lp: fmX(f.tvpi*0.98) } },
    { label: "Net Daily IRR", vals: { p1_cons: "1.24%", p1_gp: "4.01%", p1_lp: "1.2%", p0_cons: "1.27%", p0_gp: "4.08%", p0_lp: "1.22%" } },
    { label: "Net Monthly IRR", vals: { p1_cons: "1.26%", p1_gp: "4.07%", p1_lp: "1.22%", p0_cons: "1.29%", p0_gp: "4.16%", p0_lp: "1.25%" } },
    { label: "Net Quarterly IRR", vals: { p1_cons: "1.26%", p1_gp: "4.05%", p1_lp: "1.21%", p0_cons: "1.35%", p0_gp: "4.35%", p0_lp: "1.3%" } },
  ];

  const portfolioRows = [
    { label: "Current Portfolio:", header: true },
    { label: "Fair Value", vals: { p1_cons: fm(nav*0.48), p0_cons: fm(nav*0.48) } },
    { label: "Cost", vals: { p1_cons: fm(paidIn*0.32), p0_cons: fm(paidIn*0.32) } },
    { label: "MOIC (Fair Value/Cost)", vals: { p1_cons: fmX(1.49), p0_cons: fmX(1.49) } },
    { label: "Gross Daily IRR", vals: { p1_cons: "0.00%", p0_cons: "0.00%" } },
    { label: "Gross Monthly IRR", vals: { p1_cons: "0.00%", p0_cons: "0.00%" } },
    { label: "Gross Quarterly IRR", vals: { p1_cons: "0.00%", p0_cons: "0.00%" } },
    { label: "Active Investments (Portcos)", vals: { p1_cons: "7", p0_cons: "7" } },
    { label: "Exited Investments (Portcos)", vals: {} },
    { label: "Total Investments (Portcos)", vals: { p1_cons: "7", p0_cons: "7" } },
  ];

  return (
    <div>
      {/* Key Metrics title bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="menu" size={18} color="var(--muted)" />
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>Key Metrics</h2>
        </div>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          height: 32, padding: "0 14px",
          background: "var(--surface-2)",
          border: "1px solid var(--border-strong)",
          borderRadius: 8, color: "var(--fg-2)",
          fontSize: 12.5, fontFamily: "inherit", cursor: "pointer",
        }}>
          <Icon name="quarterly" size={13} color="var(--muted)" />
          04/22/2026
          <Icon name="chevronD" size={11} color="var(--muted-2)" />
        </button>
      </div>

      {/* Key Metrics table */}
      <Card padding={0} style={{ marginBottom: 24 }}>
        <KMHeader title="Key Metrics" icon="chart" colState={colState} setColState={setColState} />
        <KMTable rows={rows} colState={colState} />
      </Card>

      {/* Current Portfolio */}
      <Card padding={0}>
        <KMHeader title="Current Portfolio" icon="pie" colState={colState} setColState={setColState} />
        <KMTable rows={portfolioRows} colState={colState} />
      </Card>
    </div>
  );
}

function KMHeader({ title, icon, colState, setColState }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "12px 22px", borderBottom: "1px solid var(--border)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <Icon name={icon} size={13} color="var(--muted-2)" />
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>{title}</div>
      </div>
      {colState && setColState && (
        <div style={{ display: "flex", gap: 6 }}>
          <ColumnsMenu
            columns={KM_COLS}
            order={colState.order}
            visible={colState.visible}
            onChange={(next) => setColState(s => ({ ...s, ...next }))}
          />
        </div>
      )}
    </div>
  );
}

const kmBtnStyle = {
  display: "inline-flex", alignItems: "center", gap: 6,
  height: 26, padding: "0 10px",
  background: "var(--surface-2)",
  border: "1px solid var(--border-strong)",
  borderRadius: 6, color: "var(--fg-2)",
  fontSize: 11.5, fontFamily: "inherit", cursor: "pointer",
};

function KMTable({ rows, colState }) {
  const blue = "var(--accent-text)";
  const [sort, setSort] = useState({ key: null, dir: null });
  const visKeys = colState
    ? colState.order.filter(k => colState.visible[k])
    : KM_COLS.map(c => c.key);
  const colMap = Object.fromEntries(KM_COLS.map(c => [c.key, c]));
  const cols = "minmax(280px, 2fr) " + visKeys.map(() => "140px").join(" ");

  // Group visible keys by reporting period for the date header row
  const periodGroups = [];
  let currentPeriod = null;
  visKeys.forEach(k => {
    const period = k.split("_")[0];
    if (period !== currentPeriod) {
      periodGroups.push({ period, keys: [k] });
      currentPeriod = period;
    } else {
      periodGroups[periodGroups.length - 1].keys.push(k);
    }
  });
  const periodLabel = { p1: "04/22/2026", p0: "03/31/2026" };
  const subLabel = { cons: "Consolidated", gp: "GP", lp: "LP" };

  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: 280 + visKeys.length * 140 + 44 }}>
        {/* Date header row — spans across each period's visible columns */}
        <div style={{
          display: "grid", gridTemplateColumns: cols,
          padding: "8px 22px 4px",
          background: "var(--surface-2)",
        }}>
          <div />
          {periodGroups.map((g, gi) => (
            <div key={gi} style={{
              gridColumn: `span ${g.keys.length}`,
              fontSize: 11.5, color: "var(--fg-2)", fontWeight: 500,
              textAlign: "right", paddingRight: 4,
            }}>
              {periodLabel[g.period]}
            </div>
          ))}
        </div>
        {/* Sub-label row (Cons/GP/LP) */}
        <div style={{
          display: "grid", gridTemplateColumns: cols,
          padding: "2px 22px 8px",
          background: "var(--surface-2)",
          borderBottom: "1px solid var(--border)",
        }}>
          <SortHeader
            dir={sort.key === "__label" ? sort.dir : null}
            onClick={() => setSort(s => cycleSort(s, "__label"))}
            style={{ fontSize: 10.5, color: "var(--muted-2)", fontWeight: 500 }}
          >
            Metric
          </SortHeader>
          {visKeys.map(k => {
            const sub = k.split("_")[1];
            return (
              <SortHeader
                key={k}
                align="right"
                dir={sort.key === k ? sort.dir : null}
                onClick={() => setSort(s => cycleSort(s, k))}
                style={{
                  fontSize: 10.5, color: "var(--muted-2)", fontWeight: 500,
                  textTransform: sub === "cons" ? "none" : "uppercase",
                  letterSpacing: sub === "cons" ? 0 : 0.4,
                }}
              >
                {subLabel[sub]}
              </SortHeader>
            );
          })}
        </div>

        {sortRows(rows, sort, (row, key) => key === "__label" ? row.label : (row.vals && row.vals[key])).map((r, i, arr) => (
          <div key={i} style={{
            display: "grid", gridTemplateColumns: cols, alignItems: "center",
            padding: "11px 22px",
            borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            background: r.header ? "var(--surface-2)" : "transparent",
          }}>
            <div style={{
              fontSize: 12.5,
              color: r.header ? "var(--fg)" : "var(--fg-2)",
              fontWeight: r.header ? 500 : 400,
            }}>{r.label}</div>
            {visKeys.map(k => {
              const v = r.vals && r.vals[k] != null ? r.vals[k] : "";
              return (
                <div key={k} className="num" style={{
                  fontSize: 12.5, textAlign: "right",
                  color: r.muted ? "var(--muted-3)" : v && v !== "—" ? blue : "var(--muted-3)",
                  fontFamily: "var(--font-mono)",
                }}>{v}</div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

const kmDateHead = { fontSize: 11.5, color: "var(--fg-2)", fontWeight: 500, textAlign: "right" };
const kmSubHead = { fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textAlign: "right" };

function FundOverview({ f }) {
  const strategy = [
    { label: "Software", value: 42, color: "#8E7CFF" },
    { label: "Health", value: 22, color: "#6AE1FF" },
    { label: "Climate", value: 18, color: "#8BDE9A" },
    { label: "Fintech", value: 12, color: "#FFD56A" },
    { label: "Other", value: 6, color: "#6E6E76" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
      <Card padding={0}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px 4px" }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>NAV growth</div>
            <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>Quarterly — inception to date</div>
          </div>
          <Pill tone="pos" icon="arrowUR">+24.2% YoY</Pill>
        </div>
        <div style={{ padding: "0 12px" }}>
          <AreaChart data={f.spark.concat(f.spark.map(x => x * 1.05))} h={200} highlightX={0.9}
            labels={["'22","'23","'24","'25","Q1'26"]} />
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 18 }}>Exposure by sector</div>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Donut segments={strategy} size={120} thickness={16} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
            {strategy.map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
                <span style={{ flex: 1, fontSize: 12, color: "var(--fg-2)" }}>{s.label}</span>
                <span className="num" style={{ fontSize: 12, color: "var(--muted)" }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card style={{ gridColumn: "1 / -1" }} padding={0}>
        <div style={{ padding: "16px 22px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Recent activity — {f.name}</div>
          <Button variant="text" size="sm" iconRight="chevronR">View all</Button>
        </div>
        {ACTIVITY.filter(a => a.from === f.name || true).slice(0, 4).map((a, i) => (
          <div key={a.id} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "64px 32px 1fr auto 120px",
            alignItems: "center", gap: 12,
            padding: "12px 22px",
            borderTop: "1px solid var(--border)",
          }}>
            <span className="num" style={{ fontSize: 12, color: "var(--muted-2)" }}>{a.date}</span>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: a.sign > 0 ? "var(--pos-tint)" : a.sign < 0 ? "var(--neg-tint)" : "var(--chip)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={a.icon} size={13} color={a.sign > 0 ? "var(--pos)" : a.sign < 0 ? "var(--neg)" : "var(--muted)"} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 450 }}>{a.kind}</div>
              <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>{a.meta}</div>
            </div>
            {a.amount !== 0 ? (
              <span className="num" style={{ fontSize: 13, fontWeight: 500, color: a.sign > 0 ? "var(--pos)" : "var(--fg)" }}>
                {a.sign > 0 ? "+" : a.sign < 0 ? "−" : ""}${fmtMoney(Math.abs(a.amount))}
              </span>
            ) : <span style={{ fontSize: 12, color: "var(--muted-2)" }}>—</span>}
            <span style={{ fontSize: 11, color: "var(--muted-2)", textAlign: "right" }}>{a.meta.includes("Due") ? a.meta : ""}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function FundInvestments() {
  const totalInv = INVESTMENTS.reduce((s, i) => s + i.invested, 0);
  const totalNav = INVESTMENTS.reduce((s, i) => s + i.nav, 0);
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
        {[
          { label: "Portfolio companies", value: INVESTMENTS.length },
          { label: "Invested capital", value: `$${fmtMoney(totalInv)}` },
          { label: "Current value", value: `$${fmtMoney(totalNav)}`, tone: "pos" },
          { label: "Gross multiple", value: `${(totalNav / totalInv).toFixed(2)}x`, tone: "pos" },
        ].map(k => (
          <Card key={k.label} padding={16}>
            <div style={{ fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 500, marginBottom: 8 }}>{k.label}</div>
            <div className="num" style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.4, color: k.tone === "pos" ? "var(--pos)" : "var(--fg)" }}>{k.value}</div>
          </Card>
        ))}
      </div>

      <Card padding={0}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 40px",
          padding: "12px 22px",
          borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", fontWeight: 500,
          textTransform: "uppercase", letterSpacing: 0.4,
        }}>
          <div>Company</div>
          <div>Stage</div>
          <div style={{ textAlign: "right" }}>Invested</div>
          <div style={{ textAlign: "right" }}>Current value</div>
          <div style={{ textAlign: "right" }}>Multiple</div>
          <div style={{ textAlign: "right" }}>Ownership</div>
          <div />
        </div>
        {INVESTMENTS.map(i => {
          const [w, d] = fmtMoneyDec(i.nav);
          const delta = i.nav / i.invested;
          return (
            <div key={i.co} className="row-hover" style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr 1fr 40px",
              padding: "14px 22px",
              borderBottom: "1px solid var(--border)",
              alignItems: "center",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Orb seed={i.orb} size={30} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 500 }}>{i.co}</div>
                  <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>{i.sector}</div>
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{i.stage}</div>
              <div className="num" style={{ textAlign: "right", fontSize: 13 }}>${fmtMoney(i.invested)}</div>
              <div className="display-num" style={{ textAlign: "right", fontSize: 14 }}>${w}<span className="cents">.{d}</span></div>
              <div className="num" style={{ textAlign: "right", fontSize: 13, color: delta >= 1 ? "var(--pos)" : "var(--neg)", fontWeight: 500 }}>{i.mult.toFixed(2)}x</div>
              <div className="num" style={{ textAlign: "right", fontSize: 13, color: "var(--muted)" }}>{(i.ownership * 100).toFixed(2)}%</div>
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Icon name="chevronR" size={14} color="var(--muted-3)" />
              </div>
            </div>
          );
        })}
      </Card>
    </>
  );
}

function FundStatements() {
  const statements = [
    { period: "Q1 2026", asOf: "Mar 31, 2026", nav: 2980450, change: 0.087, contributions: 125000, distributions: 0, status: "Posted" },
    { period: "Q4 2025", asOf: "Dec 31, 2025", nav: 2742150, change: 0.042, contributions: 180000, distributions: 0, status: "Posted" },
    { period: "Q3 2025", asOf: "Sep 30, 2025", nav: 2630800, change: 0.065, contributions: 225000, distributions: 42000, status: "Posted" },
    { period: "Q2 2025", asOf: "Jun 30, 2025", nav: 2469600, change: 0.031, contributions: 0, distributions: 0, status: "Posted" },
    { period: "Q1 2025", asOf: "Mar 31, 2025", nav: 2395200, change: 0.054, contributions: 150000, distributions: 18000, status: "Posted" },
  ];
  return (
    <Card padding={0}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.2fr 1fr 1fr 1fr 100px",
        padding: "12px 22px",
        borderBottom: "1px solid var(--border)",
        fontSize: 11, color: "var(--muted-2)", fontWeight: 500,
        textTransform: "uppercase", letterSpacing: 0.4,
      }}>
        <div>Period</div>
        <div>As of</div>
        <div style={{ textAlign: "right" }}>Ending NAV</div>
        <div style={{ textAlign: "right" }}>Contributions</div>
        <div style={{ textAlign: "right" }}>Distributions</div>
        <div />
      </div>
      {statements.map((s, i) => {
        const [w, d] = fmtMoneyDec(s.nav);
        return (
          <div key={i} className="row-hover" style={{
            display: "grid",
            gridTemplateColumns: "1fr 1.2fr 1fr 1fr 1fr 100px",
            padding: "14px 22px",
            borderBottom: "1px solid var(--border)",
            alignItems: "center",
          }}>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{s.period}</div>
              <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>{s.status}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{s.asOf}</div>
            <div style={{ textAlign: "right" }}>
              <div className="display-num" style={{ fontSize: 14 }}>${w}<span className="cents">.{d}</span></div>
              <div className="num" style={{ fontSize: 11, color: s.change >= 0 ? "var(--pos)" : "var(--neg)", marginTop: 2 }}>
                {s.change >= 0 ? "+" : ""}{(s.change * 100).toFixed(1)}%
              </div>
            </div>
            <div className="num" style={{ textAlign: "right", fontSize: 13, color: s.contributions ? "var(--fg)" : "var(--muted-2)" }}>
              {s.contributions ? `$${fmtMoney(s.contributions)}` : "—"}
            </div>
            <div className="num" style={{ textAlign: "right", fontSize: 13, color: s.distributions ? "var(--pos)" : "var(--muted-2)" }}>
              {s.distributions ? `+$${fmtMoney(s.distributions)}` : "—"}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
              <Button variant="solid" size="sm" icon="download" />
              <Button variant="text" size="sm" icon="external" />
            </div>
          </div>
        );
      })}
    </Card>
  );
}

function FundDocuments() {
  const [q, setQ] = useState("");
  const filters = ["All", "Statement", "Tax", "Legal", "Notice", "Report"];
  const [active, setActive] = useState("All");
  const rows = DOCUMENTS.filter(d => active === "All" || d.type === active).filter(d => d.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "0 12px", height: 32, flex: 1, maxWidth: 360,
          background: "var(--surface)", borderRadius: 8,
          boxShadow: "inset 0 0 0 1px var(--border-strong)",
        }}>
          <Icon name="search" size={14} color="var(--muted-2)" />
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search documents…"
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 13, color: "var(--fg)" }}/>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {filters.map(f => (
            <Button key={f} variant="pill" size="sm" active={active === f} onClick={() => setActive(f)}>{f}</Button>
          ))}
        </div>
        <div style={{ flex: 1 }} />
        <Button variant="solid" size="sm" icon="upload">Upload</Button>
      </div>

      <Card padding={0}>
        {rows.map((d, i) => (
          <div key={i} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "32px 2fr 1fr 120px 100px 80px",
            padding: "14px 22px", alignItems: "center", gap: 12,
            borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "var(--surface-2)",
              boxShadow: "inset 0 0 0 1px var(--border)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="doc" size={14} color="var(--muted)" />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{d.name}</div>
              <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>PDF • {d.size}</div>
            </div>
            <div><Pill tone="outline">{d.type}</Pill></div>
            <div style={{ fontSize: 12, color: "var(--muted)" }} className="num">{d.date}</div>
            <div style={{ fontSize: 11, color: "var(--muted-2)" }}>Morgan Chen</div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 4 }}>
              <Button variant="text" size="sm" icon="download" />
              <Button variant="text" size="sm" icon="more" />
            </div>
          </div>
        ))}
      </Card>
    </>
  );
}

function FundTasks() {
  return (
    <Card padding={0}>
      {TASKS.slice(0, 4).map((t, i) => (
        <TaskRowBig key={t.id} t={t} first={i === 0} last={i === 3} />
      ))}
    </Card>
  );
}

function TaskRowBig({ t, first, last }) {
  const [done, setDone] = useState(false);
  const priColor = { high: "var(--neg)", med: "var(--warn)", low: "var(--muted-2)" }[t.priority];
  const priLabel = { high: "High", med: "Medium", low: "Low" }[t.priority];
  return (
    <div className="row-hover" style={{
      display: "grid", gridTemplateColumns: "24px 1fr 120px 90px 30px", alignItems: "center", gap: 14,
      padding: "16px 22px",
      borderTop: first ? "1px solid var(--border)" : "none",
      borderBottom: !last ? "1px solid var(--border)" : "none",
    }}>
      <button onClick={() => setDone(!done)} style={{
        width: 20, height: 20, borderRadius: 6,
        boxShadow: `inset 0 0 0 1.5px ${done ? "var(--accent)" : "var(--border-bright)"}`,
        background: done ? "var(--accent)" : "transparent",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        {done && <Icon name="check" size={12} color="#fff" strokeWidth={2.5} />}
      </button>
      <div>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: done ? "var(--muted-2)" : "var(--fg)", textDecoration: done ? "line-through" : "none" }}>{t.title}</div>
        <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 3 }}>Assigned to Morgan Chen</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{ width: 6, height: 6, borderRadius: 999, background: priColor }} />
        <span style={{ fontSize: 12, color: "var(--muted)" }}>{priLabel} priority</span>
      </div>
      <span className="num" style={{ fontSize: 12.5, color: "var(--muted)" }}>Due {t.due}</span>
      <Icon name="more" size={14} color="var(--muted-3)" />
    </div>
  );
}

function FundWire({ f }) {
  const [copied, setCopied] = useState("");
  const fields = [
    { label: "Beneficiary name", value: `${f.name} GP, LLC` },
    { label: "Beneficiary address", value: "1 Market Street, Suite 3600, San Francisco, CA 94105" },
    { label: "Bank", value: "First Republic Bank" },
    { label: "ABA / Routing", value: "321081669" },
    { label: "Account number", value: "60001249812" },
    { label: "SWIFT", value: "FRBKUS6S" },
    { label: "Reference", value: `CALL-${f.id.toUpperCase()}-07` },
  ];
  const copy = (label, value) => {
    navigator.clipboard?.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(""), 1400);
  };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 16 }}>
      <Card padding={0}>
        <div style={{ padding: "18px 22px 14px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Wire instructions</div>
          <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 3 }}>For capital contributions to {f.name}</div>
        </div>
        {fields.map((fld, i) => (
          <div key={fld.label} onClick={() => copy(fld.label, fld.value)} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "1fr 1.5fr 32px",
            padding: "14px 22px", alignItems: "center", gap: 10,
            borderBottom: i < fields.length - 1 ? "1px solid var(--border)" : "none",
            cursor: "pointer",
          }}>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{fld.label}</div>
            <div style={{ fontSize: 13, fontFamily: "var(--font-mono)", color: "var(--fg)" }}>{fld.value}</div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              {copied === fld.label ? (
                <Pill tone="pos" icon="check">Copied</Pill>
              ) : (
                <Icon name="copy" size={14} color="var(--muted-2)" />
              )}
            </div>
          </div>
        ))}
      </Card>

      <Card style={{ alignSelf: "start" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "var(--warn-tint)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="flag" size={15} color="var(--warn)" />
          </div>
          <div style={{ fontSize: 13, fontWeight: 500 }}>Confirm before wiring</div>
        </div>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
          {[
            "Verify beneficiary name matches the GP's capital call notice.",
            "Routing numbers are region-specific; SWIFT is for international wires.",
            "Always include the reference code so funds are applied to the correct call.",
          ].map((t, i) => (
            <li key={i} style={{ display: "flex", gap: 10, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
              <span style={{ width: 5, height: 5, borderRadius: 999, background: "var(--muted-3)", marginTop: 7, flexShrink: 0 }} />
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <div style={{ marginTop: 18, display: "flex", gap: 8 }}>
          <Button variant="primary" icon="send">Initiate wire</Button>
          <Button variant="solid" icon="download">Export PDF</Button>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { FundDetail, FundKeyMetrics });
