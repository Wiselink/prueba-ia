import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(
  request: Request,
  { params }: { params: { codigo: string } }
) {
  const codigo = params.codigo
  const turno = await prisma.turno.findUnique({ where: { codigo } })
  if (!turno) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  const antes = await prisma.turno.count({
    where: {
      estado: 'PENDIENTE',
      orden: { lt: turno.orden },
    },
  })
  const turnoActual = await prisma.turno.findFirst({
    where: { NOT: { estado: 'FINALIZADO' } },
    orderBy: { orden: 'asc' },
  })
  const estimado = (antes + (turno.estado === 'PENDIENTE' ? 1 : 0)) * 5
  return NextResponse.json({ turno, antes, turnoActual, estimado })
}
