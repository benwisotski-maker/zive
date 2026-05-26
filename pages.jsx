// Zive — Additional pages: Portfolio, Investors, Capital Calls, Distributions,
// AI Upload, Agents, Doc Studio, MCP, Accounting, Reports, Quarterly, Audit,
// LP Interest, LP Onboarding, Deal Room, Users, All Files
const { useState: useStateP, useEffect: useEffectP, useMemo: useMemoP } = React;

// ────────────── Exposure by strategy (donut + interactive legend) ──────────────
function ExposureByStrategy({ sectors }) {
  const [hoverIdx, setHoverIdx] = useStateP(null);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Donut segments={sectors} size={120} thickness={16}
        onHover={setHoverIdx} />
      <div style={{ flex: 1 }}>
        {sectors.map((s, i) => {
          const dim = hoverIdx != null && hoverIdx !== i;
          return (
            <div key={s.name}
              onMouseEnter={() => setHoverIdx(i)}
              onMouseLeave={() => setHoverIdx(null)}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "4px 6px",
                margin: "0 -6px", borderRadius: 6,
                background: hoverIdx === i ? "var(--surface-2)" : "transparent",
                opacity: dim ? 0.45 : 1,
                transition: "opacity 120ms, background 120ms",
                cursor: "default",
              }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: s.color }} />
              <span style={{ flex: 1, fontSize: 12, color: "var(--fg-2)" }}>{s.name}</span>
              <span className="num" style={{ fontSize: 12, color: "var(--muted)" }}>{s.value}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ────────────── Shared page header ──────────────
function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: -0.6 }}>{title}</h1>
        {subtitle && <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 6 }}>{subtitle}</div>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8 }}>{actions}</div>}
    </div>
  );
}

function PageWrap({ children }) {
  return <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }} className="fade-up">{children}</div>;
}

function KPI({ label, value, delta, tone = "neutral" }) {
  return (
    <Card padding={18} style={{ flex: 1 }}>
      <div style={{ fontSize: 11.5, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 500 }}>{label}</div>
      <div className="num" style={{ fontSize: 24, fontWeight: 450, marginTop: 6, letterSpacing: -0.4 }}>{value}</div>
      {delta && <div style={{ marginTop: 6 }}><Pill tone={tone}>{delta}</Pill></div>}
    </Card>
  );
}

function TableHeader({ cols }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: cols.map(c => c.w).join(" "),
      gap: 14, padding: "10px 22px", borderBottom: "1px solid var(--border)",
      fontSize: 11, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4,
    }}>
      {cols.map((c, i) => <div key={i} style={{ textAlign: c.align || "left" }}>{c.label}</div>)}
    </div>
  );
}

// ────────────── Portfolio ──────────────
const PORTFOLIO_PAGES = [
  { id: "overview", label: "Overview" },
  { id: "soi",      label: "Schedule Of Investments" },
  { id: "irr",      label: "Deal IRR" },
  { id: "company",  label: "Company Overview" },
  { id: "metrics",  label: "Portfolio Metrics" },
  { id: "equity",   label: "Equity Schedule" },
];

function PortfolioPage({ initialSub } = {}) {
  const [page, setPage] = useState(initialSub || "overview");
  React.useEffect(() => { if (initialSub) setPage(initialSub); }, [initialSub]);

  if (page !== "overview") {
    return (
      <PageWrap>
        <PortfolioHeader
          title={(PORTFOLIO_PAGES.find(p => p.id === page) || {}).label}
          subTabs={PORTFOLIO_PAGES} page={page} setPage={setPage}
        />
        {page === "soi"     && <SchedulePage />}
        {page === "irr"     && <DealIRRPage />}
        {page === "company" && <CompanyOverviewPage />}
        {page === "metrics" && <PortfolioMetricsPage />}
        {page === "equity"  && <EquitySchedulePage />}
      </PageWrap>
    );
  }

  const totalNAV = FUNDS.reduce((s, f) => s + f.nav, 0);
  const totalCommit = FUNDS.reduce((s, f) => s + f.commitment, 0);
  const totalCalled = FUNDS.reduce((s, f) => s + f.called, 0);
  const wIrr = FUNDS.reduce((s, f) => s + f.irr * f.nav, 0) / totalNAV;
  const wTvpi = FUNDS.reduce((s, f) => s + f.tvpi * f.nav, 0) / totalNAV;

  const sectors = [
    { name: "Venture", value: 38, color: "#8E7CFF" },
    { name: "Buyout",  value: 24, color: "#6AE1FF" },
    { name: "Growth",  value: 16, color: "#FF9D6A" },
    { name: "Real Estate", value: 12, color: "#8BDE9A" },
    { name: "Credit", value: 10, color: "#FFD56A" },
  ];

  return (
    <PageWrap>
      <PageHeader title="Portfolio" subtitle="Exposure and performance across all funds"
        actions={<>
          <PageMenu items={PORTFOLIO_PAGES} value={page} onChange={setPage} />
          <Button variant="solid" size="md" icon="filter">Filter</Button>
          <Button variant="solid" size="md" icon="download">Export</Button>
        </>} />

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <KPI label="Net Asset Value" value={"$" + fmtMoney(totalNAV)} delta="+7.2% QoQ" tone="pos" />
        <KPI label="Total Committed" value={"$" + fmtMoney(totalCommit)} />
        <KPI label="Weighted IRR" value={(wIrr*100).toFixed(1)+"%"} delta="Net of fees" />
        <KPI label="Weighted TVPI" value={wTvpi.toFixed(2)+"x"} delta="6 funds" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 20 }}>
        <Card>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 500 }}>NAV growth — trailing 24 months</div>
            <div style={{ display: "flex", gap: 4 }}>
              {["1Y","2Y","5Y","All"].map((p,i)=>(
                <Button key={p} variant="pill" size="md" active={i===1}>{p}</Button>
              ))}
            </div>
          </div>
          <AreaChart data={NAV_SERIES} h={220} color="var(--accent)"
            labels={["Apr'23","Oct","Apr'24","Oct","Apr'25"]} highlightX={0.78}
            formatY={(v) => "$" + v.toFixed(2) + "M NAV"} />
        </Card>
        <Card>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 16 }}>Exposure by strategy</div>
          <ExposureByStrategy sectors={sectors} />
        </Card>
      </div>

      <Card padding={0}>
        <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Fund holdings</div>
          <span style={{ fontSize: 11.5, color: "var(--muted-2)" }}>{FUNDS.length} active</span>
        </div>
        <TableHeader cols={[
          { label: "Fund", w: "2fr" },
          { label: "Vintage", w: "70px" },
          { label: "Commit", w: "120px", align: "right" },
          { label: "Called", w: "100px", align: "right" },
          { label: "NAV", w: "120px", align: "right" },
          { label: "DPI", w: "60px", align: "right" },
          { label: "TVPI", w: "60px", align: "right" },
          { label: "IRR", w: "70px", align: "right" },
        ]}/>
        {FUNDS.map((f, i) => (
          <div key={f.id} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "2fr 70px 120px 100px 120px 60px 60px 70px",
            gap: 14, alignItems: "center", padding: "14px 22px",
            borderBottom: i < FUNDS.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
              <Orb seed={f.orb} size={28} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{f.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted-2)" }}>{f.strategy}</div>
              </div>
            </div>
            <div className="num" style={{ fontSize: 12.5 }}>{f.vintage}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right" }}>${fmtMoney(f.commitment)}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", color: "var(--muted)" }}>${fmtMoney(f.called)}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 500 }}>${fmtMoney(f.nav)}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", color: "var(--muted)" }}>{f.dpi.toFixed(2)}x</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right" }}>{f.tvpi.toFixed(2)}x</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", color: "var(--pos)" }}>{(f.irr*100).toFixed(1)}%</div>
          </div>
        ))}
      </Card>
    </PageWrap>
  );
}

// ────────────── Investors ──────────────
const INVESTORS = [
  { name: "Chen Family Office", type: "Family Office", commit: 5000000, called: 3425000, funds: 6, status: "Active", seed: 0 },
  { name: "Evergreen Holdings LLC", type: "LLC — Investment", commit: 2500000, called: 1800000, funds: 4, status: "Active", seed: 1 },
  { name: "Morgan Chen IRA", type: "Self-Directed IRA", commit: 750000, called: 500000, funds: 3, status: "Active", seed: 2 },
  { name: "Chen Legacy Trust", type: "Irrevocable Trust", commit: 1200000, called: 820000, funds: 3, status: "Active", seed: 3 },
  { name: "Ridgeline Capital GP", type: "GP Vehicle", commit: 400000, called: 265000, funds: 2, status: "Pending KYC", seed: 4 },
];

function InvestorsPage({ initialSub } = {}) {
  const [page, setPage] = useState(initialSub || "overview");
  React.useEffect(() => { if (initialSub) setPage(initialSub); }, [initialSub]);
  const INVESTOR_PAGES = [
    { id: "overview",    label: "Investors" },
    { id: "statement",   label: "Capital Statement" },
    { id: "rollforward", label: "Partner roll forwards" },
    { id: "txns",        label: "Transactions" },
    { id: "pnl",         label: "P&L" },
    { id: "commits",     label: "Commitment History" },
  ];

  if (page !== "overview") {
    const labelMap = Object.fromEntries(INVESTOR_PAGES.map(p => [p.id, p.label]));
    return (
      <PageWrap>
        <InvestorHeader
          title={labelMap[page]}
          subTabs={INVESTOR_PAGES} page={page} setPage={setPage}
          kind={page === "commits" ? "commitments" : "default"}
        />
        {page === "statement"   && <CapitalStatementPage />}
        {page === "rollforward" && <PartnerRollForwardsPage />}
        {page === "txns"        && <TransactionsPage />}
        {page === "pnl"         && <PNLPage />}
        {page === "commits"     && <CommitmentHistoryPage />}
      </PageWrap>
    );
  }

  const totalCommit = INVESTORS.reduce((s, i) => s + i.commit, 0);
  const totalCalled = INVESTORS.reduce((s, i) => s + i.called, 0);
  return (
    <PageWrap>
      <PageHeader title="Investors" subtitle="Entities contributing capital across your funds"
        actions={<>
          <PageMenu items={INVESTOR_PAGES} value={page} onChange={setPage} />
          <Button variant="solid" size="md" icon="filter">Filter</Button>
          <Button variant="solid" size="md" icon="upload" onClick={() => window.zivePopup?.openBulkUpload()}>Bulk upload</Button>
          <Button variant="primary" size="md" icon="plus" onClick={() => window.zivePopup?.openAddInvestor()}>Add investor</Button>
        </>} />
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <KPI label="Investors" value={INVESTORS.length} delta="5 active" />
        <KPI label="Total Committed" value={"$" + fmtMoney(totalCommit)} />
        <KPI label="Total Called" value={"$" + fmtMoney(totalCalled)} delta={`${Math.round(totalCalled/totalCommit*100)}% called`} tone="accent" />
        <KPI label="Unfunded" value={"$" + fmtMoney(totalCommit - totalCalled)} />
      </div>

      <Card padding={0}>
        <TableHeader cols={[
          { label: "Investor", w: "2fr" },
          { label: "Type", w: "160px" },
          { label: "Funds", w: "70px", align: "right" },
          { label: "Commit", w: "140px", align: "right" },
          { label: "Called", w: "140px", align: "right" },
          { label: "% Called", w: "120px" },
          { label: "Status", w: "120px" },
        ]} />
        {INVESTORS.map((inv, i) => {
          const pct = inv.called / inv.commit;
          return (
            <div key={inv.name} className="row-hover" style={{
              display: "grid", gridTemplateColumns: "2fr 160px 70px 140px 140px 120px 120px",
              gap: 14, alignItems: "center", padding: "14px 22px",
              borderBottom: i < INVESTORS.length-1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Orb seed={inv.seed} size={28} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{inv.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted-2)" }}>EIN •••• {3000 + i*111}</div>
                </div>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{inv.type}</div>
              <div className="num" style={{ fontSize: 13, textAlign: "right" }}>{inv.funds}</div>
              <div className="num" style={{ fontSize: 13, textAlign: "right" }}>${fmtMoney(inv.commit)}</div>
              <div className="num" style={{ fontSize: 13, textAlign: "right", color: "var(--muted)" }}>${fmtMoney(inv.called)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1 }}><Progress value={pct*100} /></div>
                <span className="num" style={{ fontSize: 11.5, color: "var(--muted-2)", width: 32 }}>{Math.round(pct*100)}%</span>
              </div>
              <div><Pill tone={inv.status === "Active" ? "pos" : "warn"}>{inv.status}</Pill></div>
            </div>
          );
        })}
      </Card>
    </PageWrap>
  );
}

// ────────────── Capital Calls ──────────────
const CAPITAL_CALLS = [
  { id: "CC-0041", fund: "Sigma Ventures IV", num: 7, issued: "Apr 18, 2025", due: "Apr 28, 2025", amount: 185000, status: "Due", orb: 0 },
  { id: "CC-0040", fund: "Aster Credit Partners II", num: 3, issued: "Apr 4, 2025", due: "May 8, 2025", amount: 60000, status: "Scheduled", orb: 4 },
  { id: "CC-0039", fund: "Kinetic Ventures III", num: 5, issued: "Mar 22, 2025", due: "Apr 5, 2025", amount: 120000, status: "Paid", orb: 5 },
  { id: "CC-0038", fund: "Harbor Real Estate V", num: 4, issued: "Feb 14, 2025", due: "Feb 28, 2025", amount: 95000, status: "Paid", orb: 2 },
  { id: "CC-0037", fund: "Northwind Buyout III", num: 12, issued: "Jan 30, 2025", due: "Feb 13, 2025", amount: 240000, status: "Paid", orb: 3 },
  { id: "CC-0036", fund: "Sigma Ventures IV", num: 6, issued: "Jan 15, 2025", due: "Jan 29, 2025", amount: 155000, status: "Paid", orb: 0 },
];

function CapitalCallsPage() {
  const due = CAPITAL_CALLS.filter(c => c.status !== "Paid").reduce((s, c) => s + c.amount, 0);
  const ytd = CAPITAL_CALLS.reduce((s, c) => s + c.amount, 0);
  return (
    <PageWrap>
      <PageHeader title="Capital Calls" subtitle="Scheduled and historical capital contributions"
        actions={<><Button variant="solid" size="md" icon="filter">All funds</Button><Button variant="primary" size="md" icon="plus">New call</Button></>} />

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <KPI label="Outstanding" value={"$" + fmtMoney(due)} delta="2 calls due" tone="warn" />
        <KPI label="Called YTD" value={"$" + fmtMoney(ytd)} />
        <KPI label="Next due" value="Apr 28" delta="Sigma IV • $185k" tone="accent" />
        <KPI label="Unfunded commitment" value="$3,935,000" />
      </div>

      <Card padding={0}>
        <TableHeader cols={[
          { label: "Call ID", w: "110px" },
          { label: "Fund", w: "2fr" },
          { label: "#", w: "40px", align: "right" },
          { label: "Issued", w: "120px" },
          { label: "Due", w: "120px" },
          { label: "Amount", w: "130px", align: "right" },
          { label: "Status", w: "120px" },
        ]} />
        {CAPITAL_CALLS.map((c, i) => (
          <div key={c.id} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "110px 2fr 40px 120px 120px 130px 120px",
            gap: 14, alignItems: "center", padding: "14px 22px",
            borderBottom: i < CAPITAL_CALLS.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div className="num" style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{c.id}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Orb seed={c.orb} size={24} />
              <div style={{ fontSize: 13, fontWeight: 500 }}>{c.fund}</div>
            </div>
            <div className="num" style={{ fontSize: 12.5, color: "var(--muted)", textAlign: "right" }}>{c.num}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{c.issued}</div>
            <div style={{ fontSize: 12.5, color: c.status === "Due" ? "var(--warn)" : "var(--fg-2)", fontWeight: c.status === "Due" ? 500 : 400 }}>{c.due}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 500 }}>${fmtMoney(c.amount)}</div>
            <div><Pill tone={c.status === "Paid" ? "pos" : c.status === "Due" ? "warn" : "outline"}>{c.status}</Pill></div>
          </div>
        ))}
      </Card>
    </PageWrap>
  );
}

// ────────────── Distributions ──────────────
const DISTRIBUTIONS = [
  { id: "D-0089", fund: "Meridian Growth II", date: "Apr 21, 2025", amount: 142500, type: "Cash + stock", ref: "Q1 distribution", orb: 1 },
  { id: "D-0088", fund: "Northwind Buyout III", date: "Apr 8, 2025",  amount: 87250, type: "Cash", ref: "Q1 income", orb: 3 },
  { id: "D-0087", fund: "Meridian Growth II", date: "Jan 15, 2025", amount: 128000, type: "Cash", ref: "Q4 distribution", orb: 1 },
  { id: "D-0086", fund: "Northwind Buyout III", date: "Jan 8, 2025",  amount: 94500, type: "Cash + stock", ref: "Q4 2024", orb: 3 },
  { id: "D-0085", fund: "Harbor Real Estate V", date: "Dec 20, 2024", amount: 28400, type: "Cash", ref: "Rental income", orb: 2 },
  { id: "D-0084", fund: "Meridian Growth II", date: "Oct 12, 2024", amount: 112000, type: "Cash", ref: "Q3 distribution", orb: 1 },
];

const STARTUPS = [
  { id: "circuitworks", name: "CircuitWorks Inc.", industry: "Artificial Intelligence and Machine Learning", website: "circuitworks.ai", asset: "Equity", invested: 2500000, valuation: 18000000, orb: 1,
    stage: "Series A", round: "Series A-2 Preferred", initialRound: "Seed", investmentDate: "03/30/2025", investmentType: "Active Investment",
    contact: { name: "Aria Sato", partner: "Morgan Chen", email: "aria@circuitworks.ai", phone: "+1 415-555-0182" },
    location: { address: "548 Market St, Suite 220", city: "San Francisco", state: "CA", country: "United States" },
    diversity: { urm: "NO", woman: "NO", minority: "NO", immigrant: "YES", admins: "NO", grade: "A" },
    financial: { ownership: 4.2, distributed: 0, held: 2500000, postMoney: 18000000, totalRaised: 6200000, monthlyBurn: 420000, priorYearArr: 1200000, ytdArr: 850000, budgetArr: 4200000, yearEndDue: 0, fullyDiluted: 18250000, cashOnHand: 7100000, coInvestors: "Founders Fund · Lux Capital", description: "AI-native circuit verification copilot." },
    profile: { focus: "AI tooling for chip design teams.", mission: "Cut tape-out cycles in half with AI-verified circuits.", highlights: "• 14 enterprise pilots\n• 3 patents filed\n• Backed by Founders Fund", revenue: 1450000, maturity: "12/2027", exit: "06/2028" } },
  { id: "helix-bio", name: "Helix Bio Labs", industry: "Biotechnology", website: "helixbio.com", asset: "Equity", invested: 1800000, valuation: 22000000, orb: 2,
    stage: "Series B", round: "Series B Preferred", initialRound: "Series A", investmentDate: "11/14/2024", investmentType: "Active Investment",
    contact: { name: "Dr. Priya Raman", partner: "Morgan Chen", email: "priya@helixbio.com", phone: "+1 617-555-0133" },
    location: { address: "1 Kendall Sq, Bldg 200", city: "Cambridge", state: "MA", country: "United States" },
    diversity: { urm: "YES", woman: "YES", minority: "YES", immigrant: "YES", admins: "NO", grade: "A+" },
    financial: { ownership: 8.1, distributed: 0, held: 1800000, postMoney: 22000000, totalRaised: 14500000, monthlyBurn: 680000, priorYearArr: 0, ytdArr: 0, budgetArr: 1800000, yearEndDue: 0, fullyDiluted: 22000000, cashOnHand: 18200000, coInvestors: "ARCH Venture · Polaris Partners", description: "Programmable RNA therapeutics platform." },
    profile: { focus: "RNA-based therapies for rare diseases.", mission: "Make precision medicine accessible to underserved indications.", highlights: "• IND filing Q3 2025\n• 4 pre-clinical programs\n• 22 PhD researchers", revenue: 0, maturity: "06/2029", exit: "12/2029" } },
  { id: "northrise", name: "Northrise Climate", industry: "Climate Tech", website: "northrise.eco", asset: "SAFE", invested: 750000, valuation: 9000000, orb: 3,
    stage: "Seed", round: "SAFE (Post-Money)", initialRound: "SAFE (Post-Money)", investmentDate: "08/22/2024", investmentType: "Active Investment",
    contact: { name: "Liam Okafor", partner: "Sasha Patel", email: "liam@northrise.eco", phone: "+1 503-555-0177" },
    location: { address: "210 SE Grand Ave", city: "Portland", state: "OR", country: "United States" },
    diversity: { urm: "YES", woman: "NO", minority: "YES", immigrant: "YES", admins: "NO", grade: "B" },
    financial: { ownership: 8.3, distributed: 0, held: 750000, postMoney: 9000000, totalRaised: 1500000, monthlyBurn: 95000, priorYearArr: 0, ytdArr: 120000, budgetArr: 600000, yearEndDue: 0, fullyDiluted: 0, cashOnHand: 1100000, coInvestors: "Lowercarbon · Congruent", description: "Distributed grid storage for renewables." },
    profile: { focus: "Grid-edge storage for solar arrays.", mission: "Decarbonize the last mile of the grid.", highlights: "• 3 utility pilots in PNW\n• Patent pending on cell topology", revenue: 120000, maturity: "—", exit: "12/2029" } },
  { id: "ledgerline", name: "Ledgerline", industry: "Fintech", website: "ledgerline.io", asset: "Equity", invested: 3200000, valuation: 45000000, orb: 4,
    stage: "Series B", round: "Series B Preferred", initialRound: "Series A", investmentDate: "02/06/2025", investmentType: "Active Investment",
    contact: { name: "Helen Park", partner: "Morgan Chen", email: "helen@ledgerline.io", phone: "+1 212-555-0110" },
    location: { address: "55 Hudson Yards, Fl 38", city: "New York", state: "NY", country: "United States" },
    diversity: { urm: "NO", woman: "YES", minority: "YES", immigrant: "NO", admins: "NO", grade: "A" },
    financial: { ownership: 7.1, distributed: 0, held: 3200000, postMoney: 45000000, totalRaised: 22000000, monthlyBurn: 510000, priorYearArr: 6800000, ytdArr: 4400000, budgetArr: 14000000, yearEndDue: 0, fullyDiluted: 31200000, cashOnHand: 24800000, coInvestors: "Sequoia · Ribbit Capital", description: "Real-time GL & reconciliation for fintechs." },
    profile: { focus: "Embedded ledger infra for fintechs.", mission: "Replace batch reconciliation with realtime GLs.", highlights: "• $14M ARR run-rate\n• 88 enterprise customers\n• SOC 2 Type II", revenue: 14400000, maturity: "12/2028", exit: "06/2029" } },
  { id: "pixelforge", name: "Pixelforge Studio", industry: "Media & Entertainment", website: "pixelforge.studio", asset: "Convertible Note", invested: 600000, valuation: 7500000, orb: 5,
    stage: "Pre-seed", round: "Convertible Note", initialRound: "Convertible Note", investmentDate: "05/19/2024", investmentType: "Active Investment",
    contact: { name: "Jamie Vasquez", partner: "Sasha Patel", email: "jamie@pixelforge.studio", phone: "+1 310-555-0144" },
    location: { address: "8000 Sunset Blvd", city: "Los Angeles", state: "CA", country: "United States" },
    diversity: { urm: "YES", woman: "NO", minority: "YES", immigrant: "NO", admins: "NO", grade: "B+" },
    financial: { ownership: 8.0, distributed: 0, held: 600000, postMoney: 7500000, totalRaised: 1200000, monthlyBurn: 65000, priorYearArr: 280000, ytdArr: 320000, budgetArr: 950000, yearEndDue: 0, fullyDiluted: 0, cashOnHand: 540000, coInvestors: "a16z scout · Boost VC", description: "Real-time CGI pipeline for indie studios." },
    profile: { focus: "Realtime virtual production for indie films.", mission: "Make CGI affordable for storytellers.", highlights: "• 6 short films shipped\n• 2 partnerships w/ studios", revenue: 320000, maturity: "—", exit: "12/2029" } },
  { id: "arcwell", name: "Arcwell Robotics", industry: "Robotics & Hardware", website: "arcwell.dev", asset: "Equity", invested: 2100000, valuation: 28000000, orb: 6,
    stage: "Series A", round: "Series A Preferred", initialRound: "Seed", investmentDate: "10/02/2024", investmentType: "Active Investment",
    contact: { name: "Theo Brandt", partner: "Morgan Chen", email: "theo@arcwell.dev", phone: "+1 412-555-0166" },
    location: { address: "5000 Forbes Ave", city: "Pittsburgh", state: "PA", country: "United States" },
    diversity: { urm: "NO", woman: "NO", minority: "NO", immigrant: "YES", admins: "NO", grade: "A" },
    financial: { ownership: 7.5, distributed: 0, held: 2100000, postMoney: 28000000, totalRaised: 9400000, monthlyBurn: 380000, priorYearArr: 800000, ytdArr: 1100000, budgetArr: 4000000, yearEndDue: 0, fullyDiluted: 24500000, cashOnHand: 8900000, coInvestors: "Khosla Ventures · Eclipse", description: "Autonomous arc-welding robotics for industrial fab." },
    profile: { focus: "Autonomous welding for heavy industry.", mission: "Make manufacturing safer & faster with robotics.", highlights: "• 9 robots deployed\n• 3 Fortune-500 pilots", revenue: 1100000, maturity: "06/2028", exit: "12/2028" } },
  { id: "sundial-health", name: "Sundial Health", industry: "Digital Health", website: "sundialhealth.co", asset: "Equity", invested: 1450000, valuation: 16000000, orb: 7,
    stage: "Seed", round: "Seed Preferred", initialRound: "Seed", investmentDate: "07/11/2024", investmentType: "Active Investment",
    contact: { name: "Maya Greco", partner: "Sasha Patel", email: "maya@sundialhealth.co", phone: "+1 206-555-0188" },
    location: { address: "200 Pine St", city: "Seattle", state: "WA", country: "United States" },
    diversity: { urm: "NO", woman: "YES", minority: "NO", immigrant: "NO", admins: "NO", grade: "A-" },
    financial: { ownership: 9.0, distributed: 0, held: 1450000, postMoney: 16000000, totalRaised: 4800000, monthlyBurn: 210000, priorYearArr: 460000, ytdArr: 720000, budgetArr: 2400000, yearEndDue: 0, fullyDiluted: 16200000, cashOnHand: 3600000, coInvestors: "GV · Founders Fund", description: "Circadian-aware health platform for shift workers." },
    profile: { focus: "Circadian health for shift workers.", mission: "Restore healthy sleep for non-9-to-5 workers.", highlights: "• 38k MAUs\n• 4 enterprise contracts\n• HIPAA compliant", revenue: 720000, maturity: "—", exit: "12/2029" } },
  { id: "quantum-routes", name: "Quantum Routes", industry: "Logistics & Mobility", website: "quantumroutes.com", asset: "SAFE", invested: 950000, valuation: 11000000, orb: 8,
    stage: "Pre-seed", round: "SAFE (Post-Money)", initialRound: "SAFE (Post-Money)", investmentDate: "09/28/2024", investmentType: "Active Investment",
    contact: { name: "Noor Hassan", partner: "Morgan Chen", email: "noor@quantumroutes.com", phone: "+1 305-555-0199" },
    location: { address: "1100 Brickell Bay Dr", city: "Miami", state: "FL", country: "United States" },
    diversity: { urm: "YES", woman: "NO", minority: "YES", immigrant: "YES", admins: "NO", grade: "B+" },
    financial: { ownership: 8.6, distributed: 0, held: 950000, postMoney: 11000000, totalRaised: 1900000, monthlyBurn: 110000, priorYearArr: 0, ytdArr: 220000, budgetArr: 900000, yearEndDue: 0, fullyDiluted: 0, cashOnHand: 1500000, coInvestors: "Bessemer · BoxGroup", description: "Last-mile route optimization with quantum heuristics." },
    profile: { focus: "Last-mile route optimization for logistics fleets.", mission: "Cut logistics emissions with smarter routing.", highlights: "• 12 fleet pilots\n• 17% avg miles saved", revenue: 220000, maturity: "—", exit: "12/2029" } },
];

function DistributionsPage() {
  const ytd = DISTRIBUTIONS.filter(d => d.date.includes("2025")).reduce((s,d)=>s+d.amount, 0);
  const lifetime = DISTRIBUTIONS.reduce((s,d)=>s+d.amount, 0);
  return (
    <PageWrap>
      <PageHeader title="Distributions" subtitle="Cash and stock returned across your portfolio" />
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <KPI label="Received YTD" value={"$" + fmtMoney(ytd)} delta="+18% vs 2024" tone="pos" />
        <KPI label="Lifetime" value={"$" + fmtMoney(lifetime)} />
        <KPI label="DPI" value="0.21x" delta="Weighted across funds" />
        <KPI label="Projected 2025" value="$1.2M" delta="Based on LPAs" tone="accent" />
      </div>

      <Card padding={0}>
        <TableHeader cols={[
          { label: "Ref", w: "90px" },
          { label: "Fund", w: "2fr" },
          { label: "Date", w: "130px" },
          { label: "Type", w: "140px" },
          { label: "Memo", w: "1fr" },
          { label: "Amount", w: "140px", align: "right" },
        ]} />
        {DISTRIBUTIONS.map((d, i) => (
          <div key={d.id} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "90px 2fr 130px 140px 1fr 140px",
            gap: 14, alignItems: "center", padding: "14px 22px",
            borderBottom: i < DISTRIBUTIONS.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div className="num" style={{ fontSize: 12, color: "var(--muted)", fontFamily: "var(--font-mono)" }}>{d.id}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Orb seed={d.orb} size={24} />
              <div style={{ fontSize: 13, fontWeight: 500 }}>{d.fund}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{d.date}</div>
            <div><Pill tone="outline">{d.type}</Pill></div>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{d.ref}</div>
            <div className="num" style={{ fontSize: 13.5, textAlign: "right", fontWeight: 500, color: "var(--pos)" }}>+${fmtMoney(d.amount)}</div>
          </div>
        ))}
      </Card>
    </PageWrap>
  );
}

function StartupsPage({ onOpen } = {}) {
  const totalInvested = STARTUPS.reduce((s,x) => s + x.invested, 0);
  const totalValuation = STARTUPS.reduce((s,x) => s + x.valuation, 0);
  return (
    <PageWrap>
      <PageHeader title="Startups" subtitle="Portfolio companies across your funds" />
      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <KPI label="Companies" value={STARTUPS.length} delta="Across portfolio" />
        <KPI label="Capital deployed" value={"$" + fmtMoney(totalInvested)} tone="accent" />
        <KPI label="Combined valuation" value={"$" + fmtMoney(totalValuation)} delta="At last round" tone="pos" />
        <KPI label="Top sector" value="AI/ML" delta="3 companies" />
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ position: "relative", flex: "0 0 280px" }}>
          <Icon name="search" size={13} color="var(--muted-2)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input placeholder="Search startups" style={{
            width: "100%", padding: "8px 10px 8px 30px",
            borderRadius: 8, background: "var(--surface-2)",
            border: "1px solid var(--border)", color: "var(--fg)",
            fontSize: 12.5, fontFamily: "inherit", outline: "none",
          }} />
        </div>
        <Button variant="ghost" size="md" icon="filter">Filters</Button>
        <div style={{ flex: 1 }} />
        <Button variant="primary" size="md" icon="plus">Add startup</Button>
        <Button variant="ghost" size="md" icon="upload">Bulk upload</Button>
      </div>

      <Card padding={0}>
        <TableHeader cols={[
          { label: "Company", w: "1.6fr" },
          { label: "Industry", w: "1.4fr" },
          { label: "Website", w: "180px" },
          { label: "Asset Class", w: "150px" },
          { label: "Invested", w: "130px", align: "right" },
          { label: "Valuation", w: "140px", align: "right" },
        ]} />
        {STARTUPS.map((s, i) => (
          <div key={s.name} className="row-hover" onClick={() => onOpen && onOpen(s.id)} style={{
            display: "grid", gridTemplateColumns: "1.6fr 1.4fr 180px 150px 130px 140px",
            gap: 14, alignItems: "center", padding: "14px 22px",
            borderBottom: i < STARTUPS.length-1 ? "1px solid var(--border)" : "none",
            cursor: "pointer",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Orb seed={s.orb} size={26} />
              <div style={{ fontSize: 13, fontWeight: 500 }}>{s.name}</div>
            </div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>{s.industry}</div>
            <div style={{ fontSize: 12, color: "var(--accent-text)", fontFamily: "var(--font-mono)" }}>{s.website}</div>
            <div><Pill tone="outline">{s.asset}</Pill></div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 500 }}>${fmtMoney(s.invested)}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 500, color: "var(--pos)" }}>${fmtMoney(s.valuation)}</div>
          </div>
        ))}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 22px", fontSize: 11.5, color: "var(--muted-2)",
          borderTop: "1px solid var(--border)",
        }}>
          <span>Page 1 of 1</span>
          <span>1 - {STARTUPS.length} of {STARTUPS.length}, Show 25</span>
        </div>
      </Card>
    </PageWrap>
  );
}

// ────────────── Startup Profile (single company) ──────────────
const STARTUP_TABS = [
  { id: "basic",      label: "Basic Information" },
  { id: "contact",    label: "Contact & Location" },
  { id: "diversity",  label: "Diversity & Compliance" },
  { id: "financial",  label: "Financial & Investment" },
  { id: "extra",      label: "Extra Fields" },
  { id: "profile",    label: "Portfolio Company Profile" },
];

function StartupField({ label, value, mono, copy }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500, marginBottom: 6, letterSpacing: 0.2 }}>{label}</div>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "9px 12px", minHeight: 36,
        borderRadius: 8, background: "var(--surface)",
        border: "1px solid var(--border)",
        fontSize: 13, color: value ? "var(--fg)" : "var(--muted-3)",
        fontFamily: mono ? "var(--font-mono)" : "inherit",
      }}>
        <span style={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{value || "—"}</span>
        {copy && value && <Icon name="copy" size={12} color="var(--muted-2)" style={{ cursor: "pointer", flexShrink: 0 }} />}
      </div>
    </div>
  );
}

function StartupSelect({ label, value }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500, marginBottom: 6, letterSpacing: 0.2 }}>{label}</div>
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        padding: "9px 12px", minHeight: 36,
        borderRadius: 8, background: "var(--surface)",
        border: "1px solid var(--border)",
        fontSize: 13, color: "var(--fg)",
      }}>
        <span style={{ flex: 1 }}>{value}</span>
        <Icon name="chevronD" size={11} color="var(--muted-2)" />
      </div>
    </div>
  );
}

function StartupSection({ icon, title, children }) {
  return (
    <Card style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, paddingBottom: 12, borderBottom: "1px solid var(--border)" }}>
        {icon && <Icon name={icon} size={15} color="var(--accent-text)" />}
        <div style={{ fontSize: 14, fontWeight: 500, letterSpacing: -0.2 }}>{title}</div>
      </div>
      {children}
    </Card>
  );
}

function StartupHeroInfo({ s }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: "max-content 1fr",
      columnGap: 28, rowGap: 16, padding: "0 4px 28px",
    }}>
      {[
        ["Industry", s.industry],
        ["Website", s.website],
        ["Asset class", s.asset],
        ["Stage", s.stage],
        ["Investment date", s.investmentDate],
        ["Last round", s.round],
      ].map(([k, v]) => (
        <React.Fragment key={k}>
          <div style={{ fontSize: 13, color: "var(--muted)", fontWeight: 450 }}>{k}</div>
          <div style={{
            fontSize: 13.5, color: "var(--fg)", fontWeight: 500,
            display: "flex", alignItems: "center", gap: 10,
            fontFamily: k === "Website" ? "var(--font-mono)" : "inherit",
          }}>
            {v}
            {(k === "Website" || k === "Industry") && (
              <button style={{
                width: 22, height: 22, borderRadius: 6,
                border: "1px solid var(--border)", background: "var(--surface)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--muted-2)",
              }}>
                <Icon name="copy" size={11} />
              </button>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

function StartupProfilePage({ id, onBack }) {
  const [tab, setTab] = useStateP("basic");
  const s = STARTUPS.find(x => x.id === id) || STARTUPS[0];

  return (
    <PageWrap>
      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 22, fontSize: 12.5 }}>
        <button onClick={onBack} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 10px", borderRadius: 7,
          background: "var(--chip)", border: "1px solid var(--border)",
          color: "var(--muted)", cursor: "pointer", fontFamily: "inherit", fontSize: 12.5,
        }}>
          <Icon name="building" size={12} />
          Startups
        </button>
        <Icon name="chevronR" size={11} color="var(--muted-3)" />
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 10px", borderRadius: 7,
          background: "var(--chip)", border: "1px solid var(--border)",
          color: "var(--fg-2)", fontWeight: 500,
        }}>
          <Orb seed={s.orb} size={14} />
          {s.name}
        </div>
      </div>

      {/* Hero */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 28, marginBottom: 28 }}>
        <Orb seed={s.orb} size={88} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 style={{ margin: 0, fontSize: 36, fontWeight: 500, letterSpacing: -0.8, lineHeight: 1.1 }}>{s.name}</h1>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
            <Pill tone="outline">{s.asset}</Pill>
            <Pill tone="outline">{s.stage}</Pill>
            <Pill tone="outline">{s.industry.length > 28 ? s.industry.split(" ").slice(0,2).join(" ") : s.industry}</Pill>
            <Pill tone="pos">Active</Pill>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <Button variant="ghost" size="md" icon="bell">Subscribe</Button>
          <Button variant="ghost" size="md" icon="external">Visit site</Button>
          <Button variant="primary" size="md" icon="sparkle">Edit company</Button>
        </div>
      </div>

      <StartupHeroInfo s={s} />

      {/* Tabs */}
      <div style={{
        display: "flex", gap: 4, padding: 4,
        background: "var(--surface-2)", borderRadius: 10,
        border: "1px solid var(--border)",
        marginBottom: 22, overflowX: "auto",
      }}>
        {STARTUP_TABS.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: "1 1 auto", padding: "8px 14px",
              borderRadius: 8, border: "none",
              background: active ? "var(--surface)" : "transparent",
              color: active ? "var(--fg)" : "var(--muted)",
              fontSize: 12.5, fontWeight: active ? 500 : 450, fontFamily: "inherit",
              cursor: "pointer", whiteSpace: "nowrap",
              boxShadow: active ? "inset 0 0 0 1px var(--border)" : "none",
            }}>{t.label}</button>
          );
        })}
      </div>

      {tab === "basic"      && <StartupBasicTab s={s} />}
      {tab === "contact"    && <StartupContactTab s={s} />}
      {tab === "diversity"  && <StartupDiversityTab s={s} />}
      {tab === "financial"  && <StartupFinancialTab s={s} />}
      {tab === "extra"      && <StartupExtraTab s={s} />}
      {tab === "profile"    && <StartupProfileTab s={s} />}
    </PageWrap>
  );
}

// ── Tab: Basic Information ──
function StartupBasicTab({ s }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <StartupSection icon="building" title="Company Information">
        <StartupField label="Legal Name" value={s.name} />
        <StartupField label="Industry" value={s.industry} />
        <StartupField label="Website" value={s.website} mono copy />
        <StartupField label="Description" value={s.financial.description} />
        <StartupField label="Stage" value={s.stage} />
        <StartupField label="Asset Class" value={s.asset} />
      </StartupSection>
      <StartupSection icon="checklist" title="Investment Summary">
        <StartupField label="Investment Date" value={s.investmentDate} />
        <StartupField label="Initial Round" value={s.initialRound} />
        <StartupField label="Last Round" value={s.round} />
        <StartupField label="Investment Type" value={s.investmentType} />
        <StartupField label="Capital Invested" value={"$" + fmtMoney(s.invested)} />
        <StartupField label="Current Valuation" value={"$" + fmtMoney(s.valuation)} />
      </StartupSection>
    </div>
  );
}

// ── Tab: Contact & Location ──
function StartupContactTab({ s }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <StartupSection icon="onboard" title="Contact Information">
        <StartupField label="Contact Name" value={s.contact.name} />
        <StartupSelect label="Partner Name" value={s.contact.partner} />
        <StartupField label="Email" value={s.contact.email} mono copy />
        <StartupField label="Phone" value={s.contact.phone} mono copy />
      </StartupSection>
      <StartupSection icon="building" title="Location Details">
        <StartupField label="Address" value={s.location.address} />
        <StartupField label="City" value={s.location.city} />
        <StartupField label="State" value={s.location.state} />
        <StartupField label="Country" value={s.location.country} />
        <StartupField label="Notes" value={"HQ — primary office"} />
      </StartupSection>
    </div>
  );
}

// ── Tab: Diversity & Compliance ──
function StartupDiversityYesNo({ label, value }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500, marginBottom: 6 }}>{label}</div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        padding: "9px 12px", minHeight: 36,
        borderRadius: 8, background: "var(--surface)",
        border: "1px solid var(--border)",
        fontSize: 13, color: "var(--fg)",
      }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "2px 9px", borderRadius: 999,
          fontSize: 11, fontWeight: 500,
          background: value === "YES" ? "var(--pos-tint)" : "var(--chip)",
          color: value === "YES" ? "var(--pos)" : "var(--muted)",
          border: value === "YES" ? "1px solid rgba(34,197,94,0.22)" : "1px solid var(--border)",
        }}>
          <span style={{ width: 5, height: 5, borderRadius: 999, background: "currentColor" }} />
          {value}
        </span>
        <Icon name="chevronD" size={11} color="var(--muted-2)" />
      </div>
    </div>
  );
}
function StartupDiversityTab({ s }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <StartupSection icon="onboard" title="Diversity Metrics">
        <StartupDiversityYesNo label="URM (Underrepresented Minority)" value={s.diversity.urm} />
        <StartupDiversityYesNo label="Woman-Owned" value={s.diversity.woman} />
        <StartupDiversityYesNo label="Minority-Owned" value={s.diversity.minority} />
        <StartupDiversityYesNo label="Immigrant-Founded" value={s.diversity.immigrant} />
      </StartupSection>
      <StartupSection icon="settings" title="Administrative">
        <StartupDiversityYesNo label="Only For Admins" value={s.diversity.admins} />
        <StartupField label="Grade" value={s.diversity.grade} />
      </StartupSection>
    </div>
  );
}

// ── Tab: Financial & Investment ──
function StartupFinancialTab({ s }) {
  const f = s.financial;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <StartupSection icon="chart" title="Financial Information">
        <StartupField label="Company Valuation" value={fmtMoney(s.valuation)} />
        <StartupField label="Cash on Hand" value={"$" + fmtMoney(f.cashOnHand)} />
        <StartupField label="Ownership (%)" value={f.ownership.toFixed(1)} />
        <StartupField label="Distributed Amount" value={f.distributed} />
        <StartupField label="Held Value" value={fmtMoney(f.held)} />
        <StartupSelect label="Investment Type" value={s.investmentType} />
        <StartupField label="Initial Round" value={s.initialRound} />
        <StartupField label="Last Round" value={s.round} />
        <StartupField label="Notable Co-Investors" value={f.coInvestors} />
        <StartupField label="Token Name" value="" />
      </StartupSection>
      <StartupSection icon="pay" title="Investment Details">
        <StartupField label="Wallet Address" value="" mono />
        <StartupField label="Scan" value="" />
        <StartupField label="Post-Money Valuation" value={"$" + fmtMoney(f.postMoney)} />
        <StartupField label="Total Raised" value={"$" + fmtMoney(f.totalRaised)} />
        <StartupField label="Monthly Burn Rate" value={"$" + fmtMoney(f.monthlyBurn)} />
        <StartupField label="Prior Year ARR" value={f.priorYearArr ? "$" + fmtMoney(f.priorYearArr) : ""} />
        <StartupField label="YTD ARR" value={f.ytdArr ? "$" + fmtMoney(f.ytdArr) : ""} />
        <StartupField label="Budget ARR" value={f.budgetArr ? "$" + fmtMoney(f.budgetArr) : ""} />
        <StartupField label="Year End Due" value={f.yearEndDue} />
        <StartupField label="Description" value={f.description} />
        <StartupField label="Fully Diluted Shares" value={f.fullyDiluted ? f.fullyDiluted.toLocaleString() : ""} />
      </StartupSection>
    </div>
  );
}

// ── Tab: Extra Fields ──
function StartupExtraTab({ s }) {
  const f = s.financial;
  // Deterministic-ish helpers off of the company id so each card looks distinct
  const seed = (s.id.charCodeAt(0) + s.id.length * 7);
  const heldSec  = (Math.round((s.invested / 4.2) * (1 + ((seed % 9) / 100)))).toLocaleString();
  const fdPct    = (f.ownership * 0.96).toFixed(2) + "%";
  const implied  = "$" + fmtMoney(Math.round(s.invested * (s.valuation / Math.max(s.invested, 1)) * 0.42));
  const followOn = "$" + fmtMoney(Math.round(s.invested * 0.5));
  return (
    <>
      <Card style={{
        marginBottom: 16, padding: "12px 16px",
        background: "var(--accent-tint)", border: "1px solid var(--accent-ring-30)",
        display: "flex", alignItems: "flex-start", gap: 10,
      }}>
        <Icon name="info" size={14} color="var(--accent-text)" style={{ marginTop: 2 }} />
        <div style={{ fontSize: 12.5, color: "var(--accent-text)", lineHeight: 1.5 }}>
          <strong style={{ fontWeight: 500 }}>Extra Fields:</strong> These fields contain additional data from AUMNI integration. Edit any field to update the company information.
        </div>
      </Card>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <StartupSection icon="briefcase" title="Company & Investment Data">
          <StartupField label="Dba Name" value={s.name} />
          <StartupField label="Stage" value={s.stage} />
          <StartupField label="Most Recent Transaction Date" value={s.investmentDate} />
          <StartupField label="My Currently Held Securities" value={heldSec} />
          <StartupField label="My F D Percent" value={fdPct} />
          <StartupField label="Implied Value Of My Holdings" value={implied} />
          <StartupField label="My Follow On Reserves" value={followOn} />
          <StartupField label="Aumni Custom Field Test" value="" />
          <StartupField label="Pe View Id" value={"PE-" + (1000 + (seed % 9000))} mono />
          <StartupField label="Outstanding Audit Log Item" value="" />
        </StartupSection>
        <StartupSection icon="accounting" title="Additional Information">
          <StartupField label="Total Equity Financing New Money" value={"$" + fmtMoney(f.totalRaised)} />
          <StartupField label="Total Invested Capital" value={"$" + fmtMoney(s.invested)} />
          <StartupField label="Total New Money" value={"$" + fmtMoney(Math.round(f.totalRaised * 0.6))} />
          <StartupField label="Unrealized Gains Losses" value={"$" + fmtMoney(Math.round(s.invested * 0.18))} />
          <StartupField label="Common Shares Outstanding" value={f.fullyDiluted ? Math.round(f.fullyDiluted * 0.55).toLocaleString() : ""} />
          <StartupField label="Founder Preferred Shares Outstanding" value={f.fullyDiluted ? Math.round(f.fullyDiluted * 0.12).toLocaleString() : ""} />
          <StartupField label="Fully Diluted Share Count" value={f.fullyDiluted ? f.fullyDiluted.toLocaleString() : ""} />
          <StartupField label="My Percent Of Preferred" value={(f.ownership * 1.1).toFixed(2) + "%"} />
          <StartupField label="My F D Percent At Entry" value={(f.ownership * 0.9).toFixed(2) + "%"} />
          <StartupField label="My Total Shares Held" value={heldSec} />
        </StartupSection>
      </div>
    </>
  );
}

// ── Tab: Portfolio Company Profile ──
function StartupProfileTab({ s }) {
  const p = s.profile;
  return (
    <>
      <Card style={{
        marginBottom: 16, padding: "12px 16px",
        background: "var(--warn-tint, rgba(234,179,8,0.10))", border: "1px solid rgba(234,179,8,0.25)",
        display: "flex", alignItems: "flex-start", gap: 10,
      }}>
        <Icon name="info" size={14} color="var(--warn, #C68A1F)" style={{ marginTop: 2 }} />
        <div style={{ fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.5 }}>
          <strong style={{ fontWeight: 500, color: "var(--warn, #C68A1F)" }}>Company Details:</strong> These details are persistent and will be reflected across all reports for this company. Update them here to ensure consistency and prevent data loss on report regeneration.
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          <Button variant="primary" size="md" icon="upload">Upload Image</Button>
          <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>Supports .png, .jpg, .jpeg · Max size 1 MB</div>
        </div>
        {/* Banner placeholder */}
        <div style={{
          height: 220, borderRadius: 12,
          background: "repeating-linear-gradient(45deg, var(--surface) 0 12px, var(--surface-2) 12px 24px)",
          border: "1px dashed var(--border-strong)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--muted-2)",
          marginBottom: 6,
        }}>
          banner image placeholder · 1200×400px recommended
        </div>
        <div style={{ fontSize: 11.5, color: "var(--accent-text)" }}>
          <strong style={{ fontWeight: 500 }}>Recommended:</strong> 1200×400px (landscape banner) · <strong style={{ fontWeight: 500 }}>Minimum:</strong> 800×200px · Aspect ratio ~3:1
        </div>
      </Card>

      {[
        { k: "Focus", v: p.focus },
        { k: "Mission", v: p.mission },
        { k: "Highlights", v: p.highlights },
      ].map(({ k, v }) => (
        <Card key={k} style={{ marginBottom: 12, padding: "16px 20px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{k}</div>
            <Button variant="ghost" size="sm" icon="sparkle">Edit</Button>
          </div>
          <div style={{
            padding: "12px 14px", borderRadius: 8,
            background: "var(--surface)", border: "1px solid var(--border)",
            fontSize: 13, color: "var(--fg-2)", whiteSpace: "pre-line", lineHeight: 1.55,
          }}>
            {v}
          </div>
        </Card>
      ))}

      <Card style={{ marginBottom: 12, padding: "20px 22px" }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Key Dates</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
          <StartupField label="Investment Date" value={s.investmentDate} />
          <StartupField label="Maturity" value={p.maturity} />
          <StartupField label="Estimated Exit" value={p.exit} />
        </div>
      </Card>

      <Card style={{ padding: "20px 22px" }}>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Revenue</div>
        <StartupField label="Annualized Revenue (USD)" value={p.revenue ? "$" + fmtMoney(p.revenue) : "$0"} />
      </Card>
    </>
  );
}

// ────────────── AI Upload ──────────────
const RECENT_UPLOADS = [
  { name: "Sigma_IV_Capital_Call_7.pdf", fund: "Sigma Ventures IV", kind: "Capital Call", date: "Apr 18", status: "Processed", extracted: 14 },
  { name: "Northwind_Q1_Statement_2025.pdf", fund: "Northwind Buyout III", kind: "Statement", date: "Apr 15", status: "Processed", extracted: 36 },
  { name: "Harbor_K1_2024.pdf", fund: "Harbor Real Estate V", kind: "K-1", date: "Apr 11", status: "Processed", extracted: 22 },
  { name: "Kinetic_Side_Letter_v2.pdf", fund: "Kinetic Ventures III", kind: "Legal", date: "Apr 2", status: "Review", extracted: 9 },
  { name: "Meridian_Distribution_Notice.pdf", fund: "Meridian Growth II", kind: "Distribution", date: "Apr 21", status: "Processing", extracted: 0 },
];

function AIUploadPage() {
  return (
    <PageWrap>
      <PageHeader title="AI Upload" subtitle="Drop fund documents — Zive extracts line items, terms, and events automatically." />

      {/* Dropzone */}
      <Card style={{ marginBottom: 20, padding: 32, border: "1.5px dashed var(--border-strong)", background: "var(--surface)", textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: "0 auto 14px",
          background: "linear-gradient(135deg, var(--accent-ring-14), var(--accent-ring-06))",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "inset 0 0 0 1px var(--accent-ring-30)",
        }}>
          <Icon name="upload" size={22} color="var(--accent)" />
        </div>
        <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 4, letterSpacing: -0.2 }}>Drop PDFs, Word docs, or spreadsheets</div>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Capital calls, K-1s, statements, LPAs, side letters — all auto-classified</div>
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <Button variant="primary" icon="upload" onClick={() => window.zivePopup?.openUpload()}>Choose files</Button>
          <Button variant="solid" icon="folder">From Google Drive</Button>
        </div>
      </Card>

      {/* Pipeline */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { label: "Uploads today", value: "7", icon: "upload" },
          { label: "Auto-classified", value: "112", icon: "sparkle", tone: "accent" },
          { label: "Fields extracted", value: "1,284", icon: "checklist" },
          { label: "Needs review", value: "2", icon: "flag", tone: "warn" },
        ].map(m => (
          <Card key={m.label} padding={16}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 34, height: 34, borderRadius: 8,
                background: m.tone === "accent" ? "var(--accent-tint)" : m.tone === "warn" ? "var(--warn-tint)" : "var(--surface-2)",
                color: m.tone === "accent" ? "var(--accent)" : m.tone === "warn" ? "var(--warn)" : "var(--muted)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name={m.icon} size={16} />
              </div>
              <div>
                <div className="num" style={{ fontSize: 20, fontWeight: 500 }}>{m.value}</div>
                <div style={{ fontSize: 11, color: "var(--muted-2)" }}>{m.label}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Recent uploads</div>
          <Button variant="text" size="md" iconRight="arrowR">View all</Button>
        </div>
        <TableHeader cols={[
          { label: "File", w: "2fr" },
          { label: "Fund", w: "200px" },
          { label: "Type", w: "130px" },
          { label: "Uploaded", w: "100px" },
          { label: "Extracted", w: "110px" },
          { label: "Status", w: "120px" },
        ]} />
        {RECENT_UPLOADS.map((u, i) => (
          <div key={u.name} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "2fr 200px 130px 100px 110px 120px",
            gap: 14, alignItems: "center", padding: "14px 22px",
            borderBottom: i < RECENT_UPLOADS.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 1px var(--border)" }}>
                <Icon name="doc" size={14} color="var(--muted)" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{u.fund}</div>
            <div><Pill tone="outline">{u.kind}</Pill></div>
            <div style={{ fontSize: 12.5, color: "var(--muted-2)" }}>{u.date}</div>
            <div className="num" style={{ fontSize: 12.5, color: "var(--muted)" }}>{u.extracted > 0 ? `${u.extracted} fields` : "—"}</div>
            <div><Pill tone={u.status === "Processed" ? "pos" : u.status === "Review" ? "warn" : "accent"}>{u.status}</Pill></div>
          </div>
        ))}
      </Card>
    </PageWrap>
  );
}

// ────────────── Agents ──────────────
const AGENTS = [
  { name: "Capital Call Reviewer", desc: "Parses calls, validates amounts against LPA, flags anomalies", runs: 28, success: 96, icon: "capitalCall", enabled: true },
  { name: "K-1 Extractor", desc: "Pulls tax line items and forwards to tax folder", runs: 14, success: 100, icon: "receipt", enabled: true },
  { name: "NAV Reconciler", desc: "Matches GP statements to your ledger; alerts on drift > 2%", runs: 42, success: 93, icon: "chart", enabled: true },
  { name: "Distribution Auditor", desc: "Checks waterfall math and preferred return calculations", runs: 19, success: 100, icon: "distribution", enabled: true },
  { name: "Side Letter Monitor", desc: "Watches for MFN triggers and fee provisions", runs: 6, success: 100, icon: "doc", enabled: false },
  { name: "Quarterly Briefing", desc: "Drafts LP-ready quarterly summary by fund", runs: 12, success: 91, icon: "quarterly", enabled: true },
];

function AgentsPage() {
  const [filter, setFilter] = useStateP("all");
  return (
    <PageWrap>
      <PageHeader title="Agents" subtitle="Autonomous workers that review, reconcile, and flag."
        actions={<Button variant="primary" size="md" icon="plus" onClick={() => window.zivePopup?.openNewAgent()}>New agent</Button>} />

      <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
        <Button variant="pill" active={filter==="all"} onClick={()=>setFilter("all")}>All <span className="num" style={{color: "var(--muted-2)", marginLeft: 4}}>{AGENTS.length}</span></Button>
        <Button variant="pill" active={filter==="on"} onClick={()=>setFilter("on")}>Active</Button>
        <Button variant="pill" active={filter==="off"} onClick={()=>setFilter("off")}>Paused</Button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {AGENTS.map(a => (
          <Card key={a.name} padding={18} style={{ opacity: a.enabled ? 1 : 0.65 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: "var(--accent-tint)", color: "var(--accent)",
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "inset 0 0 0 1px var(--accent-ring-25)", flexShrink: 0,
              }}>
                <Icon name={a.icon} size={18} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{a.name}</div>
                  <Toggle on={a.enabled} />
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 12 }}>{a.desc}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 12 }}>
                  <div><span className="num" style={{ fontWeight: 500 }}>{a.runs}</span><span style={{ color: "var(--muted-2)", marginLeft: 4 }}>runs (30d)</span></div>
                  <div><span className="num" style={{ fontWeight: 500, color: a.success >= 95 ? "var(--pos)" : "var(--warn)" }}>{a.success}%</span><span style={{ color: "var(--muted-2)", marginLeft: 4 }}>success</span></div>
                  <div style={{ flex: 1 }} />
                  <Button variant="text" size="md" iconRight="arrowR">Configure</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageWrap>
  );
}

function Toggle({ on }) {
  return (
    <div style={{
      width: 32, height: 18, borderRadius: 999,
      background: on ? "var(--accent)" : "var(--surface-3)",
      position: "relative", cursor: "pointer",
      boxShadow: on ? "0 0 12px var(--accent-ring-35)" : "inset 0 0 0 1px var(--border)",
      transition: "background 120ms ease",
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

// ────────────── Doc Studio ──────────────
const DOC_TEMPLATES = [
  { title: "Quarterly LP Letter", desc: "Performance narrative + fund KPIs + portfolio highlights", tags: ["Quarterly", "LP-ready"], icon: "quarterly" },
  { title: "Capital Call Notice", desc: "LPA-compliant call notice with wire details and deadlines", tags: ["Operations"], icon: "capitalCall" },
  { title: "Distribution Notice", desc: "Waterfall calc with tax characterization", tags: ["Operations"], icon: "distribution" },
  { title: "Side Letter", desc: "MFN provisions and fee customizations", tags: ["Legal"], icon: "doc" },
  { title: "Investor Onboarding Packet", desc: "Sub docs + W-9/W-8 + wire instructions", tags: ["Onboarding"], icon: "onboard" },
  { title: "Annual Audit Letter", desc: "Statement of fair value with auditor reconciliation", tags: ["Year-end"], icon: "audit" },
];

const RECENT_DOCS = [
  { title: "Q1 2025 LP Letter — Northwind", author: "Morgan Chen", updated: "2h ago", status: "Draft" },
  { title: "Capital Call #7 — Sigma Ventures IV", author: "AI + Morgan Chen", updated: "Yesterday", status: "Sent" },
  { title: "Annual Audit Letter — Aster Credit", author: "Morgan Chen", updated: "3 days ago", status: "In review" },
];

function DocStudioPage() {
  return (
    <PageWrap>
      <PageHeader title="Document Studio"
        subtitle="Draft LP-ready documents with AI. Templates grounded in your fund data."
        actions={<><Button variant="solid" size="md" icon="folder">My drafts</Button><Button variant="primary" size="md" icon="plus" onClick={() => window.zivePopup?.openTemplate()}>New document</Button></>} />

      <div style={{ marginBottom: 10, fontSize: 12, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 500 }}>Templates</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 28 }}>
        {DOC_TEMPLATES.map(t => (
          <Card key={t.title} padding={18} onClick={()=>{}}
            style={{ transition: "transform 120ms ease, background 120ms ease", cursor: "pointer" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: "var(--surface-2)", color: "var(--fg-2)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 14, boxShadow: "inset 0 0 0 1px var(--border)",
            }}>
              <Icon name={t.icon} size={17} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{t.title}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", minHeight: 36, marginBottom: 12 }}>{t.desc}</div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {t.tags.map(tag => <Pill key={tag} tone="outline">{tag}</Pill>)}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginBottom: 10, fontSize: 12, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 500 }}>Recent drafts</div>
      <Card padding={0}>
        {RECENT_DOCS.map((d, i) => (
          <div key={d.title} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "1fr 200px 120px 120px 30px",
            alignItems: "center", gap: 14, padding: "14px 22px",
            borderBottom: i < RECENT_DOCS.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 1px var(--border)" }}>
                <Icon name="docStudio" size={14} color="var(--muted)" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{d.title}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{d.author}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted-2)" }}>{d.updated}</div>
            <div><Pill tone={d.status === "Sent" ? "pos" : d.status === "In review" ? "warn" : "outline"}>{d.status}</Pill></div>
            <Icon name="more" size={14} color="var(--muted-3)" />
          </div>
        ))}
      </Card>
    </PageWrap>
  );
}

// ────────────── MCP ──────────────
const MCP_SERVERS = [
  { name: "QuickBooks Online", type: "Accounting", status: "Connected", tools: 14, color: "#2CA01C" },
  { name: "Carta", type: "Cap Table", status: "Connected", tools: 22, color: "#FF6B35" },
  { name: "iLevel", type: "Portfolio Monitor", status: "Connected", tools: 18, color: "#0071CE" },
  { name: "DocuSign", type: "Signatures", status: "Connected", tools: 8, color: "#FFCC22" },
  { name: "Box", type: "Documents", status: "Connected", tools: 11, color: "#0061D5" },
  { name: "Plaid", type: "Banking", status: "Re-auth", tools: 9, color: "#1E1E1E" },
  { name: "Pitchbook", type: "Market Data", status: "Available", tools: 26, color: "#E2231A" },
];

function MCPPage() {
  return (
    <PageWrap>
      <PageHeader title="MCP" subtitle="Connect external tools — Zive uses them via Model Context Protocol."
        actions={<Button variant="primary" size="md" icon="plus">Add server</Button>} />

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <KPI label="Connected" value="5" delta="6 available" tone="pos" />
        <KPI label="Tools exposed" value="82" />
        <KPI label="Calls (30d)" value="3,124" delta="Across all agents" />
        <KPI label="Avg latency" value="184ms" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {MCP_SERVERS.map(s => (
          <Card key={s.name} padding={18}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                background: s.color, color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, fontWeight: 600,
                boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.1)", flexShrink: 0,
              }}>
                {s.name[0]}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
                  <Pill tone={s.status === "Connected" ? "pos" : s.status === "Re-auth" ? "warn" : "outline"}>{s.status}</Pill>
                </div>
                <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{s.type} • <span className="num">{s.tools}</span> tools</div>
              </div>
              <Button variant="solid" size="md">{s.status === "Available" ? "Connect" : "Manage"}</Button>
            </div>
          </Card>
        ))}
      </div>
    </PageWrap>
  );
}

// ────────────── Accounting ──────────────
const ACCOUNTING_PAGES = [
  { id: "overview", label: "Accounting" },
  { id: "ledger",   label: "General Ledger" },
  { id: "trial",    label: "Trial Balance" },
  { id: "balance",  label: "Balance Sheet" },
  { id: "chart",    label: "Chart of Accounts" },
  { id: "journal",  label: "Journal Entries" },
];

function AccountingPage({ initialSub } = {}) {
  const [page, setPage] = useStateP(initialSub || "overview");
  React.useEffect(() => { if (initialSub) setPage(initialSub); }, [initialSub]);

  if (page !== "overview") {
    const labelMap = Object.fromEntries(ACCOUNTING_PAGES.map(p => [p.id, p.label]));
    return (
      <PageWrap>
        <AccountingHeader
          title={labelMap[page]}
          subTabs={ACCOUNTING_PAGES} page={page} setPage={setPage}
          kind={page}
        />
        {page === "ledger"  && <GeneralLedgerPage />}
        {page === "trial"   && <TrialBalancePage />}
        {page === "balance" && <BalanceSheetPage />}
        {page === "chart"   && <ChartOfAccountsPage />}
        {page === "journal" && <JournalEntriesPage />}
      </PageWrap>
    );
  }

  return <AccountingOverview setPage={setPage} />;
}

function AccountingOverview({ setPage }) {
  const accounts = [
    { name: "Operating — Mercury", bal: 1284650, type: "Checking", seed: 5 },
    { name: "Capital Reserve", bal: 3935000, type: "Savings", seed: 1 },
    { name: "Distribution Flow-Thru", bal: 142500, type: "Checking", seed: 3 },
    { name: "Tax Escrow", bal: 285400, type: "Savings", seed: 2 },
  ];
  const entries = [
    { date: "Apr 21", memo: "Distribution received — Meridian Growth II", debit: 0, credit: 142500, acct: "Distribution Flow-Thru" },
    { date: "Apr 18", memo: "Capital call issued — Sigma Ventures IV #7", debit: 185000, credit: 0, acct: "Operating" },
    { date: "Apr 15", memo: "Mgmt fee — Q1 2025 — Northwind", debit: 12500, credit: 0, acct: "Operating" },
    { date: "Apr 11", memo: "Tax withholding — Harbor RE V K-1", debit: 0, credit: 4820, acct: "Tax Escrow" },
    { date: "Apr 8",  memo: "Distribution received — Northwind Buyout III", debit: 0, credit: 87250, acct: "Distribution Flow-Thru" },
  ];
  return (
    <PageWrap>
      <PageHeader title="Accounting" subtitle="Cash accounts, reconciliation, and GL activity."
        actions={<>
          <PageMenu items={ACCOUNTING_PAGES} value="overview" onChange={setPage} />
          <Button variant="solid" size="md" icon="filter">This month</Button>
          <Button variant="solid" size="md" icon="download">Export GL</Button>
        </>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 20 }}>
        {accounts.map(a => (
          <Card key={a.name} padding={18}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <Orb seed={a.seed} size={26} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{a.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted-2)" }}>{a.type} ••••{1230 + a.seed*17}</div>
              </div>
            </div>
            <BigNum value={fmtMoney(a.bal) + ".00"} size={22} />
          </Card>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>General ledger — recent entries</div>
          <Button variant="text" size="md" iconRight="arrowR">Full ledger</Button>
        </div>
        <TableHeader cols={[
          { label: "Date", w: "90px" },
          { label: "Memo", w: "2fr" },
          { label: "Account", w: "200px" },
          { label: "Debit", w: "120px", align: "right" },
          { label: "Credit", w: "120px", align: "right" },
        ]} />
        {entries.map((e, i) => (
          <div key={i} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "90px 2fr 200px 120px 120px",
            gap: 14, alignItems: "center", padding: "14px 22px",
            borderBottom: i < entries.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div className="num" style={{ fontSize: 12, color: "var(--muted)" }}>{e.date}</div>
            <div style={{ fontSize: 13 }}>{e.memo}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{e.acct}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", color: e.debit ? "var(--fg)" : "var(--muted-3)" }}>{e.debit ? "$" + fmtMoney(e.debit) : "—"}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", color: e.credit ? "var(--pos)" : "var(--muted-3)" }}>{e.credit ? "$" + fmtMoney(e.credit) : "—"}</div>
          </div>
        ))}
      </Card>
    </PageWrap>
  );
}

// ────────────── Reports ──────────────
const REPORT_TABS = [
  { id: "fund",      label: "Fund",            icon: "transfer" },
  { id: "investors", label: "Investors",       icon: "onboard" },
  { id: "updates",   label: "Updates",         icon: "sparkle" },
  { id: "templates", label: "Report Templates", icon: "doc" },
  { id: "lpPortal",  label: "LP Portal Updates", icon: "bell" },
  { id: "audit",     label: "AI QA Audit",     icon: "audit" },
];

function ReportTabStrip({ value, onChange }) {
  return (
    <div style={{
      display: "grid", gridTemplateColumns: `repeat(${REPORT_TABS.length}, 1fr)`,
      gap: 10, padding: 8, background: "var(--surface-2)",
      borderRadius: "var(--r-lg)", boxShadow: "inset 0 0 0 1px var(--border)",
      marginBottom: 24,
    }}>
      {REPORT_TABS.map(t => {
        const active = t.id === value;
        return (
          <button key={t.id} onClick={() => onChange(t.id)} style={{
            background: active ? "var(--surface)" : "transparent",
            border: "none",
            boxShadow: active
              ? "inset 0 0 0 2px var(--accent), 0 1px 2px rgba(0,0,0,0.04)"
              : "inset 0 0 0 1px var(--border)",
            borderRadius: 8, padding: "12px 14px",
            cursor: "pointer", textAlign: "left", fontFamily: "inherit",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            minHeight: 70, gap: 12,
            transition: "all 120ms ease",
          }}
            onMouseEnter={e => { if (!active) e.currentTarget.style.background = "var(--surface)"; }}
            onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)", letterSpacing: -0.2 }}>{t.label}</div>
            <Icon name={t.icon} size={16} color="var(--accent)" />
          </button>
        );
      })}
    </div>
  );
}

// Section card with header (used by Capital Summary etc.)
function ReportSection({ title, columnsBtn = true, children }) {
  return (
    <Card padding={0} style={{ marginBottom: 18 }}>
      {title && (
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 16px", borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--muted)", fontWeight: 500 }}>
            <Icon name="doc" size={13} color="var(--muted-2)" />
            <span>{title}</span>
          </div>
          {columnsBtn && (
            <div style={{ display: "flex", gap: 6 }}>
              <Button variant="solid" size="md" icon="filter">Columns</Button>
              <button style={{
                width: 28, height: 28, borderRadius: 11, border: "none",
                background: "var(--accent-tint)", color: "var(--accent)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", boxShadow: "inset 0 0 0 1px var(--accent-ring-20)",
              }}><Icon name="filter" size={13} /></button>
            </div>
          )}
        </div>
      )}
      {children}
    </Card>
  );
}

// Pure-money cell — colors zero/positive/negative subtly to match screenshot
function MoneyCell({ value, ytd }) {
  const isZero = value === 0;
  const color = isZero ? "var(--accent)" : "var(--fg)";
  const sign = value < 0 ? "-" : "";
  const abs = Math.abs(value);
  const formatted = abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return <span className="num" style={{ color, fontSize: 12.5 }}>{sign}${formatted}</span>;
}

function StatementTable({ rows, hasItd = true, amountOnly = false }) {
  const cols = amountOnly
    ? [{ label: "Account Summary", w: "1fr" }, { label: "Amount", w: "260px", align: "right" }]
    : [
        { label: "Account Summary", w: "1fr" },
        { label: "Statement period", w: "240px", align: "right" },
        { label: "Year to date", w: "240px", align: "right" },
        ...(hasItd ? [{ label: "Inception to date", w: "240px", align: "right" }] : []),
      ];
  const gridTpl = cols.map(c => c.w).join(" ");
  return (
    <>
      <div style={{
        display: "grid", gridTemplateColumns: gridTpl,
        gap: 14, padding: "10px 18px", borderBottom: "1px solid var(--border)",
        fontSize: 11, color: "var(--muted-2)", fontWeight: 500, letterSpacing: 0.3,
      }}>
        {cols.map((c, i) => <div key={i} style={{ textAlign: c.align || "left" }}>{c.label}</div>)}
      </div>
      {rows.map((r, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: gridTpl, gap: 14,
          padding: "12px 18px",
          borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none",
          alignItems: "center",
          background: r.bold ? "var(--chip)" : "transparent",
        }}>
          <div style={{ fontSize: 12.5, color: "var(--fg-2)", fontWeight: r.bold ? 500 : 400 }}>{r.label}</div>
          {amountOnly ? (
            <div style={{ textAlign: "right" }}><MoneyCell value={r.amount} /></div>
          ) : (
            <>
              <div style={{ textAlign: "right" }}><MoneyCell value={r.sp} /></div>
              <div style={{ textAlign: "right" }}><MoneyCell value={r.ytd} /></div>
              {hasItd && <div style={{ textAlign: "right" }}><MoneyCell value={r.itd} /></div>}
            </>
          )}
        </div>
      ))}
    </>
  );
}

function EmptyTable({ cols, rowsLabel = "10", searchable = false }) {
  return (
    <Card padding={0}>
      <div style={{
        display: "grid", gridTemplateColumns: cols.map(c => c.w || "1fr").join(" "),
        gap: 14, padding: "12px 18px", borderBottom: "1px solid var(--border)",
        fontSize: 11, color: "var(--muted-2)", fontWeight: 500, letterSpacing: 0.3,
      }}>
        {cols.map((c, i) => <div key={i} style={{ textAlign: c.align || "left" }}>{c.label}</div>)}
      </div>
      <div style={{ padding: "60px 18px", textAlign: "center", fontSize: 12.5, color: "var(--muted-2)" }}>
        No data available
      </div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 18px", borderTop: "1px solid var(--border)",
        fontSize: 11.5, color: "var(--muted-2)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={reportsPagerBtn}><Icon name="chevronL" size={11} color="var(--muted-2)" /></button>
          <span>Page</span>
          <span style={reportsPagerBox}>1</span>
          <span>of 1</span>
          <button style={reportsPagerBtn}><Icon name="chevronR" size={11} color="var(--muted-2)" /></button>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span>0 - 0 of 0</span>
          <span>Rows</span>
          <span style={{ ...reportsPagerBox, paddingRight: 18, position: "relative" }}>
            {rowsLabel}
            <span style={{ position: "absolute", right: 6, top: "50%", transform: "translateY(-50%)" }}>
              <Icon name="chevronD" size={9} color="var(--muted-2)" />
            </span>
          </span>
        </div>
      </div>
    </Card>
  );
}
const reportsPagerBtn = {
  width: 22, height: 22, borderRadius: 6, border: "1px solid var(--border)",
  background: "var(--surface-2)", display: "inline-flex", alignItems: "center",
  justifyContent: "center", cursor: "pointer",
};
const reportsPagerBox = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  minWidth: 26, height: 22, borderRadius: 6, border: "1px solid var(--border)",
  background: "var(--surface-2)", padding: "0 6px", color: "var(--fg-2)", fontSize: 11.5,
};

function ReportTableHeaderRow({ title, leftActions, rightActions }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: 12,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-2)" }}>{title}</div>
        {leftActions}
      </div>
      <div style={{ display: "flex", gap: 6 }}>{rightActions}</div>
    </div>
  );
}

// Form-row Field used inside Reports panels (smaller / lighter than the global Field)
function ReportField({ label, children, style }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6, ...style }}>
      <span style={{ fontSize: 11, color: "var(--muted-2)", fontWeight: 500 }}>{label}</span>
      {children}
    </label>
  );
}
function ReportSelect({ value, options }) {
  return (
    <div style={{
      height: 36, padding: "0 12px",
      background: "var(--surface)",
      boxShadow: "inset 0 0 0 1px var(--border)",
      borderRadius: 8, color: "var(--fg-2)",
      fontSize: 12.5, display: "flex", alignItems: "center", justifyContent: "space-between",
      cursor: "pointer",
    }}>
      <span>{value}</span>
      <Icon name="chevronD" size={11} color="var(--muted-2)" />
    </div>
  );
}
function ReportDate({ value }) {
  return (
    <div style={{
      height: 36, padding: "0 12px",
      background: "var(--surface)",
      boxShadow: "inset 0 0 0 1px var(--border)",
      borderRadius: 8, color: "var(--fg-2)",
      fontSize: 12.5, display: "flex", alignItems: "center", gap: 8, cursor: "pointer",
      justifyContent: "space-between",
    }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <Icon name="calendar" size={12} color="var(--muted-2)" />
        <span className="num">{value}</span>
      </span>
      <Icon name="chevronD" size={11} color="var(--muted-2)" />
    </div>
  );
}
function GenerateChip({ label, format, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 8,
      height: 32, padding: "0 12px",
      background: "var(--surface)",
      boxShadow: "inset 0 0 0 1px var(--border)",
      borderRadius: 8, border: "none",
      color: "var(--fg-2)", fontSize: 12.5, fontWeight: 500,
      cursor: "pointer", fontFamily: "inherit",
    }}>
      <Icon name="doc" size={13} color="var(--muted-2)" />
      <span>{label}</span>
      <span style={{
        fontSize: 10, fontWeight: 500, padding: "2px 6px", borderRadius: 4,
        background: "var(--chip)", color: "var(--muted-2)", letterSpacing: 0.4,
      }}>{format}</span>
    </button>
  );
}

// ── Tab content ──────────────────────────────
function ReportsFundTab() {
  return (
    <>
      <Card padding={20} style={{ marginBottom: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 18, maxWidth: 720 }}>
          <ReportField label="Year"><ReportSelect value="2026" /></ReportField>
          <ReportField label="Reporting Period"><ReportSelect value="Q1 (Jan–Mar)" /></ReportField>
        </div>
        <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
          <ReportField label="GP Workbook"><GenerateChip label="Generate" format="XLSX" /></ReportField>
          <ReportField label="GP Allocation"><GenerateChip label="Generate" format="XLSX" /></ReportField>
          <ReportField label="GP Report"><GenerateChip label="Generate" format="PDF" /></ReportField>
        </div>
      </Card>
      <Card padding={20}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--accent)", marginBottom: 16 }}>Data Extraction</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <ReportField label="Type" style={{ width: 240 }}><ReportSelect value="LPA" /></ReportField>
          <div style={{ paddingBottom: 10, fontSize: 12, color: "var(--muted)" }}>
            LPA template not found. Please upload an LPA template in Report Templates first
          </div>
        </div>
      </Card>
    </>
  );
}

const CAPITAL_ROWS = [
  { label: "Beginning balance",          sp: 361616.40, ytd: 361616.40, itd: 0 },
  { label: "Capital contribution",       sp: 0,         ytd: 0,         itd: 312500.00 },
  { label: "Unrealized gain (loss)",     sp: 0,         ytd: 0,         itd: 65188.39 },
  { label: "Net operating income (loss)", sp: 0,         ytd: 0,         itd: -16071.98 },
  { label: "Ending balance",             sp: 361616.40, ytd: 361616.40, itd: 361616.40, bold: true },
];
const COMMITMENT_ROWS = [
  { label: "Initial commitment",       sp: 625000.00, ytd: 625000.00, itd: 625000.00 },
  { label: "Contributions",            sp: 0,         ytd: 0,         itd: 312500.00 },
  { label: "Recallable distributions", sp: 0,         ytd: 0,         itd: 0 },
  { label: "Unfunded commitment",      sp: 0,         ytd: 0,         itd: 312500.00 },
  { label: "GP Deposit",               sp: 0,         ytd: 0,         itd: 0 },
];
const CONTRIB_OWNED_ROWS = [
  { label: "Receivable",       amount: 15625.00 },
  { label: "Deferred/prepaid", amount: 0 },
];

function ReportsInvestorsTab() {
  return (
    <>
      <Card padding={20} style={{ marginBottom: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 22 }}>
          <ReportField label="Select Partner"><ReportSelect value="Admin Ventures GP, LLC" /></ReportField>
          <ReportField label="Select Period"><ReportSelect value="Last Quarter" /></ReportField>
          <ReportField label="From Date"><ReportDate value="01/01/2026" /></ReportField>
          <ReportField label="To Date"><ReportDate value="03/31/2026" /></ReportField>
        </div>
        <ReportField label="Generate Period">
          <div style={{ display: "flex", gap: 10 }}>
            <GenerateChip label="All Statements" format="PDF" />
            <GenerateChip label="Statement" format="PDF" />
          </div>
        </ReportField>
      </Card>

      <ReportSection title="Capital Summary"><StatementTable rows={CAPITAL_ROWS} /></ReportSection>
      <ReportSection title="Commitment Summary"><StatementTable rows={COMMITMENT_ROWS} /></ReportSection>
      <ReportSection title="Contributions Owned"><StatementTable rows={CONTRIB_OWNED_ROWS} amountOnly /></ReportSection>
    </>
  );
}

function ReportsUpdatesTab() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <Button variant="solid" size="md" icon="plus">New Update</Button>
      </div>
      <ReportTableHeaderRow
        title="Investor Updates"
        rightActions={<>
          <Button variant="solid" size="md" icon="search">Search</Button>
          <Button variant="solid" size="md" icon="filter">Columns</Button>
        </>}
      />
      <EmptyTable rowsLabel="25" cols={[
        { label: "Emails & Investors", w: "1fr" },
        { label: "Subject",            w: "1fr" },
        { label: "Body",               w: "1fr" },
        { label: "Custom Message",     w: "1fr" },
        { label: "Attachments",        w: "180px" },
        { label: "Status",             w: "120px" },
        { label: "Action",             w: "100px", align: "right" },
      ]} />
    </>
  );
}

const TEMPLATE_CARDS = [
  { title: "Fund Report - Template",        desc: "Comprehensive fund performance and holdings report with standard metrics and analytics.",                                                                                              icon: "chart",   action: "upload" },
  { title: "LPA – Side Letter Template",    desc: "Template for Limited Partnership Agreements with side letter provisions, covering key legal documentation and partnership terms.",                                                       icon: "doc", action: "upload" },
  { title: "Footnotes – Standard Template", desc: "Template for documents requiring footnotes and endnotes, covering citation formatting, reference numbering, and academic or legal annotation standards.",                                 icon: "doc",    action: "upload" },
  { title: "Capital Account Statements",    desc: "Investor-level statements detailing beginning capital, contributions, distributions, allocations (income/fees/carry), preferred return, and ending balance for the period.",              icon: "receipt", action: "soon",   muted: true },
  { title: "Holdings Report",               desc: "Detailed portfolio holdings and allocation breakdown.",                                                                                                                                    icon: "briefcase", action: "soon", muted: true },
];

function ReportsTemplatesTab() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, maxWidth: 1100, margin: "0 auto" }}>
      {TEMPLATE_CARDS.map(t => (
        <Card key={t.title} padding={20} style={{ display: "flex", flexDirection: "column", opacity: t.muted ? 0.55 : 1 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8,
            background: "var(--chip)", color: "var(--muted)",
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
          }}>
            <Icon name={t.icon} size={16} />
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 8, letterSpacing: -0.2 }}>{t.title}</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5, marginBottom: 18, flex: 1 }}>{t.desc}</div>
          {t.action === "upload" ? (
            <button style={{
              height: 34, borderRadius: 8, border: "none",
              background: "var(--surface)",
              boxShadow: "inset 0 0 0 1px var(--accent)",
              color: "var(--accent)", fontSize: 12.5, fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit",
              display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              Upload <Icon name="download" size={13} />
            </button>
          ) : (
            <button disabled style={{
              height: 34, borderRadius: 8, border: "none",
              background: "transparent",
              boxShadow: "inset 0 0 0 1px var(--border)",
              color: "var(--muted-2)", fontSize: 12.5, fontWeight: 500,
              cursor: "not-allowed", fontFamily: "inherit",
            }}>
              Coming soon
            </button>
          )}
        </Card>
      ))}
    </div>
  );
}

function ReportsLPPortalTab() {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <Button variant="solid" size="md" icon="plus">New LP Update</Button>
      </div>
      <ReportTableHeaderRow
        title="LP Updates"
        rightActions={<>
          <Button variant="solid" size="md" icon="search">Search</Button>
          <Button variant="solid" size="md" icon="filter">Columns</Button>
        </>}
      />
      <EmptyTable cols={[
        { label: "Emails",     w: "1fr" },
        { label: "Subject",    w: "1.5fr" },
        { label: "Recipients", w: "1fr" },
        { label: "Attached",   w: "150px" },
        { label: "Sent At",    w: "180px", align: "right" },
      ]} />
    </>
  );
}

function ReportsAuditTab() {
  return (
    <>
      <ReportTableHeaderRow
        title="AI QA Audit"
        rightActions={<>
          <Button variant="solid" size="md" icon="filter">Columns</Button>
        </>}
      />
      <EmptyTable cols={[
        { label: "Event",            w: "1fr" },
        { label: "Date",             w: "200px" },
        { label: "Journal",          w: "2fr" },
        { label: "QA Agent Response", w: "1.5fr", align: "right" },
      ]} />
    </>
  );
}

function ReportsPage() {
  const [tab, setTab] = useStateP("fund");
  return (
    <PageWrap>
      <ReportTabStrip value={tab} onChange={setTab} />
      {tab === "fund"      && <ReportsFundTab />}
      {tab === "investors" && <ReportsInvestorsTab />}
      {tab === "updates"   && <ReportsUpdatesTab />}
      {tab === "templates" && <ReportsTemplatesTab />}
      {tab === "lpPortal"  && <ReportsLPPortalTab />}
      {tab === "audit"     && <ReportsAuditTab />}
    </PageWrap>
  );
}

// ────────────── Quarterly Report ──────────────
const QR_REPORTS = [
  { id: "q1-2025", title: "Q1 2025 LP Report", quarter: "Q1", year: 2025, period: "Jan 1 – Mar 31, 2025", status: "Sent", sentAt: "Apr 18, 2025", funds: 6, pages: 30, nav: 13763681 },
  { id: "q4-2024", title: "Q4 2024 LP Report", quarter: "Q4", year: 2024, period: "Oct 1 – Dec 31, 2024", status: "Sent", sentAt: "Jan 28, 2025", funds: 6, pages: 28, nav: 12942108 },
  { id: "q3-2024", title: "Q3 2024 LP Report", quarter: "Q3", year: 2024, period: "Jul 1 – Sep 30, 2024", status: "Sent", sentAt: "Oct 22, 2024", funds: 5, pages: 26, nav: 11890432 },
  { id: "q2-2024", title: "Q2 2024 LP Report", quarter: "Q2", year: 2024, period: "Apr 1 – Jun 30, 2024", status: "Sent", sentAt: "Jul 19, 2024", funds: 5, pages: 24, nav: 10422016 },
  { id: "q1-2024", title: "Q1 2024 LP Report", quarter: "Q1", year: 2024, period: "Jan 1 – Mar 31, 2024", status: "Sent", sentAt: "Apr 16, 2024", funds: 4, pages: 22, nav: 9450211 },
];

function QuarterlyReportPage() {
  const [previewing, setPreviewing] = useState(null); // report object or "draft" object
  const [genOpen, setGenOpen] = useState(false);

  const sections = [
    { title: "Performance Summary", status: "Ready", pages: 4 },
    { title: "Portfolio Highlights", status: "Ready", pages: 8 },
    { title: "Capital Activity", status: "Ready", pages: 3 },
    { title: "Sector & Stage Exposure", status: "Ready", pages: 5 },
    { title: "ESG & Risk Disclosures", status: "Drafting", pages: 3 },
    { title: "Auditor Letter", status: "Pending GP", pages: 2 },
  ];

  if (previewing) {
    return <QRPreview report={previewing} onBack={() => setPreviewing(null)} />;
  }

  return (
    <PageWrap>
      <PageHeader title="Quarterly Report — Q1 2025"
        subtitle="Consolidated LP report across all active funds."
        actions={<>
          <Button variant="solid" size="md" icon="eye" onClick={() => setPreviewing({ id: "draft", title: "Quarterly Report — Q1 2025", quarter: "Q1", year: 2025, period: "Jan 1 – Mar 31, 2025", funds: 6, pages: 25, nav: 13763681, draft: true })}>Preview</Button>
          <Button variant="solid" size="md" icon="plus" onClick={() => setGenOpen(true)}>Generate</Button>
          <Button variant="primary" size="md" icon="send">Send to LPs</Button>
        </>} />

      <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
        <KPI label="Reporting period" value="Q1 2025" delta="Jan 1 – Mar 31" />
        <KPI label="Pages assembled" value="25" delta="of 30" tone="accent" />
        <KPI label="Funds covered" value="6" />
        <KPI label="Publish target" value="May 15" delta="In 14 days" tone="warn" />
      </div>

      <Card padding={0} style={{ marginBottom: 18 }}>
        <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Sections</div>
          <span style={{ fontSize: 11.5, color: "var(--muted-2)" }}>Click a section to preview</span>
        </div>
        {sections.map((s, i) => (
          <div key={s.title} className="row-hover" onClick={() => setPreviewing({ id: "draft", title: "Quarterly Report — Q1 2025", quarter: "Q1", year: 2025, period: "Jan 1 – Mar 31, 2025", funds: 6, pages: 25, nav: 13763681, draft: true, focusSection: s.title })} style={{
            display: "grid", gridTemplateColumns: "40px 1fr 100px 140px 30px",
            alignItems: "center", gap: 14, padding: "14px 22px", cursor: "pointer",
            borderBottom: i < sections.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div className="num" style={{ fontSize: 12, color: "var(--muted-2)", fontFamily: "var(--font-mono)" }}>{String(i+1).padStart(2,"0")}</div>
            <div style={{ fontSize: 13.5, fontWeight: 500 }}>{s.title}</div>
            <div className="num" style={{ fontSize: 12, color: "var(--muted)" }}>{s.pages} pages</div>
            <div><Pill tone={s.status === "Ready" ? "pos" : s.status === "Drafting" ? "accent" : "warn"}>{s.status}</Pill></div>
            <Icon name="chevronR" size={12} color="var(--muted-3)" />
          </div>
        ))}
      </Card>

      <Card padding={0}>
        <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Past reports</div>
          <span style={{ fontSize: 11.5, color: "var(--muted-2)" }}>{QR_REPORTS.length} sent</span>
        </div>
        <TableHeader cols={[
          { label: "Report", w: "2fr" },
          { label: "Period", w: "200px" },
          { label: "Funds", w: "70px", align: "right" },
          { label: "NAV", w: "150px", align: "right" },
          { label: "Sent", w: "120px" },
          { label: "Status", w: "100px" },
          { label: "", w: "40px" },
        ]} />
        {QR_REPORTS.map((r, i) => (
          <div key={r.id} className="row-hover" onClick={() => setPreviewing(r)} style={{
            display: "grid", gridTemplateColumns: "2fr 200px 70px 150px 120px 100px 40px",
            gap: 14, alignItems: "center", padding: "14px 22px", cursor: "pointer",
            borderBottom: i < QR_REPORTS.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 30, height: 36, borderRadius: 5,
                background: "var(--surface)",
                boxShadow: "inset 0 0 0 1px var(--border)",
                display: "flex", alignItems: "center", justifyContent: "center",
                position: "relative",
              }}>
                <Icon name="doc" size={14} color="var(--accent)" />
                <span style={{ position: "absolute", bottom: 2, left: 0, right: 0, textAlign: "center", fontSize: 7.5, fontFamily: "var(--font-mono)", color: "var(--muted-2)", letterSpacing: 0.4 }}>PDF</span>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{r.title}</div>
                <div style={{ fontSize: 11, color: "var(--muted-2)" }}>{r.pages} pages</div>
              </div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{r.period}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right" }}>{r.funds}</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right" }}>${fmtMoney(r.nav)}</div>
            <div className="num" style={{ fontSize: 12, color: "var(--muted)" }}>{r.sentAt}</div>
            <div><Pill tone="pos">{r.status}</Pill></div>
            <Icon name="chevronR" size={12} color="var(--muted-3)" />
          </div>
        ))}
      </Card>

      {genOpen && <QRGenerateModal onClose={() => setGenOpen(false)} onGenerate={(r) => { setGenOpen(false); setPreviewing(r); }} />}
    </PageWrap>
  );
}

// Inline editable value with a pencil affordance.
// Renders `value` followed by a pencil button. Click toggles an inline input.
// When editing, Enter / blur commits, Esc cancels.
function EditableValue({ value, onChange, mono, fontSize = 13, color, weight = 500, width, align = "left", placeholder, multiline = false }) {
  const [editing, setEditing] = useStateP(false);
  const [draft, setDraft] = useStateP(String(value ?? ""));
  const inputRef = React.useRef(null);

  React.useEffect(() => { if (!editing) setDraft(String(value ?? "")); }, [value, editing]);
  React.useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [editing]);

  const commit = () => { onChange?.(draft); setEditing(false); };
  const cancel = () => { setDraft(String(value ?? "")); setEditing(false); };

  if (editing) {
    const Tag = multiline ? "textarea" : "input";
    return (
      <span style={{ display: "inline-flex", alignItems: "center", gap: 6, width: width || "auto", verticalAlign: "middle" }}>
        <Tag
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => {
            if (e.key === "Enter" && !multiline) { e.preventDefault(); commit(); }
            else if (e.key === "Escape") { e.preventDefault(); cancel(); }
            else if (e.key === "Enter" && multiline && (e.metaKey || e.ctrlKey)) { e.preventDefault(); commit(); }
          }}
          rows={multiline ? 3 : undefined}
          placeholder={placeholder}
          className={mono ? "num" : ""}
          style={{
            flex: 1, minWidth: 40, width: width || "auto",
            padding: "4px 8px", borderRadius: 6,
            background: "var(--bg)",
            border: "1px solid var(--accent)",
            outline: "none",
            color: color || "var(--fg)",
            fontFamily: mono ? "var(--font-mono)" : "inherit",
            fontSize, fontWeight: weight,
            textAlign: align,
            resize: multiline ? "vertical" : "none",
          }}
        />
      </span>
    );
  }

  return (
    <span className="ev-trigger" style={{ display: "inline-flex", alignItems: "center", gap: 6, verticalAlign: "middle" }}>
      <span
        className={mono ? "num" : ""}
        style={{
          fontFamily: mono ? "var(--font-mono)" : "inherit",
          fontSize, fontWeight: weight,
          color: color || "var(--fg)",
          textAlign: align,
        }}
      >
        {value || <span style={{ color: "var(--muted-3)", fontStyle: "italic" }}>{placeholder || "—"}</span>}
      </span>
      <button
        onClick={() => setEditing(true)}
        title="Edit"
        className="ev-pencil"
        style={{
          width: 20, height: 20, borderRadius: 5,
          border: "1px solid var(--border)",
          background: "var(--surface)",
          color: "var(--muted-2)",
          cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          padding: 0, flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.color = "var(--accent)";
          e.currentTarget.style.borderColor = "var(--accent)";
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = "var(--muted-2)";
          e.currentTarget.style.borderColor = "var(--border)";
        }}
      >
        <Icon name="edit" size={10} color="currentColor" />
      </button>
    </span>
  );
}

function QRGenerateModal({ onClose, onGenerate }) {
  const thisYear = new Date().getFullYear();
  const quarterMeta = {
    Q1: { range: "Jan 1 – Mar 31" },
    Q2: { range: "Apr 1 – Jun 30" },
    Q3: { range: "Jul 1 – Sep 30" },
    Q4: { range: "Oct 1 – Dec 31" },
  };

  const [quarter, setQuarter] = useStateP("Q1");
  const [year, setYear] = useStateP(thisYear);

  // Editable report fields — initialized from quarter/year, but editable independently.
  const [data, setData] = useStateP({
    firm: "Admin Ventures",
    fund: "Admin Ventures IV",
    strategy: "Early Stage Venture",
    vintage: "2023",
    currency: "USD",
    auditor: "Grant Thornton",
    nav: 13763681,
    funds: 6,
    pages: 25,
    companies: 7,
    agm: "June 12 · San Francisco · Hybrid",
    note: "We are pleased to present the consolidated LP report. This quarter we made significant strides executing on our investment strategy, focusing on top-quartile early-stage managers.",
  });

  const update = (k, v) => setData(d => ({ ...d, [k]: v }));

  const period = `${quarterMeta[quarter].range}, ${year}`;
  const title = `Quarterly Report — ${quarter} ${year}`;

  const submit = () => {
    onGenerate({
      id: `${quarter.toLowerCase()}-${year}`,
      title, quarter, year, period,
      funds: data.funds,
      pages: data.pages,
      nav: data.nav,
      draft: true,
    });
  };

  return (
    <Modal title="Generate quarterly report" onClose={onClose} width={1080}
      footer={<>
        <span style={{ flex: 1, fontSize: 11.5, color: "var(--muted-2)" }}>
          {quarter} {year} · {data.funds} funds · {data.pages} pages · ~30 sec to assemble
        </span>
        <Button variant="solid" size="md" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="md" icon="sparkle" onClick={submit}>Generate</Button>
      </>}>
      <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 22, alignItems: "start" }}>

        {/* ───── Left: period picker ───── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.55 }}>
            Pick a quarter and year. The preview updates live — click the pencil
            on any field to edit it.
          </p>

          <div>
            <label style={{ display: "block", fontSize: 11, color: "var(--muted-2)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>Quarter</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8 }}>
              {Object.keys(quarterMeta).map(q => {
                const active = q === quarter;
                return (
                  <button key={q} onClick={() => setQuarter(q)} style={{
                    padding: "11px 12px", borderRadius: 9,
                    background: active ? "var(--accent-tint)" : "var(--surface)",
                    border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
                    color: active ? "var(--accent)" : "var(--fg)",
                    fontFamily: "inherit", cursor: "pointer", textAlign: "left",
                    display: "flex", flexDirection: "column", gap: 4,
                  }}>
                    <span style={{ fontSize: 13.5, fontWeight: 600 }}>{q}</span>
                    <span style={{ fontSize: 10.5, color: active ? "var(--accent)" : "var(--muted-2)", opacity: active ? 0.85 : 1 }}>{quarterMeta[q].range}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: 11, color: "var(--muted-2)", fontWeight: 500, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>Year</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
              {[thisYear - 2, thisYear - 1, thisYear].map(y => {
                const active = y === year;
                return (
                  <button key={y} onClick={() => setYear(y)} className="num" style={{
                    padding: "10px", borderRadius: 9,
                    background: active ? "var(--accent-tint)" : "var(--surface)",
                    border: "1px solid " + (active ? "var(--accent)" : "var(--border)"),
                    color: active ? "var(--accent)" : "var(--fg)",
                    fontSize: 14, fontWeight: 500,
                    fontFamily: "var(--font-mono)", cursor: "pointer",
                  }}>{y}</button>
                );
              })}
            </div>
          </div>

          <div style={{
            padding: "12px 14px", borderRadius: 9,
            background: "var(--surface)",
            boxShadow: "inset 0 0 0 1px var(--border)",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: 7, background: "var(--accent-tint)", color: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name="sparkle" size={14} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 500 }}>{quarter} {year}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>{quarterMeta[quarter].range}</div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11.5, color: "var(--muted-2)" }}>
            <Icon name="info" size={11} color="var(--muted-3)" />
            Every value in the preview is editable — hover and click the pencil.
          </div>
        </div>

        {/* ───── Right: live preview ───── */}
        <div style={{
          background: "var(--bg-2)",
          border: "1px solid var(--border)",
          borderRadius: 12,
          padding: 18,
          display: "flex", flexDirection: "column", gap: 12,
          maxHeight: 560, overflow: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.6, textTransform: "uppercase", fontWeight: 500 }}>
            <Icon name="eye" size={11} color="var(--accent)" />
            Live preview · cover page
          </div>

          {/* Cover preview card */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 22,
            boxShadow: "var(--shadow-card)",
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{ fontSize: 10, color: "var(--muted-2)", letterSpacing: 0.6, fontWeight: 500, textTransform: "uppercase" }}>Quarterly LP Report</span>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.5, color: "var(--fg)" }}>Quarterly Report —</span>
                <span style={{ fontSize: 22, fontWeight: 500, letterSpacing: -0.5, color: "var(--accent)", fontFamily: "var(--font-mono)" }}>{quarter} {year}</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{period}</div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, padding: "12px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
              <PreviewField label="Firm" value={data.firm} onChange={v => update("firm", v)} />
              <PreviewField label="Fund" value={data.fund} onChange={v => update("fund", v)} />
              <PreviewField label="Quarter" value={quarter} mono fixed hint="Set via picker" />
              <PreviewField label="Year" value={String(year)} mono fixed hint="Set via picker" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
              <PreviewField label="Strategy" value={data.strategy} onChange={v => update("strategy", v)} />
              <PreviewField label="Vintage" value={data.vintage} mono onChange={v => update("vintage", v)} />
              <PreviewField label="Currency" value={data.currency} mono onChange={v => update("currency", v)} />
              <PreviewField label="Auditor" value={data.auditor} onChange={v => update("auditor", v)} />
            </div>
          </div>

          {/* Headline metrics */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 18,
            display: "flex", flexDirection: "column", gap: 14,
          }}>
            <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.6, textTransform: "uppercase", fontWeight: 500 }}>Headline metrics</div>

            <div>
              <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.4, fontWeight: 500, textTransform: "uppercase", marginBottom: 4 }}>Total NAV</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>$</span>
                <EditableValue
                  value={data.nav}
                  onChange={v => {
                    const n = Number(String(v).replace(/[^0-9.]/g, ""));
                    if (!isNaN(n)) update("nav", n);
                  }}
                  mono
                  fontSize={28}
                  weight={500}
                  width={180}
                />
                <span style={{ fontSize: 12, color: "var(--muted-2)" }}>USD</span>
              </div>
              <div className="num" style={{ fontSize: 11, color: "var(--muted-3)", marginTop: 4 }}>
                ${(data.nav / 1_000_000).toFixed(2)}M
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, paddingTop: 4, borderTop: "1px solid var(--border)" }}>
              <PreviewField label="Funds" value={String(data.funds)} mono onChange={v => { const n = parseInt(v, 10); if (!isNaN(n)) update("funds", n); }} />
              <PreviewField label="Companies" value={String(data.companies)} mono onChange={v => { const n = parseInt(v, 10); if (!isNaN(n)) update("companies", n); }} />
              <PreviewField label="Pages" value={String(data.pages)} mono onChange={v => { const n = parseInt(v, 10); if (!isNaN(n)) update("pages", n); }} />
            </div>
          </div>

          {/* Partners note + AGM */}
          <div style={{
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 18,
            display: "flex", flexDirection: "column", gap: 12,
          }}>
            <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.6, textTransform: "uppercase", fontWeight: 500 }}>Partners note & AGM</div>

            <div>
              <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.4, fontWeight: 500, textTransform: "uppercase", marginBottom: 6 }}>Note</div>
              <EditableValue
                value={data.note}
                onChange={v => update("note", v)}
                fontSize={12.5}
                weight={400}
                color="var(--fg-2)"
                multiline
                width={520}
              />
            </div>

            <div>
              <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.4, fontWeight: 500, textTransform: "uppercase", marginBottom: 4 }}>AGM</div>
              <EditableValue
                value={data.agm}
                onChange={v => update("agm", v)}
                fontSize={12.5}
                weight={500}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

// Compact label + editable value row used inside the live preview.
function PreviewField({ label, value, onChange, mono, fixed, hint }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <div style={{ fontSize: 10, color: "var(--muted-2)", letterSpacing: 0.4, fontWeight: 500, textTransform: "uppercase" }}>{label}</div>
      {fixed ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span className={mono ? "num" : ""} style={{ fontSize: 13, fontWeight: 500, fontFamily: mono ? "var(--font-mono)" : "inherit" }}>{value}</span>
          {hint && <span style={{ fontSize: 10, color: "var(--muted-3)" }}>· {hint}</span>}
        </div>
      ) : (
        <EditableValue value={value} onChange={onChange} mono={mono} fontSize={13} weight={500} />
      )}
    </div>
  );
}

// ────────────── Audit Report ──────────────
function AuditReportPage() {
  const items = [
    { name: "Sigma Ventures IV", auditor: "Grant Thornton", status: "In progress", due: "Jun 15", pct: 62, orb: 0 },
    { name: "Meridian Growth II", auditor: "EY", status: "Ready for review", due: "May 28", pct: 100, orb: 1 },
    { name: "Harbor Real Estate V", auditor: "KPMG", status: "In progress", due: "Jun 30", pct: 38, orb: 2 },
    { name: "Northwind Buyout III", auditor: "Deloitte", status: "Completed", due: "Apr 30", pct: 100, orb: 3 },
    { name: "Aster Credit Partners II", auditor: "PwC", status: "Not started", due: "Jul 15", pct: 0, orb: 4 },
    { name: "Kinetic Ventures III", auditor: "Grant Thornton", status: "In progress", due: "Jun 20", pct: 75, orb: 5 },
  ];
  return (
    <PageWrap>
      <PageHeader title="Audit Report — FY 2024"
        subtitle="Fund-by-fund audit status and reconciliations."
        actions={<Button variant="solid" size="md" icon="download">Download ZIP</Button>} />

      <Card padding={0}>
        <TableHeader cols={[
          { label: "Fund", w: "2fr" },
          { label: "Auditor", w: "180px" },
          { label: "Due", w: "110px" },
          { label: "Progress", w: "180px" },
          { label: "Status", w: "160px" },
        ]} />
        {items.map((it, i) => (
          <div key={it.name} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "2fr 180px 110px 180px 160px",
            gap: 14, alignItems: "center", padding: "14px 22px",
            borderBottom: i < items.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Orb seed={it.orb} size={26} />
              <div style={{ fontSize: 13, fontWeight: 500 }}>{it.name}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{it.auditor}</div>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{it.due}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1 }}><Progress value={it.pct} color={it.pct === 100 ? "var(--pos)" : "var(--accent)"} /></div>
              <span className="num" style={{ fontSize: 11.5, color: "var(--muted-2)", width: 32 }}>{it.pct}%</span>
            </div>
            <div><Pill tone={it.status === "Completed" ? "pos" : it.status === "Ready for review" ? "accent" : it.status === "In progress" ? "outline" : "warn"}>{it.status}</Pill></div>
          </div>
        ))}
      </Card>
    </PageWrap>
  );
}

// ────────────── LP Interest ──────────────
// ────────────── LP Interest ──────────────
function LPInterestPage() {
  const [prospects, setProspects] = useState([
    { name: "Ashford Wealth Partners", email: "ir@ashford.com",      type: "LIMITED PARTNER", commit: 3000000, status: "Interest expressed",   sent: "Mar 14, 2026", heat: "hot",  seed: 0 },
    { name: "Olivetree Foundation",    email: "alloc@olivetree.org", type: "LIMITED PARTNER", commit: 5000000, status: "Interest expressed",   sent: "Mar 12, 2026", heat: "hot",  seed: 1 },
    { name: "Cypress Endowment",       email: "ic@cypressendow.edu", type: "LIMITED PARTNER", commit: 2500000, status: "Invited",              sent: "Mar 18, 2026", heat: "warm", seed: 2 },
    { name: "Meridian Family Office",  email: "team@meridianfo.com", type: "LIMITED PARTNER", commit: 1500000, status: "Invited",              sent: "Mar 22, 2026", heat: "warm", seed: 3 },
    { name: "Hillcrest Ventures",      email: "lp@hillcrest.vc",     type: "LIMITED PARTNER", commit: 1000000, status: "Moved to onboarding",  sent: "Feb 28, 2026", heat: "hot",  seed: 4 },
    { name: "Redwood Capital",         email: "ops@redwoodcap.com",  type: "LIMITED PARTNER", commit: 2000000, status: "Passed",               sent: "Feb 22, 2026", heat: "cool", seed: 5 },
  ]);

  const [selected, setSelected] = useState(new Set());
  const [tab, setTab] = useState("overview");
  const [filter, setFilter] = useState("all");

  // Modals
  const [addOpen, setAddOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [sendOpen, setSendOpen] = useState(false);
  const [onboardOpen, setOnboardOpen] = useState(false);
  const [profile, setProfile] = useState(null);

  const stats = useMemo(() => ({
    all:     prospects.length,
    invited: prospects.filter(p => p.status === "Invited").length,
    expressed: prospects.filter(p => p.status === "Interest expressed").length,
    passed:  prospects.filter(p => p.status === "Passed").length,
    onboard: prospects.filter(p => p.status === "Moved to onboarding").length,
  }), [prospects]);

  const filtered = filter === "all" ? prospects : prospects.filter(p => {
    if (filter === "invited") return p.status === "Invited";
    if (filter === "expressed") return p.status === "Interest expressed";
    if (filter === "passed") return p.status === "Passed";
    if (filter === "onboard") return p.status === "Moved to onboarding";
    return true;
  });

  const allChecked = filtered.length > 0 && filtered.every(p => selected.has(p.email));
  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(filtered.map(p => p.email)));
  };
  const toggleOne = (email) => {
    const next = new Set(selected);
    if (next.has(email)) next.delete(email); else next.add(email);
    setSelected(next);
  };

  const moveSelectedToOnboarding = () => {
    setProspects(ps => ps.map(p => selected.has(p.email) ? { ...p, status: "Moved to onboarding" } : p));
    setSelected(new Set());
    setOnboardOpen(false);
  };

  const heatColors = { hot: "#FF7A6A", warm: "#FFB467", cool: "#6AE1FF" };
  const statusTone = (s) => (
    s === "Interest expressed" ? "pos" :
    s === "Moved to onboarding" ? "accent" :
    s === "Passed" ? "neg" :
    "outline"
  );

  return (
    <PageWrap>
      <PageHeader title="LP Interest"
        subtitle="Prospective investor pipeline across upcoming funds." />

      {/* Tabs (single tab strip — Overview) */}
      <div style={{ display: "flex", gap: 6, marginBottom: 18, borderBottom: "1px solid var(--border)" }}>
        {[{ id: "overview", label: "Overview" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 14px", background: "transparent", border: "none",
            borderBottom: `2px solid ${tab === t.id ? "var(--accent)" : "transparent"}`,
            color: tab === t.id ? "var(--fg)" : "var(--muted)",
            cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
            marginBottom: -1,
          }}>{t.label}</button>
        ))}
      </div>

      <div style={{ fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 500, marginBottom: 10 }}>Investor Status Overview</div>

      {/* Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 22 }}>
        <LPStatTile active={filter === "all"}       onClick={() => setFilter("all")}       label="All Prospects"           value={stats.all}      />
        <LPStatTile active={filter === "invited"}   onClick={() => setFilter("invited")}   label="Invited / Not Submitted" value={stats.invited}  />
        <LPStatTile active={filter === "expressed"} onClick={() => setFilter("expressed")} label="Interest Expressed"      value={stats.expressed} sub={stats.expressed > 0 ? `$${fmtMoney(prospects.filter(p => p.status === "Interest expressed").reduce((s, p) => s + p.commit, 0))} pipeline` : "0 investors"} tone="accent" />
        <LPStatTile active={filter === "passed"}    onClick={() => setFilter("passed")}    label="Passed Investors"        value={stats.passed}   />
        <LPStatTile active={filter === "onboard"}   onClick={() => setFilter("onboard")}   label="Moved To LP Onboarding"  value={stats.onboard}  />
      </div>

      {/* Action bar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginBottom: 14 }}>
        <Button variant="primary" size="md" icon="plus"      onClick={() => setAddOpen(true)}>Add New LP</Button>
        <Button variant="solid"   size="md" icon="upload"    onClick={() => setUploadOpen(true)}>Upload XLSX File</Button>
        <Button variant="solid"   size="md" icon="send"      onClick={() => setSendOpen(true)}>Send Form</Button>
        <Button variant="solid"   size="md" icon="users"     onClick={() => selected.size > 0 ? setOnboardOpen(true) : alert("Select at least one prospect first.")}>Onboard LPs {selected.size > 0 && `(${selected.size})`}</Button>
      </div>

      {/* Table */}
      <Card padding={0}>
        <div style={{ display: "grid", gridTemplateColumns: "44px 2fr 1.6fr 160px 160px 140px 90px",
          gap: 14, alignItems: "center", padding: "12px 22px",
          borderBottom: "1px solid var(--border)",
          fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500,
        }}>
          <input type="checkbox" checked={allChecked} onChange={toggleAll} style={{ accentColor: "var(--accent)", cursor: "pointer" }} />
          <span>User name</span>
          <span>E-mail</span>
          <span>User type</span>
          <span>Commitment</span>
          <span>Status</span>
          <span style={{ textAlign: "right" }}>Heat</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: "60px 22px", textAlign: "center", color: "var(--muted-2)", fontSize: 13 }}>
            <Icon name="users" size={28} color="var(--muted-3)" />
            <div style={{ marginTop: 10 }}>No data available</div>
          </div>
        ) : filtered.map((p, i) => (
          <div key={p.email} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "44px 2fr 1.6fr 160px 160px 140px 90px",
            gap: 14, alignItems: "center", padding: "14px 22px",
            borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <input type="checkbox" checked={selected.has(p.email)} onChange={() => toggleOne(p.email)} style={{ accentColor: "var(--accent)", cursor: "pointer" }} />
            <button onClick={() => setProfile(p)} style={{
              display: "flex", alignItems: "center", gap: 12, padding: 0,
              background: "transparent", border: "none", cursor: "pointer", textAlign: "left",
            }}>
              <Orb seed={p.seed} size={26} />
              <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>{p.name}</span>
            </button>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{p.email}</div>
            <div style={{ fontSize: 11, color: "var(--muted-2)", letterSpacing: 0.4 }}>{p.type}</div>
            <div className="num" style={{ fontSize: 13, fontWeight: 500 }}>${fmtMoney(p.commit)}</div>
            <div><Pill tone={statusTone(p.status)}>{p.status}</Pill></div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: heatColors[p.heat] }} />
            </div>
          </div>
        ))}

        {/* Pagination */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "12px 22px", borderTop: "1px solid var(--border)",
          fontSize: 12, color: "var(--muted-2)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button style={lpPagerBtn} title="Prev"><Icon name="chevronL" size={11} color="var(--muted-2)" /></button>
            <span>Page</span>
            <span className="num" style={{ padding: "2px 8px", border: "1px solid var(--border)", borderRadius: 6, color: "var(--fg)" }}>1</span>
            <span>of 1</span>
            <button style={lpPagerBtn} title="Next"><Icon name="chevronR" size={11} color="var(--muted-2)" /></button>
          </div>
          <div>1 – {filtered.length} of {prospects.length}</div>
        </div>
      </Card>

      {addOpen      && <AddLPModal     onClose={() => setAddOpen(false)}     onCreate={(p) => { setProspects(ps => [p, ...ps]); setAddOpen(false); }} />}
      {uploadOpen   && <UploadXLSXModal onClose={() => setUploadOpen(false)} />}
      {sendOpen     && <SendFormModal  onClose={() => setSendOpen(false)} prospects={prospects} />}
      {onboardOpen  && <OnboardLPsConfirm onClose={() => setOnboardOpen(false)} count={selected.size} onConfirm={moveSelectedToOnboarding} />}
      {profile      && <Modal title={profile.name} width={520} onClose={() => setProfile(null)}>
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Orb seed={profile.seed} size={48} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 500 }}>{profile.name}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{profile.email}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
            <KV label="Type" value={profile.type} />
            <KV label="Commitment" value={`$${fmtMoney(profile.commit)}`} mono />
            <KV label="Status" value={<Pill tone={statusTone(profile.status)}>{profile.status}</Pill>} />
            <KV label="Form sent" value={profile.sent} />
          </div>
        </div>
      </Modal>}
    </PageWrap>
  );
}

function LPStatTile({ label, value, sub, active, tone, onClick }) {
  return (
    <button onClick={onClick} style={{
      textAlign: "left", padding: "16px 18px",
      background: active ? "var(--surface-2)" : "var(--surface)",
      border: "1px solid",
      borderColor: active ? "var(--accent)" : "var(--border)",
      borderRadius: 10, cursor: "pointer", fontFamily: "inherit",
      transition: "all 120ms ease",
      boxShadow: active ? "0 0 0 3px var(--accent-ring-10)" : "none",
    }}>
      <div style={{ fontSize: 10.5, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div className="num" style={{ fontSize: 26, fontWeight: 500, letterSpacing: -0.6, color: tone === "accent" ? "var(--accent)" : "var(--fg)" }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 4 }}>{sub}</div>}
    </button>
  );
}

const lpPagerBtn = {
  width: 24, height: 24, borderRadius: 5,
  background: "transparent", border: "1px solid var(--border)",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer",
};

function KV({ label, value, mono }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.5, fontWeight: 500, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div className={mono ? "num" : ""} style={{ fontSize: 13, fontWeight: 500 }}>{value}</div>
    </div>
  );
}

// ─── Add New LP — 3-step wizard
function AddLPModal({ onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: "", lastName: "", company: "", email: "",
    role: "LIMITED PARTNER", access: "USER",
    canSee: true, canSign: false, canModify: false, fundsAll: false,
    commit: 1000000,
  });
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const canNext1 = form.firstName && form.lastName && form.company && form.email;

  const submit = () => {
    onCreate({
      name: `${form.company}`,
      email: form.email,
      type: form.role,
      commit: Number(form.commit) || 0,
      status: "Invited",
      sent: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      heat: "warm",
      seed: Math.floor(Math.random() * 8),
    });
  };

  return (
    <Modal title="Add User" width={760} onClose={onClose}
      footer={
        <div style={{ display: "flex", gap: 8 }}>
          {step > 1 && <Button variant="solid" size="md" onClick={() => setStep(step - 1)}>Back</Button>}
          {step < 3 ? (
            <Button variant="primary" size="md" onClick={() => { if (step === 1 && !canNext1) return; setStep(step + 1); }} style={step === 1 && !canNext1 ? { opacity: 0.5, pointerEvents: "none" } : {}}>Next</Button>
          ) : (
            <Button variant="primary" size="md" icon="check" onClick={submit}>Add and Submit</Button>
          )}
        </div>
      }>
      <div style={{ padding: 26 }}>
        {/* Stepper */}
        <Stepper steps={["Details", "Add Investment", "Permissions and Notifications"]} current={step} />

        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 26 }}>
            <Field label="First Name"><Input value={form.firstName} onChange={v => set("firstName", v)} /></Field>
            <Field label="Last Name"><Input value={form.lastName} onChange={v => set("lastName", v)} /></Field>
            <Field label="Entity Name"><Input value={form.company} onChange={v => set("company", v)} /></Field>
            <Field label="E-mail"><Input value={form.email} onChange={v => set("email", v)} type="email" /></Field>
            <Field label="Role">
              <Select value={form.role} onChange={v => set("role", v)} options={["LIMITED PARTNER", "GENERAL PARTNER", "FUND ADMIN", "ADVISOR"]} />
            </Field>
            <Field label="Access Type">
              <Select value={form.access} onChange={v => set("access", v)} options={["USER", "ADMIN"]} />
            </Field>
          </div>
        )}

        {step === 2 && (
          <div style={{ marginTop: 26, display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Fund">
              <Select value="Admin Ventures IV" onChange={() => {}} options={["Admin Ventures IV", "Admin Ventures V"]} />
            </Field>
            <Field label="Commitment Amount (USD)">
              <Input mono value={form.commit} onChange={v => set("commit", v)} />
            </Field>
            <Field label="Investment Vehicle">
              <Select value="Direct" onChange={() => {}} options={["Direct", "SPV", "Feeder Fund"]} />
            </Field>
          </div>
        )}

        {step === 3 && (
          <div style={{ marginTop: 26, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
            <CheckRow checked={form.canSee}    onChange={v => set("canSee", v)}    label="Investor Can See Confidential" />
            <CheckRow checked={form.canSign}   onChange={v => set("canSign", v)}   label="Investor Sign Sub Documents" />
            <CheckRow checked={form.canModify} onChange={v => set("canModify", v)} label="Override Notify on Investments" />
            <CheckRow checked={form.fundsAll}  onChange={v => set("fundsAll", v)}  label="Select All Other Funds" />
            <div style={{ gridColumn: "1 / -1" }}>
              <Field label="Default Cover Funds">
                <Select value="Admin Ventures IV" onChange={() => {}} options={["Admin Ventures IV", "Admin Ventures V"]} />
              </Field>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function Stepper({ steps, current }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
      {steps.map((s, i) => {
        const idx = i + 1;
        const done = idx < current;
        const here = idx === current;
        return (
          <React.Fragment key={s}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{
                width: 22, height: 22, borderRadius: 999,
                background: done ? "var(--accent)" : here ? "var(--accent-tint)" : "var(--surface-2)",
                color: done ? "#fff" : here ? "var(--accent)" : "var(--muted-2)",
                fontSize: 11, fontWeight: 500,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                boxShadow: here ? "0 0 0 3px var(--accent-ring-18)" : "inset 0 0 0 1px var(--border)",
              }}>{done ? "✓" : idx}</span>
              <span style={{ fontSize: 12, color: here ? "var(--fg)" : "var(--muted)", fontWeight: here ? 500 : 450 }}>{s}</span>
            </div>
            {i < steps.length - 1 && <div style={{ flex: 1, height: 1, background: done ? "var(--accent)" : "var(--border)" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 11, color: "var(--muted-2)", letterSpacing: 0.5, fontWeight: 500, textTransform: "uppercase" }}>{label}</span>
      {children}
    </label>
  );
}

function Input({ value, onChange, type = "text", mono }) {
  return (
    <input value={value} onChange={e => onChange(e.target.value)} type={type} className={mono ? "num" : ""} style={{
      height: 38, padding: "0 12px",
      background: "var(--surface-2)",
      border: "1px solid var(--border)",
      borderRadius: 7, color: "var(--fg)",
      fontSize: 13, fontFamily: mono ? "var(--font-mono)" : "inherit", outline: "none",
    }} />
  );
}

function Select({ value, onChange, options }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)} style={{
      height: 38, padding: "0 12px",
      background: "var(--surface-2)",
      border: "1px solid var(--border)",
      borderRadius: 7, color: "var(--fg)",
      fontSize: 13, fontFamily: "inherit", outline: "none",
      appearance: "none",
      backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='none' stroke='%23999' stroke-width='1.5' d='M1 1l4 4 4-4'/></svg>\")",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 12px center",
      paddingRight: 32,
    }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function CheckRow({ checked, onChange, label }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ accentColor: "var(--accent)", width: 16, height: 16 }} />
      <span style={{ fontSize: 13, color: "var(--fg-2)" }}>{label}</span>
    </label>
  );
}

// ─── Upload XLSX
function UploadXLSXModal({ onClose }) {
  const [drag, setDrag] = useState(false);
  const [file, setFile] = useState(null);

  return (
    <Modal title="Upload XLSX File" width={620} onClose={onClose}
      footer={file && <Button variant="primary" size="md" icon="upload" onClick={() => { alert(`Imported ${file.name}.`); onClose(); }}>Import {file.name}</Button>}>
      <div style={{ padding: 26, display: "flex", flexDirection: "column", alignItems: "center", gap: 22 }}>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 14px", borderRadius: 7,
          background: "var(--accent)", color: "#fff",
          border: "none", cursor: "pointer",
          fontFamily: "inherit", fontSize: 12.5, fontWeight: 500,
        }}>
          <Icon name="download" size={12} color="#fff" /> Download Template
        </button>

        <label
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files?.[0]; if (f) setFile(f); }}
          style={{
            width: "100%", padding: "44px 24px",
            border: `2px dashed ${drag ? "var(--accent)" : "var(--border-strong)"}`,
            borderRadius: 12,
            background: drag ? "var(--accent-tint)" : "var(--surface-2)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            cursor: "pointer", textAlign: "center",
            transition: "all 120ms ease",
          }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "var(--accent-tint)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="upload" size={22} color="var(--accent)" />
          </div>
          <div style={{ fontSize: 13, color: "var(--fg-2)" }}>
            {file ? <><strong>{file.name}</strong> selected</> : "Drag and drop your document here"}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>
            Only XLSX format allowed — Max size: 10MB
          </div>
          <input type="file" accept=".xlsx" hidden onChange={e => setFile(e.target.files?.[0] || null)} />
          <span style={{
            marginTop: 4, padding: "7px 16px",
            background: "var(--accent)", color: "#fff",
            borderRadius: 7, fontSize: 12.5, fontWeight: 500,
          }}>Browse Files</span>
        </label>
      </div>
    </Modal>
  );
}

// ─── Send Form
function SendFormModal({ onClose, prospects }) {
  const [pick, setPick] = useState(new Set());
  const [tmpl, setTmpl] = useState("Initial interest form");
  const [note, setNote] = useState("Hi — we'd love to gauge your interest in our upcoming fund. Please complete the attached form at your convenience.");
  const toggle = e => {
    const next = new Set(pick);
    if (next.has(e)) next.delete(e); else next.add(e);
    setPick(next);
  };
  return (
    <Modal title="Send Form" width={680} onClose={onClose}
      footer={<>
        <Button variant="solid" size="md" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="md" icon="send" onClick={() => { if (pick.size === 0) return; alert(`Sent "${tmpl}" to ${pick.size} recipients.`); onClose(); }} style={pick.size === 0 ? { opacity: 0.5, pointerEvents: "none" } : {}}>Send to {pick.size}</Button>
      </>}>
      <div style={{ padding: 26, display: "flex", flexDirection: "column", gap: 18 }}>
        <Field label="Form template">
          <Select value={tmpl} onChange={setTmpl} options={["Initial interest form", "Soft circle form", "Subscription pre-check", "Custom (link only)"]} />
        </Field>

        <div>
          <div style={{ fontSize: 11, color: "var(--muted-2)", letterSpacing: 0.5, fontWeight: 500, textTransform: "uppercase", marginBottom: 8 }}>Recipients</div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 8, maxHeight: 220, overflowY: "auto" }}>
            {prospects.map((p, i) => (
              <label key={p.email} style={{
                display: "flex", alignItems: "center", gap: 12,
                padding: "10px 14px",
                borderBottom: i < prospects.length - 1 ? "1px solid var(--border)" : "none",
                cursor: "pointer",
              }}>
                <input type="checkbox" checked={pick.has(p.email)} onChange={() => toggle(p.email)} style={{ accentColor: "var(--accent)" }} />
                <Orb seed={p.seed} size={22} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500 }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted-2)" }}>{p.email}</div>
                </div>
                <Pill tone="outline">{p.status}</Pill>
              </label>
            ))}
          </div>
        </div>

        <Field label="Message">
          <textarea value={note} onChange={e => setNote(e.target.value)} rows={4} style={{
            padding: 12, background: "var(--surface-2)",
            border: "1px solid var(--border)", borderRadius: 7,
            color: "var(--fg)", fontSize: 13, fontFamily: "inherit",
            resize: "vertical", outline: "none",
          }} />
        </Field>
      </div>
    </Modal>
  );
}

// ─── Onboard confirm
function OnboardLPsConfirm({ onClose, count, onConfirm }) {
  return (
    <Modal title="Move LPs to Onboarding" width={520} onClose={onClose}
      footer={<>
        <Button variant="solid" size="md" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="md" icon="users" onClick={onConfirm}>Confirm</Button>
      </>}>
      <div style={{ padding: 26, fontSize: 13, color: "var(--fg-2)", lineHeight: 1.6 }}>
        You are about to move <strong>{count}</strong> {count === 1 ? "investor" : "investors"} to LP Onboarding. This kicks off the 6-step onboarding flow (NDA → KYC → sub docs → wire → side letter → portal access). You'll be able to track progress on the LP Onboarding page.
      </div>
    </Modal>
  );
}

// ────────────── LP Onboarding ──────────────
function LPOnboardingPage() {
  const [page, setPage] = useStateP("active");
  const [tab, setTab] = useStateP("overview");
  const [addOpen, setAddOpen] = useStateP(false);
  const [lps, setLps] = useStateP([
    {
      first: "Test", last: "Forster", email: "the-website-frontend@gmail.com",
      entity: "Lawrence Heritage Trust", type: "LIMITED PARTNER",
      address: "—", commitment: 100000, status: "Pending",
      statusDetail: "Pending on LP info as of May 4, 2026 at 11:53 AM",
      seed: 1,
    },
  ]);

  const totals = useMemoP(() => {
    const t = { prospective: 0, invited: 0, signed: 0, contributed: 0 };
    for (const lp of lps) {
      const s = (lp.status || "").toLowerCase();
      if (s.includes("pending") || s.includes("invited")) t.invited += lp.commitment || 0;
      else if (s.includes("sign")) t.signed += lp.commitment || 0;
      else if (s.includes("contribut")) t.contributed += lp.commitment || 0;
      else t.prospective += lp.commitment || 0;
    }
    return t;
  }, [lps]);

  const goal = 500000;
  const breakdown = [
    { key: "Committed", value: totals.contributed, color: "#7CC4FF" },
    { key: "Signed", value: totals.signed, color: "#5DD3A8" },
    { key: "In Progress", value: totals.invited, color: "#A48BFF" },
    { key: "Prospective", value: totals.prospective, color: "var(--muted-3)" },
  ];
  const totalRaised = totals.contributed + totals.signed + totals.invited + totals.prospective;

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "settings", label: "Settings" },
    { id: "vicums", label: "VICUMS" },
    { id: "demand", label: "Demand info" },
  ];

  return (
    <PageWrap>
      {/* Tab strip — segmented pill */}
      <div style={{ marginBottom: 22 }}>
        <div style={{
          display: "inline-flex", alignItems: "center",
          background: "var(--surface-2)",
          border: "1px solid var(--border)",
          borderRadius: 10, padding: 3,
        }}>
          {tabs.map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "7px 16px",
                background: active ? "var(--surface-1)" : "transparent",
                border: "none", borderRadius: 7, cursor: "pointer",
                fontSize: 12.5, fontFamily: "inherit",
                color: active ? "var(--fg)" : "var(--muted-2)",
                fontWeight: active ? 500 : 400,
                boxShadow: active ? "0 1px 2px rgba(0,0,0,0.06), 0 0 0 1px var(--border)" : "none",
                transition: "background 120ms, color 120ms",
              }}>{t.label}</button>
            );
          })}
        </div>
      </div>

      {tab === "settings" && <LPOnboardingSettings />}
      {tab === "vicums" && <LPOnboardingVicums />}
      {tab === "demand" && <LPOnboardingDemandInfo />}

      {tab === "overview" && <>
      {/* Investor Status Overview */}
      <div style={{ fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 500, marginBottom: 10 }}>
        Investor Status Overview
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 26 }}>
        <LPKPI label="Prospective" amount={totals.prospective} sub="0 investors" tone="muted" />
        <LPKPI label="Invited" amount={totals.invited} sub={`${lps.filter(l => /pending|invited/i.test(l.status||"")).length} investors`} tone="accent" />
        <LPKPI label="Signed" amount={totals.signed} sub="0 investors" tone="pos" />
        <LPKPI label="Contributed" amount={totals.contributed} sub="0 investors" tone="info" />
      </div>

      {/* Fundraising Progress */}
      <div style={{ fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 500, marginBottom: 10 }}>
        Fundraising Progress
      </div>
      <Card padding={18} style={{ marginBottom: 26 }}>
        <div style={{
          display: "flex", height: 10, borderRadius: 999, overflow: "hidden",
          background: "var(--surface-3)",
          marginBottom: 14,
        }}>
          {breakdown.map(b => b.value > 0 && (
            <div key={b.key} style={{
              width: `${Math.min(100, (b.value / Math.max(goal, totalRaised)) * 100)}%`,
              background: b.color,
              height: "100%",
            }} title={`${b.key}: $${b.value.toLocaleString()}`} />
          ))}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 18, fontSize: 12 }}>
          {breakdown.map(b => (
            <div key={b.key} style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "var(--muted)" }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: b.color, display: "inline-block" }} />
              <span>{b.key}: <span className="num" style={{ color: "var(--fg)" }}>${b.value.toLocaleString()}</span></span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div style={{ color: "var(--muted-2)" }}>Goal: <span className="num" style={{ color: "var(--fg)" }}>${goal.toLocaleString()}</span></div>
        </div>
      </Card>

      {/* Limited Partners */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)", borderBottom: "2px solid var(--accent)", paddingBottom: 4 }}>
          Limited Partners
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ position: "relative", flex: "0 0 280px" }}>
          <Icon name="search" size={13} color="var(--muted-2)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
          <input placeholder="Search" style={{
            width: "100%", padding: "8px 10px 8px 30px",
            borderRadius: 8, background: "var(--surface-2)",
            border: "1px solid var(--border)", color: "var(--fg)",
            fontSize: 12.5, fontFamily: "inherit", outline: "none",
          }} />
        </div>
        <div style={{ flex: 1 }} />
        <Button variant="primary" size="md" icon="plus" onClick={() => setAddOpen(true)}>Add New LP</Button>
        <Button variant="solid" size="md" icon="plus">Add New Account</Button>
        <Button variant="ghost" size="md" icon="send">Invite All</Button>
        <Button variant="ghost" size="md" icon="upload">Bulk Upload Users</Button>
      </div>

      <Card padding={0}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 14px", borderBottom: "1px solid var(--border)" }}>
          <button title="Columns" style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "transparent", border: "1px solid var(--border)", borderRadius: 6,
            padding: "5px 10px", cursor: "pointer", fontSize: 11.5, color: "var(--muted)",
            fontFamily: "inherit",
          }}>
            <Icon name="filter" size={11} color="var(--muted)" /> Columns
          </button>
        </div>

        <TableHeader cols={[
          { label: "User Name", w: "1.4fr" },
          { label: "Email", w: "1.6fr" },
          { label: "Entity Name", w: "1.4fr" },
          { label: "User Type", w: "140px" },
          { label: "Address", w: "100px" },
          { label: "Commitment", w: "120px", align: "right" },
          { label: "Status", w: "200px" },
          { label: "User Action", w: "110px" },
        ]} />

        {lps.length === 0 ? (
          <div style={{ padding: "60px 22px", textAlign: "center", color: "var(--muted-2)", fontSize: 12.5 }}>No data</div>
        ) : (
          lps.map((lp, i) => (
            <div key={i} className="row-hover" style={{
              display: "grid", gridTemplateColumns: "1.4fr 1.6fr 1.4fr 140px 100px 120px 200px 110px",
              gap: 14, alignItems: "center", padding: "14px 22px",
              borderBottom: i < lps.length-1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar name={`${lp.first} ${lp.last}`} size={26} seed={lp.seed} />
                <div style={{ fontSize: 13, fontWeight: 500 }}>{lp.first} {lp.last}</div>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{lp.email}</div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{lp.entity}</div>
              <div><Pill tone="outline" style={{ textTransform: "uppercase", fontSize: 10, letterSpacing: 0.4 }}>{lp.type}</Pill></div>
              <div style={{ fontSize: 12, color: "var(--muted-2)" }}>{lp.address}</div>
              <div className="num" style={{ fontSize: 13, fontWeight: 500, textAlign: "right" }}>${lp.commitment.toLocaleString()}</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.4 }}>{lp.statusDetail || lp.status}</div>
              <div style={{ display: "flex", gap: 6 }}>
                <button title="Edit" style={drIconBtn}><Icon name="settings" size={12} color="var(--muted)" /></button>
                <button title="Send" style={drIconBtn}><Icon name="send" size={12} color="var(--muted)" /></button>
                <button title="More" style={drIconBtn}><Icon name="more" size={12} color="var(--muted)" /></button>
              </div>
            </div>
          ))
        )}

        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 22px", fontSize: 11.5, color: "var(--muted-2)",
          borderTop: "1px solid var(--border)",
        }}>
          <span>Page 1 of 1</span>
          <span>1 - {lps.length} of {lps.length}, Show 25</span>
        </div>
      </Card>

      </>}

      {addOpen && <OnboardLPModal onClose={() => setAddOpen(false)} onCreate={(lp) => { setLps(p => [...p, lp]); setAddOpen(false); }} />}
    </PageWrap>
  );
}

// ───── LP Onboarding — Settings tab ─────
function LPOnboardingSettings() {
  const [sub, setSub] = useStateP("landing");
  const subs = [
    { id: "landing", label: "Landing Card" },
    { id: "dashboard", label: "Dashboard" },
    { id: "lpdocs", label: "LP Documents Template" },
    { id: "wire", label: "Wire Instructions" },
    { id: "custodians", label: "Account and Custodians" },
    { id: "custom", label: "Customization" },
  ];
  return (
    <div>
      <div style={{
        display: "flex", alignItems: "center", gap: 4,
        borderBottom: "1px solid var(--border)", marginBottom: 22,
      }}>
        {subs.map(s => (
          <button key={s.id} onClick={() => setSub(s.id)} style={{
            padding: "10px 14px", background: "transparent", border: "none", cursor: "pointer",
            fontSize: 12.5, fontFamily: "inherit",
            color: sub === s.id ? "var(--fg)" : "var(--muted-2)",
            fontWeight: sub === s.id ? 500 : 400,
            borderBottom: sub === s.id ? "2px solid var(--accent)" : "2px solid transparent",
            marginBottom: -1,
          }}>{s.label}</button>
        ))}
      </div>

      {sub === "landing" && (
        <Card padding={0} style={{ maxWidth: 720, overflow: "hidden" }}>
          <div style={{
            position: "relative", height: 180,
            background: "linear-gradient(135deg, #0F1B2D 0%, #1A2A40 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            borderBottom: "1px solid var(--border)",
          }}>
            <div style={{
              width: 110, height: 110, borderRadius: 6,
              background: "#0B1322", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 56, fontWeight: 700, fontFamily: "var(--font-mono)",
              color: "#9FB7CF", letterSpacing: -2,
            }}>AV</div>
            <button style={{
              position: "absolute", top: 12, right: 12,
              width: 30, height: 30, borderRadius: 8,
              background: "var(--surface-1)", border: "1px solid var(--border)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
            }}><Icon name="edit" size={13} color="var(--muted)" /></button>
          </div>
          <div style={{ padding: "18px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
              <Avatar name="Admin Ventures IV" size={32} seed={2} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>Admin Ventures IV</div>
                <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>United States</div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 22, marginBottom: 18 }}>
              <div>
                <div style={{ fontSize: 11, color: "var(--muted-2)", marginBottom: 4 }}>Minimum Investment</div>
                <div className="num" style={{ fontSize: 14, fontWeight: 500 }}>0</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "var(--muted-2)", marginBottom: 4 }}>Status</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--pos)" }}>Open</div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid var(--border)", paddingTop: 12, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
              <span style={{ color: "var(--muted-2)" }}>Expected open date</span>
              <span style={{ color: "var(--fg)" }}>1 January, 2023</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 8 }}>
              <span style={{ color: "var(--muted-2)" }}>Expected close date</span>
              <span style={{ color: "var(--muted-2)" }}>—</span>
            </div>
          </div>
        </Card>
      )}

      {sub !== "landing" && (
        <Card padding={32} style={{ textAlign: "center", color: "var(--muted-2)", fontSize: 13 }}>
          {subs.find(s => s.id === sub)?.label} settings — placeholder
        </Card>
      )}
    </div>
  );
}

// ───── LP Onboarding — VICUMS (KYC/AML) tab ─────
function LPOnboardingVicums() {
  const partners = [
    { name: "Harlow Simmons" }, { name: "Redwood Creek Holdings, Inc." },
    { name: "Evelyn Chen" }, { name: "Blue Ridge Family Trust" },
    { name: "Admin Ventures GP, LLC" }, { name: "Whitestone Capital" },
    { name: "Lakeshore Heritage Trust" }, { name: "Ironclad Solutions Corp." },
    { name: "Jonathan D. Harris" }, { name: "Prairie Sky Ventures LLC" },
    { name: "Ben Wisotski" }, { name: "Ben test" },
  ];
  return (
    <Card padding={0}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "8px 14px", borderBottom: "1px solid var(--border)", gap: 8 }}>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "transparent", border: "1px solid var(--border)", borderRadius: 6,
          padding: "5px 10px", cursor: "pointer", fontSize: 11.5, color: "var(--muted)", fontFamily: "inherit",
        }}><Icon name="filter" size={11} color="var(--muted)" /> Columns</button>
      </div>
      <div style={{
        display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
        gap: 14, padding: "12px 22px",
        fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 500,
        borderBottom: "1px solid var(--border)",
      }}>
        <div>Partner Name</div>
        <div>KYC Status</div>
        <div>AML Status</div>
      </div>
      {partners.map((p, i) => (
        <div key={i} className="row-hover" style={{
          display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 14,
          alignItems: "center", padding: "12px 22px",
          borderBottom: i < partners.length-1 ? "1px solid var(--border)" : "none",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={p.name} size={26} seed={i+1} />
            <div style={{ fontSize: 13 }}>{p.name}</div>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Not Started</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Not Started</div>
        </div>
      ))}
    </Card>
  );
}

// ───── LP Onboarding — Demand info (Shareable Links) tab ─────
function LPOnboardingDemandInfo() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <Button variant="primary" size="md" icon="plus">Create New Link</Button>
      </div>
      <div style={{
        border: "1.5px dashed var(--accent-ring-30)",
        background: "var(--accent-ring-06)",
        borderRadius: 12, padding: "60px 22px",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        minHeight: 280,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 999,
          background: "var(--accent-tint)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 18,
        }}>
          <Icon name="external" size={22} color="var(--accent)" />
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>No shareable links yet</div>
        <div style={{ fontSize: 12.5, color: "var(--muted-2)", textAlign: "center", maxWidth: 320 }}>
          Create your first shareable link to start inviting LPs
        </div>
      </div>
    </div>
  );
}

function LPKPI({ label, amount, sub, tone }) {
  const toneColor = {
    muted: "var(--muted-2)",
    accent: "var(--accent)",
    pos: "var(--pos)",
    info: "#7CC4FF",
  }[tone] || "var(--muted-2)";
  return (
    <Card padding={16}>
      <div style={{ fontSize: 10.5, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.6, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div className="num" style={{ fontSize: 22, fontWeight: 500, color: "var(--fg)", marginBottom: 4 }}>
        ${amount.toLocaleString()}
      </div>
      <div style={{ fontSize: 11.5, color: toneColor }}>{sub}</div>
    </Card>
  );
}

// ───── Add LP — multi-step (LP Onboarding flow) ─────
function OnboardLPModal({ onClose, onCreate }) {
  const [step, setStep] = useStateP(1);
  const [data, setData] = useStateP({
    first: "Test",
    last: "Forster",
    entity: "Lawrence Heritage Trust",
    email: "the-website-frontend@gmail.com",
    commitment: "100000",
    receiveCC: true,
    receivePD: false,
    showMulti: false,
    docSelector: true,
    sendOtp: true,
    customMessage: "",
  });
  const set = (patch) => setData(d => ({ ...d, ...patch }));

  const submit = () => {
    onCreate({
      first: data.first, last: data.last, email: data.email,
      entity: data.entity, type: "LIMITED PARTNER", address: "—",
      commitment: Number(data.commitment) || 0,
      status: "Pending",
      statusDetail: `Pending on LP info as of ${new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} at ${new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}`,
      seed: Math.floor(Math.random() * 6),
    });
  };

  return (
    <Modal title="Add LP" onClose={onClose} width={640}
      footer={<>
        <div style={{ flex: 1 }} />
        {step > 1 && <Button variant="ghost" size="md" onClick={() => setStep(s => s - 1)}>Back</Button>}
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        {step < 3
          ? <Button variant="primary" size="md" onClick={() => setStep(s => s + 1)}>Next</Button>
          : <Button variant="primary" size="md" icon="send" onClick={submit}>Invite</Button>}
      </>}>
      <OnboardStepper step={step} steps={["Information", "Document Selection", "Invite User"]} />

      {step === 1 && (
        <div style={{ marginTop: 6 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="First Name"><TextInput value={data.first} onChange={e => set({ first: e.target.value })} /></Field>
            <Field label="Last Name"><TextInput value={data.last} onChange={e => set({ last: e.target.value })} /></Field>
            <Field label="Entity Name"><TextInput value={data.entity} onChange={e => set({ entity: e.target.value })} /></Field>
            <Field label="Email"><TextInput value={data.email} onChange={e => set({ email: e.target.value })} /></Field>
            <Field label="Commitment Amount" style={{ gridColumn: "1 / -1" }}>
              <TextInput value={`$${Number(data.commitment).toLocaleString()}`} onChange={e => set({ commitment: e.target.value.replace(/[^\d]/g, "") })} />
            </Field>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
            <DRCheckbox label="Receive Capital Call Notice" checked={data.receiveCC} onChange={(v) => set({ receiveCC: v })} />
            <DRCheckbox label="Receive Pay-Down Notification" checked={data.receivePD} onChange={(v) => set({ receivePD: v })} />
            <DRCheckbox label="Show Multi-Investor Investment" checked={data.showMulti} onChange={(v) => set({ showMulti: v })} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div style={{ marginTop: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)", display: "inline-flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  width: 18, height: 18, borderRadius: 4,
                  background: "rgba(255,140,40,0.15)", color: "#FF8C28",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11,
                }}>!</span>
                Select Documents for LP Onboarding
              </div>
              <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 4 }}>
                Choose which documents this LP must sign as part of the onboarding process.
              </div>
            </div>
            <DRCheckbox label="Document Selector" checked={data.docSelector} onChange={(v) => set({ docSelector: v })} />
          </div>
          <div style={{
            padding: "14px 16px", borderRadius: 10,
            background: "rgba(255,210,80,0.10)",
            boxShadow: "inset 0 0 0 1px rgba(255,210,80,0.30)",
            color: "#E5C46B", fontSize: 12.5,
          }}>
            No document templates available. Please upload templates in the LP Onboarding settings first.
          </div>
        </div>
      )}

      {step === 3 && (
        <div style={{ marginTop: 6 }}>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
            This invite email will be sent to the LP's contact to start the onboarding process.
          </div>
          <DRCheckbox label="Receive User OTP Mail" checked={data.sendOtp} onChange={(v) => set({ sendOtp: v })} />
          <div style={{ marginTop: 14 }}>
            <Field label="Custom Message (Included in the email)">
              <textarea
                value={data.customMessage}
                onChange={e => set({ customMessage: e.target.value })}
                rows={4}
                placeholder="Enter a custom message…"
                style={{
                  width: "100%", padding: "10px 12px", borderRadius: 8,
                  background: "var(--surface-2)", border: "1px solid var(--border-strong)",
                  color: "var(--fg)", fontSize: 13, fontFamily: "inherit", outline: "none",
                  resize: "vertical", minHeight: 100,
                }}
              />
            </Field>
          </div>
        </div>
      )}
    </Modal>
  );
}

function OnboardStepper({ step, steps }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 0, marginBottom: 22,
      paddingBottom: 18, borderBottom: "1px solid var(--border)",
    }}>
      {steps.map((label, i) => {
        const idx = i + 1;
        const active = idx === step;
        const done = idx < step;
        const fg = active || done ? "var(--accent)" : "var(--muted-2)";
        return (
          <React.Fragment key={label}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 999,
                background: done ? "var(--accent)" : "transparent",
                boxShadow: `inset 0 0 0 1.5px ${fg}`,
                color: done ? "#fff" : fg,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 500,
              }}>
                {done ? <Icon name="check" size={11} color="#fff" /> : idx}
              </div>
              <span style={{ fontSize: 12.5, fontWeight: active ? 500 : 400, color: fg }}>{label}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 1, margin: "0 14px",
                background: idx < step ? "var(--accent)" : "var(--border-strong)",
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ────────────── Deal Room ──────────────
const DEAL_ROOMS_SEED = [
  { id: "test", name: "Test", status: "Active", files: 4, members: 1, created: "May 4, 2026", icon: "dealRoom", description: "Internal scratch room for sandbox uploads.", size: "32 KB" },
];

function DealRoomPage() {
  const [rooms, setRooms] = useStateP(DEAL_ROOMS_SEED);
  const [openRoom, setOpenRoom] = useStateP(null); // room id when in detail view
  const [modal, setModal] = useStateP(null); // { kind: "create"|"folder"|"upload"|"link"|"activity"|"access" }

  const room = rooms.find(r => r.id === openRoom);

  const createRoom = (data) => {
    const id = data.name.toLowerCase().replace(/\s+/g, "-").slice(0, 24) || `room-${rooms.length+1}`;
    setRooms(rs => [...rs, {
      id, name: data.name, status: "Active",
      files: 0, members: 1, created: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      icon: "dealRoom", description: data.description || "",
      size: "0 KB",
      perms: data.perms,
    }]);
    setModal(null);
  };

  if (room) {
    return (
      <PageWrap>
        {/* Breadcrumb */}
        <button onClick={() => setOpenRoom(null)} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: "transparent", border: "none", cursor: "pointer",
          color: "var(--muted)", fontSize: 12, fontFamily: "inherit",
          padding: 0, marginBottom: 14,
        }}>
          <Icon name="chevronR" size={11} color="var(--muted)" style={{ transform: "rotate(180deg)" }} />
          <span style={{ color: "var(--accent)", fontWeight: 500 }}>Deal Rooms</span>
          <span style={{ color: "var(--muted-3)" }}>/</span>
          <span>{room.name}</span>
        </button>

        <PageHeader
          title="Deal Rooms"
          subtitle="Secure file rooms to share documents with external parties."
        />

        {/* Room card */}
        <Card padding={0} style={{ marginBottom: 18 }}>
          <div style={{ padding: "16px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8,
              background: "linear-gradient(135deg, rgba(99,79,255,0.18), rgba(99,79,255,0.06))",
              boxShadow: "inset 0 0 0 1px rgba(99,79,255,0.30)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="dealRoom" size={16} color="var(--accent)" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{room.name}</div>
              <Pill tone="pos">{room.status}</Pill>
            </div>
            <div style={{ flex: 1 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 12, color: "var(--muted)" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="file" size={12} color="var(--muted)" />
                <span className="num">{room.files}</span> Files
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="users" size={12} color="var(--muted)" />
                <span className="num">{room.members}</span> Members
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="bank" size={12} color="var(--muted)" />
                <span className="num">{room.size}</span> Used
              </span>
              <button onClick={() => setModal({ kind: "members" })} title="Members" style={drIconBtn}>
                <Icon name="users" size={14} color="var(--muted)" />
              </button>
              <button onClick={() => setModal({ kind: "settings" })} title="Settings" style={drIconBtn}>
                <Icon name="settings" size={14} color="var(--muted)" />
              </button>
            </div>
          </div>

          {/* Toolbar */}
          <div style={{
            padding: "10px 20px", borderTop: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <Button variant="primary" size="md" icon="upload" onClick={() => setModal({ kind: "upload" })}>Upload Files</Button>
            <Button variant="solid" size="md" icon="folder" onClick={() => setModal({ kind: "folder" })}>New Folder</Button>
            <Button variant="ghost" size="md" icon="link" onClick={() => setModal({ kind: "link" })}>Copy Link</Button>
            <button onClick={() => setRooms(rs => [...rs])} title="Refresh" style={drIconBtn}>
              <Icon name="sort" size={13} color="var(--muted)" />
            </button>
            <div style={{ flex: 1 }} />
            <Button variant="ghost" size="md" icon="lightning" onClick={() => setModal({ kind: "activity" })}>Activity Logs</Button>
            <Button variant="ghost" size="md" icon="users" onClick={() => setModal({ kind: "access" })}>Access Logs</Button>
          </div>

          {/* Empty / file list */}
          <div style={{
            padding: "60px 20px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 12, color: "var(--muted)", borderTop: "1px solid var(--border)",
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: "var(--surface-2)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="folder" size={22} color="var(--muted-3)" />
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)" }}>No files yet</div>
            <div style={{ fontSize: 12.5 }}>Upload documents or create a folder to get started.</div>
          </div>
        </Card>

        {modal?.kind === "upload" && <DRUploadModal onClose={() => setModal(null)} />}
        {modal?.kind === "folder" && <DRFolderModal onClose={() => setModal(null)} onCreate={() => setModal(null)} />}
        {modal?.kind === "link" && <DRLinkModal onClose={() => setModal(null)} room={room} />}
        {modal?.kind === "activity" && <DRLogModal onClose={() => setModal(null)} kind="activity" />}
        {modal?.kind === "access" && <DRLogModal onClose={() => setModal(null)} kind="access" />}
        {modal?.kind === "members" && <DRMembersModal onClose={() => setModal(null)} room={room} />}
        {modal?.kind === "settings" && <DRSettingsModal onClose={() => setModal(null)} room={room} />}
      </PageWrap>
    );
  }

  return (
    <PageWrap>
      <PageHeader
        title="Deal Rooms"
        subtitle="Secure file rooms to share documents with external parties."
        actions={
          <Button variant="primary" size="md" icon="plus" onClick={() => setModal({ kind: "create" })}>Create Deal Room</Button>
        }
      />

      {rooms.length === 0 ? (
        <Card padding={0}>
          <div style={{
            padding: "80px 20px",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 12, color: "var(--muted)",
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: 16,
              background: "var(--surface-2)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name="folder" size={26} color="var(--muted-3)" />
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)" }}>No deal rooms yet</div>
            <div style={{ fontSize: 12.5 }}>Create your first deal room to share documents with external parties.</div>
            <div style={{ marginTop: 6 }}>
              <Button variant="primary" size="md" icon="plus" onClick={() => setModal({ kind: "create" })}>Create Deal Room</Button>
            </div>
          </div>
        </Card>
      ) : (
        <Card padding={0}>
          <TableHeader cols={[
            { label: "Name", w: "2fr" },
            { label: "Status", w: "120px" },
            { label: "Stats", w: "180px" },
            { label: "Created", w: "150px" },
            { label: "Actions", w: "120px", align: "right" },
          ]} />
          {rooms.map((r, i) => (
            <div key={r.id} className="row-hover" style={{
              display: "grid", gridTemplateColumns: "2fr 120px 180px 150px 120px",
              gap: 14, alignItems: "center", padding: "14px 22px",
              borderBottom: i < rooms.length-1 ? "1px solid var(--border)" : "none",
              cursor: "pointer",
            }} onClick={() => setOpenRoom(r.id)}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 6,
                  background: "linear-gradient(135deg, rgba(99,79,255,0.18), rgba(99,79,255,0.06))",
                  boxShadow: "inset 0 0 0 1px rgba(99,79,255,0.28)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                }}>
                  <Icon name="dealRoom" size={13} color="var(--accent)" />
                </div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{r.name}</div>
              </div>
              <div><Pill tone="pos">{r.status}</Pill></div>
              <div style={{ display: "flex", gap: 14, fontSize: 12, color: "var(--muted)" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="file" size={11} color="var(--muted)" />
                  <span className="num">{r.files}</span>
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                  <Icon name="users" size={11} color="var(--muted)" />
                  <span className="num">{r.members}</span>
                </span>
              </div>
              <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.created}</div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => setOpenRoom(r.id)} title="Open" style={drIconBtn}>
                  <Icon name="external" size={13} color="var(--muted)" />
                </button>
                <button title="More" style={drIconBtn}>
                  <Icon name="more" size={13} color="var(--muted)" />
                </button>
              </div>
            </div>
          ))}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "flex-end",
            padding: "10px 20px", fontSize: 12, color: "var(--muted-2)", gap: 12,
            borderTop: "1px solid var(--border)",
          }}>
            <span>Rows per page: 10</span>
            <span>1 - {rooms.length} of {rooms.length}</span>
          </div>
        </Card>
      )}

      {modal?.kind === "create" && <DRCreateModal onClose={() => setModal(null)} onCreate={createRoom} />}
    </PageWrap>
  );
}

const drIconBtn = {
  width: 28, height: 28, borderRadius: 6,
  background: "transparent", border: "1px solid var(--border)",
  cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center",
};

// ───── Create Deal Room ─────
function DRCreateModal({ onClose, onCreate }) {
  const [name, setName] = useStateP("");
  const [desc, setDesc] = useStateP("");
  const [allowDl, setAllowDl] = useStateP(true);
  const [allowBulk, setAllowBulk] = useStateP(true);
  const [requireOtp, setRequireOtp] = useStateP(true);
  const submit = () => {
    if (!name.trim()) return;
    onCreate({ name: name.trim(), description: desc.trim(), perms: { allowDl, allowBulk, requireOtp } });
  };
  return (
    <Modal title="Create Deal Room" onClose={onClose} width={520}
      footer={<>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="md" icon="dealRoom" onClick={submit}>Create Deal Room</Button>
      </>}>
      <DRSubtitle>Set up a secure room for sharing documents.</DRSubtitle>
      <DRField label="Name *">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Project Helios" style={drInput} />
      </DRField>
      <DRField label="Description">
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={3} placeholder="What is this room for?" style={{ ...drInput, resize: "vertical", minHeight: 70 }} />
      </DRField>
      <div style={{ marginTop: 8 }}>
        <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 10, color: "var(--fg)" }}>Permissions</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <DRCheckbox label="Allow Download" checked={allowDl} onChange={setAllowDl} />
          <DRCheckbox label="Allow Bulk Download" checked={allowBulk} onChange={setAllowBulk} />
          <DRCheckbox label="Require Email Verification" checked={requireOtp} onChange={setRequireOtp} />
        </div>
      </div>
    </Modal>
  );
}

// ───── Create Folder ─────
function DRFolderModal({ onClose, onCreate }) {
  const [name, setName] = useStateP("");
  const [desc, setDesc] = useStateP("");
  return (
    <Modal title="Create Folder" onClose={onClose} width={460}
      footer={<>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="md" icon="folder" onClick={() => name.trim() && onCreate({ name, desc })}>Create Folder</Button>
      </>}>
      <DRSubtitle>Organize your documents.</DRSubtitle>
      <DRField label="Folder Name *">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Financials" style={drInput} />
      </DRField>
      <DRField label="Description">
        <textarea value={desc} onChange={e => setDesc(e.target.value)} rows={2} style={{ ...drInput, resize: "vertical", minHeight: 60 }} />
      </DRField>
    </Modal>
  );
}

// ───── Upload Files ─────
function DRUploadModal({ onClose }) {
  const [files, setFiles] = useStateP([]);
  const onPick = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(f => [...f, ...list.map(f => ({ name: f.name, size: f.size }))]);
  };
  return (
    <Modal title="Upload Files" onClose={onClose} width={520}
      footer={<>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="md" icon="upload" onClick={onClose}>Upload {files.length || ""}</Button>
      </>}>
      <DRSubtitle>Add documents to this deal room.</DRSubtitle>
      <label style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        gap: 8, padding: "32px 20px", borderRadius: 10,
        background: "var(--surface-2)", border: "2px dashed var(--border-strong)",
        cursor: "pointer", color: "var(--muted)",
      }}>
        <Icon name="upload" size={22} color="var(--accent)" />
        <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)" }}>Drop files here or click to browse</div>
        <div style={{ fontSize: 11.5 }}>PDF, DOCX, XLSX up to 50 MB each</div>
        <input type="file" multiple onChange={onPick} style={{ display: "none" }} />
      </label>
      {files.length > 0 && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px", borderRadius: 8,
              background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--border)",
              fontSize: 12.5,
            }}>
              <Icon name="file" size={13} color="var(--accent)" />
              <span style={{ flex: 1 }}>{f.name}</span>
              <span style={{ color: "var(--muted-2)", fontSize: 11 }} className="num">
                {f.size < 1024 ? f.size + " B" : f.size < 1048576 ? (f.size/1024).toFixed(0)+" KB" : (f.size/1048576).toFixed(1)+" MB"}
              </span>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
}

// ───── Copy Link ─────
function DRLinkModal({ onClose, room }) {
  const [copied, setCopied] = useStateP(false);
  const url = `https://zive.app/dr/${room?.id || "room"}/share`;
  const copy = () => {
    navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <Modal title="Share Deal Room" onClose={onClose} width={520}
      footer={<><div style={{ flex: 1 }} /><Button variant="ghost" size="md" onClick={onClose}>Close</Button></>}>
      <DRSubtitle>Send this link to invited members.</DRSubtitle>
      <div style={{ display: "flex", gap: 8, alignItems: "stretch" }}>
        <input readOnly value={url} style={{ ...drInput, flex: 1, fontFamily: "var(--font-mono, ui-monospace)", fontSize: 11.5 }} />
        <Button variant="primary" size="md" icon={copied ? "check" : "copy"} onClick={copy}>{copied ? "Copied" : "Copy"}</Button>
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)" }}>
        Recipients will receive a one-time email verification before they can access the room.
      </div>
    </Modal>
  );
}

// ───── Activity / Access Logs ─────
function DRLogModal({ onClose, kind }) {
  const isActivity = kind === "activity";
  const cols = isActivity
    ? [{ label: "User", w: "1fr" }, { label: "Action", w: "1fr" }, { label: "Document", w: "1fr" }, { label: "Date", w: "140px" }]
    : [{ label: "User", w: "1fr" }, { label: "Email", w: "1fr" }, { label: "Verified", w: "100px" }, { label: "Last Access", w: "140px" }, { label: "Status", w: "100px" }];
  const title = isActivity ? "Activity Logs" : "Access Logs";
  const icon = isActivity ? "activity" : "users";
  return (
    <Modal title={title} onClose={onClose} width={680}
      footer={<>
        <div style={{ flex: 1, fontSize: 11.5, color: "var(--muted-2)", display: "flex", alignItems: "center", gap: 14 }}>
          <span>Rows per page: 10</span>
          <span>0 of 0</span>
        </div>
        <Button variant="ghost" size="md" onClick={onClose}>Close</Button>
      </>}>
      <DRSubtitle>{isActivity ? "Every action taken inside this room." : "Who has accessed this room and when."}</DRSubtitle>
      <div style={{
        display: "grid",
        gridTemplateColumns: cols.map(c => c.w).join(" "),
        gap: 14, padding: "10px 14px",
        borderBottom: "1px solid var(--border)",
        fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 500,
      }}>
        {cols.map(c => <div key={c.label}>{c.label}</div>)}
      </div>
      <div style={{
        padding: "48px 14px", textAlign: "center", color: "var(--muted-2)", fontSize: 12.5,
      }}>
        No data
      </div>
    </Modal>
  );
}

// ───── Members ─────
function DRMembersModal({ onClose, room }) {
  return (
    <Modal title="Members" onClose={onClose} width={520}
      footer={<>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="md" onClick={onClose}>Close</Button>
        <Button variant="primary" size="md" icon="plus">Invite member</Button>
      </>}>
      <DRSubtitle>People with access to {room?.name || "this room"}.</DRSubtitle>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "10px 12px", borderRadius: 8,
          background: "var(--surface-2)", boxShadow: "inset 0 0 0 1px var(--border)",
        }}>
          <Avatar name="Morgan Chen" size={28} seed={5} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>Morgan Chen</div>
            <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>morgan@chenfo.com</div>
          </div>
          <Pill tone="accent">Owner</Pill>
        </div>
      </div>
    </Modal>
  );
}

// ───── Settings ─────
function DRSettingsModal({ onClose, room }) {
  const [allowDl, setAllowDl] = useStateP(true);
  const [allowBulk, setAllowBulk] = useStateP(true);
  const [requireOtp, setRequireOtp] = useStateP(true);
  return (
    <Modal title="Room Settings" onClose={onClose} width={520}
      footer={<>
        <div style={{ flex: 1 }} />
        <Button variant="ghost" size="md" onClick={onClose}>Cancel</Button>
        <Button variant="primary" size="md" onClick={onClose}>Save changes</Button>
      </>}>
      <DRSubtitle>{room?.name}</DRSubtitle>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <DRCheckbox label="Allow Download" checked={allowDl} onChange={setAllowDl} />
        <DRCheckbox label="Allow Bulk Download" checked={allowBulk} onChange={setAllowBulk} />
        <DRCheckbox label="Require Email Verification" checked={requireOtp} onChange={setRequireOtp} />
      </div>
    </Modal>
  );
}

const drInput = {
  width: "100%", padding: "10px 12px", borderRadius: 8,
  background: "var(--surface-2)", border: "1px solid var(--border-strong)",
  color: "var(--fg)", fontSize: 13, fontFamily: "inherit", outline: "none",
  transition: "border-color 120ms ease, box-shadow 120ms ease",
};

function DRCheckbox({ label, checked, onChange }) {
  return (
    <label style={{
      display: "flex", alignItems: "center", gap: 8,
      padding: "8px 10px", borderRadius: 8,
      background: checked ? "rgba(99,79,255,0.08)" : "var(--surface-2)",
      boxShadow: `inset 0 0 0 1px ${checked ? "rgba(99,79,255,0.30)" : "var(--border)"}`,
      cursor: "pointer", fontSize: 12.5,
      transition: "all 120ms ease",
    }}>
      <span style={{
        width: 16, height: 16, borderRadius: 4,
        background: checked ? "var(--accent)" : "transparent",
        boxShadow: checked ? "none" : "inset 0 0 0 1.5px var(--muted-3)",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {checked && <Icon name="check" size={11} color="#fff" />}
      </span>
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} style={{ display: "none" }} />
      <span>{label}</span>
    </label>
  );
}

function DRSubtitle({ children }) {
  return (
    <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: -10, marginBottom: 18 }}>{children}</div>
  );
}

function DRField({ label, children }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 6, fontWeight: 500 }}>{label}</div>
      {children}
    </div>
  );
}

// ────────────── Users ──────────────
function UsersPage() {
  const users = [
    { name: "Morgan Chen", email: "morgan@chenfo.com", role: "Admin", status: "Active", last: "Just now", seed: 5 },
    { name: "Dana Park", email: "dana@chenfo.com", role: "Fund manager", status: "Active", last: "2h ago", seed: 2 },
    { name: "Hiro Tanaka", email: "hiro@chenfo.com", role: "Analyst", status: "Active", last: "Yesterday", seed: 1 },
    { name: "Priya Shah", email: "priya@external-cpa.com", role: "External CPA", status: "Invited", last: "—", seed: 3 },
    { name: "James Okafor", email: "james@chenfo.com", role: "LP view", status: "Active", last: "1 week ago", seed: 4 },
  ];
  return (
    <PageWrap>
      <PageHeader title="Users" subtitle="Team members, roles, and access."
        actions={<Button variant="primary" size="md" icon="plus" onClick={() => window.zivePopup?.openInvite()}>Invite user</Button>} />

      <Card padding={0}>
        <TableHeader cols={[
          { label: "User", w: "2fr" },
          { label: "Role", w: "160px" },
          { label: "Status", w: "120px" },
          { label: "Last active", w: "140px" },
          { label: "", w: "40px" },
        ]} />
        {users.map((u, i) => (
          <div key={u.email} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "2fr 160px 120px 140px 40px",
            gap: 14, alignItems: "center", padding: "14px 22px",
            borderBottom: i < users.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={u.name} size={30} seed={u.seed} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{u.name}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>{u.email}</div>
              </div>
            </div>
            <div><Pill tone={u.role === "Admin" ? "accent" : "outline"}>{u.role}</Pill></div>
            <div><Pill tone={u.status === "Active" ? "pos" : "warn"}>{u.status}</Pill></div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{u.last}</div>
            <Icon name="more" size={14} color="var(--muted-3)" />
          </div>
        ))}
      </Card>
    </PageWrap>
  );
}

// ────────────── All Files (Documents) ──────────────
function AllFilesPage() {
  const [page, setPage] = useStateP("documents");
  const folders = [
    { name: "Capital Calls", count: 42, icon: "capitalCall" },
    { name: "Distributions", count: 28, icon: "distribution" },
    { name: "Statements", count: 64, icon: "chart" },
    { name: "K-1s & Tax", count: 19, icon: "receipt" },
    { name: "Legal (LPAs, Side Letters)", count: 37, icon: "doc" },
    { name: "Audits", count: 12, icon: "audit" },
  ];
  const files = [
    { name: "Sigma_IV_Capital_Call_7.pdf", folder: "Capital Calls", fund: "Sigma Ventures IV", date: "Apr 18", size: "412 KB" },
    { name: "Meridian_Distribution_Q1_2025.pdf", folder: "Distributions", fund: "Meridian Growth II", date: "Apr 21", size: "284 KB" },
    { name: "Northwind_Q1_2025_Statement.pdf", folder: "Statements", fund: "Northwind Buyout III", date: "Apr 15", size: "1.8 MB" },
    { name: "Harbor_RE_V_K1_2024.pdf", folder: "K-1s & Tax", fund: "Harbor Real Estate V", date: "Apr 11", size: "196 KB" },
    { name: "Kinetic_Side_Letter_Am2.pdf", folder: "Legal", fund: "Kinetic Ventures III", date: "Apr 2", size: "88 KB" },
    { name: "Aster_Credit_Audit_FY24.pdf", folder: "Audits", fund: "Aster Credit Partners II", date: "Mar 27", size: "2.4 MB" },
  ];
  const pageItems = [
    { id: "documents", label: "Documents" },
    { id: "legal", label: "Legal & Compliance" },
    { id: "tax", label: "Tax documents" },
  ];
  return (
    <PageWrap>
      <PageHeader title="Documents" subtitle="Everything the GPs and your team have filed for you."
        actions={<>
          <PageMenu items={pageItems} value={page} onChange={setPage} />
          <Button variant="solid" size="md" icon="filter">All funds</Button>
          <Button variant="primary" size="md" icon="upload" onClick={() => window.zivePopup?.openUpload()}>Upload</Button>
        </>} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 10, marginBottom: 24 }}>
        {folders.map(f => (
          <Card key={f.name} padding={14} onClick={()=>{}} style={{ cursor: "pointer" }}>
            <div style={{
              width: 36, height: 36, borderRadius: 9,
              background: "var(--surface-2)", color: "var(--fg-2)",
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10,
              boxShadow: "inset 0 0 0 1px var(--border)",
            }}>
              <Icon name={f.icon} size={16} />
            </div>
            <div style={{ fontSize: 12.5, fontWeight: 500, marginBottom: 2 }}>{f.name}</div>
            <div className="num" style={{ fontSize: 11, color: "var(--muted-2)" }}>{f.count} files</div>
          </Card>
        ))}
      </div>

      <Card padding={0}>
        <div style={{ padding: "14px 22px", borderBottom: "1px solid var(--border)", fontSize: 14, fontWeight: 500 }}>Recent files</div>
        <TableHeader cols={[
          { label: "File", w: "2fr" },
          { label: "Folder", w: "160px" },
          { label: "Fund", w: "200px" },
          { label: "Date", w: "100px" },
          { label: "Size", w: "90px", align: "right" },
          { label: "", w: "30px" },
        ]} />
        {files.map((f, i) => (
          <div key={f.name} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "2fr 160px 200px 100px 90px 30px",
            gap: 14, alignItems: "center", padding: "14px 22px",
            borderBottom: i < files.length-1 ? "1px solid var(--border)" : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "inset 0 0 0 1px var(--border)" }}>
                <Icon name="doc" size={14} color="var(--muted)" />
              </div>
              <div style={{ fontSize: 13, fontWeight: 500 }}>{f.name}</div>
            </div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{f.folder}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)" }}>{f.fund}</div>
            <div style={{ fontSize: 12.5, color: "var(--muted-2)" }}>{f.date}</div>
            <div className="num" style={{ fontSize: 12.5, color: "var(--muted-2)", textAlign: "right" }}>{f.size}</div>
            <Icon name="more" size={14} color="var(--muted-3)" />
          </div>
        ))}
      </Card>
    </PageWrap>
  );
}

// ────────────── Dashboard (fund-scoped Key Metrics) ──────────────
function DashboardPage() {
  const [fundId, setFundId] = useStateP(() => {
    try { return localStorage.getItem("zive.dashboardFund") || FUNDS[0].id; } catch { return FUNDS[0].id; }
  });
  const f = FUNDS.find(x => x.id === fundId) || FUNDS[0];
  useEffectP(() => { localStorage.setItem("zive.dashboardFund", fundId); }, [fundId]);

  return (
    <div style={{ padding: "24px 40px 48px", maxWidth: 1360, margin: "0 auto" }} className="fade-up">
      {/* Fund context bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px", marginBottom: 24,
        background: "var(--surface)", borderRadius: 12,
        boxShadow: "inset 0 0 0 1px var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Orb seed={f.orb} size={36} />
          <div>
            <div style={{ fontSize: 14.5, fontWeight: 500, letterSpacing: -0.2 }}>{f.name}</div>
            <div style={{ fontSize: 11, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>Fund • Admin</div>
          </div>
        </div>
        <FundSwitcher value={fundId} onChange={setFundId} />
      </div>

      <FundKeyMetrics f={f} />
    </div>
  );
}

function FundSwitcher({ value, onChange }) {
  const [open, setOpen] = useStateP(false);
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)} style={{
        display: "inline-flex", alignItems: "center", gap: 10,
        height: 34, padding: "0 14px",
        background: "var(--surface-2)", border: "1px solid var(--border-strong)",
        borderRadius: 8, color: "var(--fg-2)", fontSize: 12.5,
        fontFamily: "inherit", cursor: "pointer", fontWeight: 500,
      }}>
        Switch fund
        <Icon name="chevronD" size={11} color="var(--muted-2)" />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: 40, right: 0, zIndex: 30,
          width: 280, background: "var(--elevated)",
          border: "1px solid var(--border-strong)", borderRadius: 10,
          boxShadow: "var(--shadow-pop)", padding: 6,
        }}>
          {FUNDS.map(f => (
            <button key={f.id} onClick={() => { onChange(f.id); setOpen(false); }} style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%",
              padding: "8px 10px", borderRadius: 7,
              background: value === f.id ? "var(--surface-2)" : "transparent",
              border: "none", color: "var(--fg-2)", fontSize: 12.5,
              cursor: "pointer", fontFamily: "inherit", textAlign: "left",
            }}
              onMouseEnter={e => { if (value !== f.id) e.currentTarget.style.background = "var(--chip)"; }}
              onMouseLeave={e => { if (value !== f.id) e.currentTarget.style.background = "transparent"; }}
            >
              <Orb seed={f.orb} size={22} />
              <span style={{ flex: 1 }}>{f.name}</span>
              {value === f.id && <Icon name="check" size={12} color="var(--accent)" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  PortfolioPage, InvestorsPage, CapitalCallsPage, DistributionsPage,
  AIUploadPage, AgentsPage, DocStudioPage, MCPPage,
  AccountingPage, ReportsPage, QuarterlyReportPage, AuditReportPage,
  LPInterestPage, LPOnboardingPage, DealRoomPage, UsersPage, AllFilesPage,
  DashboardPage, StartupsPage,
});
