<template>
  <div class="min-h-screen md:bg-gray-100 md:p-4 pb-20 transition duration-300">
    <div class="max-w-md mx-auto bg-white rounded-lg md:shadow-lg p-6">
      <h1 class="text-2xl font-bold mb-4">Resumen por meses</h1>
      
      <div v-for="month in monthlyExpenses" :key="month.monthKey" class="mb-8">
        <div class="flex justify-between items-center mb-3">
          <h2 class="text-xl font-semibold">{{ month.monthName }}</h2>
          <span class="text-2xl font-bold text-blue-600">{{ month.total.toFixed(2) }}€</span>
        </div>

        <div class="space-y-3">
          <div v-for="category in month.categories" :key="category.name" class="bg-gray-50 rounded-lg p-3">
            <div class="flex justify-between items-center cursor-pointer" @click="toggleCategory(month.monthKey, category.name)">
              <span class="text-gray-700">{{ category.name }}</span>
              <span class="font-medium">{{ category.amount.toFixed(2) }}€</span>
            </div>
            <div class="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                class="h-full bg-blue-500" 
                :style="{ width: `${(category.amount / month.total * 100)}%` }"
              ></div>
            </div>
            <div v-if="isCategoryExpanded(month.monthKey, category.name)" class="mt-3 space-y-2 pl-4 border-l-2 border-blue-200">
              <div v-for="expense in category.expenses" :key="expense.id" class="text-sm">
                <div class="flex justify-between items-center">
                  <span class="text-gray-600">{{ expense.note || 'Sin nota' }}</span>
                  <span class="font-medium">{{ expense.amount.toFixed(2) }}€</span>
                </div>
                <div class="text-xs text-gray-500">{{ new Date(expense.date).toLocaleDateString('es-ES') }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>
</template>

<script setup>
import { computed, inject, ref, onMounted } from 'vue'
import BottomNavigation from '../components/BottomNavigation.vue'
import { useSupabase } from '../src/lib/supabase'

const supabase = useSupabase()
const showModal = inject('showModal')

const expenses = ref([])
const isLoading = ref(true)
const categoryStates = ref({})

onMounted(async () => {
  await loadExpenses()
})

const loadExpenses = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { data, error } = await supabase
      .from('gastos')
      .select('*')
      .eq('user_id', user.id)
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

const toggleCategory = (monthKey, categoryName) => {
  const key = `${monthKey}-${categoryName}`
  categoryStates.value[key] = !categoryStates.value[key]
}

const isCategoryExpanded = (monthKey, categoryName) => {
  const key = `${monthKey}-${categoryName}`
  return categoryStates.value[key] || false
}

const monthlyExpenses = computed(() => {
  const months = {}

  expenses.value.forEach(expense => {
    const date = new Date(expense.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    const monthName = date.toLocaleString('es-ES', { month: 'long', year: 'numeric' })

    if (!months[monthKey]) {
      months[monthKey] = {
        monthKey,
        monthName,
        total: 0,
        categories: {}
      }
    }
    
    months[monthKey].total += expense.amount
    
    if (!months[monthKey].categories[expense.category]) {
      months[monthKey].categories[expense.category] = {
        name: expense.category,
        amount: 0,
        expenses: []
      }
    }
    months[monthKey].categories[expense.category].amount += expense.amount
    months[monthKey].categories[expense.category].expenses.push(expense)
  })
  
  return Object.values(months)
    .sort((a, b) => b.monthKey.localeCompare(a.monthKey))
    .map(month => ({
      ...month,
      categories: Object.values(month.categories)
        .sort((a, b) => b.amount - a.amount)
    }))
})
</script>