<template>
  <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-lg p-6 w-full max-w-md md:shadow-lg">
      <h2 class="text-xl font-bold mb-4">Añadir Gasto</h2>
      <div class="mb-4">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Gastos Fijos</h3>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="template in fixedExpenseTemplates"
            :key="template.id"
            type="button"
            @click="applyTemplate(template)"
            class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 focus:outline-none"
          >
            {{ template.nombre }}
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
            @click="closeModal"
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
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '../src/lib/supabase'

const props = defineProps({
  showModal: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['update:showModal', 'expense-added'])

const categories = ref([])
const fixedExpenseTemplates = ref([])
const supabase = useSupabase()

onMounted(async () => {
  await Promise.all([
    loadCategories(),
    loadFixedExpenseTemplates()
  ])
})

const loadCategories = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { data, error } = await supabase
      .from('categorias')
      .select('*')
      .eq('user_id', user.id)
      .order('nombre')

    if (error) throw error
    categories.value = data.map(category => category.nombre)
  } catch (error) {
    console.error('Error loading categories:', error)
    categories.value = []
  }
}

const loadFixedExpenseTemplates = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { data, error } = await supabase
      .from('recurrente')
      .select('*')
      .eq('user_id', user.id)

    if (error) throw error
    fixedExpenseTemplates.value = data
  } catch (error) {
    console.error('Error loading fixed expense templates:', error)
    fixedExpenseTemplates.value = []
  }
}

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
    category: template.categoria,
    amount: template.precio,
    note: template.nota
  }
}

const addExpense = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const expense = {
      user_id: user.id,
      categoria: newExpense.value.category,
      precio: parseFloat(newExpense.value.amount),
      nota: newExpense.value.note,
      fecha: newExpense.value.date
    }

    const { data, error } = await supabase
      .from('gastos')
      .insert(expense)
      .select()

    if (error) throw error

    // Reset form
    newExpense.value = {
      category: '',
      amount: '',
      note: '',
      date: getCurrentDate()
    }

    closeModal()
    emit('expense-added', data)
    window.dispatchEvent(new CustomEvent('expenses-updated', { detail: data }))
  } catch (error) {
    console.error('Error saving expense:', error)
    alert('Error al guardar el gasto. Por favor, inténtalo de nuevo.')
  }
}

const closeModal = () => {
  emit('update:showModal', false)
}
</script>