<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Categorías</h2>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        Añadir
      </button>
    </div>

    <!-- List of categories from Supabase -->
    <div class="space-y-3">
      <div
        v-for="category in categories"
        :key="category.id"
        class="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
      >
        <span class="font-medium">{{ category.nombre }}</span>
        <div class="flex items-center space-x-2">
          <button
            @click="editCategory(category)"
            class="text-blue-500 hover:text-blue-700 focus:outline-none"
            title="Editar categoría"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            @click="deleteCategory(category.id)"
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

    <!-- Add Category Modal -->
    <div v-if="showAddModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Añadir Categoría en Supabase</h2>
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

    <!-- Edit Category Modal -->
    <div v-if="showEditModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Editar Categoría</h2>
        <form @submit.prevent="updateCategory" class="space-y-4">
          <div v-if="errorMessage" class="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
            {{ errorMessage }}
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre de la Categoría</label>
            <input
              v-model="editingCategory.nombre"
              type="text"
              required
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showEditModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Actualizar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useSupabase } from '../src/lib/supabase'

const showAddModal = ref(false)
const showEditModal = ref(false)
const categories = ref([])
const errorMessage = ref('')
const newCategory = ref('')
const editingCategory = ref(null)
const supabase = useSupabase()

onMounted(() => {
  loadCategories()
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
    categories.value = data
  } catch (error) {
    console.error('Error loading categories:', error)
    errorMessage.value = 'Error al cargar las categorías'
  }
}

const addCategory = async () => {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { error } = await supabase
      .from('categorias')
      .insert([{
        nombre: newCategory.value,
        user_id: user.id
      }])

    if (error) throw error

    await loadCategories()
    newCategory.value = ''
    showAddModal.value = false
    errorMessage.value = ''
  } catch (error) {
    console.error('Error adding category:', error)
    errorMessage.value = 'Error al añadir la categoría'
  }
}

const editCategory = (category) => {
  editingCategory.value = { ...category }
  showEditModal.value = true
}

const updateCategory = async () => {
  try {
    const { error } = await supabase
      .from('categorias')
      .update({ nombre: editingCategory.value.nombre })
      .eq('id', editingCategory.value.id)

    if (error) throw error

    await loadCategories()
    showEditModal.value = false
    editingCategory.value = null
    errorMessage.value = ''
  } catch (error) {
    console.error('Error updating category:', error)
    errorMessage.value = 'Error al actualizar la categoría'
  }
}

const deleteCategory = async (id) => {
  if (!confirm('¿Estás seguro de que quieres eliminar esta categoría?')) return

  try {
    const { error } = await supabase
      .from('categorias')
      .delete()
      .eq('id', id)

    if (error) throw error

    await loadCategories()
  } catch (error) {
    console.error('Error deleting category:', error)
    errorMessage.value = 'Error al eliminar la categoría'
  }
}
</script>