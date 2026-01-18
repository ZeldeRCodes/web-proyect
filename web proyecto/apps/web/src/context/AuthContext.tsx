// web-proyecto/apps/web/src/context/AuthContext.tsx
import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'

type User = { id: string; email: string; name: string; role: 'ADMIN' | 'USER' }
type AuthState = { user: User | null; token: string | null }
type AuthContextType = AuthState & {
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null })

  useEffect(() => {
    const t = localStorage.getItem('token')
    if (t) setState(s => ({ ...s, token: t }))
  }, [])

  useEffect(() => {
    if (!state.token) return
    fetch(`${import.meta.env.VITE_API_BASE}/feed/me`, { headers: { Authorization: `Bearer ${state.token}` } })
      .then(r => r.ok ? r.json() : null)
      .then(u => u && setState(s => ({ ...s, user: u })))
      .catch(() => {})
  }, [state.token])

  async function login(email: string, password: string) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    if (!res.ok) throw new Error('LOGIN_FAILED')
    const data = await res.json()
    localStorage.setItem('token', data.token)
    setState({ user: data.user, token: data.token })
  }

  async function register(name: string, email: string, password: string) {
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    })
    if (!res.ok) throw new Error('REGISTER_FAILED')
    await login(email, password)
  }

  function logout() {
    localStorage.removeItem('token')
    setState({ user: null, token: null })
  }

  const value = useMemo(() => ({ ...state, login, register, logout }), [state])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('AuthContext')
  return ctx
}
