'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [workspace, setWorkspace] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfileAndWorkspace(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfileAndWorkspace(session.user.id)
      else { setProfile(null); setWorkspace(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfileAndWorkspace = async (userId) => {
    const [{ data: profileData }, { data: workspaceData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
      supabase.from('workspaces').select('*').eq('owner_user_id', userId).maybeSingle(),
    ])
    setProfile(profileData || null)
    setWorkspace(workspaceData || null)
    setLoading(false)
  }

  const refetchProfile = () => {
    if (user) fetchProfileAndWorkspace(user.id)
  }

  const login = async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
    setWorkspace(null)
  }

  const isAdmin = profile?.role === 'superadmin'
  const isClient = profile?.role === 'client'
  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User'
  const avatarInitials = displayName.split(' ').map(w => w[0]?.toUpperCase() ?? '').slice(0, 2).join('')

  return (
    <AuthContext.Provider value={{
      user, profile, workspace,
      workspaceId: workspace?.id ?? null,
      login, logout, loading,
      isAdmin, isClient,
      displayName, avatarInitials,
      refetchProfile
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)