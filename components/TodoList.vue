<template>
  <div class="todo-list w-full space-y-6">
    <!-- Header with add list button -->
    <div class="flex gap-2 items-center justify-between">
      <h2 class="text-xl font-semibold">Listas</h2>
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

    <!-- Error message -->
    <div v-if="error" class="p-4 bg-red-100 text-red-700 rounded-lg">
      {{ error }}
    </div>

    <!-- Lists -->
    <van-collapse v-model="activeNames" @change="handleCollapseChange" class="space-y-2">
      <van-collapse-item v-for="list in lists" :key="list.id" :name="list.id">
        <template #title>
          <div class="flex justify-between items-center w-full pr-4">
            <div class="flex items-center gap-2">
              <van-badge v-if="pendingTodosCount(list.id) > 0" :content="pendingTodosCount(list.id)">
                <h2 class="text-xl font-semibold mr-2">{{ list.nombre }}</h2>
              </van-badge>
              <h2 v-else class="text-xl font-semibold">{{ list.nombre }}</h2>
            </div>
            <button 
              @click.stop="confirmDeleteList(list.id)" 
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

        <!-- Todo items -->
        <div class="space-y-4 pt-4">
          <form @submit.prevent="handleAddTodo(list.id)" class="flex gap-2">
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

          <TransitionGroup 
            name="list" 
            tag="div" 
            class="space-y-2"
          >
            <div 
              v-for="todo in todosByList[list.id]" 
              :key="todo.id" 
              class="flex items-center justify-between px-4 py-2 bg-gray-50 rounded-lg transition-all duration-200 ease-in-out"
            >
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
              <button 
                @click="confirmDeleteTodo(todo)" 
                class="text-red-500 hover:text-red-600 focus:outline-none"
              >
                <span class="sr-only">Eliminar tarea</span>
                ×
              </button>
            </div>
          </TransitionGroup>
        </div>
      </van-collapse-item>
    </van-collapse>

    <!-- Add list modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Añadir Lista</h2>
        <form @submit.prevent="handleAddList" class="space-y-4">
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
import { ref, watch } from 'vue'
import { useTodoList } from '../composables/useTodoList'
import { useUser } from '../src/lib/auth'

const {
  lists,
  todosByList,
  activeNames,
  error,
  pendingTodosCount,
  fetchLists,
  fetchTodos,
  addList,
  deleteList,
  addTodo,
  toggleTodo,
  deleteTodo
} = useTodoList()

const showAddModal = ref(false)
const newList = ref('')
const newTodoText = ref({})

// Watch for user authentication
const { user } = useUser()
watch(user, (newUser) => {
  if (newUser) {
    fetchLists()
  } else {
    lists.value = []
    todosByList.value = {}
    activeNames.value = []
  }
}, { immediate: true })

// Handle list operations
const handleAddList = async () => {
  if (!newList.value.trim()) return
  
  const list = await addList(newList.value)
  if (list) {
    showAddModal.value = false
    newList.value = ''
  }
}

const confirmDeleteList = (listId) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta lista?')) {
    deleteList(listId)
  }
}

// Handle todo operations
const handleAddTodo = async (listId) => {
  if (!newTodoText.value[listId]?.trim()) return
  
  await addTodo(listId, newTodoText.value[listId])
  newTodoText.value[listId] = ''
}

const confirmDeleteTodo = (todo) => {
  if (confirm(`¿Estás seguro de que deseas eliminar la tarea "${todo.descripcion}"?`)) {
    deleteTodo(todo)
  }
}

// Handle collapse changes
const handleCollapseChange = async (names) => {
  const namesArray = Array.isArray(names) ? names : [names]
  for (const listId of namesArray) {
    if (listId) await fetchTodos(listId)
  }
}

// Initial data fetch
const initializeData = async () => {
  await fetchLists()
  if (lists.value && lists.value.length > 0) {
    await Promise.all(lists.value.map(list => fetchTodos(list.id)))
  }
}

// Watch for changes in lists to fetch todos when new lists are added
watch(() => lists.value, async (newLists) => {
  if (newLists && newLists.length > 0) {
    await Promise.all(newLists.map(list => fetchTodos(list.id)))
  }
}, { deep: true })

initializeData()
</script>

<style scoped>
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>