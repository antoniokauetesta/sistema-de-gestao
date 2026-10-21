const BASE = import.meta.env.VITE_API_URL || "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    let msg = `Erro ${res.status}`;
    try { msg = (await res.json()).error || msg; } catch {}
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}

// Rotas esperadas: GET /{recurso}, POST /{recurso}, PUT /{recurso}/:id, DELETE /{recurso}/:id
export const api = {
  list: (r) => request(`/${r}`),
  create: (r, data) => request(`/${r}`, { method: "POST", body: JSON.stringify(data) }),
  update: (r, id, data) => request(`/${r}/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  remove: (r, id) => request(`/${r}/${id}`, { method: "DELETE" }),
};
