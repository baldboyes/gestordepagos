<template>
  <div class="min-h-screen md:bg-gray-100">
    <slot />

    <BottomNavigation 
      @showModal="showModal = true" 
      @showMonthlyReport="$router.push('/monthly-expenses')"
      @showSettings="$router.push('/settings')"
    />

    <AddExpenseModal
      v-model:showModal="showModal"
      @expense-added="handleExpenseAdded"
    />
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import AddExpenseModal from '../components/AddExpenseModal.vue'

const showModal = ref(false)

const handleExpenseAdded = (expenses) => {
  window.dispatchEvent(new CustomEvent('expenses-updated', { detail: expenses }))
}

// Provide the showModal ref to be used by child components
provide('showModal', showModal)
</script>