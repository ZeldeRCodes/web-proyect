// web-proyecto/apps/web/src/pages/Login.tsx
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
    } catch {
      setError('Credenciales inválidas')
    }
  }

  return (
    <main style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={onSubmit}>
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" />
        <button type="submit">Entrar</button>
      </form>
      {error && <p>{error}</p>}
    </main>
  )
}
