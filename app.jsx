// Zive — App shell & routing
const { useState: useStateApp, useEffect: useEffectApp } = React;

function App() {
  const [route, setRoute] = useStateApp(() => {
    try { return JSON.parse(localStorage.getItem("zive.route")) || { page: "home" }; } catch { return { page: "home" }; }
  });
  const [askOpen, setAskOpen] = useStateApp(false);
  const [popup, setPopup] = useStateApp(null); // { kind: "invite" | "template" | "upload", props? }
  React.useEffect(() => {
    window.zivePopup = {
      openInvite: (props) => setPopup({ kind: "invite", props }),
      openTemplate: (props) => setPopup({ kind: "template", props }),
      openUpload: (props) => setPopup({ kind: "upload", props }),
      openAddInvestor: () => setPopup({ kind: "addInvestor" }),
      openBulkUpload: () => setPopup({ kind: "bulkUpload" }),
      openTaskRespond: (props) => setPopup({ kind: "taskRespond", props }),
      openNewAgent: () => setPopup({ kind: "newAgent" }),
      openAsk: () => setAskOpen(true),
      close: () => setPopup(null),
    };
    return () => { delete window.zivePopup; };
  }, []);
  const [entity, setEntity] = useStateApp(() => {
    try { return localStorage.getItem("zive.entity") || "admin-iv"; } catch { return "admin-iv"; }
  });
  useEffectApp(() => { try { localStorage.setItem("zive.entity", entity); } catch {} }, [entity]);
  const [sidebarCollapsed, setSidebarCollapsed] = useStateApp(() => {
    try { return localStorage.getItem("zive.sidebar") === "collapsed"; } catch { return false; }
  });

  useEffectApp(() => {
    localStorage.setItem("zive.route", JSON.stringify(route));
  }, [route]);

  useEffectApp(() => {
    localStorage.setItem("zive.sidebar", sidebarCollapsed ? "collapsed" : "expanded");
  }, [sidebarCollapsed]);

  useEffectApp(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setAskOpen(true);
      }
      if (e.key === "Escape") setAskOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Nav config + body resolver per entity — same chrome, different content.
  const VCFO_NAV_CFG = [
    { items: [
      { id: "home", label: "Home", icon: "home" },
      { id: "vcfo-dashboards", label: "Dashboards", icon: "dashboard" },
      { id: "vcfo-documents", label: "Documents", icon: "folder" },
      { id: "vcfo-api", label: "API", icon: "anchor" },
    ]},
    { label: "Modules", items: [
      { id: "vcfo-investments", label: "Investments", icon: "trendUp" },
      { id: "vcfo-funds", label: "Funds", icon: "pie" },
      { id: "vcfo-accounting", label: "Accounting", icon: "accounting" },
      { id: "vcfo-reporting", label: "Reporting", icon: "report" },
      { id: "vcfo-lp-portal", label: "LP Portal", icon: "investor" },
      { id: "vcfo-uda", label: "Unstructured Data Analyzer", icon: "bookmark" },
      { id: "vcfo-financing-docs", label: "Financing Documents", icon: "vault" },
    ]},
    { label: "AI", items: [
      { id: "vcfo-agents", label: "Agents", icon: "settings" },
      { id: "vcfo-doc-studio", label: "Document Studio", icon: "docStudio", hint: "BETA", hintTone: "beta" },
      { id: "vcfo-mcp", label: "MCP", icon: "mcp" },
    ]},
    { label: "Administration", items: [
      { id: "vcfo-users", label: "Users", icon: "users" },
    ]},
  ];

  const LP_NAV_CFG = [
    { items: [
      { id: "home", label: "Home", icon: "home" },
    ]},
    { label: "Fund", items: [
      { id: "lp-overview", label: "Overview", icon: "dashboard" },
    ]},
    { label: "Accounting", items: [
      { id: "lp-wire", label: "Wire Instructions", icon: "vault" },
    ]},
  ];

  // Default landing page per entity
  React.useEffect(() => {
    if (entity === "admin" && !route.page.startsWith("vcfo-")) setRoute({ page: "vcfo-dashboards" });
    if (entity === "admin-v" && !route.page.startsWith("lp-")) setRoute({ page: "lp-overview" });
    if (entity === "admin-iv" && (route.page.startsWith("vcfo-") || route.page.startsWith("lp-"))) setRoute({ page: "home" });
  }, [entity]);

  const navConfig = entity === "admin" ? VCFO_NAV_CFG : entity === "admin-v" ? LP_NAV_CFG : null;

  const renderBody = () => {
    // Home is entity-agnostic — same screen regardless of which entity is selected.
    if (route.page === "home") return <HomeScreen onOpenFund={id => setRoute({ page: "fund", id })} onAskAI={() => setAskOpen(true)} onOpenEntity={(id) => { setEntity(id); setRoute({ page: id === "admin" ? "vcfo-dashboards" : id === "admin-v" ? "lp-overview" : "dashboard" }); }} />;
    if (route.page === "zive-ai") return <ZiveAIPage />;
    if (entity === "admin") {
      if (route.page === "vcfo-dashboards") return <VCFODashboards />;
      if (route.page === "vcfo-documents") return <VCFODocuments />;
      if (route.page === "vcfo-api") return <VCFOApi />;
      if (route.page === "vcfo-investments") return <VCFOInvestments />;
      if (route.page === "vcfo-funds") return <VCFOFunds />;
      if (route.page === "vcfo-accounting") return <VCFOAccounting />;
      if (route.page === "vcfo-reporting") return <VCFOReporting />;
      if (route.page === "vcfo-lp-portal") return <VCFOLPPortal />;
      if (route.page === "vcfo-uda") return <VCFOUDA />;
      if (route.page === "vcfo-financing-docs") return <VCFOFinancingDocs />;
      if (route.page === "vcfo-agents") return <VCFOAgents />;
      if (route.page === "vcfo-doc-studio") return <VCFODocStudio />;
      if (route.page === "vcfo-mcp") return <VCFOMCP />;
      if (route.page === "vcfo-users") return <VCFOUsers />;
      return <VCFODashboards />;
    }
    if (entity === "admin-v") {
      if (route.page === "lp-overview") return <LPOverview />;
      if (route.page === "lp-wire") return <LPWireInstructions />;
      return <LPOverview />;
    }
    // admin-iv (default)
    if (route.page === "fund") return <FundDetail fundId={route.id} onBack={() => setRoute({ page: "home" })} />;
    if (route.page === "dashboard") return <DashboardPage />;
    if (route.page === "tasks") return <TasksPage onOpenFund={id => setRoute({ page: "fund", id })} />;
    if (route.page === "bluecheck") return <BlueCheckPage />;
    if (route.page === "activity") return <ActivityPage />;
    if (route.page === "documents") return <AllFilesPage />;
    if (route.page === "settings") return <ComingSoon title="Settings" icon="settings" />;
    if (route.page === "portfolio") return <PortfolioPage initialSub={route.sub} />;
    if (route.page === "investors") return <InvestorsPage initialSub={route.sub} />;
    if (route.page === "capital-calls") return <CapitalCallsPage />;
    if (route.page === "distributions") return <DistributionsPage />;
    if (route.page === "startups") return <StartupsPage onOpen={(id) => setRoute({ page: "startup-profile", id })} />;
    if (route.page === "startup-profile") return <StartupProfilePage id={route.id} onBack={() => setRoute({ page: "startups" })} />;
    if (route.page === "ai-upload") return <AIUploadPage />;
    if (route.page === "agents") return <AgentsPage />;
    if (route.page === "doc-studio") return <DocStudioPage />;
    if (route.page === "mcp") return <MCPPage />;
    if (route.page === "accounting") return <AccountingPage initialSub={route.sub} />;
    if (route.page === "reports") return <ReportsPage />;
    if (route.page === "quarterly") return <QuarterlyReportPage />;
    if (route.page === "audit") return <AuditReportPage />;
    if (route.page === "lp-interest") return <LPInterestPage />;
    if (route.page === "lp-onboarding") return <LPOnboardingPage />;
    if (route.page === "deal-room") return <DealRoomPage />;
    if (route.page === "users") return <UsersPage />;
    return <ComingSoon title="Page" icon="sparkle" />;
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar route={route} setRoute={setRoute} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(v => !v)} navConfig={navConfig} hidden={route.page === "home"} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBar onAskAI={() => setAskOpen(true)} entity={entity} onChangeEntity={(id) => { setEntity(id); setRoute({ page: "dashboard" }); }} onGoHome={() => setRoute({ page: "home" })} mode={route.page === "home" ? "home" : route.page === "zive-ai" ? "zive-ai" : undefined} />
        <main style={{ flex: 1, overflow: "auto" }}>
          {renderBody()}
        </main>
      </div>
      {route.page === "home" && <HomeProfileChip />}
      {askOpen && <AskSidebar onClose={() => setAskOpen(false)} onExpand={() => { setAskOpen(false); setRoute({ page: "zive-ai" }); }} />}
      {popup?.kind === "invite" && <NewInvitationModal onClose={() => setPopup(null)} {...(popup.props||{})} />}
      {popup?.kind === "template" && <NewOnboardingTemplateModal onClose={() => setPopup(null)} {...(popup.props||{})} />}
      {popup?.kind === "upload" && <UploadDocumentsModal onClose={() => setPopup(null)} {...(popup.props||{})} />}
      {popup?.kind === "addInvestor" && <AddInvestorModal onClose={() => setPopup(null)} />}
      {popup?.kind === "bulkUpload" && <BulkUploadInvestorsModal onClose={() => setPopup(null)} />}
      {popup?.kind === "newAgent" && <NewAgentModal onClose={() => setPopup(null)} />}
      {popup?.kind === "taskRespond" && <TaskRespondModal onClose={() => setPopup(null)} {...(popup.props||{})} />}
    </div>
  );
}

function Sidebar({ route, setRoute, collapsed, onToggleCollapse, navConfig, hidden }) {
  if (hidden) return null;
  const [profileOpen, setProfileOpen] = useStateApp(false);
  const [viewingAs, setViewingAs] = useStateApp("Admin");
  const profileTriggerRef = React.useRef(null);

  const width = collapsed ? 56 : 248;

  const go = (page) => setRoute({ page });
  const isActive = (page) => route.page === page;

  // Custom nav (for VCFO / LP shells) — reuse the same chrome but render different items.
  const renderNav = navConfig ? () => (
    <>
      <SidebarSection collapsed={collapsed}>
        <ZiveAINavItem active={isActive("zive-ai")} onClick={() => go("zive-ai")} collapsed={collapsed} />
      </SidebarSection>
      {navConfig.map((sec, i) => (
        <SidebarSection key={i} label={sec.label} collapsed={collapsed}>
          {sec.items.map(it => (
            <NavItem
              key={it.id}
              icon={it.icon}
              label={it.label}
              hint={it.hint}
              hintTone={it.hintTone}
              iconRight={it.iconRight}
              active={isActive(it.id)}
              onClick={() => go(it.id)}
              collapsed={collapsed}
            />
          ))}
        </SidebarSection>
      ))}
    </>
  ) : null;

  return (
    <aside style={{
      width, flexShrink: 0,
      background: "var(--bg)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
      padding: collapsed ? "12px 4px" : "12px 10px",
      position: "sticky", top: 0, height: "100vh", overflow: "hidden",
      transition: "width 200ms cubic-bezier(0.4, 0, 0.2, 1), padding 200ms ease",
    }}>
      {/* ━━━ Top: collapse toggle + Zive wordmark ━━━ */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: collapsed ? "4px 0 8px" : "2px 6px 10px",
        minHeight: 36,
      }}>
        {collapsed ? (
          <button onClick={onToggleCollapse} title="Expand sidebar" style={{
            width: 36, height: 32, margin: "0 auto",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "transparent", border: "none", borderRadius: 7,
            color: "var(--muted)",
            cursor: "pointer", transition: "all 120ms ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--fg)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}
          >
            <Icon name="panelLeft" size={17} />
          </button>
        ) : (
          <>
            <button onClick={onToggleCollapse} title="Collapse sidebar" style={{
              width: 30, height: 30,
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "transparent", border: "none", borderRadius: 7,
              color: "var(--muted-2)",
              cursor: "pointer", transition: "all 120ms ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--fg)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-2)"; }}
            >
              <Icon name="panelLeft" size={15} />
            </button>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ZiveWordmark height={18} color="var(--fg)" />
            </div>
            <div style={{ width: 30 }} />
          </>
        )}
      </div>

      {/* ━━━ Scrollable nav area ━━━ */}
      <div style={{ flex: 1, overflow: "auto", marginRight: collapsed ? 0 : -6, paddingRight: collapsed ? 0 : 6 }}>

        {renderNav ? renderNav() : (<>
        {/* Zive AI — highlighted, above Home */}
        <SidebarSection collapsed={collapsed}>
          <ZiveAINavItem active={isActive("zive-ai")} onClick={() => go("zive-ai")} collapsed={collapsed} />
        </SidebarSection>

        {/* Home nav item */}
        <SidebarSection collapsed={collapsed}>
          <NavItem icon="home" label="Home" active={isActive("home")} onClick={() => go("home")} collapsed={collapsed} />
        </SidebarSection>

        {/* Tasks + BlueCheck */}
        <SidebarSection collapsed={collapsed}>
          <NavItem icon="tasks" label="Tasks" hint="7" hintTone="danger" active={isActive("tasks")} onClick={() => go("tasks")} collapsed={collapsed} />
          <NavItem icon="shieldCheck" label="BlueCheck" hint="14" hintTone="danger" active={isActive("bluecheck")} onClick={() => go("bluecheck")} collapsed={collapsed} />
        </SidebarSection>

        {/* FUND */}
        <SidebarSection label="Fund" collapsed={collapsed}>
          <NavItem icon="dashboard" label="Dashboard" active={isActive("dashboard")} onClick={() => go("dashboard")} collapsed={collapsed} />
          <NavItem icon="pie" label="Portfolio" iconRight="chevronR" active={isActive("portfolio")} onClick={() => go("portfolio")} collapsed={collapsed}
            submenu={[
              { id: "soi",      label: "Schedule Of Investments" },
              { id: "irr",      label: "Deal IRR" },
              { id: "company",  label: "Company Overview" },
              { id: "metrics",  label: "Portfolio Metrics" },
              { id: "equity",   label: "Equity Schedule" },
            ]}
            activeSubId={route.page === "portfolio" ? route.sub : null}
            onSubmenuPick={(sub) => setRoute({ page: "portfolio", sub })}
          />
          <NavItem icon="investor" label="Investors" iconRight="chevronR" active={isActive("investors")} onClick={() => go("investors")} collapsed={collapsed}
            submenu={[
              { id: "statement",   label: "Capital Statement" },
              { id: "rollforward", label: "Partner roll forwards" },
              { id: "txns",        label: "Transactions" },
              { id: "pnl",         label: "P&L" },
              { id: "commits",     label: "Commitment History" },
            ]}
            activeSubId={route.page === "investors" ? route.sub : null}
            onSubmenuPick={(sub) => setRoute({ page: "investors", sub })}
          />
          <NavItem icon="capitalCall" label="Capital Calls" active={isActive("capital-calls")} onClick={() => go("capital-calls")} collapsed={collapsed} />
          <NavItem icon="distribution" label="Distributions" active={isActive("distributions")} onClick={() => go("distributions")} collapsed={collapsed} />
          <NavItem icon="briefcase" label="Startups" active={isActive("startups")} onClick={() => go("startups")} collapsed={collapsed} />
        </SidebarSection>

        {/* AI */}
        <SidebarSection label="AI" collapsed={collapsed}>
          <NavItem icon="aiUpload" label="AI Upload" active={isActive("ai-upload")} onClick={() => go("ai-upload")} collapsed={collapsed} />
          <NavItem icon="settings" label="Agents" active={isActive("agents")} onClick={() => go("agents")} collapsed={collapsed} />
          <NavItem icon="docStudio" label="Document Studio" hint="BETA" hintTone="beta" active={isActive("doc-studio")} onClick={() => go("doc-studio")} collapsed={collapsed} />
          <NavItem icon="mcp" label="MCP" active={isActive("mcp")} onClick={() => go("mcp")} collapsed={collapsed} />
        </SidebarSection>

        {/* ACCOUNTING */}
        <SidebarSection label="Accounting" collapsed={collapsed}>
          <NavItem icon="accounting" label="Accounting" iconRight="chevronR" active={isActive("accounting")} onClick={() => go("accounting")} collapsed={collapsed}
            submenu={[
              { id: "ledger",  label: "General Ledger" },
              { id: "trial",   label: "Trial Balance" },
              { id: "balance", label: "Balance Sheet" },
              { id: "chart",   label: "Chart of Accounts" },
              { id: "journal", label: "Journal Entries" },
            ]}
            activeSubId={route.page === "accounting" ? route.sub : null}
            onSubmenuPick={(sub) => setRoute({ page: "accounting", sub })}
          />
          <NavItem icon="report" label="Reports" active={isActive("reports")} onClick={() => go("reports")} collapsed={collapsed} />
        </SidebarSection>

        {/* FILES */}
        <SidebarSection label="Files" collapsed={collapsed}>
          <NavItem icon="folder" label="Documents" active={isActive("documents")} onClick={() => go("documents")} collapsed={collapsed} />
          <NavItem icon="quarterly" label="Quarterly Report" active={isActive("quarterly")} onClick={() => go("quarterly")} collapsed={collapsed} />
          <NavItem icon="audit" label="Audit Report" active={isActive("audit")} onClick={() => go("audit")} collapsed={collapsed} />
        </SidebarSection>

        {/* MANAGEMENT */}
        <SidebarSection label="Management" collapsed={collapsed}>
          <NavItem icon="briefcase" label="LP Interest" active={isActive("lp-interest")} onClick={() => go("lp-interest")} collapsed={collapsed} />
          <NavItem icon="onboard" label="LP Onboarding" active={isActive("lp-onboarding")} onClick={() => go("lp-onboarding")} collapsed={collapsed} />
          <NavItem icon="dealRoom" label="Deal Room" active={isActive("deal-room")} onClick={() => go("deal-room")} collapsed={collapsed} />
          <NavItem icon="users" label="Users" active={isActive("users")} onClick={() => go("users")} collapsed={collapsed} />
        </SidebarSection>
        </>)}

      </div>

      {/* ━━━ Bottom: profile ━━━ */}
      {collapsed ? (
        <button
          ref={profileTriggerRef}
          onClick={() => setProfileOpen(v => !v)}
          title="Morgan Chen"
          style={{
            width: 36, height: 36, margin: "8px auto 0",
            borderRadius: 9,
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: 3,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 120ms ease",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
        >
          <Avatar name="Morgan Chen" size={28} seed={5} />
        </button>
      ) : (
        <div
          ref={profileTriggerRef}
          style={{
            marginTop: 8,
            padding: "10px 12px", borderRadius: 12,
            background: "var(--surface)",
            boxShadow: "inset 0 0 0 1px var(--border)",
            display: "flex", alignItems: "center", gap: 10,
            cursor: "pointer",
            transition: "background 120ms ease",
          }}
          onClick={() => setProfileOpen(v => !v)}
          onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
          onMouseLeave={e => e.currentTarget.style.background = "var(--surface)"}
        >
          <Avatar name="Morgan Chen" size={28} seed={5} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Morgan Chen</div>
            <div style={{ fontSize: 11, color: "var(--muted-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Chen Family Office</div>
          </div>
          <Icon name="chevronD" size={12} color="var(--muted-3)" style={{ transform: profileOpen ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }} />
        </div>
      )}

      {profileOpen && (
        <ProfileMenu
          triggerRef={profileTriggerRef}
          onClose={() => setProfileOpen(false)}
          viewingAs={viewingAs}
          setViewingAs={setViewingAs}
          onNavigate={(p) => { setProfileOpen(false); setRoute({ page: p }); }}
        />
      )}
    </aside>
  );
}

// ────────────── Floating profile chip on Home ──────────────
function HomeProfileChip() {
  const [open, setOpen] = useStateApp(false);
  const [viewingAs, setViewingAs] = useStateApp("Admin");
  const triggerRef = React.useRef(null);

  return (
    <>
      <div
        ref={triggerRef}
        onClick={() => setOpen(v => !v)}
        style={{
          position: "fixed",
          bottom: 16, left: 16,
          zIndex: 40,
          display: "flex", alignItems: "center", gap: 10,
          padding: "8px 12px 8px 8px",
          background: "var(--surface)",
          borderRadius: 12,
          boxShadow: "0 0 0 1px var(--border-strong), 0 4px 12px -4px rgba(24,24,27,0.10)",
          cursor: "pointer",
          minWidth: 200, maxWidth: 240,
          transition: "background 120ms ease, box-shadow 120ms ease",
        }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; }}
      >
        <Avatar name="Morgan Chen" size={28} seed={5} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Morgan Chen</div>
          <div style={{ fontSize: 11, color: "var(--muted-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>Chen Family Office</div>
        </div>
        <Icon name="chevronD" size={12} color="var(--muted-3)" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }} />
      </div>

      {open && (
        <ProfileMenu
          triggerRef={triggerRef}
          onClose={() => setOpen(false)}
          viewingAs={viewingAs}
          setViewingAs={setViewingAs}
          onNavigate={() => setOpen(false)}
        />
      )}
    </>
  );
}

// ────────────── Profile menu popover ──────────────
function ProfileMenu({ onClose, viewingAs, setViewingAs, onNavigate, triggerRef }) {
  const ref = React.useRef(null);
  const [pos, setPos] = useStateApp({ left: 0, bottom: 0 });
  const [theme, setTheme] = useStateApp(() => {
    try { return document.documentElement.getAttribute("data-theme") || "dark"; } catch { return "dark"; }
  });
  const applyTheme = (t) => {
    setTheme(t);
    try {
      document.documentElement.setAttribute("data-theme", t);
      localStorage.setItem("zive.theme", t);
    } catch {}
  };

  useEffectApp(() => {
    const updatePos = () => {
      const r = triggerRef?.current?.getBoundingClientRect();
      if (!r) return;
      setPos({
        left: r.right + 10,
        bottom: window.innerHeight - r.bottom,
      });
    };
    updatePos();
    window.addEventListener("resize", updatePos);
    window.addEventListener("scroll", updatePos, true);
    return () => {
      window.removeEventListener("resize", updatePos);
      window.removeEventListener("scroll", updatePos, true);
    };
  }, []);

  useEffectApp(() => {
    const onDoc = (e) => {
      if (ref.current?.contains(e.target)) return;
      if (triggerRef?.current?.contains(e.target)) return;
      onClose();
    };
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    setTimeout(() => document.addEventListener("mousedown", onDoc), 0);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, []);

  return ReactDOM.createPortal(
    <div
      ref={ref}
      className="fade-up"
      style={{
        position: "fixed",
        left: pos.left,
        bottom: pos.bottom,
        width: 296,
        background: "var(--elevated)",
        border: "1px solid var(--border-strong)",
        borderRadius: 14,
        boxShadow: "var(--shadow-modal)",
        padding: 6,
        zIndex: 200,
        cursor: "default",
      }}
    >
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 12px 14px",
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: "linear-gradient(135deg, #8E7CFF 0%, #4B3FAB 100%)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 15, fontWeight: 600, color: "#fff",
          letterSpacing: -0.4,
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)",
        }}>MC</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--fg)" }}>Morgan Chen</div>
          <div style={{ fontSize: 11.5, color: "var(--accent)", fontWeight: 500, marginTop: 1 }}>Pro plan</div>
        </div>
        <div style={{
          fontSize: 10.5, fontWeight: 600,
          padding: "3px 8px", borderRadius: 6,
          background: "var(--accent-tint-2)",
          color: "var(--accent)",
          letterSpacing: 0.4, textTransform: "uppercase",
          boxShadow: "inset 0 0 0 1px var(--accent-ring-35)",
        }}>PRO</div>
      </div>

      {/* Quick actions */}
      <div style={{ display: "flex", gap: 6, padding: "0 6px 10px" }}>
        <QuickAction icon="plus" label="Add fund" />
        <QuickAction icon="sparkle" label="Add model" />
      </div>

      <Divider />

      {/* Primary nav */}
      <MenuItem icon="sparkle" label="Subscription" hint="Manage plan" />
      <MenuItem icon="users" label="Users & permissions" />
      <MenuItem icon="settings" label="Settings" onClick={() => onNavigate("settings")} />

      <Divider />

      {/* Theme toggle */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
      }}>
        <Icon name={theme === "light" ? "sun" : "moon"} size={15} color="var(--muted)" />
        <div style={{ flex: 1, fontSize: 13, color: "var(--fg-2)" }}>Theme</div>
        <ThemeSwitch value={theme} onChange={applyTheme} />
      </div>

      {/* Browsing as */}
      <div style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "10px 12px",
        borderRadius: 8,
      }}>
        <Icon name="glasses" size={15} color="var(--muted)" />
        <div style={{ flex: 1, fontSize: 13, color: "var(--fg-2)" }}>Browsing as</div>
        <RoleSelect value={viewingAs} onChange={setViewingAs} />
      </div>

      <Divider />

      <MenuItem icon="help" label="Help & docs" iconRight="external" />
      <MenuItem icon="power" label="Log out" danger />
    </div>,
    document.body
  );
}

function QuickAction({ icon, label }) {
  return (
    <button style={{
      flex: 1,
      height: 34,
      background: "var(--surface-2)",
      border: "1px solid var(--border)",
      borderRadius: 8,
      color: "var(--fg-2)",
      fontSize: 12.5, fontWeight: 500,
      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "all 120ms ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.borderColor = "var(--border)"; }}
    >
      <Icon name={icon} size={13} color="var(--muted)" />
      {label}
    </button>
  );
}

function MenuItem({ icon, label, hint, iconRight, danger, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10,
      width: "100%",
      padding: "9px 12px",
      borderRadius: 8,
      background: "transparent", border: "none",
      color: danger ? "var(--muted)" : "var(--fg-2)",
      fontSize: 13, fontWeight: 450,
      cursor: "pointer",
      fontFamily: "inherit",
      transition: "background 100ms ease, color 100ms ease",
      textAlign: "left",
    }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger ? "rgba(239, 68, 68, 0.08)" : "var(--surface-2)";
        if (danger) e.currentTarget.style.color = "#F87171";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "transparent";
        if (danger) e.currentTarget.style.color = "var(--muted)";
      }}
    >
      <Icon name={icon} size={15} color="currentColor" style={{ opacity: 0.8 }} />
      <span style={{ flex: 1 }}>{label}</span>
      {hint && <span style={{ fontSize: 11, color: "var(--muted-3)" }}>{hint}</span>}
      {iconRight && <Icon name={iconRight} size={12} color="var(--muted-3)" />}
    </button>
  );
}

function ThemeSwitch({ value, onChange }) {
  const opts = [
    { id: "dark", icon: "moon", label: "Dark" },
    { id: "light", icon: "sun", label: "Light" },
  ];
  return (
    <div style={{
      display: "inline-flex", padding: 2,
      background: "var(--surface-2)",
      border: "1px solid var(--border)",
      borderRadius: 7,
    }}>
      {opts.map(o => {
        const active = value === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onChange(o.id)}
            title={o.label}
            style={{
              width: 28, height: 22, borderRadius: 5,
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              background: active ? "var(--surface-3)" : "transparent",
              boxShadow: active ? "inset 0 0 0 1px var(--border-strong)" : "none",
              border: "none", cursor: "pointer", padding: 0,
              transition: "background 120ms ease",
            }}
          >
            <Icon name={o.icon} size={12} color={active ? "var(--fg)" : "var(--muted-2)"} />
          </button>
        );
      })}
    </div>
  );
}

function RoleSelect({ value, onChange }) {
  const [open, setOpen] = useStateApp(false);
  const options = ["Admin", "Fund manager", "LP view", "Read-only"];
  return (
    <div style={{ position: "relative" }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(v => !v); }} style={{
        display: "flex", alignItems: "center", gap: 6,
        height: 26, padding: "0 8px 0 10px",
        background: "var(--surface-2)",
        border: "1px solid var(--border-strong)",
        borderRadius: 6,
        color: "var(--fg-2)",
        fontSize: 11, fontWeight: 600,
        letterSpacing: 0.4, textTransform: "uppercase",
        cursor: "pointer",
        fontFamily: "inherit",
      }}>
        {value}
        <Icon name="chevronD" size={11} color="var(--muted-2)" />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", right: 0,
          width: 160,
          background: "var(--elevated)",
          border: "1px solid var(--border-strong)",
          borderRadius: 8,
          boxShadow: "var(--shadow-pop-soft)",
          padding: 4,
          zIndex: 10,
        }}>
          {options.map(opt => (
            <button key={opt} onClick={(e) => { e.stopPropagation(); onChange(opt); setOpen(false); }}
              style={{
                display: "flex", alignItems: "center", gap: 8,
                width: "100%",
                padding: "7px 10px",
                borderRadius: 6,
                background: "transparent", border: "none",
                color: "var(--fg-2)",
                fontSize: 12,
                cursor: "pointer",
                fontFamily: "inherit",
                textAlign: "left",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <span style={{ flex: 1 }}>{opt}</span>
              {value === opt && <Icon name="check" size={12} color="var(--accent)" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Divider() {
  return <div style={{ height: 1, background: "var(--border)", margin: "4px 2px" }} />;
}

// ────────────── Tasks page ──────────────
const GP_TASKS = [
  { desc: "Post Money Safe Missing\nFields: Valuation Cap, Discount Rate — Zephyr Innovations", assignee: "Zive", type: "Safe Missing Fields" },
  { desc: "Post Money Safe Missing\nFields: Valuation Cap, Discount Rate — Zephyr Innovations", assignee: "Zive", type: "Safe Missing Fields" },
  { desc: "Post Money Safe Missing\nFields: Valuation Cap, Discount Rate — Horizon Capital", assignee: "Zive", type: "Safe Missing Fields" },
  { desc: "Post Money Safe Missing\nFields: Valuation Cap, Discount Rate — Horizon Capital", assignee: "Zive", type: "Safe Missing Fields" },
  { desc: "Post Money Safe Missing\nFields: Valuation Cap, Discount Rate — Horizon Capital", assignee: "Zive", type: "Safe Missing Fields" },
  { desc: "Post Money Safe Missing\nFields: Valuation Cap, Discount Rate — Horizon Capital", assignee: "Zive", type: "Safe Missing Fields" },
  { desc: "Post Money Safe Missing\nFields: Valuation Cap, Discount Rate — Summit Ventures", assignee: "Zive", type: "Safe Missing Fields" },
];

function TasksPage({ onOpenFund }) {
  const [tab, setTab] = useState("gp");
  const TASK_COLS = [
    { key: "description", label: "Description", w: "minmax(260px, 2fr)" },
    { key: "dueDate", label: "Due Date", w: "140px" },
    { key: "assignee", label: "Assignee", w: "120px" },
    { key: "type", label: "Type", w: "180px" },
    { key: "adminResponse", label: "Admin Response", w: "140px" },
  ];
  const [colState, setColState] = useState({
    order: TASK_COLS.map(c => c.key),
    visible: Object.fromEntries(TASK_COLS.map(c => [c.key, true])),
  });
  const [sort, setSort] = useState({ key: null, dir: null });

  const tabs = [
    { id: "gp", label: "Pending For GP" },
    { id: "zive", label: "Pending For Zive" },
    { id: "done", label: "Completed" },
  ];

  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }} className="fade-up">
      {/* Header with right-side tabs */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: -0.6 }}>Tasks</h1>
        <div style={{ display: "flex", gap: 2, background: "var(--surface)", padding: 3, borderRadius: 10, boxShadow: "inset 0 0 0 1px var(--border)" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "7px 14px", borderRadius: 7,
              background: tab === t.id ? "var(--surface-3)" : "transparent",
              border: "none",
              color: tab === t.id ? "var(--fg)" : "var(--muted)",
              fontSize: 12.5, fontWeight: 500,
              boxShadow: tab === t.id ? "inset 0 0 0 1px var(--border-strong)" : "none",
              cursor: "pointer", transition: "all 120ms ease",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* Pending For GP section */}
      <SectionCard
        title="Pending For GP"
        cols={TASK_COLS}
        colState={colState}
        setColState={setColState}
      >
        <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: 1000 }}>
            {(() => {
              const visKeys = colState.order.filter(k => colState.visible[k]);
              const colMap = Object.fromEntries(TASK_COLS.map(c => [c.key, c]));
              const gridTemplate = visKeys.map(k => colMap[k].w).join(" ") + " 40px";
              return (
                <>
                  <div style={{
                    display: "grid", gridTemplateColumns: gridTemplate,
                    gap: 14, padding: "12px 22px",
                    borderBottom: "1px solid var(--border)",
                    fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500,
                  }}>
                    {visKeys.map(k => (
                      <SortHeader
                        key={k}
                        dir={sort.key === k ? sort.dir : null}
                        onClick={() => setSort(s => cycleSort(s, k))}
                      >
                        {colMap[k].label}
                      </SortHeader>
                    ))}
                    <div />
                  </div>
                  {sortRows(GP_TASKS, sort, (row, key) => {
                    if (key === "description") return row.desc;
                    return row[key];
                  }).map((t, i, arr) => (
                    <div key={i} className="row-hover" style={{
                      display: "grid", gridTemplateColumns: gridTemplate,
                      gap: 14, alignItems: "center", padding: "14px 22px",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                    }}>
                      {visKeys.map(k => {
                        if (k === "description") return <div key={k} style={{ fontSize: 12.5, color: "var(--fg-2)", whiteSpace: "pre-line", lineHeight: 1.5 }}>{t.desc}</div>;
                        if (k === "dueDate") return <div key={k} style={{ fontSize: 12.5, color: "var(--muted-3)" }}>—</div>;
                        if (k === "assignee") return <div key={k} style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{t.assignee}</div>;
                        if (k === "type") return <div key={k} style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{t.type}</div>;
                        if (k === "adminResponse") return (
                          <div key={k}>
                            <button onClick={() => window.zivePopup?.openTaskRespond({ task: t })} style={{
                              padding: "5px 14px", borderRadius: 7,
                              background: "transparent", color: "var(--accent)",
                              border: "1px solid var(--accent-ring-40)",
                              fontSize: 12, fontWeight: 500, cursor: "pointer",
                              fontFamily: "inherit",
                            }}>Respond</button>
                          </div>
                        );
                        return null;
                      })}
                      <div />
                    </div>
                  ))}
                </>
              );
            })()}
          </div>
        </div>
      </SectionCard>

      {/* Financial Reporting section */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ margin: "0 0 16px", fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>Financial Reporting</h2>
        <SectionCard title="Financial Reporting - Pending">
          <div style={{
            display: "grid", gridTemplateColumns: "2fr 1fr 1fr",
            gap: 14, padding: "12px 22px",
            borderBottom: "1px solid var(--border)",
            fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500,
          }}>
            <div>Name</div>
            <div>Status</div>
            <div>Action</div>
          </div>
          <div style={{ padding: "48px 22px", textAlign: "center", fontSize: 13, color: "var(--muted-2)" }}>
            No data available
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function SectionCard({ title, cols, colState, setColState, children }) {
  return (
    <Card padding={0}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 22px", borderBottom: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="tasks" size={13} color="var(--muted-2)" />
          <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--fg)" }}>{title}</div>
        </div>
        {cols && colState && (
          <div style={{ display: "flex", gap: 8 }}>
            <ColumnsMenu
              columns={cols}
              order={colState.order}
              visible={colState.visible}
              onChange={(next) => setColState(s => ({ ...s, ...next }))}
            />
          </div>
        )}
      </div>
      {children}
    </Card>
  );
}

const colBtnStyle = {
  display: "flex", alignItems: "center", gap: 8,
  width: "100%", padding: "8px 10px",
  background: "transparent", border: "none",
  color: "var(--fg-2)", fontSize: 12.5,
  cursor: "pointer", fontFamily: "inherit",
  borderRadius: 6, textAlign: "left",
};

// ────────────── Activity page ──────────────
function ActivityPage() {
  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }} className="fade-up">
      <div style={{ marginBottom: 4 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: -0.6 }}>Activity</h1>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 24 }}>All contributions, distributions, and fund events</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <Button variant="solid" size="md" icon="filter">All types</Button>
        <Button variant="solid" size="md">Last 90 days</Button>
        <Button variant="solid" size="md">All funds</Button>
        <div style={{ flex: 1 }} />
        <Button variant="solid" size="md" icon="download">Export</Button>
      </div>

      <Card padding={0}>
        {ACTIVITY.map((a, i) => (
          <div key={a.id} className="row-hover" style={{
            display: "grid", gridTemplateColumns: "80px 32px 1fr 180px auto",
            alignItems: "center", gap: 14,
            padding: "16px 22px",
            borderBottom: i < ACTIVITY.length - 1 ? "1px solid var(--border)" : "none",
          }}>
            <span className="num" style={{ fontSize: 12, color: "var(--muted-2)" }}>{a.date}</span>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: a.sign > 0 ? "var(--pos-tint)" : a.sign < 0 ? "var(--neg-tint)" : "var(--chip)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              <Icon name={a.icon} size={14} color={a.sign > 0 ? "var(--pos)" : a.sign < 0 ? "var(--neg)" : "var(--muted)"} />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 500 }}>{a.kind} — {a.from}</div>
              <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>{a.meta}</div>
            </div>
            <div><Pill tone="outline">{a.from.split(" ")[0]}</Pill></div>
            <div style={{ textAlign: "right" }}>
              {a.amount !== 0 ? (
                <span className="num" style={{ fontSize: 14, fontWeight: 500, color: a.sign > 0 ? "var(--pos)" : "var(--fg)" }}>
                  {a.sign > 0 ? "+" : a.sign < 0 ? "−" : ""}${fmtMoney(Math.abs(a.amount))}
                </span>
              ) : <span style={{ fontSize: 12, color: "var(--muted-2)" }}>—</span>}
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}

function DocumentsPage() {
  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }} className="fade-up">
      <h1 style={{ margin: "0 0 24px", fontSize: 28, fontWeight: 500, letterSpacing: -0.6 }}>Documents</h1>
      <FundDocuments />
    </div>
  );
}

function ComingSoon({ title, icon = "sparkle" }) {
  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }} className="fade-up">
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 500, letterSpacing: -0.6 }}>{title}</h1>
      </div>
      <div style={{
        padding: "72px 20px",
        borderRadius: 16,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        textAlign: "center",
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: "0 auto 18px",
          background: "var(--accent-tint)",
          color: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "inset 0 0 0 1px var(--accent-ring-25)",
        }}>
          <Icon name={icon} size={22} />
        </div>
        <div style={{ fontSize: 16, fontWeight: 500, color: "var(--fg)", marginBottom: 6, letterSpacing: -0.2 }}>{title}</div>
        <div style={{ fontSize: 13, color: "var(--muted)", maxWidth: 380, margin: "0 auto" }}>This section is a prototype placeholder. In the live product, you would see detailed {title.toLowerCase()} here.</div>
      </div>
    </div>
  );
}

// ────────────── Ask window ──────────────
function AskModal({ onClose, initialQuery = "" }) {
  const [q, setQ] = useStateApp(initialQuery);
  const [maximized, setMaximized] = useStateApp(false);
  const [minimized, setMinimized] = useStateApp(false);
  const [files, setFiles] = useStateApp([]);
  const [messages, setMessages] = useStateApp([]);
  const fileInputRef = React.useRef(null);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (initialQuery) setQ(initialQuery);
  }, [initialQuery]);

  React.useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, files]);

  const chips = [
    { icon: "chart", text: "Get key insights" },
    { icon: "pie", text: "Top portfolio companies" },
    { icon: "users", text: "Top LPs" },
    { icon: "transfer", text: "Update Partner" },
    { icon: "capitalCall", text: "Capital activity" },
    { icon: "receipt", text: "Tax summary" },
  ];

  const send = () => {
    if (!q.trim() && files.length === 0) return;
    const userMsg = { role: "user", text: q, files: files.slice() };
    const reply = {
      role: "assistant",
      text: "I'm reviewing your portfolio data — give me a moment to pull this together. (Demo response: in production, Zive would synthesize an answer here citing source documents.)",
    };
    setMessages(m => [...m, userMsg, reply]);
    setQ("");
    setFiles([]);
  };

  const onPickFiles = e => {
    const list = Array.from(e.target.files || []);
    if (list.length) setFiles(f => [...f, ...list]);
    e.target.value = "";
  };

  const removeFile = i => setFiles(f => f.filter((_, idx) => idx !== i));

  const fmtSize = b => b < 1024 ? b + " B" : b < 1024 * 1024 ? (b / 1024).toFixed(0) + " KB" : (b / (1024 * 1024)).toFixed(1) + " MB";

  if (minimized) {
    return (
      <div style={{
        position: "fixed", bottom: 16, right: 16, zIndex: 50,
        display: "flex", alignItems: "center", gap: 10,
        background: "var(--ask-header)", color: "var(--ask-fg)",
        padding: "10px 14px", borderRadius: 10,
        boxShadow: "var(--shadow-pop)",
        cursor: "pointer",
      }} onClick={() => setMinimized(false)}>
        <div style={{
          fontSize: 13, fontWeight: 500,
          marginRight: 2,
        }}>Ask</div>
        <ZiveWordmark height={12} color="var(--ask-fg)" />
        <Icon name="chevronR" size={12} color="var(--ask-fg)" style={{ transform: "rotate(-90deg)" }} />
      </div>
    );
  }

  const winW = maximized ? "min(96vw, 1280px)" : 540;
  const winH = maximized ? "92vh" : "min(720px, 88vh)";

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 50,
      background: "var(--ask-overlay)", backdropFilter: "blur(3px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        width: winW, height: winH, maxWidth: "100%",
        background: "var(--ask-window)", borderRadius: 12,
        boxShadow: "var(--shadow-pop)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        transition: "width 200ms ease, height 200ms ease",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 14px",
          background: "var(--ask-header)", color: "var(--ask-fg)",
          borderBottom: "1px solid var(--ask-surface-border)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: -0.1 }}>Ask</span>
            <ZiveWordmark height={14} color="var(--ask-fg)" />
          </div>
          <div style={{ flex: 1 }} />
          <button onClick={() => setMaximized(v => !v)} title={maximized ? "Restore" : "Maximize"} style={hdrBtn}>
            <Icon name={maximized ? "minimize" : "expand"} size={14} color="var(--ask-fg)" />
          </button>
          <button onClick={() => setMinimized(true)} title="Minimize" style={hdrBtn}>
            <Icon name="minimize" size={14} color="var(--ask-fg)" />
          </button>
          <button title="Menu" style={hdrBtn}>
            <Icon name="menu" size={14} color="var(--ask-fg)" />
          </button>
          <button onClick={onClose} title="Close" style={{
            ...hdrBtn,
            background: "var(--ask-hdr-btn-close)",
            borderRadius: 999, width: 28, height: 28,
          }}>
            <Icon name="close" size={14} color="var(--ask-fg)" />
          </button>
        </div>

        {/* Body */}
        <div ref={scrollRef} style={{
          flex: 1, overflow: "auto",
          padding: messages.length ? "20px 24px" : 24,
          background: "var(--ask-window)",
          display: "flex", flexDirection: "column", gap: 14,
        }}>
          {messages.length === 0 ? (
            <div style={{
              flex: 1, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              color: "var(--ask-fg-muted)", fontSize: 12.5, textAlign: "center",
              padding: "40px 20px",
            }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                marginBottom: 16,
                boxShadow: "0 8px 24px rgba(97,95,255,0.30)",
              }}>
                <ZMark size={56} radius={14} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ask-fg)", marginBottom: 4 }}>How can I help you today?</div>
              <div style={{ fontSize: 12.5, color: "var(--ask-fg-muted)", maxWidth: 320 }}>
                Ask about your funds, drop in a document, or pick a quick action below.
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
              }}>
                {m.files && m.files.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 6, justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                    {m.files.map((f, j) => (
                      <div key={j} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "5px 9px", borderRadius: 8,
                        background: "var(--ask-surface)",
                        boxShadow: "0 0 0 1px var(--ask-surface-border)",
                        fontSize: 11.5, color: "var(--ask-fg)",
                      }}>
                        <Icon name="file" size={11} color="var(--ask-accent-icon)" />
                        <span>{f.name}</span>
                        <span style={{ color: "var(--ask-fg-muted)" }}>· {fmtSize(f.size)}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{
                  padding: "10px 14px", borderRadius: 12,
                  background: m.role === "user" ? "var(--ask-accent)" : "var(--ask-surface)",
                  color: m.role === "user" ? "#fff" : "var(--ask-fg)",
                  boxShadow: m.role === "user" ? "none" : "0 0 0 1px var(--ask-surface-border)",
                  fontSize: 13, lineHeight: 1.5,
                }}>{m.text}</div>
              </div>
            ))
          )}
        </div>

        {/* File chips (pending) */}
        {files.length > 0 && (
          <div style={{ padding: "10px 16px 0", display: "flex", flexWrap: "wrap", gap: 6 }}>
            {files.map((f, i) => (
              <div key={i} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "6px 8px 6px 10px", borderRadius: 8,
                background: "var(--ask-surface)", boxShadow: "0 0 0 1px var(--ask-surface-border)",
                fontSize: 11.5, color: "var(--ask-fg)",
              }}>
                <Icon name="file" size={11} color="var(--ask-accent-icon)" />
                <span style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                <span style={{ color: "var(--ask-fg-muted)" }}>· {fmtSize(f.size)}</span>
                <button onClick={() => removeFile(i)} style={{
                  border: "none", background: "transparent", cursor: "pointer",
                  padding: 0, marginLeft: 2, display: "inline-flex",
                }}>
                  <Icon name="close" size={11} color="var(--ask-fg-muted)" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Suggestion chips */}
        <div style={{
          display: "flex", gap: 8, overflowX: "auto",
          padding: "12px 16px 8px",
          scrollbarWidth: "none",
        }}>
          {chips.map((c, i) => (
            <button key={i} onClick={() => setQ(c.text)} style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              padding: "8px 14px", borderRadius: 999,
              background: "var(--ask-surface)", boxShadow: "0 0 0 1px var(--ask-surface-border)",
              fontSize: 12.5, color: "var(--ask-fg)", fontWeight: 500,
              cursor: "pointer", flexShrink: 0, fontFamily: "inherit",
              transition: "background 120ms ease, box-shadow 120ms ease",
            }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--ask-surface-hover)"; e.currentTarget.style.boxShadow = "0 0 0 1px var(--ask-surface-border-hover)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "var(--ask-surface)"; e.currentTarget.style.boxShadow = "0 0 0 1px var(--ask-surface-border)"; }}
            >
              <Icon name={c.icon} size={13} color="var(--ask-icon-muted)" />
              <span>{c.text}</span>
            </button>
          ))}
        </div>

        {/* Composer */}
        <div style={{ padding: "8px 16px 14px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--ask-surface)", borderRadius: 999,
            padding: "6px 6px 6px 18px",
            boxShadow: "inset 0 0 0 1px var(--ask-surface-border)",
            transition: "box-shadow 160ms ease",
          }}>
            <textarea
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Type your message..."
              rows={1}
              style={{
                flex: 1, border: "none", background: "transparent",
                outline: "none", fontSize: 13.5, color: "var(--ask-fg)",
                fontFamily: "inherit", resize: "none", lineHeight: 1.4,
                padding: "8px 0", maxHeight: 100,
              }}
            />
            <input ref={fileInputRef} type="file" multiple onChange={onPickFiles} style={{ display: "none" }} />
            <button onClick={() => fileInputRef.current?.click()} title="Attach files" style={{
              width: 32, height: 32, borderRadius: 999,
              border: "none", background: "transparent", cursor: "pointer",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--ask-surface-hover)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              <Icon name="paperclip" size={15} color="var(--ask-icon-muted)" />
            </button>
            <button onClick={send} title="Send" style={{
              width: 32, height: 32, borderRadius: 999,
              border: "none", cursor: "pointer",
              background: q.trim() || files.length ? "var(--ask-accent)" : "var(--ask-send-disabled)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              transition: "background 120ms ease",
            }}>
              <Icon name="send" size={13} color="#fff" />
            </button>
          </div>
          <div style={{
            textAlign: "center", marginTop: 8,
            fontSize: 11, color: "var(--ask-helper)",
          }}>
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  );
}

const hdrBtn = {
  width: 28, height: 28, borderRadius: 6,
  border: "none", background: "transparent", cursor: "pointer",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  color: "#fff", fontFamily: "inherit",
};

Object.assign(window, { App });

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
