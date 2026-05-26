// Zive — Popups & modals (dark iris language)
// Includes: Modal shell, NewInvitationModal, NewOnboardingTemplateModal,
// UploadDocumentsModal, PagesPopover, FundSwitcherPopover (compact),
// UserMenuPopover (compact). The Ask window lives separately in app.jsx.
const { useState: useStateM, useEffect: useEffectM, useRef: useRefM } = React;

// ────────────── Modal shell ──────────────
// Mirrors the Ask window header bar: dark navy strip with title + window controls.
// Body uses var(--surface) so it sits on top of the page surface, with a thin
// border. Footer is opt-in via children.
function Modal({ title, onClose, children, width = 560, height = "auto", footer, hint }) {
  useEffectM(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return ReactDOM.createPortal(
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, zIndex: 60,
      background: "var(--modal-overlay)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div onClick={e => e.stopPropagation()} className="fade-up" style={{
        width, maxWidth: "100%", maxHeight: "92vh",
        background: "var(--surface)",
        border: "1px solid var(--border-strong)",
        borderRadius: 14,
        boxShadow: "var(--shadow-modal)",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}>
        {/* Header — theme-aware */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          padding: "12px 14px",
          background: "var(--modal-header-bg)", color: "var(--modal-header-fg)",
          borderBottom: "1px solid var(--modal-header-border)",
        }}>
          <span style={{ fontSize: 13, fontWeight: 500, color: "var(--modal-header-fg)", letterSpacing: -0.1 }}>{title}</span>
          <div style={{ flex: 1 }} />
          <button onClick={onClose} title="Close" style={{
            width: 26, height: 26, borderRadius: 6,
            background: "transparent", border: "none", cursor: "pointer",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            color: "var(--modal-header-fg)",
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--modal-header-btn-hover)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            <Icon name="close" size={13} color="currentColor" />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: "26px 28px" }}>
          {children}
        </div>

        {/* Footer */}
        {(footer || hint) && (
          <div style={{
            padding: "12px 18px",
            background: "var(--surface-2)",
            borderTop: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <div style={{ fontSize: 11.5, color: "var(--muted-2)", flex: 1 }}>{hint}</div>
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

// ────────────── Form primitives (dark) ──────────────
const fieldLabel = {
  fontSize: 11.5, fontWeight: 500, color: "var(--muted)",
  marginBottom: 6, display: "block",
};

const inputBase = {
  width: "100%",
  background: "var(--surface-2)",
  border: "1px solid var(--border-strong)",
  borderRadius: 8,
  padding: "10px 12px",
  fontSize: 13, color: "var(--fg)",
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 120ms ease, background 120ms ease",
};

function Field({ label, hint, children, style }) {
  return (
    <div style={{ marginBottom: 16, ...style }}>
      {label && <label style={fieldLabel}>{label}</label>}
      {children}
      {hint && <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 5 }}>{hint}</div>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", ...rest }) {
  const [focused, setFocused] = useStateM(false);
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        ...inputBase,
        borderColor: focused ? "var(--accent)" : "var(--border-strong)",
        boxShadow: focused ? "0 0 0 3px var(--accent-tint)" : "none",
      }}
      {...rest}
    />
  );
}

function SectionHeader({ icon, label }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 8,
      fontSize: 11.5, fontWeight: 500, color: "var(--muted)",
      textTransform: "uppercase", letterSpacing: 0.4,
      marginBottom: 14, paddingBottom: 10,
      borderBottom: "1px dashed var(--border-strong)",
    }}>
      {icon && <Icon name={icon} size={13} color="var(--muted-2)" />}
      {label}
    </div>
  );
}

function RadioOption({ checked, label, sublabel, onChange }) {
  return (
    <button onClick={onChange} style={{
      display: "flex", alignItems: "center", gap: 10,
      width: "100%", padding: "10px 12px", borderRadius: 8,
      background: "transparent", border: "none", cursor: "pointer",
      fontFamily: "inherit", textAlign: "left",
      transition: "background 120ms ease",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--surface-3)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <span style={{
        width: 16, height: 16, borderRadius: 999,
        boxShadow: checked
          ? "inset 0 0 0 5px var(--accent), inset 0 0 0 6px var(--accent)"
          : "inset 0 0 0 1.5px var(--border-bright)",
        background: checked ? "#fff" : "transparent",
        flexShrink: 0,
        transition: "all 140ms ease",
      }} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "var(--fg)", fontWeight: 450 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 2 }}>{sublabel}</div>}
      </div>
    </button>
  );
}

function CheckboxRow({ checked, label, sublabel, onChange }) {
  return (
    <label style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "10px 12px", borderRadius: 8,
      cursor: "pointer", userSelect: "none",
    }}
      onMouseEnter={e => e.currentTarget.style.background = "var(--surface-3)"}
      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
    >
      <span onClick={onChange} style={{
        width: 16, height: 16, borderRadius: 4,
        background: checked ? "var(--accent)" : "transparent",
        boxShadow: checked
          ? "inset 0 0 0 1px var(--accent)"
          : "inset 0 0 0 1.5px var(--border-bright)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, transition: "all 140ms ease",
      }}>
        {checked && <Icon name="check" size={11} color="#fff" />}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, color: "var(--fg)", fontWeight: 450 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 2 }}>{sublabel}</div>}
      </div>
    </label>
  );
}

function PrimaryBtn({ children, onClick, icon, disabled }) {
  // Height ~32 (9px y-pad + 13px line) → radius = 0.4 * 32 = 12.8
  return (
    <button onClick={onClick} disabled={disabled} style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: "9px 16px", borderRadius: 13,
      background: disabled ? "var(--surface-3)" : "var(--accent)",
      color: disabled ? "var(--muted-2)" : "#fff",
      border: "none", cursor: disabled ? "not-allowed" : "pointer",
      fontSize: 13, fontWeight: 500, fontFamily: "inherit",
      boxShadow: disabled ? "none" : "inset 0 0 0 1px rgba(255,255,255,0.14), 0 6px 16px var(--accent-ring-25)",
      transition: "all 120ms ease",
    }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "var(--accent-hover)"; }}
      onMouseLeave={e => { if (!disabled) e.currentTarget.style.background = "var(--accent)"; }}
    >
      {icon && <Icon name={icon} size={12} color="#fff" />}
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }) {
  // Match PrimaryBtn radius (height ~32 → 12.8)
  return (
    <button onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 7,
      padding: "9px 16px", borderRadius: 13,
      background: "var(--chip)",
      color: "var(--fg-2)",
      border: "1px solid var(--border-strong)",
      cursor: "pointer",
      fontSize: 13, fontWeight: 500, fontFamily: "inherit",
      transition: "all 120ms ease",
    }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--chip-hover)"; e.currentTarget.style.borderColor = "var(--border-bright)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--chip)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
    >
      {children}
    </button>
  );
}

// ────────────── New invitation modal ──────────────
function NewInvitationModal({ onClose }) {
  const [role, setRole] = useStateM("Investor");
  const [name, setName] = useStateM("");
  const [email, setEmail] = useStateM("");
  const [phone, setPhone] = useStateM("");
  const [country, setCountry] = useStateM("+1");
  const [letUserSelect, setLetUserSelect] = useStateM(true);
  const [accounts, setAccounts] = useStateM(["Direct"]);
  const [search, setSearch] = useStateM("");

  const allAccounts = ["Direct", "Charles Schwab", "Fidelity", "Goldman Custody", "JP Morgan", "Pershing", "Bank of NY Mellon"];
  const filtered = allAccounts.filter(a => a.toLowerCase().includes(search.toLowerCase()));

  const toggleAccount = (a) => {
    setAccounts(arr => arr.includes(a) ? arr.filter(x => x !== a) : [...arr, a]);
  };

  const canSend = name.trim() && email.trim();

  return (
    <Modal
      title="New invitation"
      onClose={onClose}
      width={620}
      hint={<>Need help? Open <span style={{ color: "var(--accent)", fontWeight: 500 }}>Help Center</span></>}
      footer={<>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn icon="send" disabled={!canSend} onClick={() => onClose()}>Send invitation</PrimaryBtn>
      </>}
    >
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>New invitation</h2>
        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, maxWidth: 480 }}>
          Send an email invitation to bring an advisor or investor into the onboarding flow. They'll receive a secure link to create an account and begin the subscription process.
        </div>
      </div>

      <SectionHeader icon="users" label="Invitee details" />

      <Field>
        <div style={{
          background: "var(--surface-2)", borderRadius: 10,
          border: "1px solid var(--border-strong)",
          padding: 4,
        }}>
          {["Investor", "Advisor"].map(r => (
            <RadioOption key={r} checked={role === r} label={r}
              sublabel={r === "Investor" ? "Will subscribe to a fund directly" : "Manages investments on behalf of clients"}
              onChange={() => setRole(r)}
            />
          ))}
        </div>
      </Field>

      <Field label="Full name">
        <TextInput value={name} onChange={e => setName(e.target.value)} placeholder="Enter name" />
      </Field>

      <Field label="Email address">
        <TextInput type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter email address" />
      </Field>

      <Field label="Phone number">
        <div style={{ display: "flex", gap: 8 }}>
          <CountryCode value={country} onChange={setCountry} />
          <TextInput value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter phone number" />
        </div>
      </Field>

      <div style={{ height: 16 }} />
      <SectionHeader icon="users" label="Account and custodian" />

      <CheckboxRow checked={letUserSelect} onChange={() => setLetUserSelect(v => !v)}
        label="Let user select"
        sublabel="The invitee will be able to choose from the custodians you enable below"
      />

      <div style={{ height: 8 }} />

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "var(--surface-2)",
        border: "1px solid var(--border-strong)",
        borderRadius: 8, padding: "8px 12px",
      }}>
        <Icon name="search" size={13} color="var(--muted-2)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search custodians"
          style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 13, color: "var(--fg)", fontFamily: "inherit" }}
        />
      </div>

      <div style={{ marginTop: 8, padding: 4, background: "var(--surface-2)", borderRadius: 8, border: "1px solid var(--border)" }}>
        {filtered.map(a => (
          <CheckboxRow key={a} checked={accounts.includes(a)} onChange={() => toggleAccount(a)}
            label={a}
            sublabel={a === "Other" ? "Free-form text field appears if selected" : undefined}
          />
        ))}
        <CheckboxRow checked={accounts.includes("Other")} onChange={() => toggleAccount("Other")}
          label="Other"
          sublabel="With a free-form text field if selected"
        />
      </div>
    </Modal>
  );
}

function CountryCode({ value, onChange }) {
  const [open, setOpen] = useStateM(false);
  const codes = ["+1", "+44", "+33", "+49", "+41", "+91", "+65", "+852", "+971"];
  return (
    <div style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)} style={{
        ...inputBase, width: "auto", padding: "10px 10px 10px 12px",
        display: "inline-flex", alignItems: "center", gap: 6,
        cursor: "pointer", minWidth: 80,
      }}>
        <span className="num" style={{ fontWeight: 500 }}>{value}</span>
        <Icon name="chevronD" size={11} color="var(--muted-2)" />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0,
          width: 100, maxHeight: 220, overflow: "auto",
          background: "var(--elevated)",
          border: "1px solid var(--border-strong)",
          borderRadius: 8,
          boxShadow: "var(--shadow-pop)",
          padding: 4, zIndex: 10,
        }}>
          {codes.map(c => (
            <button key={c} onClick={() => { onChange(c); setOpen(false); }} style={{
              display: "flex", alignItems: "center", width: "100%",
              padding: "7px 10px", borderRadius: 6,
              background: c === value ? "var(--accent-tint)" : "transparent",
              border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: 12, color: "var(--fg-2)", textAlign: "left",
            }}
              onMouseEnter={e => { if (c !== value) e.currentTarget.style.background = "var(--surface-2)"; }}
              onMouseLeave={e => { if (c !== value) e.currentTarget.style.background = "transparent"; }}
            >
              <span className="num">{c}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────── New onboarding template modal ──────────────
function NewOnboardingTemplateModal({ onClose }) {
  const [titlingInd, setTitlingInd] = useStateM("NFS FMTC FBO");
  const [titlingCorp, setTitlingCorp] = useStateM("NFS LLC FBO");
  const [accountName, setAccountName] = useStateM("Fidelity Account Prefilled");
  const [accountNum, setAccountNum] = useStateM("543463466352413");
  const [routing, setRouting] = useStateM("021000021");
  const [swift, setSwift] = useStateM("0156435325125481");
  const [aba, setAba] = useStateM("0156435325125481");
  const [bankName, setBankName] = useStateM("Fidelity Prefilled Bank");
  const [bankAddr, setBankAddr] = useStateM("12 Maple Street");
  const [bankAddr2, setBankAddr2] = useStateM("");
  const [city, setCity] = useStateM("New York");
  const [state, setState] = useStateM("New York");
  const [zip, setZip] = useStateM("10001");
  const [country, setCountry] = useStateM("United States");

  return (
    <Modal
      title="New onboarding template"
      onClose={onClose}
      width={780}
      hint={<>Need more help? Try the <span style={{ color: "var(--accent)", fontWeight: 500 }}>Help Center</span></>}
      footer={<>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn icon="check" onClick={() => onClose()}>Save template</PrimaryBtn>
      </>}
    >
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>New onboarding template</h2>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          fontSize: 12.5, color: "var(--accent)", fontWeight: 500,
          padding: "5px 10px", borderRadius: 999,
          background: "var(--accent-tint)",
          boxShadow: "inset 0 0 0 1px var(--accent-ring-25)",
          marginTop: 4,
        }}>
          <Icon name="info" size={11} color="var(--accent)" />
          Prefilled details — review before saving
        </div>
      </div>

      <SectionHeader icon="receipt" label="End investor titling" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Custom account titling (Individual)">
          <TextInput value={titlingInd} onChange={e => setTitlingInd(e.target.value)} />
        </Field>
        <Field label="Custom account titling (Corporation)">
          <TextInput value={titlingCorp} onChange={e => setTitlingCorp(e.target.value)} />
        </Field>
      </div>

      <SectionHeader icon="accounting" label="Account information" />
      <Field label={<>Account name <Icon name="help" size={11} color="var(--muted-2)" style={{ marginLeft: 4 }} /></>}>
        <TextInput value={accountName} onChange={e => setAccountName(e.target.value)} />
      </Field>
      <Field label="Account number">
        <TextInput value={accountNum} onChange={e => setAccountNum(e.target.value)} />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Field label="Routing number">
          <TextInput value={routing} onChange={e => setRouting(e.target.value)} />
        </Field>
        <Field label="Swift code">
          <TextInput value={swift} onChange={e => setSwift(e.target.value)} />
        </Field>
        <Field label="Bank ABA">
          <TextInput value={aba} onChange={e => setAba(e.target.value)} />
        </Field>
      </div>

      <SectionHeader icon="briefcase" label="Bank information" />
      <Field label="Bank name">
        <TextInput value={bankName} onChange={e => setBankName(e.target.value)} />
      </Field>
      <Field label="Bank street address">
        <TextInput value={bankAddr} onChange={e => setBankAddr(e.target.value)} />
      </Field>
      <Field label="Bank street address (additional details)">
        <TextInput value={bankAddr2} onChange={e => setBankAddr2(e.target.value)} placeholder="Enter bank street details" />
      </Field>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Bank city">
          <SelectInput value={city} onChange={setCity} options={["New York", "Boston", "Chicago", "San Francisco", "London", "Zurich", "Singapore"]} />
        </Field>
        <Field label="Bank state">
          <SelectInput value={state} onChange={setState} options={["New York", "Massachusetts", "Illinois", "California"]} />
        </Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <Field label="Bank zip code">
          <TextInput value={zip} onChange={e => setZip(e.target.value)} />
        </Field>
        <Field label="Bank country">
          <SelectInput value={country} onChange={setCountry} options={["United States", "United Kingdom", "Switzerland", "Singapore"]} />
        </Field>
      </div>
    </Modal>
  );
}

function SelectInput({ value, onChange, options }) {
  const [open, setOpen] = useStateM(false);
  const ref = useRefM(null);
  useEffectM(() => {
    const onDoc = (e) => { if (!ref.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(v => !v)} style={{
        ...inputBase, padding: "10px 12px",
        display: "flex", alignItems: "center", gap: 6,
        cursor: "pointer", textAlign: "left",
      }}>
        <span style={{ flex: 1 }}>{value}</span>
        <Icon name="chevronD" size={11} color="var(--muted-2)" />
      </button>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0,
          maxHeight: 240, overflow: "auto",
          background: "var(--elevated)",
          border: "1px solid var(--border-strong)",
          borderRadius: 8,
          boxShadow: "var(--shadow-pop)",
          padding: 4, zIndex: 10,
        }}>
          {options.map(o => (
            <button key={o} onClick={() => { onChange(o); setOpen(false); }} style={{
              display: "flex", alignItems: "center", width: "100%",
              padding: "8px 10px", borderRadius: 6,
              background: o === value ? "var(--accent-tint)" : "transparent",
              border: "none", cursor: "pointer",
              fontFamily: "inherit", fontSize: 12.5, color: "var(--fg-2)", textAlign: "left",
            }}
              onMouseEnter={e => { if (o !== value) e.currentTarget.style.background = "var(--surface-2)"; }}
              onMouseLeave={e => { if (o !== value) e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ flex: 1 }}>{o}</span>
              {o === value && <Icon name="check" size={11} color="var(--accent)" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ────────────── Upload documents modal ──────────────
function UploadDocumentsModal({ onClose, title = "Upload documents" }) {
  const [files, setFiles] = useStateM([]);
  const [drag, setDrag] = useStateM(false);
  const [account, setAccount] = useStateM("None");
  const [search, setSearch] = useStateM("");
  const inputRef = useRefM(null);

  const allAccounts = ["Direct", "Charles Schwab", "Fidelity", "Pershing", "Goldman Custody"];
  const filtered = allAccounts.filter(a => a.toLowerCase().includes(search.toLowerCase()));

  const onDrop = (e) => {
    e.preventDefault(); setDrag(false);
    const list = Array.from(e.dataTransfer.files || []);
    if (list.length) setFiles(f => [...f, ...list]);
  };
  const onPick = (e) => {
    const list = Array.from(e.target.files || []);
    if (list.length) setFiles(f => [...f, ...list]);
    e.target.value = "";
  };
  const removeFile = (i) => setFiles(f => f.filter((_, idx) => idx !== i));

  const fmtSize = b => b < 1024 ? b + " B" : b < 1024*1024 ? (b/1024).toFixed(0) + " KB" : (b/(1024*1024)).toFixed(1) + " MB";
  const ext = (n) => { const m = n.match(/\.([^.]+)$/); return m ? m[1].toUpperCase() : "FILE"; };

  return (
    <Modal
      title={title}
      onClose={onClose}
      width={620}
      hint={<>Need more help? Try the <span style={{ color: "var(--accent)", fontWeight: 500 }}>Help Center</span></>}
      footer={<>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn icon="upload" disabled={files.length === 0} onClick={() => onClose()}>
          {files.length ? `Upload ${files.length} file${files.length>1?"s":""}` : "Upload"}
        </PrimaryBtn>
      </>}
    >
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>Upload documents</h2>
        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>
          Drag in subscription documents, statements or reports. Zive will OCR and route them automatically.
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>Documents</div>
        <button onClick={() => inputRef.current?.click()} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "6px 12px", borderRadius: 7,
          background: "var(--surface-2)",
          border: "1px solid var(--border-strong)",
          color: "var(--fg-2)",
          fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
        }}>
          <Icon name="folder" size={11} color="var(--muted)" />
          Browse files
        </button>
      </div>

      <input ref={inputRef} type="file" multiple onChange={onPick} style={{ display: "none" }} />

      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          padding: "32px 20px", borderRadius: 12,
          background: drag ? "var(--accent-tint)" : "var(--surface-2)",
          border: `1.5px dashed ${drag ? "var(--accent)" : "var(--border-bright)"}`,
          textAlign: "center", cursor: "pointer",
          transition: "all 140ms ease",
        }}>
        <div style={{
          width: 36, height: 36, margin: "0 auto 10px",
          borderRadius: 10,
          background: drag ? "var(--accent)" : "var(--surface-3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: drag ? "0 8px 20px var(--accent-ring-35)" : "inset 0 0 0 1px var(--border-bright)",
        }}>
          <Icon name="upload" size={15} color={drag ? "#fff" : "var(--muted)"} />
        </div>
        <div style={{ fontSize: 13, color: drag ? "var(--accent)" : "var(--fg-2)", fontWeight: 500 }}>
          Drag and drop your document here, or click to browse your files
        </div>
        <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 4 }}>
          PDF, DOCX, XLSX, CSV up to 50 MB
        </div>
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
          {files.map((f, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8,
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: "var(--accent-tint)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Icon name="file" size={13} color="var(--accent)" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: "var(--fg)", fontWeight: 450, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                <div style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 1 }}>
                  <span className="num">{ext(f.name)}</span> · <span className="num">{fmtSize(f.size)}</span>
                </div>
              </div>
              <button onClick={() => removeFile(i)} style={{
                width: 26, height: 26, borderRadius: 6,
                background: "transparent", border: "none", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--muted-2)",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.color = "var(--neg)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-2)"; }}
              >
                <Icon name="trash" size={13} color="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div style={{ height: 22 }} />
      <SectionHeader icon="briefcase" label="Account and custodian" />

      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: "var(--surface-2)",
        border: "1px solid var(--border-strong)",
        borderRadius: 8, padding: "8px 12px",
        marginBottom: 8,
      }}>
        <Icon name="search" size={13} color="var(--muted-2)" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search custodians"
          style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 13, color: "var(--fg)", fontFamily: "inherit" }}
        />
      </div>

      <div style={{ padding: 4, background: "var(--surface-2)", borderRadius: 8, border: "1px solid var(--border)" }}>
        <RadioOption checked={account === "None"} label="None" sublabel="Skip account assignment for now" onChange={() => setAccount("None")} />
        {filtered.map(a => (
          <RadioOption key={a} checked={account === a} label={a} onChange={() => setAccount(a)} />
        ))}
        <RadioOption checked={account === "Other"} label="Other"
          sublabel="With a free-form text field if selected"
          onChange={() => setAccount("Other")} />
      </div>
    </Modal>
  );
}

// ────────────── Pages popover (sub-page nav) ──────────────
// Anchored popover used on Onboarding / Reports / Documents pages.
// Positions to the bottom-left of the trigger.
function PagesPopover({ items, value, onChange, onClose, triggerRef, title = "Pages" }) {
  const ref = useRefM(null);
  const [pos, setPos] = useStateM({ left: 0, top: 0 });

  useEffectM(() => {
    const update = () => {
      const r = triggerRef?.current?.getBoundingClientRect();
      if (!r) return;
      setPos({ left: r.left, top: r.bottom + 6 });
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, []);

  useEffectM(() => {
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
    <div ref={ref} className="fade-up" style={{
      position: "fixed", left: pos.left, top: pos.top,
      width: 268,
      background: "var(--elevated)",
      border: "1px solid var(--border-strong)",
      borderRadius: 12,
      boxShadow: "var(--shadow-pop)",
      padding: 6, zIndex: 200,
    }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "8px 10px 6px",
        borderBottom: "1px solid var(--border)",
        marginBottom: 4,
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>{title}</div>
        <button onClick={onClose} style={{
          width: 22, height: 22, borderRadius: 5,
          background: "transparent", border: "none", cursor: "pointer",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          color: "var(--muted-2)",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.color = "var(--fg-2)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-2)"; }}
        >
          <Icon name="close" size={11} color="currentColor" />
        </button>
      </div>
      {items.map(item => (
        <button key={item.id} onClick={() => { onChange(item.id); onClose(); }} style={{
          display: "flex", alignItems: "center", gap: 8,
          width: "100%", padding: "9px 10px",
          borderRadius: 7,
          background: value === item.id ? "var(--surface-3)" : "transparent",
          border: "none", cursor: "pointer",
          fontFamily: "inherit", textAlign: "left",
          color: "var(--fg-2)",
          fontSize: 13, fontWeight: value === item.id ? 500 : 450,
        }}
          onMouseEnter={e => { if (value !== item.id) e.currentTarget.style.background = "var(--surface-2)"; }}
          onMouseLeave={e => { if (value !== item.id) e.currentTarget.style.background = "transparent"; }}
        >
          <span style={{ flex: 1 }}>{item.label}</span>
          {item.count !== undefined && (
            <span className="num" style={{
              fontSize: 10.5, padding: "1px 6px", borderRadius: 4,
              background: "var(--accent-tint)", color: "var(--accent)",
              fontWeight: 500,
            }}>{item.count}</span>
          )}
        </button>
      ))}
    </div>,
    document.body
  );
}

// ────────────── PageMenu trigger ──────────────
// Reusable page-level "Pages ▼" trigger that opens a PagesPopover.
function PageMenu({ items, value, onChange }) {
  const [open, setOpen] = useStateM(false);
  const ref = useRefM(null);
  const current = items.find(i => i.id === value) || items[0];

  return (
    <>
      <button ref={ref} onClick={() => setOpen(v => !v)} style={{
        display: "inline-flex", alignItems: "center", gap: 6, justifyContent: "center",
        padding: "0 11px", height: 28, borderRadius: 11,
        background: open ? "var(--chip-hover)" : "var(--chip)",
        boxShadow: "inset 0 0 0 1px var(--border-strong)",
        border: "none",
        color: "var(--fg-2)",
        fontSize: 12, fontWeight: 500, letterSpacing: -0.1, cursor: "pointer", fontFamily: "inherit",
        whiteSpace: "nowrap",
        transition: "all 100ms ease",
      }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = "var(--chip-hover)"; }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = "var(--chip)"; }}
      >
        <Icon name="menu" size={14} color="var(--muted)" />
        <span>{current.label}</span>
        <Icon name="chevronD" size={12} color="var(--muted-2)" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 160ms ease" }} />
      </button>
      {open && (
        <PagesPopover
          items={items}
          value={value}
          onChange={onChange}
          onClose={() => setOpen(false)}
          triggerRef={ref}
        />
      )}
    </>
  );
}

Object.assign(window, {
  Modal, NewInvitationModal, NewOnboardingTemplateModal, UploadDocumentsModal,
  PagesPopover, PageMenu,
  Field, TextInput, SelectInput, SectionHeader, RadioOption, CheckboxRow,
  PrimaryBtn, GhostBtn,
});
