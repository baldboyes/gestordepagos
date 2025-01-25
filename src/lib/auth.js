import { useSupabase } from './supabase'

export async function signUp(email, password) {
  try {
    const supabase = useSupabase()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    
    if (error) throw error
    
    return data
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
    
    return { data, error: null }
  } catch (error) {
    console.error('Error al iniciar sesión:', error.message)
    throw error
  }
}