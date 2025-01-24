<template>
  <div class="min-h-screen md:bg-gray-100 md:p-4 pb-20 transition duration-300">
    <div class="max-w-md mx-auto bg-white rounded-lg md:shadow-lg p-6">
      <h1 class="text-2xl font-bold mb-4">Configuración</h1>
      
      <!-- Tab Navigation -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          @click="activeTab = 'categories'"
          :class="{
            'px-4 py-2 -mb-px': true,
            'text-blue-600 border-b-2 border-blue-500 font-medium': activeTab === 'categories',
            'text-gray-500 hover:text-gray-700': activeTab !== 'categories'
          }"
        >
          Categorías
        </button>
        <button
          @click="activeTab = 'recurring'"
          :class="{
            'px-4 py-2 -mb-px': true,
            'text-blue-600 border-b-2 border-blue-500 font-medium': activeTab === 'recurring',
            'text-gray-500 hover:text-gray-700': activeTab !== 'recurring'
          }"
        >
          Pagos Recurrentes
        </button>
      </div>

      <!-- Recurring Payments Section -->
      <div v-show="activeTab === 'recurring'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Pagos Recurrentes</h2>
          <button
            @click="showAddModal = true"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Añadir
          </button>
        </div>

        <!-- List of recurring payments -->
        <div class="space-y-3">
          <div
            v-for="template in fixedExpenseTemplates"
            :key="template.name"
            class="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
          >
            <div>
              <h3 class="font-medium">{{ template.name }}</h3>
              <p class="text-sm text-gray-600">{{ template.category }}</p>
              <p class="text-sm text-gray-500">{{ template.note }}</p>
            </div>
            <div class="flex items-center space-x-4">
              <span class="font-bold text-blue-600">{{ template.amount.toFixed(2) }}€</span>
              <button
                @click="deleteTemplate(template.name)"
                class="text-red-500 hover:text-red-700 focus:outline-none"
                title="Eliminar gasto recurrente"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Categories Section -->
      <div v-show="activeTab === 'categories'" class="space-y-6">
        <div class="flex justify-between items-center">
          <h2 class="text-xl font-semibold">Categorías</h2>
          <button
            @click="showCategoryModal = true"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
          >
            Añadir
          </button>
        </div>

        <!-- List of categories -->
        <div class="space-y-3">
          <div
            v-for="category in categories"
            :key="category"
            class="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
          >
            <span class="font-medium">{{ category }}</span>
            <button
              @click="deleteCategory(category)"
              class="text-red-500 hover:text-red-700 focus:outline-none"
              title="Eliminar categoría"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

    </div>



    <!-- Add Template Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Añadir Pago Recurrente</h2>
        <form @submit.prevent="addTemplate" class="space-y-4">
          <div v-if="errorMessage" class="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
            {{ errorMessage }}
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              v-model="newTemplate.name"
              type="text"
              required
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              v-model="newTemplate.category"
              required
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecciona una categoría</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input
              v-model="newTemplate.amount"
              type="number"
              step="0.01"
              required
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nota</label>
            <input
              v-model="newTemplate.note"
              type="text"
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showAddModal = false"
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

    <!-- Add Category Modal -->
    <div v-if="showCategoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Añadir Categoría</h2>
        <form @submit.prevent="addCategory" class="space-y-4">
          <div v-if="errorMessage" class="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
            {{ errorMessage }}
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Categoría</label>
            <input
              v-model="newCategory"
              type="text"
              required
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showCategoryModal = false"
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
import { ref, onMounted } from 'vue'

const showAddModal = ref(false)
const showCategoryModal = ref(false)
const activeTab = ref('categories')
const fixedExpenseTemplates = ref([])
const categories = ref(['Restaurantes / Cafeterías', 'Alquiler / Hipoteca', 'Impuestos y tasas', 'Otros gastos (categoría flexible para imprevistos)', 'Servicios básicos (agua, luz, gas, internet)'])
const errorMessage = ref('')

const newTemplate = ref({
  name: '',
  category: '',
  amount: '',
  note: ''
})

const newCategory = ref('')

onMounted(() => {
  loadTemplates()
  loadCategories()
})

const loadTemplates = () => {
  const templates = localStorage.getItem('fixedExpenseTemplates')
  if (templates) {
    fixedExpenseTemplates.value = JSON.parse(templates).sort((a, b) => a.name.localeCompare(b.name))
  }
}

const loadCategories = () => {
  const storedCategories = localStorage.getItem('categories')
  if (storedCategories) {
    categories.value = JSON.parse(storedCategories).sort((a, b) => a.localeCompare(b))
  } else {
    // Save default categories if none exist
    categories.value.sort((a, b) => a.localeCompare(b))
    localStorage.setItem('categories', JSON.stringify(categories.value))
  }
}

const addTemplate = () => {
  const template = {
    name: newTemplate.value.name,
    category: newTemplate.value.category,
    amount: parseFloat(newTemplate.value.amount),
    note: newTemplate.value.note
  }

  // Check if template with same name already exists
  if (fixedExpenseTemplates.value.some(t => t.name.toLowerCase() === template.name.toLowerCase())) {
    errorMessage.value = `Ya existe un gasto recurrente con el nombre "${template.name}"`
    return
  }

  fixedExpenseTemplates.value.push(template)
  fixedExpenseTemplates.value.sort((a, b) => a.name.localeCompare(b.name))
  localStorage.setItem('fixedExpenseTemplates', JSON.stringify(fixedExpenseTemplates.value))

  // Reset form and error message
  newTemplate.value = {
    name: '',
    category: '',
    amount: '',
    note: ''
  }
  errorMessage.value = ''
  showAddModal.value = false
}

const deleteTemplate = (templateName) => {
  fixedExpenseTemplates.value = fixedExpenseTemplates.value.filter(t => t.name !== templateName)
  localStorage.setItem('fixedExpenseTemplates', JSON.stringify(fixedExpenseTemplates.value))
}

const addCategory = () => {
  if (!newCategory.value) return

  // Check if category already exists (case-insensitive)
  if (categories.value.some(cat => cat.toLowerCase() === newCategory.value.toLowerCase())) {
    errorMessage.value = `La categoría "${newCategory.value}" ya existe`
    return
  }

  categories.value.push(newCategory.value)
  categories.value.sort((a, b) => a.localeCompare(b))
  localStorage.setItem('categories', JSON.stringify(categories.value))
  newCategory.value = ''
  errorMessage.value = ''
  showCategoryModal.value = false
}

const deleteCategory = (category) => {
  categories.value = categories.value.filter(c => c !== category)
  localStorage.setItem('categories', JSON.stringify(categories.value))
}
</script>