import { RESOURCES } from "../constants";

export default function Pessoas({ resource, data, onNew, onEdit, onDelete }) {
  const cfg = RESOURCES[resource];
  const items = data[resource];
  return (
    <>
      <div className="toolbar">
        <span className="grow" />
        <button className="btn" onClick={() => onNew()}>{cfg.novo}</button>
      </div>
      {items.length === 0 ? (
        <p className="empty">Nenhum {cfg.singular} cadastrado. Use “{cfg.novo}” para adicionar.</p>
      ) : (
        <ul className="list">
          {items.map((x) => (
            <li className="row" key={x.id}>
              <div className="main">
                <strong>{x.nome}</strong>
                <small>{[x.email, x.telefone || x.cargo].filter(Boolean).join(" / ") || "Sem contato"}</small>
              </div>
              <button className="btn ghost sm" onClick={() => onEdit(x)}>Editar</button>
              <button className="btn ghost sm danger" onClick={() => onDelete(x)}>Excluir</button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
