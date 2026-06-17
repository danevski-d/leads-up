'use client'
import { AuthProvider } from '@/context/AuthContext'
import Register from '@/views/Register'

export default function RegisterPage() {
  return (
    <AuthProvider>
      <Register />
    </AuthProvider>
  )
}
