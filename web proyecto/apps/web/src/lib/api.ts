// web-proyecto/apps/web/src/lib/api.ts
const base = import.meta.env.VITE_API_BASE ?? '/api/v1'

export async function api(path: string, options?: RequestInit) {
  const res = await fetch(`${base}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options?.headers || {}) },
    ...options
  })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export function authHeaders(token: string | null) {
  return token ? { Authorization: `Bearer ${token}` } : {}
}
