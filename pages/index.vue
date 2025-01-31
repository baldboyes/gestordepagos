<template>
  <div class="min-h-screen md:bg-gray-100 md:p-4 pb-20 transition duration-300">
    
    <div class="max-w-6xl mx-auto "> 
      
      <div v-if="isLoading" class="flex flex-col items-center justify-center py-16 text-center">
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <h2 class="text-xl font-semibold text-gray-700 mt-6">Cargando gastos...</h2>
      </div>

      <div v-else-if="currentMonthExpenses.length > 0">
        <div class="flex items-start justify-between gap-8">
          <div class="w-full bg-white rounded-2xl md:shadow-lg p-6 relative">
            <div class="absolute lg:hidden top-6 right-6 cursor-pointer" @click="showPopup">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
            </div> 
            <div class="text-5xl font-bold text-center py-16">
              {{ total }}€
              <small class="text-sm block text-gray-400 font-normal">gastos del mes</small>
            </div>
            <ul class="space-y-3">
              <li v-for="expense in currentMonthExpenses" :key="expense.id" class="flex flex-col bg-gray-50 rounded-xl py-2 px-3">
                <div class="text-sm text-gray-500 mt-1">{{ formatDate(expense.date) }}</div>
                <div class="flex justify-between items-center gap-2">
                  <div>
                    <div class="text-sm text-gray-500 mb-1"></div>
                    <span>{{ expense.category }}</span>
                  </div>
                  <div class="flex items-center gap-4">
                      <span class="font-bold">{{ expense.amount }}€</span>
                      <div class="relative">
                        <button
                          @click="expense.showMenu = !expense.showMenu"
                          class="text-gray-500 hover:text-gray-700 focus:outline-none"
                          title="Más opciones"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                        <div
                          v-if="expense.showMenu"
                          class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                        >
                          <button
                            @click="editExpense(expense); expense.showMenu = false"
                            class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Editar
                          </button>
                          <button
                            @click="deleteExpense(expense.id); expense.showMenu = false"
                            class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              class="h-4 w-4 mr-2"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Eliminar
                          </button>
                        </div>
                      </div>
                  </div>
                </div>
                <div v-if="expense.note" class="text-sm text-gray-600 mt-1">{{ expense.note }}</div>
              </li>
            </ul>
          </div>
          <div class="w-full max-w-[450px] bg-white rounded-2xl md:shadow-lg p-6 relative hidden lg:block">
            <TodoList />
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-16 text-center">
        <svg class="h-32 w-32" width="37px" height="39px" viewBox="0 0 37 39" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
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
        <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Tu cartera está muy tranquila!</h2>
        <p class="text-gray-600 mb-6">Es hora de registrar tu primer gasto y empezar a controlar tus finanzas con estilo 💰</p>
        <p v-if="!hasCategories" class="text-yellow-600 mb-6 p-4 bg-yellow-50 rounded-lg">
          ⚠️ Antes de añadir gastos, necesitas configurar las categorías en la sección de ajustes.
          <button 
            @click="$router.push('/settings')"
            class="text-blue-500 hover:text-blue-600 underline ml-1 focus:outline-none"
          >
            Ir a ajustes
          </button>
        </p>
        <button 
          @click="showModal = true"
          :disabled="!hasCategories"
          :class="{
            'bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200': true,
            'opacity-50 cursor-not-allowed': !hasCategories
          }"
        >
          Añadir mi primer gasto
        </button>
      </div>

    </div>

    <van-popup v-model:show="show" closeable position="bottom" :style="{ height: '100%' }">
      <div class="pt-16 px-4 pb-4">
        <TodoList />
      </div>
    </van-popup>
    <BottomNavigation @showModal="showModal = true" />
    <AddExpenseModal 
    :show-modal="showModal" 
    :editing-expense="editingExpense" 
    @update:show-modal="showModal = $event" 
    @expenses-updated="loadExpenses" 
  />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import BottomNavigation from '../components/BottomNavigation.vue'
import AddExpenseModal from '../components/AddExpenseModal.vue'
import { useSupabase } from '../src/lib/supabase'
const supabase = useSupabase()

const show = ref(false);
    const showPopup = () => {
      show.value = true;
    };

const expenses = ref([])
const isLoading = ref(true)
const showModal = ref(false)
const editingExpense = ref(null)
const hasCategories = ref(false)

onMounted(async () => {
  try {
    await loadExpenses()
    await checkCategories()
    // Listen for updates from the modal
    window.addEventListener('expenses-updated', loadExpenses)
  } catch (error) {
    console.error('Error loading expenses:', error)
  } finally {
    isLoading.value = false
  }
})

const checkCategories = async () => {
  try {
    const { data: categories, error } = await supabase
      .from('categorias')
      .select('nombre')

    if (error) throw error
    hasCategories.value = categories && categories.length > 0
  } catch (error) {
    console.error('Error checking categories:', error)
    hasCategories.value = false
  }
}

const loadExpenses = async (event) => {
  isLoading.value = true
  try {
    const session = await supabase.auth.getSession()
    if (!session.data.session) {
      expenses.value = []
      return
    }

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .eq('user_id', user.id)
      .gte('fecha', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())
      .lte('fecha', new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString())
      .order('fecha', { ascending: false })

    if (error) throw error

    expenses.value = data.map(expense => ({
      id: expense.id,
      category: expense.categoria,
      amount: expense.precio,
      note: expense.nota,
      date: expense.fecha
    }))
  } catch (error) {
    console.error('Error loading expenses:', error)
    expenses.value = []
  } finally {
    isLoading.value = false
  }
}

const deleteExpense = async (id) => {
  try {
    const { error } = await supabase
      .from('gastos')
      .delete()
      .eq('id', id)

    if (error) throw error
    await loadExpenses()
  } catch (error) {
    console.error('Error deleting expense:', error)
    alert('Error al eliminar el gasto. Por favor, inténtalo de nuevo.')
  }
}

const isCurrentMonth = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear()
}

const currentMonthExpenses = computed(() => {
  return expenses.value.filter(expense => isCurrentMonth(expense.date))
})

const total = computed(() => {
  return currentMonthExpenses.value.reduce((sum, expense) => sum + expense.amount, 0).toFixed(2)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
const editExpense = (expense) => {
  showModal.value = true
  editingExpense.value = expense
}
</script>