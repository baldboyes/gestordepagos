<template>
  <div class="min-h-screen md:bg-gray-100 md:p-4 pb-20 transition duration-300">
    <div class="max-w-md mx-auto bg-white rounded-lg md:shadow-lg p-6">
      <h1 class="text-2xl font-bold mb-4">Configuración</h1>
      
      <!-- Tab Navigation -->
      <div class="flex border-b border-gray-200 mb-6">
        <button
          @click="activeTab = 'categoriasSupabase'"
          :class="{
            'px-4 py-2 -mb-px': true,
            'text-blue-600 border-b-2 border-blue-500 font-medium': activeTab === 'categoriasSupabase',
            'text-gray-500 hover:text-gray-700': activeTab !== 'categoriasSupabase'
          }"
        >
          Categorías
        </button>
        <button
          @click="activeTab = 'supabaseFixedExpense'"
          :class="{
            'px-4 py-2 -mb-px': true,
            'text-blue-600 border-b-2 border-blue-500 font-medium': activeTab === 'supabaseFixedExpense',
            'text-gray-500 hover:text-gray-700': activeTab !== 'supabaseFixedExpense'
          }"
        >
          Recurrentes
        </button>
      </div>

      <!-- Supabase Categories Section -->
      <div v-show="activeTab === 'categoriasSupabase'">
        <SupabaseCategories />
      </div>

      <!-- Supabase Fixed Expense Section -->
      <div v-show="activeTab === 'supabaseFixedExpense'">
        <SupabaseFixedExpense />
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import SupabaseFixedExpense from '~/components/SupabaseFixedExpense.vue'

const activeTab = ref('categoriasSupabase')
</script>