// Zive — Flow AI: conversation-first AI surface.
// Single-file IIFE. Mounts to #root. Independent of app.jsx's auto-mount
// (which is suppressed via window.__ZEXP_SKIP_APP_BOOT). Uses script-globals
// (Icon, ZiveWordmark, etc.) attached to window by components.jsx.

(function () {
  const { useState, useEffect, useRef, useMemo, useLayoutEffect } = React;

  // ──────────────────────────────────────────────────────────────
  // 1. Entity catalog (3 only — "All" entity dropped)
  // ──────────────────────────────────────────────────────────────
  const ENTITIES = [
    { id: "vcfo", label: "Admin VCFO", short: "VCFO", greeting: "managing the fund" },
    { id: "lp",   label: "Admin V LP", short: "LP",   greeting: "as the LP" },
    { id: "home", label: "Home",       short: "Home", greeting: "across workspaces" },
  ];
  const ENTITY_BY_ID = Object.fromEntries(ENTITIES.map(e => [e.id, e]));

  // ──────────────────────────────────────────────────────────────
  // 2. Starter prompts per entity
  // ──────────────────────────────────────────────────────────────
  const STARTERS = {
    vcfo: [
      "Where are we on NAV today?",
      "Draft a capital call for Admin V at 12%",
      "What needs my attention this week?",
      "Generate the Q4 LP update",
    ],
    lp: [
      "What's my balance across funds?",
      "Show me my recent capital activity",
      "When is my next distribution?",
      "Summarize my latest tax docs",
    ],
    home: [
      "What needs my attention today?",
      "Catch me up — what changed since Friday?",
      "Show my open approvals",
      "Calendar for the week",
    ],
  };

  // ──────────────────────────────────────────────────────────────
  // 3. Canned AI responses — 4 prompts × 3 entities
  //    Each: { answer, tools, cards, followups, sources }
  // ──────────────────────────────────────────────────────────────
  const RESPONSES = {
    vcfo: {
      "Where are we on NAV today?": {
        answer: "Aggregate NAV is $129.4M, up 2.1% vs Q3 [1]. Admin V was the main driver after the Q3 mark-up; the other two funds were close to flat [2].",
        tools: ["Pulling 3 fund NAVs", "Joining latest valuations", "Computing aggregate", "Done"],
        cards: [
          { id: "nav-kpi", type: "kpiOrb", size: "md", label: "Aggregate NAV", value: "$129.4M", delta: "+2.1% vs Q3" },
          { id: "nav-spark", type: "sparkline", size: "md", label: "NAV trend — 12 months", points: [110,113,118,122,125,123,127,128,129,128,130,129.4], value: "$129.4M" },
          { id: "nav-mix", type: "kpiOrb", size: "md", label: "Largest fund", value: "Admin V", delta: "45% of NAV" },
          { id: "nav-table", type: "table", size: "lg", title: "NAV by fund", columns: ["Fund", "NAV", "Δ Q-o-Q"], rows: [
            ["Admin Ventures V", "$58.2M", "+3.4%"],
            ["Admin Ventures IV", "$41.0M", "+0.9%"],
            ["Admin Real Estate II", "$30.2M", "+1.6%"],
          ], summary: "Driver: Admin V valuations marked up after Q3 close." },
          { id: "nav-insight", type: "insight", size: "lg", title: "AI note", body: "Three of your portfolio cos are up-round candidates in the next 90 days [3]; mark-to-mark would lift aggregate NAV ~6%." },
        ],
        followups: ["Show me up-round candidates", "Compare Admin V to peer benchmark", "Draft Q4 LP update"],
        sources: { 1: "Source: Internal NAV roll-up, 2026-05-27", 2: "Source: Q4 valuation memo, Admin IV / RE II", 3: "Source: Portfolio pipeline tracker" },
      },
      "Draft a capital call for Admin V at 12%": {
        answer: "Drafted a 12% call against Admin Ventures V: $6.96M total across 41 LPs [1]. Wire instructions and side-letter exceptions are flagged for review [2].",
        tools: ["Loading Admin V cap table", "Calculating 12% of $58M unfunded", "Allocating to 41 LPs", "Drafting wire packet"],
        cards: [
          { id: "cc-amount", type: "kpiOrb", size: "sm", label: "Total call", value: "$6.96M", delta: "12% of unfunded" },
          { id: "cc-lps", type: "kpiOrb", size: "sm", label: "LPs notified", value: "41", delta: "2 with side letters" },
          { id: "cc-date", type: "kpiOrb", size: "sm", label: "Due", value: "Jun 19", delta: "10 business days" },
          { id: "cc-actions", type: "action", size: "sm", label: "Send notices", icon: "send", hint: "Email + portal" },
          { id: "cc-table", type: "table", size: "xl", title: "LP allocation preview", columns: ["LP", "Commitment", "Call $", "Side letter"], rows: [
            ["Maple Endowment", "$5.0M", "$600K", "—"],
            ["Cedar Family Office", "$3.5M", "$420K", "30-day notice"],
            ["Northwood Pension", "$4.2M", "$504K", "—"],
            ["Riverbend Capital", "$2.8M", "$336K", "Wire-only"],
            ["Atlas Foundation", "$3.0M", "$360K", "—"],
            ["… 36 more LPs", "—", "$4.74M", "—"],
          ], summary: "2 LPs have side-letter language that delays notice — flagged for legal." },
          { id: "cc-task", type: "tasks", size: "md", title: "Pre-send checks", items: [
            { text: "Confirm wire instructions on file", due: "Today" },
            { text: "Legal sign-off on Cedar / Riverbend", due: "Today" },
            { text: "Cohort accountant review", due: "Tomorrow" },
          ] },
        ],
        followups: ["Send notices now", "Show the per-LP letter", "What if we go 8% instead?"],
        sources: { 1: "Source: Admin V cap table, 2026-05-27", 2: "Source: LP side letters DB" },
      },
      "What needs my attention this week?": {
        answer: "5 items rising to the top: one capital call to approve, two reconciliations stalled, a tax-form deadline, and a valuation memo overdue [1].",
        tools: ["Scanning open tasks", "Ranking by deadline + financial impact", "Cross-checking calendar"],
        cards: [
          { id: "att-tasks", type: "tasks", size: "lg", title: "Top this week", items: [
            { text: "Approve Admin V capital call ($6.96M)", due: "Today" },
            { text: "Reconcile Admin IV cash — JPM ending 4471", due: "Tomorrow" },
            { text: "K-1 prep for 41 LPs (Admin V)", due: "Fri" },
            { text: "Sign Admin RE II valuation memo", due: "Fri" },
            { text: "LP committee deck — Real Estate II", due: "Mon" },
          ] },
          { id: "att-kpi", type: "kpiOrb", size: "sm", label: "Open approvals", value: "7", delta: "2 aging > 5d" },
          { id: "att-kpi2", type: "kpiOrb", size: "sm", label: "Cash to move", value: "$2.4M", delta: "3 wires queued" },
          { id: "att-doc", type: "doc", size: "md", title: "Admin RE II valuation memo", updated: "3 days ago", snippet: "Cap rate updated to 6.2% after April lease renewals; NAV +1.6%." },
        ],
        followups: ["Approve the call", "Start the Admin IV recon", "Open the valuation memo"],
        sources: { 1: "Source: Workflow queue + calendar" },
      },
      "Generate the Q4 LP update": {
        answer: "Draft of the Q4 letter for Admin Ventures V is ready — chat history on the left, live doc on the right [1][2].",
        tools: ["Loading Q4 financials", "Pulling portfolio company updates", "Drafting sections", "Inserting citations"],
        cards: [
          { id: "qr-doc", type: "doc", size: "lg", title: "Q4 2025 LP Letter — Admin Ventures V", updated: "draft just now", snippet: "Dear Limited Partners, Admin V closed Q4 with NAV of $58.2M, up 3.4% Q-o-Q…" },
          { id: "qr-kpi", type: "kpiOrb", size: "md", label: "Net IRR (Admin V)", value: "18.4%", delta: "+1.2pp vs Q3" },
        ],
        followups: ["Tighten the summary", "Add a portfolio company highlight", "Export to PDF"],
        sources: { 1: "Source: Q4 financials, finalized 2026-04-30", 2: "Source: Portfolio company memos" },
      },
    },

    lp: {
      "What's my balance across funds?": {
        answer: "Your combined LP balance is $4.62M across two commitments [1]. Admin V is mostly called; Admin IV has ~$1.1M unfunded [2].",
        tools: ["Pulling capital accounts", "Computing called vs. unfunded", "Joining valuations"],
        cards: [
          { id: "lp-bal", type: "kpiOrb", size: "md", label: "Total LP balance", value: "$4.62M", delta: "+1.8% Q-o-Q" },
          { id: "lp-call", type: "kpiOrb", size: "sm", label: "% Called", value: "76%", delta: "of $6.5M committed" },
          { id: "lp-unf", type: "kpiOrb", size: "sm", label: "Unfunded", value: "$1.56M", delta: "Across 2 funds" },
          { id: "lp-table", type: "table", size: "xl", title: "Capital accounts", columns: ["Fund", "Committed", "Called", "NAV", "DPI"], rows: [
            ["Admin Ventures V", "$3.0M", "$2.43M", "$3.18M", "0.12x"],
            ["Admin Ventures IV", "$3.5M", "$2.50M", "$1.44M", "0.84x"],
          ], summary: "Admin IV is in harvest mode; Admin V is still in investment period." },
          { id: "lp-spark", type: "sparkline", size: "md", label: "Total balance — 12 mo", points: [4.20,4.22,4.28,4.31,4.35,4.40,4.45,4.48,4.50,4.55,4.58,4.62], value: "$4.62M" },
        ],
        followups: ["Show me my distributions", "What's my unfunded?", "Project NAV for next quarter"],
        sources: { 1: "Source: Capital account statements, Q1 2026", 2: "Source: Admin IV / V cap tables" },
      },
      "Show me my recent capital activity": {
        answer: "Last 90 days: 1 call ($120K to Admin V) and 1 distribution ($86K from Admin IV) [1].",
        tools: ["Pulling cash ledger", "Filtering last 90 days", "Tagging activity type"],
        cards: [
          { id: "act-table", type: "table", size: "xl", title: "Capital activity — last 90 days", columns: ["Date", "Fund", "Type", "Amount"], rows: [
            ["2026-04-12", "Admin Ventures IV", "Distribution", "+$86,400"],
            ["2026-03-08", "Admin Ventures V",  "Capital call (8%)", "-$120,000"],
            ["2026-02-14", "Admin Ventures IV", "Distribution",   "+$42,800"],
          ], summary: "Net: +$9.2K into your account." },
          { id: "act-kpi", type: "kpiOrb", size: "md", label: "Net 90 days", value: "+$9.2K", delta: "Distributions > calls" },
          { id: "act-doc", type: "doc", size: "md", title: "Wire confirmation — 2026-04-12", updated: "Apr 12, 2026", snippet: "JPM Chase, account ending 1180, distribution from Admin Ventures IV." },
        ],
        followups: ["Year-to-date summary", "Tax impact?", "Download confirmations"],
        sources: { 1: "Source: LP cash ledger, JPM + portal records" },
      },
      "When is my next distribution?": {
        answer: "Admin IV is targeting a distribution window between Jul 15 and Aug 1, sized in the $60–90K range based on current portfolio realizations [1].",
        tools: ["Reading distribution calendar", "Modeling realization pipeline", "Computing your pro-rata"],
        cards: [
          { id: "dist-kpi", type: "kpiOrb", size: "md", label: "Estimated distribution", value: "$60–90K", delta: "Jul 15 – Aug 1" },
          { id: "dist-source", type: "insight", size: "md", title: "What's driving it", body: "Two portfolio realizations in escrow (Acorn Health, Plover Robotics) [2]. Your pro-rata is ~3.4% of Admin IV." },
          { id: "dist-doc", type: "doc", size: "md", title: "Admin IV — Realization pipeline", updated: "2 weeks ago", snippet: "3 confirmed exits + 2 partial liquidations expected through Q3 2026." },
          { id: "dist-task", type: "tasks", size: "md", title: "Reminders", items: [
            { text: "Confirm wire instructions on file", due: "Before Jul 1" },
            { text: "Tax W-9 refresh (annual)", due: "Jul 15" },
          ] },
        ],
        followups: ["Show prior distributions", "What's the tax treatment?", "Forecast for full year"],
        sources: { 1: "Source: Distribution model, Admin IV", 2: "Source: Realization tracker" },
      },
      "Summarize my latest tax docs": {
        answer: "Your 2025 K-1s are finalized for both funds. Net taxable: ~$48.2K, mostly long-term gains from Admin IV exits [1].",
        tools: ["Loading K-1 packets", "Extracting taxable line items", "Categorizing by holding period"],
        cards: [
          { id: "tax-kpi", type: "kpiOrb", size: "md", label: "Net taxable 2025", value: "$48.2K", delta: "+22% YoY" },
          { id: "tax-kpi2", type: "kpiOrb", size: "sm", label: "LT gains", value: "$41.6K", delta: "86% of total" },
          { id: "tax-kpi3", type: "kpiOrb", size: "sm", label: "Ordinary", value: "$6.6K", delta: "Mostly carry interest" },
          { id: "tax-docs", type: "doc", size: "md", title: "K-1 — Admin Ventures IV (2025)", updated: "Mar 28, 2026", snippet: "Box 9a long-term gains: $32.4K. Box 11C interest: $4.1K." },
          { id: "tax-table", type: "table", size: "lg", title: "K-1 by fund", columns: ["Fund", "LT gains", "ST gains", "Ordinary", "Total"], rows: [
            ["Admin Ventures IV", "$32.4K", "$0", "$4.1K", "$36.5K"],
            ["Admin Ventures V",  "$9.2K",  "$0", "$2.5K", "$11.7K"],
          ], summary: "Admin IV is the dominant tax driver this year." },
        ],
        followups: ["Estimate 2026 tax", "Send to my accountant", "Show prior year K-1s"],
        sources: { 1: "Source: Schedule K-1, Admin IV / V, 2025" },
      },
    },

    home: {
      "What needs my attention today?": {
        answer: "4 items: a wire to approve, one LP question waiting, an overdue tax doc, and a calendar conflict at 3pm [1].",
        tools: ["Scanning inbox + portal", "Ranking by SLA + sender", "Checking calendar"],
        cards: [
          { id: "h-tasks", type: "tasks", size: "lg", title: "Today's queue", items: [
            { text: "Approve wire — Admin V $120K out", due: "By 2pm" },
            { text: "Reply to Maple Endowment (Q4 follow-up)", due: "Today" },
            { text: "K-1 for Acorn LLC overdue 2 days", due: "Overdue" },
            { text: "Conflict: 3pm board call ↔ LP intro", due: "3:00 PM" },
          ] },
          { id: "h-kpi", type: "kpiOrb", size: "sm", label: "Inbox unread", value: "12", delta: "3 from LPs" },
          { id: "h-kpi2", type: "kpiOrb", size: "sm", label: "Approvals", value: "4", delta: "1 aging > 3d" },
          { id: "h-action", type: "action", size: "sm", label: "Start morning brief", icon: "play", hint: "5 min" },
        ],
        followups: ["Approve the wire", "Draft reply to Maple", "Reschedule 3pm"],
        sources: { 1: "Source: Unified inbox + portal queue" },
      },
      "Catch me up — what changed since Friday?": {
        answer: "Since Friday: 3 new portfolio company updates, NAV moved +0.4% on Admin V, 2 new LP doc views, and one capital call was wired in [1].",
        tools: ["Diffing activity log Fri → now", "Summarizing by category", "Surfacing material items"],
        cards: [
          { id: "catch-insight", type: "insight", size: "lg", title: "Material changes", body: "Plover Robotics signed term sheet (Series B, $14M pre) [2]. Maple Endowment viewed Q4 letter (engagement signal). Admin V cash position +$420K from settled call." },
          { id: "catch-kpi", type: "kpiOrb", size: "sm", label: "NAV Δ", value: "+0.4%", delta: "Admin V only" },
          { id: "catch-kpi2", type: "kpiOrb", size: "sm", label: "New updates", value: "3", delta: "Portfolio cos" },
          { id: "catch-table", type: "table", size: "lg", title: "Activity since Friday", columns: ["When", "Event", "Owner"], rows: [
            ["Mon 9:02 AM", "Plover Robotics — Series B term sheet", "Investments"],
            ["Mon 11:14 AM", "Admin V capital call settled (+$420K)", "Operations"],
            ["Sun 4:42 PM", "Maple Endowment viewed Q4 letter", "IR"],
            ["Sat 10:00 AM", "Atlas Foundation submitted W-9 update", "Compliance"],
          ] },
        ],
        followups: ["Open the Plover term sheet", "Draft a follow-up to Maple", "Show me prior weeks"],
        sources: { 1: "Source: Activity stream, Fri 5pm — now", 2: "Source: Portfolio CRM" },
      },
      "Show my open approvals": {
        answer: "7 approvals open. 2 are aging more than 3 days [1].",
        tools: ["Querying approval queue", "Sorting by aging + amount"],
        cards: [
          { id: "ap-table", type: "table", size: "xl", title: "Open approvals", columns: ["Type", "Subject", "Amount", "Age", "Owner"], rows: [
            ["Wire", "Admin V — JPM 4471 → Vendor #28", "$120,000", "Today", "Operations"],
            ["Capital call", "Admin V 12% call", "$6.96M", "1 day", "VCFO"],
            ["Distribution", "Admin IV — partial Acorn", "$86,400", "2 days", "Operations"],
            ["Side letter", "Cedar Family Office — quarterly opt-in", "—", "4 days", "Legal"],
            ["Expense", "Audit retainer (KPMG)", "$24,000", "5 days", "Finance"],
            ["Doc release", "Q4 LP letter to portal", "—", "1 day", "IR"],
            ["Valuation", "Admin RE II — Q1 memo", "—", "3 days", "Investments"],
          ], summary: "2 items aging > 3d: Cedar side letter, KPMG retainer." },
          { id: "ap-kpi", type: "kpiOrb", size: "sm", label: "Open", value: "7", delta: "2 aging" },
          { id: "ap-kpi2", type: "kpiOrb", size: "sm", label: "$ at stake", value: "$7.18M", delta: "Across 4 items" },
        ],
        followups: ["Approve all under $50K", "Push aging items to the top", "Set up a daily approval block"],
        sources: { 1: "Source: Approvals queue" },
      },
      "Calendar for the week": {
        answer: "12 meetings, 3 hard-blocked focus windows, and one travel day on Thursday [1].",
        tools: ["Pulling calendar", "Detecting focus blocks + conflicts"],
        cards: [
          { id: "cal-tasks", type: "tasks", size: "lg", title: "This week", items: [
            { text: "Mon — Admin V capital call review", due: "10:00 AM" },
            { text: "Tue — LP committee (Real Estate II)", due: "2:00 PM" },
            { text: "Wed — Q4 letter sign-off", due: "11:00 AM" },
            { text: "Thu — Travel: SFO → JFK (LP roadshow)", due: "All day" },
            { text: "Fri — Operations weekly", due: "9:30 AM" },
          ] },
          { id: "cal-kpi", type: "kpiOrb", size: "sm", label: "Meetings", value: "12", delta: "Median 30 min" },
          { id: "cal-kpi2", type: "kpiOrb", size: "sm", label: "Focus blocks", value: "3", delta: "6 hours total" },
          { id: "cal-insight", type: "insight", size: "md", title: "AI note", body: "Thursday's travel removes most of your async response window — recommend drafting LP replies on Wednesday." },
        ],
        followups: ["Reschedule the 3pm conflict", "Add a Friday focus block", "Send me the LP roadshow brief"],
        sources: { 1: "Source: Google Calendar + travel itinerary" },
      },
    },
  };

  // ──────────────────────────────────────────────────────────────
  // 4. Helpers
  // ──────────────────────────────────────────────────────────────
  function renderAnswerText(text, sources) {
    if (!text) return null;
    const parts = [];
    const re = /\[(\d+)\]/g;
    let last = 0, m, i = 0;
    while ((m = re.exec(text)) !== null) {
      if (m.index > last) parts.push(text.slice(last, m.index));
      const n = m[1];
      const src = sources && sources[n] ? sources[n] : "Source #" + n;
      parts.push(
        <sup
          key={"c" + (i++)}
          className="fa-cite"
          data-source={src}
          title={src}
        >[{n}]</sup>
      );
      last = m.index + m[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  }

  function classNames(...xs) { return xs.filter(Boolean).join(" "); }

  // Build sparkline path
  function sparkPath(points, w, h, pad) {
    if (!points || !points.length) return "";
    const min = Math.min(...points), max = Math.max(...points);
    const range = max - min || 1;
    const n = points.length;
    const step = (w - pad * 2) / (n - 1);
    return points.map((p, i) => {
      const x = pad + i * step;
      const y = h - pad - ((p - min) / range) * (h - pad * 2);
      return (i === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1);
    }).join(" ");
  }

  // ──────────────────────────────────────────────────────────────
  // 4b. Beams background — vanilla port of the React+Tailwind
  //     animated-beams component. Driven by canvas + rAF.
  // ──────────────────────────────────────────────────────────────
  const MINIMUM_BEAMS = 20;
  const BEAM_OPACITY_MAP = { subtle: 0.7, medium: 0.85, strong: 1 };

  function createBeam(width, height, hueBase) {
    const angle = -35 + Math.random() * 10;
    return {
      x: Math.random() * width * 1.5 - width * 0.25,
      y: Math.random() * height * 1.5 - height * 0.25,
      width: 30 + Math.random() * 60,
      length: height * 2.5,
      angle,
      speed: 0.6 + Math.random() * 1.2,
      opacity: 0.12 + Math.random() * 0.16,
      hue: hueBase + Math.random() * 70,
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: 0.02 + Math.random() * 0.03,
    };
  }

  function BeamsBackground({ entityHueBase, intensity, theme }) {
    const canvasRef = useRef(null);
    const beamsRef = useRef([]);
    const rafRef = useRef(0);
    const hueBaseRef = useRef(entityHueBase || 190);
    const themeRef = useRef(theme || "dark");

    useEffect(() => { hueBaseRef.current = entityHueBase || 190; }, [entityHueBase]);
    useEffect(() => { themeRef.current = theme || "dark"; }, [theme]);

    useEffect(() => {
      const beams = beamsRef.current;
      if (!beams || !beams.length) return;
      const total = beams.length;
      beams.forEach((b, i) => {
        b.hue = (entityHueBase || 190) + (i * 70) / total;
      });
    }, [entityHueBase]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const I = intensity || "strong";

      function updateCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        ctx.scale(dpr, dpr);
        const totalBeams = MINIMUM_BEAMS * 1.5;
        beamsRef.current = Array.from({ length: totalBeams }, () =>
          createBeam(canvas.width, canvas.height, hueBaseRef.current)
        );
      }
      updateCanvasSize();

      function onResize() { updateCanvasSize(); }
      window.addEventListener("resize", onResize);

      function resetBeam(beam, index, total) {
        if (!canvas) return beam;
        const column = index % 3;
        const spacing = canvas.width / 3;
        beam.y = canvas.height + 100;
        beam.x = column * spacing + spacing / 2 + (Math.random() - 0.5) * spacing * 0.5;
        beam.width = 100 + Math.random() * 100;
        beam.speed = 0.5 + Math.random() * 0.4;
        beam.hue = hueBaseRef.current + (index * 70) / total;
        beam.opacity = 0.2 + Math.random() * 0.1;
        return beam;
      }

      function drawBeam(ctx2, beam) {
        ctx2.save();
        ctx2.translate(beam.x, beam.y);
        ctx2.rotate((beam.angle * Math.PI) / 180);
        const pulsingOpacity =
          beam.opacity * (0.8 + Math.sin(beam.pulse) * 0.2) * (BEAM_OPACITY_MAP[I] || 1) *
          (themeRef.current === "light" ? 0.5 : 1);
        const gradient = ctx2.createLinearGradient(0, 0, 0, beam.length);
        gradient.addColorStop(0, "hsla(" + beam.hue + ", 85%, 65%, 0)");
        gradient.addColorStop(0.1, "hsla(" + beam.hue + ", 85%, 65%, " + (pulsingOpacity * 0.5).toFixed(4) + ")");
        gradient.addColorStop(0.4, "hsla(" + beam.hue + ", 85%, 65%, " + pulsingOpacity.toFixed(4) + ")");
        gradient.addColorStop(0.6, "hsla(" + beam.hue + ", 85%, 65%, " + pulsingOpacity.toFixed(4) + ")");
        gradient.addColorStop(0.9, "hsla(" + beam.hue + ", 85%, 65%, " + (pulsingOpacity * 0.5).toFixed(4) + ")");
        gradient.addColorStop(1, "hsla(" + beam.hue + ", 85%, 65%, 0)");
        ctx2.fillStyle = gradient;
        ctx2.fillRect(-beam.width / 2, 0, beam.width, beam.length);
        ctx2.restore();
      }

      function animate() {
        if (document.visibilityState === "hidden") {
          rafRef.current = requestAnimationFrame(animate);
          return;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.filter = "blur(35px)";
        const totalBeams = beamsRef.current.length;
        beamsRef.current.forEach((beam, idx) => {
          beam.y -= beam.speed;
          beam.pulse += beam.pulseSpeed;
          if (beam.y + beam.length < -100) resetBeam(beam, idx, totalBeams);
          drawBeam(ctx, beam);
        });
        rafRef.current = requestAnimationFrame(animate);
      }
      animate();

      return () => {
        cancelAnimationFrame(rafRef.current);
        window.removeEventListener("resize", onResize);
      };
    }, [intensity]);

    return (
      <div className="fa-beams-bg" aria-hidden="true">
        <canvas ref={canvasRef} className="fa-beams-canvas" />
        <div className="fa-beams-overlay" />
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 5. Card components — two-tier gradient X-card style
  // ──────────────────────────────────────────────────────────────
  function CardShell({ card, idx, suggested, children }) {
    const sizeClass = "fa-card-" + (card.size || "md");
    const staggerCls = "fa-stagger-" + Math.min((idx || 0) + 1, 6);
    return (
      <div className={classNames("fa-card", sizeClass, "fa-card-enter", staggerCls)}>
        <div className="fa-card-inner">
          <div className="fa-card-head">
            <div className="fa-card-title">
              {card.label || card.title || card.type}
            </div>
            <div className="fa-card-actions">
              {suggested && <span className="fa-suggested-badge">✦ AI suggested</span>}
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }

  function KPIOrb({ card }) {
    const isNeg = card.delta && /^-/.test(card.delta);
    return (
      <div className="fa-kpi-orb">
        <div className="fa-kpi-value num">{card.value}</div>
        {card.delta && (
          <div className={classNames("fa-kpi-delta", isNeg && "neg")}>{card.delta}</div>
        )}
      </div>
    );
  }

  function SparklineTile({ card }) {
    const w = 280, h = 60, pad = 4;
    const d = sparkPath(card.points, w, h, pad);
    return (
      <div className="fa-spark-tile">
        {card.value && <div className="fa-spark-value num">{card.value}</div>}
        <svg className="fa-spark-svg" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id={"sg-" + card.id} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--entity-accent)" stopOpacity="0.32" />
              <stop offset="100%" stopColor="var(--entity-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>
          {card.points && card.points.length > 1 && (
            <path d={d + ` L ${w-pad},${h-pad} L ${pad},${h-pad} Z`} fill={`url(#sg-${card.id})`} />
          )}
          <path d={d} fill="none" stroke="var(--entity-accent)" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  function TableCard({ card }) {
    return (
      <div>
        <table className="fa-table">
          <thead>
            <tr>{card.columns.map((c, i) => <th key={i}>{c}</th>)}</tr>
          </thead>
          <tbody>
            {card.rows.map((r, i) => (
              <tr key={i}>{r.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}
          </tbody>
        </table>
        {card.summary && <div className="fa-table-summary">{card.summary}</div>}
      </div>
    );
  }

  function DocCard({ card }) {
    return (
      <div className="fa-doc">
        <div className="fa-doc-title">{card.title}</div>
        <div className="fa-doc-updated">{card.updated}</div>
        <div className="fa-doc-snippet">{card.snippet}</div>
      </div>
    );
  }

  function TaskCard({ card }) {
    return (
      <div>
        {(card.items || []).map((it, i) => (
          <div className="fa-task" key={i}>
            <div className="fa-task-check" />
            <div className="fa-task-text">
              {it.text}
              {it.due && <div className="fa-task-due">{it.due}</div>}
            </div>
          </div>
        ))}
      </div>
    );
  }

  function InsightCard({ card }) {
    return (
      <div>
        {card.title && <div className="fa-insight-title">{card.title}</div>}
        <div className="fa-insight-body">{renderAnswerText(card.body, card.sources)}</div>
      </div>
    );
  }

  function ActionCard({ card, onClick }) {
    return (
      <div className="fa-action" onClick={onClick}>
        <div className="fa-action-icon">✦</div>
        <div>
          <div className="fa-action-label">{card.label}</div>
          {card.hint && <div className="fa-action-hint">{card.hint}</div>}
        </div>
      </div>
    );
  }

  const CARD_RENDERERS = {
    kpiOrb:    (card) => <KPIOrb card={card} />,
    sparkline: (card) => <SparklineTile card={card} />,
    table:     (card) => <TableCard card={card} />,
    doc:       (card) => <DocCard card={card} />,
    tasks:     (card) => <TaskCard card={card} />,
    insight:   (card) => <InsightCard card={card} />,
    action:    (card, opts) => <ActionCard card={card} onClick={opts && opts.onAction} />,
  };

  function CardRender({ card, idx, suggested, onAction }) {
    const renderer = CARD_RENDERERS[card.type] || (() => <div className="fa-muted">Unknown card</div>);
    return (
      <CardShell card={card} idx={idx} suggested={suggested}>
        {renderer(card, { onAction })}
      </CardShell>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 5b. Entity → hue base (for beams)
  // ──────────────────────────────────────────────────────────────
  const ENTITY_HUE_BASE = { vcfo: 190, lp: 260, home: 90 };
  const ENTITY_DOT = { vcfo: "#38BDF8", lp: "#7C5CFF", home: "#84CC16" };

  // ──────────────────────────────────────────────────────────────
  // 5c. Flow nav configs (for left icon rail)
  // ──────────────────────────────────────────────────────────────
  const HOME_NAV_CFG = [
    { items: [
      { id: "home",        label: "Home",        icon: "home" },
      { id: "zive-ai",     label: "Zive AI",     icon: "sparkle" },
      { id: "dashboard",   label: "Dashboard",   icon: "dashboard" },
      { id: "tasks",       label: "Tasks",       icon: "tasks" },
      { id: "bluecheck",   label: "BlueCheck",   icon: "shieldCheck" },
      { id: "activity",    label: "Activity",    icon: "activity" },
      { id: "documents",   label: "Documents",   icon: "folder" },
      { id: "settings",    label: "Settings",    icon: "settings" },
    ]},
    { label: "Fund", items: [
      { id: "portfolio",     label: "Portfolio",     icon: "pie" },
      { id: "investors",     label: "Investors",     icon: "investor" },
      { id: "capital-calls", label: "Capital Calls", icon: "capitalCall" },
      { id: "distributions", label: "Distributions", icon: "distribution" },
      { id: "startups",      label: "Startups",      icon: "briefcase" },
    ]},
    { label: "AI", items: [
      { id: "ai-upload",  label: "AI Upload",       icon: "aiUpload" },
      { id: "agents",     label: "Agents",          icon: "settings" },
      { id: "doc-studio", label: "Document Studio", icon: "docStudio" },
      { id: "mcp",        label: "MCP",             icon: "mcp" },
    ]},
    { label: "Accounting", items: [
      { id: "accounting", label: "Accounting", icon: "accounting" },
      { id: "reports",    label: "Reports",    icon: "report" },
      { id: "quarterly",  label: "Quarterly",  icon: "quarterly" },
      { id: "audit",      label: "Audit",      icon: "audit" },
    ]},
    { label: "Management", items: [
      { id: "lp-interest",   label: "LP Interest",   icon: "briefcase" },
      { id: "lp-onboarding", label: "LP Onboarding", icon: "onboard" },
      { id: "deal-room",     label: "Deal Room",     icon: "dealRoom" },
      { id: "users",         label: "Users",         icon: "users" },
    ]},
  ];

  function navForEntity(entity) {
    if (entity === "vcfo") return window.VCFO_NAV_CFG || [];
    if (entity === "lp")   return window.LP_NAV_CFG   || [];
    if (entity === "home") return HOME_NAV_CFG;
    return [];
  }

  // ──────────────────────────────────────────────────────────────
  // 5d. PageHost — renders real existing page components inline
  // ──────────────────────────────────────────────────────────────
  const __compCache = {};
  const resolveComp = (name) => {
    if (__compCache[name] !== undefined) return __compCache[name];
    let c = null;
    try { c = window[name]; } catch (e) {}
    if (typeof c !== "function") {
      try { c = (new Function("try { return typeof " + name + " !== 'undefined' ? " + name + " : null } catch (e) { return null }"))(); } catch (e) {}
    }
    __compCache[name] = (typeof c === "function") ? c : null;
    return __compCache[name];
  };
  const ROUTE_TO_COMP = {
    "home":              { name: "HomeScreen",     props: { onOpenFund: () => {}, onAskAI: () => {}, onOpenEntity: () => {} } },
    "zive-ai":           { name: "ZiveAIPage" },
    "dashboard":         { name: "DashboardPage" },
    "tasks":             { name: "TasksPage",      props: { onOpenFund: () => {} } },
    "bluecheck":         { name: "BlueCheckPage" },
    "activity":          { name: "ActivityPage" },
    "documents":         { name: "AllFilesPage" },
    "settings":          { name: "ComingSoon",     props: { title: "Settings", icon: "settings" } },
    "portfolio":         { name: "PortfolioPage" },
    "investors":         { name: "InvestorsPage" },
    "capital-calls":     { name: "CapitalCallsPage" },
    "distributions":     { name: "DistributionsPage" },
    "startups":          { name: "StartupsPage",   props: { onOpen: () => {} } },
    "startup-profile":   { name: "StartupProfilePage", props: { onBack: () => {} } },
    "ai-upload":         { name: "AIUploadPage" },
    "agents":            { name: "AgentsPage" },
    "doc-studio":        { name: "DocStudioPage" },
    "mcp":               { name: "MCPPage" },
    "accounting":        { name: "AccountingPage" },
    "reports":           { name: "ReportsPage" },
    "quarterly":         { name: "QuarterlyReportPage" },
    "audit":             { name: "AuditReportPage" },
    "lp-interest":       { name: "LPInterestPage" },
    "lp-onboarding":     { name: "LPOnboardingPage" },
    "deal-room":         { name: "DealRoomPage" },
    "users":             { name: "UsersPage" },
    "fund":              { name: "FundDetail",     props: { onBack: () => {} } },
    "vcfo-dashboards":   { name: "VCFODashboards" },
    "vcfo-documents":    { name: "VCFODocuments" },
    "vcfo-api":          { name: "VCFOApi" },
    "vcfo-investments":  { name: "VCFOInvestments" },
    "vcfo-funds":        { name: "VCFOFunds" },
    "vcfo-accounting":   { name: "VCFOAccounting" },
    "vcfo-reporting":    { name: "VCFOReporting" },
    "vcfo-lp-portal":    { name: "VCFOLPPortal" },
    "vcfo-uda":          { name: "VCFOUDA" },
    "vcfo-financing-docs": { name: "VCFOFinancingDocs" },
    "vcfo-agents":       { name: "VCFOAgents" },
    "vcfo-doc-studio":   { name: "VCFODocStudio" },
    "vcfo-mcp":          { name: "VCFOMCP" },
    "vcfo-users":        { name: "VCFOUsers" },
    "lp-overview":       { name: "LPOverview" },
    "lp-wire":           { name: "LPWireInstructions" },
  };
  function PageHost({ pageId }) {
    const entry = ROUTE_TO_COMP[pageId];
    const Comp = entry ? resolveComp(entry.name) : null;
    if (Comp) return <Comp {...(entry.props || {})} />;
    return (
      <div style={{ padding: 60, textAlign: "center", color: "var(--muted)" }}>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "var(--fg)", margin: "0 0 6px" }}>Page unavailable</h2>
        <p style={{ fontSize: 13.5, margin: 0 }}>The "{pageId}" page isn't wired into this preview surface.</p>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 6. Slim TopBar
  // ──────────────────────────────────────────────────────────────
  function TopBar({ entity, onEntity, onOpenCmdk, onToggleTheme, theme }) {
    const ZW = window.ZiveWordmark;
    const STRIP = [
      { id: "vcfo", label: "VCFO" },
      { id: "lp",   label: "LP" },
      { id: "home", label: "Home" },
    ];
    return (
      <div className="fa-topbar" data-entity={entity}>
        <div className="fa-topbar-left">
          {ZW ? <ZW height={18} color="currentColor" /> : <span style={{ fontWeight: 600 }}>zive</span>}
          <span className="fa-topbar-sep">·</span>
          <span className="fa-topbar-product">flowai</span>
        </div>
        <div className="fa-topbar-entities">
          {STRIP.map(e => (
            <button
              key={e.id}
              className={`fa-entity-pill ${entity === e.id ? "active" : ""}`}
              data-entity={e.id}
              onClick={() => onEntity(e.id)}
              title={`Switch to ${e.label} (⌘${e.id === "vcfo" ? 1 : e.id === "lp" ? 2 : 3})`}
            >
              <span className="fa-entity-dot" />
              {e.label}
            </button>
          ))}
        </div>
        <div className="fa-topbar-right">
          <button className="fa-cmdk-btn" onClick={onOpenCmdk} title="Command palette (⌘K)">
            <span>⌘ K</span>
          </button>
          <button className="fa-theme-btn" onClick={onToggleTheme} title="Toggle theme" aria-label="Toggle theme">
            {theme === "dark" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"/></svg>
            )}
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 7. Composer (landing + thread states)
  // ──────────────────────────────────────────────────────────────
  function Composer({ entity, onEntity, onSubmit, mode, value, setValue }) {
    const [popOpen, setPopOpen] = useState(false);
    const inputRef = useRef(null);
    const ent = ENTITY_BY_ID[entity];

    function handleKey(e) {
      if (e.key === "Enter" && value && value.trim()) {
        onSubmit(value.trim());
      }
    }

    const wrapClass = classNames("fa-composer", mode === "landing" ? "fa-composer-landing" : "fa-composer-stick");

    return (
      <div className={wrapClass}>
        <div className="fa-composer-row">
          <div style={{ position: "relative" }}>
            <button className="fa-entity-chip" onClick={() => setPopOpen(p => !p)} aria-haspopup="menu">
              <span className="fa-entity-chip-dot" />
              {ent.short}
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}><path d="M6 9l6 6 6-6"/></svg>
            </button>
            {popOpen && (
              <div className="fa-entity-popover" onMouseLeave={() => setPopOpen(false)}>
                {ENTITIES.map(e => (
                  <button
                    key={e.id}
                    className={classNames(entity === e.id && "active")}
                    onClick={() => { onEntity(e.id); setPopOpen(false); }}
                  >
                    <span className="fa-entity-popover-swatch" style={{ background: ENTITY_DOT[e.id] }} />
                    <span style={{ flex: 1, textAlign: "left" }}>{e.label}</span>
                    {entity === e.id && <span style={{ fontSize: 11, color: "var(--muted)" }}>✓</span>}
                  </button>
                ))}
              </div>
            )}
          </div>
          <input
            ref={inputRef}
            className="fa-composer-input"
            placeholder={mode === "landing" ? `Ask anything ${ent.greeting}…` : "Ask, draft, or compose…"}
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKey}
            autoFocus={mode === "landing"}
          />
          <button
            className="fa-composer-send"
            disabled={!value || !value.trim()}
            onClick={() => value && value.trim() && onSubmit(value.trim())}
            aria-label="Send"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
          </button>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 8. Tool calls strip
  // ──────────────────────────────────────────────────────────────
  function ToolCalls({ tools, animateInitial }) {
    const [doneCount, setDoneCount] = useState(animateInitial ? 0 : (tools || []).length);

    useEffect(() => {
      if (!animateInitial) { setDoneCount((tools || []).length); return; }
      setDoneCount(0);
      let i = 0;
      const total = (tools || []).length;
      const id = setInterval(() => {
        i++;
        setDoneCount(i);
        if (i >= total) clearInterval(id);
      }, 380);
      return () => clearInterval(id);
    }, [tools && tools.join("|")]);

    if (!tools || !tools.length) return null;
    return (
      <div className="fa-toolcalls" role="log" aria-live="polite">
        {tools.map((t, i) => (
          <span
            key={i}
            className={classNames(
              "fa-toolcall",
              i < doneCount ? "done" : i === doneCount ? "pending" : ""
            )}
          >
            {t}
          </span>
        ))}
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 9. Cmd+K palette (kept — 8 commands)
  // ──────────────────────────────────────────────────────────────
  function makeCommands(onEntity, openReport) {
    return [
      { id: "switch", label: "Switch entity", icon: "↔", children: [
        { id: "to-vcfo", label: "Admin VCFO", run: () => onEntity("vcfo") },
        { id: "to-lp",   label: "Admin V LP", run: () => onEntity("lp") },
        { id: "to-home", label: "Home",       run: () => onEntity("home") },
      ]},
      { id: "newcc", label: "New capital call", icon: "$", children: [
        { id: "cc-admin-v", label: "Admin Ventures V", children: [
          { id: "cc-v-8",   label: "8% call",  run: () => onEntity("vcfo") },
          { id: "cc-v-12",  label: "12% call", run: () => onEntity("vcfo") },
          { id: "cc-v-cu",  label: "Custom amount…", run: () => onEntity("vcfo") },
        ]},
        { id: "cc-admin-iv", label: "Admin Ventures IV", children: [
          { id: "cc-iv-8",  label: "8% call",  run: () => onEntity("vcfo") },
          { id: "cc-iv-12", label: "12% call", run: () => onEntity("vcfo") },
          { id: "cc-iv-cu", label: "Custom amount…", run: () => onEntity("vcfo") },
        ]},
      ]},
      { id: "lpletter", label: "Draft LP letter", icon: "✎", children: [
        { id: "ll-all",    label: "All LPs (broadcast)", run: () => openReport() },
        { id: "ll-single", label: "Single LP…",          run: () => openReport() },
      ]},
      { id: "finddoc", label: "Find document", icon: "⌕", run: () => {} },
      { id: "addcard", label: "Add card to dashboard", icon: "+", children: [
        { id: "ac-kpi",   label: "KPI orb",   run: () => {} },
        { id: "ac-spark", label: "Sparkline", run: () => {} },
        { id: "ac-table", label: "Table",     run: () => {} },
        { id: "ac-doc",   label: "Doc",       run: () => {} },
        { id: "ac-task",  label: "Task",      run: () => {} },
        { id: "ac-ins",   label: "Insight",   run: () => {} },
        { id: "ac-act",   label: "Action",    run: () => {} },
      ]},
      { id: "qrpt", label: "Generate quarterly report", icon: "▸", children: [
        { id: "qr-v",  label: "Admin Ventures V — Q4",  run: () => openReport() },
        { id: "qr-iv", label: "Admin Ventures IV — Q4", run: () => openReport() },
      ]},
      { id: "approve", label: "Approve task", icon: "✓", run: () => {} },
      { id: "recon",   label: "Reconcile cash", icon: "≈", run: () => {} },
    ];
  }

  function CmdK({ open, onClose, onEntity, openReport, entity }) {
    const [stack, setStack] = useState([]);
    const [query, setQuery] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);
    const inputRef = useRef(null);

    const root = useMemo(() => makeCommands(onEntity, openReport), [onEntity, openReport]);
    const current = stack.length === 0 ? root : (stack[stack.length - 1].children || []);
    const filtered = useMemo(() => {
      if (!query) return current;
      return current.filter(c => c.label.toLowerCase().includes(query.toLowerCase()));
    }, [current, query]);

    useEffect(() => {
      if (open) {
        setStack([]); setQuery(""); setActiveIdx(0);
        setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
      }
    }, [open]);

    useEffect(() => { setActiveIdx(0); }, [stack.length, query]);

    function pushOrRun(item) {
      if (item.children) setStack(s => s.concat([item]));
      else { if (item.run) item.run(); onClose(); }
    }
    function pop() { setStack(s => s.slice(0, -1)); setQuery(""); }

    function handleKey(e) {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (e.key === "Backspace" && !query && stack.length) { e.preventDefault(); pop(); return; }
      if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx(i => Math.min(filtered.length - 1, i + 1)); return; }
      if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)); return; }
      if (e.key === "Enter") {
        e.preventDefault();
        const item = filtered[activeIdx];
        if (item) pushOrRun(item);
      }
    }

    if (!open) return null;
    return (
      <div className="fa-cmdk-overlay" data-entity={entity} onClick={onClose}>
        <div className="fa-cmdk" onClick={e => e.stopPropagation()}>
          <div className="fa-cmdk-crumbs">
            <span className="fa-cmdk-crumb">Workspace</span>
            {stack.map((s, i) => (
              <React.Fragment key={s.id}>
                <span className="fa-cmdk-crumb-sep">›</span>
                <span className="fa-cmdk-crumb">{s.label}</span>
              </React.Fragment>
            ))}
          </div>
          <input
            ref={inputRef}
            className="fa-cmdk-input"
            placeholder={stack.length ? "Filter " + (stack[stack.length-1].label).toLowerCase() + "…" : "Type a command or search…"}
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKey}
          />
          <div className="fa-cmdk-list">
            {filtered.length === 0 ? (
              <div className="fa-cmdk-empty">No matches</div>
            ) : filtered.map((item, i) => (
              <div
                key={item.id}
                className={classNames("fa-cmdk-item", i === activeIdx && "active")}
                onClick={() => pushOrRun(item)}
                onMouseEnter={() => setActiveIdx(i)}
              >
                <div className="fa-cmdk-item-icon">{item.icon || "•"}</div>
                <div>{item.label}</div>
                {item.children && <div className="fa-cmdk-item-arrow">›</div>}
              </div>
            ))}
          </div>
          <div className="fa-cmdk-hint">
            <span><kbd>↑↓</kbd> navigate</span>
            <span><kbd>↵</kbd> {filtered[activeIdx] && filtered[activeIdx].children ? "open" : "run"}</span>
            <span><kbd>⌫</kbd> back</span>
            <span><kbd>esc</kbd> close</span>
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 10. Left icon rail (persistent, hover-expand overlay)
  // ──────────────────────────────────────────────────────────────
  function LeftRail({ entity, pageId, onPickPage }) {
    const Icon = window.Icon;
    const sections = useMemo(() => navForEntity(entity), [entity]);

    return (
      <nav className="fa-rail" data-entity={entity} aria-label="Sidebar navigation">
        <div className="fa-rail-scroll">
          {(sections || []).map((sec, si) => (
            <React.Fragment key={si}>
              {si > 0 && (
                <>
                  <div className="fa-rail-section-divider"></div>
                </>
              )}
              {sec.label && (
                <div className="fa-rail-section-label">{sec.label}</div>
              )}
              {(sec.items || []).map(item => {
                const active = pageId === item.id;
                return (
                  <button
                    key={item.id}
                    className={`fa-rail-item ${active ? "active" : ""}`}
                    onClick={() => onPickPage(item.id)}
                    title={item.label}
                  >
                    <span className="fa-rail-icon">
                      {Icon ? <Icon name={item.icon} size={15} /> : <span>•</span>}
                    </span>
                    <span className="fa-rail-label">{item.label}</span>
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </nav>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 11. Page panel (split-view / fullscreen container)
  // ──────────────────────────────────────────────────────────────
  function PagePanel({ pageId, entity, pageLabel, viewMode, onSetViewMode }) {
    if (!pageId) return null;
    const Icon = window.Icon;
    return (
      <div className="fa-page-col" data-entity={entity}>
        <div className="fa-page-header">
          <div className="fa-page-header-crumb">
            {Icon ? <Icon name="folder" size={11} /> : <span>▸</span>}
            <span>Browse · {ENTITY_BY_ID[entity].label} · {pageLabel}</span>
          </div>
          <div className="fa-page-header-actions">
            {viewMode === "split" && (
              <button className="fa-page-btn" onClick={() => onSetViewMode("full")} title="Fullscreen">
                <span style={{ fontSize: 12, lineHeight: 1 }}>⛶</span> Fullscreen
              </button>
            )}
            {viewMode === "full" && (
              <button className="fa-page-btn" onClick={() => onSetViewMode("split")} title="Back to split">
                <span style={{ fontSize: 12, lineHeight: 1 }}>⤢</span> Split
              </button>
            )}
            <button className="fa-page-btn" data-variant="primary" onClick={() => onSetViewMode("ai")} title="Back to AI mode">
              ← AI mode
            </button>
          </div>
        </div>
        <div className="fa-page-body">
          <PageHost pageId={pageId} />
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 12. Inline report panel (folded into turn)
  // ──────────────────────────────────────────────────────────────
  const REPORT_BLOCKS = [
    {
      id: "header",
      title: null,
      body: [
        "Dear Limited Partners,",
        "We're pleased to share the Q4 2025 update for Admin Ventures V. The fund closed the quarter at $58.2M of NAV (+3.4% Q-o-Q) and a net IRR of 18.4% [1].",
      ],
    },
    {
      id: "summary",
      title: "Executive summary",
      body: [
        "Three portfolio companies marked up during the quarter — Acorn Health, Plover Robotics, and Sable Logistics — together driving the quarter's NAV gain [2]. We deployed $4.6M of capital into one new investment (Birch AI) and one follow-on (Cedar Materials).",
        "Two LPs satisfied their first capital call of the year; one LP submitted a request to transfer their interest, which we are reviewing.",
      ],
    },
    {
      id: "performance",
      title: "Performance",
      body: [
        "NAV: $58.2M (+3.4% Q-o-Q). DPI: 0.12x. TVPI: 1.32x. Net IRR (since inception): 18.4% [1].",
        "Performance relative to vintage 2022 peers is in the top quartile across all three metrics, per the most recent Cambridge benchmark [3].",
      ],
    },
    {
      id: "portfolio",
      title: "Portfolio update",
      body: [
        "Acorn Health closed a $20M Series B at a $120M post-money, a 1.9x mark from our prior round.",
        "Plover Robotics signed a term sheet for an $14M Series B (pricing pending).",
        "Sable Logistics began revenue contribution from its top-2 enterprise customer; we held our mark constant pending Q1 confirmation.",
      ],
    },
    {
      id: "wire",
      title: "Wire instructions for next call",
      body: [
        "Next capital call: 12% of unfunded commitments, due Jun 19 ($600 per $5,000 committed).",
        "Wire to: JPMorgan Chase, Admin Ventures V LP, Acct ending •••4471, ABA 021000021.",
      ],
    },
  ];

  function ReportInlinePanel({ entity }) {
    const [pending, setPending] = useState({ block: "summary", visible: true });
    return (
      <div className="fa-report-inline" data-entity={entity}>
        {pending.visible && (
          <div className="fa-accept-strip">
            <span className="fa-accept-dot" />
            AI suggested a tighter executive summary.
            <div className="fa-accept-btns">
              <button onClick={() => setPending({ ...pending, visible: false })}>
                Reject <kbd>⌘N</kbd>
              </button>
              <button className="primary" onClick={() => setPending({ ...pending, visible: false })}>
                Accept <kbd>⌘Y</kbd>
              </button>
            </div>
          </div>
        )}
        <div className="fa-report-split">
          <div className="fa-report-chat">
            <div className="fa-report-msg user">Draft the Q4 letter for Admin V. Keep it under one page, lead with NAV, end with wire instructions.</div>
            <div className="fa-report-msg ai">
              Drafted. Used Q4 financials (final 2026-04-30), 3 portfolio company memos, and Cambridge vintage 2022 peers. Citations inserted in-line.
              <div className="fa-report-msg-meta">3 tool calls · 4 sources</div>
            </div>
            <div className="fa-report-msg user">Make the exec summary tighter — feels redundant.</div>
            <div className="fa-report-msg ai">
              Suggested a tighter version (accept-strip above). Removed the second paragraph and merged into one.
              <div className="fa-report-msg-meta">1 edit pending</div>
            </div>
            <div className="fa-report-msg user">Add Plover term sheet to portfolio update.</div>
            <div className="fa-report-msg ai">
              Done — added one line under Portfolio Update. Verified terms against memo dated 2026-05-22.
              <div className="fa-report-msg-meta">1 block updated · 1 source</div>
            </div>
          </div>
          <div className="fa-report-doc">
            <div className="fa-report-header">
              <div className="fa-report-h2">Quarterly Report · Q4 2025</div>
              <div className="fa-report-h1">Admin Ventures V — Limited Partners Update</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>April 30, 2026 · Draft · Morgan Chen</div>
            </div>
            {REPORT_BLOCKS.map(b => (
              <section className="fa-report-block" data-block-id={b.id} key={b.id}>
                <div className="fa-report-block-toolbar">
                  <button>Regenerate</button>
                  <button>Edit</button>
                  <button>Lock</button>
                </div>
                {b.title && <div className="fa-report-h2" style={{ marginBottom: 8 }}>{b.title}</div>}
                <div className="fa-report-block-body">
                  {b.body.map((p, i) => (
                    <p key={i}>
                      {renderAnswerText(p, {
                        1: "Source: Q4 financials, finalized 2026-04-30",
                        2: "Source: Portfolio company memos, Q4",
                        3: "Source: Cambridge Associates, vintage 2022 benchmark",
                      })}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 13. Conversation turn
  // ──────────────────────────────────────────────────────────────
  function FollowupChips({ chips, onPick }) {
    if (!chips || !chips.length) return null;
    return (
      <div className="fa-followup-chips">
        {chips.map((f, i) => (
          <button key={i} className="fa-followup-chip" onClick={() => onPick(f)}>{f}</button>
        ))}
      </div>
    );
  }

  function ConversationTurn({ turn, entity, onFollowup, isLatest }) {
    return (
      <article className="fa-turn" data-turn-id={turn.id}>
        <div className="fa-turn-user">
          <span className="fa-turn-user-prefix">You</span>
          <span className="fa-turn-user-text">{turn.prompt}</span>
        </div>
        <div className="fa-turn-ai">
          <ToolCalls tools={turn.tools} animateInitial={isLatest} />
          {turn.answer && (
            <p className="fa-turn-answer">{renderAnswerText(turn.answer, turn.sources)}</p>
          )}
          {turn.kind === "report" ? (
            <ReportInlinePanel entity={entity} />
          ) : (
            turn.cards && turn.cards.length > 0 && (
              <div className="fa-grid">
                {turn.cards.map((c, i) => (
                  <CardRender
                    key={c.id || ("c" + i)}
                    card={c}
                    idx={i}
                    suggested
                  />
                ))}
              </div>
            )
          )}
          <FollowupChips chips={turn.followups} onPick={onFollowup} />
        </div>
      </article>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 14. App root
  // ──────────────────────────────────────────────────────────────
  const ENTITY_DEFAULT_PAGE = {
    vcfo: "vcfo-dashboards",
    lp:   "lp-overview",
    home: "dashboard",
  };

  function App() {
    const [entity, setEntity] = useState("vcfo");
    const [turns, setTurns] = useState([]);             // [{id, prompt, answer, tools, cards, followups, sources, kind}]
    const [value, setValue] = useState("");
    const [cmdkOpen, setCmdkOpen] = useState(false);
    const [viewMode, setViewMode] = useState("ai"); // "ai" | "split" | "full"
    const [pageId, setPageId] = useState(null);
    const [theme, setTheme] = useState(() => {
      try { return document.documentElement.getAttribute("data-theme") || "dark"; }
      catch (e) { return "dark"; }
    });
    const threadEndRef = useRef(null);

    // Keep refs to current state for the keyboard handler (so we don't rebind on every change)
    const entityRef = useRef(entity);
    const viewModeRef = useRef(viewMode);
    useEffect(() => { entityRef.current = entity; }, [entity]);
    useEffect(() => { viewModeRef.current = viewMode; }, [viewMode]);

    // Single entity-switch handler. Wired to: topbar pills, composer chip,
    // Cmd+1/2/3, and the Cmd+K palette's "Switch entity" submenu.
    function switchEntity(newEntity) {
      const prev = entityRef.current;
      setEntity(newEntity);
      if ((viewModeRef.current === "split" || viewModeRef.current === "full") && newEntity !== prev) {
        setPageId(ENTITY_DEFAULT_PAGE[newEntity] || null);
      }
    }

    // Auto-scroll thread on new turn (works for both ai-mode stage and split thread-col)
    useEffect(() => {
      if (threadEndRef.current && turns.length > 0) {
        try {
          threadEndRef.current.scrollIntoView({ block: "end", behavior: "smooth" });
        } catch (e) {}
      }
    }, [turns.length]);

    // Keyboard shortcuts
    useEffect(() => {
      function onKey(e) {
        const isMod = e.metaKey || e.ctrlKey;
        if (isMod && (e.key === "k" || e.key === "K")) {
          e.preventDefault();
          setCmdkOpen(o => !o);
          return;
        }
        if (isMod && e.key === "1") { e.preventDefault(); switchEntity("vcfo"); return; }
        if (isMod && e.key === "2") { e.preventDefault(); switchEntity("lp"); return; }
        if (isMod && e.key === "3") { e.preventDefault(); switchEntity("home"); return; }
        if (e.key === "Escape") {
          if (viewModeRef.current === "split" || viewModeRef.current === "full") {
            setViewMode("ai");
            return;
          }
        }
      }
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }, []);

    // Reset thread when entity changes
    useEffect(() => {
      setTurns([]);
      setValue("");
    }, [entity]);

    function toggleTheme() {
      const next = theme === "dark" ? "light" : "dark";
      setTheme(next);
      try {
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("zive.theme", next);
      } catch (e) {}
    }

    function findResponse(promptText) {
      const bank = RESPONSES[entity] || {};
      if (bank[promptText]) return bank[promptText];
      const keys = Object.keys(bank);
      const lc = promptText.toLowerCase();
      const k = keys.find(k => k.toLowerCase() === lc) ||
                keys.find(k => lc.includes(k.toLowerCase().split(" ")[0]));
      return k ? bank[k] : null;
    }

    function isReportPrompt(prompt) {
      return entity === "vcfo" && /generate|draft/i.test(prompt) && /q\d|quarter|lp letter|report|lp update/i.test(prompt);
    }

    function submitPrompt(prompt) {
      const resp = findResponse(prompt);
      const id = "t-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
      const kind = isReportPrompt(prompt) ? "report" : "answer";
      if (resp) {
        setTurns(prev => prev.concat([{
          id, prompt, kind,
          answer: resp.answer,
          tools: resp.tools,
          cards: resp.cards,
          followups: resp.followups,
          sources: resp.sources,
        }]));
      } else {
        // Fallback synthesized response
        setTurns(prev => prev.concat([{
          id, prompt, kind,
          answer: `Working on "${prompt}" against ${ENTITY_BY_ID[entity].label}. I don't have a canned answer for this exact prompt yet, but here's a starting frame [1].`,
          tools: ["Parsing your ask", "Searching the workspace", "Composing a placeholder"],
          cards: [
            { id: "sn-1-" + id, type: "insight", size: "lg", title: "Placeholder", body: "This is a v1 demo; the live system would compose 3–6 cards here using the same response shape." },
            { id: "sn-2-" + id, type: "action", size: "md", label: "Try a starter prompt", icon: "play", hint: "Below the composer" },
          ],
          followups: STARTERS[entity].slice(0, 3),
          sources: { 1: "Source: Flow AI canned fallback" },
        }]));
      }
      setValue("");
    }

    function openReportFromCmdK() {
      // Inject a synthetic report turn (mirrors the Q4 LP update flow)
      const id = "t-report-" + Date.now();
      const resp = (RESPONSES.vcfo || {})["Generate the Q4 LP update"] || {};
      if (entity !== "vcfo") setEntity("vcfo");
      setTurns(prev => prev.concat([{
        id,
        prompt: "Generate the Q4 LP update",
        kind: "report",
        answer: resp.answer,
        tools: resp.tools,
        cards: resp.cards,
        followups: resp.followups,
        sources: resp.sources,
      }]));
      setValue("");
    }

    function pageLabel(pid) {
      if (!pid) return "";
      const lists = navForEntity(entity) || [];
      for (const sec of lists) {
        for (const it of (sec.items || [])) {
          if (it.id === pid) return it.label;
        }
      }
      return pid;
    }

    function openPage(pid) {
      setPageId(pid);
      setViewMode("split");
    }

    // Landing mode is reserved for pure AI mode with no turns. In split/full
    // the thread column is narrow — never show the big centered landing
    // composer there (it overflows). Use the small thread-style composer
    // instead, and surface starter chips as an empty-state above it.
    const mode = (turns.length === 0 && viewMode === "ai") ? "landing" : "thread";
    const ent = ENTITY_BY_ID[entity];

    // The conversation panel (thread + composer or landing) — used in both
    // ai-mode (centered, full-stage) and split-mode (in the left column).
    function ConversationPanel() {
      if (mode === "landing") {
        return (
          <div className="fa-landing">
            <div className="fa-greeting">
              <h1>Hi Morgan. What do you want to look at?</h1>
              <div className="fa-greeting-sub">Ask anything {ent.greeting}, or pick a starter below.</div>
            </div>
            <Composer
              entity={entity}
              onEntity={switchEntity}
              onSubmit={submitPrompt}
              mode="landing"
              value={value}
              setValue={setValue}
            />
            <div className="fa-prompt-chips">
              {STARTERS[entity].map((s, i) => (
                <button key={i} className="fa-prompt-chip" onClick={() => submitPrompt(s)}>{s}</button>
              ))}
            </div>
          </div>
        );
      }
      return (
        <>
          <div className="fa-thread">
            {turns.length === 0 && (
              <div className="fa-thread-empty">
                <div className="fa-thread-empty-label">Ask anything {ent.greeting}, or pick a starter:</div>
                <div className="fa-prompt-chips fa-prompt-chips-compact">
                  {STARTERS[entity].map((s, i) => (
                    <button key={i} className="fa-prompt-chip" onClick={() => submitPrompt(s)}>{s}</button>
                  ))}
                </div>
              </div>
            )}
            {turns.map((turn, i) => (
              <ConversationTurn
                key={turn.id}
                turn={turn}
                entity={entity}
                onFollowup={submitPrompt}
                isLatest={i === turns.length - 1}
              />
            ))}
            <div ref={threadEndRef} />
          </div>
          <Composer
            entity={entity}
            onEntity={switchEntity}
            onSubmit={submitPrompt}
            mode="thread"
            value={value}
            setValue={setValue}
          />
        </>
      );
    }

    return (
      <>
        <BeamsBackground
          entityHueBase={ENTITY_HUE_BASE[entity] || 190}
          intensity="strong"
          theme={theme}
        />
        <div className="fa-shell" data-entity={entity}>
          <LeftRail
            entity={entity}
            pageId={pageId}
            onPickPage={openPage}
          />
          <div className="fa-main">
            <TopBar
              entity={entity}
              onEntity={switchEntity}
              onOpenCmdk={() => setCmdkOpen(true)}
              onToggleTheme={toggleTheme}
              theme={theme}
            />
            <div
              className={classNames("fa-stage", "fa-stage-" + mode)}
              data-view-mode={viewMode}
            >
              {viewMode === "ai" ? (
                <ConversationPanel />
              ) : (
                <>
                  <PagePanel
                    pageId={pageId}
                    entity={entity}
                    pageLabel={pageLabel(pageId)}
                    viewMode={viewMode}
                    onSetViewMode={setViewMode}
                  />
                  <div className="fa-thread-col">
                    <ConversationPanel />
                  </div>
                </>
              )}
            </div>
          </div>
          <CmdK
            open={cmdkOpen}
            onClose={() => setCmdkOpen(false)}
            onEntity={switchEntity}
            openReport={openReportFromCmdK}
            entity={entity}
          />
        </div>
      </>
    );
  }

  // ──────────────────────────────────────────────────────────────
  // 15. Mount
  // ──────────────────────────────────────────────────────────────
  const rootEl = document.getElementById("root");
  if (rootEl) {
    ReactDOM.createRoot(rootEl).render(<App />);
  }
})();
