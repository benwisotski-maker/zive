// Investments page sub-tabs — content for each pill tab in VCFOInvestments

const { useState: useStateIT } = React;

// Shared companies data (mirror Admin Ventures V)
const IT_COMPANIES = [
  { name: "7Labs AI",              sector: "Artificial intelligence and machine learning", invested: 1276896, realized: 0, fair: 1276896, moic: 1.0, securities: "Series A Preferred", revenue: null, investType: "Active", status: "Active" },
  { name: "Quantum Inc.",          sector: "Artificial intelligence and machine learning", invested: 1740802, realized: 0, fair: 1740802, moic: 1.0, securities: "Series A Preferred", revenue: null, investType: "Active", status: "Active" },
  { name: "OctaThink Solutions",   sector: "Artificial intelligence and machine learning", invested: 1773535, realized: 0, fair: 1773535, moic: 1.0, securities: "Series A Preferred", revenue: null, investType: "Active", status: "Active" },
  { name: "CloudB Capital",        sector: "Artificial intelligence and machine learning", invested: 187500,  realized: 0, fair: 187500,  moic: 1.0, securities: "Series Seed Preferred", revenue: null, investType: "Active", status: "Active" },
  { name: "MicroEdge Partners",    sector: "Agtech",                                       invested: 510000,  realized: 0, fair: 510000,  moic: 1.0, securities: "Series A Preferred", revenue: null, investType: "Active", status: "Active" },
  { name: "NovaCore Systems",      sector: "Artificial intelligence and machine learning", invested: 18750,   realized: 0, fair: 18750,   moic: 1.0, securities: "Series A Preferred", revenue: null, investType: "Active", status: "Active" },
  { name: "InfraLoop, Inc.",       sector: "Agtech",                                       invested: 18750,   realized: 0, fair: 18750,   moic: 1.0, securities: "Series A Preferred", revenue: null, investType: "Active", status: "Active" },
  { name: "Alpha Tech, Inc.",      sector: "Unknown Sector",                               invested: 0,       realized: 0, fair: 0,       moic: 0,   securities: null, revenue: null, investType: "Active", status: "Active" },
  { name: "Attivare Therapeutics, Inc.", sector: "Unknown Sector",                         invested: 0,       realized: 0, fair: 0,       moic: 0,   securities: null, revenue: null, investType: "Active", status: "Active" },
];

const itDollar = (n, opts = {}) => {
  if (n == null) return "—";
  if (n === 0 && !opts.alwaysZero) return "—";
  return "$" + Number(n).toLocaleString();
};

const itInitials = (name) => {
  const parts = name.replace(/[,.]/g, "").split(" ").filter(Boolean);
  return (parts[0]?.[0] || "") + (parts[1]?.[0] || "");
};

// Common header: fund select + upload documents
const ITHeader = ({ onUpload = true }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 40px", borderBottom: "1px solid var(--border)",
  }}>
    <div>
      <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 0.4, marginBottom: 4 }}>Select Fund</div>
      <SoftSelect width={220} value="Admin Ventures V" options={FUNDS_LIST.map(f => f.name)} />
    </div>
    {onUpload && (
      <button style={{ ...btnGhost, padding: "8px 14px" }} onClick={() => window.zivePopup?.openUpload?.()}>
        <Icon name="aiUpload" size={12} /> Upload Documents
      </button>
    )}
  </div>
);

const ITPage = ({ children, header = true, onUpload = true }) => (
  <div className="fade-up">
    {header && <ITHeader onUpload={onUpload} />}
    <div style={{ padding: "26px 40px 48px", maxWidth: 1440, margin: "0 auto" }}>
      {children}
    </div>
  </div>
);

// ────────────── KPI primitives ──────────────
const ITStatCard = ({ label, sub, value, icon, iconBg, iconColor, tone }) => (
  <Card padded style={{ padding: 18 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
      <div>
        <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 500 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>{sub}</div>}
      </div>
      {icon && (
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          background: iconBg || "var(--accent-tint-2)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon name={icon} size={14} color={iconColor || "var(--accent)"} />
        </div>
      )}
    </div>
    <div className="num" style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.3, color: tone || "var(--fg)" }}>{value}</div>
  </Card>
);

// ────────────── TAB 2: Portfolio Companies ──────────────
function ITPortfolioCompanies() {
  return (
    <ITPage>
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 14 }}>Admin Ventures V <span style={{ color: "var(--muted-2)" }}>( 9 companies )</span></div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 14 }}>
        <ITStatCard label="Total Invested" sub="Across 9 companies" value="$5,526,232" icon="dollar" iconBg="rgba(66,165,245,0.12)" iconColor="#42A5F5" />
        <ITStatCard label="Realized Proceeds" sub="Across 9 companies" value="$0" icon="distribution" iconBg="rgba(34,197,94,0.12)" iconColor="#22C55E" />
        <ITStatCard label="Fair Value (FMV)" sub="Across 9 companies" value="$5,526,232" icon="trendUp" iconBg="rgba(245,158,11,0.12)" iconColor="#F59E0B" />
        <ITStatCard label="Total Value" sub="Across 9 companies" value="$5,526,232" icon="trendUp" iconBg="rgba(245,158,11,0.12)" iconColor="#F59E0B" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        <ITStatCard label="Gross MOIC" sub="Weighted average" value="1.00x" icon="trendUp" iconBg="rgba(236,72,153,0.12)" iconColor="#EC4899" />
        <div /><div /><div />
      </div>

      <Card padded style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "16px 22px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Investment Details</div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--accent-tint-2)", color: "var(--muted)" }}>
                <th style={itTh}>Company</th>
                <th style={{ ...itTh, textAlign: "right" }}>Invested Capital</th>
                <th style={{ ...itTh, textAlign: "right" }}>Realized Proceeds</th>
                <th style={{ ...itTh, textAlign: "right" }}>Fair Value</th>
                <th style={{ ...itTh, textAlign: "right" }}>Total Value</th>
                <th style={{ ...itTh, textAlign: "right" }}>Gross MOIC</th>
                <th style={itTh}>My Currently Held Securities</th>
                <th style={{ ...itTh, textAlign: "right" }}>My Investment Amount</th>
                <th style={itTh}>Sector</th>
                <th style={{ ...itTh, textAlign: "right" }}>Revenue</th>
                <th style={{ ...itTh, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {IT_COMPANIES.map((c, i) => (
                <tr key={c.name} style={{ background: i % 2 === 0 ? "rgba(66,165,245,0.04)" : "transparent", borderTop: "1px solid var(--border)" }}>
                  <td style={itTd}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <ITAvatar name={c.name} />
                      <a href="#" style={{ color: "var(--accent)", textDecoration: "underline dotted var(--border-strong)", textUnderlineOffset: 3 }}>{c.name}</a>
                    </div>
                  </td>
                  <td className="num" style={{ ...itTd, textAlign: "right" }}>{c.invested ? "$" + c.invested.toLocaleString() : "—"}</td>
                  <td className="num" style={{ ...itTd, textAlign: "right" }}>{c.realized ? "$" + c.realized.toLocaleString() : "—"}</td>
                  <td className="num" style={{ ...itTd, textAlign: "right" }}>{c.fair ? "$" + c.fair.toLocaleString() : "—"}</td>
                  <td className="num" style={{ ...itTd, textAlign: "right" }}>{c.fair ? "$" + c.fair.toLocaleString() : "—"}</td>
                  <td className="num" style={{ ...itTd, textAlign: "right" }}>{c.moic ? c.moic.toFixed(2) + "x" : "—"}</td>
                  <td style={itTd}>{c.securities || "—"}</td>
                  <td className="num" style={{ ...itTd, textAlign: "right" }}>{c.invested ? "$" + c.invested.toLocaleString() : "—"}</td>
                  <td style={itTd}>{c.sector}</td>
                  <td style={{ ...itTd, textAlign: "right" }}>—</td>
                  <td style={{ ...itTd, textAlign: "right" }}><Icon name="moreV" size={13} color="var(--muted-3)" /></td>
                </tr>
              ))}
              <tr style={{ borderTop: "1px solid var(--border-strong)", background: "var(--surface)" }}>
                <td style={{ ...itTd, fontWeight: 600 }}>Total</td>
                <td className="num" style={{ ...itTd, textAlign: "right", fontWeight: 600 }}>$5,526,232</td>
                <td style={{ ...itTd, textAlign: "right" }}>—</td>
                <td className="num" style={{ ...itTd, textAlign: "right", fontWeight: 600 }}>$5,526,232</td>
                <td className="num" style={{ ...itTd, textAlign: "right", fontWeight: 600 }}>$5,526,232</td>
                <td className="num" style={{ ...itTd, textAlign: "right", fontWeight: 600 }}>1.00x</td>
                <td style={itTd}></td>
                <td style={{ ...itTd, textAlign: "right" }}>—</td>
                <td className="num" style={{ ...itTd, textAlign: "right", fontWeight: 600 }}>$5,526,232</td>
                <td style={{ ...itTd, textAlign: "right" }}>—</td>
                <td style={itTd}></td>
              </tr>
            </tbody>
          </table>
        </div>
        <ITPagination total={10} />
      </Card>
    </ITPage>
  );
}

const ITAvatar = ({ name }) => {
  const palette = ["#7C3AED", "#0EA5E9", "#F97316", "#10B981", "#EC4899", "#F59E0B", "#6366F1"];
  const idx = (name.charCodeAt(0) + name.length) % palette.length;
  return (
    <span style={{
      width: 22, height: 22, borderRadius: "50%",
      background: palette[idx], color: "#fff",
      fontSize: 9, fontWeight: 600,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      letterSpacing: 0.2,
    }}>{itInitials(name).toUpperCase()}</span>
  );
};

const ITPagination = ({ total }) => (
  <div style={{
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "10px 22px", borderTop: "1px solid var(--border)",
    fontSize: 11.5, color: "var(--muted-2)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <Icon name="chevronL" size={11} /> Page <span style={{ padding: "2px 8px", border: "1px solid var(--border)", borderRadius: 4, color: "var(--fg-2)" }}>1</span> of 1 <Icon name="chevronR" size={11} />
    </div>
    <div>1 - {total} of {total} · Rows 100</div>
  </div>
);

// ────────────── TAB 3: Portfolio Request ──────────────
function ITPortfolioRequest() {
  return (
    <ITPage>
      <Card padded style={{ marginBottom: 22, padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Quick Overview - Portfolio Companies Monitoring</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
          <ITKPI label="Total Companies" value="9" />
          <ITKPI label="Avg. Investment Size" value="$614K" />
          <ITKPI label="Active Requests" value="0" />
        </div>
      </Card>

      <Card padded style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "16px 22px", borderBottom: "1px solid var(--border)" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Portfolio Companies Monitoring</div>
            <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 4 }}>Manage portfolio monitoring requests, automation settings, and tracking</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button style={btnGhost}><Icon name="plus" size={11} /> Add Company</button>
            <button style={{ ...btnPrimary, padding: "6px 14px" }}><Icon name="send" size={11} color="#fff" /> Create Request</button>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--accent-tint-2)", color: "var(--muted)" }}>
                <th style={itTh}>Company</th>
                <th style={itTh}>Investment Type</th>
                <th style={itTh}>Method</th>
                <th style={itTh}>Contact</th>
                <th style={{ ...itTh, textAlign: "right" }}>Last Financials</th>
                <th style={{ ...itTh, textAlign: "right" }}>Last Cap Table</th>
                <th style={{ ...itTh, textAlign: "right" }}>Completion</th>
                <th style={{ ...itTh, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {IT_COMPANIES.map((c, i) => (
                <tr key={c.name} style={{ background: i % 2 === 0 ? "rgba(66,165,245,0.04)" : "transparent", borderTop: "1px solid var(--border)" }}>
                  <td style={itTd}>
                    <div style={{ fontWeight: 500, color: "var(--fg)" }}>{c.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 2 }}>{c.sector}</div>
                  </td>
                  <td style={itTd}><span style={{ ...statusPillIT, color: "#16A34A", background: "rgba(34,197,94,0.10)" }}>Active</span></td>
                  <td style={itTd}>—</td>
                  <td style={itTd}></td>
                  <td style={{ ...itTd, textAlign: "right" }}>—</td>
                  <td style={{ ...itTd, textAlign: "right" }}>—</td>
                  <td style={{ ...itTd, textAlign: "right" }}>—</td>
                  <td style={{ ...itTd, textAlign: "right" }}><button style={moreBtnIT}><Icon name="moreV" size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ITPagination total={9} />
      </Card>
    </ITPage>
  );
}

const ITKPI = ({ label, value }) => (
  <Card padded style={{ padding: 16 }}>
    <div style={{ fontSize: 11.5, color: "var(--muted)" }}>{label}</div>
    <div className="num" style={{ fontSize: 22, fontWeight: 600, marginTop: 6, letterSpacing: -0.3 }}>{value}</div>
  </Card>
);

const statusPillIT = {
  display: "inline-flex", alignItems: "center",
  padding: "3px 9px", borderRadius: 4,
  fontSize: 11, fontWeight: 500,
};
const moreBtnIT = {
  width: 26, height: 26, borderRadius: 6,
  background: "transparent", border: "1px solid var(--border)",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  cursor: "pointer", color: "var(--muted)",
};

// ────────────── TAB 4: Financing Docs ──────────────
function ITFinancingDocs() {
  const docs = [
    { co: "7Labs AI",                    types: ["Company Bylaws", "Charter", "Term Sheet", "Investment", "Voting Agreement", "Co-Sale Agreement", "IRA", "Management Rights Letter"], date: "Mar 17, 2026" },
    { co: "Attivare Therapeutics, Inc.", types: ["KPI"], date: "Feb 9, 2026" },
    { co: "Alpha Tech, Inc.",            types: ["KPI"], date: "Feb 9, 2026" },
    { co: "Quantum Inc.",                types: ["None"], date: "—" },
    { co: "OctaThink Solutions",         types: ["None"], date: "—" },
    { co: "CloudB Capital",              types: ["None"], date: "—" },
    { co: "MicroEdge Partners",          types: ["None"], date: "—" },
    { co: "NovaCore Systems",            types: ["None"], date: "—" },
    { co: "InfraLoop, Inc.",             types: ["None"], date: "—" },
  ];
  return (
    <ITPage>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 22 }}>
        <ITStatCard label="Total Companies" sub="Portfolio companies tracked" value="9" icon="building" iconBg="rgba(66,165,245,0.12)" iconColor="#42A5F5" />
        <ITStatCard label="Documents Processed" sub="Total documents ingested" value="10" icon="chart" iconBg="rgba(99,102,241,0.12)" iconColor="#6366F1" />
        <ITStatCard label="In Review / Unclassified" sub="Documents pending review" value="0" icon="quarterly" iconBg="rgba(245,158,11,0.14)" iconColor="#F59E0B" />
        <ITStatCard label="Completion Rate" sub="Processing completion" value="86%" icon="trendUp" iconBg="rgba(16,185,129,0.12)" iconColor="#10B981" />
      </div>

      <Card padded style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 22px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 12.5, color: "var(--fg-2)", display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Icon name="chart" size={12} color="var(--muted)" /> Recent Document Ingestion
          </div>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 5,
            height: 26, padding: "0 10px",
            background: "var(--surface)",
            border: "1px solid var(--border-strong)",
            borderRadius: 6, fontSize: 11.5, color: "var(--fg-2)", cursor: "pointer", fontFamily: "inherit",
          }}><Icon name="sort" size={11} color="var(--muted)" /> Columns</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--accent-tint-2)", color: "var(--muted)" }}>
                <th style={itTh}>Company</th>
                <th style={itTh}>Document Types</th>
                <th style={itTh}>Last Upload</th>
                <th style={{ ...itTh, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d, i) => (
                <tr key={d.co} style={{ background: i % 2 === 0 ? "rgba(66,165,245,0.04)" : "transparent", borderTop: "1px solid var(--border)" }}>
                  <td style={itTd}>{d.co}</td>
                  <td style={itTd}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {d.types.map(t => (
                        <span key={t} style={{
                          padding: "2px 8px", borderRadius: 4,
                          background: "var(--surface-2)", border: "1px solid var(--border)",
                          fontSize: 10.5, color: "var(--muted)",
                        }}>{t}</span>
                      ))}
                    </div>
                  </td>
                  <td style={itTd}>{d.date}</td>
                  <td style={{ ...itTd, textAlign: "right" }}><button style={moreBtnIT}><Icon name="moreV" size={12} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ITPagination total={9} />
      </Card>
    </ITPage>
  );
}

// ────────────── TAB 5: Board Deck Analysis ──────────────
function ITBoardDeck() {
  return (
    <ITPage>
      <Card padded style={{ marginBottom: 18, padding: 22 }}>
        <div style={{ fontSize: 11, color: "var(--muted)", letterSpacing: 0.4, marginBottom: 6 }}>Select Company</div>
        <SoftSelect width={260} value="" options={["Select a company...", ...IT_COMPANIES.map(c => c.name)]} />
      </Card>
      <Card padded style={{ padding: 60, textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12,
          background: "var(--surface-2)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          marginBottom: 14,
        }}>
          <Icon name="file" size={22} color="var(--muted-2)" />
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>Select a Company</div>
        <div style={{ fontSize: 12.5, color: "var(--muted-2)" }}>Choose a company from the dropdown to view board deck analysis</div>
      </Card>
    </ITPage>
  );
}

// ────────────── TAB 6: Legal Analysis ──────────────
function ITLegalAnalysis() {
  const matrix = IT_COMPANIES.filter(c => c.sector !== "Unknown Sector").slice(0, 9).map(c => c.name);
  return (
    <ITPage>
      <Card padded style={{ marginBottom: 18, padding: 22 }}>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Portfolio Overview</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 12 }}>
          <ITStatCard label="Total Companies" value="9" icon="building" iconBg="rgba(66,165,245,0.12)" iconColor="#42A5F5" />
          <ITStatCard label="Documents Processed" value="10" icon="file" iconBg="rgba(99,102,241,0.12)" iconColor="#6366F1" />
          <ITStatCard label="Outstanding Documents" value="0" icon="quarterly" iconBg="rgba(245,158,11,0.14)" iconColor="#F59E0B" />
          <ITStatCard label="Active Pro-Rata Rights" value="0" icon="shieldCheck" iconBg="rgba(124,58,237,0.12)" iconColor="#7C3AED" />
          <ITStatCard label="Terms Coverage" value="0%" icon="checklist" iconBg="rgba(16,185,129,0.12)" iconColor="#10B981" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginTop: 16 }}>
          <Card padded style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Outstanding Documents</div>
              <button style={{ ...btnGhost, padding: "4px 10px", fontSize: 11.5 }}><Icon name="external" size={10} /> View All</button>
            </div>
            <div style={{ padding: "32px 0", textAlign: "center", fontSize: 12, color: "var(--muted-2)" }}>No outstanding documents</div>
          </Card>
          <Card padded style={{ padding: 18 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Upcoming Financing Rights</div>
              <button style={{ ...btnGhost, padding: "4px 10px", fontSize: 11.5 }}><Icon name="calendar" size={10} /> Schedule</button>
            </div>
            <div style={{ padding: "32px 0", textAlign: "center", fontSize: 12, color: "var(--muted-2)" }}>No upcoming financing rights</div>
          </Card>
        </div>
      </Card>

      <Card padded style={{ marginBottom: 18, padding: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 22px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Core Terms Matrix</div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 11.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--fg-2)" }} /> Present
            </span>
            <span style={{ fontSize: 11.5, color: "var(--muted)", display: "inline-flex", alignItems: "center", gap: 5 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--border-strong)" }} /> Absent
            </span>
            <SoftSelect width={160} value="Sort by Company" options={["Sort by Company", "Sort by Coverage"]} />
            <button style={btnGhost}><Icon name="download" size={11} /> Export</button>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--accent-tint-2)", color: "var(--muted)" }}>
                <th style={itTh}>Company</th>
                <th style={itTh}>My Information Rights</th>
                <th style={itTh}>Active Management Rights Letter</th>
                <th style={itTh}>Active Side Letter</th>
                <th style={itTh}>Protective Provisions Section Reference</th>
                <th style={itTh}>Board Of Directors</th>
              </tr>
            </thead>
            <tbody>
              {matrix.map((co, i) => (
                <tr key={co} style={{ background: i % 2 === 0 ? "rgba(66,165,245,0.04)" : "transparent", borderTop: "1px solid var(--border)" }}>
                  <td style={itTd}>{co}</td>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <td key={j} style={{ ...itTd, textAlign: "center" }}>
                      <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--border-strong)", display: "inline-block" }} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18 }}>
        <Card padded style={{ padding: 22 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Portfolio Rights Analysis</div>
          {[
            { h: "Liquidation Preferences", rows: [["1x Non-Participating", 9, 100], ["1.5x+ Participating", 0, 0], ["2x+ Multiple", 0, 0], ["No Preference", 9, 100]] },
            { h: "Anti-Dilution Protection", rows: [["Weighted Average", 0, 0], ["Full Ratchet", 0, 0], ["No Protection", 9, 100]] },
            { h: "Board Representation",    rows: [["Board Seat", 0, 0], ["Observer Rights", 0, 0], ["No Board Rights", 9, 100]] },
            { h: "Transfer Rights",         rows: [["Drag-Along Rights", 0, 0], ["Tag-Along Rights", 0, 0], ["Registration Rights", 0, 0]] },
          ].map(group => (
            <div key={group.h} style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6 }}>{group.h}</div>
              {group.rows.map(([label, n, pct]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px dashed var(--border)", fontSize: 12 }}>
                  <span style={{ color: "var(--fg-2)" }}>{label}</span>
                  <span className="num" style={{ color: "var(--muted)" }}>{n} companies <span style={{ marginLeft: 8, color: "var(--fg-2)", fontWeight: 500 }}>{pct}%</span></span>
                </div>
              ))}
            </div>
          ))}
        </Card>

        <Card padded style={{ padding: 22 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Document Preview</div>
            <SoftSelect width={160} value="Co-Sale Agreement" options={["Co-Sale Agreement", "IRA", "Voting Agreement"]} />
          </div>
          <SoftSelect width={"100%"} value="7Labs AI" options={IT_COMPANIES.map(c => c.name)} />
          <div style={{
            marginTop: 14, padding: 14, borderRadius: 8,
            border: "1px solid var(--border)", background: "var(--surface)",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 12, color: "var(--fg-2)", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <Icon name="file" size={11} color="var(--muted)" />
                7Labs AI - Right of Refusal and Co-Sale Agreement.pdf
              </div>
              <button style={{ ...btnGhost, padding: "4px 8px", fontSize: 11 }}><Icon name="external" size={10} /> View Full Doc</button>
            </div>
            <div style={{
              padding: 12, borderRadius: 6,
              background: "var(--accent-tint-2)",
              fontSize: 11.5, color: "var(--fg-2)",
            }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>Document Summary</div>
              <div style={{ color: "var(--muted)" }}>No summary available.</div>
              <button style={{
                marginTop: 10, padding: "5px 12px",
                background: "var(--fg)", color: "var(--bg)",
                border: "none", borderRadius: 5, cursor: "pointer", fontFamily: "inherit", fontSize: 11.5,
              }}>Summarize</button>
            </div>
            <div style={{ marginTop: 12, fontSize: 11, color: "var(--muted-2)", display: "flex", justifyContent: "space-between" }}>
              <span>Coverage:</span>
              <span style={{ color: "var(--fg-2)" }}>0% <span style={{ color: "var(--neg, #DC2626)", marginLeft: 6 }}>High</span></span>
            </div>
          </div>
        </Card>
      </div>
    </ITPage>
  );
}

// ────────────── TAB 7: Legal Comparison ──────────────
function ITLegalComparison() {
  return (
    <ITPage>
      <Card padded style={{ padding: 22, marginBottom: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 18 }}>
          <div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon name="building" size={11} /> Select Company
            </div>
            <SoftSelect width={"100%"} value="7Labs AI" options={IT_COMPANIES.map(c => c.name)} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>Current Documents</div>
            <SoftSelect width={"100%"} value="" options={["Select old document date...", "Series A — Mar 2025", "Series Seed — Aug 2024"]} />
          </div>
          <div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>New Documents</div>
            <SoftSelect width={"100%"} value="" options={["Select new document date...", "Series B Draft — Mar 2026"]} />
          </div>
        </div>
      </Card>

      <Card padded style={{ padding: 22 }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 14, fontWeight: 600 }}>
          <Icon name="audit" size={14} color="var(--muted)" /> Detailed Rights Impact Analysis
        </div>
        <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 4 }}>Review and compare legal documents and their terms across funding rounds</div>

        <div style={{ marginTop: 40, padding: 36, textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 12,
            background: "var(--surface-2)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            marginBottom: 14,
          }}>
            <Icon name="folder" size={22} color="var(--fg-2)" />
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>No Documents Available</div>
          <div style={{ fontSize: 12, color: "var(--muted-2)", maxWidth: 420, margin: "0 auto" }}>
            No legal documents have been uploaded for this company yet. Upload documents through the Deal Tracker to begin comparison analysis.
          </div>
          <div style={{
            marginTop: 22, maxWidth: 360, margin: "22px auto 0",
            padding: 14, borderRadius: 8,
            background: "var(--accent-tint-2)",
            border: "1px solid var(--accent-ring-25)",
            textAlign: "left",
          }}>
            <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Icon name="lightning" size={11} color="var(--accent)" /> How to get started:
            </div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 11.5, color: "var(--muted)", lineHeight: 1.7 }}>
              <li>Upload financing documents (Series A, B, C agreements)</li>
              <li>Ensure documents are processed and analyzed</li>
              <li>Return here to compare rights across funding rounds</li>
            </ul>
          </div>
        </div>
      </Card>
    </ITPage>
  );
}

// ────────────── TAB 8: Portfolio Analytics ──────────────
function ITPortfolioAnalytics() {
  return (
    <ITPage>
      <Card padded style={{ padding: 18, marginBottom: 18 }}>
        <SoftSelect width={260} value="7Labs AI" options={IT_COMPANIES.map(c => c.name)} />
      </Card>

      <Card padded style={{ padding: "26px 32px", marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5 }}>7Labs AI</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>7labsai.io</div>
          </div>
          <a href="#" style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)", textDecoration: "none" }}>7Labs AI</a>
        </div>

        <ITSectionHeader>Company Description</ITSectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22, marginBottom: 22 }}>
          <div style={{ fontSize: 12.5, lineHeight: 1.65, color: "var(--fg-2)" }}>
            7Labs AI is a Delaware corporation focused on developing artificial intelligence technology solutions.
            The company develops software products and proprietary technology in the AI space. Based on references in the
            company documents, 7Labs AI appears to offer software services that may include software-as-a-service (SaaS)
            products with object code licensing and end-user agreements. The company maintains intellectual property including
            patents, trademarks, and proprietary software technologies.
          </div>
          <ITKVTable rows={[
            ["Partner", "Admin Ventures V, LP"],
            ["BOD", "Clint Sharp, Max Gazor, Ledion Bitincka, Pat Grady, Michael McBride, plus one vacancy"],
            ["HQ", "San Francisco, CA"],
          ]} />
        </div>

        <ITSectionHeader>Financing History & Valuation ($M)</ITSectionHeader>
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 22, marginBottom: 22 }}>
          <table style={itInnerTable}>
            <thead>
              <tr style={{ background: "var(--surface)", color: "var(--muted)" }}>
                <th style={itTh}>Financing</th><th style={itTh}>Round</th><th style={itTh}>Date</th><th style={itTh}>Post-$</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderTop: "1px solid var(--border)" }}><td style={itTd}>Admin Ventures Entry Round</td><td style={itTd}>Series E</td><td style={itTd}>08/02/2024</td><td style={itTd}>N/A</td></tr>
              <tr style={{ borderTop: "1px solid var(--border)" }}><td style={itTd}>Last Round</td><td style={itTd}>Series E</td><td style={itTd}>08/02/2024</td><td style={itTd}>N/A</td></tr>
            </tbody>
          </table>
          <ITKVTable rows={[
            ["Invested", "$6.34M (Admin Ventures V, LP investment)"],
            ["Fair Value", "N/A"],
            ["Total MOIC", "N/A"],
            ["Current Fund Ownership", "N/A"],
            ["Methodology", "Recent Round"],
            ["Sector", "Artificial Intelligence"],
          ]} />
        </div>

        <ITSectionHeader>Financials ($M)</ITSectionHeader>
        <div style={{ overflowX: "auto", marginBottom: 22 }}>
          <table style={itInnerTable}>
            <thead>
              <tr style={{ background: "var(--surface)", color: "var(--muted)" }}>
                <th style={itTh}></th>
                <th style={itTh}>Jan 31, 2024</th>
                <th style={itTh}>Apr 30, 2024</th>
                {Array.from({ length: 5 }).map((_, i) => <th key={i} style={itTh}></th>)}
              </tr>
            </thead>
            <tbody>
              {["Revenue", "Cash & Cash Equivalents", "Cash Flow / Burn", "Headcount"].map(row => (
                <tr key={row} style={{ borderTop: "1px solid var(--border)" }}>
                  <td style={{ ...itTd, fontWeight: 500 }}>{row}</td>
                  {Array.from({ length: 7 }).map((_, i) => <td key={i} style={itTd}>N/A</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ITSectionHeader>Company Updates</ITSectionHeader>
        <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.7 }}>
          <li>7Labs AI recently closed a Series E preferred stock financing round on August 2, 2024, raising approximately $200 million in total.</li>
          <li>Key investors in the Series E round include CapitalG IV LP ($31.7M), Greenview Investment Pte. Ltd. ($63.4M), Institutional Venture Partners XVII, L.P. ($9.7M), and Admin Ventures V, LP ($6.3M).</li>
          <li>The company is using proceeds from the financing for product development and other general corporate purposes according to the financing documents.</li>
          <li>The board of directors consists of five members with one vacancy, including CEO Clint Sharp and representatives from investor companies.</li>
        </ul>
      </Card>

      <Card padded style={{ padding: "26px 32px" }}>
        <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: -0.5, marginBottom: 4 }}>7Labs AI - Complete Investment Analysis</div>
        <div style={{ height: 2, background: "var(--accent)", marginBottom: 14, opacity: 0.4 }} />
        <div style={{ fontSize: 12.5, color: "var(--fg-2)", marginBottom: 18 }}>
          <strong>Lead Investor:</strong> CRIBL, INC. ("GV") &nbsp;|&nbsp; <strong>Document Date:</strong> August 2024
        </div>
        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>1. Basic Transaction Details</div>
        <table style={itInnerTable}>
          <thead>
            <tr style={{ background: "var(--surface)", color: "var(--muted)" }}>
              <th style={itTh}>Item (#)</th><th style={itTh}>Details</th><th style={itTh}>Source</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderTop: "1px solid var(--border)" }}>
              <td style={itTd}>1. Series Information</td>
              <td style={itTd}>Series E and Series E-1 Preferred Stock</td>
              <td style={itTd}><a href="#" style={{ color: "var(--accent)" }}>Stock Purchase Agreement</a></td>
            </tr>
            <tr style={{ borderTop: "1px solid var(--border)" }}>
              <td style={itTd}>2. Document Types</td>
              <td style={itTd}>Series E Preferred Stock Purchase Agreement, Amended and Restated Certificate of Incorporation, Investors' Rights Agreement, Right of First Refusal and Co-Sale Agreement, Voting Agreement, Management Rights Letter</td>
              <td style={itTd}><a href="#" style={{ color: "var(--accent)" }}>Stock Purchase Agreement</a></td>
            </tr>
            <tr style={{ borderTop: "1px solid var(--border)" }}>
              <td style={itTd}>3a. IRA Amendment</td>
              <td style={itTd}>Yes</td>
              <td style={itTd}><a href="#" style={{ color: "var(--accent)" }}>Stock Purchase Agreement</a></td>
            </tr>
          </tbody>
        </table>
      </Card>
    </ITPage>
  );
}

const ITSectionHeader = ({ children }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 10,
    padding: "8px 12px", marginBottom: 14,
    background: "rgba(66,165,245,0.08)",
    borderLeft: "3px solid var(--accent)",
    borderRadius: "0 6px 6px 0",
    fontSize: 13, fontWeight: 600, color: "var(--fg-2)",
  }}>{children}</div>
);

const ITKVTable = ({ rows }) => (
  <table style={itInnerTable}>
    <tbody>
      {rows.map(([k, v]) => (
        <tr key={k} style={{ borderTop: "1px solid var(--border)" }}>
          <td style={{ ...itTd, width: 140, fontWeight: 600, background: "var(--surface)" }}>{k}</td>
          <td style={itTd}>{v}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

// ────────────── TAB 9: Document Upload ──────────────
function ITDocumentUpload() {
  const [filter, setFilter] = useStateIT("upload");
  return (
    <ITPage onUpload={false}>
      <Card padded style={{ padding: 28, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 22 }}>
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: -0.3 }}>Document Management</div>
            <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>Upload and organize your portfolio company documents by category</div>
          </div>
          <button style={{
            width: 30, height: 30, borderRadius: 8,
            background: "var(--surface)", border: "1px solid var(--border-strong)",
            display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
          }}><RefreshIcon size={12} /></button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
          <ITCatCard icon="file" color="#42A5F5" bg="rgba(66,165,245,0.10)" title="Financing Documents" desc="Term sheets, investment agreements, cap tables" count={6} tone="#1E88E5" />
          <ITCatCard icon="users" color="#22C55E" bg="rgba(34,197,94,0.10)" title="Board Documents" desc="Meeting minutes, resolutions, board packages" count={0} tone="#16A34A" />
          <ITCatCard icon="report" color="#7C3AED" bg="rgba(124,58,237,0.10)" title="Financial Documents" desc="Financial statements, audits, tax returns" count={0} tone="#7C3AED" />
          <ITCatCard icon="chart" color="#F59E0B" bg="rgba(245,158,11,0.12)" title="KPI Documents" desc="Key performance indicators, metrics, dashboards" count={2} tone="#D97706" />
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 22, flexWrap: "wrap" }}>
          {[
            ["upload", "Upload Files"],
            ["progress", "In Progress"],
            ["done", "Completed (12)"],
            ["dup", "Duplicates"],
            ["fail", "Failed (2)"],
            ["unc", "Unclassified"],
            ["task", "Tasks"],
          ].map(([id, label]) => (
            <button key={id} onClick={() => setFilter(id)} style={{
              padding: "6px 14px", borderRadius: 999,
              background: filter === id ? "var(--accent)" : "transparent",
              color: filter === id ? "#fff" : "var(--muted)",
              border: filter === id ? "none" : "1px solid var(--border-strong)",
              fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>{label}</button>
          ))}
        </div>

        <div style={{
          marginTop: 14, padding: 36, textAlign: "center",
          background: "var(--surface)",
          border: "1px dashed var(--border-strong)",
          borderRadius: 10,
        }}>
          <div style={{
            width: 36, height: 36, margin: "0 auto 10px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Icon name="aiUpload" size={22} color="var(--muted-2)" />
          </div>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Drag &amp; drop your document here, or click to browse your files</div>
        </div>
      </Card>
    </ITPage>
  );
}

const ITCatCard = ({ icon, color, bg, title, desc, count, tone }) => (
  <div style={{
    padding: 18, borderRadius: 10,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    cursor: "pointer",
    transition: "border-color 120ms",
  }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8,
        background: bg,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
      }}>
        <Icon name={icon} size={15} color={color} />
      </div>
      <div style={{
        padding: "3px 10px", borderRadius: 999,
        background: bg, color: tone,
        fontSize: 11, fontWeight: 600,
      }}>{count} files</div>
    </div>
    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{title}</div>
    <div style={{ fontSize: 11.5, color: "var(--muted-2)", lineHeight: 1.5 }}>{desc}</div>
  </div>
);

// ────────────── TAB 10: Migration ──────────────
function ITMigration() {
  return (
    <ITPage onUpload={false}>
      <div style={{
        padding: 56, textAlign: "center",
        background: "var(--surface)",
        border: "1px dashed var(--border-strong)",
        borderRadius: 12,
      }}>
        <div style={{ display: "inline-flex", marginBottom: 12 }}>
          <Icon name="aiUpload" size={26} color="var(--muted-2)" />
        </div>
        <div style={{ fontSize: 12.5, color: "var(--muted)" }}>Supports PDF, DOC, DOCX, XLS, XLSX, CSV files up to 25MB</div>
      </div>
    </ITPage>
  );
}

// ────────────── Shared table style ──────────────
const itTh = {
  padding: "10px 14px", textAlign: "left",
  fontSize: 11, fontWeight: 500, color: "var(--muted)",
  letterSpacing: 0.2, whiteSpace: "nowrap",
};
const itTd = {
  padding: "10px 14px", color: "var(--fg-2)",
  fontSize: 12, verticalAlign: "middle",
};
const itInnerTable = {
  width: "100%", borderCollapse: "collapse",
  border: "1px solid var(--border)", borderRadius: 6, overflow: "hidden",
  fontSize: 12,
};

// ────────────── Export to window so vcfo.jsx can use them ──────────────
Object.assign(window, {
  ITPortfolioCompanies, ITPortfolioRequest, ITFinancingDocs, ITBoardDeck,
  ITLegalAnalysis, ITLegalComparison, ITPortfolioAnalytics, ITDocumentUpload, ITMigration,
});
