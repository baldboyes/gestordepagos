import { ref } from 'vue';

export type Gasto = {
  categoria: string;
  created_at: string;
  fecha: string;
  id: number;
  nota: string;
  precio: number;
  user_id: string;
};

export type DetalleGasto = {
  nombre: string;
  precio: number;
};

export type ResultadoPorCategoria = {
  categoria: string;
  total: number;
  detalles: DetalleGasto[];
};

export type ResultadoPorMes = {
  mes: string; // Formato YYYY-MM
  categorias: ResultadoPorCategoria[];
};

export function useExpenseAnalysis() {
  const agruparGastosPorMesYCategoria = (gastos: Gasto[]): ResultadoPorMes[] => {
    // Agrupamos los gastos por mes
    const gastosPorMes: { [mes: string]: Gasto[] } = gastos.reduce((acc, gasto) => {
      const mes = gasto.fecha.slice(0, 7); // Extraemos el año y el mes (YYYY-MM)
      if (!acc[mes]) {
        acc[mes] = [];
      }
      acc[mes].push(gasto);
      return acc;
    }, {} as { [mes: string]: Gasto[] });

    // Procesamos los gastos de cada mes
    const resultado: ResultadoPorMes[] = Object.entries(gastosPorMes).map(([mes, gastosDelMes]) => {
      // Agrupamos los gastos del mes por categoría y sumamos los totales
      const categorias: { [categoria: string]: { total: number; detalles: DetalleGasto[] } } = gastosDelMes.reduce((acc, gasto) => {
        if (!acc[gasto.categoria]) {
          acc[gasto.categoria] = { total: 0, detalles: [] };
        }
        acc[gasto.categoria].total += gasto.precio;
        acc[gasto.categoria].detalles.push({ nombre: gasto.nota || "Sin definir", precio: gasto.precio });
        return acc;
      }, {} as { [categoria: string]: { total: number; detalles: DetalleGasto[] } });

      // Convertimos el objeto de categorías en un array de resultados por categoría
      const categoriasArray: ResultadoPorCategoria[] = Object.entries(categorias).map(([categoria, data]) => ({
        categoria,
        total: data.total,
        detalles: data.detalles,
      }));

      return {
        mes,
        categorias: categoriasArray,
      };
    });

    return resultado;
  };

  const getAnalysisPrompt = (expenses: Gasto[]): string => {
    return `Analiza estos gastos y proporciona un informe detallado en español y en euros que incluya: Patrones o tendencias notables y Recomendaciones para ahorrar. ${JSON.stringify(agruparGastosPorMesYCategoria(expenses), null, 2)}`;
  };

  return {
    agruparGastosPorMesYCategoria,
    getAnalysisPrompt
  };
}