import prisma from '@/lib/prisma'
import TurnoClient from '@/components/TurnoClient'
import { notFound } from 'next/navigation'

export default async function TurnoPage({
  params,
}: {
  params: { codigo: string }
}) {
  const turno = await prisma.turno.findUnique({ where: { codigo: params.codigo } })
  if (!turno) return notFound()
  const antes = await prisma.turno.count({
    where: { estado: 'PENDIENTE', orden: { lt: turno.orden } },
  })
  const turnoActual = await prisma.turno.findFirst({
    where: { NOT: { estado: 'FINALIZADO' } },
    orderBy: { orden: 'asc' },
  })
  const estimado = (antes + (turno.estado === 'PENDIENTE' ? 1 : 0)) * 5
  const data = { turno, antes, turnoActual, estimado }
  return <TurnoClient inicial={data} />
}
