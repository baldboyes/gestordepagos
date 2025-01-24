<template>
  <div class="min-h-screen md:bg-gray-100 md:p-4 pb-20 transition duration-300">
    <div class="max-w-md mx-auto bg-white rounded-lg md:shadow-lg p-6">      
      <div v-if="currentMonthExpenses.length > 0">
        <div class="text-4xl font-bold text-center py-8 mb-6">
          {{ total }}€
        </div>

        <ul class="space-y-3">
          <li v-for="expense in currentMonthExpenses" :key="expense.id" class="flex flex-col bg-gray-50 rounded-xl py-2 px-3">
            <div class="text-sm text-gray-500 mt-1">{{ formatDate(expense.date) }}</div>
            <div class="flex justify-between items-center">
              <div>
                <div class="text-sm text-gray-500 mb-1"></div>
                <span>{{ expense.category }}</span>
              </div>
              <div class="flex items-center gap-4">
                <span class="font-bold">{{ expense.amount }}€</span>
                <button
                  @click="deleteExpense(expense.id)"
                  class="text-red-500 hover:text-red-700 focus:outline-none"
                  title="Eliminar gasto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="expense.note" class="text-sm text-gray-600 mt-1">{{ expense.note }}</div>
          </li>
        </ul>
      </div>

      <div v-else class="flex flex-col items-center justify-center py-16 text-center">
        <svg class="w-32 h-32 mb-6 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 12 12"
              to="360 12 12"
              dur="20s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
        <h2 class="text-2xl font-bold text-gray-800 mb-2">¡Tu cartera está muy tranquila!</h2>
        <p class="text-gray-600 mb-6">Es hora de registrar tu primer gasto y empezar a controlar tus finanzas con estilo 💰</p>
        <button 
          @click="showModal = true"
          class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200"
        >
          Añadir mi primer gasto
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, inject } from 'vue'
import BottomNavigation from '../components/BottomNavigation.vue'

const showModal = inject('showModal')
const expenses = ref([])

// Initialize localStorage safely
onMounted(() => {
  try {
    const storedExpenses = window.localStorage.getItem('expenses')
    if (storedExpenses) {
      expenses.value = JSON.parse(storedExpenses)
    }
    // Listen for updates from the modal
    window.addEventListener('expenses-updated', loadExpenses)
  } catch (error) {
    console.error('Error accessing localStorage:', error)
  }
})

const loadExpenses = (event) => {
  if (event && event.detail) {
    expenses.value = event.detail.sort((a, b) => new Date(b.date) - new Date(a.date))
  } else {
    const storedExpenses = window.localStorage.getItem('expenses')
    if (storedExpenses) {
      expenses.value = JSON.parse(storedExpenses).sort((a, b) => new Date(b.date) - new Date(a.date))
    }
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

const deleteExpense = (id) => {
  if (confirm('¿Estás seguro de que quieres eliminar este gasto?')) {
    const updatedExpenses = expenses.value.filter(expense => expense.id !== id)
    localStorage.setItem('expenses', JSON.stringify(updatedExpenses))
    expenses.value = updatedExpenses
  }
}
</script>