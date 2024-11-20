<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded formS shadow-2xl wide-card">
    <q-card-section class="text-h6 text-primary">
      Medicamentos y Otros
    </q-card-section>
    <q-form @submit.prevent="guardarMedicamento" class="q-gutter-md">
      <div class="row">
        <div class="col">
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="medicamentoData.codigo"
            label="Código"
            outlined
            dense
            :error="!!medicamentoErrors.codigo"
            :error-message="medicamentoErrors.codigo"
          />
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="medicamentoData.descripcion"
            label="Descripción"
            outlined
            dense
            :error="!!medicamentoErrors.descripcion"
            :error-message="medicamentoErrors.descripcion"
          />
          <q-select
            class="q-mb-sm q-mr-sm"
            v-model="medicamentoData.tipoId"
            :options="medicamentos"
            option-value="id"
            option-label="descripcion"
            label="Tipo de medicamentos"
            outlined
            dense
            :error="!!medicamentoErrors.tipo"
            :error-message="medicamentoErrors.tipo"
          />
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="medicamentoData.indicaciones"
            label="Indicaciones"
            type="textarea"
            outlined
            dense
            :error="!!medicamentoErrors.indicaciones"
            :error-message="medicamentoErrors.indicaciones"
          />
        </div>
        <div class="col">
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="medicamentoData.precioCosto"
            label="Precio Costo"
            outlined
            dense
            :error="!!medicamentoErrors.precioCosto"
            :error-message="medicamentoErrors.precioCosto"
          />
          <q-input
            class="q-mb-sm q-mr-sm"
            v-model="medicamentoData.precioVenta"
            label="Precio Venta"
            outlined
            dense
            :error="!!medicamentoErrors.precioVenta"
            :error-message="medicamentoErrors.precioVenta"
          />
          <q-checkbox
            class="q-mb-sm q-mr-sm"
            v-model="medicamentoData.facturar"
            label="Facturar"
            :error="!!medicamentoErrors.facturar"
            :error-message="medicamentoErrors.facturar"
          />
          <q-select
            class="q-mb-sm q-mr-sm"
            v-model="medicamentoData.status"
            :options="statusOptions"
            label="Status"
            outlined
            dense
            :error="!!medicamentoErrors.status"
            :error-message="medicamentoErrors.status"
          />
        </div>
      </div>
      <div class="row justify-end q-mt-md">
        <q-btn
          label="Guardar"
          color="primary"
          icon="save"
          @click="guardarMedicamento"
          class="q-mb-sm q-mr-sm"
        />
      </div>
    </q-form>
  </q-card>
  <div class="listado-componente q-tab-panel">
    <ListadoMedicamentos />
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useMedicamentoStore } from "../stores/DirectoriosStores";
import { useTiposMedicamentosStore } from "../stores/ConfiMedicasStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import ListadoMedicamentos from "./ListadoMedicamentos.vue";

// Inicializar tiendas
const medicamentoStore = useMedicamentoStore();
const tiposMedicamentosStore = useTiposMedicamentosStore();

// Acceso a propiedades reactivas de las tiendas
const { medicamentos } = storeToRefs(tiposMedicamentosStore);

// Datos reactivos para el formulario
const medicamentoData = reactive({
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
const medicamentoErrors = reactive({
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
  await tiposMedicamentosStore.cargarMedicamentos();
});

// Función para guardar medicamento
const guardarMedicamento = async () => {
  Object.keys(medicamentoErrors).forEach((key) => {
    medicamentoErrors[key] = "";
  });

  if (!medicamentoData.codigo)
    medicamentoErrors.codigo = "Ingrese un código para el medicamento.";
  if (!medicamentoData.descripcion)
    medicamentoErrors.descripcion = "Ingrese una descripción.";
  if (!medicamentoData.tipoId)
    medicamentoErrors.tipoId = "El tipo de estudio es obligatorio.";
  if (!medicamentoData.indicaciones)
    medicamentoErrors.indicaciones = "Ingrese las indicaciones de uso.";
  if (!medicamentoData.precioCosto)
    medicamentoErrors.precioCosto = "Ingrese el precio de Costo.";

  if (!medicamentoData.precioVenta)
    medicamentoErrors.precioVenta = "Ingrese el precio de Venta.";

  if (Object.values(medicamentoErrors).some((error) => error)) {
    Notify.create({
      type: "negative",
      position: "top-right",
      message: "Por favor, complete todos los campos obligatorios",
    });
    return;
  }

  // const tipoId =
  //   typeof medicamentoData.tipoId === "object"
  //     ? medicamentoData.tipoId.id
  //     : medicamentoData.tipoId;

  // const tipoDescripcion =
  //   medicamentos.value.find((medicamento) => medicamento.id === tipoId)
  //     ?.descripcion || "";

  const medicamentoInfo = {
    codigo: medicamentoData.codigo,
    descripcion: medicamentoData.descripcion,
    tipoId: medicamentoData.tipoId.id,
    indicaciones: medicamentoData.indicaciones,
    precioCosto: medicamentoData.precioCosto,
    precioVenta: medicamentoData.precioVenta,
    facturar: medicamentoData.facturar,
    status:
      typeof medicamentoData.status === "object"
        ? medicamentoData.status.value
        : medicamentoData.status,
  };

  try {
    console.log(medicamentoInfo);
    await medicamentoStore.agregarMedicamento(medicamentoInfo);
    Notify.create({
      type: "positive",
      message: "Medicamento guardado correctamente",
      position: "top-right",
    });
    Object.keys(medicamentoData).forEach((key) => {
      medicamentoData[key] = "";
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al guardar el medicamento",
      position: "top-right",
    });
  }
};
</script>
