// Sub-tab content for the VCFO → Funds page

const { useState: useStateFT, useEffect: useEffectFT, useRef: useRefFT } = React;

// ────────────── Create Fund Modal ──────────────
function CreateFundModal({ onCancel, onCreate }) {
  const [name, setName] = useStateFT("");
  const [size, setSize] = useStateFT("");
  const [firstClose, setFirstClose] = useStateFT("");
  const [finalClose, setFinalClose] = useStateFT("");
  const canSave = name.trim().length > 0 && size.trim().length > 0;
  const submit = () => {
    if (!canSave) return;
    const cleanSize = Number(String(size).replace(/[^0-9.]/g, "")) || 0;
    onCreate({
      id: "ft-" + Date.now().toString(36),
      name: name.trim(),
      size: cleanSize,
      vintage: firstClose ? new Date(firstClose).getFullYear() : new Date().getFullYear(),
      firstClose, finalClose,
      invested: 0, realized: 0, fair: 0, total: 0, moic: 0, investments: 0, deals: 0,
      isCustom: true,
    });
  };
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 80,
      background: "rgba(15, 23, 42, 0.45)", backdropFilter: "blur(2px)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }} onClick={onCancel}>
      <div onClick={e => e.stopPropagation()} className="fade-up" style={{
        width: 460,
        background: "var(--elevated)",
        border: "1px solid var(--border-strong)",
        borderRadius: 12,
        boxShadow: "0 30px 60px rgba(0,0,0,0.18)",
        padding: 24,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: -0.2 }}>Create New Fund</div>
          <button onClick={onCancel} style={{ background: "transparent", border: "none", cursor: "pointer", color: "var(--muted)", padding: 4, display: "inline-flex" }}>
            <Icon name="close" size={14} />
          </button>
        </div>

        <FtFormRow label="Fund Name" required>
          <input autoFocus value={name} onChange={e => setName(e.target.value)}
            placeholder="Enter fund name"
            onKeyDown={e => { if (e.key === "Enter" && canSave) submit(); if (e.key === "Escape") onCancel(); }}
            style={{ ...apiInputStyle, height: 38 }} />
        </FtFormRow>

        <FtFormRow label="Fund Size" required>
          <div style={{ position: "relative" }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--muted-2)", fontSize: 13 }}>$</span>
            <input value={size} onChange={e => setSize(e.target.value)}
              placeholder="0" inputMode="decimal"
              onKeyDown={e => { if (e.key === "Enter" && canSave) submit(); if (e.key === "Escape") onCancel(); }}
              style={{ ...apiInputStyle, height: 38, paddingLeft: 26 }} />
          </div>
        </FtFormRow>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 6 }}>
          <FtFormRow label="First Close" tight>
            <FtDateInput value={firstClose} onChange={setFirstClose} />
          </FtFormRow>
          <FtFormRow label="Final Close" tight>
            <FtDateInput value={finalClose} onChange={setFinalClose} />
          </FtFormRow>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 22 }}>
          <button onClick={onCancel} style={{ ...btnGhost, padding: "8px 16px" }}>Cancel</button>
          <button onClick={submit} disabled={!canSave} style={{
            ...btnPrimary, padding: "8px 16px",
            background: canSave ? "var(--accent)" : "var(--surface-2)",
            color: canSave ? "#fff" : "var(--muted-2)",
            cursor: canSave ? "pointer" : "not-allowed",
            border: canSave ? "none" : "1px solid var(--border)",
          }}>
            <Icon name="plus" size={11} color={canSave ? "#fff" : "var(--muted-2)"} /> Create Fund
          </button>
        </div>
      </div>
    </div>
  );
}

const FtFormRow = ({ label, required, tight, children }) => (
  <div style={{ marginBottom: tight ? 0 : 14 }}>
    <div style={{ fontSize: 11.5, color: "var(--fg-2)", fontWeight: 500, marginBottom: 6 }}>
      {label}{required && <span style={{ color: "#DC2626", marginLeft: 3 }}>*</span>}
    </div>
    {children}
  </div>
);

const FtDateInput = ({ value, onChange }) => (
  <div style={{ position: "relative" }}>
    <Icon name="calendar" size={11} color="var(--muted-2)" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }} />
    <input type="date" value={value || ""} onChange={e => onChange(e.target.value)}
      style={{ ...apiInputStyle, height: 38, paddingLeft: 30, color: value ? "var(--fg)" : "var(--muted-2)", fontFamily: "inherit" }} />
  </div>
);

// ────────────── Funds list (tab 1) ──────────────
function FTFundsList() {
  const [customFunds, setCustomFunds] = useStateFT(() => {
    try { return JSON.parse(localStorage.getItem("zive.vcfo.customFunds") || "[]"); } catch { return []; }
  });
  const [showCreate, setShowCreate] = useStateFT(false);
  useEffectFT(() => {
    try { localStorage.setItem("zive.vcfo.customFunds", JSON.stringify(customFunds)); } catch {}
  }, [customFunds]);

  const allFunds = [...customFunds, ...FUNDS_LIST];

  return (
    <div className="fade-up" style={{ padding: "26px 40px 48px", maxWidth: 1440, margin: "0 auto" }}>
      <Card padded style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 22px", borderBottom: "1px solid var(--border)" }}>
          <button style={btnGhost}><RefreshIcon size={11} /> Sync All Widgets</button>
          <button style={{ ...btnPrimary, padding: "8px 16px" }} onClick={() => setShowCreate(true)}>
            <Icon name="plus" size={11} color="#fff" /> Add Fund
          </button>
        </div>
        <FundsTableLocal funds={allFunds} />
      </Card>
      {showCreate && (
        <CreateFundModal
          onCancel={() => setShowCreate(false)}
          onCreate={(f) => { setCustomFunds(c => [{ ...f, vintage: f.vintage || "—" }, ...c]); setShowCreate(false); }}
        />
      )}
    </div>
  );
}

function FundsTableLocal({ funds }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr style={{ background: "var(--accent-tint-2)", color: "var(--muted)" }}>
            <th style={ftTh}>Fund Name</th>
            <th style={ftTh}>Vintage Year</th>
            <th style={{ ...ftTh, textAlign: "right" }}>Invested Capital</th>
            <th style={{ ...ftTh, textAlign: "right" }}>Realized Proceeds</th>
            <th style={{ ...ftTh, textAlign: "right" }}>Fair Value</th>
            <th style={{ ...ftTh, textAlign: "right" }}>Total Value</th>
            <th style={{ ...ftTh, textAlign: "right" }}>Gross MOIC</th>
            <th style={{ ...ftTh, textAlign: "right" }}>Investments</th>
            <th style={{ ...ftTh, textAlign: "right" }}>Deals</th>
            <th style={ftTh}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {funds.map((f, i) => (
            <tr key={f.id} style={{
              borderTop: "1px solid var(--border)",
              background: f.isCustom ? "var(--surface)" : (i % 2 === 1 ? "rgba(16,185,129,0.05)" : "transparent"),
            }}>
              <td style={ftTd}><a href="#" style={{ color: "var(--accent)", fontWeight: 500, textDecoration: "underline dotted var(--border-strong)", textUnderlineOffset: 3 }}>{f.name}</a></td>
              <td style={ftTd}>{f.vintage || "—"}</td>
              <td className="num" style={{ ...ftTd, textAlign: "right" }}>{f.invested ? <a href="#" style={ftLink}>${f.invested.toLocaleString()}</a> : "—"}</td>
              <td className="num" style={{ ...ftTd, textAlign: "right" }}>{f.realized ? <a href="#" style={ftLink}>${f.realized.toLocaleString()}</a> : "—"}</td>
              <td className="num" style={{ ...ftTd, textAlign: "right" }}>{f.fair ? <a href="#" style={ftLink}>${f.fair.toLocaleString()}</a> : "—"}</td>
              <td className="num" style={{ ...ftTd, textAlign: "right" }}>{f.total ? <a href="#" style={ftLink}>${f.total.toLocaleString()}</a> : "—"}</td>
              <td className="num" style={{ ...ftTd, textAlign: "right" }}>{f.moic ? <a href="#" style={ftLink}>{f.moic.toFixed(2)}x</a> : "—"}</td>
              <td className="num" style={{ ...ftTd, textAlign: "right" }}>{f.investments || 0}</td>
              <td className="num" style={{ ...ftTd, textAlign: "right" }}>{f.deals ? <a href="#" style={ftLink}>{f.deals}</a> : <a href="#" style={ftLink}>0</a>}</td>
              <td style={ftTd}><button style={ftMoreBtn}><Icon name="moreV" size={12} color="var(--muted)" /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 22px", color: "var(--muted-2)", fontSize: 11.5, borderTop: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="chevronL" size={11} /> Page <span style={{ padding: "2px 8px", border: "1px solid var(--border)", borderRadius: 4, color: "var(--fg-2)" }}>1</span> of 1 <Icon name="chevronR" size={11} />
        </div>
        <div>1 - {funds.length} of {funds.length} · Rows 100</div>
      </div>
    </div>
  );
}

// ────────────── Action items row ──────────────
const ActionItems = ({ items }) => (
  <div>
    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Action Items</div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
      {items.map(it => (
        <div key={it.label} style={{
          padding: "16px 18px", borderRadius: 10,
          background: it.bg, border: `1px solid ${it.ring}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: it.color }}>{it.label}</div>
            {it.sub && <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 4 }}>{it.sub}</div>}
          </div>
          <div style={{
            minWidth: 24, height: 24, borderRadius: "50%",
            background: it.color, color: "#fff",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            fontSize: 11, fontWeight: 600, padding: "0 8px",
          }}>{it.count}</div>
        </div>
      ))}
    </div>
  </div>
);

const ACTION_DEFAULTS = [
  { label: "Urgent",   count: 0, color: "#DC2626", bg: "rgba(239,68,68,0.06)",  ring: "rgba(239,68,68,0.18)" },
  { label: "Priority", count: 0, color: "#D97706", bg: "rgba(245,158,11,0.07)", ring: "rgba(245,158,11,0.22)" },
  { label: "Open Issue", count: 0, color: "#2563EB", bg: "rgba(37,99,235,0.06)", ring: "rgba(37,99,235,0.18)" },
  { label: "Up to Date", count: 0, color: "#16A34A", bg: "rgba(34,197,94,0.07)", ring: "rgba(34,197,94,0.18)" },
];

// ────────────── Fund Capital Call Management (tab 2) ──────────────
function FTCapitalCall({ initialActiveTab } = {}) {
  const [activeTab, setActiveTab] = useStateFT(initialActiveTab || "active");
  return (
    <div className="fade-up" style={{ padding: "26px 40px 48px", maxWidth: 1440, margin: "0 auto" }}>
      <div style={{ display: "flex", gap: 24, alignItems: "flex-end", marginBottom: 22, flexWrap: "wrap" }}>
        <div>
          <div style={lblStyle}>FUND NAME</div>
          <SoftSelect width={220} value="Admin Ventures V" options={FUNDS_LIST.map(f => f.name)} />
        </div>
        <div style={{ flex: 1, minWidth: 240 }}>
          <div style={lblStyle}>SEARCH</div>
          <div style={{ position: "relative" }}>
            <Icon name="search" size={11} color="var(--muted-2)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input placeholder="Search capital calls..." style={{ ...apiInputStyle, paddingLeft: 32 }} />
          </div>
        </div>
        <button style={{ ...btnGhost, padding: "8px 14px" }}><Icon name="download" size={11} /> Export Excel</button>
      </div>

      <ActionItems items={[
        { ...ACTION_DEFAULTS[0], sub: "No urgent items" },
        { ...ACTION_DEFAULTS[1], sub: "No priority items" },
        { ...ACTION_DEFAULTS[2], sub: "No open issues" },
        { ...ACTION_DEFAULTS[3], count: 1, sub: "No pending actions - ready to create new capital calls" },
      ]} />

      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Capital Call Management Overview - Admin Ventures V</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        <FTBigStat icon="phone" iconBg="rgba(124,58,237,0.12)" iconColor="#7C3AED" label="Active Capital Calls" value="0" />
        <FTBigStat icon="dollar" iconBg="rgba(34,197,94,0.12)" iconColor="#22C55E" label="Total Amount Called" value="$0.0M" />
        <FTBigStat icon="trendUp" iconBg="rgba(239,68,68,0.10)" iconColor="#DC2626" label="Current Shortfall" value="0.0%" />
        <FTBigStat icon="bank" iconBg="rgba(20,184,166,0.12)" iconColor="#0EA5E9" label="Cash Balance" value="$-2,686,465" />
      </div>

      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Capital Calls</div>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[["active", "Active (0)"], ["pending", "Pending (0)"]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            padding: "8px 16px", borderRadius: 7,
            background: activeTab === id ? "var(--accent)" : "var(--surface)",
            color: activeTab === id ? "#fff" : "var(--muted)",
            border: activeTab === id ? "none" : "1px solid var(--border)",
            fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}>{label}</button>
        ))}
      </div>

      <Card padded style={{ padding: 0, overflow: "hidden", marginBottom: 22 }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
          <thead>
            <tr style={{ background: "var(--accent-tint-2)", color: "var(--muted)" }}>
              <th style={ftTh}>Capital Name</th>
              <th style={ftTh}>Status</th>
              <th style={{ ...ftTh, textAlign: "right" }}>Capital Called</th>
              <th style={{ ...ftTh, textAlign: "right" }}>Received Capital</th>
              <th style={{ ...ftTh, textAlign: "right" }}>Pending Capital</th>
              <th style={ftTh}>Contribution</th>
              <th style={ftTh}>Due Date</th>
              <th style={ftTh}>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={8} style={{ padding: "44px 22px", textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>No Capital Calls Found</div>
                <div style={{ fontSize: 11.5, color: "var(--muted-2)" }}>Create a new capital call to get started.</div>
              </td>
            </tr>
          </tbody>
        </table>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 22px", borderTop: "1px solid var(--border)", fontSize: 11.5, color: "var(--muted-2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Icon name="chevronL" size={11} /> Page <span style={{ padding: "2px 8px", border: "1px solid var(--border)", borderRadius: 4, color: "var(--fg-2)" }}>1</span> of 0 <Icon name="chevronR" size={11} />
          </div>
          <div>1 - 0 of 0 · Rows 10</div>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card padded style={{ padding: 22 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Capital Call Details - Admin Ventures V</div>
          <FTLabeledField label="Notice Date"><FtDateInput value="2025-01-15" onChange={()=>{}} /></FTLabeledField>
          <FTLabeledField label="Anticipated Due Date"><FtDateInput value="2025-02-15" onChange={()=>{}} /></FTLabeledField>
          <FTLabeledField label="Capital Call #"><input defaultValue="CC-001" style={apiInputStyle} /></FTLabeledField>
          <FTLabeledField label="Current Cash Balance"><input defaultValue="-2,686,464.69" style={apiInputStyle} /></FTLabeledField>
          <FTLabeledField label="Bank Account"><SoftSelect width={"100%"} value="JPMorgan Chase Bank, N.A. (****9012)" options={["JPMorgan Chase Bank, N.A. (****9012)"]} /></FTLabeledField>
          <FTLabeledField label="Notes">
            <textarea placeholder="Add any additional notes for the capital call..." style={{ ...apiInputStyle, height: 70, padding: "10px 12px", resize: "vertical", fontFamily: "inherit" }} />
          </FTLabeledField>
        </Card>

        <Card padded style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Expected Financings &amp; Buffer</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)", fontWeight: 500 }}>Expected Financings</div>
            <button style={{ ...btnPrimary, padding: "6px 14px" }}><Icon name="plus" size={10} color="#fff" /> Add</button>
          </div>
          {[
            ["InfraLoop, Inc.",    "60,000,000", "Completed"],
            ["NovaCore Systems",   "0",          "Completed"],
            ["MicroEdge Partners", "0",          "Completed"],
            ["CloudB Capital",     "0",          "Completed"],
            ["OctaThink Solutions","0",          "Completed"],
            ["Quantum Inc.",       "60,000,000", "Completed"],
            ["7Labs AI",           "0",          "Completed"],
          ].map(([co, amt, st]) => (
            <div key={co} style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 32px", gap: 8, marginBottom: 8 }}>
              <input defaultValue={co} style={{ ...apiInputStyle, height: 34, fontSize: 12 }} />
              <input defaultValue={amt} style={{ ...apiInputStyle, height: 34, fontSize: 12, textAlign: "right" }} />
              <SoftSelect width={"100%"} value={st} options={["Completed","Pending","Cancelled"]} />
              <button style={{ ...ftMoreBtn, width: 34, height: 34 }}><Icon name="close" size={11} color="var(--muted)" /></button>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 32px", gap: 8 }}>
            <input placeholder="Company name" style={{ ...apiInputStyle, height: 34, fontSize: 12 }} />
            <input defaultValue="0" style={{ ...apiInputStyle, height: 34, fontSize: 12, textAlign: "right" }} />
            <SoftSelect width={"100%"} value="Status" options={["Status","Completed","Pending"]} />
            <button style={{ ...ftMoreBtn, width: 34, height: 34 }}><Icon name="close" size={11} color="var(--muted)" /></button>
          </div>

          <div style={{ marginTop: 20, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)", fontWeight: 500, marginBottom: 10 }}>Buffer Calculation</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
              <FTLabeledField label="Buffer Type" tight><SoftSelect width={"100%"} value="Percent" options={["Percent","Fixed"]} /></FTLabeledField>
              <FTLabeledField label="Buffer Value" tight><input defaultValue="15" style={apiInputStyle} /></FTLabeledField>
              <FTLabeledField label="Calculated Buffer" tight><input defaultValue="$18,000,000.00" style={apiInputStyle} /></FTLabeledField>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

const FTLabeledField = ({ label, children, tight }) => (
  <div style={{ marginBottom: tight ? 0 : 14 }}>
    <div style={{ fontSize: 11.5, color: "var(--fg-2)", fontWeight: 500, marginBottom: 6 }}>{label}</div>
    {children}
  </div>
);

const FTBigStat = ({ label, value, icon, iconBg, iconColor }) => (
  <Card padded style={{ padding: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: iconBg, color: iconColor,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={icon} size={14} color={iconColor} />
      </div>
    </div>
    <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 12 }}>{label}</div>
    <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 4, letterSpacing: -0.3 }}>{value}</div>
  </Card>
);

// ────────────── Fund Pacing (tab 3) ──────────────
function FTFundPacing() {
  const sectors = ["Adtech","Advanced manufacturing","Agtech","Artificial intelligence and machine learning","Audiotech","Augmented reality","Autonomous cars","B2B payments","Beauty","Big Data"];
  return (
    <div className="fade-up" style={{ padding: "26px 40px 48px", maxWidth: 1440, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <div style={lblStyle}>FUND NAME</div>
        <SoftSelect width={220} value="Admin Ventures V" options={FUNDS_LIST.map(f => f.name)} />
      </div>

      <ActionItems items={ACTION_DEFAULTS} />

      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Fund Pacing Overview - Admin Ventures V</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        <FTBigStat icon="dollar"  iconBg="rgba(34,197,94,0.10)"  iconColor="#16A34A" label="Available to Deploy" value="$0" />
        <FTBigStat icon="trendUp" iconBg="rgba(245,158,11,0.12)" iconColor="#F59E0B" label="Deployed to Date" value="$0" />
        <FTBigStat icon="chart"   iconBg="rgba(239,68,68,0.10)"  iconColor="#DC2626" label="Deployment Rate"  value="0%" />
        <FTBigStat icon="briefcase" iconBg="rgba(124,58,237,0.12)" iconColor="#7C3AED" label="Avg Deal Size"  value="$0" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 18 }}>
        <Card padded style={{ padding: 22 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Fund Structure</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ color: "var(--muted)" }}>
                <th style={{ ...ftTh, paddingLeft: 0 }}>Item</th>
                <th style={{ ...ftTh, textAlign: "right" }}>Projected</th>
                <th style={{ ...ftTh, textAlign: "right" }}>Actual</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Fund Size", "0", "$0.00"],
                ["Less: Management Fees", "0", "$0.00"],
                ["Less: Expenses", "0", "$0.00"],
                ["Total = Investable Funds", "0", "$0.00", true],
                ["Plus: Recycling Target", "0", "$0.00"],
                ["Total = Available to Deploy", "0", "$0.00", true],
                ["Less: Scout Investments", "0", "$0.00"],
                ["Less: Small Passive Investments", "0", "$0.00"],
                ["Remaining Active Investments", "0", "$0.00", true],
              ].map(([k, p, a, em]) => (
                <tr key={k} style={{ borderTop: "1px solid var(--border)", background: em ? "rgba(124,58,237,0.06)" : "transparent" }}>
                  <td style={{ ...ftTd, paddingLeft: 0, fontWeight: em ? 600 : 400 }}>{k}</td>
                  <td style={{ ...ftTd, textAlign: "right" }}>
                    <input defaultValue={p} style={{ ...apiInputStyle, height: 28, width: 110, padding: "0 8px", textAlign: "right", fontSize: 11.5 }} />
                  </td>
                  <td className="num" style={{ ...ftTd, textAlign: "right" }}>{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card padded style={{ padding: 22 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Deployment Metrics</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>Overall Metrics</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 100px", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)" }}>Number of Projects To Date</div>
            <div><div style={{ fontSize: 10, color: "var(--muted)" }}>Projected</div><input defaultValue="0" style={{ ...apiInputStyle, height: 32 }} /></div>
            <div><div style={{ fontSize: 10, color: "var(--muted)" }}>Actual</div><div className="num" style={{ fontSize: 13, padding: "8px 0" }}>0</div></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 100px", gap: 12, alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)" }}>Average Ownership %</div>
            <div><div style={{ fontSize: 10, color: "var(--muted)" }}>Projected %</div><input defaultValue="0" style={{ ...apiInputStyle, height: 32 }} /></div>
            <div><div style={{ fontSize: 10, color: "var(--muted)" }}>Actual %</div><div className="num" style={{ fontSize: 13, padding: "8px 0" }}>0.0%</div></div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 140px 100px", gap: 12, alignItems: "center", padding: "8px 0" }}>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)" }}>Average Deal Size</div>
            <div><div style={{ fontSize: 10, color: "var(--muted)" }}>Projected ($)</div><input defaultValue="0" style={{ ...apiInputStyle, height: 32 }} /></div>
            <div><div style={{ fontSize: 10, color: "var(--muted)" }}>Actual ($)</div><div className="num" style={{ fontSize: 13, padding: "8px 0" }}>$0.00</div></div>
          </div>

          <div style={{ marginTop: 18 }}>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8 }}>Sector Breakdown</div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                <thead>
                  <tr style={{ background: "var(--accent-tint-2)", color: "var(--muted)" }}>
                    <th style={{ ...ftTh, padding: "8px 10px" }}>Sector</th>
                    <th style={{ ...ftTh, padding: "8px 10px", textAlign: "center" }} colSpan={2}>Number of Deals<br /><span style={{ fontSize: 9, fontWeight: 400 }}>Projected / Actual</span></th>
                    <th style={{ ...ftTh, padding: "8px 10px", textAlign: "center" }} colSpan={2}>Avg Deal Size<br /><span style={{ fontSize: 9, fontWeight: 400 }}>Projected / Actual</span></th>
                    <th style={{ ...ftTh, padding: "8px 10px", textAlign: "center" }} colSpan={2}>Avg Ownership %<br /><span style={{ fontSize: 9, fontWeight: 400 }}>Projected / Actual</span></th>
                  </tr>
                </thead>
                <tbody>
                  {sectors.map((s, i) => (
                    <tr key={s} style={{ background: i % 2 === 0 ? "rgba(66,165,245,0.04)" : "transparent", borderTop: "1px solid var(--border)" }}>
                      <td style={{ ...ftTd, padding: "6px 10px" }}>{s}</td>
                      <td style={{ ...ftTd, padding: "6px 4px", textAlign: "center" }}><input defaultValue="0" style={ftSectorInput} /></td>
                      <td style={{ ...ftTd, padding: "6px 4px", textAlign: "center", color: "var(--muted-2)" }}>/ 0</td>
                      <td style={{ ...ftTd, padding: "6px 4px", textAlign: "center" }}><input defaultValue="0" style={ftSectorInput} /></td>
                      <td style={{ ...ftTd, padding: "6px 4px", textAlign: "center", color: "var(--muted-2)" }}>/ 0</td>
                      <td style={{ ...ftTd, padding: "6px 4px", textAlign: "center" }}><input defaultValue="0" style={ftSectorInput} /></td>
                      <td style={{ ...ftTd, padding: "6px 4px", textAlign: "center", color: "var(--muted-2)" }}>/ 0</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ fontSize: 10.5, color: "var(--muted-2)", textAlign: "right", marginTop: 8 }}>Proj / Act - Projected vs Actual Values</div>
          </div>
        </Card>
      </div>
    </div>
  );
}

const ftSectorInput = { width: 50, height: 26, padding: "0 6px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, fontSize: 11, textAlign: "center", fontFamily: "inherit" };

// ────────────── Fund Recycling (tab 4) ──────────────
function FTFundRecycling() {
  const companies = ["7Labs AI", "Quantum Inc.", "OctaThink Solutions", "CloudB Capital", "MicroEdge Partners", "NovaCore Systems", "InfraLoop, Inc."];
  return (
    <div className="fade-up" style={{ padding: "26px 40px 48px", maxWidth: 1440, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <div style={lblStyle}>FUND NAME</div>
        <SoftSelect width={220} value="Admin Ventures V" options={FUNDS_LIST.map(f => f.name)} />
      </div>

      <ActionItems items={ACTION_DEFAULTS} />

      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Fund Recycling Overview - Admin Ventures V</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        <FTBigStat icon="briefcase" iconBg="rgba(66,165,245,0.12)" iconColor="#42A5F5" label="Total Fund Size" value="$26,193,086" />
        <FTBigStat icon="reimburse" iconBg="rgba(34,197,94,0.12)"  iconColor="#22C55E" label="Recycled to Date" value="$0" />
        <FTBigStat icon="trendUp"   iconBg="rgba(245,158,11,0.12)" iconColor="#F59E0B" label="Available for Recycling" value="$0" />
        <FTBigStat icon="dollar"    iconBg="rgba(124,58,237,0.12)" iconColor="#7C3AED" label="Cash on Hand" value="$0" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
        <Card padded style={{ padding: 22 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
            <Icon name="chart" size={14} color="var(--accent)" /> Fund Actuals
          </div>
          {[
            ["Fund Size", "$26,193,086", "100.0%", true],
            ["Investments: Made", "$5,526,232", "21.1%"],
            ["Investments: Reserved", null, "0.0%"],
            ["Mgmt Fees", "$2,410,985", "9.2%"],
            ["Expenses", "$3,622,779", "13.8%"],
          ].map(([k, v, p, em]) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 70px", gap: 10, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12.5, color: "var(--fg-2)", fontWeight: em ? 600 : 400 }}>{k}</div>
              {v ? <div className="num" style={{ fontSize: 12.5, textAlign: "right" }}>{v}</div> : <input defaultValue="0" style={{ ...apiInputStyle, height: 30, textAlign: "right", fontSize: 11.5 }} />}
              <div className="num" style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "right" }}>{p}</div>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 70px", gap: 10, alignItems: "center", padding: "12px 0", borderTop: "1px solid var(--border-strong)", background: "var(--surface)", marginTop: 4, paddingLeft: 10, paddingRight: 10, borderRadius: 6, fontWeight: 600 }}>
            <div style={{ fontSize: 13 }}>Total Committed</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right" }}>$26,193,086</div>
            <div className="num" style={{ fontSize: 11.5, textAlign: "right" }}>100.0%</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 70px", gap: 10, alignItems: "center", padding: "12px 0" }}>
            <div style={{ fontSize: 12.5, color: "var(--fg-2)", fontWeight: 500 }}>Additional Recycling Needed</div>
            <div className="num" style={{ fontSize: 12.5, textAlign: "right" }}>$0</div>
            <div />
          </div>
          <div style={{ marginTop: 12, padding: 14, background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.20)", borderRadius: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 10, alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: "#16A34A", fontWeight: 500 }}>Recycled to date: Actual</div>
              <input defaultValue="0" style={{ ...apiInputStyle, height: 30, textAlign: "right", fontSize: 11.5 }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 100px", gap: 10, alignItems: "center" }}>
              <div style={{ fontSize: 12, color: "#16A34A", fontWeight: 500 }}>Recycled to date: Excess (Deficit)</div>
              <input defaultValue="0" style={{ ...apiInputStyle, height: 30, textAlign: "right", fontSize: 11.5 }} />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <button style={{ ...btnPrimary, padding: "8px 18px", background: "#0F172A" }}>Save Changes</button>
          </div>
        </Card>

        <Card padded style={{ padding: 22 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
            <Icon name="trendUp" size={14} color="#7C3AED" /> Fund Projections
          </div>
          {["Fund Size","Investments: Made","Investments: Reserved","Mgmt Fees","Expenses"].map((k, i) => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 70px", gap: 10, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{k}</div>
              <input defaultValue="0" style={{ ...apiInputStyle, height: 30, textAlign: "right", fontSize: 11.5 }} />
              <div className="num" style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "right" }}>{i === 0 ? "100%" : "0.0%"}</div>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 70px", gap: 10, alignItems: "center", padding: "12px 10px", marginTop: 4, background: "var(--surface)", borderRadius: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>Total Committed</div>
            <div className="num" style={{ fontSize: 13, textAlign: "right", fontWeight: 600 }}>$0</div>
            <div className="num" style={{ fontSize: 11.5, textAlign: "right", fontWeight: 600 }}>0.0%</div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 14 }}>
            <button style={{ ...btnPrimary, padding: "8px 18px", background: "#0F172A" }}>Save Changes</button>
          </div>
        </Card>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        <Card padded style={{ padding: 22 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, marginBottom: 14 }}>
            <Icon name="dollar" size={14} color="#16A34A" /> Cash Projections
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-2)", marginTop: 6, marginBottom: 6 }}>Cash In</div>
          {["Capital Call","Cash on Hand & Other","Future Capital Call Due/Escrow"].map(k => (
            <div key={k} style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 70px", gap: 10, alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12.5, color: "var(--fg-2)" }}>{k}</div>
              <input defaultValue="0" style={{ ...apiInputStyle, height: 30, textAlign: "right", fontSize: 11.5 }} />
              <div className="num" style={{ fontSize: 11.5, color: "var(--muted)", textAlign: "right" }}>0.0%</div>
            </div>
          ))}
          <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 70px", gap: 10, alignItems: "center", padding: "10px 10px", background: "rgba(34,197,94,0.07)", borderRadius: 6, marginTop: 4 }}>
            <div style={{ fontSize: 12.5, color: "#16A34A", fontWeight: 500 }}>Sub-total</div>
            <div className="num" style={{ fontSize: 12.5, textAlign: "right", fontWeight: 600 }}>$0</div>
            <div className="num" style={{ fontSize: 11.5, textAlign: "right" }}>0.0%</div>
          </div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg-2)", marginTop: 16, marginBottom: 6 }}>Cash Out</div>
        </Card>

        <Card padded style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600, padding: "20px 22px 10px" }}>
            <Icon name="briefcase" size={14} color="#F59E0B" /> Reserves &amp; Pending Deals
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
            <thead>
              <tr style={{ color: "var(--muted)" }}>
                <th style={{ ...ftTh, padding: "8px 18px" }}>Company</th>
                <th style={{ ...ftTh, padding: "8px 18px", textAlign: "center" }}>Gross Reserves</th>
                <th style={{ ...ftTh, padding: "8px 18px", textAlign: "center" }}>Discounted Reserves</th>
              </tr>
            </thead>
            <tbody>
              {companies.map(co => (
                <tr key={co} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ ...ftTd, padding: "10px 18px" }}>{co}</td>
                  <td style={{ ...ftTd, padding: "8px 18px" }}><input defaultValue="0" style={{ ...apiInputStyle, height: 28, textAlign: "right", fontSize: 11.5 }} /></td>
                  <td style={{ ...ftTd, padding: "8px 18px", textAlign: "right" }} className="num">0</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}

// ────────────── Connected Banks (tab 5) ──────────────
function FTConnectedBanks({ initialProvider } = {}) {
  const [provider, setProvider] = useStateFT(initialProvider || "plaid");
  return (
    <div className="fade-up" style={{ padding: "26px 40px 48px", maxWidth: 1440, margin: "0 auto" }}>
      <div style={{ marginBottom: 22 }}>
        <div style={lblStyle}>FUND NAME</div>
        <SoftSelect width={220} value="Admin Ventures V" options={FUNDS_LIST.map(f => f.name)} />
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
        <div style={{ display: "inline-flex", padding: 4, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8 }}>
          {[
            { id: "plaid", label: "Plaid", icon: "link" },
            { id: "mercury", label: "Mercury", icon: "lightning" },
          ].map(p => (
            <button key={p.id} onClick={() => setProvider(p.id)} style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 6,
              background: provider === p.id ? "var(--accent)" : "transparent",
              color: provider === p.id ? "#fff" : "var(--muted)",
              border: "none", fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>
              <Icon name={p.icon} size={11} color={provider === p.id ? "#fff" : "var(--muted)"} /> {p.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 18 }}>
        <FTBigStatPill icon="bank"    iconBg="rgba(66,165,245,0.12)" iconColor="#42A5F5" label="Connected Accounts" value="0" pill="Active" pillBg="rgba(34,197,94,0.15)" pillColor="#16A34A" />
        <FTBigStatPill icon="dollar"  iconBg="rgba(34,197,94,0.12)"  iconColor="#22C55E" label="Total Balance" value="$0.00" pill="Live" pillBg="rgba(66,165,245,0.15)" pillColor="#1E88E5" />
        <FTBigStatPill renderIcon={<RefreshIcon size={13} color="#7C3AED" />} iconBg="rgba(124,58,237,0.12)" label="Last Sync" value="a month ago" pill="Synced" pillBg="rgba(34,197,94,0.15)" pillColor="#16A34A" />
        <FTBigStatPill icon="filter"  iconBg="rgba(245,158,11,0.14)" iconColor="#F59E0B" label="Needs Attention" value="0" pill="Action" pillBg="rgba(245,158,11,0.18)" pillColor="#D97706" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 22 }}>
        <FTIntegrationCard
          icon="link" iconBg="#2563EB" tag="Recommended" tagColor="#2563EB"
          title={provider === "plaid" ? "Connect via Plaid" : "Connect via Mercury"}
          desc={provider === "plaid"
            ? "Securely connect to thousands of banks and financial institutions through Plaid's trusted platform. Instant verification and real-time data sync."
            : "Connect your Mercury banking accounts to sync balances, transactions and treasury data directly into your fund operations."}
          bullets={provider === "plaid"
            ? ["Support for 12,000+ institutions", "Bank-level security encryption", "Instant account verification", "Real-time balance updates", "Automatic transaction categorization"]
            : ["Native Mercury banking integration", "Live balance & treasury sync", "Wire & ACH transfer visibility", "Statement and document import", "Multi-account support"]}
          cta={`Connect with ${provider === "plaid" ? "Plaid" : "Mercury"}`}
        />
        <FTIntegrationCard
          icon="bank" iconBg="#7C3AED" tag="Direct API" tagColor="#7C3AED"
          title="Direct Bank Integration"
          desc="Connect directly to supported banks using their native APIs for enhanced features and deeper integration capabilities."
          bullets={["Enhanced transaction details", "Wire transfer capabilities", "Advanced reporting features", "Custom integrations available", "Priority support channels"]}
          cta="Coming Soon" disabled
        />
      </div>

      <Card padded style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 14, alignItems: "flex-end" }}>
          <div>
            <div style={lblStyle}>STATUS</div>
            <SoftSelect width={"100%"} value="Active" options={["Active","Inactive","All"]} />
          </div>
          <div>
            <div style={lblStyle}>INTEGRATION TYPE</div>
            <SoftSelect width={"100%"} value="Plaid" options={["Plaid","Mercury","Direct"]} />
          </div>
          <div>
            <div style={lblStyle}>SORT BY</div>
            <SoftSelect width={"100%"} value="Last Synced" options={["Last Synced","Name","Balance"]} />
          </div>
          <button style={{ ...btnPrimary, padding: "10px 20px", background: "#0F172A" }}>Sync All</button>
        </div>
      </Card>

      <Card padded style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Connected Accounts</div>
            <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 2 }}>0 active bank connections</div>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              padding: "5px 10px", borderRadius: 6,
              background: "var(--surface)", border: "1px solid var(--border)",
              fontSize: 11, color: "var(--muted-2)",
            }}>
              <Icon name="info" size={10} color="var(--muted-2)" /> Last sync: a month ago
            </div>
            <button style={{ ...btnGhost, padding: "8px 14px" }}><Icon name="download" size={11} /> Export</button>
          </div>
        </div>
        <div style={{ padding: "44px 22px", textAlign: "center", fontSize: 12, color: "var(--muted-2)" }}>
          Showing <strong style={{ color: "var(--fg-2)" }}>0</strong> of <strong style={{ color: "var(--fg-2)" }}>0</strong> connected accounts
        </div>
      </Card>
    </div>
  );
}

const FTBigStatPill = ({ label, value, icon, renderIcon, iconBg, iconColor, pill, pillBg, pillColor }) => (
  <Card padded style={{ padding: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: iconBg,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        {renderIcon || <Icon name={icon} size={14} color={iconColor} />}
      </div>
      <span style={{
        padding: "2px 8px", borderRadius: 999,
        background: pillBg, color: pillColor,
        fontSize: 10.5, fontWeight: 600,
      }}>{pill}</span>
    </div>
    <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 12 }}>{label}</div>
    <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 4, letterSpacing: -0.3 }}>{value}</div>
  </Card>
);

const FTIntegrationCard = ({ icon, iconBg, tag, tagColor, title, desc, bullets, cta, disabled }) => (
  <Card padded style={{ padding: 24 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: iconBg, color: "#fff",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={icon} size={20} color="#fff" />
      </div>
      <span style={{
        padding: "3px 10px", borderRadius: 999,
        background: `${tagColor}1A`, color: tagColor,
        fontSize: 10.5, fontWeight: 600,
      }}>{tag}</span>
    </div>
    <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, letterSpacing: -0.2 }}>{title}</div>
    <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55, marginBottom: 14 }}>{desc}</div>
    <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
      {bullets.map(b => (
        <li key={b} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12, color: "var(--fg-2)" }}>
          <span style={{
            width: 16, height: 16, borderRadius: "50%",
            background: "rgba(34,197,94,0.15)", color: "#16A34A",
            display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1,
          }}><Icon name="check" size={9} color="#16A34A" /></span>
          {b}
        </li>
      ))}
    </ul>
    <button disabled={disabled} style={{
      padding: "10px 18px", borderRadius: 7,
      background: disabled ? "var(--surface-2)" : "#0F172A",
      color: disabled ? "var(--muted-2)" : "#fff",
      border: "none", cursor: disabled ? "not-allowed" : "pointer",
      fontSize: 12, fontWeight: 600, fontFamily: "inherit",
    }}>{cta}</button>
  </Card>
);

// ────────────── Shared styles ──────────────
const ftTh = { padding: "10px 14px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "var(--muted)", letterSpacing: 0.2, whiteSpace: "nowrap" };
const ftTd = { padding: "10px 14px", color: "var(--fg-2)", fontSize: 12, verticalAlign: "middle" };
const ftLink = { color: "var(--accent)", textDecoration: "underline dotted var(--border-strong)", textUnderlineOffset: 3 };
const ftMoreBtn = { width: 26, height: 26, borderRadius: 6, background: "transparent", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "var(--muted)" };

Object.assign(window, {
  FTFundsList, FTCapitalCall, FTFundPacing, FTFundRecycling, FTConnectedBanks,
  CreateFundModal,
});
