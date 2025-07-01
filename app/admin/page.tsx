import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import AdminDashboard from '@/components/AdminDashboard'

export default function AdminPage() {
  const token = cookies().get('token')?.value
  if (!token) return <div>No autorizado</div>
  try {
    jwt.verify(token, process.env.JWT_SECRET!)
  } catch (e) {
    return <div>No autorizado</div>
  }
  return <AdminDashboard />
}
