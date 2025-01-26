<template>
  <div class="min-h-screen md:bg-gray-100 md:p-4 pb-20 transition duration-300">
    <div class="max-w-md mx-auto bg-white rounded-lg md:shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-6 text-center">Análisis de Gastos</h2>
      <Ollama 
        :expenses="expenses" 
        @report-generation-start="handleReportGenerationStart" 
        @report-generation-end="handleReportGenerationEnd"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useSupabase } from '../src/lib/supabase'
import Ollama from '../components/Ollama.vue'

const supabase = useSupabase()
const expenses = ref([])
const isLoading = ref(true)
const isGeneratingReport = ref(false)

const handleReportGenerationStart = () => {
  isGeneratingReport.value = true
}

const handleReportGenerationEnd = () => {
  isGeneratingReport.value = false
}

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
    expenses.value = data
    isLoading.value = false
  } catch (error) {
    console.error('Error loading expenses:', error)
  } finally {
    isLoading.value = false
  }
}
</script>