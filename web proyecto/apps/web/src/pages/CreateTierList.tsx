// apps/web/src/pages/CreateTierList.tsx
import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

type Category = { id: string; name: string }
type Item = { label: string; rank: number }

export default function CreateTierList() {
  const { token, user } = useAuth()
  const [categories, setCategories] = useState<Category[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [items, setItems] = useState<Item[]>([{ label: '', rank: 1 }])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE}/categories`).then(r => r.json()).then(setCategories)
  }, [])

  async function create() {
    if (!token) return
    const res = await fetch(`${import.meta.env.VITE_API_BASE}/tierlists`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description, categoryId, items })
    })
    if (res.ok) {
      setTitle('')
      setDescription('')
      setCategoryId('')
      setItems([{ label: '', rank: 1 }])
    }
  }

  if (!user) return <p>No autenticado</p>

  return (
    <main style={{ maxWidth: 700, margin: '40px auto' }}>
      <h2>Crear Tier List</h2>
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" />
      <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Descripción" />
      <select value={categoryId} onChange={e => setCategoryId(e.target.value)}>
        <option value="">Selecciona categoría</option>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      {items.map((it, i) => (
        <div key={i}>
          <input value={it.label} onChange={e => {
            const v = e.target.value
            setItems(prev => prev.map((p, idx) => idx === i ? { ...p, label: v } : p))
          }} placeholder="Etiqueta" />
          <input type="number" value={it.rank} onChange={e => {
            const v = Number(e.target.value)
            setItems(prev => prev.map((p, idx) => idx === i ? { ...p, rank: v } : p))
          }} />
        </div>
      ))}
      <button onClick={() => setItems(prev => [...prev, { label: '', rank: prev.length + 1 }])}>Agregar ítem</button>
      <button onClick={create}>Crear</button>
    </main>
  )
}
