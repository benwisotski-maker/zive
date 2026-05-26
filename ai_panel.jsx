// Zive AI — shared panel content used by both the full-page route
// and the right-side Ask sidebar.

const { useState: useStateAI, useEffect: useEffectAI } = React;

// Brand purple/violet gradient — matches the Ask button on the topbar.
const AI_GRADIENT = "linear-gradient(135deg, #7C5CFF 0%, #615FFF 50%, #4F46E5 100%)";

const QUICK_CARDS = [
  { id: "locate",   title: "Locate content within your documents", icon: "search",   color: "#7C5CFF" },
  { id: "snap",     title: "Generate a performance snapshot",      icon: "doc",      color: "#22C55E" },
  { id: "irr",      title: "Calculate IRR for any fund by quarter", icon: "chart",   color: "#3B82F6" },
  { id: "reg",      title: "Find regulatory deadlines or missing filings", icon: "info", color: "#F59E0B" },
];

const ASK_ABOUT = [
  { id: "page",    label: "Current page",   icon: "panelLeft" },
  { id: "ents",    label: "Entities",       icon: "grid" },
  { id: "tasks",   label: "Tasks",          icon: "tasks" },
  { id: "bc",      label: "BlueCheck",      icon: "shieldCheck" },
  { id: "files",   label: "Files",          icon: "folder" },
  { id: "ann",     label: "Annoucements",   icon: "bell" },
  { id: "models",  label: "Models",         icon: "chart" },
  { id: "users",   label: "Users",          icon: "users" },
  { id: "other",   label: "Something else", icon: "info" },
];

// ────────────── Composer ──────────────
function ZiveAIComposer({ value, onChange, onSend, large = false }) {
  return (
    <div style={{
      background: "var(--surface)",
      borderRadius: 14,
      boxShadow: "inset 0 0 0 1px var(--border-strong)",
      padding: 4,
    }}>
      <div style={{ position: "relative" }}>
        <input
          value={value}
          onChange={e => onChange(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && value.trim()) onSend && onSend(); }}
          placeholder="Ask anything"
          style={{
            width: "100%",
            padding: large ? "16px 52px 14px 16px" : "13px 44px 13px 14px",
            background: "transparent", border: "none", outline: "none",
            color: "var(--fg)", fontSize: large ? 15 : 13.5, fontFamily: "inherit",
            borderRadius: 12,
          }}
        />
        <button onClick={() => value.trim() && onSend && onSend()} style={{
          position: "absolute", right: 6, top: 6,
          width: large ? 32 : 28, height: large ? 32 : 28, borderRadius: 8,
          background: value.trim() ? AI_GRADIENT : "var(--surface-3)",
          border: "none",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", transition: "background 160ms ease",
        }}>
          <Icon name="arrowUR" size={13} color={value.trim() ? "#fff" : "var(--muted)"} />
        </button>
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        padding: "6px 8px 8px",
      }}>
        <button style={aiPillBtn}>
          <Icon name="filter" size={11} color="var(--muted)" /> All sources
          <Icon name="chevronD" size={10} color="var(--muted-2)" />
        </button>
        <button style={aiPillBtn}>
          <Icon name="link" size={11} color="var(--muted)" />
        </button>
      </div>
    </div>
  );
}

const aiPillBtn = {
  display: "inline-flex", alignItems: "center", gap: 5,
  height: 26, padding: "0 10px",
  background: "var(--surface-2)", border: "1px solid var(--border)",
  borderRadius: 8, color: "var(--muted)",
  fontSize: 11.5, fontFamily: "inherit", cursor: "pointer", fontWeight: 500,
};

// ────────────── Quick action card ──────────────
function ZiveAIQuickCard({ card, compact, onClick }) {
  return (
    <button onClick={onClick} className="row-hover" style={{
      background: "var(--surface)",
      borderRadius: 14,
      boxShadow: "inset 0 0 0 1px var(--border)",
      padding: compact ? "14px 14px 16px" : "18px 18px 20px",
      display: "flex", flexDirection: "column", gap: compact ? 18 : 26,
      cursor: "pointer", textAlign: "left", border: "none",
      fontFamily: "inherit", color: "var(--fg)",
      transition: "box-shadow 160ms ease, transform 160ms ease",
      minHeight: compact ? 120 : 150,
    }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--border-strong), 0 4px 14px -6px rgba(124,92,255,0.18)"}
      onMouseLeave={e => e.currentTarget.style.boxShadow = "inset 0 0 0 1px var(--border)"}
    >
      <div style={{
        fontSize: compact ? 13.5 : 15, fontWeight: 500, lineHeight: 1.35,
        letterSpacing: -0.1, color: "var(--fg)",
      }}>{card.title}</div>
      <div style={{ marginTop: "auto" }}>
        <Icon name={card.icon} size={compact ? 18 : 20} color={card.color} />
      </div>
    </button>
  );
}

// ────────────── Disclosure section ──────────────
function ZiveAIDisclosure({ label, defaultOpen = false, children }) {
  const [open, setOpen] = useStateAI(defaultOpen);
  return (
    <div style={{ borderTop: "1px solid var(--border)" }}>
      <button onClick={() => setOpen(v => !v)} style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", padding: "14px 4px",
        background: "transparent", border: "none",
        cursor: "pointer", fontFamily: "inherit",
        color: "var(--fg)", fontSize: 14, fontWeight: 500,
        letterSpacing: -0.1,
      }}>
        <span>{label}</span>
        <Icon name="chevronD" size={13} color="var(--muted-2)"
          style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }} />
      </button>
      {open && <div style={{ padding: "0 4px 14px" }}>{children}</div>}
    </div>
  );
}

// ────────────── Ask-about chip strip ──────────────
function ZiveAIAskAbout({ onPick }) {
  return (
    <div>
      <div style={{
        fontSize: 13, color: "var(--muted)", fontWeight: 500,
        padding: "14px 4px 10px",
      }}>Ask about</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "0 4px 8px" }}>
        {ASK_ABOUT.map(c => (
          <button key={c.id} onClick={() => onPick && onPick(c)} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            height: 32, padding: "0 12px",
            background: "var(--surface)",
            border: "1px solid var(--border)",
            borderRadius: 999,
            color: "var(--fg-2)", fontSize: 12.5, fontWeight: 450,
            fontFamily: "inherit", cursor: "pointer",
            transition: "all 120ms ease",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border)"; }}
          >
            <Icon name={c.icon} size={13} color="var(--muted)" />
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ────────────── Full-page Zive AI route ──────────────
function ZiveAIPage() {
  const [q, setQ] = useStateAI("");
  return (
    <div style={{
      minHeight: "calc(100vh - 56px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "48px 40px",
    }} className="fade-up">
      <div style={{ width: "100%", maxWidth: 760 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{
            margin: 0, fontSize: 30, fontWeight: 500, letterSpacing: -0.6,
            display: "inline-flex", alignItems: "center", gap: 12,
          }}>
            What can I help with?
          </h1>
        </div>

        {/* Composer */}
        <div style={{ marginBottom: 20 }}>
          <ZiveAIComposer value={q} onChange={setQ} large />
        </div>

        {/* Quick action grid */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14,
          marginBottom: 28,
        }}>
          {QUICK_CARDS.map(card => (
            <ZiveAIQuickCard key={card.id} card={card} onClick={() => setQ(card.title)} />
          ))}
        </div>

        {/* Disclosures */}
        <ZiveAIDisclosure label="Saved actions">
          <div style={{ fontSize: 12.5, color: "var(--muted-2)", padding: "8px 0" }}>
            Pin frequent prompts here for one-click reuse.
          </div>
        </ZiveAIDisclosure>
        <ZiveAIDisclosure label="Latest chats">
          <div style={{ fontSize: 12.5, color: "var(--muted-2)", padding: "8px 0" }}>
            Your conversation history will appear here.
          </div>
        </ZiveAIDisclosure>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 4 }}>
          <ZiveAIAskAbout onPick={c => setQ("Ask about " + c.label.toLowerCase() + "…")} />
        </div>
      </div>
    </div>
  );
}

// ────────────── Right-side Ask sidebar drawer ──────────────
function AskSidebar({ onClose, onExpand }) {
  const [q, setQ] = useStateAI("");

  useEffectAI(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose && onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return ReactDOM.createPortal(
    <div className="ask-sidebar-enter" style={{
      position: "fixed",
      top: 0, right: 0, bottom: 0,
      width: "min(440px, 92vw)",
      background: "var(--bg)",
      borderLeft: "1px solid var(--border)",
      boxShadow: "-8px 0 28px -12px rgba(0,0,0,0.25)",
      zIndex: 60,
      display: "flex", flexDirection: "column",
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        height: 56, padding: "0 12px",
        borderBottom: "1px solid var(--border)",
      }}>
        <button onClick={onClose} title="Close" style={hdrIconBtn}>
          <Icon name="menu" size={15} color="var(--muted)" />
        </button>
        <div style={{ flex: 1, textAlign: "center", fontSize: 14, fontWeight: 500, letterSpacing: -0.1, display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          <span style={{
            background: AI_GRADIENT,
            WebkitBackgroundClip: "text", backgroundClip: "text",
            WebkitTextFillColor: "transparent", color: "transparent",
            fontWeight: 600,
          }}>Zive AI</span>
        </div>
        <button onClick={onExpand} title="Open full view" style={hdrIconBtn}>
          <Icon name="expand" size={14} color="var(--muted)" />
        </button>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "auto", padding: "18px 16px 24px" }}>
        <div style={{ marginBottom: 14 }}>
          <ZiveAIComposer value={q} onChange={setQ} />
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10,
          marginBottom: 18,
        }}>
          {QUICK_CARDS.map(card => (
            <ZiveAIQuickCard key={card.id} card={card} compact onClick={() => setQ(card.title)} />
          ))}
        </div>

        <ZiveAIDisclosure label="Saved actions">
          <div style={{ fontSize: 12.5, color: "var(--muted-2)", padding: "8px 0" }}>
            Pin frequent prompts here for one-click reuse.
          </div>
        </ZiveAIDisclosure>
        <ZiveAIDisclosure label="Latest chats">
          <div style={{ fontSize: 12.5, color: "var(--muted-2)", padding: "8px 0" }}>
            Your conversation history will appear here.
          </div>
        </ZiveAIDisclosure>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: 4 }}>
          <ZiveAIAskAbout onPick={c => setQ("Ask about " + c.label.toLowerCase() + "…")} />
        </div>
      </div>
    </div>,
    document.body
  );
}

const hdrIconBtn = {
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  width: 32, height: 32, borderRadius: 8,
  background: "transparent", border: "none",
  cursor: "pointer", fontFamily: "inherit",
};

// ────────────── Highlighted "Zive AI" sidebar nav item ──────────────
function ZiveAINavItem({ active, onClick, collapsed }) {
  if (collapsed) {
    return (
      <button onClick={onClick} title="Zive AI" style={{
        width: 36, height: 36, margin: "1px auto",
        borderRadius: 8,
        background: AI_GRADIENT,
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "1px solid rgba(255,255,255,0.14)",
        boxShadow: active
          ? "0 4px 14px rgba(97,95,255,0.45), inset 0 1px 0 rgba(255,255,255,0.2), 0 0 0 2px rgba(124,92,255,0.35)"
          : "0 3px 10px rgba(97,95,255,0.32), inset 0 1px 0 rgba(255,255,255,0.18)",
        cursor: "pointer", transition: "all 140ms ease",
      }}>
        <Icon name="sparkle" size={15} color="#fff" />
      </button>
    );
  }
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 10, width: "100%",
      padding: "8px 12px", borderRadius: 9, minHeight: 34,
      background: AI_GRADIENT,
      color: "#FFFFFF",
      fontSize: 13, fontWeight: 500, letterSpacing: -0.1,
      textAlign: "left", border: "1px solid rgba(255,255,255,0.14)",
      cursor: "pointer", fontFamily: "inherit",
      boxShadow: active
        ? "0 6px 18px rgba(97,95,255,0.5), inset 0 1px 0 rgba(255,255,255,0.22)"
        : "0 4px 14px rgba(97,95,255,0.32), inset 0 1px 0 rgba(255,255,255,0.18)",
      transition: "all 140ms ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1.06)"; e.currentTarget.style.boxShadow = "0 6px 18px rgba(97,95,255,0.5), inset 0 1px 0 rgba(255,255,255,0.22)"; }}
      onMouseLeave={e => { e.currentTarget.style.filter = "none"; e.currentTarget.style.boxShadow = active ? "0 6px 18px rgba(97,95,255,0.5), inset 0 1px 0 rgba(255,255,255,0.22)" : "0 4px 14px rgba(97,95,255,0.32), inset 0 1px 0 rgba(255,255,255,0.18)"; }}
    >
      <Icon name="sparkle" size={15} color="#fff" />
      <span style={{ flex: 1 }}>Zive AI</span>
      {active && (
        <span style={{
          width: 6, height: 6, borderRadius: 999,
          background: "#fff", boxShadow: "0 0 0 3px rgba(255,255,255,0.25)",
        }} />
      )}
    </button>
  );
}

Object.assign(window, { ZiveAIPage, AskSidebar, ZiveAINavItem });
