import { useCallback, useEffect, useState } from "react";
import { api } from "./api";

const EMPTY = { tarefas: [], clientes: [], colaboradores: [] };

export function useResources() {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [tarefas, clientes, colaboradores] = await Promise.all([
        api.list("tarefas"), api.list("clientes"), api.list("colaboradores"),
      ]);
      setData({ tarefas, clientes, colaboradores });
    } catch (e) {
      setError(`Não foi possível carregar os dados do servidor. ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async (resource, item) => {
    const { id, ...body } = item;
    if (id) await api.update(resource, id, body);
    else await api.create(resource, body);
    await load();
  };

  const remove = async (resource, id) => {
    await api.remove(resource, id);
    await load();
  };

  return { data, loading, error, reload: load, save, remove };
}
