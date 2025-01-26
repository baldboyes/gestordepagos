import { createClient } from '@supabase/supabase-js'

let supabaseInstance = null

export const useSupabase = () => {
  if (supabaseInstance) return supabaseInstance

  const config = useRuntimeConfig()
  const supabaseUrl = config.public.SUPABASE_URL
  const supabaseKey = config.public.SUPABASE_KEY

  supabaseInstance = createClient(supabaseUrl, supabaseKey)
  return supabaseInstance
}