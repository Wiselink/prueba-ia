import { NextResponse } from 'next/server'

export async function GET() {
  return new NextResponse('Unauthorized', { status: 401 })
}
