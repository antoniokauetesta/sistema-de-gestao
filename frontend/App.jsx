import { useState } from "react";
import FormModal from "./components/FormModal.jsx";
import Pessoas from "./components/Pessoas.jsx";
import Tarefas from "./components/Tarefas.jsx";
import { useResources } from "./useResources.js";

const TABS = [["tarefas", "Tarefas"], ["clientes", "Clientes"], ["colaboradores", "Colaboradores"]];

export default function App() {
  const { data, loading, error, reload, save, remove } = useResources();
  const [tab, setTab] = useState("tarefas");
  const [modal, setModal] = useState(null);
  const [actionError, setActionError] = useState("");

  const handlers = {
    data,
    onNew: () => setModal({ item: {} }),
    onEdit: (item) => setModal({ item }),
    onDelete: async (item) => {
      if (!window.confirm("Excluir este registro? Essa ação não pode ser desfeita.")) return;
      try { setActionError(""); await remove(tab, item.id); }
      catch (e) { setActionError(`Não foi possível excluir. ${e.message}`); }
    },
  };

  return (
    <div className="app">
      <aside className="side">
        <h1>Gestão</h1>
        <nav>
          {TABS.map(([k, label]) => (
            <button key={k} className={tab === k ? "on" : ""} onClick={() => setTab(k)}>{label}</button>
          ))}
        </nav>
      </aside>
      <main>
        <h2 className="title">{TABS.find(([k]) => k === tab)[1]}</h2>
        {error && (
          <div className="banner">
            <span>{error}</span>
            <button className="btn ghost sm" onClick={reload}>Tentar de novo</button>
          </div>
        )}
        {actionError && <div className="banner">{actionError}</div>}
        {loading ? <p className="empty">Carregando…</p> : tab === "tarefas"
          ? <Tarefas {...handlers} />
          : <Pessoas resource={tab} {...handlers} />}
      </main>
      {modal && (
        <FormModal
          resource={tab}
          item={modal.item}
          data={data}
          onSave={(v) => save(tab, v)}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
