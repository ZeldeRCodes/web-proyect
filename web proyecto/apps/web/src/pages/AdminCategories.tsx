// apps/web/src/pages/AdminCategories.tsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function AdminCategories() {
  const { token, user } = useAuth()
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [name, setName] = useState('')

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/categories`).then(r => r.json()).then(setCategories)
  }, [])

  async function createCategory() {
    if (!token) return
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name })
    })
    if (res.ok) {
      const c = await res.json()
      setCategories(prev => [...prev, c])
      setName('')
    }
  }

  if (!user || user.role !== 'ADMIN') return <p>No autorizado</p>

  return (
    <main style={{ maxWidth: 600, margin: '40px auto' }}>
      <h2>Categorías</h2>
      <ul>{categories.map(c => <li key={c.id}>{c.name}</li>)}</ul>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" />
      <button onClick={createCategory}>Crear</button>
    </main>
  )
}
