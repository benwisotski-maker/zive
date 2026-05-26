// Zive — VCFO and LP-User shells for the entity-specific dashboards
const { useState: useStateV, useEffect: useEffectV } = React;

// ════════════════════════════════════════════════════════════════════════
// Shared chrome
// ════════════════════════════════════════════════════════════════════════
const ShellSidebar = ({ items, activeId, onPick, footer }) => (
  <aside style={{
    width: 232, flexShrink: 0,
    background: "var(--bg)",
    borderRight: "1px solid var(--border)",
    display: "flex", flexDirection: "column",
    padding: "14px 10px",
    position: "sticky", top: 0, height: "100vh", overflow: "hidden",
  }}>
    {/* Brand row */}
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px 14px" }}>
      <Icon name="panelLeft" size={15} color="var(--muted-2)" />
      <ZMark size={20} radius={4} />
      <IveWordmark height={12} color="var(--fg)" />
    </div>

    <div style={{ flex: 1, overflow: "auto", marginRight: -6, paddingRight: 6 }}>
      {items.map((sec, idx) => (
        <SidebarSection key={idx} label={sec.label}>
          {sec.items.map(it => (
            <NavItem
              key={it.id}
              icon={it.icon}
              label={it.label}
              hint={it.hint}
              hintTone={it.hintTone}
              active={activeId === it.id}
              onClick={() => onPick(it.id)}
            />
          ))}
        </SidebarSection>
      ))}
    </div>

    {footer}
  </aside>
);

// ════════════════════════════════════════════════════════════════════════
// VCFO Shell — for `admin` entity (Admin Ventures, ADMIN role)
// ════════════════════════════════════════════════════════════════════════
const VCFO_NAV = [
  { items: [
    { id: "dashboards", label: "Dashboards", icon: "dashboard" },
    { id: "documents", label: "Documents", icon: "folder" },
    { id: "api", label: "API", icon: "anchor" },
  ]},
  { label: "Modules", items: [
    { id: "investments", label: "Investments", icon: "trendUp" },
    { id: "funds", label: "Funds", icon: "pie" },
    { id: "accounting", label: "Accounting", icon: "accounting" },
    { id: "reporting", label: "Reporting", icon: "report" },
    { id: "lp-portal", label: "LP Portal", icon: "investor" },
    { id: "uda", label: "Unstructured Data\nAnalyzer", icon: "bookmark" },
    { id: "financing-docs", label: "Financing Documents", icon: "vault" },
  ]},
  { label: "AI", items: [
    { id: "agents", label: "Agents", icon: "settings" },
    { id: "doc-studio", label: "Document Studio", icon: "docStudio", hint: "BETA", hintTone: "beta" },
    { id: "mcp", label: "MCP", icon: "mcp" },
  ]},
  { label: "Administration", items: [
    { id: "users", label: "Users", icon: "users" },
  ]},
];

function VCFOShell({ onAskAI, entity, onChangeEntity }) {
  const [active, setActive] = useStateV(() => {
    try { return localStorage.getItem("zive.vcfo.page") || "dashboards"; } catch { return "dashboards"; }
  });
  useEffectV(() => { try { localStorage.setItem("zive.vcfo.page", active); } catch {} }, [active]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <ShellSidebar items={VCFO_NAV} activeId={active} onPick={setActive} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBar onAskAI={onAskAI} entity={entity} onChangeEntity={onChangeEntity} />
        <main style={{ flex: 1, overflow: "auto" }}>
          {active === "dashboards" && <VCFODashboards />}
          {active === "documents" && <VCFODocuments />}
          {active === "api" && <VCFOApi />}
          {active === "investments" && <VCFOInvestments />}
          {active === "funds" && <VCFOFunds />}
          {active === "accounting" && <VCFOAccounting />}
          {active === "reporting" && <VCFOReporting />}
          {active === "lp-portal" && <VCFOLPPortal />}
          {active === "uda" && <VCFOUDA />}
          {active === "financing-docs" && <VCFOFinancingDocs />}
          {active === "agents" && <VCFOAgents />}
          {active === "doc-studio" && <VCFODocStudio />}
          {active === "mcp" && <VCFOMCP />}
          {active === "users" && <VCFOUsers />}
        </main>
      </div>
    </div>
  );
}

// ────────────── Tab strip used across many VCFO pages ──────────────
const PageTabs = ({ tabs, value, onChange }) => (
  <div style={{
    borderBottom: "1px solid var(--border)",
  }}>
    <div style={{
      display: "flex", gap: 24,
      padding: "0 40px",
      maxWidth: 1360,
      margin: "0 auto",
    }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        padding: "16px 0",
        background: "transparent", border: "none",
        borderBottom: "2px solid",
        borderBottomColor: value === t.id ? "var(--accent)" : "transparent",
        color: value === t.id ? "var(--accent)" : "var(--muted)",
        fontSize: 13, fontWeight: 500,
        cursor: "pointer", fontFamily: "inherit",
        marginBottom: -1,
        transition: "color 120ms ease, border-color 120ms ease",
      }}
        onMouseEnter={e => { if (value !== t.id) e.currentTarget.style.color = "var(--fg-2)"; }}
        onMouseLeave={e => { if (value !== t.id) e.currentTarget.style.color = "var(--muted)"; }}
      >{t.label}</button>
    ))}
    </div>
  </div>
);

const PageHeaderArea = ({ children }) => (
  <div style={{ padding: "20px 40px 0", maxWidth: 1360, margin: "0 auto" }}>{children}</div>
);

// ────────────── 1. Dashboards (with 4 tabs) ──────────────
const BUILT_IN_DASHBOARDS = [
  { id: "overview", name: "Overview", builtin: true },
  { id: "bens", name: "Investments", builtin: true, hasWidgets: true },
];

function VCFODashboards() {
  const [tab, setTab] = useStateV(() => {
    try { return localStorage.getItem("zive.vcfo.dashTab") || "performance"; } catch { return "performance"; }
  });
  useEffectV(() => { try { localStorage.setItem("zive.vcfo.dashTab", tab); } catch {} }, [tab]);

  const [dashboards, setDashboards] = useStateV(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("zive.vcfo.dashboards") || "null");
      if (saved && Array.isArray(saved) && saved.length) {
        // Migrate: ensure built-in dashboards are present, and force-refresh
        // their canonical name/flags so renames in code take effect.
        const merged = saved.slice();
        BUILT_IN_DASHBOARDS.forEach(d => {
          const idx = merged.findIndex(x => x.id === d.id);
          if (idx === -1) merged.unshift({ ...d });
          else merged[idx] = { ...merged[idx], name: d.name, builtin: true, hasWidgets: d.hasWidgets };
        });
        return merged;
      }
    } catch {}
    return BUILT_IN_DASHBOARDS.slice();
  });
  const [currentDash, setCurrentDash] = useStateV(() => {
    try { return localStorage.getItem("zive.vcfo.currentDash") || "overview"; } catch { return "overview"; }
  });
  useEffectV(() => { try { localStorage.setItem("zive.vcfo.dashboards", JSON.stringify(dashboards)); } catch {} }, [dashboards]);
  useEffectV(() => { try { localStorage.setItem("zive.vcfo.currentDash", currentDash); } catch {} }, [currentDash]);

  const [showCreate, setShowCreate] = useStateV(false);
  const [showAddWidget, setShowAddWidget] = useStateV(false);

  const createDashboard = (name) => {
    const id = "d-" + Date.now().toString(36);
    const next = [...dashboards, { id, name, builtin: false, hasWidgets: true }];
    setDashboards(next);
    setCurrentDash(id);
    setShowCreate(false);
  };

  const deleteDashboard = (id) => {
    if (dashboards.find(d => d.id === id)?.builtin) return;
    const next = dashboards.filter(d => d.id !== id);
    setDashboards(next);
    if (currentDash === id) setCurrentDash(next[0]?.id || "overview");
  };

  const current = dashboards.find(d => d.id === currentDash);
  const dashCtx = {
    dashboards, currentDash, setCurrentDash,
    openCreate: () => setShowCreate(true),
    openAddWidget: () => setShowAddWidget(true),
    deleteDashboard,
    current,
    hasWidgets: !!current?.hasWidgets,
  };

  const tabs = [
    { id: "performance", label: "Performance" },
    { id: "funds", label: "Funds" },
    { id: "investments", label: "Investments" },
    { id: "cash", label: "Cash Management" },
  ];
  return (
    <>
      <div className="fade-up">
        <SwitchTabs tabs={tabs} value={tab} onChange={setTab} />
        {tab === "performance" && <DashPerformance dashCtx={dashCtx} />}
        {tab === "funds" && <DashFunds dashCtx={dashCtx} />}
        {tab === "investments" && <DashInvestments dashCtx={dashCtx} />}
        {tab === "cash" && <DashCash />}
      </div>
      {/* Modals MUST live outside the .fade-up wrapper so their position:fixed
          is relative to the viewport, not a transformed ancestor. */}
      {showCreate && <CreateDashboardModal onCancel={() => setShowCreate(false)} onCreate={createDashboard} />}
      {showAddWidget && <AddWidgetModal onClose={() => setShowAddWidget(false)} />}
    </>
  );
}

// ────────────── Segmented switch-style horizontal tabs ──────────────
function SwitchTabs({ tabs, value, onChange }) {
  return (
    <div style={{ padding: "20px 40px 0", maxWidth: 1360, margin: "0 auto" }}>
      <div style={{
        display: "inline-flex", gap: 2,
        background: "var(--surface)", padding: 3, borderRadius: 10,
        boxShadow: "inset 0 0 0 1px var(--border)",
      }}>
        {tabs.map(t => {
          const active = value === t.id;
          return (
            <button key={t.id} onClick={() => onChange(t.id)} style={{
              padding: "8px 16px", borderRadius: 7,
              background: active ? "var(--surface-3)" : "transparent",
              border: "none",
              color: active ? "var(--fg)" : "var(--muted)",
              fontSize: 12.5, fontWeight: 500,
              boxShadow: active ? "inset 0 0 0 1px var(--border-strong)" : "none",
              cursor: "pointer", fontFamily: "inherit",
              transition: "all 120ms ease",
            }}
              onMouseEnter={e => { if (!active) e.currentTarget.style.color = "var(--fg-2)"; }}
              onMouseLeave={e => { if (!active) e.currentTarget.style.color = "var(--muted)"; }}
            >{t.label}</button>
          );
        })}
      </div>
    </div>
  );
}

// ────────────── Dashboard selector + create button ──────────────
function DashboardBar({ dashCtx }) {
  const { hasWidgets } = dashCtx;
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <DashboardSelect {...dashCtx} />
        {hasWidgets && (
          <button title="More" style={dashIconBtn}>
            <Icon name="more" size={13} color="var(--muted-2)" />
          </button>
        )}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <button style={btnGhost} onClick={dashCtx.openCreate}>
          <Icon name="plus" size={12} />
          Dashboard
        </button>
        {hasWidgets && (
          <button style={btnGhost} title="Sync all widgets">
            <RefreshIcon size={12} />
            Sync All Widgets
          </button>
        )}
      </div>
    </div>
  );
}

const dashIconBtn = {
  width: 34, height: 36, padding: 0,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  cursor: "pointer", fontFamily: "inherit",
};

// Inline refresh icon (not in the icon set)
const RefreshIcon = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
    <path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4" />
    <path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" />
  </svg>
);
const BulbIcon = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
    <path d="M9 18h6" />
    <path d="M10 22h4" />
    <path d="M2 9a7 7 0 0 1 14 0c0 2.5-2 4-3 5-1 1-1 2-1 4h-6c0-2 0-3-1-4-1-1-3-2.5-3-5z" transform="translate(3 0)" />
  </svg>
);

function DashboardSelect({ dashboards, currentDash, setCurrentDash, deleteDashboard }) {
  const [open, setOpen] = useStateV(false);
  const ref = React.useRef(null);
  React.useEffect(() => {
    const close = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const current = dashboards.find(d => d.id === currentDash) || dashboards[0];
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 12, width: 220, height: 36, padding: "0 12px",
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 8,
        fontSize: 13, color: "var(--fg-2)",
        cursor: "pointer", fontFamily: "inherit",
      }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{current?.name || "Overview"}</span>
        <Icon name="chevronD" size={11} color="var(--muted-2)" />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          width: 220,
          background: "var(--elevated)",
          border: "1px solid var(--border-strong)",
          borderRadius: 8,
          boxShadow: "var(--shadow-pop-soft)",
          padding: 4, zIndex: 20,
        }}>
          {dashboards.map(d => {
            const active = currentDash === d.id;
            return (
              <div key={d.id} className="row-hover" style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 10px", borderRadius: 6,
                background: active ? "var(--surface-2)" : "transparent",
                cursor: "pointer",
              }}
                onClick={() => { setCurrentDash(d.id); setOpen(false); }}
              >
                <span style={{ flex: 1, fontSize: 12.5, color: "var(--fg-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{d.name}</span>
                {active && <Icon name="check" size={11} color="var(--accent)" />}
                {!d.builtin && (
                  <button onClick={(e) => { e.stopPropagation(); deleteDashboard(d.id); }} title="Delete"
                    style={{ background: "transparent", border: "none", padding: 2, cursor: "pointer", color: "var(--muted-3)", display: "inline-flex" }}
                    onMouseEnter={e => e.currentTarget.style.color = "var(--neg)"}
                    onMouseLeave={e => e.currentTarget.style.color = "var(--muted-3)"}
                  >
                    <Icon name="close" size={11} />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ────────────── Create dashboard modal ──────────────
function CreateDashboardModal({ onCancel, onCreate }) {
  const [name, setName] = useStateV("");
  const submit = () => { if (name.trim()) onCreate(name.trim()); };
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 60,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} className="fade-up" style={{
        width: 420,
        background: "var(--elevated)",
        border: "1px solid var(--border-strong)",
        borderRadius: 12,
        padding: 22,
        boxShadow: "var(--shadow-modal)",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>Create New Dashboard</div>
          <button onClick={onCancel} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4, display: "inline-flex" }}>
            <Icon name="close" size={14} />
          </button>
        </div>
        <div>
          <div style={{ fontSize: 11, color: "var(--accent)", marginBottom: 6, fontWeight: 500 }}>Dashboard Name</div>
          <input autoFocus value={name} onChange={e => setName(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") onCancel(); }}
            placeholder="e.g. Sean's Dashboard"
            style={{ ...apiInputStyle, height: 40 }} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 22 }}>
          <button onClick={onCancel} style={btnGhost}>Cancel</button>
          <button onClick={submit}
            style={{ ...btnPrimary, opacity: name.trim() ? 1 : 0.45, cursor: name.trim() ? "pointer" : "not-allowed" }}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

const FUNDS_LIST = [
  { id: "av5", name: "Admin Ventures V", vintage: 2023, invested: 5526232, realized: 0, fair: 5526232, total: 5526232, moic: 1.0, investments: 9, deals: 7 },
  { id: "av4", name: "Admin Ventures IV", vintage: 2023, invested: 9210387, realized: 0, fair: 9210387, total: 9210387, moic: 1.0, investments: 7, deals: 7 },
  { id: "av1", name: "Admin Ventures I", vintage: 2020, invested: 5342336, realized: 1250000, fair: 7058586, total: 8308586, moic: 1.56, investments: 14, deals: 14 },
  { id: "av3", name: "Admin Ventures III", vintage: 2022, invested: 14066350, realized: 5127033, fair: 11808306, total: 16935338, moic: 1.20, investments: 15, deals: 15 },
];

function DashPerformance({ dashCtx }) {
  const [fund, setFund] = useStateV("av5");
  const hasWidgets = dashCtx?.hasWidgets;
  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
      <DashboardBar dashCtx={dashCtx} />

      <div style={{ marginBottom: hasWidgets ? 14 : 18 }}>
        <div style={lblStyle}>FUND NAME</div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <SoftSelect width={260} value="Admin Ventures V" options={FUNDS_LIST.map(f => f.name)} />
          {hasWidgets && (
            <div style={{ display: "flex", gap: 8 }}>
              <button style={btnGhost} title="Sync all"><RefreshIcon size={12} /> Sync All</button>
              <button style={{ ...btnPrimary, padding: "8px 16px" }} onClick={dashCtx.openAddWidget}>
                <Icon name="plus" size={11} color="#fff" /> Add Widget
              </button>
            </div>
          )}
        </div>
      </div>

      {hasWidgets ? (
        <BensDashboardBody />
      ) : (
        <Card padded style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: -0.3 }}>2023 Vintage</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>9 investments · 7 deals</div>
            </div>
            <div style={{
              border: "1px dashed var(--accent)",
              borderRadius: 10, padding: "10px 16px",
              display: "flex", flexDirection: "column", alignItems: "flex-end",
              background: "var(--accent-tint-2)",
            }}>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>Gross MOIC: <span style={{ color: "var(--fg)", fontWeight: 600 }}>1.00x</span></div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>TVPI: <span style={{ color: "var(--fg)", fontWeight: 600 }}>1.00x</span></div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }}>
            {/* Bar chart */}
            <div>
              <div style={{ fontSize: 10, color: "var(--muted-2)", textAlign: "center", letterSpacing: 1, fontWeight: 500, marginBottom: 12 }}>FUND PROGRESS</div>
              <FundProgressChart />
            </div>

            {/* Side stats */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <MiniStat label="Commitments" value="$26.2M" />
                <MiniStat label="Distributions" value="—" />
                <MiniStat label="DPI" value="—" />
                <MiniStat label="Gross IRR" value="—" />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 10 }}>Gain Breakdown</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12 }}>
                  <KVRow k="Total Gain" v="—" />
                  <KVRow k="Realized" v="—" />
                  <KVRow k="Fair Value" v="$5.5M" highlight />
                </div>
                <div style={{ marginTop: 12, height: 4, borderRadius: 2, background: "var(--surface-2)", overflow: "hidden" }}>
                  <div style={{ width: "100%", height: "100%", background: "var(--accent)" }} />
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muted-2)", marginTop: 6 }}>
                  <span>0% Realized</span>
                  <span>100% Unrealized</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// ────────────── Ben's Dashboard body (Analytics Context + widget grid) ──────────────
function BensDashboardBody() {
  const widgetCompanies = [
    { name: "OctaThink Solutions", invested: 1773535, value: 1773535, moic: "1.0x", industry: "AI & ML", industryFull: "AI & Machine Learning" },
    { name: "Quantum Inc.", invested: 1740802, value: 1740802, moic: "1.0x", industry: "AI & ML", industryFull: "AI & Machine Learning" },
    { name: "7Labs AI", invested: 1276896, value: 1276896, moic: "1.0x", industry: "AI & ML", industryFull: "AI & Machine Learning" },
    { name: "MicroEdge Partners", invested: 510000, value: 510000, moic: "1.0x", industry: "Agtech", industryFull: "Agtech" },
    { name: "CloudB Capital", invested: 187500, value: 187500, moic: "1.0x", industry: "AI & ML", industryFull: "AI & Machine Learning" },
    { name: "NovaCore Systems", invested: 18750, value: 18750, moic: "1.0x", industry: "AI & ML", industryFull: "AI & Machine Learning" },
    { name: "InfraLoop, Inc.", invested: 18750, value: 18750, moic: "1.0x", industry: "Agtech", industryFull: "Agtech" },
  ];

  return (
    <>
      <AnalyticsContextBar />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>Custom Widgets</div>
        <div style={{
          fontSize: 11.5, color: "var(--muted-2)",
          padding: "3px 10px", borderRadius: 6,
          background: "var(--surface-2)",
          boxShadow: "inset 0 0 0 1px var(--border)",
        }}>2 widgets</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <WidgetTableCard title="Top 10 Portfolio Companies by MOIC" updated="Feb 12, 2026" companies={widgetCompanies} cols={["company","invested","value","moic","industry"]} indexed={false} />
        <WidgetTableCard title="Top 10 Portfolio Companies by MOIC" updated="Feb 19, 2026" companies={widgetCompanies} cols={["#","company","industryFull","invested","value","moic"]} indexed={true} />
      </div>
    </>
  );
}

function AnalyticsContextBar() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 14px",
      background: "var(--accent-tint-2)",
      border: "1px solid var(--accent-ring-25)",
      borderRadius: 10,
      marginBottom: 26,
      flexWrap: "wrap",
    }}>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        height: 24, padding: "0 9px",
        background: "var(--accent)", color: "#fff",
        borderRadius: 6,
        fontSize: 11.5, fontWeight: 600,
      }}>
        <Icon name="info" size={11} color="#fff" />
        Analytics Context:
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        height: 24, padding: "0 9px",
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        borderRadius: 6,
        fontSize: 11.5, color: "var(--fg-2)", fontWeight: 500,
      }}>
        <Icon name="dashboard" size={11} color="#42A5F5" />
        Admin Ventures V
        <span style={{ color: "var(--muted-2)", fontWeight: 400, fontSize: 10.5, letterSpacing: 0.4 }}>(FUND)</span>
      </div>
      <div style={{
        display: "inline-flex", alignItems: "center", gap: 6,
        height: 24, padding: "0 9px",
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        borderRadius: 6,
        fontSize: 11.5, color: "var(--fg-2)",
      }}>
        <Icon name="briefcase" size={11} color="#22C55E" />
        <span style={{ fontWeight: 600 }}>9 Companies:</span>
        <span style={{ color: "var(--muted)", marginLeft: 4 }}>7Labs AI, Quantum Inc., OctaThink Solutions +6 more</span>
      </div>
    </div>
  );
}

function WidgetTableCard({ title, updated, companies, cols, indexed }) {
  const headerLabels = {
    "#": "#",
    company: "Company",
    invested: "Invested",
    value: "Current Value",
    moic: "MOIC",
    industry: "Industry",
    industryFull: "Industry",
  };
  return (
    <Card padded style={{ padding: 0, overflow: "hidden" }}>
      {/* Card header */}
      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg)" }}>{title}</div>
            <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name="calendar" size={10} color="var(--muted-3)" />
              Updated {updated}
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <WidgetIconBtn icon="more" rotated />
            <WidgetIconBtn icon="expand" />
            <WidgetIconBtnSvg><RefreshIcon size={11} /></WidgetIconBtnSvg>
            <WidgetIconBtn icon="settings" />
            <WidgetIconBtn icon="close" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, padding: "10px 18px" }}>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          height: 26, padding: "0 10px",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 6, fontSize: 11.5, color: "var(--fg-2)", cursor: "pointer", fontFamily: "inherit",
        }}>
          <Icon name="sort" size={11} color="var(--muted)" />
          Columns
        </button>
        <button title="Filters" style={{
          width: 26, height: 26, padding: 0, display: "inline-flex", alignItems: "center", justifyContent: "center",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 6, cursor: "pointer", fontFamily: "inherit",
        }}>
          <Icon name="filter" size={11} color="var(--accent)" />
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "var(--accent-tint-2)" }}>
              {cols.map(k => (
                <th key={k} style={{
                  padding: "10px 14px", textAlign: k === "invested" || k === "value" || k === "moic" || k === "#" ? "left" : "left",
                  fontWeight: 600, fontSize: 11, color: "var(--fg-2)",
                  borderBottom: "1px solid var(--accent-ring-25)",
                  whiteSpace: "nowrap",
                }}>{headerLabels[k]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {companies.map((c, i) => (
              <tr key={i} style={{ background: "var(--accent-tint-2)", opacity: 0.96 }}>
                {cols.map(k => {
                  let val = c[k];
                  if (k === "#") val = i + 1;
                  if (k === "company") val = c.name;
                  if (k === "invested" || k === "value") val = "$" + c[k].toLocaleString();
                  return (
                    <td key={k} style={{
                      padding: "10px 14px",
                      borderBottom: i < companies.length - 1 ? "1px solid var(--accent-ring-14)" : "none",
                      fontSize: 12, color: "var(--fg-2)",
                      whiteSpace: "nowrap",
                    }}>{val}</td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const widgetIconBtnStyle = {
  width: 22, height: 22, padding: 0,
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  background: "transparent", border: "none",
  borderRadius: 4, cursor: "pointer", color: "var(--muted-2)",
};
function WidgetIconBtn({ icon, rotated }) {
  return (
    <button style={widgetIconBtnStyle}
      onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <Icon name={icon} size={11} color="var(--muted-2)" style={rotated ? { transform: "rotate(90deg)" } : null} />
    </button>
  );
}
function WidgetIconBtnSvg({ children }) {
  return (
    <button style={widgetIconBtnStyle}
      onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >{children}</button>
  );
}

// ────────────── Add Widget modal (Describe Your Widget) ──────────────
function AddWidgetModal({ onClose }) {
  const [desc, setDesc] = useStateV("");
  const examples = [
    "Create a bar chart showing revenue by quarter",
    "Show a table of top 10 portfolio companies by MOIC",
    "Display a pie chart of investment distribution by sector",
    "Create a metric card showing total invested capital",
    "Show a line chart of IRR trends over time",
  ];
  const tips = [
    "Be specific about the type of visualization (chart, table, metric card)",
    "Mention the exact data fields or metrics you want to display",
    "Specify any filters, sorting, or data grouping requirements",
    "Use clear, concise language for best AI interpretation",
  ];
  const submit = () => {
    if (!desc.trim()) return;
    // Demo: just close. In production this would call an LLM to generate a widget.
    onClose();
  };
  const onKey = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") submit();
    if (e.key === "Escape") onClose();
  };
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 60,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(2px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="fade-up" style={{
        width: "min(640px, 96vw)", maxHeight: "92vh",
        background: "var(--elevated)",
        border: "1px solid var(--border-strong)",
        borderRadius: 14,
        boxShadow: "var(--shadow-modal)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 22px", borderBottom: "1px solid var(--border)",
        }}>
          <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>Describe Your Widget</div>
          <button onClick={onClose} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4, display: "inline-flex" }}>
            <Icon name="close" size={14} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: 22 }}>
          {/* Prompt area */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Describe Your Widget</div>
            <div style={{ fontSize: 11, color: "var(--muted-2)" }}>Step 1 of 1</div>
          </div>
          <textarea
            autoFocus
            value={desc}
            onChange={e => setDesc(e.target.value)}
            onKeyDown={onKey}
            placeholder="Example: Create a bar chart showing quarterly revenue trends"
            style={{
              width: "100%", minHeight: 110, resize: "vertical",
              padding: "12px 14px",
              background: "var(--surface)",
              border: "1px solid var(--border-strong)",
              borderRadius: 10,
              color: "var(--fg)", fontSize: 13,
              fontFamily: "inherit", outline: "none",
              lineHeight: 1.5,
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, fontSize: 11, color: "var(--muted-2)" }}>
            <Icon name="command" size={10} color="var(--muted-2)" />
            Press
            <kbd style={{
              fontFamily: "inherit", fontSize: 10.5,
              padding: "1px 6px", borderRadius: 4,
              background: "var(--surface-2)",
              border: "1px solid var(--border-strong)",
              boxShadow: "0 1px 0 var(--border)",
              color: "var(--fg-2)",
            }}>Ctrl + Enter</kbd>
            to generate
          </div>

          {/* Example instructions */}
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)", marginTop: 22, marginBottom: 10 }}>Example Instructions</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {examples.map((ex, i) => (
              <button key={i} onClick={() => setDesc(ex)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "11px 14px",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                color: "var(--fg-2)", fontSize: 12.5,
                cursor: "pointer", fontFamily: "inherit", textAlign: "left",
                transition: "background 120ms ease, border-color 120ms ease",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <span style={{ fontSize: 13, lineHeight: 1, color: "#F59E0B" }}>💡</span>
                {ex}
              </button>
            ))}
          </div>

          {/* Pro Tips */}
          <div style={{
            marginTop: 22, padding: 16,
            background: "linear-gradient(135deg, var(--accent-tint) 0%, var(--accent-tint-2) 100%)",
            border: "1px solid var(--accent-ring-25)",
            borderRadius: 10,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{
                width: 22, height: 22, borderRadius: 6,
                background: "var(--accent)",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ fontSize: 12, lineHeight: 1 }}>💡</span>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>Pro Tips for Better Results</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {tips.map((t, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "var(--fg-2)" }}>
                  <Icon name="check" size={11} color="#22C55E" style={{ marginTop: 2, flexShrink: 0 }} />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "flex-end", gap: 8,
          padding: "14px 22px",
          borderTop: "1px solid var(--border)",
          background: "var(--surface)",
        }}>
          <button onClick={submit} style={{
            ...btnPrimary, padding: "9px 18px",
            opacity: desc.trim() ? 1 : 0.45,
            cursor: desc.trim() ? "pointer" : "not-allowed",
          }}>
            <Icon name="sparkle" size={12} color="#fff" />
            Create Widget
          </button>
        </div>
      </div>
    </div>
  );
}

function FundProgressChart() {
  const investedCo = [
    { name: "OctaThink ..", value: 1.8, color: "#42A5F5" },
    { name: "Quantum Inc.", value: 1.7, color: "#42A5F5" },
    { name: "7Labs AI", value: 1.3, color: "#42A5F5" },
    { name: "MicroEdge ..", value: 0.7, color: "#42A5F5" },
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr 1fr 220px", gap: 16, alignItems: "stretch", height: 360 }}>
      {/* Y axis */}
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", paddingRight: 6, fontSize: 10, color: "var(--muted-2)" }}>
        {[6,5,4,3,2,1,0].map(n => <div key={n}>{n}</div>)}
      </div>

      {/* Invested capital bar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--fg)", marginBottom: 6 }}>$5.5M</div>
        <div style={{ flex: 1, width: "76%", maxWidth: 180, background: "#FF6B35", borderRadius: "2px 2px 0 0", marginTop: "auto", position: "relative" }} />
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>Invested Capital</div>
      </div>

      {/* Fair Value + Distributions stacked bar */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "var(--fg)", marginBottom: 6 }}>$5.5M</div>
        <div style={{ flex: 1, width: "76%", maxWidth: 180, marginTop: "auto", display: "flex", flexDirection: "column", borderRadius: "2px 2px 0 0", overflow: "hidden" }}>
          {investedCo.map((c, i) => {
            const totalVal = investedCo.reduce((s, x) => s + x.value, 0);
            return (
              <div key={i} style={{
                flex: c.value, background: c.color,
                borderTop: i > 0 ? "1px solid rgba(255,255,255,0.15)" : "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, color: "#fff", fontWeight: 500,
              }}>{c.name}</div>
            );
          })}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>Fair Value + Distributions</div>
      </div>

      {/* Legend + companies */}
      <div style={{ paddingLeft: 8 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
          <LegendDot color="#42A5F5" label="Fair Value + Distributions" />
          <LegendDot color="#FF6B35" label="Invested Capital" />
          <LegendDot color="var(--muted-2)" label="Other Companies" />
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>7 Companies</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11 }}>
          {[
            ["7Labs AI", "$1.3M"],
            ["CloudB Capital", "$187.5K"],
            ["InfraLoop, Inc.", "$18.8K"],
            ["MicroEdge Partners", "$510.0K"],
            ["NovaCore Systems", "$18.8K"],
            ["OctaThink Solutions", "$1.8M"],
            ["Quantum Inc.", "$1.7M"],
          ].map(([n, v]) => (
            <div key={n} style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--fg-2)" }}>{n}</span>
              <span className="num" style={{ color: "var(--fg)" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const LegendDot = ({ color, label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, color: "var(--fg-2)" }}>
    <span style={{ width: 11, height: 11, borderRadius: 2, background: color }} />
    {label}
  </div>
);

const KVRow = ({ k, v, highlight }) => (
  <div style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px dashed var(--border)" }}>
    <span style={{ color: "var(--muted)" }}>{k}</span>
    <span className="num" style={{ color: highlight ? "var(--accent)" : "var(--fg)", fontWeight: highlight ? 600 : 500 }}>{v}</span>
  </div>
);

const MiniStat = ({ label, value }) => (
  <div style={{
    padding: "10px 12px",
    border: "1px solid var(--border)",
    borderRadius: 8,
    background: "var(--surface)",
  }}>
    <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.4, textTransform: "uppercase" }}>{label}</div>
    <div className="num" style={{ fontSize: 16, fontWeight: 600, color: "var(--fg)", marginTop: 4 }}>{value}</div>
  </div>
);

// ────────────── Funds tab ──────────────
function DashFunds({ dashCtx }) {
  const hasWidgets = dashCtx?.hasWidgets;
  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
      <DashboardBar dashCtx={dashCtx} />
      {hasWidgets ? (
        <>
          <div style={{ marginBottom: 14 }}>
            <div style={lblStyle}>FUND NAME</div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
              <SoftSelect width={260} value="Admin Ventures V" options={FUNDS_LIST.map(f => f.name)} />
              <div style={{ display: "flex", gap: 8 }}>
                <button style={btnGhost} title="Sync all"><RefreshIcon size={12} /> Sync All</button>
                <button style={{ ...btnPrimary, padding: "8px 16px" }} onClick={dashCtx.openAddWidget}>
                  <Icon name="plus" size={11} color="#fff" /> Add Widget
                </button>
              </div>
            </div>
          </div>
          <FundsInvestmentsWidgets />
        </>
      ) : (
        <Card padded style={{ padding: 0, overflow: "hidden" }}>
          <FundsTable funds={FUNDS_LIST} />
        </Card>
      )}
    </div>
  );
}

// Investments dashboard for the Funds tab — single Portfolio Companies widget
function FundsInvestmentsWidgets() {
  const widgetCompanies = [
    { name: "7Labs AI",            industryFull: "Artificial intelligence and machine learning", country: "Canada",         invested: 1276895.56, value: 1276895.56, ownership: "4.00%" },
    { name: "Quantum Inc.",        industryFull: "Artificial intelligence and machine learning", country: "Canada",         invested: 1740802.09, value: 1740802.09, ownership: "4.00%" },
    { name: "OctaThink Solutions", industryFull: "Artificial intelligence and machine learning", country: "United Kingdom", invested: 1773534.76, value: 1773534.76, ownership: "4.00%" },
    { name: "CloudB Capital",      industryFull: "Artificial intelligence and machine learning", country: "United Kingdom", invested: 187499.81,  value: 187499.81,  ownership: "4.00%" },
    { name: "MicroEdge Partners",  industryFull: "Agtech",                                       country: "Canada",         invested: 510000.01,  value: 510000.01,  ownership: "4.00%" },
    { name: "NovaCore Systems",    industryFull: "Artificial intelligence and machine learning", country: "United Kingdom", invested: 18750.00,   value: 18750.00,   ownership: "4.00%" },
    { name: "InfraLoop, Inc.",     industryFull: "Agtech",                                       country: "United States",  invested: 18750.00,   value: 18750.00,   ownership: "4.00%" },
  ];
  return (
    <>
      <AnalyticsContextBar />
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>Custom Widgets</div>
        <div style={{
          fontSize: 11.5, color: "var(--muted-2)",
          padding: "3px 10px", borderRadius: 6,
          background: "var(--surface-2)",
          boxShadow: "inset 0 0 0 1px var(--border)",
        }}>1 widget</div>
      </div>
      <PortfolioCompaniesWidget companies={widgetCompanies} />
    </>
  );
}

function PortfolioCompaniesWidget({ companies }) {
  const fmt = (n) => "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <Card padded style={{ padding: 0, overflow: "hidden" }}>
      <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg)" }}>Portfolio Companies</div>
            <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 4, display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name="calendar" size={10} color="var(--muted-3)" />
              Updated Feb 7, 2026
            </div>
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            <WidgetIconBtn icon="more" rotated />
            <WidgetIconBtn icon="expand" />
            <WidgetIconBtnSvg><RefreshIcon size={11} /></WidgetIconBtnSvg>
            <WidgetIconBtn icon="settings" />
            <WidgetIconBtn icon="close" />
          </div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, padding: "10px 18px" }}>
        <button style={{
          display: "inline-flex", alignItems: "center", gap: 5,
          height: 26, padding: "0 10px",
          background: "var(--surface)",
          border: "1px solid var(--border-strong)",
          borderRadius: 6, fontSize: 11.5, color: "var(--fg-2)", cursor: "pointer",
        }}>
          <Icon name="sort" size={11} color="var(--muted)" /> Columns
        </button>
        <button style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: 28, height: 26,
          background: "var(--accent-tint-2)",
          border: "1px solid var(--accent-ring-25)",
          borderRadius: 6, cursor: "pointer",
        }} title="Filter">
          <Icon name="filter" size={11} color="var(--accent)" />
        </button>
      </div>
      <div style={{ overflowX: "auto", padding: "0 18px 18px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "var(--accent-tint-2)", color: "var(--muted)" }}>
              <th style={widgetTh}>Company</th>
              <th style={widgetTh}>Industry</th>
              <th style={widgetTh}>Country</th>
              <th style={{ ...widgetTh, textAlign: "left" }}>Invested</th>
              <th style={{ ...widgetTh, textAlign: "left" }}>Current Value</th>
              <th style={{ ...widgetTh, textAlign: "left" }}>Ownership</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c, i) => (
              <tr key={c.name} style={{ background: i % 2 === 0 ? "var(--accent-tint-3, rgba(66,165,245,0.06))" : "transparent", borderTop: "1px solid var(--border)" }}>
                <td style={widgetTd}>{c.name}</td>
                <td style={widgetTd}>{c.industryFull}</td>
                <td style={widgetTd}>{c.country}</td>
                <td className="num" style={widgetTd}>{fmt(c.invested)}</td>
                <td className="num" style={widgetTd}>{fmt(c.value)}</td>
                <td className="num" style={widgetTd}>{c.ownership}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

const widgetTh = { padding: "9px 12px", textAlign: "left", fontWeight: 500, fontSize: 11, color: "var(--muted)", letterSpacing: 0.2 };
const widgetTd = { padding: "10px 12px", color: "var(--fg-2)" };

function FundsTable({ funds }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr style={{ background: "var(--surface)", color: "var(--muted)" }}>
            <Th>Fund Name</Th><Th>Vintage Year</Th><Th right>Invested Capital</Th>
            <Th right>Realized Proceeds</Th><Th right>Fair Value</Th><Th right>Total Value</Th>
            <Th right>Gross MOIC</Th><Th right>Investments</Th><Th right>Deals</Th><Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {funds.map((f, i) => (
            <tr key={f.id} style={{ borderTop: "1px solid var(--border)" }}>
              <Td><a href="#" style={{ color: "var(--accent)", fontWeight: 500 }}>{f.name}</a></Td>
              <Td>{f.vintage}</Td>
              <Td right linkish>${f.invested.toLocaleString()}</Td>
              <Td right linkish>{f.realized ? "$" + f.realized.toLocaleString() : "—"}</Td>
              <Td right linkish>${f.fair.toLocaleString()}</Td>
              <Td right linkish>${f.total.toLocaleString()}</Td>
              <Td right linkish>{f.moic.toFixed(2)}x</Td>
              <Td right>{f.investments}</Td>
              <Td right linkish>{f.deals}</Td>
              <Td><Icon name="more" size={14} color="var(--muted)" /></Td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 18px", color: "var(--muted-2)", fontSize: 11.5, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="chevronL" size={11} /> Page <span style={{ padding: "2px 8px", border: "1px solid var(--border)", borderRadius: 4, color: "var(--fg-2)" }}>1</span> of 1 <Icon name="chevronR" size={11} />
        </div>
        <div>1 - {funds.length} of {funds.length} · Rows 100</div>
      </div>
    </div>
  );
}

const Th = ({ children, right }) => (
  <th style={{ padding: "10px 14px", textAlign: right ? "right" : "left", fontWeight: 500, fontSize: 11.5, letterSpacing: 0.2 }}>{children}</th>
);
const Td = ({ children, right, linkish }) => (
  <td className="num" style={{
    padding: "12px 14px", textAlign: right ? "right" : "left",
    color: linkish ? "var(--accent)" : "var(--fg-2)",
    textDecoration: linkish ? "underline dotted var(--border-strong)" : "none",
    textUnderlineOffset: 3,
  }}>{children}</td>
);

// ────────────── Investments tab ──────────────
const COMPANIES = [
  { name: "7Labs AI", fund: "Admin Ventures V", country: "Canada", sector: "Artificial intelligence and machine learning", invested: 1276896, realized: 0, fair: 1276896 },
  { name: "Alpha Tech, Inc.", fund: "Admin Ventures III (and 1 more)", country: "—", sector: "—", invested: 106380, realized: 0, fair: 106380 },
  { name: "ATLAS Space Operations, Inc.", fund: "Admin Ventures III", country: "—", sector: "—", invested: 1127151, realized: 0, fair: 1408937 },
  { name: "Attivare Therapeutics, Inc.", fund: "Admin Ventures III (and 1 more)", country: "—", sector: "—", invested: 500000, realized: 125000, fair: 500000 },
  { name: "Aurora Ridge Asset", fund: "Admin Ventures I", country: "—", sector: "—", invested: 0, realized: 0, fair: 0 },
  { name: "Bioz, Inc.", fund: "Admin Ventures III", country: "—", sector: "—", invested: 0, realized: 4796871, fair: 0 },
  { name: "Bit Bio Limited", fund: "Admin Ventures III", country: "—", sector: "—", invested: 1000000, realized: 0, fair: 1000000 },
  { name: "Block Party Studio Company", fund: "Admin Ventures I", country: "United States", sector: "—", invested: 500000, realized: 0, fair: 500000 },
  { name: "Boddle Learning, Inc.", fund: "Admin Ventures I", country: "United States", sector: "—", invested: 1400000, realized: 0, fair: 1400000 },
  { name: "Browse AI Inc.", fund: "Admin Ventures I", country: "United States", sector: "—", invested: 500000, realized: 0, fair: 500000 },
  { name: "BUNKER TECHNOLOGIES PTE. LTD.", fund: "Admin Ventures I", country: "United States", sector: "—", invested: 500000, realized: 0, fair: 500000 },
  { name: "Caresyntax Corporation", fund: "Admin Ventures III", country: "—", sector: "—", invested: 2499951, realized: 0, fair: 2499951 },
  { name: "CircuitWorks Inc.", fund: "Admin Ventures IV", country: "Canada", sector: "Artificial intelligence and machine learning", invested: 31250, realized: 0, fair: 31250 },
  { name: "CloudB Capital", fund: "Admin Ventures V", country: "United Kingdom", sector: "Artificial intelligence and machine learning", invested: 187500, realized: 0, fair: 187500 },
  { name: "CodeRabbit Inc.", fund: "Admin Ventures I", country: "United States", sector: "—", invested: 250000, realized: 250000, fair: 432465 },
  { name: "Entendre Finance, Inc.", fund: "Admin Ventures I", country: "—", sector: "—", invested: 500000, realized: 0, fair: 500000 },
];

function DashInvestments({ dashCtx }) {
  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
      <DashboardBar dashCtx={dashCtx} />
      <Card padded style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "var(--surface)", color: "var(--muted)" }}>
                <Th>Company Name</Th><Th>Fund</Th><Th>Country</Th><Th>Sector</Th>
                <Th right>Invested Capital</Th><Th right>Realized Proceeds</Th><Th right>Fair Value</Th><Th right>Total Value</Th>
              </tr>
            </thead>
            <tbody>
              {COMPANIES.map(c => (
                <tr key={c.name} style={{ borderTop: "1px solid var(--border)" }}>
                  <Td><a href="#" style={{ color: "var(--accent)", fontWeight: 500 }}>{c.name}</a></Td>
                  <Td>{c.fund}</Td>
                  <Td>{c.country}</Td>
                  <Td>{c.sector}</Td>
                  <Td right>{c.invested ? "$" + c.invested.toLocaleString() : "—"}</Td>
                  <Td right>{c.realized ? "$" + c.realized.toLocaleString() : "—"}</Td>
                  <Td right>{c.fair ? "$" + c.fair.toLocaleString() : "—"}</Td>
                  <Td right>{c.fair + c.realized ? "$" + (c.fair + c.realized).toLocaleString() : "—"}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

// ────────────── Cash Management tab ──────────────
function DashCash() {
  return (
    <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Cash Management Overview - All Funds</div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        <CashKPI label="Total Cash Available" value="-$1,851,936.90" icon="dollar" tone="default" />
        <CashKPI label="Restricted Cash" value="$0.00" icon="lock" tone="danger" />
        <CashKPI label="Incoming Wires" value="-$1,851,936.90" icon="arrowDown" tone="positive" />
        <CashKPI label="LOC Available" value="$0M" icon="vault" tone="violet" />
      </div>

      {/* Capital Call Summary */}
      <div style={{ marginBottom: 22 }}>
        <BannerHeader color="linear-gradient(90deg, #1E3A8A 0%, #2563EB 100%)" icon="capitalCall" label="Capital Call Summary" />
        <Card padded style={{ padding: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "var(--surface)" }}>
                <Th>Metric</Th>
                {FUNDS_LIST.map(f => <Th key={f.id} right>{f.name}</Th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["GP Commitment", [375000, 625000, 1153478.26, 4000000]],
                ["LP Commitment", [25818086.25, 43030144, 13265000, 34187314]],
                ["Total Fund Commitments", [26193086.25, 43655144, 14418478.26, 38187314]],
                ["Amount Called To Date", [26193086.25, 43655144, 14418478.26, 38187314]],
                ["% Called To Date", ["100%","100%","100%","100%"], "pct"],
                ["Amount Remaining to be Called", [0,0,0,0]],
                ["Outstanding Capital Calls", [-2686464.69, -1091380.63, 1627919.42, 297989], "neg"],
              ].map(([m, vals, kind]) => (
                <tr key={m} style={{ borderTop: "1px solid var(--border)" }}>
                  <Td>{m}</Td>
                  {vals.map((v, i) => (
                    <Td key={i} right>
                      {kind === "pct" ? <span style={{ background: "rgba(66,165,245,0.15)", padding: "2px 8px", borderRadius: 4, color: "#42A5F5" }}>{v}</span>
                        : kind === "neg" ? <span style={{ color: v < 0 ? "#EF6B6B" : "#42A5F5" }}>{v < 0 ? "-$" + Math.abs(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}) : "$" + v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                        : "$" + v.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}
                    </Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* Bank Accounts Summary */}
      <div>
        <BannerHeader color="linear-gradient(90deg, #14532D 0%, #16A34A 100%)" icon="vault" label="Bank Accounts Summary" />
        <Card padded style={{ padding: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "var(--surface)" }}>
                <Th>Account</Th>
                {FUNDS_LIST.map(f => <Th key={f.id} right>{f.name}</Th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["Restricted Cash", [0,0,0,0]],
                ["Incoming Wires", [-2686464.69, -1091380.63, 1627919.42, 297988.59]],
                ["Operating Account", [185000, 240000, 92000, 410000]],
                ["LOC Drawn", [0,0,0,0]],
              ].map(([n, vals]) => (
                <tr key={n} style={{ borderTop: "1px solid var(--border)" }}>
                  <Td>{n}</Td>
                  {vals.map((v, i) => (
                    <Td key={i} right>
                      {v < 0
                        ? <span style={{ color: "#EF6B6B" }}>-${Math.abs(v).toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
                        : "$" + v.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2})}
                    </Td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

const CashKPI = ({ label, value, icon, tone }) => {
  const tones = {
    default: { bg: "rgba(66,165,245,0.12)", color: "#42A5F5" },
    danger: { bg: "rgba(239,68,68,0.12)", color: "#EF6B6B" },
    positive: { bg: "rgba(34,197,94,0.12)", color: "#22C55E" },
    violet: { bg: "rgba(168,107,255,0.12)", color: "#A86BFF" },
  };
  const t = tones[tone] || tones.default;
  return (
    <Card padded style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{label}</div>
        <div style={{ width: 28, height: 28, borderRadius: 6, background: t.bg, color: t.color, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={icon} size={13} color={t.color} />
        </div>
      </div>
      <div className="num" style={{ fontSize: 19, fontWeight: 600, color: value.startsWith("-") ? "#EF6B6B" : "var(--fg)" }}>{value}</div>
    </Card>
  );
};

const BannerHeader = ({ color, icon, label }) => (
  <div style={{
    background: color, color: "#fff",
    padding: "14px 22px",
    fontSize: 15, fontWeight: 600,
    display: "flex", alignItems: "center", gap: 10,
    borderTopLeftRadius: 10, borderTopRightRadius: 10,
    marginBottom: 0,
  }}>
    <Icon name={icon} size={16} color="#fff" />
    {label}
  </div>
);

// ────────────── 2. Documents page ──────────────
const VCFO_INVESTOR_SUBFOLDERS = [
  { name: "Prairie Sky Ventures LLC", files: 0, folders: 0, modified: "07 May-26 09:37 am" },
  { name: "Blue Ridge Family Trust", files: 0, folders: 0, modified: "06 May-26 05:39 am" },
  { name: "Whitestone Capital", files: 0, folders: 0, modified: "28 Apr-26 12:00 pm" },
  { name: "Harlow Simmons", files: 0, folders: 0, modified: "02 Feb-26 06:28 pm" },
  { name: "Redwood Creek Holdings, Inc.", files: 0, folders: 0, modified: "02 Feb-26 06:28 pm" },
  { name: "Evelyn Chen", files: 0, folders: 0, modified: "02 Feb-26 06:28 pm" },
  { name: "Admin Ventures GP, LLC", files: 0, folders: 0, modified: "02 Feb-26 06:28 pm" },
  { name: "Lakeshore Heritage Trust", files: 0, folders: 0, modified: "02 Feb-26 06:28 pm" },
  { name: "Ironclad Solutions Corp.", files: 0, folders: 0, modified: "02 Feb-26 06:28 pm" },
  { name: "Jonathan D. Harris", files: 0, folders: 0, modified: "02 Feb-26 06:28 pm" },
  { name: "Common", files: 0, folders: 0, modified: "02 Feb-26 06:28 pm" },
];

function VCFODocuments() {
  const [path, setPath] = useStateV([]); // [] root, ["Investors"] subfolder
  const folders = [
    { name: "Formation Docs", files: 1, folders: 1, modified: "27 Apr-26 07:42 am" },
    { name: "Quarterly Reports", files: 0, folders: 11, modified: "22 Apr-26 12:20 am" },
    { name: "Capital Calls", files: 0, folders: 10, modified: "22 Apr-26 06:55 pm" },
    { name: "1065 Reports", files: 0, folders: 0, modified: "22 Apr-26 06:39 pm" },
    { name: "K-1s", files: 0, folders: 10, modified: "22 Apr-26 06:39 pm" },
    { name: "Bank Statements", files: 0, folders: 0, modified: "22 Apr-26 06:38 pm" },
    { name: "Accounting", files: 0, folders: 0, modified: "22 Apr-26 06:38 pm" },
    { name: "Journals", files: 0, folders: 0, modified: "22 Apr-26 06:38 pm" },
    { name: "Financials", files: 0, folders: 0, modified: "22 Apr-26 06:38 pm" },
    { name: "Investors", files: 0, folders: 11, modified: "22 Apr-26 06:38 pm", drillable: true },
    { name: "Capital Account Statements", files: 0, folders: 10, modified: "22 Apr-26 12:16 am" },
  ];

  const inInvestors = path[0] === "Investors";
  const inLeaf = path.length === 2;
  const currentList = inLeaf ? [] : (inInvestors ? VCFO_INVESTOR_SUBFOLDERS.map(f => ({ ...f, drillable: true })) : folders);

  return (
    <div className="fade-up">
      <PageTabs tabs={[{id: "documents", label: "Documents"}]} value="documents" onChange={()=>{}} />
      <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
        {path.length > 0 ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <button onClick={() => setPath(p => p.slice(0, -1))} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 12px", borderRadius: 7,
              background: "transparent", border: "1px solid var(--border-strong)",
              color: "var(--fg-2)", fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>
              <Icon name="chevronL" size={11} /> Back
            </button>
            <button onClick={() => window.zivePopup?.openUpload?.()} style={{
              padding: "6px 12px", borderRadius: 7, background: "transparent",
              border: "1px solid var(--border-strong)", color: "var(--fg-2)",
              fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>+ Add Folder</button>
            <button onClick={() => window.zivePopup?.openUpload?.()} style={{
              padding: "6px 12px", borderRadius: 7, background: "transparent",
              border: "1px solid var(--border-strong)", color: "var(--fg-2)",
              fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>+ Add File</button>
          </div>
        ) : (
          <div style={{ marginBottom: 18, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={lblStyle}>FUND NAME</div>
              <SoftSelect width={260} value="Admin Ventures V" options={FUNDS_LIST.map(f=>f.name)} />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => window.zivePopup?.openUpload?.()} style={{
                padding: "8px 14px", borderRadius: 7, background: "transparent",
                border: "1px solid var(--border-strong)", color: "var(--fg-2)",
                fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                <Icon name="plus" size={11} /> New Folder
              </button>
              <button onClick={() => window.zivePopup?.openUpload?.()} style={{
                ...btnPrimary, padding: "8px 16px",
              }}>
                <Icon name="plus" size={11} color="#fff" /> Add Document
              </button>
            </div>
          </div>
        )}

        {path.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14, fontSize: 12.5 }}>
            <button onClick={() => setPath([])} style={{
              background: "transparent", border: "none", color: "var(--accent)",
              cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, padding: 0,
            }}>Files and folders</button>
            {path.map((seg, i) => (
              <React.Fragment key={i}>
                <Icon name="chevronR" size={10} color="var(--muted-3)" />
                <button onClick={() => setPath(path.slice(0, i + 1))} style={{
                  background: "transparent", border: "none",
                  color: i === path.length - 1 ? "var(--fg-2)" : "var(--accent)",
                  cursor: "pointer", fontFamily: "inherit", fontSize: 12.5, padding: 0, fontWeight: i === path.length - 1 ? 500 : 400,
                }}>{seg}</button>
              </React.Fragment>
            ))}
          </div>
        )}

        {path.length === 0 && (
          <div style={{ borderBottom: "1px solid var(--border)", marginBottom: 14, padding: "0 0 10px" }}>
            <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 500, paddingBottom: 8, borderBottom: "2px solid var(--accent)" }}>All files</span>
          </div>
        )}

        {inLeaf ? (
          <Card padded>
            <div style={{ padding: "60px 22px", textAlign: "center", fontSize: 13, color: "var(--muted-2)" }}>
              No data available
            </div>
          </Card>
        ) : (
          <VCFODocsTable folders={currentList} onOpen={f => f.drillable && setPath(p => [...p, f.name])} />
        )}
      </div>
    </div>
  );
}

// ────────────── 3. API ──────────────
function VCFOApi() {
  const [tab, setTab] = useStateV(() => {
    try { return localStorage.getItem("zive.vcfo.apiTab") || "cobalt"; } catch { return "cobalt"; }
  });
  useEffectV(() => { try { localStorage.setItem("zive.vcfo.apiTab", tab); } catch {} }, [tab]);
  return (
    <div className="fade-up">
      <SwitchTabs tabs={[
        { id: "cobalt", label: "Cobalt" },
        { id: "plaid", label: "Plaid" },
        { id: "mercury", label: "Mercury" },
      ]} value={tab} onChange={setTab} />
      {tab === "cobalt" && <ApiCobalt />}
      {tab === "plaid" && <ApiIntegration provider="plaid" />}
      {tab === "mercury" && <ApiIntegration provider="mercury" />}
    </div>
  );
}

function ApiCobalt() {
  return (
    <div style={{ padding: "28px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
      <div style={{ marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
        <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 500, paddingBottom: 8, borderBottom: "2px solid var(--accent)" }}>Key</span>
      </div>
      <div style={{ maxWidth: 380 }}>
        <input placeholder="API Key" style={apiInputStyle} />
        <button style={{ ...btnPrimary, marginTop: 14 }}>Save</button>
      </div>
    </div>
  );
}

// ────────────── Plaid / Mercury integration dashboard ──────────────
const API_PROVIDERS = {
  plaid: {
    name: "Plaid",
    icon: "link",
    brand: "#2563EB",
    brandTint: "rgba(37, 99, 235, 0.12)",
    blurb: "Securely connect to thousands of banks and financial institutions through Plaid's trusted platform. Instant verification and real-time data sync.",
    bullets: [
      "Support for 12,000+ institutions",
      "Bank-level security encryption",
      "Instant account verification",
      "Real-time balance updates",
      "Automatic transaction categorization",
    ],
    accountsTitle: "Connected Accounts",
    accountsSubtitle: "0 active bank connections",
  },
  mercury: {
    name: "Mercury",
    icon: "lightning",
    brand: "#7C3AED",
    brandTint: "rgba(124, 58, 237, 0.12)",
    blurb: "Connect your Mercury banking accounts to sync balances, transactions and treasury data directly into your fund operations.",
    bullets: [
      "Native Mercury banking integration",
      "Live balance & treasury sync",
      "Wire & ACH transfer visibility",
      "Statement and document import",
      "Multi-account support",
    ],
    accountsTitle: "Mercury Accounts",
    accountsSubtitle: "Powered by Mercury",
  },
};

function ApiIntegration({ provider }) {
  const p = API_PROVIDERS[provider];
  return (
    <div style={{ padding: "24px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 16 }}>
        <ApiStatCard icon="bank" tone="pos" label="Connected Accounts" value="0" pill="Active" pillTone="pos" />
        <ApiStatCard icon="pay" tone="accent" label="Total Balance" value="$0.00" pill="Live" pillTone="accent" />
        <ApiStatCard renderIcon={<RefreshIcon size={14} color={p.brand} />} tone="brand" brandColor={p.brand} brandTint={p.brandTint} label="Last Sync" value="a month ago" pill="Synced" pillTone="pos" />
        <ApiStatCard renderIcon={<WarnTriangle size={14} color="var(--warn)" />} tone="warn" label="Needs Attention" value="0" pill="Action" pillTone="warn" />
      </div>

      {/* Integration option cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 18 }}>
        <IntegrationOptionCard
          iconName={p.icon}
          iconBg={p.brand}
          title={`Connect via ${p.name}`}
          desc={p.blurb}
          bullets={p.bullets}
          tag="Recommended"
          tagTone="accent"
          cta={{ label: `Connect with ${p.name}`, disabled: false }}
        />
        <IntegrationOptionCard
          iconName="bank"
          iconBg="#7C3AED"
          title="Direct Bank Integration"
          desc="Connect directly to supported banks using their native APIs for enhanced features and deeper integration capabilities."
          bullets={[
            "Enhanced transaction details",
            "Wire transfer capabilities",
            "Advanced reporting features",
            "Custom integrations available",
            "Priority support channels",
          ]}
          tag="Direct API"
          tagTone="violet"
          cta={{ label: "Coming Soon", disabled: true }}
        />
      </div>

      {/* Filter row */}
      <Card padded style={{ padding: "16px 18px", marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
            <ApiFilter label="STATUS" value="Active" />
            <ApiFilter label="INTEGRATION TYPE" value={p.name} />
            <ApiFilter label="SORT BY" value="Last Synced" select />
          </div>
          <button style={btnPrimary}><RefreshIcon size={11} color="#fff" /> Sync All</button>
        </div>
      </Card>

      {/* Connected accounts */}
      <Card padded style={{ padding: 0, overflow: "hidden" }}>
        <div style={{
          padding: "18px 22px", display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: "1px solid var(--border)",
        }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{p.accountsTitle}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{p.accountsSubtitle}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 10px", borderRadius: 8,
              background: "var(--surface)", border: "1px solid var(--border)",
              fontSize: 11.5, color: "var(--muted)",
            }}>
              <Icon name="info" size={11} color="var(--muted)" />
              Last sync: a month ago
            </div>
            <button style={btnGhost}><Icon name="download" size={12} /> Export</button>
          </div>
        </div>
        <div style={{ padding: "72px 22px", textAlign: "center", color: "var(--muted-2)", fontSize: 13 }}>
          No data available
        </div>
        <div style={{
          padding: "12px 22px", borderTop: "1px solid var(--border)",
          textAlign: "center", fontSize: 11.5, color: "var(--muted-2)",
        }}>
          Showing <span style={{ color: "var(--fg-2)", fontWeight: 600 }}>0</span> of <span style={{ color: "var(--fg-2)", fontWeight: 600 }}>0</span> connected accounts
        </div>
      </Card>
    </div>
  );
}

function ApiStatCard({ icon, renderIcon, tone, brandColor, brandTint, label, value, pill, pillTone }) {
  const toneMap = {
    pos: { bg: "var(--pos-tint)", fg: "var(--pos)" },
    accent: { bg: "var(--accent-tint)", fg: "var(--accent)" },
    warn: { bg: "var(--warn-tint)", fg: "var(--warn)" },
    brand: { bg: brandTint, fg: brandColor },
  };
  const pillMap = {
    pos: { bg: "var(--pos-tint)", fg: "var(--pos)" },
    accent: { bg: "var(--accent-tint)", fg: "var(--accent)" },
    warn: { bg: "var(--warn-tint)", fg: "var(--warn)" },
  };
  const t = toneMap[tone] || toneMap.accent;
  const pp = pillMap[pillTone] || pillMap.accent;
  return (
    <Card padded style={{ padding: 16 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 18 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: t.bg, color: t.fg,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          {renderIcon ? renderIcon : <Icon name={icon} size={15} color={t.fg} />}
        </div>
        <span style={{
          fontSize: 10.5, fontWeight: 600, letterSpacing: 0.2,
          padding: "3px 8px", borderRadius: 999,
          background: pp.bg, color: pp.fg,
        }}>{pill}</span>
      </div>
      <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 4 }}>{label}</div>
      <div className="num" style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.3, color: "var(--fg)" }}>{value}</div>
    </Card>
  );
}

function IntegrationOptionCard({ iconName, iconBg, title, desc, bullets, tag, tagTone, cta }) {
  const tagMap = {
    accent: { bg: "var(--accent-tint)", fg: "var(--accent)" },
    violet: { bg: "rgba(124, 58, 237, 0.12)", fg: "#7C3AED" },
  };
  const tg = tagMap[tagTone] || tagMap.accent;
  return (
    <Card padded style={{ padding: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: iconBg,
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={iconName} size={20} color="#fff" />
        </div>
        <span style={{
          fontSize: 10.5, fontWeight: 600, letterSpacing: 0.2,
          padding: "4px 9px", borderRadius: 999,
          background: tg.bg, color: tg.fg,
        }}>{tag}</span>
      </div>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2, marginBottom: 6 }}>{title}</div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>{desc}</div>
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 7 }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 12.5, color: "var(--fg-2)" }}>
            <span style={{
              width: 16, height: 16, borderRadius: 999,
              background: "var(--pos-tint)", color: "var(--pos)",
              display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Icon name="check" size={10} color="var(--pos)" strokeWidth={2.5} />
            </span>
            {b}
          </li>
        ))}
      </ul>
      <div style={{ marginTop: 2 }}>
        <button disabled={cta.disabled} style={{
          ...btnPrimary,
          padding: "10px 16px", height: "auto",
          opacity: cta.disabled ? 0.5 : 1,
          cursor: cta.disabled ? "not-allowed" : "pointer",
        }}>{cta.label}</button>
      </div>
    </Card>
  );
}

function ApiFilter({ label, value, select }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 160 }}>
      <div style={{ fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.5, textTransform: "uppercase", fontWeight: 600 }}>{label}</div>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 36, padding: "0 12px",
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        borderRadius: 8,
        fontSize: 12.5, color: "var(--fg)",
      }}>
        <span>{value}</span>
        {select && <Icon name="chevronD" size={11} color="var(--muted-2)" />}
      </div>
    </div>
  );
}

// Inline warning triangle (not in the icon set)
const WarnTriangle = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block" }}>
    <path d="M12 9v4"/><path d="M12 16v.01"/>
    <path d="M5 19h14a2 2 0 0 0 1.71 -3.03l-7 -12a2 2 0 0 0 -3.42 0l-7 12a2 2 0 0 0 1.71 3.03"/>
  </svg>
);

// ────────────── 4. Investments page (Deal Tracker) ──────────────
function VCFOInvestments({ initialTab } = {}) {
  const [tab, setTab] = useStateV(initialTab || "deals");
  const tabs = [
    { id: "deals", label: "Deal Tracker" },
    { id: "portfolio-co", label: "Portfolio Companies" },
    { id: "portfolio-req", label: "Portfolio Request" },
    { id: "fin-docs", label: "Financing Docs" },
    { id: "board", label: "Board Deck Analysis" },
    { id: "legal", label: "Legal Analysis" },
    { id: "legal-cmp", label: "Legal Comparison" },
    { id: "analytics", label: "Portfolio Analytics" },
    { id: "doc-up", label: "Document Upload" },
    { id: "migration", label: "Migration" },
  ];

  const deals = [
    { fund: "Admin Ventures V", co: "InfraLoop, Inc.", share: "Series A Preferred", type: "Initial", deal: "Active Investment", sector: "Agtech", date: "Tue Feb 03 2026", amount: 60000000, status: "Funded" },
    { fund: "Admin Ventures V", co: "NovaCore Systems", share: "Series A Preferred", type: "Initial", deal: "Active Investment", sector: "Artificial intelligence and machine learning", date: "Mon Apr 27 2026", amount: 0, status: "Funded" },
    { fund: "Admin Ventures V", co: "MicroEdge Partners", share: "Series A Preferred", type: "Initial", deal: "Active Investment", sector: "Agtech", date: "Mon Apr 27 2026", amount: 0, status: "Funded" },
    { fund: "Admin Ventures V", co: "CloudB Capital", share: "Series Seed Preferred", type: "Initial", deal: "Active Investment", sector: "Artificial intelligence and machine learning", date: "Mon Apr 27 2026", amount: 0, status: "Funded" },
    { fund: "Admin Ventures V", co: "OctaThink Solutions", share: "Series A Preferred", type: "Initial", deal: "Active Investment", sector: "Artificial intelligence and machine learning", date: "Mon Apr 27 2026", amount: 0, status: "Funded" },
  ];

  return (
    <div className="fade-up">
      <PillTabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === "deals" && <ITDealTracker deals={deals} />}
      {tab === "portfolio-co" && <ITPortfolioCompanies />}
      {tab === "portfolio-req" && <ITPortfolioRequest />}
      {tab === "fin-docs" && <ITFinancingDocs />}
      {tab === "board" && <ITBoardDeck />}
      {tab === "legal" && <ITLegalAnalysis />}
      {tab === "legal-cmp" && <ITLegalComparison />}
      {tab === "analytics" && <ITPortfolioAnalytics />}
      {tab === "doc-up" && <ITDocumentUpload />}
      {tab === "migration" && <ITMigration />}
    </div>
  );
}

// Original Deal Tracker body, extracted so the other tabs can replace it cleanly
function ITDealTracker({ deals }) {
  return (
    <div className="fade-up">
      <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
        <div style={{ marginBottom: 14 }}>
          <div style={lblStyle}>Select Fund</div>
          <SoftSelect width={260} value="Admin Ventures V" options={FUNDS_LIST.map(f=>f.name)} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
          <button style={btnGhost} onClick={() => window.zivePopup?.openUpload()}><Icon name="aiUpload" size={12} /> Upload Documents</button>
        </div>

        <Card padded style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 13.5, fontWeight: 500, marginBottom: 14 }}>Overview - Admin Ventures V</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
            <KPISmall label="Active Deals" value="7" icon="dealRoom" />
            <KPISmall label="Total Investment Amount" value="$120,000,000.00" icon="dollar" />
            <KPISmall label="Closing This Month" value="0" icon="calendar" />
            <KPISmall label="Reserved Capital" value="$0.00" icon="vault" />
          </div>
        </Card>

        <Card padded style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 22px" }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Deal Tracker</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={btnGhost}>Sync Deal</button>
              <button style={{ ...btnPrimary, padding: "6px 14px" }}><Icon name="plus" size={11} color="#fff" /> Add Deal</button>
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "var(--surface)", color: "var(--muted)" }}>
                <Th>Fund</Th><Th>Investment Name</Th><Th>Share Class</Th><Th>Type</Th>
                <Th>Deal Type</Th><Th>Sector</Th><Th>Closing Date</Th><Th right>Amount</Th>
                <Th right>Reserves</Th><Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {deals.map((d, i) => (
                <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                  <Td>{d.fund}</Td>
                  <Td>{d.co}</Td>
                  <Td>{d.share}</Td>
                  <Td>{d.type}</Td>
                  <Td>{d.deal}</Td>
                  <Td>{d.sector}</Td>
                  <Td>{d.date}</Td>
                  <Td right>{d.amount ? "$" + d.amount.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}) : "—"}</Td>
                  <Td right>—</Td>
                  <Td><span style={statusPill}>{d.status}</span></Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// Pill tab strip (used on Investments)
const PillTabs = ({ tabs, value, onChange }) => (
  <div style={{ borderBottom: "1px solid var(--border)" }}>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "20px 40px 16px", maxWidth: 1360, margin: "0 auto" }}>
    {tabs.map(t => (
      <button key={t.id} onClick={() => onChange(t.id)} style={{
        padding: "7px 14px", borderRadius: 7,
        background: value === t.id ? "var(--accent)" : "transparent",
        color: value === t.id ? "#fff" : "var(--muted)",
        border: value === t.id ? "none" : "1px solid var(--border)",
        fontSize: 12.5, fontWeight: 500,
        cursor: "pointer", fontFamily: "inherit",
        transition: "all 120ms ease",
      }}>{t.label}</button>
    ))}
    </div>
  </div>
);

const KPISmall = ({ label, value, icon }) => (
  <div style={{ padding: 14, background: "var(--surface)", borderRadius: 10, border: "1px solid var(--border)" }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{label}</div>
      <Icon name={icon} size={13} color="var(--accent)" />
    </div>
    <div className="num" style={{ fontSize: 18, fontWeight: 600, marginTop: 6 }}>{value}</div>
  </div>
);

const statusPill = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "4px 10px", borderRadius: 6,
  background: "var(--surface-2)", border: "1px solid var(--border)",
  fontSize: 11.5, color: "var(--fg-2)",
};

// ────────────── 5. Funds page ──────────────
function VCFOFunds({ initialTab, initialActiveTab, initialProvider } = {}) {
  const [tab, setTab] = useStateV(initialTab || "funds");
  const tabs = [
    { id: "funds", label: "Funds" },
    { id: "ccm", label: "Fund Capital Call Management" },
    { id: "pacing", label: "Fund Pacing" },
    { id: "recycling", label: "Fund Recycling" },
    { id: "banks", label: "Connected Banks" },
  ];
  return (
    <div className="fade-up">
      <PillTabs tabs={tabs} value={tab} onChange={setTab} />
      {tab === "funds" && <FTFundsList />}
      {tab === "ccm" && <FTCapitalCall initialActiveTab={initialActiveTab} />}
      {tab === "pacing" && <FTFundPacing />}
      {tab === "recycling" && <FTFundRecycling />}
      {tab === "banks" && <FTConnectedBanks initialProvider={initialProvider} />}
    </div>
  );
}

// ────────────── 6. Accounting ──────────────
function VCFOAccounting({ initialTab } = {}) {
  const [tab, setTab] = useStateV(initialTab || "ca");
  const tabs = [
    { id: "ca", label: "Capital Accounts" },
    { id: "cc", label: "Capital Calls" },
    { id: "comp", label: "Comparative Analysis" },
    { id: "dist", label: "Distributions" },
    { id: "fin", label: "Financials" },
    { id: "gltb", label: "GL & TB" },
    { id: "schi", label: "Schedule of Investment" },
    { id: "cash", label: "Cash Reconciliation" },
    { id: "exp", label: "Expenses" },
    { id: "fof", label: "FOF" },
    { id: "alloc", label: "Allocations" },
  ];

  const Tab = window.AccountingTabs?.[tab];

  return (
    <div className="fade-up">
      <PillTabs tabs={tabs} value={tab} onChange={setTab} />
      <div style={{ padding: "24px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
        {Tab ? <Tab key={tab} /> : (
          <div style={{ padding: 40, textAlign: "center", color: "var(--muted)" }}>Tab content unavailable.</div>
        )}
      </div>
    </div>
  );
}

const initialChip = (code) => ({
  width: 30, height: 30, borderRadius: 8,
  background: "var(--surface-2)", border: "1px solid var(--border)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 11, fontWeight: 600, color: "var(--fg-2)",
});

const SimpleCard = ({ label, sub, value }) => (
  <Card padded style={{ padding: 16 }}>
    <div style={{ fontSize: 12, fontWeight: 500, color: "var(--fg-2)" }}>{label}</div>
    <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 4 }}>{sub}</div>
    <div className="num" style={{ fontSize: 19, fontWeight: 600, marginTop: 8 }}>{value}</div>
  </Card>
);

// ────────────── 7. Reporting ──────────────
function VCFOReporting({ initialTab } = {}) {
  const [tab, setTab] = useStateV(initialTab || "perf");
  const tabs = [
    { id: "perf", label: "Fund Performance" },
    { id: "ilpa", label: "ILPA Reports" },
    { id: "qf", label: "Quarterly Financials" },
    { id: "audit", label: "Audited Financials" },
    { id: "custom", label: "Custom Reports" },
    { id: "year", label: "Year End Reports" },
  ];

  return (
    <div className="fade-up">
      <PillTabs tabs={tabs} value={tab} onChange={setTab} />
      <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 22 }}>
          <div><div style={lblStyle}>FUND NAME</div><SoftSelect width={200} value="Admin Ventures V" options={FUNDS_LIST.map(f=>f.name)} /></div>
          <div><div style={lblStyle}>PERIOD</div><SoftSelect width={140} value="Q4 2025" options={["Q4 2025","Q3 2025"]} /></div>
          <div><div style={lblStyle}>SEARCH</div><input placeholder="Search performance..." style={{ ...apiInputStyle, height: 36, width: 240 }} /></div>
          <div style={{ marginLeft: "auto" }}><SoftSelect width={120} value="Excel" options={["Excel","PDF"]} /></div>
        </div>

        <Card padded style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Action Items</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
            {["Up to Date", "Urgent", "Priority", "Open Issue"].map(s => (
              <div key={s} style={{ padding: 18, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10 }}>
                <div style={{ fontSize: 13, color: "var(--fg-2)" }}>{s}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card padded style={{ marginBottom: 22 }}>
          <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Quick Overview - Fund Performance</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {[
              ["Current MOIC","1.82x"], ["TVPI (Live)","1.05x"], ["Fund Size","$26,193,086.25"],
              ["Gross IRR","0.00%"], ["DPI (Live)","—"], ["Available to Deploy","$4,365,514.38"],
              ["Net IRR","1.39%"], ["RVPI (Live)","—"], ["Vintage Year","2023"],
            ].map(([k,v]) => (
              <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px dashed var(--border)" }}>
                <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{k}</span>
                <span className="num" style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg)" }}>{v}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card padded style={{ padding: 0 }}>
          <div style={{ padding: "14px 22px", fontSize: 14, fontWeight: 600 }}>Fund Performance Details</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "var(--surface)", color: "var(--muted)" }}>
                <Th>Fund Metrics</Th><Th right>Admin Ventures V</Th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Fund Size","—"], ["Investable Funds","—"], ["Plus: Recycling Target","—"],
                ["Available to Deploy","—"], ["MOIC (Live)","1.82x"], ["TVPI (Live)","1.05x"],
              ].map(([k,v]) => (
                <tr key={k} style={{ borderTop: "1px solid var(--border)" }}>
                  <Td>{k}</Td><Td right>{v}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ────────────── 8. LP Portal ──────────────
function VCFOLPPortal({ initialTab } = {}) {
  const [tab, setTab] = useStateV(initialTab || "main");
  const tabs = [
    { id: "main", label: "Main Screen" },
    { id: "history", label: "Document History" },
    { id: "tax", label: "Tax Information" },
    { id: "bank", label: "Banking Information" },
    { id: "del", label: "Delegation" },
    { id: "broker", label: "Brokerage Information" },
    { id: "ir", label: "IR Related Matters" },
    { id: "conf", label: "Confirmations" },
  ];
  return (
    <div className="fade-up">
      <PillTabs tabs={tabs} value={tab} onChange={setTab} />
      <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: 20, marginBottom: 22 }}>
          <div><div style={lblStyle}>FUND NAME</div><SoftSelect width={200} value="Admin Ventures V" options={FUNDS_LIST.map(f=>f.name)} /></div>
          <div><div style={lblStyle}>INVESTOR</div><SoftSelect width={200} value="Admin Ventures GP, …" options={["Admin Ventures GP, LLC"]} /></div>
          <div><div style={lblStyle}>PERIOD</div><SoftSelect width={140} value="Q2 2026" options={["Q2 2026"]} /></div>
        </div>

        <div style={{
          background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)",
          color: "#fff", padding: "28px 32px", borderRadius: 12, marginBottom: 22,
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ fontSize: 22, fontWeight: 600, marginBottom: 10 }}>Welcome to Your Investor Portal</div>
          <div style={{ fontSize: 13.5, marginBottom: 4, opacity: 0.95 }}>Dear Limited Partner,</div>
          <div style={{ fontSize: 13, opacity: 0.85, maxWidth: 720, lineHeight: 1.6 }}>
            This is your main dashboard for viewing and accessing all information related to our firm. Here you can monitor your investments, review documents, track performance, and stay updated on fund activities. Navigate through the sections above to access specific areas of interest.
          </div>
          <div style={{ position: "absolute", top: 24, right: 28, opacity: 0.4 }}>
            <Icon name="users" size={56} color="#fff" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 22 }}>
          <Card padded>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Recent Activity</div>
              <Icon name="refresh" size={13} color="var(--accent)" />
            </div>
            <div style={{ color: "var(--muted-2)", fontSize: 12.5, padding: "20px 0" }}>No records available</div>
          </Card>
          <Card padded>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Outstanding Actions</div>
            <div style={{ color: "var(--muted-2)", fontSize: 12.5, padding: "20px 0" }}>No records available</div>
          </Card>
        </div>

        <Card padded style={{ padding: 0 }}>
          <div style={{ padding: "14px 22px", fontSize: 14, fontWeight: 600 }}>Holdings Overview Summary</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr style={{ background: "var(--surface)", color: "var(--muted)" }}>
                <Th>Fund Name</Th><Th>Investor Legal Name</Th><Th right>Commitment</Th>
                <Th right>Commitment (%)</Th><Th>Partner Type</Th><Th right>Beginning Balance</Th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: "1px solid var(--border)" }}>
                <Td>Admin Ventures V</Td>
                <Td>Charles / Admin Ventures GP, LLC</Td>
                <Td right>$375,000.00</Td>
                <Td right>1.43%</Td>
                <Td><span style={{ ...statusPill, color: "#22C55E" }}>● GENERAL PARTNER</span></Td>
                <Td right>—</Td>
              </tr>
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ────────────── 9. Unstructured Data Analyzer ──────────────
function VCFOUDA({ initialTab } = {}) {
  const [tab, setTab] = useStateV(initialTab || "dash");
  const tabs = [
    { id: "dash", label: "Dashboard" },
    { id: "chats", label: "Chats" },
    { id: "docs", label: "Documents" },
  ];
  return (
    <div className="fade-up">
      <PageTabs tabs={tabs} value={tab} onChange={setTab} />
      <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, gap: 12 }}>
          <div style={{ display: "flex", gap: 10 }}>
            <SoftSelect width={200} value="Fund II Dashboards" options={["Fund II Dashboards"]} />
            <button style={{ ...btnPrimary, padding: "6px 14px" }}><Icon name="plus" size={11} color="#fff" /> Add Dashboard</button>
            <button style={{ ...btnGhost, padding: "6px 8px" }}><Icon name="more" size={13} /></button>
          </div>
          <button style={{ ...btnPrimary, background: "#22C55E", padding: "6px 14px" }}><Icon name="plus" size={11} color="#fff" /> Add Widget</button>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
          <div style={{ fontSize: 14, fontWeight: 500 }}>Custom Widgets</div>
          <span style={{ fontSize: 11.5, padding: "3px 9px", borderRadius: 4, background: "var(--surface-2)", color: "var(--muted)" }}>4 widgets</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <WidgetCard title="Admin Ventures II - Portfolio Investments" date="Updated Feb 4, 2026">
            <table style={{ width: "100%", fontSize: 11.5, borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "rgba(66,165,245,0.1)", color: "var(--muted)" }}>
                  <Th>Portfolio Company</Th><Th>Asset Class</Th><Th right>Investment Amount</Th><Th>Investment Date</Th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["AAA Robotics","Series B Junior Preferred Stock","$5,000,000.00","08/10/2023"],
                  ["Unknown","Unknown","$1,702,527.41","03/06/2022"],
                  ["Unknown","Unknown","$1,559,013.70","08/09/2022"],
                  ["Unknown","Unknown","$1,500,000.00","05/30/2022"],
                  ["Unknown","Unknown","$864,713.00","10/29/2022"],
                  ["Unknown","Unknown","$555,000.00","04/27/2022"],
                  ["Unknown","Unknown","$512,056.00","05/19/2022"],
                  ["DeepMinds Lab","Series A Preferred","$249,999.75","04/16/2023"],
                ].map((r, i) => (
                  <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
                    <Td>{r[0]}</Td><Td>{r[1]}</Td><Td right>{r[2]}</Td><Td>{r[3]}</Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </WidgetCard>

          <WidgetCard title="Sector-wise Investment Distribution - Admin Ventures II" date="Updated Feb 4, 2026">
            <PieChartFake />
          </WidgetCard>

          <WidgetCard title="Admin Ventures II - LP vs GP Capital Commitment" date="Updated Feb 4, 2026">
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted-2)", fontSize: 12 }}>Bar chart placeholder</div>
          </WidgetCard>

          <WidgetCard title="Admin Ventures II - LP vs GP Capital Commitment" date="Updated Apr 13, 2026">
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted-2)", fontSize: 12 }}>Bar chart placeholder</div>
          </WidgetCard>
        </div>
      </div>
    </div>
  );
}

const WidgetCard = ({ title, date, children }) => (
  <Card padded style={{ padding: 0, overflow: "hidden" }}>
    <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>{title}</div>
          <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 4 }}>⏱ {date}</div>
        </div>
        <div style={{ display: "flex", gap: 6, color: "var(--muted-2)" }}>
          <Icon name="more" size={12} />
          <Icon name="external" size={11} />
          <Icon name="refresh" size={11} />
          <Icon name="settings" size={11} />
          <Icon name="x" size={12} />
        </div>
      </div>
    </div>
    <div style={{ padding: 14 }}>{children}</div>
  </Card>
);

const PieChartFake = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 220, position: "relative" }}>
    <svg width="180" height="180" viewBox="0 0 180 180">
      <g transform="translate(90,90)">
        <path d="M 0,-80 A 80,80 0 0,1 76,25 L 0,0 Z" fill="#42A5F5" />
        <path d="M 76,25 A 80,80 0 0,1 -23,77 L 0,0 Z" fill="#FFB347" />
        <path d="M -23,77 A 80,80 0 0,1 -78,18 L 0,0 Z" fill="#EF4444" />
        <path d="M -78,18 A 80,80 0 0,1 0,-80 L 0,0 Z" fill="#22C55E" />
      </g>
    </svg>
    <div style={{ position: "absolute", right: 8, top: 8, fontSize: 11, color: "var(--fg-2)", display: "flex", flexDirection: "column", gap: 4 }}>
      <span><span style={{ color: "#42A5F5", fontWeight: 600 }}>AI/Machine Learning: 43%</span></span>
      <span><span style={{ color: "#22C55E", fontWeight: 600 }}>Enterprise Software: 2%</span></span>
      <span><span style={{ color: "#EF4444", fontWeight: 600 }}>Technology Services: 15%</span></span>
      <span><span style={{ color: "#FFB347", fontWeight: 600 }}>Robotics: 41%</span></span>
    </div>
  </div>
);

// ────────────── 10. Financing Documents ──────────────
function VCFOFinancingDocs({ initialTab } = {}) {
  const [tab, setTab] = useStateV(initialTab || "crit");
  const tabs = [
    { id: "up", label: "Document Upload" },
    { id: "crit", label: "Critical Summary" },
    { id: "status", label: "Doc Status" },
    { id: "rounds", label: "Rounds Comparison" },
    { id: "by", label: "Bylaws" },
    { id: "cap", label: "Cap Table" },
    { id: "char", label: "Charter" },
    { id: "ira", label: "IRA" },
    { id: "mrl", label: "MRL" },
    { id: "rofr", label: "ROFR / Co-Sale" },
    { id: "spa", label: "SPA" },
    { id: "term", label: "Term Sheet" },
    { id: "vote", label: "Voting" },
  ];
  return (
    <div className="fade-up">
      <PillTabs tabs={tabs} value={tab} onChange={setTab} />
      <div style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
          <div>
            <div style={lblStyle}>Select Fund</div>
            <SoftSelect width={220} value="Admin Ventures V" options={FUNDS_LIST.map(f=>f.name)} />
          </div>
          <button style={btnGhost} onClick={() => window.zivePopup?.openUpload()}><Icon name="aiUpload" size={12} /> Upload Documents</button>
        </div>
        <Card padded style={{ padding: 18 }}>
          <div style={lblStyle}>Select Company</div>
          <SoftSelect width={260} value="Select a company..." options={["7Labs AI","CloudB Capital","NovaCore Systems"]} />
        </Card>
      </div>
    </div>
  );
}

// ────────────── 11. Agents ──────────────
function VCFOAgents() {
  const agents = [
    { id: 1, code: "C1", name: "cap 123", created: "Mar 18", updated: "Mar 18", desc: "test 1234", caps: 1, tags: ["Capital Call"] },
    { id: 2, code: "CC", name: "Cap Call", created: "Mar 17", updated: "Mar 17", desc: "No description provided", caps: 1, tags: ["Capital Call"] },
    { id: 3, code: "CC", name: "Cap Call", created: "Mar 16", updated: "Mar 16", desc: "No description provided", caps: 1, tags: ["Capital Call"] },
    { id: 4, code: "CC", name: "Cap Call Agent", created: "Mar 6", updated: "Mar 8", desc: "No description provided", caps: 1, tags: ["Capital Call"] },
    { id: 5, code: "CC", name: "Cap Call Agent", created: "Feb 4", updated: "Feb 4", desc: "No description provided", caps: 1, tags: ["Capital Call"] },
  ];
  return (
    <div className="fade-up">
      <div style={{ padding: "28px 32px 48px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 22 }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>Custom agents</h1>
            <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4 }}>Your entity's custom agents. BlueCheck and review agents are available under their own tabs.</div>
          </div>
          <button style={{ ...btnPrimary, background: "#7C3AED", padding: "8px 16px" }}><Icon name="plus" size={11} color="#fff" /> New agent</button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 22 }}>
          <Card padded style={{ padding: 14 }}><div style={{ fontSize: 12, color: "var(--muted)" }}>📊 Total agents</div><div style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>5</div><div style={{ fontSize: 11, color: "var(--muted-2)" }}>in this entity</div></Card>
          <Card padded style={{ padding: 14 }}><div style={{ fontSize: 12, color: "var(--muted)" }}>✓ Active</div><div style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>5</div><div style={{ fontSize: 11, color: "var(--muted-2)" }}>0 inactive</div></Card>
          <Card padded style={{ padding: 14 }}><div style={{ fontSize: 12, color: "var(--muted)" }}>⚙ Capabilities</div><div style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>5</div><div style={{ fontSize: 11, color: "var(--muted-2)" }}>Across all agents.</div></Card>
          <Card padded style={{ padding: 14 }}><div style={{ fontSize: 12, color: "var(--muted)" }}>↻ Updated recently</div><div style={{ fontSize: 22, fontWeight: 600, marginTop: 6 }}>0</div><div style={{ fontSize: 11, color: "var(--muted-2)" }}>in the last 30 days</div></Card>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 18 }}>
          {["All 5", "Active 5", "Inactive 0"].map((t, i) => (
            <span key={i} style={{ fontSize: 12.5, color: i === 0 ? "var(--accent)" : "var(--muted)", fontWeight: i === 0 ? 600 : 400, paddingBottom: 6, borderBottom: i === 0 ? "2px solid var(--accent)" : "none" }}>{t}</span>
          ))}
          <input placeholder="Search agents..." style={{ ...apiInputStyle, height: 32, width: 220, marginLeft: "auto" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>
          {agents.map(a => (
            <Card padded key={a.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                <div style={{ ...initialChip(a.code), width: 34, height: 34, fontSize: 12 }}>{a.code}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: 11, color: "var(--muted-2)" }}>Created {a.created} · Updated {a.updated}</div>
                </div>
                <span style={{ fontSize: 10.5, color: "#22C55E" }}>● Active</span>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12 }}>{a.desc}</div>
              <div style={{ fontSize: 10.5, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>CAPABILITIES · {a.caps}</div>
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                {a.tags.map(t => <span key={t} style={{ fontSize: 11, padding: "2px 8px", borderRadius: 4, background: "var(--surface-2)", color: "var(--fg-2)", border: "1px solid var(--border)" }}>{t}</span>)}
              </div>
              <button style={{ width: "100%", background: "#1E3A5F", border: "none", color: "#fff", padding: 8, borderRadius: 8, fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                <Icon name="sparkle" size={11} color="#fff" /> Ask AI
              </button>
            </Card>
          ))}
          <Card padded style={{ padding: 16, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", border: "1px dashed var(--border-strong)", background: "transparent", minHeight: 200 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 8 }}>
              <Icon name="plus" size={14} color="var(--muted)" />
            </div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>New agent</div>
            <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 3 }}>Build a custom agent</div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// ────────────── 12. Document Studio ──────────────
function VCFODocStudio() {
  return (
    <div className="fade-up" style={{ padding: 24, display: "grid", gridTemplateColumns: "240px 1fr 320px", gap: 18, height: "calc(100vh - 56px)" }}>
      {/* Doc list */}
      <Card padded style={{ padding: 12 }}>
        <button style={{ ...btnPrimary, width: "100%", padding: "8px 12px", justifyContent: "center" }}><Icon name="plus" size={11} color="#fff" /> New Document</button>
        <div style={{ marginTop: 18, padding: "60px 12px", textAlign: "center", color: "var(--muted-2)", fontSize: 12.5 }}>
          <div style={{ fontWeight: 500, color: "var(--fg-2)" }}>No documents yet</div>
          <div style={{ marginTop: 6 }}>Upload a document to get started</div>
        </div>
      </Card>

      {/* Upload area */}
      <Card padded style={{ padding: 24, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", border: "1px dashed var(--border-strong)", borderRadius: 12, padding: "60px 80px" }}>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginBottom: 16 }}>
            <div style={{ width: 56, height: 56, background: "rgba(66,165,245,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="folder" size={22} color="#42A5F5" />
            </div>
            <div style={{ width: 56, height: 56, background: "rgba(34,197,94,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="bookmark" size={22} color="#22C55E" />
            </div>
          </div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>Upload a document</div>
          <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 8 }}>Drag & drop or click to browse</div>
          <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 12 }}>Supported formats: <span style={{ color: "var(--fg-2)", fontWeight: 500 }}>PDF, JPG, PNG</span></div>
          <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>Maximum file size: <span style={{ color: "var(--fg-2)", fontWeight: 500 }}>25MB</span></div>
          <button style={{ ...btnPrimary, marginTop: 18, padding: "8px 18px" }}><Icon name="aiUpload" size={11} color="#fff" /> Choose File</button>
        </div>
      </Card>

      {/* Assistant */}
      <Card padded style={{ padding: 14, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Document Assistant</div>
        <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>Ask questions or request modifications to your document</div>
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--muted-2)", fontSize: 12 }}>Upload a document to start chatting</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input placeholder="Upload a document to start chatting..." style={{ ...apiInputStyle, flex: 1, height: 36 }} />
          <button style={{ ...btnPrimary, padding: "0 14px" }}><Icon name="send" size={12} color="#fff" /></button>
        </div>
      </Card>
    </div>
  );
}

// ────────────── 13. MCP ──────────────
function VCFOMCP() {
  return (
    <div className="fade-up" style={{ padding: "28px 32px 48px" }}>
      <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: -0.4 }}>MCP URL Management</h1>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginTop: 4, marginBottom: 22 }}>Generate and manage MCP URLs for API access</div>
      <Card padded style={{ padding: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 18 }}>Generated URLs</div>
        <div style={{ padding: "60px 0", textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "var(--surface-2)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <Icon name="anchor" size={20} color="var(--muted-2)" />
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--fg-2)" }}>No MCP URLs generated yet</div>
          <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 6 }}>No MCP URL has been generated for your account yet. Please contact a Super Admin.</div>
        </div>
      </Card>
    </div>
  );
}

// ────────────── 14. Users ──────────────
function VCFOUsers() {
  const users = [
    { code: "B", name: "Ben Wisotski", email: "ben.wisotski@brightstream.ch", entity: "—", status: "Invited 4/21/2026 12:00:41", type: "GENERAL PARTNER", access: "ADMIN", login: "27.4.2026, 10:47:19" },
    { code: "C", name: "Charles", email: "charles@adminventures.gp.in", entity: "—", status: "Invited 3/19/2026 17:15:34", type: "FUND MANAGER", access: "ADMIN", login: "—" },
    { code: "RG", name: "Rajesh Gopi", email: "rajesh@zive.ai", entity: "—", status: "Invited 1/22/2026 14:25:23", type: "FUND ADMINISTRATOR", access: "ADMIN", login: "24.4.2026, 18:34:49" },
    { code: "S", name: "Support", email: "support@zive.ai", entity: "—", status: "Invited", type: "FUND ADMINISTRATOR", access: "ZIVE ADMIN", login: "22.1.2026, 14:30:19" },
    { code: "VS", name: "Vineet Singh", email: "vineet@zive.ai", entity: "—", status: "Invited 3/19/2026 17:18:00", type: "GENERAL PARTNER", access: "ADMIN", login: "23.4.2026, 16:51:11" },
    { code: "V", name: "Vishal", email: "vishal@zive.ai", entity: "—", status: "Invited 2/4/2026 12:52:20", type: "FUND ADMINISTRATOR", access: "ADMIN", login: "27.4.2026, 09:27:07" },
  ];
  return (
    <div className="fade-up" style={{ padding: "28px 32px 48px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <input placeholder="🔍 Search ..." style={{ ...apiInputStyle, height: 36, width: 220 }} />
        <div style={{ display: "flex", gap: 8 }}>
          <button style={{ ...btnPrimary, padding: "8px 14px" }}><Icon name="plus" size={11} color="#fff" /> Add New User</button>
          <button style={btnGhost}>Invite All</button>
          <button style={{ ...btnGhost, padding: "8px 10px" }}><Icon name="more" size={13} /></button>
        </div>
      </div>
      <div style={{ borderBottom: "1px solid var(--border)", marginBottom: 0, padding: "0 0 10px" }}>
        <span style={{ color: "var(--accent)", fontSize: 13, fontWeight: 500, paddingBottom: 8, borderBottom: "2px solid var(--accent)", marginRight: 24 }}>Users</span>
        <span style={{ color: "var(--muted)", fontSize: 13 }}>Delegates</span>
      </div>
      <Card padded style={{ padding: 0, overflow: "hidden", marginTop: 14 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: "var(--surface)", color: "var(--muted)" }}>
              <Th>User Name</Th><Th>Email</Th><Th>Entity Name</Th><Th>Status</Th>
              <Th>User Type</Th><Th>Access Type</Th><Th>Last Login</Th><Th></Th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.email} style={{ borderTop: "1px solid var(--border)" }}>
                <Td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><div style={initialChip(u.code)}>{u.code}</div>{u.name}</div></Td>
                <Td>{u.email}</Td>
                <Td>{u.entity}</Td>
                <Td><span style={{ ...statusPill, background: "rgba(34,197,94,0.15)", color: "#22C55E", border: "1px solid rgba(34,197,94,0.3)" }}>{u.status}</span></Td>
                <Td><span style={{ fontSize: 10.5, padding: "3px 7px", borderRadius: 4, background: "var(--surface-2)", color: "var(--muted)", letterSpacing: 0.4, textTransform: "uppercase" }}>{u.type}</span></Td>
                <Td><span style={{ fontSize: 10.5, padding: "3px 7px", borderRadius: 4, background: "rgba(66,165,245,0.15)", color: "#42A5F5", letterSpacing: 0.4 }}>{u.access}</span></Td>
                <Td>{u.login}</Td>
                <Td><Icon name="more" size={13} color="var(--muted)" /></Td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// LP Shell — for `admin-v` (Admin Ventures V, USER role)
// ════════════════════════════════════════════════════════════════════════
const LP_NAV = [
  { label: "Fund", items: [
    { id: "overview", label: "Overview", icon: "dashboard" },
  ]},
  { label: "Accounting", items: [
    { id: "wire", label: "Wire Instructions", icon: "vault" },
  ]},
];

function LPShell({ onAskAI, entity, onChangeEntity }) {
  const [active, setActive] = useStateV(() => {
    try { return localStorage.getItem("zive.lp.page") || "overview"; } catch { return "overview"; }
  });
  useEffectV(() => { try { localStorage.setItem("zive.lp.page", active); } catch {} }, [active]);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <ShellSidebar items={LP_NAV} activeId={active} onPick={setActive} />
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <TopBar onAskAI={onAskAI} entity={entity} onChangeEntity={onChangeEntity} />
        <main style={{ flex: 1, overflow: "auto" }}>
          {active === "overview" && <LPOverview />}
          {active === "wire" && <LPWireInstructions />}
        </main>
      </div>
    </div>
  );
}

function LPOverview() {
  return (
    <div className="fade-up" style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
      <h1 style={{ margin: 0, fontSize: 26, fontWeight: 500, letterSpacing: -0.5, marginBottom: 22 }}>Overview</h1>

      <Card padded style={{ padding: 22, marginBottom: 28 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 18 }}>Ben Wisotski</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 22 }}>
          <DimItem k="Vintage" v="2023" />
          <DimItem k="Term" v="10 years" />
          <DimItem k="Legal form" v="Limited Partnership" icon="vault" />
          <DimItem k="Domicile" v="United States" />
          <DimItem k="Structure" v="Closed-end" />
          <DimItem k="Currency" v="USD" />
        </div>
      </Card>

      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14, color: "var(--fg-2)" }}>
        <Icon name="dollar" size={13} color="var(--accent)" /> Commitments
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <BigStatCard label="Committed" value="$0.00" tone="default" />
        <BigStatCard label="Net Asset Value" value="$0.00" tone="default" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 16 }}>
        <SmallKV label="Year" value="" />
        <SmallKV label="Paid Contribution" value="$0.00" />
        <SmallKV label="Ownership" value="0%" />
        <SmallKV label="Distributed" value="$0.00" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr) 1fr", gap: 16 }}>
        <SmallKV label="Calls" value="$0.00" />
        <SmallKV label="Prepaid" value="$0.00" />
        <SmallKV label="Due to Fund now" value="$0.00" />
      </div>
    </div>
  );
}

const DimItem = ({ k, v, icon }) => (
  <div>
    <div style={{ fontSize: 11, color: "var(--muted-2)", marginBottom: 4 }}>{k}</div>
    <div style={{ fontSize: 13, color: "var(--fg)", fontWeight: 500, display: "flex", alignItems: "center", gap: 6 }}>
      {icon && <Icon name={icon} size={11} color="var(--accent)" />}
      {v}
    </div>
  </div>
);

const BigStatCard = ({ label, value, tone }) => (
  <Card padded style={{ padding: 18 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(66,165,245,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon name="dollar" size={16} color="#42A5F5" />
      </div>
      <div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>{label}</div>
        <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 2 }}>{value}</div>
      </div>
    </div>
  </Card>
);

const SmallKV = ({ label, value }) => (
  <div style={{ padding: 14, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10 }}>
    <div style={{ fontSize: 11, color: "var(--muted)" }}>{label}</div>
    <div className="num" style={{ fontSize: 16, fontWeight: 600, marginTop: 4 }}>{value}</div>
  </div>
);

function LPWireInstructions() {
  return (
    <div className="fade-up" style={{ padding: "32px 40px 48px", maxWidth: 1360, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
        <h1 style={{ margin: 0, fontSize: 28, fontWeight: 600, letterSpacing: -0.5 }}>Wire Instructions</h1>
        <button style={{ ...btnPrimary, padding: "8px 18px" }}>Save</button>
      </div>

      <div style={{
        background: "rgba(66,165,245,0.08)",
        border: "1px solid rgba(66,165,245,0.2)",
        borderRadius: 10, padding: 16, marginBottom: 28,
        color: "var(--fg-2)", fontSize: 12.5, lineHeight: 1.55,
        position: "relative",
      }}>
        The bank details you provide below will be securely saved as your designated transfer destination for future exits or dispute resolutions. Please ensure that all information is accurate and up-to-date. These instructions will serve as the official point of contact for transferring funds when required. If any changes occur, notify our support team immediately to update your records.
        <Icon name="x" size={12} color="var(--muted)" style={{ position: "absolute", top: 12, right: 12, cursor: "pointer" }} />
      </div>

      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--accent)", marginBottom: 14 }}>
        <Icon name="users" size={11} color="var(--accent)" /> Personal Details
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 22 }}>
        <FormField label="Date of Birth"><VcfoDateInput /></FormField>
        <FormField label="Advisor"><input style={apiInputStyle} /></FormField>
        <FormField label="Gender"><SoftSelect width="100%" value="" options={["Male","Female","Other","Prefer not to say"]} /></FormField>
        <FormField label="Ethnicity"><SoftSelect width="100%" value="" options={["—"]} /></FormField>
      </div>

      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--accent)", marginBottom: 14 }}>
        <Icon name="phone" size={11} color="var(--accent)" /> Personal contact Details
      </div>
      <FormField label="Phone Number"><input style={apiInputStyle} /></FormField>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 14 }}>
        <FormField label="Country"><input style={apiInputStyle} /></FormField>
        <FormField label="State"><input style={apiInputStyle} /></FormField>
        <FormField label="City"><input style={apiInputStyle} /></FormField>
        <FormField label="Zip code"><input style={apiInputStyle} /></FormField>
      </div>
      <FormField label="Street" style={{ marginTop: 14 }}><input style={apiInputStyle} /></FormField>
      <FormField label="Street address (Additional details)" style={{ marginTop: 14 }}><input style={apiInputStyle} /></FormField>

      <div style={{ fontSize: 13, fontWeight: 500, color: "var(--accent)", marginTop: 32, marginBottom: 14 }}>
        <Icon name="vault" size={11} color="var(--accent)" /> Bank Details and wire instructions
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <FormField label="Account Holder Name"><input style={apiInputStyle} /></FormField>
        <FormField label="Bank Name"><input style={apiInputStyle} /></FormField>
        <FormField label="Account Number"><input style={apiInputStyle} /></FormField>
        <FormField label="ABA / Routing"><input style={apiInputStyle} /></FormField>
        <FormField label="SWIFT / BIC"><input style={apiInputStyle} /></FormField>
        <FormField label="IBAN"><input style={apiInputStyle} /></FormField>
      </div>
    </div>
  );
}

const FormField = ({ label, children, style }) => (
  <div style={style}>
    <div style={{ fontSize: 12, color: "var(--accent)", marginBottom: 6, fontWeight: 500 }}>{label}</div>
    {children}
  </div>
);

const VcfoDateInput = () => (
  <button style={{ ...apiInputStyle, textAlign: "left", display: "flex", alignItems: "center", gap: 8, color: "var(--muted)", cursor: "pointer" }}>
    <Icon name="calendar" size={12} color="var(--muted)" />
    Select a date
  </button>
);

// ════════════════════════════════════════════════════════════════════════
// Shared styles (lightweight, tucked at the bottom)
// ════════════════════════════════════════════════════════════════════════
const lblStyle = { fontSize: 10.5, color: "var(--muted-2)", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 6, fontWeight: 500 };
const apiInputStyle = {
  width: "100%", height: 38, padding: "0 12px",
  background: "var(--surface)", border: "1px solid var(--border-strong)",
  borderRadius: 8, color: "var(--fg)", fontSize: 13, fontFamily: "inherit", outline: "none",
};
const btnGhost = {
  display: "inline-flex", alignItems: "center", gap: 6,
  height: 32, padding: "0 12px",
  background: "var(--surface)", border: "1px solid var(--border)",
  borderRadius: 7, color: "var(--fg-2)", fontSize: 12, fontWeight: 500,
  cursor: "pointer", fontFamily: "inherit",
};
const btnPrimary = {
  display: "inline-flex", alignItems: "center", gap: 6,
  height: 34, padding: "0 14px",
  background: "var(--accent)", border: "none",
  borderRadius: 7, color: "#fff", fontSize: 12.5, fontWeight: 500,
  cursor: "pointer", fontFamily: "inherit",
};

// ────────────── Soft Select ──────────────
function SoftSelect({ value, options, width = 200 }) {
  const [open, setOpen] = useStateV(false);
  const [val, setVal] = useStateV(value);
  const ref = React.useRef(null);
  useEffectV(() => {
    const onDoc = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", width }}>
      <button onClick={() => setOpen(v=>!v)} style={{
        width: "100%", height: 36, padding: "0 12px",
        background: "var(--surface)", border: "1px solid var(--border-strong)",
        borderRadius: 8, color: val ? "var(--fg)" : "var(--muted-2)",
        fontSize: 13, fontFamily: "inherit", cursor: "pointer", textAlign: "left",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{val || "Select..."}</span>
        <Icon name="chevronD" size={11} color="var(--muted-2)" />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          background: "var(--elevated)", border: "1px solid var(--border-strong)",
          borderRadius: 8, padding: 4, zIndex: 30,
          boxShadow: "var(--shadow-pop-soft)",
        }}>
          {options.map(o => (
            <button key={o} onClick={() => { setVal(o); setOpen(false); }} style={{
              display: "block", width: "100%", padding: "7px 10px",
              background: "transparent", border: "none", textAlign: "left",
              color: "var(--fg-2)", fontSize: 12.5, fontFamily: "inherit",
              borderRadius: 6, cursor: "pointer",
            }}
              onMouseEnter={e => e.currentTarget.style.background = "var(--surface-2)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >{o}</button>
          ))}
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// ────────────── VCFO Documents table with column manager ──────────────
const VCFO_DOC_COLS = [
  { key: "documents", label: "Documents" },
  { key: "view", label: "View" },
  { key: "info", label: "Info" },
  { key: "files", label: "Files" },
  { key: "folders", label: "Folders" },
  { key: "more", label: "More" },
  { key: "modified", label: "Last Modified" },
  { key: "chat", label: "Chat" },
  { key: "reclassify", label: "Reclassify" },
  { key: "rerun", label: "Re-Run for Corrections" },
];

function VCFODocsTable({ folders }) {
  const [colState, setColState] = useStateV({
    order: VCFO_DOC_COLS.map(c => c.key),
    visible: Object.fromEntries(VCFO_DOC_COLS.map(c => [c.key, true])),
  });
  const [sort, setSort] = useStateV({ key: null, dir: null });
  const visKeys = colState.order.filter(k => colState.visible[k]);
  const colMap = Object.fromEntries(VCFO_DOC_COLS.map(c => [c.key, c]));

  const getCellValue = (k, f) => {
    if (k === "documents") return f.name;
    if (k === "files") return f.files;
    if (k === "folders") return f.folders;
    if (k === "modified") return f.modified;
    return "";
  };

  const renderCell = (k, f) => {
    if (k === "documents") return <><Icon name="folder" size={12} color="var(--accent)" /> {f.name}</>;
    if (k === "files") return f.files;
    if (k === "folders") return f.folders;
    if (k === "more") return <Icon name="more" size={13} color="var(--muted)" />;
    if (k === "modified") return f.modified;
    return "—";
  };

  const sortedFolders = sortRows(folders, sort, getCellValue);

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <span style={{ fontSize: 12.5, color: "var(--fg-2)" }}><Icon name="folder" size={12} /> All documents</span>
        <ColumnsMenu
          columns={VCFO_DOC_COLS}
          order={colState.order}
          visible={colState.visible}
          onChange={(next) => setColState(s => ({ ...s, ...next }))}
        />
      </div>
      <Card padded style={{ padding: 0, overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: "var(--surface)", color: "var(--muted)" }}>
              {visKeys.map(k => {
                const right = k === "files" || k === "folders";
                return (
                  <th key={k} style={{ padding: "10px 14px", textAlign: right ? "right" : "left", fontWeight: 500, fontSize: 11.5, letterSpacing: 0.2 }}>
                    <SortHeader
                      align={right ? "right" : "left"}
                      dir={sort.key === k ? sort.dir : null}
                      onClick={() => setSort(s => cycleSort(s, k))}
                    >
                      {colMap[k].label}
                    </SortHeader>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedFolders.map(f => (
              <tr key={f.name} style={{ borderTop: "1px solid var(--border)" }}>
                {visKeys.map(k => (
                  <Td key={k} right={k === "files" || k === "folders"}>{renderCell(k, f)}</Td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </>
  );
}

Object.assign(window, {
  VCFOShell, LPShell,
  // helpers consumed by investments_tabs.jsx (each <script type="text/babel"> has its own scope)
  SoftSelect, RefreshIcon, FUNDS_LIST,
  lblStyle, btnGhost, btnPrimary, apiInputStyle, statusPill,
});
