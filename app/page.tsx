'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HomePage() {
  const router = useRouter()
  const [codigo, setCodigo] = useState('')
  const [nuevoCodigo, setNuevoCodigo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function crearTurno() {
    try {
      setLoading(true)
      const res = await fetch('/api/turnos/crear', { method: 'POST' })
      const json = await res.json()
      setNuevoCodigo(json.codigo)
      setLoading(false)
    } catch (error) {
      console.error('Error al crear el turno:', error)
      setLoading(false)
      alert('Ocurrió un error al crear el turno. Inténtalo de nuevo más tarde.')
    } finally {
      setLoading(false)
    }
  }

  function buscarTurno(e: React.FormEvent) {
    e.preventDefault()
    if (codigo.trim()) {
      router.push(`/turnos/${codigo.trim()}`)
    }
  }

  return (
    <main className="p-4 space-y-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold">Sistema de Turnos</h1>
      <Button onClick={crearTurno} disabled={loading} className="w-full">
        {loading ? 'Creando...' : 'Sacar turno'}
      </Button>
      {nuevoCodigo && (
        <div className="bg-secondary p-4 rounded-md space-y-2 text-center">
          <p>
            Tu código es{' '}
            <span className="font-mono font-semibold">{nuevoCodigo}</span>
          </p>
          <Button
            variant="link"
            onClick={() => router.push(`/turnos/${nuevoCodigo}`)}
          >
            Ver mi turno
          </Button>
        </div>
      )}
      <form onSubmit={buscarTurno} className="space-y-2">
        <Input
          placeholder="Código de turno"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value)}
        />
        <Button type="submit" className="w-full">
          Buscar turno
        </Button>
      </form>
      <div className="pt-2 text-center">
        <Button variant="link" onClick={() => router.push('/login')}>
          Iniciar sesión
        </Button>
      </div>
    </main>
  )
}
