// web-proyecto/apps/web/src/pages/Register.tsx
import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await register(name, email, password)
    } catch {
      setError('No se pudo registrar')
    }
  }

  return (
    <main style={{ maxWidth: 360, margin: '40px auto' }}>
      <h2>Crear cuenta</h2>
      <form onSubmit={onSubmit}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" type="email" />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" type="password" />
        <button type="submit">Registrar</button>
      </form>
      {error && <p>{error}</p>}
    </main>
  )
}
