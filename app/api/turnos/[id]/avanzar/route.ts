import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { emitTurnoUpdate } from '@/lib/sse'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const turno = await prisma.turno.findUnique({ where: { id: params.id } })
  if (!turno) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  let nuevoEstado
  if (turno.estado === 'PENDIENTE') nuevoEstado = 'ATENDIENDO'
  else if (turno.estado === 'ATENDIENDO') nuevoEstado = 'FINALIZADO'
  else nuevoEstado = 'FINALIZADO'

  const updated = await prisma.turno.update({
    where: { id: turno.id },
    data: { estado: nuevoEstado },
  })

  if (nuevoEstado === 'FINALIZADO') {
    await prisma.turno.updateMany({
      where: { orden: { gt: turno.orden } },
      data: { orden: { decrement: 1 } },
    })
  }

  emitTurnoUpdate({ codigo: updated.codigo, estado: updated.estado })

  return NextResponse.json(updated)
}
