'use client'
import { useEffect, useState } from 'react'

type Data = {
  turno: any
  antes: number
  turnoActual: any
  estimado: number
}

export default function TurnoClient({ inicial }: { inicial: Data }) {
  const [data, setData] = useState<Data>(inicial)
  useEffect(() => {
    const es = new EventSource(`/api/turnos/live?codigo=${inicial.turno.codigo}`)
    es.onmessage = async () => {
      const res = await fetch(`/api/turnos/${inicial.turno.codigo}`)
      const json = await res.json()
      setData(json)
    }
    return () => es.close()
  }, [inicial.turno.codigo])
  const { turno, antes, estimado, turnoActual } = data
  return (
    <div className="space-y-4 p-4">
      <h1 className="text-xl font-bold">Mi turno: {turno.codigo}</h1>
      <p>Estado: {turno.estado}</p>
      <p>Personas antes: {antes}</p>
      <p>Tiempo estimado: {estimado} min</p>
      {turnoActual && (
        <p>Turno actual: {turnoActual.codigo} ({turnoActual.estado})</p>
      )}
    </div>
  )
}
