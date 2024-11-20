<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded formS shadow-2xl wide-card">
    <q-card-section class="text-h6 text-primary">
      Exámenes y Estudios
    </q-card-section>
    <q-form @submit.prevent="guardarEstudio" class="q-gutter-md">
      <div class="row">
        <div class="col">
          <q-input
            v-model="estudioData.codigo"
            label="Código"
            outlined
            dense
            class="q-mb-sm q-mr-sm"
            :error="!!estudioErrors.codigo"
            :error-message="estudioErrors.codigo"
          />
          <!-- Agrega aquí los demás inputs de la primera columna -->
        </div>
        <div class="col">
          <!-- Agrega aquí los inputs de la segunda columna -->
        </div>
      </div>
      <div class="row justify-end q-mt-md">
        <q-btn
          label="Guardar"
          color="primary"
          icon="save"
          @click="guardarEstudio"
          class="q-mb-sm q-mr-sm"
        />
      </div>
    </q-form>
  </q-card>
  <div class="listado-componente q-tab-panel">
    <ListadoExamenesEstudios />
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useEstudioStore } from "../stores/DirectoriosStores";
import { useTiposEstudiosStore } from "../stores/ConfiMedicasStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import ListadoExamenesEstudios from "./ListadoExamenesEstudios.vue";

// Inicializar tiendas
const estudioStore = useEstudioStore();
const tiposEstudiosStore = useTiposEstudiosStore();

// Acceso a propiedades reactivas de las tiendas
const { estudios } = storeToRefs(tiposEstudiosStore);

// Datos reactivos para el formulario
const estudioData = reactive({
  codigo: "",
  descripcion: "",
  tipoId: "",
  indicaciones: "",
  precioCosto: "",
  precioVenta: "",
  facturar: false,
  status: "",
});

// Errores de validación
const estudioErrors = reactive({
  codigo: "",
  descripcion: "",
  tipoId: "",
  indicaciones: "",
  precioCosto: "",
  precioVenta: "",
  facturar: "",
  status: "",
});

// Opciones de estado
const statusOptions = [
  { label: "Disponible", value: "disponible" },
  { label: "No disponible", value: "no_disponible" },
  { label: "Pendiente", value: "pendiente" },
];

// Cargar datos al montar el componente
onMounted(async () => {
  await tiposEstudiosStore.cargarEstudios();
});

// Función para guardar estudio
const guardarEstudio = async () => {
  // Copia aquí la lógica de tu función guardarEstudio original
};
</script>
