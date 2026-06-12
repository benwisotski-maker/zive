/* ============================================================
   Zive LP Portal — standalone click-through demo
   Flow: email notification → sign-in (no real auth) →
   first-time onboarding → LP portal (single source of truth).

   All data is dummy data, internally consistent:
   commitment 350,000 · called 309,719.51 (88.49%) ·
   paid in 268,299.39 (76.66%) · due now 41,420.12 ·
   NAV 477,678.09 · ownership 3.46% · distributed 0.00
   ============================================================ */
(() => {
const { useState, useEffect, useRef, useLayoutEffect } = React;
const { motion, AnimatePresence } = window.Motion;

/* ---------------- data ---------------- */

const TODAY = "Apr 6, 2026";
const AS_OF = "Mar 31, 2026";

const LP = {
  entity: "The Gargi M. Keeling Revocable Trust",
  short: "Keeling Trust",
  person: "Gargi Mitra Keeling",
  initials: "GK",
  email: "gargi@keelingtrust.com",
  address: "2450 Marine Parkway, Suite 410, Redwood City, CA 94065",
  taxId: "•••-••4821",
  bank: { name: "Pacific Coast Bank", routing: "•••••0254", account: "••••8821", type: "Checking" },
};

const FUND = {
  name: "Banyan Ventures",
  gp: "Banyan Ventures GP, LLC",
  vintage: "2024",
  term: "10 years",
  legalForm: "Limited Partnership",
  domicile: "United States",
  structure: "Closed-end",
  currency: "USD",
  committed: 350000.00,
  called: 309719.51,
  paidIn: 268299.39,
  dueNow: 41420.12,
  nav: 477678.09,
  ownership: "3.46%",
  distributed: 0.00,
  unfunded: 40280.49,
  calledPct: "88.49%",
  paidPct: "76.66%",
  wire: {
    bank: "First Meridian Trust Company",
    aba: "121000358",
    accountName: "Banyan Ventures, L.P. — Capital Account",
    accountNo: "4400892117",
    reference: "Keeling Trust / BV-LP-046",
  },
};

const CALLS = [
  { id: "CC-06", num: 6, issued: "Apr 2, 2026",  due: "Apr 16, 2026", amount: 41420.12, pct: "11.83%", status: "Pending",  paidOn: null },
  { id: "CC-05", num: 5, issued: "Aug 6, 2025",  due: "Aug 20, 2025", amount: 40799.39, pct: "11.66%", status: "Paid",     paidOn: "Aug 18, 2025" },
  { id: "CC-04", num: 4, issued: "Jan 21, 2025", due: "Feb 4, 2025",  amount: 43750.00, pct: "12.50%", status: "Paid",     paidOn: "Feb 3, 2025" },
  { id: "CC-03", num: 3, issued: "Sep 3, 2024",  due: "Sep 17, 2024", amount: 61250.00, pct: "17.50%", status: "Paid",     paidOn: "Sep 12, 2024" },
  { id: "CC-02", num: 2, issued: "Apr 17, 2024", due: "May 1, 2024",  amount: 52500.00, pct: "15.00%", status: "Paid",     paidOn: "Apr 29, 2024" },
  { id: "CC-01", num: 1, issued: "Jan 8, 2024",  due: "Jan 22, 2024", amount: 70000.00, pct: "20.00%", status: "Paid",     paidOn: "Jan 18, 2024" },
];

const HOLDINGS = [
  { co: "Auroral Systems",    sector: "AI infrastructure",   stage: "Series B", invested: 1850000, fair: 3420000 },
  { co: "Driftline",          sector: "Logistics",           stage: "Series B", invested: 1500000, fair: 2310000 },
  { co: "Cobalt Health",      sector: "Digital health",      stage: "Series A", invested: 1200000, fair: 2060000 },
  { co: "Glasswing Robotics", sector: "Robotics",            stage: "Series A", invested: 1100000, fair: 1480000 },
  { co: "Emberlight Energy",  sector: "Climate",             stage: "Series A", invested: 1000000, fair: 1390000 },
  { co: "Fairmont Data",      sector: "Data infrastructure", stage: "Seed",     invested: 600000,  fair: 1135000 },
  { co: "Harborpoint",        sector: "Fintech",             stage: "Series A", invested: 900000,  fair: 902860 },
  { co: "Juniper Bio",        sector: "Biotech",             stage: "Seed",     invested: 500000,  fair: 715000 },
];

/* Personal capital account statement — Q1 2026 and inception-to-date */
const STATEMENT = {
  period: "Jan 1, 2026 — Mar 31, 2026",
  rows: [
    { label: "Beginning capital account balance", q: 430257.97, itd: 0 },
    { label: "Capital contributions",             q: 0,         itd: 268299.39 },
    { label: "Unrealized gain (loss)",            q: 49500.00,  itd: 223655.12 },
    { label: "Management fees",                   q: -1748.75,  itd: -13125.00 },
    { label: "Net operating income (loss)",       q: -331.13,   itd: -1151.42 },
  ],
  ending: 477678.09,
};

/* Fund-level financials — as of Mar 31, 2026 */
const FUND_FIN = {
  assets: [
    { label: "Investments, at fair value", v: 13412860 },
    { label: "Cash and cash equivalents",  v: 512400 },
    { label: "Other assets",               v: 48210 },
  ],
  totalAssets: 13973470,
  liabilities: [
    { label: "Accrued expenses",   v: 92167 },
    { label: "Due to affiliates",  v: 75000 },
  ],
  totalLiabilities: 167167,
  capital: 13806303,
  ops: [
    { label: "Net change in unrealized appreciation", v: 1430635 },
    { label: "Management fees",                       v: -50542 },
    { label: "Operating expenses",                    v: -9571 },
  ],
  netIncrease: 1370522,
};

const DOC_FOLDERS = [
  { key: "k1",     name: "K-1s",                       desc: "2 documents",  icon: "tax" },
  { key: "stmt",   name: "Capital Account Statements", desc: "6 documents",  icon: "doc" },
  { key: "calls",  name: "Capital Calls",              desc: "11 documents", icon: "call" },
  { key: "agree",  name: "Agreements",                 desc: "3 documents",  icon: "legal" },
  { key: "audit",  name: "Audit Reports",              desc: "2 documents",  icon: "audit" },
  { key: "dist",   name: "Distributions",              desc: "No documents", icon: "dist" },
];

const FILES = {
  k1: [
    { id: "k1-2025", name: "2025 Schedule K-1 (Form 1065) — The Gargi M. Keeling Revocable Trust", type: "Tax", date: "Mar 28, 2026", size: "412 KB", viewer: "k1", year: "2025" },
    { id: "k1-2024", name: "2024 Schedule K-1 (Form 1065) — The Gargi M. Keeling Revocable Trust", type: "Tax", date: "Mar 21, 2025", size: "398 KB", viewer: "k1", year: "2024" },
  ],
  stmt: [
    { id: "st-q126", name: "Q1 2026 Capital Account Statement", type: "Statement", date: "Apr 4, 2026", size: "186 KB", viewer: "letter" },
    { id: "st-q425", name: "Q4 2025 Capital Account Statement", type: "Statement", date: "Jan 14, 2026", size: "184 KB", viewer: "letter" },
    { id: "st-q325", name: "Q3 2025 Capital Account Statement", type: "Statement", date: "Oct 13, 2025", size: "182 KB", viewer: "letter" },
    { id: "st-q225", name: "Q2 2025 Capital Account Statement", type: "Statement", date: "Jul 14, 2025", size: "180 KB", viewer: "letter" },
    { id: "st-q125", name: "Q1 2025 Capital Account Statement", type: "Statement", date: "Apr 11, 2025", size: "178 KB", viewer: "letter" },
    { id: "st-q424", name: "Q4 2024 Capital Account Statement", type: "Statement", date: "Jan 15, 2025", size: "175 KB", viewer: "letter" },
  ],
  calls: [
    ...CALLS.map(c => ({ id: `${c.id}-notice`, name: `Capital Call Notice #${c.num} — ${fmt(c.amount)}`, type: "Notice", date: c.issued, size: "96 KB", viewer: "notice", call: c })),
    ...CALLS.filter(c => c.paidOn).map(c => ({ id: `${c.id}-receipt`, name: `Payment Confirmation — Capital Call #${c.num}`, type: "Receipt", date: c.paidOn, size: "64 KB", viewer: "receipt", call: c })),
  ],
  agree: [
    { id: "ag-lpa",  name: "Amended & Restated Limited Partnership Agreement", type: "Legal", date: "Dec 12, 2023", size: "2.4 MB", viewer: "letter" },
    { id: "ag-sub",  name: "Subscription Agreement — Keeling Trust (executed)", type: "Legal", date: "Jan 5, 2024", size: "1.1 MB", viewer: "letter" },
    { id: "ag-side", name: "Side Letter — Keeling Trust", type: "Legal", date: "Jan 5, 2024", size: "328 KB", viewer: "letter" },
  ],
  audit: [
    { id: "au-2025", name: "2025 Audited Financial Statements — Banyan Ventures, L.P.", type: "Audit", date: "Mar 30, 2026", size: "3.2 MB", viewer: "letter" },
    { id: "au-2024", name: "2024 Audited Financial Statements — Banyan Ventures, L.P.", type: "Audit", date: "Mar 28, 2025", size: "2.9 MB", viewer: "letter" },
  ],
  dist: [],
};

const NOTIFICATIONS = [
  { t: "Q1 2026 capital account statement posted", d: "Statement period Jan 1 – Mar 31, 2026", when: "Apr 4, 2026", page: "personal" },
  { t: "Your 2025 Schedule K-1 is available", d: "Documents → K-1s → 2025", when: "Apr 3, 2026", page: "documents", ctx: { folder: "k1", file: "k1-2025" } },
  { t: "Capital Call #6 issued — $41,420.12", d: "Due Apr 16, 2026 · wire instructions attached", when: "Apr 2, 2026", page: "calls" },
  { t: "2025 audited financial statements posted", d: "Audited by Hartwell & Crane LLP", when: "Mar 30, 2026", page: "documents", ctx: { folder: "audit" } },
];

const ACTIVITY = [
  { icon: "doc",  tone: "acc",  t: "Q1 2026 capital account statement posted", d: "Apr 4, 2026", amt: null },
  { icon: "tax",  tone: "acc",  t: "2025 Schedule K-1 posted to Documents", d: "Apr 3, 2026", amt: null },
  { icon: "call", tone: "warn", t: "Capital Call #6 issued — due Apr 16, 2026", d: "Apr 2, 2026", amt: -41420.12 },
  { icon: "audit", tone: "acc", t: "2025 audited financial statements posted", d: "Mar 30, 2026", amt: null },
  { icon: "check", tone: "pos", t: "Payment received — Capital Call #5", d: "Aug 18, 2025", amt: 40799.39 },
];

/* ---------------- utils ---------------- */

function fmt(n) {
  const neg = n < 0;
  const s = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (neg ? "(" : "") + "$" + s + (neg ? ")" : "");
}
function fmtK(n) {
  return "$" + Math.abs(n).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

const PATHS = {
  home:     "M3 10.5 12 3l9 7.5M5 9.5V21h14V9.5M9 21v-6h6v6",
  doc:      "M7 3h7l5 5v13H7zM14 3v5h5M10 12h6M10 16h6",
  call:     "M12 3v12m0 0 4-4m-4 4-4-4M4 21h16",
  dist:     "M12 21V9m0 0 4 4m-4-4-4 4M4 3h16",
  bank:     "M3 10h18M5 10V8l7-5 7 5v2M6 10v8m4-8v8m4-8v8m4-8v8M3 21h18M3 18h18",
  folder:   "M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  pie:      "M12 3a9 9 0 1 0 9 9h-9z M14 3.5A9 9 0 0 1 20.5 10H14z",
  trend:    "M3 17l6-6 4 4 8-8M15 7h6v6",
  bell:     "M6 9a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6m4 9a2 2 0 0 0 4 0",
  search:   "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.35-4.35",
  check:    "M5 13l4 4L19 7",
  chevR:    "M9 6l6 6-6 6",
  chevD:    "M6 9l6 6 6-6",
  download: "M12 3v12m0 0 4-4m-4 4-4-4M4 21h16",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8-3a8 8 0 0 0-.2-1.7l2-1.6-2-3.4-2.4 1a8 8 0 0 0-2.9-1.7L14 2h-4l-.5 2.6a8 8 0 0 0-2.9 1.7l-2.4-1-2 3.4 2 1.6A8 8 0 0 0 4 12c0 .6.1 1.1.2 1.7l-2 1.6 2 3.4 2.4-1a8 8 0 0 0 2.9 1.7L10 22h4l.5-2.6a8 8 0 0 0 2.9-1.7l2.4 1 2-3.4-2-1.6c.1-.6.2-1.1.2-1.7z",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9",
  tax:      "M9 14l6-6M9.5 8.5h.01M14.5 13.5h.01M7 3h7l5 5v13H7z",
  legal:    "M12 3v18M5 7h14M7 7l-3 6a3.5 3.5 0 0 0 7 0L8 7m9 0-3 6a3.5 3.5 0 0 0 7 0l-3-6M8 21h8",
  audit:    "M9 12l2 2 4-4m6 2a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  warn:     "M12 9v4m0 4h.01M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z",
  mail:     "M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm18 3-10 6L2 7",
  user:     "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0z",
  copy:     "M9 9h11v11H9zM5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1",
  shield:   "M12 22s8-3 8-10V5l-8-3-8 3v7c0 7 8 10 8 10zM9 12l2 2 4-4",
};

function Ic({ d, size = 16, sw = 1.7 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={PATHS[d] || PATHS.doc} />
    </svg>
  );
}

function Wordmark({ h = 26, color = "#1F1F1D" }) {
  return (
    <svg height={h} viewBox="0 0 92 32" fill="none" aria-label="zive">
      <text x="0" y="25" fontFamily="Inter, sans-serif" fontSize="27" fontWeight="700" letterSpacing="-0.5" fill={color}>zive</text>
    </svg>
  );
}

function Chip({ tone = "mut", children }) {
  return <span className={`chip chip-${tone}`}>{children}</span>;
}
function StatusChip({ status }) {
  if (status === "Paid") return <Chip tone="pos"><Ic d="check" size={11} sw={2.4} /> Paid</Chip>;
  if (status === "Pending") return <Chip tone="warn">Pending</Chip>;
  if (status === "Overdue") return <Chip tone="neg">Overdue</Chip>;
  return <Chip>{status}</Chip>;
}

function Empty({ icon = "dist", title, desc }) {
  return (
    <div className="empty">
      <div className="ic"><Ic d={icon} size={22} /></div>
      <div className="t">{title}</div>
      <div className="d">{desc}</div>
    </div>
  );
}

function KPI({ k, v, s, icon, pill, pillTone = "pos" }) {
  return (
    <div className="kpi">
      <div className="k">{k}{icon ? <span className="ic"><Ic d={icon} size={15} /></span> : null}</div>
      <div className="v-row">
        <div className="v num">{v}</div>
        {pill ? <Chip tone={pillTone}>{pill}</Chip> : null}
      </div>
      {s ? <div className="s">{s}</div> : null}
    </div>
  );
}

/* ---------------- charts ---------------- */

/* Quarterly capital account history — paid-in is cumulative and
   matches the call schedule; year-end values match the K-1s. */
const NAV_HISTORY = [
  { q: "Q4 '24", paid: 183750.00, value: 293544.40 },
  { q: "Q1 '25", paid: 227500.00, value: 305210.55 },
  { q: "Q2 '25", paid: 227500.00, value: 322884.12 },
  { q: "Q3 '25", paid: 268299.39, value: 371067.40 },
  { q: "Q4 '25", paid: 268299.39, value: 430257.97 },
  { q: "Q1 '26", paid: 268299.39, value: 477678.09 },
];

function roundedTopRect(x, y, w, h, r) {
  const rr = Math.min(r, h, w / 2);
  return `M${x},${y + h} L${x},${y + rr} Q${x},${y} ${x + rr},${y} L${x + w - rr},${y} Q${x + w},${y} ${x + w},${y + rr} L${x + w},${y + h} Z`;
}

function GrowthChart() {
  const W = 680, H = 252, padL = 48, padB = 28, padT = 12;
  const max = 500000;
  const plotH = H - padB - padT;
  const plotW = W - padL - 8;
  const groupW = plotW / NAV_HISTORY.length;
  const bw = 22, gap = 8;
  const y = v => padT + plotH * (1 - v / max);
  const h = v => plotH * (v / max);
  const ticks = [0, 100000, 200000, 300000, 400000, 500000];
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }} role="img" aria-label="Capital account growth by quarter">
      {ticks.map(t => (
        <g key={t}>
          <line x1={padL} x2={W - 4} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeDasharray={t === 0 ? undefined : "2 5"} />
          <text x={padL - 9} y={y(t) + 3.5} textAnchor="end" className="chart-axis">{t === 0 ? "0" : `$${t / 1000}k`}</text>
        </g>
      ))}
      {NAV_HISTORY.map((d, i) => {
        const cx = padL + groupW * i + groupW / 2;
        return (
          <g key={d.q}>
            <path d={roundedTopRect(cx - bw - gap / 2, y(d.value), bw, h(d.value), 7)} fill="var(--teal-bar)" />
            <path d={roundedTopRect(cx + gap / 2, y(d.paid), bw, h(d.paid), 7)} fill="var(--teal-bar-light)" />
            <text x={cx} y={H - 9} textAnchor="middle" className="chart-axis">{d.q}</text>
          </g>
        );
      })}
    </svg>
  );
}

const DONUT_COLORS = ["#6E4A3E", "#8C5A4F", "#A96F5F", "#C28572", "#D69E88", "#E5B7A1", "#EFCDBA", "#F7E2D4"];

function arcPath(cx, cy, r, a0, a1) {
  const pt = a => [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  const [x0, y0] = pt(a0), [x1, y1] = pt(a1);
  const large = a1 - a0 > Math.PI ? 1 : 0;
  return `M${x0.toFixed(2)},${y0.toFixed(2)} A${r},${r} 0 ${large} 1 ${x1.toFixed(2)},${y1.toFixed(2)}`;
}

function Donut({ data, size = 200, thickness = 32 }) {
  const total = data.reduce((s, d) => s + d.v, 0);
  const r = (size - thickness) / 2, c = size / 2;
  const gapRad = 0.045;
  let a = -Math.PI / 2;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Allocation donut chart">
      {data.map((d, i) => {
        const span = (d.v / total) * Math.PI * 2;
        const path = arcPath(c, c, r, a + gapRad / 2, a + span - gapRad / 2);
        a += span;
        return <path key={i} d={path} stroke={d.color} strokeWidth={thickness} fill="none" />;
      })}
    </svg>
  );
}

/* ============================================================
   STAGE 1 — Email notification
   ============================================================ */

function EmailStage({ onLogin }) {
  return (
    <div className="email-stage fade-in">
      <div style={{ width: 720, maxWidth: "100%" }}>
        <div className="stage-caption">
          <b>Step 1 — Notification.</b> Investors are notified by email the moment a document or capital call is posted.
        </div>
        <div className="email-frame">
          <div className="email-meta">
            <div className="email-avatar">Z</div>
            <div className="who">
              <div className="from">Zive Reports</div>
              <div className="addr">reports@zive.ai · to gargi@keelingtrust.com</div>
            </div>
            <div className="when">Fri, Apr 3, 12:35 PM</div>
          </div>
          <div className="email-subject">Your 2025 Schedule K-1 is available — Banyan Ventures</div>
          <div className="email-body">
            <div className="email-logo"><Wordmark h={30} /></div>
            <hr className="email-rule" />
            <p><b>{LP.entity.toUpperCase()},</b></p>
            <p>Your <b>2025 Schedule K-1</b> for <b>Banyan Ventures</b> is now available in your Zive document vault.</p>
            <p>After signing in, you can find it under:</p>
            <div className="email-path"><Ic d="folder" size={15} /> Documents <Ic d="chevR" size={13} /> K-1s <Ic d="chevR" size={13} /> 2025</div>
            <p>Please sign in to view or download the document.</p>
            <button className="email-cta" onClick={onLogin}>Sign in to Zive</button>
            <p style={{ fontSize: 12.5, color: "var(--muted)" }}>
              If you have any questions or need help accessing your K-1, contact <a href="#" onClick={e => e.preventDefault()}>support@zive.ai</a>.
            </p>
          </div>
          <div className="email-footer">
            Zive, Inc. · You are receiving this because tax document notifications are enabled for {LP.email}. Manage preferences in Settings → Notifications.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   STAGE 2 — Sign in (no real auth; everything pre-filled)
   ============================================================ */

function LoginStage({ onDone }) {
  const [step, setStep] = useState("creds"); // creds | code
  return (
    <div className="auth-stage fade-in">
      <div style={{ width: 400, maxWidth: "100%" }}>
        <div className="stage-caption">
          <b>Step 2 — Secure sign-in.</b> Credentials are pre-filled for this demo — just click through.
        </div>
        {step === "creds" ? (
          <div className="auth-card">
            <div className="wordmark"><Wordmark /></div>
            <div className="auth-title">Sign in</div>
            <div className="auth-sub">Limited Partner portal · Banyan Ventures</div>
            <div className="field">
              <label>Email</label>
              <input readOnly value={LP.email} />
            </div>
            <div className="field">
              <label>Password</label>
              <input readOnly type="password" value="demo-password" />
            </div>
            <button className="btn btn-primary btn-block btn-lg" onClick={() => setStep("code")}>Sign in</button>
            <div className="auth-or">or</div>
            <button className="btn btn-secondary btn-block" onClick={() => setStep("code")}>Continue with SSO</button>
            <div className="auth-foot">Protected by two-factor authentication <br /> SOC 2 Type II · 256-bit encryption</div>
          </div>
        ) : (
          <div className="auth-card">
            <div className="wordmark"><Wordmark /></div>
            <div className="auth-title">Verify it's you</div>
            <div className="auth-sub">We sent a 6-digit code to {LP.email}</div>
            <div className="code-row">
              {["4", "8", "2", "9", "1", "6"].map((c, i) => <div key={i} className="code-cell">{c}</div>)}
            </div>
            <button className="btn btn-primary btn-block btn-lg" onClick={onDone}>Verify &amp; continue</button>
            <div className="demo-note">Demo mode — the code is filled in for you. No password or device is required.</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============================================================
   STAGE 3 — First-time onboarding wizard
   ============================================================ */

/* ----- Stepper (ported from React Bits, restyled to the design system) ----- */

function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonText = "Back",
  nextButtonText = "Continue",
  finalButtonText = "Complete",
  nextDisabled = false,
  onSkip,
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = React.Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  const updateStep = newStep => {
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };
  const handleBack = () => { if (currentStep > 1) { setDirection(-1); updateStep(currentStep - 1); } };
  const handleNext = () => { if (!isLastStep) { setDirection(1); updateStep(currentStep + 1); } };
  const handleComplete = () => { setDirection(1); updateStep(totalSteps + 1); };

  return (
    <div className="stepper-card">
      <div className="step-indicator-row">
        {stepsArray.map((_, index) => {
          const stepNumber = index + 1;
          return (
            <React.Fragment key={stepNumber}>
              <StepIndicator step={stepNumber} currentStep={currentStep}
                onClickStep={clicked => { setDirection(clicked > currentStep ? 1 : -1); updateStep(clicked); }} />
              {index < totalSteps - 1 && <StepConnector isComplete={currentStep > stepNumber} />}
            </React.Fragment>
          );
        })}
      </div>
      <StepContentWrapper isCompleted={isCompleted} currentStep={currentStep} direction={direction} className="step-content-default">
        {stepsArray[currentStep - 1]}
      </StepContentWrapper>
      {!isCompleted && (
        <div className="footer-container">
          <div className={`footer-nav ${currentStep !== 1 ? "spread" : "end"}`}>
            {currentStep !== 1 && <button onClick={handleBack} className="back-button">{backButtonText}</button>}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {onSkip && <button className="btn btn-ghost" onClick={onSkip}>Skip for now</button>}
              <button onClick={isLastStep ? handleComplete : handleNext} className="btn btn-primary"
                disabled={nextDisabled} style={{ opacity: nextDisabled ? 0.5 : 1 }}>
                {isLastStep ? finalButtonText : nextButtonText} <Ic d="chevR" size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className }) {
  const [parentHeight, setParentHeight] = useState(0);
  return (
    <motion.div
      className={className}
      style={{ position: "relative", overflow: "hidden" }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: "spring", duration: 0.4 }}
    >
      <AnimatePresence initial={false} custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={h => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeightReady }) {
  const containerRef = useRef(null);
  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const measure = () => containerRef.current && onHeightReady(containerRef.current.offsetHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [children, onHeightReady]);
  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={stepVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.4 }}
      style={{ position: "absolute", left: 0, right: 0, top: 0 }}
    >
      {children}
    </motion.div>
  );
}

const stepVariants = {
  enter: dir => ({ x: dir >= 0 ? "-100%" : "100%", opacity: 0 }),
  center: { x: "0%", opacity: 1 },
  exit: dir => ({ x: dir >= 0 ? "50%" : "-50%", opacity: 0 }),
};

function Step({ children }) {
  return <div className="step-default">{children}</div>;
}

/* Design-system colors for the animated indicators */
const STEP_COLORS = {
  inactive: { backgroundColor: "#EFEFEA", color: "#75756D" },
  active: { backgroundColor: "#2D6A72", color: "#FFFFFF" },
  complete: { backgroundColor: "#2D6A72", color: "#FFFFFF" },
};

function StepIndicator({ step, currentStep, onClickStep }) {
  const status = currentStep === step ? "active" : currentStep < step ? "inactive" : "complete";
  return (
    <motion.div onClick={() => { if (step !== currentStep) onClickStep(step); }} className="step-indicator" animate={status} initial={false}>
      <motion.div variants={STEP_COLORS} transition={{ duration: 0.3 }} className="step-indicator-inner">
        {status === "complete" ? <CheckIcon className="check-icon" /> : status === "active" ? <div className="active-dot" /> : <span className="step-number">{step}</span>}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }) {
  return (
    <div className="step-connector">
      <motion.div
        className="step-connector-inner"
        variants={{ incomplete: { width: 0, backgroundColor: "transparent" }, complete: { width: "100%", backgroundColor: "#2D6A72" } }}
        initial={false}
        animate={isComplete ? "complete" : "incomplete"}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <motion.path
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ delay: 0.1, type: "tween", ease: "easeOut", duration: 0.3 }}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    </svg>
  );
}

function OnboardingStage({ onDone }) {
  const [stepNum, setStepNum] = useState(1);
  const [acks, setAcks] = useState({ lpa: true, sub: true, side: true });
  const [prefs, setPrefs] = useState({ calls: true, dists: true, tax: true, stmts: true, news: false });
  const [finished, setFinished] = useState(false);
  const allAcked = Object.values(acks).every(Boolean);

  if (finished) {
    return (
      <div className="onb-stage fade-in">
        <div className="stepper-card" style={{ width: 560, maxWidth: "100%", padding: "44px 48px", textAlign: "center" }}>
          <div className="onb-done-icon"><Ic d="check" size={30} sw={2.4} /></div>
          <div className="onb-title">You're all set, {LP.person.split(" ")[0]}</div>
          <div className="onb-sub" style={{ margin: "0 auto 28px" }}>
            Your account for <b>{FUND.name}</b> is ready. One fund, one set of numbers — your dashboard, documents and tax forms all draw from the same ledger.
          </div>
          <button className="btn btn-primary btn-lg" onClick={onDone}>Go to your dashboard <Ic d="chevR" size={15} /></button>
        </div>
      </div>
    );
  }

  const stepWelcome = (
        <div>
          <div className="onb-kicker">Welcome to Zive</div>
          <div className="onb-title">{LP.entity}</div>
          <div className="onb-sub">You've been invited by <b>{FUND.gp}</b> as a Limited Partner in <b>{FUND.name}</b>. Here's what your portal gives you:</div>
          <div className="welcome-points">
            <div className="welcome-point">
              <div className="ic"><Ic d="pie" size={18} /></div>
              <div><div className="t">Account status at a glance</div>
              <div className="d">A single dashboard for your commitment, capital calls, payments and current value — with email notifications when anything changes.</div></div>
            </div>
            <div className="welcome-point">
              <div className="ic"><Ic d="folder" size={18} /></div>
              <div><div className="t">Official documents</div>
              <div className="d">Legally binding records of every commitment, call and payment — notices, confirmations, statements and agreements in one vault.</div></div>
            </div>
            <div className="welcome-point">
              <div className="ic"><Ic d="tax" size={18} /></div>
              <div><div className="t">Tax preparation</div>
              <div className="d">Schedule K-1s posted by year, ready to download or share with your accountant the day they're issued.</div></div>
            </div>
          </div>
        </div>
  );

  const stepProfile = (
        <div>
          <div className="onb-kicker">Your details</div>
          <div className="onb-title">Confirm your investor profile</div>
          <div className="onb-sub">We pre-filled this from your subscription documents. You can change it any time in Settings.</div>
          <div className="onb-grid">
            <div className="field"><label>Legal entity</label><input readOnly value={LP.entity} /></div>
            <div className="field"><label>Authorized person</label><input readOnly value={LP.person} /></div>
            <div className="field"><label>Email</label><input readOnly value={LP.email} /></div>
            <div className="field"><label>Tax ID</label><input readOnly value={LP.taxId} /><div className="hint">Stored encrypted · shown masked</div></div>
          </div>
          <div className="field"><label>Mailing address</label><input readOnly value={LP.address} /></div>
        </div>
  );

  const stepDocs = (
        <div>
          <div className="onb-kicker">Fund documents</div>
          <div className="onb-title">Review your fund documents</div>
          <div className="onb-sub">These executed agreements govern your investment. They'll always be available under Documents → Agreements.</div>
          <div className="ack-list">
            {[
              { k: "lpa", t: "Amended & Restated Limited Partnership Agreement", d: "Executed Dec 12, 2023 · 2.4 MB" },
              { k: "sub", t: "Subscription Agreement — Keeling Trust", d: "Executed Jan 5, 2024 · Commitment $350,000.00" },
              { k: "side", t: "Side Letter — Keeling Trust", d: "Executed Jan 5, 2024 · 328 KB" },
            ].map(it => (
              <button key={it.k} className="ack-item" onClick={() => setAcks(a => ({ ...a, [it.k]: !a[it.k] }))}>
                <div className={"checkbox" + (acks[it.k] ? " on" : "")}><Ic d="check" size={12} sw={3} /></div>
                <div className="grow"><div className="t">{it.t}</div><div className="d">{it.d}</div></div>
                <span className="btn btn-ghost" style={{ padding: "5px 10px" }}><Ic d="doc" size={14} /> View</span>
              </button>
            ))}
          </div>
          <div className="demo-note" style={{ marginTop: 18 }}>By continuing you acknowledge receipt of these documents. This does not re-execute or amend them.</div>
        </div>
  );

  const stepBanking = (
        <div>
          <div className="onb-kicker">Banking</div>
          <div className="onb-title">Distribution account</div>
          <div className="onb-sub">Distributions will be wired to this account. Changes require verification by the fund administrator before taking effect.</div>
          <div className="onb-grid">
            <div className="field"><label>Bank</label><input readOnly value={LP.bank.name} /></div>
            <div className="field"><label>Account type</label><input readOnly value={LP.bank.type} /></div>
            <div className="field"><label>Routing number</label><input readOnly value={LP.bank.routing} /></div>
            <div className="field"><label>Account number</label><input readOnly value={LP.bank.account} /></div>
          </div>
          <div className="alert alert-info" style={{ marginTop: 8, marginBottom: 0 }}>
            <span className="ic"><Ic d="shield" size={17} /></span>
            <div className="grow"><div className="t">Verified on file</div>
            <div className="d">This account was verified during subscription. Any change triggers a callback verification — a core wire-fraud control.</div></div>
          </div>
        </div>
  );

  const stepPrefs = (
        <div>
          <div className="onb-kicker">Notifications</div>
          <div className="onb-title">Notification preferences</div>
          <div className="onb-sub">Get an email the moment something is posted to your account. Delivered to {LP.email}.</div>
          <div className="card card-pad" style={{ paddingTop: 6, paddingBottom: 6 }}>
            {[
              { k: "calls", t: "Capital calls", d: "New call notices, due-date reminders, payment confirmations" },
              { k: "dists", t: "Distributions", d: "Distribution notices and wire confirmations" },
              { k: "tax", t: "Tax documents", d: "Schedule K-1s and estimates, posted by year" },
              { k: "stmts", t: "Statements & reports", d: "Quarterly capital account statements, audited financials" },
              { k: "news", t: "Fund news", d: "Portfolio updates and announcements from the GP" },
            ].map(it => (
              <div key={it.k} className="toggle-row">
                <div><div className="t">{it.t}</div><div className="d">{it.d}</div></div>
                <button className={"switch" + (prefs[it.k] ? " on" : "")} onClick={() => setPrefs(p => ({ ...p, [it.k]: !p[it.k] }))} aria-label={it.t}>
                  <span className="knob" />
                </button>
              </div>
            ))}
          </div>
        </div>
  );

  return (
    <div className="onb-stage fade-in">
      <div style={{ width: 780, maxWidth: "100%" }}>
        <div className="stage-caption"><b>Step 3 — First-time onboarding.</b> Five short steps, all pre-filled with dummy data.</div>
        <Stepper
          initialStep={1}
          onStepChange={setStepNum}
          onFinalStepCompleted={() => setFinished(true)}
          nextDisabled={stepNum === 3 && !allAcked}
          onSkip={onDone}
          finalButtonText="Finish setup"
        >
          <Step>{stepWelcome}</Step>
          <Step>{stepProfile}</Step>
          <Step>{stepDocs}</Step>
          <Step>{stepBanking}</Step>
          <Step>{stepPrefs}</Step>
        </Stepper>
        <div className="stage-caption" style={{ marginTop: 18, marginBottom: 0 }}>Questions? support@zive.ai · Your progress is saved automatically.</div>
      </div>
    </div>
  );
}

/* ============================================================
   STAGE 4 — Portal
   ============================================================ */

const NAV = [
  { label: "Fund", items: [
    { id: "overview", label: "Overview", icon: "home" },
    { id: "commitments", label: "Commitments", icon: "pie" },
    { id: "investments", label: "Investments", icon: "trend" },
  ]},
  { label: "Accounting", items: [
    { id: "financials", label: "Financial Statements", icon: "doc" },
    { id: "calls", label: "Capital Calls", icon: "call", count: 1 },
    { id: "distributions", label: "Distributions", icon: "dist" },
    { id: "personal", label: "Personal Statement", icon: "user" },
    { id: "wire", label: "Wire Instructions", icon: "bank" },
  ]},
  { label: "Files", items: [
    { id: "documents", label: "Documents", icon: "folder" },
  ]},
];

function PendingCallAlert({ go }) {
  return (
    <div className="alert alert-warn">
      <span className="ic"><Ic d="warn" size={18} /></span>
      <div className="grow">
        <div className="t">Capital Call #6 — {fmt(FUND.dueNow)} due Apr 16, 2026</div>
        <div className="d">Issued Apr 2, 2026 · 11.83% of commitment · wire instructions attached to the notice</div>
      </div>
      <button className="btn btn-secondary" onClick={() => go("calls")}>View call</button>
    </div>
  );
}

function OverviewPage({ go }) {
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="page-title">Good morning, {LP.person.split(" ")[0]}!</div>
          <div className="page-sub">Here's where your {FUND.name} account stands · values as of {AS_OF}</div>
        </div>
        <div className="page-actions">
          <button className="btn btn-secondary" onClick={() => go("personal")}><Ic d="download" size={14} /> Statement PDF</button>
        </div>
      </div>

      <PendingCallAlert go={go} />

      <div className="alert alert-info">
        <span className="ic"><Ic d="tax" size={18} /></span>
        <div className="grow">
          <div className="t">Your 2025 Schedule K-1 is ready</div>
          <div className="d">Posted Mar 28, 2026 · Documents → K-1s → 2025</div>
        </div>
        <button className="btn btn-secondary" onClick={() => go("documents", { folder: "k1", file: "k1-2025" })}>View K-1</button>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">{LP.entity}</div>
            <div className="page-sub">Limited Partner · {FUND.name}</div>
          </div>
          <Chip tone="acc">1 fund · 1 capital account</Chip>
        </div>
        <div className="facts-strip">
          <div className="fact"><div className="k">Vintage</div><div className="v">{FUND.vintage}</div></div>
          <div className="fact"><div className="k">Term</div><div className="v">{FUND.term}</div></div>
          <div className="fact"><div className="k">Legal form</div><div className="v">{FUND.legalForm}</div></div>
          <div className="fact"><div className="k">Domicile</div><div className="v">{FUND.domicile}</div></div>
          <div className="fact"><div className="k">Structure</div><div className="v">{FUND.structure}</div></div>
          <div className="fact"><div className="k">Currency</div><div className="v">{FUND.currency}</div></div>
        </div>
      </div>

      <div className="kpi-row section-gap" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
        <KPI k="Committed" v={fmt(FUND.committed)} icon="legal" s="Subscription executed Jan 5, 2024" />
        <KPI k="Net asset value" v={fmt(FUND.nav)} icon="trend" pill="↗ 11.0%" pillTone="pos" s={`Ownership ${FUND.ownership} · vs Q4 2025`} />
        <KPI k="Paid in" v={fmt(FUND.paidIn)} icon="check" pill={FUND.paidPct} pillTone="acc" s="5 capital calls settled" />
        <KPI k="Due to fund now" v={fmt(FUND.dueNow)} icon="call" pill="Due Apr 16" pillTone="warn" s="Capital Call #6 · issued Apr 2, 2026" />
      </div>

      <div className="card section-gap">
        <div className="card-head">
          <div className="card-title">Capital account growth</div>
          <div className="chart-legend">
            <span className="li"><span className="swatch" style={{ background: "var(--teal-bar)" }} /> Account value</span>
            <span className="li"><span className="swatch" style={{ background: "var(--teal-bar-light)" }} /> Paid-in capital</span>
          </div>
        </div>
        <div className="card-pad" style={{ paddingTop: 18 }}>
          <GrowthChart />
        </div>
      </div>

      <div className="card section-gap card-pad">
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <div className="card-title">Commitment progress</div>
          <div className="page-sub num" style={{ marginTop: 0 }}>{fmt(FUND.paidIn)} paid of {fmt(FUND.committed)} committed</div>
        </div>
        <div className="progress"><div className="fill" style={{ width: "76.66%" }} /></div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, fontSize: 12, color: "var(--muted)" }}>
          <span>Paid in {FUND.paidPct}</span>
          <span>Called {FUND.calledPct} · Unfunded {fmt(FUND.unfunded)}</span>
        </div>
      </div>

      <div className="card section-gap">
        <div className="card-head">
          <div className="card-title">Recent activity</div>
          <button className="btn btn-ghost" onClick={() => go("documents")}>All documents</button>
        </div>
        {ACTIVITY.map((a, i) => (
          <div key={i} className="activity-row">
            <div className="activity-ic" style={{
              background: a.tone === "pos" ? "var(--pos-soft)" : a.tone === "warn" ? "var(--warn-soft)" : "var(--accent-soft)",
              color: a.tone === "pos" ? "var(--pos)" : a.tone === "warn" ? "var(--warn)" : "var(--accent)",
            }}><Ic d={a.icon} size={15} /></div>
            <div className="grow"><div className="t">{a.t}</div><div className="d">{a.d}</div></div>
            {a.amt != null && <div className="amt num" style={{ color: a.amt < 0 ? "var(--warn)" : "var(--pos)" }}>{a.amt < 0 ? "−" : "+"}{fmt(Math.abs(a.amt)).replace("$", "$")}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

function CommitmentsPage({ go }) {
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="page-title">Commitments</div>
          <div className="page-sub">One commitment, one capital account — every figure below reconciles to the same ledger.</div>
        </div>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr>
            <th>Fund</th><th>Vintage</th><th className="r">Committed</th><th className="r">Called</th>
            <th className="r">Paid in</th><th className="r">Unfunded</th><th className="r">NAV</th><th className="r">Ownership</th>
          </tr></thead>
          <tbody>
            <tr>
              <td className="strong">{FUND.name}</td><td>{FUND.vintage}</td>
              <td className="r num">{fmt(FUND.committed)}</td><td className="r num">{fmt(FUND.called)}</td>
              <td className="r num">{fmt(FUND.paidIn)}</td><td className="r num">{fmt(FUND.unfunded)}</td>
              <td className="r num">{fmt(FUND.nav)}</td><td className="r num">{FUND.ownership}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td>Total</td><td></td>
              <td className="r num">{fmt(FUND.committed)}</td><td className="r num">{fmt(FUND.called)}</td>
              <td className="r num">{fmt(FUND.paidIn)}</td><td className="r num">{fmt(FUND.unfunded)}</td>
              <td className="r num">{fmt(FUND.nav)}</td><td className="r num">{FUND.ownership}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div className="card section-gap">
        <div className="card-head"><div className="card-title">Call schedule against commitment</div><Chip tone="acc">{FUND.calledPct} called</Chip></div>
        <table className="tbl">
          <thead><tr><th>Call</th><th>Issued</th><th>Due</th><th className="r">% of commitment</th><th className="r">Amount</th><th>Status</th><th>Evidence</th></tr></thead>
          <tbody>
            {CALLS.map(c => (
              <tr key={c.id}>
                <td className="strong">#{c.num}</td><td>{c.issued}</td><td>{c.due}</td>
                <td className="r num">{c.pct}</td><td className="r num">{fmt(c.amount)}</td>
                <td><StatusChip status={c.status} /></td>
                <td><button className="btn btn-ghost" style={{ padding: "3px 8px", fontSize: 12 }}
                  onClick={() => go("documents", { folder: "calls", file: `${c.id}-${c.paidOn ? "receipt" : "notice"}` })}>
                  {c.paidOn ? "Receipt" : "Notice"}</button></td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td colSpan={3}>Called to date</td><td className="r num">{FUND.calledPct}</td><td className="r num">{fmt(FUND.called)}</td><td colSpan={2}></td></tr></tfoot>
        </table>
      </div>
    </div>
  );
}

function InvestmentsPage() {
  const invested = HOLDINGS.reduce((s, h) => s + h.invested, 0);
  const fair = HOLDINGS.reduce((s, h) => s + h.fair, 0);
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="page-title">Investments</div>
          <div className="page-sub">Fund portfolio as of {AS_OF} · your indirect exposure is {FUND.ownership} of each position</div>
        </div>
      </div>
      <div className="kpi-row" style={{ marginBottom: 18 }}>
        <KPI k="Portfolio companies" v={HOLDINGS.length} icon="folder" />
        <KPI k="Invested capital" v={fmtK(invested)} icon="bank" />
        <KPI k="Fair value" v={fmtK(fair)} icon="trend" pill={`${(fair / invested).toFixed(2)}×`} pillTone="pos" />
        <KPI k="Your share" v={FUND.ownership} icon="pie" s="Of every position below" />
      </div>
      <div className="card" style={{ marginBottom: 18 }}>
        <div className="card-head"><div className="card-title">Allocation by sector</div><Chip>Fair value · {AS_OF}</Chip></div>
        <div className="card-pad">
          <div className="donut-wrap">
            <Donut data={HOLDINGS.map((h, i) => ({ v: h.fair, color: DONUT_COLORS[i] }))} />
            <div className="donut-legend">
              {HOLDINGS.map((h, i) => (
                <div key={h.co} className="li">
                  <span className="swatch" style={{ background: DONUT_COLORS[i] }} />
                  {h.sector}
                  <span className="pct num">{(h.fair / fair * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <table className="tbl">
          <thead><tr><th>Company</th><th>Sector</th><th>Stage</th><th className="r">Invested</th><th className="r">Fair value</th><th className="r">Multiple</th></tr></thead>
          <tbody>
            {HOLDINGS.map(h => (
              <tr key={h.co}>
                <td className="strong">{h.co}</td><td>{h.sector}</td><td><Chip>{h.stage}</Chip></td>
                <td className="r num">{fmtK(h.invested)}</td><td className="r num">{fmtK(h.fair)}</td>
                <td className="r num">{(h.fair / h.invested).toFixed(2)}×</td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td colSpan={3}>Total</td><td className="r num">{fmtK(invested)}</td><td className="r num">{fmtK(fair)}</td><td className="r num">{(fair / invested).toFixed(2)}×</td></tr></tfoot>
        </table>
      </div>
    </div>
  );
}

function FinancialsPage() {
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="page-title">Financial Statements</div>
          <div className="page-sub">Banyan Ventures, L.P. — fund-level statements as of {AS_OF} (unaudited)</div>
        </div>
        <div className="page-actions"><button className="btn btn-secondary"><Ic d="download" size={14} /> Export</button></div>
      </div>
      <div className="card">
        <div className="card-head"><div className="card-title">Statement of assets and liabilities</div><Chip>{AS_OF}</Chip></div>
        <div className="stmt-rows">
          {FUND_FIN.assets.map(r => <div key={r.label} className="stmt-row indent"><span>{r.label}</span><span className="num">{fmt(r.v)}</span></div>)}
          <div className="stmt-row total"><span>Total assets</span><span className="num">{fmt(FUND_FIN.totalAssets)}</span></div>
          {FUND_FIN.liabilities.map(r => <div key={r.label} className="stmt-row indent"><span>{r.label}</span><span className="num">{fmt(r.v)}</span></div>)}
          <div className="stmt-row total"><span>Total liabilities</span><span className="num">{fmt(FUND_FIN.totalLiabilities)}</span></div>
          <div className="stmt-row total"><span>Partners' capital</span><span className="num">{fmt(FUND_FIN.capital)}</span></div>
        </div>
      </div>
      <div className="card section-gap">
        <div className="card-head"><div className="card-title">Statement of operations</div><Chip>Q1 2026</Chip></div>
        <div className="stmt-rows">
          {FUND_FIN.ops.map(r => <div key={r.label} className="stmt-row indent"><span>{r.label}</span><span className="num">{fmt(r.v)}</span></div>)}
          <div className="stmt-row total"><span>Net increase in partners' capital</span><span className="num">{fmt(FUND_FIN.netIncrease)}</span></div>
        </div>
      </div>
      <div className="alert alert-info section-gap" style={{ marginBottom: 0 }}>
        <span className="ic"><Ic d="audit" size={17} /></span>
        <div className="grow"><div className="t">Audited statements available</div>
        <div className="d">The 2025 audited financial statements (Hartwell &amp; Crane LLP) are in Documents → Audit Reports.</div></div>
      </div>
    </div>
  );
}

function CapitalCallsPage({ go }) {
  const pending = CALLS.find(c => c.status === "Pending");
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="page-title">Capital Calls</div>
          <div className="page-sub">Every call notice and payment confirmation is preserved as an official record.</div>
        </div>
      </div>
      <div className="kpi-row" style={{ marginBottom: 18 }}>
        <KPI k="Outstanding" v={fmt(pending.amount)} icon="warn" pill="Due Apr 16" pillTone="warn" s="Capital Call #6" />
        <KPI k="Called to date" v={fmt(FUND.called)} icon="call" s={`${FUND.calledPct} of commitment`} />
        <KPI k="Paid to date" v={fmt(FUND.paidIn)} icon="check" s="5 calls settled" />
        <KPI k="Unfunded commitment" v={fmt(FUND.unfunded)} icon="pie" s="Remaining callable" />
      </div>

      <div className="card">
        <div className="card-head">
          <div className="card-title">Pending — Capital Call #{pending.num}</div>
          <StatusChip status="Pending" />
        </div>
        <div className="card-pad" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px 28px" }}>
          <div>
            <div className="stmt-row" style={{ padding: "8px 0" }}><span style={{ color: "var(--muted)" }}>Amount due</span><span className="num strong">{fmt(pending.amount)}</span></div>
            <div className="stmt-row" style={{ padding: "8px 0" }}><span style={{ color: "var(--muted)" }}>Issued</span><span>{pending.issued}</span></div>
            <div className="stmt-row" style={{ padding: "8px 0" }}><span style={{ color: "var(--muted)" }}>Due date</span><span className="strong">{pending.due}</span></div>
            <div className="stmt-row" style={{ padding: "8px 0", borderBottom: "none" }}><span style={{ color: "var(--muted)" }}>% of commitment</span><span className="num">{pending.pct}</span></div>
          </div>
          <div>
            <div className="stmt-row" style={{ padding: "8px 0" }}><span style={{ color: "var(--muted)" }}>Wire to</span><span>{FUND.wire.bank}</span></div>
            <div className="stmt-row" style={{ padding: "8px 0" }}><span style={{ color: "var(--muted)" }}>ABA</span><span className="num">{FUND.wire.aba}</span></div>
            <div className="stmt-row" style={{ padding: "8px 0" }}><span style={{ color: "var(--muted)" }}>Account</span><span className="num">{FUND.wire.accountNo}</span></div>
            <div className="stmt-row" style={{ padding: "8px 0", borderBottom: "none" }}><span style={{ color: "var(--muted)" }}>Reference</span><span>{FUND.wire.reference}</span></div>
          </div>
        </div>
        <div className="card-head" style={{ borderTop: "1px solid var(--border)", borderBottom: "none" }}>
          <div className="page-sub">Always confirm wire details against the signed notice before sending funds.</div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => go("documents", { folder: "calls", file: "CC-06-notice" })}><Ic d="doc" size={14} /> View notice</button>
            <button className="btn btn-primary"><Ic d="download" size={14} /> Download notice (PDF)</button>
          </div>
        </div>
      </div>

      <div className="card section-gap">
        <div className="card-head"><div className="card-title">Call history</div></div>
        <table className="tbl">
          <thead><tr><th>Call</th><th>Issued</th><th>Due</th><th className="r">Amount</th><th>Status</th><th>Settled</th><th>Documents</th></tr></thead>
          <tbody>
            {CALLS.map(c => (
              <tr key={c.id}>
                <td className="strong">#{c.num}</td><td>{c.issued}</td><td>{c.due}</td>
                <td className="r num">{fmt(c.amount)}</td><td><StatusChip status={c.status} /></td>
                <td>{c.paidOn || "—"}</td>
                <td style={{ whiteSpace: "nowrap" }}>
                  <button className="btn btn-ghost" style={{ padding: "3px 8px", fontSize: 12 }} onClick={() => go("documents", { folder: "calls", file: `${c.id}-notice` })}>Notice</button>
                  {c.paidOn && <button className="btn btn-ghost" style={{ padding: "3px 8px", fontSize: 12 }} onClick={() => go("documents", { folder: "calls", file: `${c.id}-receipt` })}>Receipt</button>}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot><tr><td colSpan={3}>Total called</td><td className="r num">{fmt(FUND.called)}</td><td colSpan={3}></td></tr></tfoot>
        </table>
      </div>
    </div>
  );
}

function DistributionsPage() {
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="page-title">Distributions</div>
          <div className="page-sub">Wired to {LP.bank.name} {LP.bank.account} · update in Wire Instructions</div>
        </div>
      </div>
      <div className="kpi-row" style={{ marginBottom: 20 }}>
        <KPI k="Distributed to date" v={fmt(0)} />
        <KPI k="DPI" v="0.00×" s="Distributions ÷ paid-in capital" />
        <KPI k="Distribution account" v={LP.bank.account} s={`${LP.bank.name} · verified`} />
      </div>
      <div className="card">
        <Empty icon="dist" title="No distributions yet"
          desc={`${FUND.name} (vintage ${FUND.vintage}) has not made a distribution to date. When the fund distributes proceeds, the notice, amount and wire confirmation will appear here — and you'll be notified by email.`} />
      </div>
    </div>
  );
}

function PersonalStatementPage({ go }) {
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="page-title">Personal Statement</div>
          <div className="page-sub">Capital account statement for {LP.entity}</div>
        </div>
        <div className="page-actions">
          <select className="select-pill">
            <option>Q1 2026 (Jan 1 — Mar 31)</option>
            <option>Q4 2025</option><option>Q3 2025</option><option>Q2 2025</option>
          </select>
          <button className="btn btn-primary"><Ic d="download" size={14} /> Generate Statement PDF</button>
        </div>
      </div>
      <div className="card">
        <div className="card-head"><div className="card-title">Capital account summary</div><Chip>{STATEMENT.period}</Chip></div>
        <div>
          <div className="stmt-cols head"><span>Summary</span><span className="r">Statement period</span><span className="r">Inception to date</span></div>
          {STATEMENT.rows.map(r => (
            <div key={r.label} className="stmt-cols">
              <span>{r.label}</span>
              <span className="r num">{r.q === 0 && r.label !== "Beginning capital account balance" ? "—" : fmt(r.q)}</span>
              <span className="r num">{r.label === "Beginning capital account balance" ? "—" : fmt(r.itd)}</span>
            </div>
          ))}
          <div className="stmt-cols total"><span>Ending capital account balance</span><span className="r num">{fmt(STATEMENT.ending)}</span><span className="r num">{fmt(STATEMENT.ending)}</span></div>
        </div>
      </div>
      <div className="card section-gap">
        <div className="card-head"><div className="card-title">Commitment summary</div></div>
        <div className="stmt-rows">
          <div className="stmt-row"><span>Total commitment</span><span className="num">{fmt(FUND.committed)}</span></div>
          <div className="stmt-row"><span>Cumulative called ({FUND.calledPct})</span><span className="num">{fmt(FUND.called)}</span></div>
          <div className="stmt-row"><span>Cumulative paid in ({FUND.paidPct})</span><span className="num">{fmt(FUND.paidIn)}</span></div>
          <div className="stmt-row"><span>Due to fund (Capital Call #6)</span><span className="num">{fmt(FUND.dueNow)}</span></div>
          <div className="stmt-row total"><span>Unfunded commitment</span><span className="num">{fmt(FUND.unfunded)}</span></div>
        </div>
      </div>
      <div className="alert alert-pos section-gap" style={{ marginBottom: 0 }}>
        <span className="ic"><Ic d="shield" size={17} /></span>
        <div className="grow"><div className="t">Reconciled</div>
        <div className="d">This statement, your dashboard and your K-1 are generated from the same ledger — there is exactly one capital account for your commitment.</div></div>
        <button className="btn btn-secondary" onClick={() => go("documents", { folder: "stmt" })}>Past statements</button>
      </div>
    </div>
  );
}

function WirePage() {
  const [copied, setCopied] = useState(false);
  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="page-title">Wire Instructions</div>
          <div className="page-sub">Where you send capital calls, and where we send your distributions</div>
        </div>
      </div>
      <div className="card">
        <div className="card-head">
          <div className="card-title">Fund account — for capital call payments</div>
          <button className="btn btn-secondary" onClick={() => { setCopied(true); setTimeout(() => setCopied(false), 1600); }}>
            <Ic d="copy" size={14} /> {copied ? "Copied" : "Copy details"}
          </button>
        </div>
        <div className="stmt-rows">
          <div className="stmt-row"><span>Receiving bank</span><span className="strong">{FUND.wire.bank}</span></div>
          <div className="stmt-row"><span>ABA / routing</span><span className="num">{FUND.wire.aba}</span></div>
          <div className="stmt-row"><span>Account name</span><span>{FUND.wire.accountName}</span></div>
          <div className="stmt-row"><span>Account number</span><span className="num">{FUND.wire.accountNo}</span></div>
          <div className="stmt-row"><span>Wire reference</span><span className="strong">{FUND.wire.reference}</span></div>
        </div>
      </div>
      <div className="card section-gap">
        <div className="card-head">
          <div className="card-title">Your account — for distributions</div>
          <Chip tone="pos"><Ic d="check" size={11} sw={2.4} /> Verified on file</Chip>
        </div>
        <div className="stmt-rows">
          <div className="stmt-row"><span>Bank</span><span className="strong">{LP.bank.name}</span></div>
          <div className="stmt-row"><span>Account type</span><span>{LP.bank.type}</span></div>
          <div className="stmt-row"><span>Routing number</span><span className="num">{LP.bank.routing}</span></div>
          <div className="stmt-row"><span>Account number</span><span className="num">{LP.bank.account}</span></div>
        </div>
        <div className="card-head" style={{ borderTop: "1px solid var(--border)", borderBottom: "none" }}>
          <div className="page-sub">Changes require callback verification by the fund administrator before taking effect.</div>
          <button className="btn btn-secondary">Request change</button>
        </div>
      </div>
      <div className="alert alert-warn section-gap" style={{ marginBottom: 0 }}>
        <span className="ic"><Ic d="warn" size={17} /></span>
        <div className="grow"><div className="t">Fraud protection</div>
        <div className="d">Zive will never email you new wire instructions. Always confirm details on this page or on the signed call notice before sending funds.</div></div>
      </div>
    </div>
  );
}

/* ---------------- documents + viewers ---------------- */

function K1Doc({ file }) {
  const year = file.year;
  const is25 = year === "2025";
  return (
    <div className="viewer-doc">
      <div className="k1-head">
        <div className="k1-form">Schedule K-1<br /><span className="f">(Form 1065)</span><br />Department of the Treasury<br />Internal Revenue Service</div>
        <div className="k1-title"><div className="y">{year}</div><div className="t">Partner's Share of Income, Deductions,<br />Credits, etc.</div></div>
        <div className="k1-omb">OMB No. 1545-0123<br />Final K-1 ☐ &nbsp; Amended K-1 ☐</div>
      </div>
      <div className="k1-part">Part I — Information About the Partnership</div>
      <div className="k1-grid">
        <div className="k1-box"><div className="l">A — Partnership's EIN</div><div className="v num">87-2241065</div></div>
        <div className="k1-box"><div className="l">B — Partnership's name, address</div><div className="v">Banyan Ventures, L.P.<br />548 Sand Hill Road, Menlo Park, CA 94025</div></div>
        <div className="k1-box full"><div className="l">C — IRS center where partnership filed return</div><div className="v">e-file</div></div>
      </div>
      <div className="k1-part">Part II — Information About the Partner</div>
      <div className="k1-grid">
        <div className="k1-box"><div className="l">E — Partner's SSN or TIN</div><div className="v num">{LP.taxId}</div></div>
        <div className="k1-box"><div className="l">F — Partner's name, address</div><div className="v">{LP.entity}<br />{LP.address}</div></div>
        <div className="k1-box"><div className="l">G — Partner type</div><div className="v">Limited partner · Trust</div></div>
        <div className="k1-box"><div className="l">J — Profit / loss / capital share</div><div className="v num">3.46% / 3.46% / 3.46%</div></div>
        <div className="k1-box"><div className="l">L — Beginning capital account</div><div className="v num">{is25 ? "$293,544.40" : "$182,127.16"}</div></div>
        <div className="k1-box"><div className="l">L — Capital contributed during year</div><div className="v num">{is25 ? "$84,549.39" : "$183,750.00"}</div></div>
        <div className="k1-box"><div className="l">L — Current year net income (loss)</div><div className="v num">{is25 ? "$52,164.18" : "($72,332.76)"}</div></div>
        <div className="k1-box"><div className="l">L — Ending capital account</div><div className="v num">{is25 ? "$430,257.97" : "$293,544.40"}</div></div>
      </div>
      <div className="k1-part">Part III — Partner's Share of Current Year Income</div>
      <div className="k1-grid">
        <div className="k1-box"><div className="l">1 — Ordinary business income (loss)</div><div className="v num">{is25 ? "($1,151.42)" : "($942.18)"}</div></div>
        <div className="k1-box"><div className="l">5 — Interest income</div><div className="v num">{is25 ? "$1,082.27" : "$764.51"}</div></div>
        <div className="k1-box"><div className="l">9a — Net long-term capital gain (loss)</div><div className="v num">$0.00</div></div>
        <div className="k1-box"><div className="l">13 — Other deductions (Code W)</div><div className="v num">{is25 ? "$6,212.50" : "$5,468.75"}</div></div>
        <div className="k1-box"><div className="l">19 — Distributions</div><div className="v num">$0.00</div></div>
        <div className="k1-box"><div className="l">20 — Other information (Code Z)</div><div className="v">STMT attached</div></div>
      </div>
      <p style={{ marginTop: 14, fontSize: 9, color: "#666" }}>
        For Paperwork Reduction Act Notice, see the Instructions for Form 1065. — This is a demo document with dummy data.
      </p>
    </div>
  );
}

function NoticeDoc({ file }) {
  const c = file.call;
  return (
    <div className="viewer-doc doc-letter">
      <Wordmark h={24} />
      <h2 style={{ marginTop: 18 }}>Capital Call Notice #{c.num}</h2>
      <div className="muted">Banyan Ventures, L.P. · Issued {c.issued}</div>
      <p style={{ marginTop: 14 }}>To: <b>{LP.entity}</b></p>
      <p>Pursuant to Section 4.1 of the Amended &amp; Restated Limited Partnership Agreement, the General Partner hereby calls capital as follows:</p>
      <table>
        <tbody>
          <tr><th>Commitment</th><td className="num">{fmt(FUND.committed)}</td></tr>
          <tr><th>This call ({c.pct} of commitment)</th><td className="num"><b>{fmt(c.amount)}</b></td></tr>
          <tr><th>Due date</th><td>{c.due}</td></tr>
          <tr><th>Wire to</th><td>{FUND.wire.bank} · ABA {FUND.wire.aba} · Acct {FUND.wire.accountNo}</td></tr>
          <tr><th>Reference</th><td>{FUND.wire.reference}</td></tr>
        </tbody>
      </table>
      <p>Funds will be applied to investments and partnership expenses as set out in the quarterly report. Please reference your wire as indicated to ensure prompt crediting.</p>
      <p style={{ marginTop: 22 }}>Banyan Ventures GP, LLC<br /><span className="muted">General Partner</span></p>
    </div>
  );
}

function ReceiptDoc({ file }) {
  const c = file.call;
  return (
    <div className="viewer-doc doc-letter">
      <Wordmark h={24} />
      <h2 style={{ marginTop: 18 }}>Payment Confirmation — Capital Call #{c.num}</h2>
      <div className="muted">Banyan Ventures, L.P. · {c.paidOn}</div>
      <p style={{ marginTop: 14 }}>This confirms receipt of payment from <b>{LP.entity}</b>:</p>
      <table>
        <tbody>
          <tr><th>Capital call</th><td>#{c.num} (issued {c.issued})</td></tr>
          <tr><th>Amount received</th><td className="num"><b>{fmt(c.amount)}</b></td></tr>
          <tr><th>Value date</th><td>{c.paidOn}</td></tr>
          <tr><th>Method</th><td>Fedwire · ref {FUND.wire.reference}</td></tr>
          <tr><th>Applied to</th><td>Capital account — {LP.entity}</td></tr>
        </tbody>
      </table>
      <div className="stamp">Received &amp; reconciled</div>
      <p style={{ marginTop: 18 }} className="muted">This confirmation is the official record of payment and is retained permanently in your document vault.</p>
    </div>
  );
}

function LetterDoc({ file }) {
  return (
    <div className="viewer-doc doc-letter">
      <Wordmark h={24} />
      <h2 style={{ marginTop: 18 }}>{file.name}</h2>
      <div className="muted">Banyan Ventures, L.P. · Posted {file.date} · {file.size}</div>
      <p style={{ marginTop: 16 }}>This is a placeholder preview for the demo. In production, the executed PDF renders here with full fidelity, page navigation and text search.</p>
      <p className="muted">Document type: {file.type}</p>
    </div>
  );
}

function DocumentsPage({ ctx, go }) {
  const [folder, setFolder] = useState(ctx?.folder || null);
  const [fileId, setFileId] = useState(ctx?.file || null);
  useEffect(() => { setFolder(ctx?.folder || null); setFileId(ctx?.file || null); }, [ctx]);

  const files = folder ? FILES[folder] : null;
  const file = files && fileId ? files.find(f => f.id === fileId) : null;
  const folderMeta = folder ? DOC_FOLDERS.find(f => f.key === folder) : null;

  const crumbs = (
    <div className="crumbs">
      <button onClick={() => { setFolder(null); setFileId(null); }}>Documents</button>
      {folderMeta && <React.Fragment><span className="sep">/</span>
        {file ? <button onClick={() => setFileId(null)}>{folderMeta.name}</button> : <span className="here">{folderMeta.name}</span>}
      </React.Fragment>}
      {file && <React.Fragment><span className="sep">/</span><span className="here">{file.name.length > 48 ? file.name.slice(0, 48) + "…" : file.name}</span></React.Fragment>}
    </div>
  );

  if (file) {
    const Viewer = file.viewer === "k1" ? K1Doc : file.viewer === "notice" ? NoticeDoc : file.viewer === "receipt" ? ReceiptDoc : LetterDoc;
    return (
      <div className="page fade-in">
        {crumbs}
        <div className="viewer-wrap">
          <Viewer file={file} />
          <div className="viewer-side">
            <div className="card card-pad">
              <div className="card-title" style={{ marginBottom: 12 }}>{file.type} document</div>
              <div className="stmt-row" style={{ padding: "7px 0" }}><span style={{ color: "var(--muted)" }}>Posted</span><span>{file.date}</span></div>
              <div className="stmt-row" style={{ padding: "7px 0" }}><span style={{ color: "var(--muted)" }}>Size</span><span>{file.size}</span></div>
              <div className="stmt-row" style={{ padding: "7px 0", borderBottom: "none" }}><span style={{ color: "var(--muted)" }}>Status</span><Chip tone="pos"><Ic d="check" size={11} sw={2.4} /> Official record</Chip></div>
              <button className="btn btn-primary btn-block" style={{ marginTop: 14 }}><Ic d="download" size={14} /> Download PDF</button>
              <button className="btn btn-secondary btn-block" style={{ marginTop: 8 }}><Ic d="mail" size={14} /> Share with accountant</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (folder) {
    return (
      <div className="page fade-in">
        {crumbs}
        <div className="page-head"><div><div className="page-title">{folderMeta.name}</div>
          <div className="page-sub">{files.length ? `${files.length} documents · newest first` : "No documents yet"}</div></div></div>
        <div className="card">
          {files.length === 0 ? (
            <Empty icon="dist" title="Nothing here yet" desc="When the fund posts a document of this type, it appears here and you're notified by email." />
          ) : (
            <table className="tbl">
              <thead><tr><th style={{ width: 44 }}></th><th>Name</th><th>Type</th><th>Posted</th><th>Size</th><th className="r"></th></tr></thead>
              <tbody>
                {files.map(f => (
                  <tr key={f.id} style={{ cursor: "pointer" }} onClick={() => setFileId(f.id)}>
                    <td><div className="file-ic">PDF</div></td>
                    <td className="strong">{f.name}</td>
                    <td><Chip>{f.type}</Chip></td>
                    <td>{f.date}</td><td>{f.size}</td>
                    <td className="r"><span className="btn btn-ghost" style={{ padding: "3px 8px", fontSize: 12 }}>Open</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div>
          <div className="page-title">Documents</div>
          <div className="page-sub">The official record — every notice, statement, agreement and tax form, permanently retained</div>
        </div>
      </div>
      <div className="folder-grid">
        {DOC_FOLDERS.map(f => (
          <button key={f.key} className="folder" onClick={() => setFolder(f.key)}>
            <div className="ic"><Ic d={f.icon} size={17} /></div>
            <div style={{ textAlign: "left" }}><div className="t">{f.name}</div><div className="d">{f.desc}</div></div>
          </button>
        ))}
      </div>
      <div className="alert alert-info section-gap" style={{ marginBottom: 0 }}>
        <span className="ic"><Ic d="tax" size={17} /></span>
        <div className="grow"><div className="t">Tax season?</div>
        <div className="d">Your 2025 Schedule K-1 was posted Mar 28, 2026 — K-1s → 2025. You can download it or share it with your accountant directly.</div></div>
        <button className="btn btn-secondary" onClick={() => go("documents", { folder: "k1", file: "k1-2025" })}>Open 2025 K-1</button>
      </div>
    </div>
  );
}

function SettingsPage() {
  const [prefs, setPrefs] = useState({ calls: true, dists: true, tax: true, stmts: true, news: false });
  return (
    <div className="page fade-in">
      <div className="page-head"><div><div className="page-title">Settings</div>
        <div className="page-sub">Profile and notification preferences</div></div></div>
      <div className="card">
        <div className="card-head"><div className="card-title">Investor profile</div><button className="btn btn-secondary">Edit</button></div>
        <div className="stmt-rows">
          <div className="stmt-row"><span>Legal entity</span><span className="strong">{LP.entity}</span></div>
          <div className="stmt-row"><span>Authorized person</span><span>{LP.person}</span></div>
          <div className="stmt-row"><span>Email</span><span>{LP.email}</span></div>
          <div className="stmt-row"><span>Tax ID</span><span className="num">{LP.taxId}</span></div>
          <div className="stmt-row"><span>Mailing address</span><span>{LP.address}</span></div>
        </div>
      </div>
      <div className="card section-gap">
        <div className="card-head"><div className="card-title">Email notifications</div><Chip tone="acc">{LP.email}</Chip></div>
        <div className="card-pad" style={{ paddingTop: 2, paddingBottom: 6 }}>
          {[
            { k: "calls", t: "Capital calls", d: "New call notices, due-date reminders, payment confirmations" },
            { k: "dists", t: "Distributions", d: "Distribution notices and wire confirmations" },
            { k: "tax", t: "Tax documents", d: "Schedule K-1s and estimates" },
            { k: "stmts", t: "Statements & reports", d: "Quarterly statements, audited financials" },
            { k: "news", t: "Fund news", d: "Portfolio updates from the GP" },
          ].map(it => (
            <div key={it.k} className="toggle-row">
              <div><div className="t">{it.t}</div><div className="d">{it.d}</div></div>
              <button className={"switch" + (prefs[it.k] ? " on" : "")} onClick={() => setPrefs(p => ({ ...p, [it.k]: !p[it.k] }))} aria-label={it.t}>
                <span className="knob" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Portal({ onSignOut, initialRoute }) {
  const [route, setRoute] = useState(initialRoute || { page: "overview", ctx: null });
  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const mainRef = useRef(null);
  const go = (page, ctx = null) => { setRoute({ page, ctx }); setNotifOpen(false); setMenuOpen(false); if (mainRef.current) mainRef.current.scrollTop = 0; };

  const body = () => {
    switch (route.page) {
      case "overview": return <OverviewPage go={go} />;
      case "commitments": return <CommitmentsPage go={go} />;
      case "investments": return <InvestmentsPage />;
      case "financials": return <FinancialsPage />;
      case "calls": return <CapitalCallsPage go={go} />;
      case "distributions": return <DistributionsPage />;
      case "personal": return <PersonalStatementPage go={go} />;
      case "wire": return <WirePage />;
      case "documents": return <DocumentsPage ctx={route.ctx} go={go} />;
      case "settings": return <SettingsPage />;
      default: return <OverviewPage go={go} />;
    }
  };

  return (
    <div className="portal fade-in">
      <aside className="sidebar">
        <div className="sidebar-head"><Wordmark /></div>
        <div className="entity-chip">
          <div className="badge">GK</div>
          <div className="name">THE GARGI M. KEELING<br />REVOCABLE TRUST</div>
        </div>
        {NAV.map(group => (
          <div key={group.label} className="nav-group">
            <div className="nav-label">{group.label}</div>
            {group.items.map(it => (
              <button key={it.id} className={"nav-item" + (route.page === it.id ? " active" : "")} onClick={() => go(it.id)}>
                <span className="ico"><Ic d={it.icon} size={16} /></span>
                {it.label}
                {it.count ? <span className="count">{it.count}</span> : null}
              </button>
            ))}
          </div>
        ))}
        <div className="sidebar-foot">
          <button className={"nav-item" + (route.page === "settings" ? " active" : "")} onClick={() => go("settings")}>
            <span className="ico"><Ic d="settings" size={16} /></span> Settings
          </button>
          <button className="nav-item" onClick={onSignOut}>
            <span className="ico"><Ic d="logout" size={16} /></span> Sign out
          </button>
        </div>
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative" }}>
        <header className="topbar">
          <div className="fund-switch">
            <div className="logo">BV</div>
            <div>
              <div className="name">{FUND.name}</div>
              <div className="role">LIMITED PARTNER · 1 FUND</div>
            </div>
          </div>
          <div className="topbar-search"><Ic d="search" size={14} /> Search documents, calls, statements…</div>
          <div className="topbar-right">
            <button className="icon-btn" onClick={() => { setNotifOpen(o => !o); setMenuOpen(false); }} aria-label="Notifications">
              <Ic d="bell" size={17} /><span className="dot" />
            </button>
            <button className="topbar-user" onClick={() => { setMenuOpen(o => !o); setNotifOpen(false); }} aria-label="Account">
              <span className="n">{LP.person}</span>
              <Ic d="chevD" size={13} />
              <span className="avatar">{LP.initials}</span>
            </button>
          </div>
        </header>
        {notifOpen && (
          <div className="notif-panel">
            <div className="card-head" style={{ padding: "12px 18px" }}>
              <div className="card-title">Notifications</div><Chip tone="acc">{NOTIFICATIONS.length} new</Chip>
            </div>
            {NOTIFICATIONS.map((n, i) => (
              <button key={i} className="notif-row" onClick={() => go(n.page, n.ctx || null)}>
                <div className="activity-ic" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}><Ic d="bell" size={14} /></div>
                <div className="grow"><div className="t">{n.t}</div><div className="d">{n.d}</div><div className="when">{n.when}</div></div>
              </button>
            ))}
          </div>
        )}
        {menuOpen && (
          <div className="menu-panel">
            <div className="menu-head"><div className="n">{LP.person}</div><div className="e">{LP.email}</div></div>
            <button className="menu-item" onClick={() => go("settings")}><Ic d="settings" size={15} /> Settings</button>
            <button className="menu-item" onClick={() => go("documents")}><Ic d="folder" size={15} /> Documents</button>
            <button className="menu-item" onClick={onSignOut}><Ic d="logout" size={15} /> Sign out</button>
          </div>
        )}
        <main className="main" ref={mainRef} onClick={() => { if (notifOpen) setNotifOpen(false); if (menuOpen) setMenuOpen(false); }}>
          {body()}
        </main>
      </div>
    </div>
  );
}

/* ============================================================
   Demo shell — stage machine + demo bar
   ============================================================ */

const STAGES = [
  { id: "email", label: "1 · Email notification" },
  { id: "login", label: "2 · Sign in" },
  { id: "onboarding", label: "3 · Onboarding" },
  { id: "portal", label: "4 · LP Portal" },
];

function DemoApp() {
  const params = new URLSearchParams(window.location.search);
  const [stage, setStage] = useState(() => {
    const s = params.get("stage");
    if (params.get("page")) return "portal";
    return STAGES.some(x => x.id === s) ? s : "email";
  });
  const initialRoute = params.get("page")
    ? { page: params.get("page"), ctx: params.get("folder") ? { folder: params.get("folder"), file: params.get("file") || null } : null }
    : null;
  const idx = STAGES.findIndex(s => s.id === stage);
  return (
    <React.Fragment>
      <div className="demo-bar">
        <span className="brand">zive · LP portal demo</span>
        <div className="demo-steps">
          {STAGES.map((s, i) => (
            <React.Fragment key={s.id}>
              {i > 0 && <span className="demo-sep">›</span>}
              <button className={"demo-step" + (i === idx ? " active" : "") + (i < idx ? " done" : "")} onClick={() => setStage(s.id)}>
                {i < idx && <span className="tick">✓</span>}{s.label}
              </button>
            </React.Fragment>
          ))}
        </div>
        <button className="demo-restart" onClick={() => setStage("email")}>↺ Restart demo</button>
      </div>
      <div className="stage-root">
        {stage === "email" && <EmailStage onLogin={() => setStage("login")} />}
        {stage === "login" && <LoginStage onDone={() => setStage("onboarding")} />}
        {stage === "onboarding" && <OnboardingStage onDone={() => setStage("portal")} />}
        {stage === "portal" && <Portal initialRoute={initialRoute} onSignOut={() => setStage("email")} />}
      </div>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<DemoApp />);
})();
