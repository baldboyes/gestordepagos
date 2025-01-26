import { ref } from 'vue'

export function useOllama() {
  const availableModels = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const fetchAvailableModels = async () => {
    isLoading.value = true
    error.value = null
    try {
      const response = await fetch('http://localhost:11434/api/tags')
      if (!response.ok) {
        throw new Error('Failed to fetch Ollama models')
      }
      const data = await response.json()
      availableModels.value = data.models.map(model => model.name)
    } catch (err) {
      error.value = err.message
      availableModels.value = []
    } finally {
      isLoading.value = false
    }
  }

  return {
    availableModels,
    isLoading,
    error,
    fetchAvailableModels
  }
}