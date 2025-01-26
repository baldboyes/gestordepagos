<template>
  <div>
    <div v-if="isGeneratingReport" class="flex flex-col items-center justify-center py-16 text-center">
      <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <h2 class="text-xl font-semibold text-gray-700 mt-6">Generando informe...</h2>
      <p class="text-sm text-gray-500 mt-2">Esto puede tardar unos segundos</p>
    </div>
    <div v-else-if="formattedReport" class="mt-6 p-4 bg-white rounded-lg shadow">
      <h3 class="text-lg font-semibold mb-3">AI Expense Analysis</h3>
      <div class="prose prose-sm max-w-none" v-html="formattedReport"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { marked } from 'marked';
import { useRuntimeConfig } from '#app';

const config = useRuntimeConfig();
const ollamaModel = config.public.OLLAMA
const props = defineProps({
  expenses: {
    type: Array,
    required: true
  }
});

const emit = defineEmits(['report-generation-start', 'report-generation-end']);

const report = ref('');
const formattedReport = ref('');
const isGeneratingReport = ref(false);

// Watch for changes in expenses to update the report
watch(() => props.expenses, async (newExpenses) => {
  if (newExpenses.length > 0) {
    await generateReport(newExpenses);
  }
}, { deep: true });

// Generate report when component is mounted if expenses exist
onMounted(async () => {
  if (props.expenses.length > 0) {
    await generateReport(props.expenses);
  }
});

async function generateReport(expenses) {
  if (!expenses || expenses.length === 0) {
    report.value = '';
    formattedReport.value = '';
    return;
  }

  try {
    isGeneratingReport.value = true;
    emit('report-generation-start');
    const prompt = `Analiza estos gastos y proporciona un informe detallado en español y en euros que incluya:
    - Gasto total
    - Gastos por categoría
    - Patrones o tendencias notables
    - Recomendaciones para ahorrar

Datos de gastos:
${JSON.stringify(expenses, null, 2)}`;

    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: ollamaModel,
        prompt: prompt,
        stream: false
      })
    });

    const data = await response.json();
    report.value = data.response;
    // Convert markdown to HTML for better formatting
    formattedReport.value = marked(data.response);
  } catch (error) {
    console.error('Error generating report:', error);
    report.value = 'Error generating expense analysis. Please try again later.';
    formattedReport.value = report.value;
  } finally {
    isGeneratingReport.value = false;
    emit('report-generation-end');
  }
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