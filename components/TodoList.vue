<template>
  <div class="todo-list w-full space-y-6">
    <!-- Lista de tareas selector/creador -->
    <div class="space-y-4">
      <div class="flex gap-2 items-center justify-between">
          <h2>Listas</h2>
          <button 
            @click="showAddModal = true"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            title="Añadir lista"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
    </div>

    <van-collapse v-model="activeNames" @change="handleCollapseChange" class="space-y-2">
      <van-collapse-item v-for="list in lists" :key="list.id" :name="list.id">
        <template #title>
          <div class="flex justify-between items-center mr-2">
            <van-badge class="my-2" position="top-right" v-if="todosByList[list.id]?.filter(todo => !todo.completado).length > 0" :content="todosByList[list.id]?.filter(todo => !todo.completado).length">
              <h2 class="text-xl font-semibold mr-2">{{ list.nombre }}</h2>
            </van-badge>
            <h2 v-else class="text-xl font-semibold">{{ list.nombre }}</h2>
            <button 
              @click="confirmDeleteList(list.id)" 
              class="text-red-500 hover:text-red-600 focus:outline-none"
              title="Eliminar lista"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </template>
        <div class="space-y-4">
          <form @submit.prevent="addTodoToList(list.id)" class="flex gap-2">
            <input 
              v-model="newTodoText[list.id]" 
              type="text" 
              placeholder="Añadir nueva tarea"
              class="flex-1 w-full rounded-md border-2 border-gray-100 hover:border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Añadir
            </button>
          </form>
          <div v-for="todo in todosByList[list.id]" :key="todo.id" class="flex items-center justify-between px-2 bg-gray-50 rounded-lg">
            <div class="flex items-center gap-3 text-gray-600">
              <input 
                type="checkbox" 
                :checked="todo.completado"
                @change="toggleTodo(todo)"
                class="appearance-none rounded border-2 border-gray-400 checked:bg-gray-300 checked:border-gray-300 focus:border-blue-500 focus:ring-blue-500 h-4 w-4 cursor-pointer"
              >
              <span :class="{ 'line-through text-gray-400': todo.completado }">
                {{ todo.descripcion }}
              </span>
            </div>
            <button @click="confirmRemoveTodo(todo)" class="text-red-500 hover:text-red-600 text-xl">
              <span class="sr-only">Eliminar tarea</span>
              ×
            </button>
          </div>
        </div>
      </van-collapse-item>
    </van-collapse>


    <!-- Modal para añadir lista -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Añadir Lista</h2>
        <form @submit.prevent="addList" class="space-y-4">
          <input
            v-model="newList"
            type="text"
            placeholder="Nombre de la lista"
            class="w-full rounded-md border-2 border-gray-100 hover:border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
          <div class="flex justify-end gap-2">
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
              Crear Lista
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useSupabase } from '../src/lib/supabase'
import { useUser } from '../src/lib/auth'

const activeNames = ref([]);

const supabase = useSupabase()
const { user } = useUser()
const lists = ref([])
const todos = ref([])
const newTodo = ref('')
const newList = ref('')
const selectedList = ref('')
const showAddModal = ref(false)
const todosByList = ref({})
const newTodoText = ref({})

// Cargar listas
const fetchLists = async () => {
  const { data, error } = await supabase
    .from('listados')
    .select('*')
    .eq('user_id', user.value.id)
    .order('creado_en')
  
  if (error) console.error('Error:', error)
  else lists.value = data || []
}

// Cargar tareas de una lista
const fetchTodos = async (listId) => {
  if (!listId) return;
  
  const { data, error } = await supabase
    .from('tareas')
    .select('*')
    .eq('listado_id', listId)
    .eq('user_id', user.value.id)
    .order('creado_en')
  
  if (error) {
    console.error('Error:', error)
    return
  }
  
  // Update both the todos array and the todosByList object
  todos.value = data || []
  
  // Initialize the object if it doesn't exist
  if (!todosByList.value[listId]) {
    todosByList.value[listId] = []
  }
  
  // Update the tasks for this specific list
  todosByList.value[listId] = data || []
}

// Crear nueva lista
const addList = async () => {
  showAddModal.value = false // Close modal after successful creation
  if (!newList.value.trim()) {
    alert('Por favor, ingresa un nombre para la lista')
    return
  }

  try {
    const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser()
    if (userError) throw userError

    const { data, error } = await supabase
      .from('listados')
      .insert([{
        nombre: newList.value.trim(),
        user_id: currentUser.id,
        creado_en: new Date().toISOString()
      }])
      .select()

    if (error) throw error
    if (!data || data.length === 0) throw new Error('No se pudo crear la lista')

    // Update the lists array directly with the new list
    lists.value = [...lists.value, data[0]]
    newList.value = ''
    selectedList.value = data[0].id // Auto-select the newly created list
    await fetchTodos() // Fetch todos for the newly selected list
  } catch (error) {
    console.error('Error al crear la lista:', error)
    alert('Error al crear la lista. Por favor, inténtalo de nuevo.')
  }
}

// Eliminar lista
const confirmDeleteList = (listId) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta lista?')) {
    deleteList(listId)
  }
}

const deleteList = async (listId) => {
  if (!listId) return
  
  const { error } = await supabase
    .from('listados')
    .delete()
    .eq('id', listId)
  
  if (error) {
    console.error('Error:', error)
    alert('Error al eliminar la lista. Por favor, inténtalo de nuevo.')
  } else {
    // Update local state
    lists.value = lists.value.filter(list => list.id !== listId)
    delete todosByList.value[listId]
    selectedList.value = ''
    activeNames.value = activeNames.value.filter(name => name !== listId)
  }
}

// Añadir tarea a una lista específica
const addTodoToList = async (listId) => {
  if (!newTodoText.value[listId]?.trim()) return
  
  const { error } = await supabase
    .from('tareas')
    .insert([{
      listado_id: listId,
      descripcion: newTodoText.value[listId].trim(),
      completado: false,
      user_id: user.value.id
    }])
  
  if (error) console.error('Error:', error)
  else {
    await fetchTodos(listId)
    newTodoText.value[listId] = ''
  }
}

// Manejar cambios en el collapse
const handleCollapseChange = async (activeNames) => {
  // Convert to array if it's not already
  const namesArray = Array.isArray(activeNames) ? activeNames : [activeNames];
  
  for (const listId of namesArray) {
    if (listId) {
      await fetchTodos(listId)
    }
  }
}

// Confirmar eliminación de tarea
const confirmRemoveTodo = (todo) => {
  if (confirm(`¿Estás seguro de que deseas eliminar la tarea "${todo.descripcion}"?`)) {
    removeTodo(todo.id)
  }
}

// Eliminar tarea
const removeTodo = async (todoId) => {
  const { error } = await supabase
    .from('tareas')
    .delete()
    .eq('id', todoId)
  
  if (error) {
    console.error('Error:', error)
    alert('Error al eliminar la tarea. Por favor, inténtalo de nuevo.')
  } else {
    // Get the list ID from the active names array
    for (const listId of activeNames.value) {
      await fetchTodos(listId)
    }
  }
}

// Toggle completado
const toggleTodo = async (todo) => {
  const { error } = await supabase
    .from('tareas')
    .update({ 
      completado: !todo.completado,
      user_id: user.value.id 
    })
    .eq('id', todo.id)
  
  if (error) {
    console.error('Error:', error)
  } else {
    // Update the todo in the local state immediately
    if (todosByList.value[todo.listado_id]) {
      const todoIndex = todosByList.value[todo.listado_id].findIndex(t => t.id === todo.id)
      if (todoIndex !== -1) {
        todosByList.value[todo.listado_id][todoIndex].completado = !todo.completado
      }
    }
  }
}

// Watch para cambios en la lista seleccionada
watch(selectedList, () => {
  todos.value = []
  if (selectedList.value) fetchTodos()
})

// Cargar datos iniciales
onMounted(async () => {
  // Initialize user state
  const { data: { user: initialUser } } = await supabase.auth.getUser()
  if (initialUser) {
    user.value = initialUser
    await fetchLists()
    // Auto-select the only list if there's just one
    if (lists.value.length === 1) {
      selectedList.value = lists.value[0].id
      await fetchTodos(lists.value[0].id)
    }
    // Load todos for all lists
    for (const list of lists.value) {
      await fetchTodos(list.id)
    }
  }

  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    user.value = session?.user || null
    if (session?.user) {
      fetchLists().then(async () => {
        // Auto-select the only list if there's just one
        if (lists.value.length === 1) {
          selectedList.value = lists.value[0].id
          await fetchTodos(lists.value[0].id)
        }
        // Load todos for all lists
        for (const list of lists.value) {
          await fetchTodos(list.id)
        }
      })
    } else {
      lists.value = []
      todos.value = []
      selectedList.value = ''
      activeNames.value = []
      todosByList.value = {}
    }
  })
})
</script>