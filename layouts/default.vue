<template>
  <div class="min-h-screen md:bg-gray-100 pb-16">
    <slot />

    <template v-if="isAuthenticated">
      <BottomNavigation 
        @showModal="showModal = true" 
        @showMonthlyReport="$router.push('/monthly-expenses')"
        @showSettings="$router.push('/settings')"
      />

      <AddExpenseModal
        v-model:showModal="showModal"
        @expense-added="handleExpenseAdded"
      />
    </template>
  </div>
</template>

<script setup>
import { ref, provide, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useSupabase } from '../src/lib/supabase'
import AddExpenseModal from '../components/AddExpenseModal.vue'

const router = useRouter()
const supabase = useSupabase()
const showModal = ref(false)
const isAuthenticated = ref(false)

const checkAuth = async () => {
  const { data: { user }, error } = await supabase.auth.getUser()
  isAuthenticated.value = !!user
  
  if (!user && router.currentRoute.value.path !== '/user') {
    router.push('/user')
  }
}

onMounted(() => {
  checkAuth()
  
  // Listen for auth state changes
  supabase.auth.onAuthStateChange((event, session) => {
    isAuthenticated.value = !!session
    if (!session && router.currentRoute.value.path !== '/user') {
      router.push('/user')
    }
  })
})

const handleExpenseAdded = (expenses) => {
  window.dispatchEvent(new CustomEvent('expenses-updated', { detail: expenses }))
}

// Provide the showModal ref to be used by child components
provide('showModal', showModal)
</script>