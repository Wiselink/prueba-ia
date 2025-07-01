import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

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
    return NextResponse.json(
      { error: 'Credenciales inválidas' }
      // { status: 401 }
    )
  }

  const token = jwt.sign({ sub: id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  })
  const res = NextResponse.json({ success: true })
  res.cookies.set('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // en prod HTTPS sí; en dev HTTPS no
    sameSite: 'lax', // para que funcione en peticiones de tu propia app
    path: '/', // ruta donde la cookie es válida
    maxAge: 3600, // opcional: caduca en 1 hora (igual que tu JWT)
  })
  return res
}
