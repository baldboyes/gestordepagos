<template>
  <div>
    <button
      type="button"
      @click="openCamera"
      class="absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 rounded-full hover:bg-gray-100 focus:outline-none transition-colors duration-200"
      title="Añadir foto"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
        />
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    </button>
    <input
      type="file"
      ref="fileInput"
      accept="image/*"
      capture="environment"
      class="hidden"
      @change="handleImage"
    />
    <div v-if="isAnalyzing" class="mt-4 text-center">
      <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
      <p class="text-sm text-gray-600 mt-2">Analizando factura...</p>
    </div>
    <div v-if="totalAmount" class="mt-4 p-4 bg-gray-50 rounded-lg">
      <p class="text-lg font-semibold">Total detectado: €{{ totalAmount }}</p>
    </div>
    <div v-if="error" class="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['click', 'image-captured'])
const fileInput = ref(null)
const isAnalyzing = ref(false)
const totalAmount = ref(null)
const error = ref(null)

const openCamera = () => {
  fileInput.value.click()
  emit('click')
}

const handleImage = async (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const imageData = e.target.result
      emit('image-captured', imageData)
      await analyzeReceipt(imageData)
    }
    reader.readAsDataURL(file)
  }
}

const analyzeReceipt = async (imageData) => {
  isAnalyzing.value = true
  error.value = null
  totalAmount.value = null

  try {
    const apiKey = localStorage.getItem('deepseekApiKey')
    if (!apiKey) {
      throw new Error('API key not found. Please configure your DeepSeek API key in settings.')
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{
          role: 'user',
          content: `Please analyze this receipt image and extract the total amount. The image is: ${imageData}. Please respond with only the numerical total amount, without any currency symbols or additional text. En español.`
        }]
      })
    })

    if (!response.ok) {
      throw new Error(`Error al analizar la factura: ${response.status}`)
    }

    const data = await response.json()
    const extractedAmount = parseFloat(data.choices[0].message.content.trim())
    
    if (isNaN(extractedAmount)) {
      throw new Error('No se pudo detectar el total de la factura')
    }

    totalAmount.value = extractedAmount.toFixed(2)
  } catch (err) {
    console.error('Error analyzing receipt:', err)
    error.value = err.message || 'Error al analizar la factura'
  } finally {
    isAnalyzing.value = false
  }
}
</script>