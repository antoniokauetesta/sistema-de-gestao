
import express from "express";
import { prisma } from "./lib/prisma.ts";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API do Sistema de Gestão funcionando!" });
});


app.post("/clientes", async (req, res) => {
  try {
    const cliente = await prisma.cliente.create({
      data: req.body,
    });

    res.status(201).json(cliente);
  } catch (error) {
    res.status(400).json({ erro: "Não foi possível cadastrar o cliente." });
  }
});

app.get("/clientes", async (req, res) => {
  const clientes = await prisma.cliente.findMany({
    include: { tarefas: true },
  });

  res.json(clientes);
});

app.get("/clientes/:id", async (req, res) => {
  const cliente = await prisma.cliente.findUnique({
    where: { id: Number(req.params.id) },
    include: { tarefas: true },
  });

  if (!cliente) {
    return res.status(404).json({ erro: "Cliente não encontrado." });
  }

  res.json(cliente);
});

app.put("/clientes/:id", async (req, res) => {
  try {
    const cliente = await prisma.cliente.update({
      where: { id: Number(req.params.id) },
      data: req.body,
    });

    res.json(cliente);
  } catch (error) {
    res.status(400).json({ erro: "Não foi possível atualizar o cliente." });
  }
});

app.delete("/clientes/:id", async (req, res) => {
  try {
    await prisma.cliente.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ mensagem: "Cliente excluído com sucesso." });
  } catch (error) {
    res.status(400).json({ erro: "Não foi possível excluir o cliente." });
  }
});


app.post("/colaboradores", async (req, res) => {
  try {
    const colaborador = await prisma.colaborador.create({
      data: req.body,
    });

    res.status(201).json(colaborador);
  } catch (error) {
    res.status(400).json({ erro: "Não foi possível cadastrar o colaborador." });
  }
});

app.get("/colaboradores", async (req, res) => {
  const colaboradores = await prisma.colaborador.findMany({
    include: { tarefas: true },
  });

  res.json(colaboradores.map(({ senha, ...colaborador }) => colaborador));
});

app.get("/colaboradores/:id", async (req, res) => {
  const colaborador = await prisma.colaborador.findUnique({
    where: { id: Number(req.params.id) },
    include: { tarefas: true },
  });

  if (!colaborador) {
    return res.status(404).json({ erro: "Colaborador não encontrado." });
  }

  const { senha, ...dados } = colaborador;
  res.json(dados);
});

app.put("/colaboradores/:id", async (req, res) => {
  try {
    const dados = { ...req.body };

    if (!dados.senha) {
      delete dados.senha;
    }

    const colaborador = await prisma.colaborador.update({
      where: { id: Number(req.params.id) },
      data: dados,
    });

    const { senha, ...resultado } = colaborador;
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ erro: "Não foi possível atualizar o colaborador." });
  }
});

app.delete("/colaboradores/:id", async (req, res) => {
  try {
    await prisma.colaborador.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ mensagem: "Colaborador excluído com sucesso." });
  } catch (error) {
    res.status(400).json({ erro: "Não foi possível excluir o colaborador." });
  }
});


app.post("/tarefas", async (req, res) => {
  try {
    const tarefa = await prisma.tarefa.create({
      data: {
        titulo: req.body.titulo,
        descricao: req.body.descricao,
        status: req.body.status,
        prioridade: req.body.prioridade,
        dataEntrega: req.body.dataEntrega
          ? new Date(req.body.dataEntrega)
          : null,
        clienteId: Number(req.body.clienteId),
        colaboradorId: Number(req.body.colaboradorId),
      },
    });

    res.status(201).json(tarefa);
  } catch (error) {
    res.status(400).json({ erro: "Não foi possível cadastrar a tarefa." });
  }
});

app.get("/tarefas", async (req, res) => {
  const tarefas = await prisma.tarefa.findMany({
    include: {
      cliente: true,
      colaborador: {
        select: {
          id: true,
          nome: true,
          email: true,
          cargo: true,
        },
      },
    },
  });

  res.json(tarefas);
});

app.get("/tarefas/:id", async (req, res) => {
  const tarefa = await prisma.tarefa.findUnique({
    where: { id: Number(req.params.id) },
    include: {
      cliente: true,
      colaborador: {
        select: {
          id: true,
          nome: true,
          email: true,
          cargo: true,
        },
      },
    },
  });

  if (!tarefa) {
    return res.status(404).json({ erro: "Tarefa não encontrada." });
  }

  res.json(tarefa);
});

app.put("/tarefas/:id", async (req, res) => {
  try {
    const dados = { ...req.body };

    if (dados.clienteId !== undefined) {
      dados.clienteId = Number(dados.clienteId);
    }

    if (dados.colaboradorId !== undefined) {
      dados.colaboradorId = Number(dados.colaboradorId);
    }

    if (dados.dataEntrega !== undefined) {
      dados.dataEntrega = dados.dataEntrega
        ? new Date(dados.dataEntrega)
        : null;
    }

    const tarefa = await prisma.tarefa.update({
      where: { id: Number(req.params.id) },
      data: dados,
    });

    res.json(tarefa);
  } catch (error) {
    res.status(400).json({ erro: "Não foi possível atualizar a tarefa." });
  }
});

app.delete("/tarefas/:id", async (req, res) => {
  try {
    await prisma.tarefa.delete({
      where: { id: Number(req.params.id) },
    });

    res.json({ mensagem: "Tarefa excluída com sucesso." });
  } catch (error) {
    res.status(400).json({ erro: "Não foi possível excluir a tarefa." });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
