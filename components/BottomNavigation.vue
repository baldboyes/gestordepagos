<template>
  <div class="fixed bottom-0 left-0 right-0 bg-white shadow-lg">
    <div class="max-w-md mx-auto px-4 h-16 flex items-center justify-between">
      <button
        @click="$router.push('/')"
        :class="{
          'p-2 hover:text-blue-500 focus:outline-none': true,
          'text-blue-500': $route.path === '/',
          'text-gray-600': $route.path !== '/',
        }"
        title="Inicio"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      </button>
      <button
        @click="$router.push('/monthly-expenses')"
        :class="{
          'p-2 hover:text-blue-500 focus:outline-none': true,
          'text-blue-500': $route.path === '/monthly-expenses',
          'text-gray-600': $route.path !== '/monthly-expenses'
        }"
        title="Resumen Mensual"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </button>
      <button
        @click="$emit('showModal')"
        :disabled="!hasCategories"
        :class="{
          'text-white rounded-full p-4 transform -translate-y-6 shadow-lg focus:outline-none': true,
          'bg-blue-500 hover:bg-blue-600': hasCategories,
          'bg-gray-400 cursor-not-allowed': !hasCategories,
        }"
        title="Añadir Gasto"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
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
      <button
        @click="$router.push('/settings')"
        :class="{
          'p-2 hover:text-blue-500 focus:outline-none': true,
          'text-blue-500': $route.path === '/settings',
          'text-gray-600': $route.path !== '/settings',
        }"
        title="Configuración"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </button>
      <button
        @click="$router.push('/user')"
        :class="{
          'p-2 hover:text-blue-500 focus:outline-none': true,
          'text-blue-500': $route.path === '/user',
          'text-gray-600': $route.path !== '/user',
        }"
        title="Perfil"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useSupabase } from "../src/lib/supabase";
const supabase = useSupabase();
const hasCategories = ref(false);

onMounted(async () => {
  await checkCategories();
});

const checkCategories = async () => {
  try {
    const { data: categories, error } = await supabase
      .from("categorias")
      .select("nombre");

    if (error) throw error;
    hasCategories.value = categories && categories.length > 0;
  } catch (error) {
    console.error("Error checking categories:", error);
    hasCategories.value = false;
  }
};

defineEmits(["showModal", "showMonthlyReport", "showSettings"]);
</script>
