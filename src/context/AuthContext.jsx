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
    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
    let workspaceData = null
    if (profileData?.workspace_id) {
      const { data } = await supabase.from('workspaces').select('*').eq('id', profileData.workspace_id).maybeSingle()
      workspaceData = data || null
    }
    setProfile(profileData || null)
    setWorkspace(workspaceData)
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

  // Self-serve sign up: create the auth user, create their workspace, then
  // link profiles.workspace_id -> workspace.id. The profiles row itself is
  // auto-created by the on_auth_user_created trigger, so we only update it.
  const register = async ({ email, password, companyName, fullName }) => {
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password })
    if (signUpError) throw signUpError

    const newUser = signUpData.user
    if (!newUser) throw new Error('Sign up failed: no user returned.')

    // If email confirmation is required, there's no session yet and RLS
    // (auth.uid()) won't resolve — workspace creation has to wait until
    // after the user confirms and actually logs in.
    if (!signUpData.session) {
      return { needsEmailConfirmation: true }
    }

    const slug = (companyName || email.split('@')[0])
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') + '-' + newUser.id.slice(0, 6)

    const { data: workspaceData, error: workspaceError } = await supabase
      .from('workspaces')
      .insert({
        name: companyName || `${fullName || email}'s workspace`,
        slug,
        owner_email: email,
        owner_user_id: newUser.id,
      })
      .select()
      .single()
    if (workspaceError) throw workspaceError

    const { error: profileError } = await supabase
      .from('profiles')
      .update({ workspace_id: workspaceData.id, full_name: fullName || null })
      .eq('id', newUser.id)
    if (profileError) throw profileError

    await fetchProfileAndWorkspace(newUser.id)
    return { needsEmailConfirmation: false }
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
      workspaceId: profile?.workspace_id ?? null,
      login, logout, register, loading,
      isAdmin, isClient,
      displayName, avatarInitials,
      refetchProfile
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)