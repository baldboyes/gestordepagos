import { useSupabase } from './supabase'
import { ref } from 'vue'

const user = ref(null)

export function useUser() {
  const supabase = useSupabase()

  // Initialize user state
  const initUser = async () => {
    const { data: { user: currentUser } } = await supabase.auth.getUser()
    user.value = currentUser
  }

  // Set up auth state change listener
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null
  })

  // Initialize on first use
  initUser()

  return { user }
}

export async function signUp(email, password) {
  try {
    const supabase = useSupabase()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin
      }
    })
    
    if (error) throw error
    
    return { data, error: null }
  } catch (error) {
    console.error('Error al registrar usuario:', error.message)
    throw error
  }
}

export async function signIn(email, password) {
  try {
    const supabase = useSupabase()
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    if (!data?.user) throw new Error('No se pudo obtener la información del usuario')
    
    user.value = data.user
    return { data, error: null }
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message)
    throw error
  }
}