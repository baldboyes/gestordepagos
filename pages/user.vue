<template>
  <div class="min-h-screen md:bg-gray-100 md:p-4 pb-20 transition duration-300">
    <div class="max-w-md mx-auto bg-white rounded-lg md:shadow-lg p-6">
      <template v-if="currentUser">
        <div class="text-center">
          <h1 class="text-2xl font-bold mb-4">Perfil de Usuario</h1>
          <p class="text-gray-600 mb-6">{{ currentUser.email }}</p>
          <button
            @click="handleLogout"
            class="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Cerrando sesión...' : 'Cerrar Sesión' }}
          </button>
        </div>
      </template>
      
      <template v-else>
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold mb-2">{{ isLogin ? 'Iniciar Sesión' : 'Registrarse' }}</h1>
          <div class="text-sm">
            <button 
              @click="toggleAuthMode" 
              class="text-blue-500 hover:text-blue-700 focus:outline-none"
            >
              {{ isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión' }}
            </button>
          </div>
        </div>

        <form @submit.prevent="() => isLogin ? handleLogin() : handleRegister()" class="space-y-4">
          <div v-if="errorMessage" class="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
            {{ errorMessage }}
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="email"
              type="email"
              required
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="tu@email.com"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <input
              v-model="password"
              type="password"
              required
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="********"
            >
          </div>

          <button
            type="submit"
            class="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            :disabled="isLoading"
          >
            {{ isLoading ? (isLogin ? 'Iniciando sesión...' : 'Registrando...') : (isLogin ? 'Iniciar Sesión' : 'Registrarse') }}
          </button>
        </form>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { signIn, signUp } from '../src/lib/auth'
import { useSupabase } from '../src/lib/supabase'

const supabase = useSupabase()
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)
const currentUser = ref(null)
const isLogin = ref(true)

onMounted(async () => {
  const { data: { session } } = await supabase.auth.getSession()
  currentUser.value = session?.user || null

  supabase.auth.onAuthStateChange((event, session) => {
    currentUser.value = session?.user || null
  })
})

function toggleAuthMode() {
  isLogin.value = !isLogin.value
  errorMessage.value = ''
}

async function handleLogin() {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    const { data } = await signIn(email.value, password.value)
    if (data) {
      navigateTo('/')
    }
  } catch (error) {
    errorMessage.value = error.message || 'Error al iniciar sesión'
  } finally {
    isLoading.value = false
  }
}

async function handleRegister() {
  try {
    isLoading.value = true
    errorMessage.value = ''
    
    // Check if user already exists
    const { data: existingUser } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: ''
    })

    if (existingUser) {
      errorMessage.value = 'Este email ya está registrado. Por favor, inicia sesión.'
      isLogin.value = true
      return
    }
    
    const { data, error } = await signUp(email.value, password.value)
    if (error) throw error
    if (data) {
      errorMessage.value = 'Se ha enviado un enlace de confirmación a tu email'
    }
  } catch (error) {
    errorMessage.value = error.message || 'Error al registrarse'
  } finally {
    isLoading.value = false
  }
}

async function handleLogout() {
  try {
    isLoading.value = true
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    navigateTo('/')
  } catch (error) {
    errorMessage.value = error.message || 'Error al cerrar sesión'
  } finally {
    isLoading.value = false
  }
}
</script>