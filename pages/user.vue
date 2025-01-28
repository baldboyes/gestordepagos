<template>
  <div class="min-h-screen md:bg-gray-100 md:p-4 pb-20 transition duration-300">
    <div class="max-w-xl mx-auto bg-white rounded-2xl md:shadow-lg p-6">
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

        <div v-if="!isLogin" class="text-gray-600 text-sm mt-8 mb-4 px-4">
          <p class="mb-2 text-lg">🎉 ¡Bienvenido a la app más divertida de gestión de gastos! ¿Cansado de que tu dinero desaparezca como por arte de magia? ¡Aquí podrás descubrir dónde se esconde cada euro! 💸</p>
          <p class="mb-2">Con análisis de IA incluido, porque hasta tus gastos merecen ser analizados por una mente brillante (aunque sea artificial 🤖).</p>
          <p class="text-xs my-4">P.D.: El 99.9% de este código ha sido generado por una IA muy simpática (¡Hola! 👋). Los humanos solo borraron un par de títulos porque les parecía demasiado 'de señorito' pedírmelo. 😅</p>
          <svg class="h-32 w-32 mx-auto" width="37px" height="39px" viewBox="0 0 37 39" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
            <g id="Página-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
              <g id="ahorrapp" transform="translate(0.0946, 0)" fill-rule="nonzero">
                <g id="$" transform="translate(7.9054, 0)" fill="#009006">
                  <path d="M8.99693252,29.8004472 L8.99693252,20.666294 C6.19120654,19.8524315 4.13343558,18.6207378 2.82361963,16.971213 C1.51380368,15.3216881 0.858895706,13.3197317 0.858895706,10.9653438 C0.858895706,8.58188932 1.59969325,6.57993292 3.08128834,4.95947457 C4.56288344,3.33901621 6.53476483,2.40525433 8.99693252,2.15818893 L8.99693252,0 L12.1104294,0 L12.1104294,2.15818893 C14.3865031,2.43432085 16.1973415,3.22275014 17.5429448,4.5234768 C18.8885481,5.82420347 19.7474438,7.56456121 20.1196319,9.74455003 L14.6871166,10.4639463 C14.3578732,8.7490218 13.4989775,7.5863611 12.1104294,6.97596423 L12.1104294,15.4997205 C15.5460123,16.4443823 17.8865031,17.6688094 19.1319018,19.1730017 C20.3773006,20.677194 21,22.6064841 21,24.960872 C21,27.5913918 20.2162577,29.8077138 18.648773,31.6098379 C17.0812883,33.411962 14.9018405,34.5164897 12.1104294,34.9234209 L12.1104294,39 L8.99693252,39 L8.99693252,35.0324203 C6.5204499,34.7272219 4.50920245,33.7898267 2.96319018,32.2202348 C1.41717791,30.6506428 0.429447853,28.4343208 0,25.5712689 L5.60429448,24.960872 C5.83333333,26.1235327 6.26278119,27.1263276 6.89263804,27.9692566 C7.52249489,28.8121856 8.22392638,29.4225824 8.99693252,29.8004472 Z M9,6 C8.08527132,6.30828516 7.35658915,6.83236994 6.81395349,7.57225434 C6.27131783,8.31213873 6,9.12909441 6,10.0231214 C6,10.8400771 6.24806202,11.5992293 6.74418605,12.300578 C7.24031008,13.0019268 7.99224806,13.5684008 9,14 L9,6 Z M12,30 C13.183432,29.7846154 14.1459566,29.25 14.887574,28.3961538 C15.6291913,27.5423077 16,26.5384615 16,25.3846154 C16,24.3538462 15.6883629,23.4653846 15.0650888,22.7192308 C14.4418146,21.9730769 13.4201183,21.4 12,21 L12,30 Z" id="Forma"></path>
                </g>
                <g id="tirita" transform="translate(18.4054, 19.5) rotate(30) translate(-18.4054, -19.5)translate(0.9054, 13)">
                  <rect id="Rectángulo" fill="#FFC107" x="0" y="0" width="35" height="13" rx="6"></rect>
                  <rect id="Rectángulo" fill-opacity="0.49" fill="#FFEB3B" x="9" y="2" width="17" height="9" rx="4.5"></rect>
                </g>
              </g>
            </g>
          </svg>
        </div>

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
    navigateTo('/user')
  } catch (error) {
    errorMessage.value = error.message || 'Error al cerrar sesión'
  } finally {
    isLoading.value = false
  }
}
</script>