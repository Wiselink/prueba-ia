import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/prisma'

export async function POST(req: Request) {
  const { email, password } = await req.json()
  if (!email || !password) {
    return NextResponse.json({ error: 'Faltan datos' }, { status: 400 })
  }

  const user = await prisma.usuario.findUnique({ where: { email } })
  const defaultEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
  const defaultPass = process.env.ADMIN_PASSWORD || 'admin'

  let valid = false
  let id = ''

  if (user) {
    valid = await bcrypt.compare(password, user.password)
    id = user.id
  } else if (email === defaultEmail && password === defaultPass) {
    valid = true
    id = 'default'
  }

  if (!valid) {
    return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
  }

  const token = jwt.sign({ sub: id }, process.env.JWT_SECRET!, { expiresIn: '1h' })
  const res = NextResponse.json({ success: true })
  res.cookies.set('token', token, { httpOnly: true, path: '/' })
  return res
}
