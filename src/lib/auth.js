import { useSupabase } from './supabase'
import { ref } from 'vue'

const user = ref(null)

export function useUser() {
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

// También puedes añadir una función para iniciar sesión
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