<template>
  <div class="min-h-screen md:bg-gray-100 md:p-4 pb-20 transition duration-300">
    <div class="max-w-xl mx-auto bg-white rounded-2xl md:shadow-lg p-6">
      <h1 class="text-2xl font-bold mb-4">Configuración</h1>
      
      <!-- Tab Navigation -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          @click="activeTab = 'categoriasSupabase'"
          :class="{
            'px-4 py-2 -mb-px': true,
            'text-blue-600 border-b-2 border-blue-500 font-medium': activeTab === 'categoriasSupabase',
            'text-gray-500 hover:text-gray-700': activeTab !== 'categoriasSupabase'
          }"
        >
          Categorías
        </button>
        <button
          @click="activeTab = 'supabaseFixedExpense'"
          :class="{
            'px-4 py-2 -mb-px': true,
            'text-blue-600 border-b-2 border-blue-500 font-medium': activeTab === 'supabaseFixedExpense',
            'text-gray-500 hover:text-gray-700': activeTab !== 'supabaseFixedExpense'
          }"
        >
          Recurrentes
        </button>
        <button
          @click="activeTab = 'ia'"
          :class="{
            'px-4 py-2 -mb-px': true,
            'text-blue-600 border-b-2 border-blue-500 font-medium': activeTab === 'ia',
            'text-gray-500 hover:text-gray-700': activeTab !== 'ia'
          }"
        >
          IA
        </button>
      </div>

      <!-- Supabase Categories Section -->
      <div v-show="activeTab === 'categoriasSupabase'">
        <SupabaseCategories />
      </div>

      <!-- Supabase Fixed Expense Section -->
      <div v-show="activeTab === 'supabaseFixedExpense'">
        <SupabaseFixedExpense ref="fixedExpenseComponent" @template-updated="handleTemplateUpdate" />
      </div>

      <!-- AI Settings Section -->
      <div v-show="activeTab === 'ia'" class="space-y-4">
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">Seleccionar Proveedor de IA</label>
          <div class="space-y-2">
            <div class="flex items-center">
              <input
                id="ollama"
                v-model="selectedAIProvider"
                type="radio"
                value="ollama"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label for="ollama" class="ml-2 block text-sm text-gray-700">Ollama (Local)</label>
            </div>
            <div class="flex items-center">
              <input
                id="deepseek"
                v-model="selectedAIProvider"
                type="radio"
                value="deepseek"
                class="h-4 w-4 text-blue-600 focus:ring-blue-500"
              />
              <label for="deepseek" class="ml-2 block text-sm text-gray-700">DeepSeek</label>
            </div>
          </div>
        </div>

        <div v-if="selectedAIProvider === 'ollama'">
          <label for="ollama-model" class="block text-sm font-medium text-gray-700 mb-1">Modelo Ollama</label>
          <select
            id="ollama-model"
            v-model="ollamaModel"
            class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="" disabled>Selecciona un modelo</option>
            <option v-for="model in availableModels" :key="model" :value="model">
              {{ model }}
            </option>
          </select>
          <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
          <p v-if="isLoading" class="mt-2 text-sm text-gray-600">Cargando modelos...</p>
        </div>

        <div v-if="selectedAIProvider === 'deepseek'">
          <label for="deepseek-api-key" class="block text-sm font-medium text-gray-700 mb-1">Apikey DeepSeek</label>
          <input
            id="deepseek-api-key"
            v-model="deepseekApiKey"
            type="text"
            class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import SupabaseFixedExpense from '~/components/SupabaseFixedExpense.vue'
import { useOllama } from '~/composables/useOllama'

const activeTab = ref('categoriasSupabase')
const fixedExpenseComponent = ref(null)
const ollamaModel = ref('')
const deepseekApiKey = ref('')
const selectedAIProvider = ref('deepseek')

const { availableModels, isLoading, error, fetchAvailableModels } = useOllama()

onMounted(async () => {
  // Load saved preferences
  if (typeof window !== 'undefined') {
    const savedProvider = localStorage.getItem('selectedAIProvider')
    const savedModel = localStorage.getItem('ollamaModel')
    const savedApiKey = localStorage.getItem('deepseekApiKey')

    if (savedProvider) selectedAIProvider.value = savedProvider
    if (savedModel) ollamaModel.value = savedModel
    if (savedApiKey) deepseekApiKey.value = savedApiKey
  }

  if (selectedAIProvider.value === 'ollama') {
    await fetchAvailableModels()
  }
})

// Watch for changes and save to localStorage
watch(selectedAIProvider, (newValue) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('selectedAIProvider', newValue)
    if (newValue === 'deepseek') {
      localStorage.removeItem('ollamaModel')
      ollamaModel.value = ''
    }
  }
})

watch(ollamaModel, (newValue) => {
  if (newValue && typeof window !== 'undefined') {
    localStorage.setItem('ollamaModel', newValue)
  }
})

watch(deepseekApiKey, (newValue) => {
  if (newValue && typeof window !== 'undefined') {
    localStorage.setItem('deepseekApiKey', newValue)
  }
})

const handleTemplateUpdate = async () => {
  if (fixedExpenseComponent.value) {
    await fixedExpenseComponent.value.loadTemplates()
  }
}
</script>