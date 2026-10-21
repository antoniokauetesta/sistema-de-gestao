export const STATUS = ["Pendente", "Em andamento", "Concluída"];
export const PRIORIDADES = ["Baixa", "Média", "Alta"];

export const RESOURCES = {
  tarefas: {
    singular: "tarefa",
    novo: "Nova tarefa",
    fields: [
      { key: "titulo", label: "Título", type: "text", required: true },
      { key: "descricao", label: "Descrição", type: "textarea" },
      { key: "clienteId", label: "Cliente", type: "select", from: "clientes" },
      { key: "colaboradorId", label: "Responsável", type: "select", from: "colaboradores" },
      { key: "status", label: "Status", type: "options", options: STATUS, default: STATUS[0] },
      { key: "prioridade", label: "Prioridade", type: "options", options: PRIORIDADES, default: PRIORIDADES[1] },
      { key: "prazo", label: "Prazo", type: "date" },
    ],
  },
  clientes: {
    singular: "cliente",
    novo: "Novo cliente",
    fields: [
      { key: "nome", label: "Nome", type: "text", required: true },
      { key: "email", label: "E-mail", type: "email" },
      { key: "telefone", label: "Telefone", type: "text" },
    ],
  },
  colaboradores: {
    singular: "colaborador",
    novo: "Novo colaborador",
    fields: [
      { key: "nome", label: "Nome", type: "text", required: true },
      { key: "email", label: "E-mail", type: "email" },
      { key: "cargo", label: "Cargo", type: "text" },
    ],
  },
};
