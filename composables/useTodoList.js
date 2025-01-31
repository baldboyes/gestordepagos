import { ref, computed } from 'vue'
import { useSupabase } from '../src/lib/supabase'
import { useUser } from '../src/lib/auth'

export const useTodoList = () => {
  const supabase = useSupabase()
  const { user } = useUser()
  
  const lists = ref([])
  const todos = ref([])
  const todosByList = ref({})
  const activeNames = ref([])
  const error = ref(null)
  
  const pendingTodosCount = computed(() => (listId) => {
    return todosByList.value[listId]?.filter(todo => !todo.completado).length || 0
  })

  const totalPendingTasks = computed(() => {
    return Object.values(todosByList.value).reduce((total, todos) => {
      if (!todos || !Array.isArray(todos)) return total
      return total + todos.filter(todo => !todo.completado).length
    }, 0)
  })

  const fetchLists = async () => {
    try {
      if (!user.value) {
        lists.value = []
        return
      }

      const { data, error: listError } = await supabase
        .from('listados')
        .select('*')
        .eq('user_id', user.value.id)
        .order('creado_en')
      
      if (listError) throw listError
      lists.value = data || []
    } catch (err) {
      error.value = 'Error al cargar las listas'
      console.error('Error:', err)
    }
  }

  const fetchTodos = async (listId) => {
    if (!listId) return
    
    try {
      const { data, error: todoError } = await supabase
        .from('tareas')
        .select('*')
        .eq('listado_id', listId)
        .eq('user_id', user.value.id)
        .order('creado_en')
      
      if (todoError) throw todoError
      todosByList.value[listId] = data || []
    } catch (err) {
      error.value = 'Error al cargar las tareas'
      console.error('Error:', err)
    }
  }

  const addList = async (nombre) => {
    try {
      const { data, error: addError } = await supabase
        .from('listados')
        .insert([{
          nombre,
          user_id: user.value.id,
          creado_en: new Date().toISOString()
        }])
        .select()

      if (addError) throw addError
      if (!data || data.length === 0) throw new Error('No se pudo crear la lista')

      lists.value = [...lists.value, data[0]]
      return data[0]
    } catch (err) {
      error.value = 'Error al crear la lista'
      console.error('Error:', err)
      return null
    }
  }

  const deleteList = async (listId) => {
    try {
      const { error: deleteError } = await supabase
        .from('listados')
        .delete()
        .eq('id', listId)
      
      if (deleteError) throw deleteError
      
      lists.value = lists.value.filter(list => list.id !== listId)
      delete todosByList.value[listId]
      activeNames.value = activeNames.value.filter(name => name !== listId)
    } catch (err) {
      error.value = 'Error al eliminar la lista'
      console.error('Error:', err)
    }
  }

  const addTodo = async (listId, descripcion) => {
    try {
      const { error: addError } = await supabase
        .from('tareas')
        .insert([{
          listado_id: listId,
          descripcion,
          completado: false,
          user_id: user.value.id
        }])
      
      if (addError) throw addError
      await fetchTodos(listId)
    } catch (err) {
      error.value = 'Error al añadir la tarea'
      console.error('Error:', err)
    }
  }

  const toggleTodo = async (todo) => {
    try {
      const { error: updateError } = await supabase
        .from('tareas')
        .update({ 
          completado: !todo.completado,
          user_id: user.value.id 
        })
        .eq('id', todo.id)
      
      if (updateError) throw updateError
      
      if (todosByList.value[todo.listado_id]) {
        const todoIndex = todosByList.value[todo.listado_id].findIndex(t => t.id === todo.id)
        if (todoIndex !== -1) {
          // Create a new array to ensure reactivity
          todosByList.value[todo.listado_id] = [...todosByList.value[todo.listado_id]]
          todosByList.value[todo.listado_id][todoIndex] = {
            ...todosByList.value[todo.listado_id][todoIndex],
            completado: !todo.completado
          }
        }
      }
    } catch (err) {
      error.value = 'Error al actualizar la tarea'
      console.error('Error:', err)
    }
  }

  const deleteTodo = async (todo) => {
    try {
      const { error: deleteError } = await supabase
        .from('tareas')
        .delete()
        .eq('id', todo.id)
      
      if (deleteError) throw deleteError
      await fetchTodos(todo.listado_id)
    } catch (err) {
      error.value = 'Error al eliminar la tarea'
      console.error('Error:', err)
    }
  }

  return {
    lists,
    todos,
    todosByList,
    activeNames,
    error,
    pendingTodosCount,
    totalPendingTasks,
    fetchLists,
    fetchTodos,
    addList,
    deleteList,
    addTodo,
    toggleTodo,
    deleteTodo
  }
}