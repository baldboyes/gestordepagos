<template>
  <div class="todo-list w-full">
    <div class="space-y-4">
      <form @submit.prevent="addTodo">
        <div class="flex gap-2">
            <input 
            v-model="newTodo" 
            type="text" 
            placeholder="Añadir nueva tarea"
            class="flex-1 w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
            <button 
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
            Añadir
            </button>
        </div>
        </form>
      <div v-for="(todo, index) in todos" :key="index" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
        <div class="flex items-center gap-3">
          <input type="checkbox" v-model="todo.completed" class="rounded border-2 border-gray-400 text-blue-500 focus:ring-blue-500">
          <span :class="{ 'line-through text-gray-400': todo.completed }">{{ todo.text }}</span>
        </div>
        <button @click="removeTodo(index)" class="text-red-500 hover:text-red-600 text-xl">
          <span class="sr-only">Eliminar tarea</span>
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const todos = ref([])
const newTodo = ref('')

const addTodo = () => {
  if (newTodo.value.trim()) {
    todos.value.push({
      text: newTodo.value,
      completed: false
    })
    newTodo.value = ''
  }
}

const removeTodo = (index) => {
  todos.value.splice(index, 1)
}
</script>