// Zive — Additional popups: Add investor, Bulk upload, New custom agent (3-step wizard)
const { useState: useStateP2, useRef: useRefP2, useEffect: useEffectP2 } = React;

// ────────────── Add new investor ──────────────
function AddInvestorModal({ onClose }) {
  const [partner, setPartner] = useStateP2("");
  const [exempt, setExempt] = useStateP2("");
  const [date, setDate] = useStateP2("");
  const [committed, setCommitted] = useStateP2("");
  const [called, setCalled] = useStateP2("");
  const [mgmtFee, setMgmtFee] = useStateP2("");
  const [carry, setCarry] = useStateP2("");
  const [cid, setCid] = useStateP2("");

  const partners = ["Direct LP", "Admin Ventures GP, LLC", "Blue Ridge Family Trust", "Evelyn Chen", "Harlow Simmons", "Ironclad Solutions Corp.", "Jonathan D. Harris"];
  const exemptOpts = ["Yes", "No"];

  const canAdd = partner && committed && called;

  return (
    <Modal
      title="Add new investor"
      onClose={onClose}
      width={760}
      hint={<>Need help? Open <span style={{ color: "var(--accent)", fontWeight: 500 }}>Help Center</span></>}
      footer={<>
        <GhostBtn onClick={onClose}>Close</GhostBtn>
        <PrimaryBtn icon="plus" disabled={!canAdd} onClick={() => onClose()}>Add</PrimaryBtn>
      </>}
    >
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>Add new investor</h2>
        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>
          Record a new commitment. Capital terms can be edited later from the investor profile.
        </div>
      </div>

      <SectionHeader icon="users" label="Partner & terms" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Field label="Select partner">
          <SelectInput value={partner || "— Select —"} onChange={setPartner} options={partners} />
        </Field>
        <Field label="Exempt from mgmt fees">
          <SelectInput value={exempt || "— Select —"} onChange={setExempt} options={exemptOpts} />
        </Field>
        <Field label="Date committed">
          <DateInput value={date} onChange={setDate} />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Field label={<>Committed <span style={{ color: "var(--neg)" }}>*</span></>}>
          <CurrencyInput value={committed} onChange={setCommitted} placeholder="0" />
        </Field>
        <Field label={<>Called <span style={{ color: "var(--neg)" }}>*</span></>}>
          <CurrencyInput value={called} onChange={setCalled} placeholder="0" />
        </Field>
        <Field label="Management fees (%)">
          <PercentInput value={mgmtFee} onChange={setMgmtFee} placeholder="0.00" />
        </Field>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14 }}>
        <Field label="Carry (%)">
          <PercentInput value={carry} onChange={setCarry} placeholder="0.00" />
        </Field>
        <Field label="CID">
          <TextInput value={cid} onChange={e => setCid(e.target.value)} placeholder="Enter CID" />
        </Field>
        <div />
      </div>
    </Modal>
  );
}

// Date input — simple text with calendar icon
function DateInput({ value, onChange }) {
  const [focused, setFocused] = useStateP2(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        type="date"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputBaseRef(),
          paddingRight: 36,
          colorScheme: "dark",
          borderColor: focused ? "var(--accent)" : "var(--border-strong)",
          boxShadow: focused ? "0 0 0 3px var(--accent-tint)" : "none",
        }}
      />
      <div style={{
        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
        pointerEvents: "none", color: "var(--muted-2)",
      }}>
        <Icon name="calendar" size={13} color="var(--muted-2)" />
      </div>
    </div>
  );
}

// Currency input — leading $
function CurrencyInput({ value, onChange, placeholder }) {
  const [focused, setFocused] = useStateP2(false);
  const fmt = (v) => {
    if (!v) return "";
    const n = Number(String(v).replace(/[^\d.]/g, ""));
    if (isNaN(n)) return "";
    return n.toLocaleString("en-US");
  };
  return (
    <div style={{ position: "relative" }}>
      <span style={{
        position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
        color: "var(--muted-2)", fontSize: 13, fontWeight: 500, pointerEvents: "none",
      }}>$</span>
      <input
        value={fmt(value)}
        onChange={e => onChange(e.target.value.replace(/[^\d.]/g, ""))}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="num"
        style={{
          ...inputBaseRef(),
          paddingLeft: 24,
          borderColor: focused ? "var(--accent)" : "var(--border-strong)",
          boxShadow: focused ? "0 0 0 3px var(--accent-tint)" : "none",
        }}
      />
    </div>
  );
}

function PercentInput({ value, onChange, placeholder }) {
  const [focused, setFocused] = useStateP2(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        value={value}
        onChange={e => onChange(e.target.value.replace(/[^\d.]/g, ""))}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="num"
        style={{
          ...inputBaseRef(),
          paddingRight: 30,
          borderColor: focused ? "var(--accent)" : "var(--border-strong)",
          boxShadow: focused ? "0 0 0 3px var(--accent-tint)" : "none",
        }}
      />
      <span style={{
        position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
        color: "var(--muted-2)", fontSize: 13, pointerEvents: "none",
      }}>%</span>
    </div>
  );
}

// Helper to inline base style
function inputBaseRef() {
  return {
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
}

// ────────────── Bulk upload investors (xlsx) ──────────────
function BulkUploadInvestorsModal({ onClose }) {
  const [files, setFiles] = useStateP2([]);
  const [drag, setDrag] = useStateP2(false);
  const inputRef = useRefP2(null);

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

  return (
    <Modal
      title="Bulk upload"
      onClose={onClose}
      width={520}
      hint={<>Need a starter? <span style={{ color: "var(--accent)", fontWeight: 500 }}>Download template</span></>}
      footer={<>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn icon="upload" disabled={files.length === 0} onClick={() => onClose()}>
          {files.length ? `Import ${files.length} file${files.length>1?"s":""}` : "Import"}
        </PrimaryBtn>
      </>}
    >
      <div style={{ marginBottom: 22 }}>
        <h2 style={{ margin: "0 0 6px", fontSize: 22, fontWeight: 500, letterSpacing: -0.4 }}>Upload xls file</h2>
        <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>
          Bulk-import investors with their commitments and terms. We'll validate against your fund schema before committing.
        </div>
      </div>

      <button onClick={() => alert("Template download")} style={{
        display: "inline-flex", alignItems: "center", gap: 8,
        padding: "9px 14px", borderRadius: 8,
        background: "var(--surface-2)",
        border: "1px solid var(--border-strong)",
        color: "var(--fg-2)",
        fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
        marginBottom: 18,
      }}
        onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.borderColor = "var(--border-bright)"; }}
        onMouseLeave={e => { e.currentTarget.style.background = "var(--surface-2)"; e.currentTarget.style.borderColor = "var(--border-strong)"; }}
      >
        <Icon name="download" size={12} color="var(--muted)" />
        Download template
      </button>

      <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" multiple onChange={onPick} style={{ display: "none" }} />

      <div
        onDragOver={e => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          padding: "36px 20px", borderRadius: 12,
          background: drag ? "var(--accent-tint)" : "var(--surface-2)",
          border: `1.5px dashed ${drag ? "var(--accent)" : "var(--border-bright)"}`,
          textAlign: "center", cursor: "pointer",
          transition: "all 140ms ease",
        }}>
        <div style={{
          width: 40, height: 40, margin: "0 auto 12px",
          borderRadius: 12,
          background: drag ? "var(--accent)" : "var(--surface-3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: drag ? "0 8px 20px var(--accent-ring-35)" : "inset 0 0 0 1px var(--border-bright)",
        }}>
          <Icon name="upload" size={17} color={drag ? "#fff" : "var(--muted)"} />
        </div>
        <div style={{ fontSize: 13, color: drag ? "var(--accent)" : "var(--fg-2)", fontWeight: 500 }}>
          Drag and drop your documents here
        </div>
        <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 4 }}>
          Only XLSX files are allowed · Max size 100MB
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
                background: "rgba(74, 222, 128, 0.12)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--pos)",
              }}>
                <Icon name="file" size={13} color="currentColor" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: "var(--fg)", fontWeight: 450, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                <div className="num" style={{ fontSize: 11, color: "var(--muted-2)", marginTop: 1 }}>{fmtSize(f.size)}</div>
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
    </Modal>
  );
}

// ────────────── New custom agent (3-step wizard) ──────────────
const AGENT_ACTION_LIBRARY = [
  { group: "Transactions", items: ["Create capital call", "Record expense", "Valuation", "Investment", "New investments / stock splits", "Portfolio interest", "Realizations", "Receivable / payables", "Expenses"] },
  { group: "Close & reconcile", items: ["Bank reconciliations", "Valuations"] },
  { group: "Allocations", items: ["Preallocation file", "Allocations", "Transfers", "Snapshot"] },
  { group: "Financials", items: ["Financials + partners capital", "Footnotes", "PDF full set of financials"] },
  { group: "LP Reporting", items: ["LP cover letter", "Generate cap account statements", "Posted to the portal — final", "Posted to the portal — secondary review"] },
];
const AGENT_ALL_ACTIONS = AGENT_ACTION_LIBRARY.flatMap(g => g.items);

function NewAgentModal({ onClose }) {
  const [step, setStep] = useStateP2(1);
  const [name, setName] = useStateP2("");
  const [description, setDescription] = useStateP2("");
  const [active, setActive] = useStateP2(true);
  const [actions, setActions] = useStateP2([{ type: "", how: "" }, { type: "", how: "" }, { type: "", how: "" }]);
  const [filter, setFilter] = useStateP2("");

  const addAction = (type = "") => setActions(arr => [...arr, { type, how: "" }]);
  const removeAction = (i) => setActions(arr => arr.filter((_, idx) => idx !== i));
  const updateAction = (i, patch) => setActions(arr => arr.map((a, idx) => idx === i ? { ...a, ...patch } : a));

  const filteredLib = AGENT_ACTION_LIBRARY
    .map(g => ({ ...g, items: g.items.filter(it => it.toLowerCase().includes(filter.toLowerCase())) }))
    .filter(g => g.items.length > 0);

  const configuredCount = actions.filter(a => a.type).length;

  const next = () => setStep(s => Math.min(3, s + 1));
  const back = () => setStep(s => Math.max(1, s - 1));

  return (
    <Modal
      title={<><span style={{ opacity: 0.7, fontWeight: 400, marginRight: 6 }}>New custom agent</span> · {name || "Untitled agent"}</>}
      onClose={onClose}
      width={820}
      footer={<>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <div style={{ flex: 1 }} />
        {step > 1 && <GhostBtn onClick={back}>Back</GhostBtn>}
        {step < 3
          ? <PrimaryBtn icon="chevronR" onClick={next}>Continue</PrimaryBtn>
          : <PrimaryBtn icon="check" disabled={!name || configuredCount === 0} onClick={() => onClose()}>Create agent</PrimaryBtn>
        }
      </>}
    >
      {/* Header band — agent identity */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
        <div style={{
          width: 44, height: 44, borderRadius: 11,
          background: "var(--accent-tint)", color: "var(--accent)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "inset 0 0 0 1px var(--accent-ring-25)",
        }}>
          <Icon name="agent" size={22} />
        </div>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 500, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 2 }}>New custom agent</div>
          <div style={{ fontSize: 18, fontWeight: 500, letterSpacing: -0.3, color: "var(--fg)" }}>{name || "Untitled agent"}</div>
        </div>
      </div>

      {/* Stepper */}
      <Stepper steps={["Basics", "Actions", "Review"]} current={step} onJump={(i) => { if (i + 1 <= step) setStep(i + 1); }} />

      <div style={{ height: 24 }} />

      {step === 1 && (
        <BasicsStep name={name} setName={setName} description={description} setDescription={setDescription} active={active} setActive={setActive} />
      )}
      {step === 2 && (
        <ActionsStep
          actions={actions} addAction={addAction} removeAction={removeAction} updateAction={updateAction}
          filter={filter} setFilter={setFilter} filteredLib={filteredLib}
        />
      )}
      {step === 3 && (
        <ReviewStep name={name} description={description} active={active} actions={actions} />
      )}
    </Modal>
  );
}

function Stepper({ steps, current, onJump }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
      {steps.map((label, i) => {
        const idx = i + 1;
        const done = idx < current;
        const active = idx === current;
        return (
          <React.Fragment key={label}>
            <button onClick={() => onJump?.(i)} style={{
              display: "inline-flex", alignItems: "center", gap: 9,
              padding: "7px 12px", borderRadius: 999,
              background: active ? "var(--accent-tint)" : "transparent",
              border: "none", cursor: idx <= current ? "pointer" : "default",
              fontFamily: "inherit",
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 999,
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                fontSize: 11, fontWeight: 600,
                background: done ? "var(--pos)" : active ? "var(--accent)" : "var(--surface-3)",
                color: done || active ? "#fff" : "var(--muted)",
                boxShadow: done || active ? "none" : "inset 0 0 0 1px var(--border-bright)",
              }}>
                {done ? <Icon name="check" size={11} color="#fff" strokeWidth={3} /> : idx}
              </span>
              <span style={{
                fontSize: 13, fontWeight: 500,
                color: active ? "var(--accent)" : done ? "var(--fg-2)" : "var(--muted-2)",
              }}>{label}</span>
            </button>
            {i < steps.length - 1 && (
              <div style={{
                flex: 1, height: 1,
                background: idx < current ? "var(--pos)" : "var(--border-strong)",
                margin: "0 4px",
                opacity: idx < current ? 0.6 : 1,
              }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function BasicsStep({ name, setName, description, setDescription, active, setActive }) {
  return (
    <div className="fade-up">
      <Field label="Agent name">
        <TextInput value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Quarterly Close Agent" />
        <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 5 }}>Give your agent a clear, recognizable name.</div>
      </Field>

      <Field label="Description">
        <textarea value={description} onChange={e => setDescription(e.target.value)}
          placeholder="e.g. Automates quarterly capital call preparation and review."
          rows={3}
          style={{
            width: "100%",
            background: "var(--surface-2)",
            border: "1px solid var(--border-strong)",
            borderRadius: 8,
            padding: "10px 12px",
            fontSize: 13, color: "var(--fg)",
            fontFamily: "inherit",
            outline: "none",
            resize: "vertical",
          }}
        />
        <div style={{ fontSize: 11.5, color: "var(--muted-2)", marginTop: 5 }}>What does this agent help you do? (optional)</div>
      </Field>

      <div style={{ borderTop: "1px solid var(--border)", margin: "10px 0 18px" }} />

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 13, color: "var(--fg)", fontWeight: 500, marginBottom: 10 }}>Agent status</div>
        <label style={{ display: "inline-flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
          <Toggle checked={active} onChange={() => setActive(v => !v)} />
          <span style={{ fontSize: 13, color: "var(--fg-2)" }}>Activate agent immediately</span>
        </label>
      </div>

      {/* Tips card */}
      <div style={{
        padding: 14, borderRadius: 10,
        background: "rgba(245, 158, 11, 0.06)",
        border: "1px solid rgba(245, 158, 11, 0.18)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: "rgba(245, 158, 11, 0.16)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--warn)",
          }}>
            <Icon name="lightning" size={12} color="currentColor" />
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--warn)" }}>Tips for creating effective agents</div>
        </div>
        {[
          "Use clear, descriptive names that indicate the agent's primary function",
          "Order actions logically — validation before execution",
          "Include approval steps for sensitive operations",
        ].map(t => (
          <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "3px 0", fontSize: 12.5, color: "var(--fg-2)" }}>
            <Icon name="check" size={11} color="var(--warn)" style={{ marginTop: 4, flexShrink: 0 }} strokeWidth={3} />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button onClick={onChange} style={{
      width: 38, height: 22, borderRadius: 999,
      background: checked ? "var(--accent)" : "var(--surface-3)",
      boxShadow: checked ? "none" : "inset 0 0 0 1px var(--border-bright)",
      border: "none", cursor: "pointer",
      position: "relative",
      transition: "all 160ms ease",
    }}>
      <span style={{
        position: "absolute", top: 3, left: checked ? 19 : 3,
        width: 16, height: 16, borderRadius: 999,
        background: "#fff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
        transition: "left 160ms cubic-bezier(.4,1.4,.6,1)",
      }} />
    </button>
  );
}

function ActionsStep({ actions, addAction, removeAction, updateAction, filter, setFilter, filteredLib }) {
  const configured = actions.filter(a => a.type).length;
  return (
    <div className="fade-up">
      <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Actions <span style={{ color: "var(--muted-2)" }}>· {actions.length} added</span>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted-2)", marginTop: 4, maxWidth: 540 }}>
            Choose what this agent should do. Each action describes one task it can perform — they execute in the listed order.
          </div>
        </div>
        <button onClick={() => addAction()} style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "7px 12px", borderRadius: 8,
          background: "var(--surface-2)",
          border: "1px solid var(--border-strong)",
          color: "var(--fg-2)",
          fontSize: 12.5, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
        }}>
          <Icon name="plus" size={11} color="var(--muted)" />
          Add blank
        </button>
      </div>

      {/* Action rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14, marginBottom: 22 }}>
        {actions.map((a, i) => (
          <div key={i} style={{
            background: "var(--surface-2)",
            border: "1px solid var(--border-strong)",
            borderRadius: 10,
            padding: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
              <span style={{
                fontSize: 10.5, fontWeight: 600, color: "var(--accent)",
                padding: "2px 7px", borderRadius: 4,
                background: "var(--accent-tint)",
                marginRight: 8,
              }} className="num">{i + 1}</span>
              <span style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>Action</span>
              <div style={{ flex: 1 }} />
              <button onClick={() => removeAction(i)} style={{
                width: 22, height: 22, borderRadius: 5,
                background: "transparent", border: "none", cursor: "pointer",
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                color: "var(--muted-2)",
              }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--surface-3)"; e.currentTarget.style.color = "var(--neg)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted-2)"; }}
              >
                <Icon name="close" size={11} color="currentColor" />
              </button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 10 }}>
              <SelectInput value={a.type || "Select action type…"} onChange={v => updateAction(i, { type: v })} options={AGENT_ALL_ACTIONS} />
              <TextInput value={a.how} onChange={e => updateAction(i, { how: e.target.value })} placeholder="How should this action be performed?" />
            </div>
          </div>
        ))}
      </div>

      {/* Action library */}
      <div style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 14,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>
            Action library <span style={{ color: "var(--muted-2)" }}>· {AGENT_ALL_ACTIONS.length} available</span>
          </div>
          <div style={{ flex: 1 }} />
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "var(--surface)",
            border: "1px solid var(--border-strong)",
            borderRadius: 8, padding: "6px 10px",
            width: 220,
          }}>
            <Icon name="search" size={12} color="var(--muted-2)" />
            <input value={filter} onChange={e => setFilter(e.target.value)} placeholder="Filter actions…"
              style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: 12.5, color: "var(--fg)", fontFamily: "inherit" }}
            />
          </div>
        </div>
        {filteredLib.map(g => (
          <div key={g.group} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 10.5, fontWeight: 500, color: "var(--muted-2)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>{g.group}</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {g.items.map(it => (
                <button key={it} onClick={() => addAction(it)} style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "6px 10px", borderRadius: 999,
                  background: "var(--surface)",
                  border: "1px solid var(--border-strong)",
                  color: "var(--fg-2)",
                  fontSize: 12, fontWeight: 450, cursor: "pointer", fontFamily: "inherit",
                  transition: "all 120ms ease",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--accent-tint)"; e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border-strong)"; e.currentTarget.style.color = "var(--fg-2)"; }}
                >
                  <Icon name="plus" size={10} color="currentColor" />
                  {it}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewStep({ name, description, active, actions }) {
  const configured = actions.filter(a => a.type);
  const summary = [
    { label: "Name", value: name || <span style={{ color: "var(--neg)" }}>Required</span> },
    { label: "Description", value: description || <span style={{ color: "var(--muted-2)" }}>Not provided</span> },
    { label: "Status", value: active
      ? <Pill tone="pos">● Active</Pill>
      : <Pill tone="outline">Paused</Pill>
    },
    { label: "Actions", value: <><span className="num" style={{ color: "var(--fg)", fontWeight: 500 }}>{configured.length}</span> <span style={{ color: "var(--muted)" }}>configured</span></> },
  ];
  return (
    <div className="fade-up">
      <div style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-strong)",
        borderRadius: 10,
        padding: 18,
        marginBottom: 14,
      }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 14 }}>Summary</div>
        <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", rowGap: 12, fontSize: 13 }}>
          {summary.map(s => (
            <React.Fragment key={s.label}>
              <div style={{ color: "var(--muted)" }}>{s.label}</div>
              <div style={{ color: "var(--fg)" }}>{s.value}</div>
            </React.Fragment>
          ))}
        </div>
      </div>

      <div style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border-strong)",
        borderRadius: 10,
        padding: 18,
      }}>
        <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 12 }}>What this agent will do</div>
        {configured.length === 0 ? (
          <div style={{ fontSize: 13, color: "var(--muted-2)" }}>
            No actions added yet. Go back and pick at least one action.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {configured.map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 12, padding: "10px 12px", background: "var(--surface)", borderRadius: 8, border: "1px solid var(--border)" }}>
                <span className="num" style={{
                  fontSize: 11, fontWeight: 600, color: "var(--accent)",
                  padding: "2px 7px", height: 20, borderRadius: 4,
                  background: "var(--accent-tint)",
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "var(--fg)", fontWeight: 500 }}>{a.type}</div>
                  {a.how && <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{a.how}</div>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

Object.assign(window, {
  AddInvestorModal, BulkUploadInvestorsModal, NewAgentModal, TaskRespondModal,
});

// ────────────── Task Respond modal ──────────────
function TaskRespondModal({ onClose, task }) {
  const [reply, setReply] = useStateP2("");
  const [files, setFiles] = useStateP2([]);
  const fileRef = useRefP2(null);

  // Parse the task description "Post Money Safe Missing\nFields: ... — Company"
  const lines = (task?.desc || "").split("\n");
  const headline = lines[0] || "Task";
  const detail = lines.slice(1).join(" ");
  const company = detail.split("—").pop()?.trim() || "";

  const onPickFiles = (list) => {
    const arr = Array.from(list || []).map(f => ({ name: f.name, size: f.size }));
    setFiles(prev => [...prev, ...arr]);
  };

  return (
    <Modal title="Admin Response" onClose={onClose} width={720}
      footer={<>
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn icon="send" onClick={onClose} disabled={!reply.trim() && files.length === 0}>Respond</PrimaryBtn>
      </>}
    >
      {/* Task summary */}
      <div style={{
        display: "grid", gridTemplateColumns: "120px 1fr", rowGap: 10, columnGap: 18,
        padding: "16px 18px", marginBottom: 18,
        background: "var(--surface-2)", borderRadius: 10,
        boxShadow: "inset 0 0 0 1px var(--border)",
      }}>
        <div style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4 }}>Task</div>
        <div style={{ fontSize: 13, color: "var(--fg)", fontWeight: 500 }}>
          {headline}
          {detail && <div style={{ fontSize: 12.5, color: "var(--muted)", fontWeight: 400, marginTop: 4 }}>{detail}</div>}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4 }}>Due Date</div>
        <div style={{ fontSize: 13, color: "var(--muted-3)" }}>—</div>
        <div style={{ fontSize: 11.5, color: "var(--muted-2)", fontWeight: 500, textTransform: "uppercase", letterSpacing: 0.4 }}>Type</div>
        <div style={{ fontSize: 13, color: "var(--fg-2)" }}>{task?.type || "—"}</div>
      </div>

      {/* Comments from Zive Support */}
      <div style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: "var(--accent-bg-12)", color: "var(--accent)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "inset 0 0 0 1px var(--accent-ring-40)",
          }}><Icon name="bot" size={11} color="var(--accent)" /></div>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg-2)" }}>Comments from Zive Support</span>
          <span style={{ fontSize: 11.5, color: "var(--muted-3)" }}>04/13/2026 · 02:36 PM</span>
        </div>
        <div style={{
          padding: "12px 14px", borderRadius: 10,
          background: "var(--surface-2)",
          boxShadow: "inset 0 0 0 1px var(--border)",
          fontSize: 12.5, color: "var(--fg-2)", lineHeight: 1.55,
        }}>
          POST&nbsp;MONEY&nbsp;SAFE{company ? ` — ${company}` : ""} is missing critical fields:
          <ul style={{ margin: "8px 0 8px 18px", padding: 0, color: "var(--muted)" }}>
            <li>Valuation Cap</li>
            <li>Discount Rate</li>
          </ul>
          Please update the investment record so we can reflect it in the Schedule of Investments.
        </div>
      </div>

      {/* Comments from GP / Reply */}
      <div style={{ marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 22, height: 22, borderRadius: 6,
            background: "var(--surface-3)", color: "var(--fg-2)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            boxShadow: "inset 0 0 0 1px var(--border-strong)",
            fontSize: 10.5, fontWeight: 600, letterSpacing: 0.4,
          }}>GP</div>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg-2)" }}>Comments from GP</span>
        </div>
        <textarea
          value={reply}
          onChange={e => setReply(e.target.value)}
          placeholder="Enter your reply here…"
          rows={4}
          style={{
            ...inputBase,
            resize: "vertical", minHeight: 100, lineHeight: 1.5,
            padding: "12px 14px",
          }}
        />
      </div>

      {/* Upload */}
      <div>
        <input
          ref={fileRef} type="file" multiple
          onChange={e => onPickFiles(e.target.files)}
          style={{ display: "none" }}
        />
        <button onClick={() => fileRef.current?.click()} style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "8px 14px", borderRadius: 8,
          background: "transparent", border: "1px solid var(--border-strong)",
          color: "var(--fg-2)", fontSize: 12.5, fontWeight: 500,
          cursor: "pointer", fontFamily: "inherit",
        }}>
          <Icon name="upload" size={12} /> Upload document
        </button>
        {files.length > 0 && (
          <div style={{ marginTop: 12, display: "grid", rowGap: 6 }}>
            {files.map((f, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 12px", borderRadius: 8,
                background: "var(--surface-2)",
                boxShadow: "inset 0 0 0 1px var(--border)",
                fontSize: 12.5, color: "var(--fg-2)",
              }}>
                <Icon name="doc" size={12} color="var(--muted)" />
                <span style={{ flex: 1 }}>{f.name}</span>
                <button onClick={() => setFiles(prev => prev.filter((_, j) => j !== i))} style={{
                  background: "transparent", border: "none", cursor: "pointer",
                  color: "var(--muted-3)", padding: 0,
                }}><Icon name="close" size={11} /></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
}
