<template>
  <div class="min-h-screen md:bg-gray-100">
    <slot />

    <BottomNavigation 
      @showModal="showModal = true" 
      @showMonthlyReport="$router.push('/monthly-expenses')"
      @showSettings="$router.push('/settings')"
    />

    <!-- Modal para añadir gasto -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md md:shadow-lg">
        <h2 class="text-xl font-bold mb-4">Añadir Gasto</h2>
        <div class="mb-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Gastos Fijos</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="template in fixedExpenseTemplates"
              :key="template.name"
              type="button"
              @click="applyTemplate(template)"
              class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 focus:outline-none"
            >
              {{ template.name }}
            </button>
          </div>
        </div>
        <form @submit.prevent="addExpense" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              v-model="newExpense.category"
              required
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="" disabled>Selecciona una categoría</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio (€)</label>
            <input
              type="number"
              v-model="newExpense.amount"
              required
              step="0.01"
              min="0"
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
            <input
              type="date"
              v-model="newExpense.date"
              required
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nota (opcional)</label>
            <textarea
              v-model="newExpense.note"
              rows="2"
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            ></textarea>
          </div>

          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'

const showModal = ref(false)
const categories = ref([])

onMounted(() => {
  // Load categories from localStorage
  const storedCategories = localStorage.getItem('categories')
  if (storedCategories) {
    categories.value = JSON.parse(storedCategories).sort((a, b) => a.localeCompare(b))
  } else {
    // Set default categories if none exist
    categories.value = [
      'Restaurantes / Cafeterías',
      'Alquiler / Hipoteca',
      'Impuestos y tasas',
      'Otros gastos (categoría flexible para imprevistos)',
      'Servicios básicos (agua, luz, gas, internet)'
    ].sort((a, b) => a.localeCompare(b))
    localStorage.setItem('categories', JSON.stringify(categories.value))
  }
})

const fixedExpenseTemplates = ref([])

onMounted(() => {
  // Load templates from localStorage
  fixedExpenseTemplates.value = JSON.parse(localStorage.getItem('fixedExpenseTemplates') || '[]')
})

const getCurrentDate = () => {
  const now = new Date()
  return now.toISOString().split('T')[0]
}

const newExpense = ref({
  category: '',
  amount: '',
  note: '',
  date: getCurrentDate()
})

const applyTemplate = (template) => {
  newExpense.value = {
    ...newExpense.value,
    category: template.category,
    amount: template.amount,
    note: template.note
  }
}

const addExpense = () => {
  const expense = {
    id: Date.now(),
    category: newExpense.value.category,
    amount: parseFloat(newExpense.value.amount),
    note: newExpense.value.note,
    date: newExpense.value.date
  }

  const expenses = JSON.parse(localStorage.getItem('expenses') || '[]')
  expenses.push(expense)
  localStorage.setItem('expenses', JSON.stringify(expenses))

  // Reset form
  newExpense.value = {
    category: '',
    amount: '',
    note: '',
    date: getCurrentDate()
  }

  showModal.value = false
  // Dispatch a custom event with the updated expenses
  window.dispatchEvent(new CustomEvent('expenses-updated', { detail: expenses }))
}

// Provide the showModal ref to be used by child components
provide('showModal', showModal)
</script>