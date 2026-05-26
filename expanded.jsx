// Zive — expanded-states bootstrap for Figma HTML import.
// Mounts every distinct UI state on a single page, stacked vertically.
// Each section is 1920px wide; height grows with content.

(function () {
  const { useState: useStateExp, useEffect: useEffectExp } = React;

  // ─── Portal override: render popups inline. Must happen BEFORE first render ───
  if (!window.__zexpPortalPatched) {
    ReactDOM.createPortal = (children, _container) => children;
    window.__zexpPortalPatched = true;
  }

  // ─── No-op popup controller so any code calling window.zivePopup.* doesn't blow up ───
  window.zivePopup = {
    openInvite: () => {}, openTemplate: () => {}, openUpload: () => {},
    openAddInvestor: () => {}, openBulkUpload: () => {}, openTaskRespond: () => {},
    openNewAgent: () => {}, openAsk: () => {}, close: () => {},
  };

  // ─── Per-section error boundary. Reports the failure inline so one broken
  //     page doesn't black-blank the entire 333-section tree. ───
  class ZexpBoundary extends React.Component {
    constructor(props) { super(props); this.state = { err: null }; }
    static getDerivedStateFromError(err) { return { err }; }
    componentDidCatch(err, info) {
      // Surface to the global banner too via window.error
      try { window.dispatchEvent(new ErrorEvent("error", { message: "[" + (this.props.label || "section") + "] " + (err && err.message || String(err)), error: err })); } catch (e) {}
      try { console.error("ZexpBoundary caught in", this.props.label, err, info); } catch (e) {}
    }
    render() {
      if (this.state.err) {
        const e = this.state.err;
        return (
          <div style={{ padding: 24, background: "#1f1f23", color: "#fca5a5", fontFamily: "ui-monospace, Menlo, monospace", fontSize: 12, whiteSpace: "pre-wrap", lineHeight: 1.5, borderTop: "2px solid #b91c1c" }}>
            <strong style={{ color: "#fff", fontSize: 13 }}>Render error in: {this.props.label || "(unknown)"}</strong>
            {"\n\n"}{e && (e.message || String(e))}
            {e && e.stack ? "\n\n" + e.stack : ""}
          </div>
        );
      }
      return this.props.children;
    }
  }

  // ─── Mini Sidebar (replicates app.jsx Sidebar visuals; static; no popovers) ───
  function MiniSidebar({ entity, page, sub, collapsed }) {
    const navConfig = entity === "admin" ? window.VCFO_NAV_CFG :
                      entity === "admin-v" ? window.LP_NAV_CFG : null;
    const width = collapsed ? 56 : 248;
    const isActive = (p) => page === p;
    const noop = () => {};

    return (
      <aside style={{
        width, flexShrink: 0,
        background: "var(--bg)",
        borderRight: "1px solid var(--border)",
        display: "flex", flexDirection: "column",
        padding: collapsed ? "12px 4px" : "12px 10px",
        minHeight: "100vh",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: collapsed ? "4px 0 8px" : "2px 6px 10px",
          minHeight: 36,
        }}>
          {collapsed ? (
            <div style={{
              width: 36, height: 32, margin: "0 auto",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--muted)",
            }}>
              <Icon name="panelLeft" size={17} />
            </div>
          ) : (
            <>
              <div style={{
                width: 30, height: 30,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--muted-2)",
              }}>
                <Icon name="panelLeft" size={15} />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <ZiveWordmark height={18} color="var(--fg)" />
              </div>
              <div style={{ width: 30 }} />
            </>
          )}
        </div>

        {/* Nav body */}
        <div style={{ flex: 1, marginRight: collapsed ? 0 : -6, paddingRight: collapsed ? 0 : 6 }}>
          {navConfig ? (
            <>
              <SidebarSection collapsed={collapsed}>
                <ZiveAINavItem active={isActive("zive-ai")} onClick={noop} collapsed={collapsed} />
              </SidebarSection>
              {navConfig.map((sec, i) => (
                <SidebarSection key={i} label={sec.label} collapsed={collapsed}>
                  {sec.items.map(it => (
                    <NavItem key={it.id}
                      icon={it.icon} label={it.label}
                      hint={it.hint} hintTone={it.hintTone} iconRight={it.iconRight}
                      active={isActive(it.id)} onClick={noop}
                      collapsed={collapsed}
                    />
                  ))}
                </SidebarSection>
              ))}
            </>
          ) : (
            <>
              <SidebarSection collapsed={collapsed}>
                <ZiveAINavItem active={isActive("zive-ai")} onClick={noop} collapsed={collapsed} />
              </SidebarSection>
              <SidebarSection collapsed={collapsed}>
                <NavItem icon="home" label="Home" active={isActive("home")} onClick={noop} collapsed={collapsed} />
              </SidebarSection>
              <SidebarSection collapsed={collapsed}>
                <NavItem icon="tasks" label="Tasks" hint="7" hintTone="danger" active={isActive("tasks")} onClick={noop} collapsed={collapsed} />
                <NavItem icon="shieldCheck" label="BlueCheck" hint="14" hintTone="danger" active={isActive("bluecheck")} onClick={noop} collapsed={collapsed} />
              </SidebarSection>
              <SidebarSection label="Fund" collapsed={collapsed}>
                <NavItem icon="dashboard" label="Dashboard" active={isActive("dashboard")} onClick={noop} collapsed={collapsed} />
                <NavItem icon="pie" label="Portfolio" iconRight="chevronR" active={isActive("portfolio")} onClick={noop} collapsed={collapsed}
                  submenu={[
                    { id: "soi",     label: "Schedule Of Investments" },
                    { id: "irr",     label: "Deal IRR" },
                    { id: "company", label: "Company Overview" },
                    { id: "metrics", label: "Portfolio Metrics" },
                    { id: "equity",  label: "Equity Schedule" },
                  ]}
                  activeSubId={page === "portfolio" ? sub : null}
                  onSubmenuPick={noop}
                />
                <NavItem icon="investor" label="Investors" iconRight="chevronR" active={isActive("investors")} onClick={noop} collapsed={collapsed}
                  submenu={[
                    { id: "statement",   label: "Capital Statement" },
                    { id: "rollforward", label: "Partner roll forwards" },
                    { id: "txns",        label: "Transactions" },
                    { id: "pnl",         label: "P&L" },
                    { id: "commits",     label: "Commitment History" },
                  ]}
                  activeSubId={page === "investors" ? sub : null}
                  onSubmenuPick={noop}
                />
                <NavItem icon="capitalCall" label="Capital Calls" active={isActive("capital-calls")} onClick={noop} collapsed={collapsed} />
                <NavItem icon="distribution" label="Distributions" active={isActive("distributions")} onClick={noop} collapsed={collapsed} />
                <NavItem icon="briefcase" label="Startups" active={isActive("startups") || isActive("startup-profile")} onClick={noop} collapsed={collapsed} />
              </SidebarSection>
              <SidebarSection label="AI" collapsed={collapsed}>
                <NavItem icon="aiUpload" label="AI Upload" active={isActive("ai-upload")} onClick={noop} collapsed={collapsed} />
                <NavItem icon="settings" label="Agents" active={isActive("agents")} onClick={noop} collapsed={collapsed} />
                <NavItem icon="docStudio" label="Document Studio" hint="BETA" hintTone="beta" active={isActive("doc-studio")} onClick={noop} collapsed={collapsed} />
                <NavItem icon="mcp" label="MCP" active={isActive("mcp")} onClick={noop} collapsed={collapsed} />
              </SidebarSection>
              <SidebarSection label="Accounting" collapsed={collapsed}>
                <NavItem icon="accounting" label="Accounting" iconRight="chevronR" active={isActive("accounting")} onClick={noop} collapsed={collapsed}
                  submenu={[
                    { id: "ledger",  label: "General Ledger" },
                    { id: "trial",   label: "Trial Balance" },
                    { id: "balance", label: "Balance Sheet" },
                    { id: "chart",   label: "Chart of Accounts" },
                    { id: "journal", label: "Journal Entries" },
                  ]}
                  activeSubId={page === "accounting" ? sub : null}
                  onSubmenuPick={noop}
                />
                <NavItem icon="report" label="Reports" active={isActive("reports")} onClick={noop} collapsed={collapsed} />
              </SidebarSection>
              <SidebarSection label="Files" collapsed={collapsed}>
                <NavItem icon="folder" label="Documents" active={isActive("documents")} onClick={noop} collapsed={collapsed} />
                <NavItem icon="quarterly" label="Quarterly Report" active={isActive("quarterly")} onClick={noop} collapsed={collapsed} />
                <NavItem icon="audit" label="Audit Report" active={isActive("audit")} onClick={noop} collapsed={collapsed} />
              </SidebarSection>
              <SidebarSection label="Management" collapsed={collapsed}>
                <NavItem icon="briefcase" label="LP Interest" active={isActive("lp-interest")} onClick={noop} collapsed={collapsed} />
                <NavItem icon="onboard" label="LP Onboarding" active={isActive("lp-onboarding")} onClick={noop} collapsed={collapsed} />
                <NavItem icon="dealRoom" label="Deal Room" active={isActive("deal-room")} onClick={noop} collapsed={collapsed} />
                <NavItem icon="users" label="Users" active={isActive("users")} onClick={noop} collapsed={collapsed} />
              </SidebarSection>
            </>
          )}
        </div>

        {/* Profile chip (static) */}
        {collapsed ? (
          <div style={{
            width: 36, height: 36, margin: "8px auto 0",
            borderRadius: 9, padding: 3,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Avatar name="Morgan Chen" size={28} seed={5} />
          </div>
        ) : (
          <div style={{
            marginTop: 8,
            padding: "10px 12px", borderRadius: 12,
            background: "var(--surface)",
            boxShadow: "inset 0 0 0 1px var(--border)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <Avatar name="Morgan Chen" size={28} seed={5} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Morgan Chen</div>
              <div style={{ fontSize: 11, color: "var(--muted-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Chen Family Office</div>
            </div>
            <Icon name="chevronD" size={12} color="var(--muted-3)" />
          </div>
        )}
      </aside>
    );
  }

  // ─── Section wrapper ───
  function Section({ label, theme, popup, children }) {
    return (
      <div className={"zexp-section" + (popup ? " zexp-popup-host" : "")} data-theme={theme}>
        <h2 className="zexp-label">{label}</h2>
        <div className="zexp-frame">{children}</div>
      </div>
    );
  }

  // ─── PageFrame: sidebar + topbar + main body ───
  function PageFrame({ entity, page, sub, sidebarCollapsed, mode, children }) {
    const noop = () => {};
    const topBarMode = mode || (page === "home" ? "home" : page === "zive-ai" ? "zive-ai" : undefined);
    return (
      <>
        <MiniSidebar entity={entity} page={page} sub={sub} collapsed={!!sidebarCollapsed} />
        <div className="zexp-main">
          <TopBar onAskAI={noop} entity={entity} onChangeEntity={noop} onGoHome={noop} mode={topBarMode} />
          <main style={{ flex: 1, overflow: "visible" }}>{children}</main>
        </div>
      </>
    );
  }

  // ─── Render the page body for a given descriptor ───
  function renderPageBody(d) {
    const { page, props = {} } = d;
    switch (page) {
      case "home":            return <HomeScreen onOpenFund={() => {}} onAskAI={() => {}} onOpenEntity={() => {}} />;
      case "zive-ai":         return <ZiveAIPage />;
      case "dashboard":       return <DashboardPage />;
      case "activity":        return <ActivityPage />;
      case "documents":       return <AllFilesPage />;
      case "settings":        return <ComingSoon title="Settings" icon="settings" />;
      case "capital-calls":   return <CapitalCallsPage />;
      case "distributions":   return <DistributionsPage />;
      case "startups":        return <StartupsPage onOpen={() => {}} />;
      case "ai-upload":       return <AIUploadPage />;
      case "agents":          return <AgentsPage />;
      case "doc-studio":      return <DocStudioPage />;
      case "mcp":             return <MCPPage />;
      case "quarterly":       return <QuarterlyReportPage />;
      case "audit":           return <AuditReportPage />;
      case "lp-interest":     return <LPInterestPage />;
      case "deal-room":       return <DealRoomPage />;
      case "users":           return <UsersPage />;
      case "vcfo-dashboards": return <VCFODashboards />;
      case "vcfo-documents":  return <VCFODocuments />;
      case "vcfo-api":        return <VCFOApi />;
      case "vcfo-agents":     return <VCFOAgents />;
      case "vcfo-doc-studio": return <VCFODocStudio />;
      case "vcfo-mcp":        return <VCFOMCP />;
      case "vcfo-users":      return <VCFOUsers />;
      case "lp-overview":     return <LPOverview />;
      case "lp-wire":         return <LPWireInstructions />;

      case "portfolio":       return <PortfolioPage {...props} />;
      case "investors":       return <InvestorsPage {...props} />;
      case "accounting":      return <AccountingPage {...props} />;

      case "fund":            return <FundDetail onBack={() => {}} {...props} />;
      case "startup-profile": return <StartupProfilePage onBack={() => {}} {...props} />;
      case "tasks":           return <TasksPage onOpenFund={() => {}} {...props} />;
      case "bluecheck":       return <BlueCheckPage {...props} />;
      case "reports":         return <ReportsPage {...props} />;
      case "lp-onboarding":   return <LPOnboardingPage {...props} />;

      case "vcfo-investments":   return <VCFOInvestments {...props} />;
      case "vcfo-funds":         return <VCFOFunds {...props} />;
      case "vcfo-accounting":    return <VCFOAccounting {...props} />;
      case "vcfo-reporting":     return <VCFOReporting {...props} />;
      case "vcfo-lp-portal":     return <VCFOLPPortal {...props} />;
      case "vcfo-uda":           return <VCFOUDA {...props} />;
      case "vcfo-financing-docs": return <VCFOFinancingDocs {...props} />;
      default:                return <div style={{ padding: 40 }}>Unknown page: {page}</div>;
    }
  }

  // ─── Render popup ───
  function renderPopup(name) {
    const close = () => {};
    switch (name) {
      case "NewInvitationModal":          return <NewInvitationModal onClose={close} />;
      case "NewOnboardingTemplateModal":  return <NewOnboardingTemplateModal onClose={close} />;
      case "UploadDocumentsModal":        return <UploadDocumentsModal onClose={close} />;
      case "AddInvestorModal":            return <AddInvestorModal onClose={close} />;
      case "BulkUploadInvestorsModal":    return <BulkUploadInvestorsModal onClose={close} />;
      case "NewAgentModal":               return <NewAgentModal onClose={close} />;
      case "TaskRespondModal":            return <TaskRespondModal onClose={close} task={{
        desc: "Post Money Safe Missing\nFields: Valuation Cap, Discount Rate — Zephyr Innovations",
        assignee: "Zive", type: "Safe Missing Fields",
      }} />;
      case "AskSidebar":                  return <AskSidebar onClose={close} onExpand={close} />;
      default:                            return null;
    }
  }

  // ─── Build manifest ───
  const SECTIONS = [];

  // A. Sidebar variants — dark-only banner sections (3)
  SECTIONS.push({ label: "Sidebar — Main (admin-iv)", theme: "dark", entity: "admin-iv", page: "home", sidebarOnly: true });
  SECTIONS.push({ label: "Sidebar — VCFO (admin)",    theme: "dark", entity: "admin",    page: "vcfo-dashboards", sidebarOnly: true });
  SECTIONS.push({ label: "Sidebar — LP (admin-v)",    theme: "dark", entity: "admin-v",  page: "lp-overview", sidebarOnly: true });

  const themes = ["dark", "light"];

  // helper: push a same descriptor in both themes
  const pushBoth = (label, entity, page, props) => {
    for (const theme of themes) {
      SECTIONS.push({ label: `${label} — ${theme}`, theme, entity, page, props });
    }
  };

  // B. Top-level pages without internal tabs
  const NO_TAB_PAGES_ADMIN_IV = [
    ["home", "Home"], ["zive-ai", "Zive AI"], ["dashboard", "Dashboard"],
    ["activity", "Activity"], ["documents", "Documents"], ["settings", "Settings"],
    ["capital-calls", "Capital Calls"], ["distributions", "Distributions"],
    ["startups", "Startups"], ["ai-upload", "AI Upload"], ["agents", "Agents"],
    ["doc-studio", "Doc Studio"], ["mcp", "MCP"], ["quarterly", "Quarterly Report"],
    ["audit", "Audit Report"], ["lp-interest", "LP Interest"],
    ["deal-room", "Deal Room"], ["users", "Users"],
  ];
  for (const [page, label] of NO_TAB_PAGES_ADMIN_IV) pushBoth(label, "admin-iv", page);

  const NO_TAB_PAGES_VCFO = [
    ["vcfo-dashboards", "VCFO · Dashboards"],
    ["vcfo-documents",  "VCFO · Documents"],
    ["vcfo-api",        "VCFO · API"],
    ["vcfo-agents",     "VCFO · Agents"],
    ["vcfo-doc-studio", "VCFO · Doc Studio"],
    ["vcfo-mcp",        "VCFO · MCP"],
    ["vcfo-users",      "VCFO · Users"],
  ];
  for (const [page, label] of NO_TAB_PAGES_VCFO) pushBoth(label, "admin", page);

  const NO_TAB_PAGES_LP = [
    ["lp-overview", "LP · Overview"],
    ["lp-wire",     "LP · Wire Instructions"],
  ];
  for (const [page, label] of NO_TAB_PAGES_LP) pushBoth(label, "admin-v", page);

  // initialSub pages
  const PORTFOLIO_SUBS = ["overview", "soi", "irr", "company", "metrics", "equity"];
  for (const sub of PORTFOLIO_SUBS) pushBoth(`Portfolio · ${sub}`, "admin-iv", "portfolio", { initialSub: sub });

  const INVESTOR_SUBS = ["overview", "statement", "rollforward", "txns", "pnl", "commits"];
  for (const sub of INVESTOR_SUBS) pushBoth(`Investors · ${sub}`, "admin-iv", "investors", { initialSub: sub });

  const ACCOUNTING_SUBS = ["overview", "ledger", "trial", "balance", "chart", "journal"];
  for (const sub of ACCOUNTING_SUBS) pushBoth(`Accounting · ${sub}`, "admin-iv", "accounting", { initialSub: sub });

  // C. Page-internal tabs
  const FUND_TABS = ["overview", "investments", "statements", "documents", "tasks", "wire"];
  for (const t of FUND_TABS) pushBoth(`Fund · ${t}`, "admin-iv", "fund", { fundId: "sigma-iv", initialTab: t });

  const STARTUP_TABS = ["basic", "contact", "diversity", "financial", "extra", "profile"];
  for (const t of STARTUP_TABS) pushBoth(`Startup profile · ${t}`, "admin-iv", "startup-profile", { id: "circuitworks", initialTab: t });

  const TASKS_TABS = ["gp", "zive", "done"];
  for (const t of TASKS_TABS) pushBoth(`Tasks · ${t}`, "admin-iv", "tasks", { initialTab: t });

  const BLUECHECK_TABS = ["accounting", "dataroom", "alerts"];
  for (const t of BLUECHECK_TABS) pushBoth(`BlueCheck · ${t}`, "admin-iv", "bluecheck", { initialTab: t });

  const REPORTS_TABS = ["fund", "investors", "updates", "templates", "lpPortal", "audit"];
  for (const t of REPORTS_TABS) pushBoth(`Reports · ${t}`, "admin-iv", "reports", { initialTab: t });

  // LP Onboarding — top-level tabs
  for (const t of ["overview", "settings", "vicums", "demand"]) {
    pushBoth(`LP Onboarding · ${t}`, "admin-iv", "lp-onboarding", { initialTab: t });
  }
  // LP Onboarding — settings sub-tabs
  for (const sub of ["landing", "dashboard", "lpdocs", "wire", "custodians", "custom"]) {
    pushBoth(`LP Onboarding · settings · ${sub}`, "admin-iv", "lp-onboarding", { initialTab: "settings", initialSettingsSub: sub });
  }

  // VCFO Investments
  for (const t of ["deals", "portfolio-co", "portfolio-req", "fin-docs", "board", "legal", "legal-cmp", "analytics", "doc-up", "migration"]) {
    pushBoth(`VCFO Investments · ${t}`, "admin", "vcfo-investments", { initialTab: t });
  }

  // VCFO Funds — including capital-call sub tabs and bank providers
  for (const t of ["funds", "ccm", "pacing", "recycling", "banks"]) {
    pushBoth(`VCFO Funds · ${t}`, "admin", "vcfo-funds", { initialTab: t });
  }

  // VCFO Accounting
  for (const t of ["ca", "cc", "comp", "dist", "fin", "gltb", "schi", "cash", "exp", "fof", "alloc"]) {
    pushBoth(`VCFO Accounting · ${t}`, "admin", "vcfo-accounting", { initialTab: t });
  }

  // VCFO Reporting
  for (const t of ["perf", "ilpa", "qf", "audit", "custom", "year"]) {
    pushBoth(`VCFO Reporting · ${t}`, "admin", "vcfo-reporting", { initialTab: t });
  }

  // VCFO LP Portal
  for (const t of ["main", "history", "tax", "bank", "del", "broker", "ir", "conf"]) {
    pushBoth(`VCFO LP Portal · ${t}`, "admin", "vcfo-lp-portal", { initialTab: t });
  }

  // VCFO UDA
  for (const t of ["dash", "chats", "docs"]) {
    pushBoth(`VCFO UDA · ${t}`, "admin", "vcfo-uda", { initialTab: t });
  }

  // VCFO Financing Docs
  for (const t of ["up", "crit", "status", "rounds", "by", "cap", "char", "ira", "mrl", "rofr", "spa", "term", "vote"]) {
    pushBoth(`VCFO Financing Docs · ${t}`, "admin", "vcfo-financing-docs", { initialTab: t });
  }

  // D. Sub-page view-mode toggles
  // SchedulePage (portfolio/soi) — 4 variants: view × scope
  for (const view of ["grid", "list"]) {
    for (const scope of ["direct", "fund"]) {
      pushBoth(`Portfolio · soi · view=${view} · scope=${scope}`, "admin-iv", "portfolio",
        { initialSub: "soi", initialView: view, initialScope: scope });
    }
  }

  // PortfolioMetricsPage — independent dimensions
  const METRICS_BASE = { src: "summary", section: "burn", period: "annual" };
  const METRICS_SRC = ["summary", "qb", "manual"];
  const METRICS_SECTION = ["charts", "rev", "burn", "ownership", "notes"];
  const METRICS_PERIOD = ["annual", "quarterly", "monthly", "cash-m", "cash-y"];
  // unique combos with one axis varied
  const metricVariants = [];
  for (const s of METRICS_SRC) metricVariants.push({ src: s, section: METRICS_BASE.section, period: METRICS_BASE.period, axis: `src=${s}` });
  for (const s of METRICS_SECTION) if (s !== METRICS_BASE.section) metricVariants.push({ src: METRICS_BASE.src, section: s, period: METRICS_BASE.period, axis: `section=${s}` });
  for (const p of METRICS_PERIOD) if (p !== METRICS_BASE.period) metricVariants.push({ src: METRICS_BASE.src, section: METRICS_BASE.section, period: p, axis: `period=${p}` });
  for (const v of metricVariants) {
    pushBoth(`Portfolio · metrics · ${v.axis}`, "admin-iv", "portfolio",
      { initialSub: "metrics", initialSrc: v.src, initialSection: v.section, initialPeriod: v.period });
  }

  // GeneralLedgerPage — 3 scope variants
  for (const scope of ["all", "cash", "expense"]) {
    pushBoth(`Accounting · ledger · scope=${scope}`, "admin-iv", "accounting",
      { initialSub: "ledger", initialScope: scope });
  }

  // JournalEntriesPage — 4 filter variants
  for (const filter of ["all", "posted", "drafts", "review"]) {
    pushBoth(`Accounting · journal · filter=${filter}`, "admin-iv", "accounting",
      { initialSub: "journal", initialFilter: filter });
  }

  // FTCapitalCall — activeTab variants (under vcfo-funds tab=ccm)
  for (const at of ["active", "pending"]) {
    pushBoth(`VCFO Funds · ccm · activeTab=${at}`, "admin", "vcfo-funds",
      { initialTab: "ccm", initialActiveTab: at });
  }

  // FTConnectedBanks — provider variants (under vcfo-funds tab=banks)
  for (const prov of ["plaid", "mercury"]) {
    pushBoth(`VCFO Funds · banks · provider=${prov}`, "admin", "vcfo-funds",
      { initialTab: "banks", initialProvider: prov });
  }

  // E. Popups — dark only, mounted on top of a dashboard page
  const POPUPS = [
    "NewInvitationModal",
    "NewOnboardingTemplateModal",
    "UploadDocumentsModal",
    "AddInvestorModal",
    "BulkUploadInvestorsModal",
    "NewAgentModal",
    "TaskRespondModal",
    "AskSidebar",
  ];
  for (const popup of POPUPS) {
    SECTIONS.push({
      label: `Popup · ${popup}`,
      theme: "dark", entity: "admin-iv", page: "dashboard",
      popup,
    });
  }

  // ─── Sidebar-only descriptor renderer ───
  function SidebarOnlySection({ d }) {
    return (
      <Section label={d.label} theme={d.theme}>
        <MiniSidebar entity={d.entity} page={d.page} collapsed={false} />
        <div className="zexp-main">
          <TopBar onAskAI={() => {}} entity={d.entity} onChangeEntity={() => {}} onGoHome={() => {}} />
          <main style={{ flex: 1, padding: 40, color: "var(--muted)", fontSize: 12 }}>
            (Sidebar variant preview)
          </main>
        </div>
      </Section>
    );
  }

  // ─── Top-level App ───
  function ExpandedApp() {
    return (
      <>
        {SECTIONS.map((d, i) => {
          const inner = d.sidebarOnly ? (
            <SidebarOnlySection d={d} />
          ) : d.popup ? (
            <Section label={d.label} theme={d.theme} popup>
              <PageFrame entity={d.entity} page={d.page} sub={d.props?.initialSub} sidebarCollapsed={!!d.sidebarCollapsed}>
                {renderPageBody(d)}
                <div className="zexp-popup-inline">{renderPopup(d.popup)}</div>
              </PageFrame>
            </Section>
          ) : (
            <Section label={d.label} theme={d.theme}>
              <PageFrame entity={d.entity} page={d.page} sub={d.props?.initialSub} sidebarCollapsed={!!d.sidebarCollapsed}>
                {renderPageBody(d)}
              </PageFrame>
            </Section>
          );
          return <ZexpBoundary key={i} label={d.label}>{inner}</ZexpBoundary>;
        })}
      </>
    );
  }

  window.__ZEXP_SECTIONS_COUNT = SECTIONS.length;
  ReactDOM.createRoot(document.getElementById("root")).render(<ExpandedApp />);
})();
