import { ref } from 'vue';
import { marked } from 'marked';
import { useExpenseAnalysis } from './useExpenseAnalysis';

export function useAIReport() {
  const report = ref('');
  const formattedReport = ref('');
  const isGeneratingReport = ref(false);
  const error = ref('');

  async function generateDeepSeekReport(expenses: any[], apiKey: string) {
    if (!expenses || expenses.length === 0) {
      report.value = '';
      formattedReport.value = '';
      return;
    }

    const { getAnalysisPrompt } = useExpenseAnalysis();

    try {
      isGeneratingReport.value = true;
      error.value = '';
      const prompt = getAnalysisPrompt(expenses);

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{
            role: 'user',
            content: prompt
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      report.value = data.choices[0].message.content;
      formattedReport.value = marked(report.value);
    } catch (err) {
      console.error('Error generating report:', err);
      error.value = 'Lo siento, no se pudo generar el análisis de gastos. Por favor, verifica que el servicio de IA esté disponible y accesible.';
      report.value = error.value;
      formattedReport.value = error.value;
    } finally {
      isGeneratingReport.value = false;
    }
  }

  async function generateOllamaReport(expenses: any[], endpoint: string, model: string) {
    if (!expenses || expenses.length === 0) {
      report.value = '';
      formattedReport.value = '';
      return;
    }

    const { getAnalysisPrompt } = useExpenseAnalysis();

    try {
      isGeneratingReport.value = true;
      error.value = '';
      const prompt = getAnalysisPrompt(expenses);

      const response = await fetch(`${endpoint}/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      report.value = data.response;
      formattedReport.value = marked(data.response);
    } catch (err) {
      console.error('Error generating report:', err);
      error.value = 'Lo siento, no se pudo generar el análisis de gastos. Por favor, verifica que el servicio de IA esté disponible y accesible.';
      report.value = error.value;
      formattedReport.value = error.value;
    } finally {
      isGeneratingReport.value = false;
    }
  }

  return {
    report,
    formattedReport,
    isGeneratingReport,
    error,
    generateDeepSeekReport,
    generateOllamaReport
  };
}