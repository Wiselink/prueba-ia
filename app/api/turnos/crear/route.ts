import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { randomBytes } from 'crypto'
import { emitTurnoUpdate } from '@/lib/sse'

export async function POST() {
  const last = await prisma.turno.findFirst({ orderBy: { orden: 'desc' } })
  const codigo = randomBytes(4).toString('hex')
  const turno = await prisma.turno.create({
    data: {
      codigo,
      orden: (last?.orden || 0) + 1,
    },
  })
  emitTurnoUpdate({ codigo: turno.codigo, estado: turno.estado })
  return NextResponse.json(turno)
}
