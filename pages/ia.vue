<template>
  <div class="min-h-screen md:bg-gray-100 md:p-4 pb-20 transition duration-300">
    <div class="max-w-xl mx-auto bg-white rounded-2xl md:shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-6 text-center">Análisis de Gastos</h2>
      <template v-if="selectedAIProvider === 'ollama'">
        <Ollama 
          :expenses="expenses" 
          @report-generation-start="handleReportGenerationStart" 
          @report-generation-end="handleReportGenerationEnd"
        />
      </template>
      <template v-else>
        <DeepSeek
          :expenses="expenses"
          @report-generation-start="handleReportGenerationStart"
          @report-generation-end="handleReportGenerationEnd"
        />
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '../src/lib/supabase'
import Ollama from '../components/Ollama.vue'
import DeepSeek from '../components/DeepSeek.vue'

const supabase = useSupabase()
const expenses = ref([])
const isLoading = ref(true)
const isGeneratingReport = ref(false)
const selectedAIProvider = ref('deepseek')

onMounted(() => {
  loadExpenses()
  if (process.client) {
    selectedAIProvider.value = localStorage.getItem('selectedAIProvider') || 'deepseek'
  }
})

const handleReportGenerationStart = () => {
  isGeneratingReport.value = true
}

const handleReportGenerationEnd = () => {
  isGeneratingReport.value = false
}

async function loadExpenses() {
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
  } catch (error) {
    console.error('Error loading expenses:', error)
    expenses.value = []
  } finally {
    isLoading.value = false
  }
}
</script>