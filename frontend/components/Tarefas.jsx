import { useMemo, useState } from "react";
import { PRIORIDADES, STATUS } from "../constants";

const slug = (s) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s/g, "").toLowerCase();
const fmt = (d) => (d ? new Date(d).toLocaleDateString("pt-BR", { timeZone: "UTC" }) : "Sem prazo");
const nomeDe = (list, id) => list.find((x) => x.id === id)?.nome || "Não definido";

export default function Tarefas({ data, onNew, onEdit, onDelete }) {
  const [f, setF] = useState({ q: "", status: "", prioridade: "" });
  const hoje = new Date().toISOString().slice(0, 10);
  const atrasada = (t) => t.prazo && t.prazo.slice(0, 10) < hoje && t.status !== STATUS[2];

  const rows = useMemo(
    () => data.tarefas.filter((t) =>
      t.titulo.toLowerCase().includes(f.q.toLowerCase()) &&
      (!f.status || t.status === f.status) &&
      (!f.prioridade || t.prioridade === f.prioridade)),
    [data.tarefas, f]
  );

  return (
    <>
      <div className="summary">
        <span><b>{data.tarefas.length}</b> tarefas</span>
        {STATUS.map((s) => <span key={s}><b>{data.tarefas.filter((t) => t.status === s).length}</b> {s.toLowerCase()}</span>)}
        <span className="late"><b>{data.tarefas.filter(atrasada).length}</b> atrasadas</span>
      </div>
      <div className="toolbar">
        <input placeholder="Buscar tarefa" value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
        <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
          <option value="">Todos os status</option>
          {STATUS.map((s) => <option key={s}>{s}</option>)}
        </select>
        <select value={f.prioridade} onChange={(e) => setF({ ...f, prioridade: e.target.value })}>
          <option value="">Todas as prioridades</option>
          {PRIORIDADES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <button className="btn" onClick={() => onNew()}>Nova tarefa</button>
      </div>
      {rows.length === 0 ? (
        <p className="empty">Nenhuma tarefa por aqui. Crie a primeira com “Nova tarefa”.</p>
      ) : (
        <ul className="list">
          {rows.map((t) => (
            <li className="row" key={t.id}>
              <div className="main">
                <strong>{t.titulo}</strong>
                <small>{nomeDe(data.clientes, t.clienteId)} / {nomeDe(data.colaboradores, t.colaboradorId)}</small>
              </div>
              <span className={`tag p-${slug(t.prioridade)}`}>{t.prioridade}</span>
              <span className={`tag s-${slug(t.status)}`}>{t.status}</span>
              <span className={atrasada(t) ? "late" : "muted"}>{fmt(t.prazo)}</span>
              <button className="btn ghost sm" onClick={() => onEdit(t)}>Editar</button>
              <button className="btn ghost sm danger" onClick={() => onDelete(t)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
