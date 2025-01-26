<template>
  <div>
    <div v-if="isGeneratingReport" class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <h2 class="text-xl font-semibold text-gray-700 mt-6">Generando informe...</h2>
      <p class="text-sm text-gray-500 mt-2">Esto puede tardar unos segundos</p>
    </div>
    <div v-else-if="formattedReport" class="mt-6 p-4 bg-white rounded-lg shadow">
      <div class="prose prose-sm max-w-none" v-html="formattedReport"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRuntimeConfig } from '#app';
import { useAIReport } from '~/composables/useAIReport';

const config = useRuntimeConfig();
const deepseekApiKey = ref('');

const props = defineProps({
  expenses: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['report-generation-start', 'report-generation-end']);

const { report, formattedReport, isGeneratingReport, error, generateDeepSeekReport } = useAIReport();

// Watch for changes in expenses to update the report
watch(() => props.expenses, async (newExpenses) => {
  if (newExpenses.length > 0) {
    await generateReport(newExpenses);
  }
}, { deep: true });

// Generate report when component is mounted if expenses exist
onMounted(async () => {
  if (typeof window !== 'undefined') {
    deepseekApiKey.value = localStorage.getItem('deepseekApiKey');
  }
  if (props.expenses.length > 0) {
    await generateReport(props.expenses);
  }
});

async function generateReport(expenses) {
  emit('report-generation-start');
  await generateDeepSeekReport(expenses, deepseekApiKey.value);
  emit('report-generation-end');
}
</script>

<style scoped>
.prose {
  color: #374151;
}

.prose h1, .prose h2, .prose h3 {
  color: #1f2937;
  margin-top: 1.5em;
  margin-bottom: 0.5em;
}

.prose ul, .prose ol {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}

.prose p {
  margin-top: 0.5em;
  margin-bottom: 0.5em;
}
</style>