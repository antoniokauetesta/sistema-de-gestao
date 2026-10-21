import { useState } from "react";
import { RESOURCES } from "../constants";

const toInput = (v) => (v ? String(v).slice(0, 10) : "");

export default function FormModal({ resource, item, data, onSave, onClose }) {
  const cfg = RESOURCES[resource];
  const [values, setValues] = useState(() => {
    const base = { ...item };
    cfg.fields.forEach((f) => {
      if (base[f.key] === undefined) base[f.key] = f.default ?? "";
      if (f.type === "date") base[f.key] = toInput(base[f.key]);
    });
    return base;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (k, v) => setValues((s) => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const payload = { ...values };
    cfg.fields.forEach((f) => {
      if (f.type === "select") payload[f.key] = payload[f.key] ? Number(payload[f.key]) : null;
      if (f.type === "date") payload[f.key] = payload[f.key] ? new Date(payload[f.key]).toISOString() : null;
    });
    try {
      await onSave(payload);
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h2>{item?.id ? `Editar ${cfg.singular}` : cfg.novo}</h2>
        {cfg.fields.map((f) => (
          <div className="field" key={f.key}>
            <label htmlFor={f.key}>{f.label}</label>
            {f.type === "textarea" ? (
              <textarea id={f.key} rows="3" value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
            ) : f.type === "options" ? (
              <select id={f.key} value={values[f.key]} onChange={(e) => set(f.key, e.target.value)}>
                {f.options.map((o) => <option key={o}>{o}</option>)}
              </select>
            ) : f.type === "select" ? (
              <select id={f.key} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)}>
                <option value="">Nenhum</option>
                {data[f.from].map((o) => <option key={o.id} value={o.id}>{o.nome}</option>)}
              </select>
            ) : (
              <input id={f.key} type={f.type} required={f.required} value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} />
            )}
          </div>
        ))}
        {error && <p className="error">{error}</p>}
        <div className="actions">
          <button type="button" className="btn ghost" onClick={onClose}>Cancelar</button>
          <button className="btn" disabled={saving}>{saving ? "Salvando…" : "Salvar"}</button>
        </div>
      </form>
    </div>
  );
}
