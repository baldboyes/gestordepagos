<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h2 class="text-xl font-semibold">Pagos Recurrentes</h2>
      <button
        @click="showAddModal = true"
        class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        Añadir
      </button>
    </div>

    <!-- List of recurring payments -->
    <div class="space-y-3">
      <div
        v-if="fixedExpenseTemplates.length === 0"
        class="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg text-center space-y-4"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-16 w-16 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 class="text-xl font-semibold text-gray-800">Sin pagos recurrentes</h3>
        <p class="text-sm text-gray-600 max-w-sm">
          Configura tus pagos mensuales fijos para tener un mejor control de tus gastos
          recurrentes. ¡Empieza añadiendo tu primer pago!
        </p>
      </div>
      <div
        v-else
        v-for="template in fixedExpenseTemplates"
        :key="template.id"
        class="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
      >
        <div>
          <h3 class="font-medium">{{ template.nombre }}</h3>
          <p class="text-sm text-gray-600">{{ template.categoria }}</p>
          <p class="text-sm text-gray-500">{{ template.nota }}</p>
        </div>
        <div class="flex items-center space-x-4">
          <span class="font-bold text-blue-600">{{ template.precio.toFixed(2) }}€</span>
          <div class="relative">
            <button
              @click="template.showMenu = !template.showMenu"
              class="text-gray-500 hover:text-gray-700 focus:outline-none"
              title="Más opciones"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                />
              </svg>
            </button>
            <div
              v-if="template.showMenu"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
            >
              <button
                @click="editTemplate(template); template.showMenu = false"
                class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Editar
              </button>
              <button
                @click="deleteTemplate(template.id); template.showMenu = false"
                class="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Template Modal -->
    <div
      v-if="showAddModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
    >
      <div class="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-bold mb-4">Añadir Pago</h2>
        <form @submit.prevent="addTemplate" class="space-y-4">
          <div v-if="errorMessage" class="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
            {{ errorMessage }}
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
            <input
              v-model="newTemplate.nombre"
              type="text"
              required
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
            <select
              v-model="newTemplate.categoria"
              required
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Selecciona una categoría</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Precio</label>
            <input
              v-model="newTemplate.precio"
              type="number"
              step="0.01"
              required
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Nota</label>
            <input
              v-model="newTemplate.nota"
              type="text"
              class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div class="flex gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Desde las</label>
              <input
                type="time"
                class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Hasta las</label>
              <input
                type="time"
                class="w-full rounded-md border-2 border-gray-400 p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              @click="showAddModal = false"
              class="px-4 py-2 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from "vue";
import { useSupabase } from "~/src/lib/supabase";

const emit = defineEmits(["template-updated"]);

const showAddModal = ref(false);
const fixedExpenseTemplates = ref([]);
const errorMessage = ref("");
const categories = ref([]);

const newTemplate = ref({
  nombre: "",
  categoria: "",
  precio: "",
  nota: "",
});

onMounted(async () => {
  await loadTemplates();
  await loadCategories();
});

const supabase = useSupabase();

const loadCategories = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from("categorias")
      .select("nombre")
      .eq("user_id", user.id)
      .order("nombre");

    if (error) throw error;

    categories.value = data.map((cat) => cat.nombre);
  } catch (error) {
    console.error("Error loading categories:", error);
  }
};

const loadTemplates = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;

    const { data, error } = await supabase
      .from("recurrente")
      .select("*")
      .eq("user_id", user.id)
      .order("nombre");

    if (error) throw error;

    fixedExpenseTemplates.value = data;
  } catch (error) {
    console.error("Error loading templates:", error);
  }
};

const addTemplate = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError) throw userError;

    const template = {
      nombre: newTemplate.value.nombre,
      categoria: newTemplate.value.categoria,
      precio: parseFloat(newTemplate.value.precio),
      nota: newTemplate.value.nota,
      user_id: user.id,
    };

    const { data, error } = await supabase.from("recurrente").insert([template]).select();

    if (error) throw error;

    fixedExpenseTemplates.value.push(data[0]);
    fixedExpenseTemplates.value.sort((a, b) => a.nombre.localeCompare(b.nombre));
    emit("template-updated");

    // Reset form and error message
    newTemplate.value = {
      nombre: "",
      categoria: "",
      precio: "",
      nota: "",
    };
    errorMessage.value = "";
    showAddModal.value = false;
  } catch (error) {
    console.error("Error adding template:", error);
    errorMessage.value = "Error al añadir el gasto recurrente";
  }
};

const deleteTemplate = async (templateId) => {
  try {
    const { error } = await supabase.from("recurrente").delete().eq("id", templateId);

    if (error) throw error;

    fixedExpenseTemplates.value = fixedExpenseTemplates.value.filter(
      (t) => t.id !== templateId
    );
    emit("template-updated");
  } catch (error) {
    console.error("Error deleting template:", error);
  }
};
const editTemplate = (template) => {
  newTemplate.value = { ...template }
  showAddModal.value = true
}
</script>
