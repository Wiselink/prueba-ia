'use client'
import { useEffect, useState } from 'react'

interface Turno {
  id: string
  codigo: string
  estado: string
  orden: number
}

export default function AdminDashboard() {
  const [turnos, setTurnos] = useState<Turno[]>([])
  async function load() {
    const res = await fetch('/api/admin/turnos')
    const json = await res.json()
    setTurnos(json)
  }
  useEffect(() => {
    load()
    const es = new EventSource('/api/turnos/live')
    es.onmessage = load
    return () => es.close()
  }, [])

  async function avanzar(id: string) {
    await fetch(`/api/turnos/${id}/avanzar`, { method: 'PUT' })
    load()
  }

  return (
    <div className="p-4 space-y-2">
      {turnos.map(t => (
        <div key={t.id} className="border p-2 flex justify-between">
          <span>
            #{t.codigo} - {t.estado}
          </span>
          <button
            className="bg-blue-500 text-white px-2 py-1"
            onClick={() => avanzar(t.id)}
          >
            Avanzar
          </button>
        </div>
      ))}
    </div>
  )
}
