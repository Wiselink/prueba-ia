import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  const turnos = await prisma.turno.findMany({
    where: { NOT: { estado: 'FINALIZADO' } },
    orderBy: { orden: 'asc' },
  })
  return NextResponse.json(turnos)
}
