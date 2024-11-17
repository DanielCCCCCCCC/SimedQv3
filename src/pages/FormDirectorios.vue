<template>
  <!-- ESTE ES EL COMPONENTE PADRE FormDirectorios.vue -->
  <q-page class="q-pa-md">
    <q-tabs
      v-model="tab"
      class="bg-white text-black q-mb-sm shadow-2 rounded-borders"
    >
      <q-tab name="Hospitales" icon="local_hospital" label="Hospitales" />
      <q-tab
        name="Medicamentos"
        icon="medication"
        label="Medicamentos y Otros"
      />
      <q-tab name="Estudios" icon="description" label="Exámenes y Estudios" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated swipeable>
      <!-- Pestaña: Hospitales -->
      <q-tab-panel name="Hospitales">
        <q-card
          class="q-pa-sm q-mt-md bg-grey-1 rounded formS shadow-2xl wide-card"
        >
          <q-card-section class="text-h6 text-primary"
            >Hospitales</q-card-section
          >
          <q-form @submit.prevent="guardarHospital" class="q-gutter-md">
            <div class="row">
              <div class="col">
                <q-input
                  class="q-mb-sm q-mr-sm"
                  v-model="hospitalData.nombre"
                  label="Nombre"
                  outlined
                  dense
                  :error="!!hospitalErrors.nombre"
                  :error-message="hospitalErrors.nombre"
                />
                <q-input
                  class="q-mb-sm q-mr-sm"
                  v-model="hospitalData.direccion"
                  label="Dirección"
                  outlined
                  dense
                  :error="!!hospitalErrors.direccion"
                  :error-message="hospitalErrors.direccion"
                />
                <q-select
                  class="q-mb-sm q-mr-sm"
                  v-model="hospitalData.departamentoId"
                  :options="departamentos"
                  label="Departamento"
                  option-value="id"
                  option-label="descripcion"
                  outlined
                  dense
                  :error="!!hospitalErrors.departamentoId"
                  :error-message="hospitalErrors.departamentoId"
                />
                <q-select
                  class="q-mb-sm q-mr-sm"
                  v-model="hospitalData.municipioId"
                  :options="filteredMunicipios"
                  label="Municipio"
                  option-value="id"
                  option-label="descripcion"
                  outlined
                  dense
                  :error="!!hospitalErrors.municipioId"
                  :error-message="hospitalErrors.municipioId"
                />
              </div>
              <div class="col">
                <q-input
                  class="q-mb-sm q-mr-sm"
                  v-model="hospitalData.telefono"
                  label="Teléfono"
                  outlined
                  dense
                  mask="####-####"
                  :error="!!hospitalErrors.telefono"
                  :error-message="hospitalErrors.telefono"
                />
                <q-input
                  class="q-mb-sm q-mr-sm"
                  v-model="hospitalData.email"
                  label="Email"
                  type="email"
                  outlined
                  dense
                  :error="!!hospitalErrors.email"
                  :error-message="hospitalErrors.email"
                />
                <q-input
                  class="q-mb-sm q-mr-sm"
                  v-model="hospitalData.web"
                  label="Web"
                  outlined
                  dense
                  :error="!!hospitalErrors.web"
                  :error-message="hospitalErrors.web"
                />
              </div>
            </div>
            <div class="row justify-end q-mt-md">
              <q-btn
                label="Guardar"
                color="primary"
                icon="add"
                @click="guardarHospital"
                class="q-mb-sm q-mr-sm"
              />
              <q-btn
                label="Eliminar"
                color="negative"
                icon="delete"
                @click="eliminarHospital"
                class="q-mb-sm q-mr-sm"
              />
            </div>
          </q-form>
        </q-card>
        <div class="listado-componente q-tab-panel">
          <ListadoHospitales />
        </div>
      </q-tab-panel>

      <!-- Pestaña: Medicamentos y Otros -->
      <q-tab-panel name="Medicamentos">
        <q-card
          class="q-pa-sm q-mt-md bg-grey-1 rounded formS shadow-2xl wide-card"
        >
          <q-card-section class="text-h6 text-primary"
            >Medicamentos y Otros</q-card-section
          >

          <!-- Formulario de Medicamentos -->
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
      </q-tab-panel>

      <!-- Pestaña: Exámenes y Estudios -->
      <q-tab-panel name="Estudios">
        <q-card
          class="q-pa-sm q-mt-md bg-grey-1 rounded formS shadow-2xl wide-card"
        >
          <q-card-section class="text-h6 text-primary"
            >Exámenes y Estudios</q-card-section
          >
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
                <q-input
                  v-model="estudioData.descripcion"
                  label="Descripción"
                  outlined
                  dense
                  class="q-mb-sm q-mr-sm"
                  :error="!!estudioErrors.descripcion"
                  :error-message="estudioErrors.descripcion"
                />
                <q-select
                  v-model="estudioData.tipoId"
                  :options="estudios"
                  option-value="id"
                  option-label="descripcion"
                  label="Tipo de Estudio"
                  outlined
                  dense
                  class="q-mb-sm q-mr-sm"
                  :error="!!estudioErrors.tipoId"
                  :error-message="estudioErrors.tipoId"
                />

                <q-input
                  v-model="estudioData.indicaciones"
                  label="Indicaciones"
                  type="textarea"
                  outlined
                  dense
                  class="q-mb-sm q-mr-sm"
                  :error="!!estudioErrors.indicaciones"
                  :error-message="estudioErrors.indicaciones"
                />
              </div>
              <div class="col">
                <q-input
                  v-model="estudioData.precioCosto"
                  label="Precio Costo"
                  outlined
                  dense
                  class="q-mb-sm q-mr-sm"
                  :error="!!estudioErrors.precioCosto"
                  :error-message="estudioErrors.precioCosto"
                />
                <q-input
                  v-model="estudioData.precioVenta"
                  label="Precio Venta"
                  outlined
                  dense
                  class="q-mb-sm q-mr-sm"
                  :error="!!estudioErrors.precioVenta"
                  :error-message="estudioErrors.precioVenta"
                />
                <q-checkbox
                  class="q-mb-sm q-mr-sm"
                  v-model="estudioData.facturar"
                  label="Facturar"
                  :error="!!estudioErrors.facturar"
                  :error-message="estudioErrors.facturar"
                />
                <q-select
                  v-model="estudioData.status"
                  :options="statusOptions"
                  option-value="value"
                  option-label="label"
                  label="Status"
                  emit-value
                  map-options
                  outlined
                  dense
                  class="q-mb-sm q-mr-sm"
                  :error="!!estudioErrors.status"
                  :error-message="estudioErrors.status"
                />
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
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from "vue";
import {
  useHospitalStore,
  useMedicamentoStore,
  useEstudioStore,
} from "../stores/DirectoriosStores";
import {
  useTiposMedicamentosStore,
  useTiposEstudiosStore,
} from "../stores/ConfiMedicasStores";
import {
  useDepartamentoStore,
  useMunicipioStore,
} from "../stores/DatosGeneralesStores"; // Faltaban estas importaciones

import ListadoHospitales from "./ListadoHospitales.vue";
import ListadoMedicamentos from "./ListadoMedicamentos.vue";
import ListadoExamenesEstudios from "./ListadoExamenesEstudios.vue";
import { Notify } from "quasar";
import { storeToRefs } from "pinia";

// Estado de las pestañas
const tab = ref("Hospitales");
const subTabMedicamento = ref("Info");
const subTabEstudio = ref("InfoEstudio");

// Inicializar tiendas
const hospitalStore = useHospitalStore();
const medicamentoStore = useMedicamentoStore();
const estudioStore = useEstudioStore();
const departamentoStore = useDepartamentoStore();
const municipioStore = useMunicipioStore();
const tiposMedicamentosStore = useTiposMedicamentosStore();
const tiposEstudiosStore = useTiposEstudiosStore();

// Acceso a propiedades reactivas de las tiendas
const { departamentos } = storeToRefs(departamentoStore);
const { municipios } = storeToRefs(municipioStore);
const { medicamentos } = storeToRefs(tiposMedicamentosStore);
const { estudios } = storeToRefs(tiposEstudiosStore);

// Cargar datos al montar el componente
onMounted(async () => {
  await departamentoStore.cargarDepartamentos();
  await municipioStore.cargarMunicipios();
  await tiposEstudiosStore.cargarEstudios();
  await tiposMedicamentosStore.cargarMedicamentos();
});

// Datos reactivos para los formularios
const hospitalData = reactive({
  nombre: "",
  direccion: "",
  departamentoId: null,
  municipioId: null,
  telefono: "",
  email: "",
  web: "",
});
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

// Opciones de estado
const statusOptions = [
  { label: "Disponible", value: "disponible" },
  { label: "No disponible", value: "no_disponible" },
  { label: "Pendiente", value: "pendiente" },
];

// Computed para filtrar municipios según el departamento
const filteredMunicipios = computed(() => {
  if (!hospitalData.departamentoId) return [];
  const departamentoId =
    typeof hospitalData.departamentoId === "object"
      ? hospitalData.departamentoId.id
      : hospitalData.departamentoId;

  return municipios.value.filter(
    (municipio) => municipio.departamentoId === departamentoId
  );
});

watch(
  () => hospitalData.departamentoId,
  () => {
    hospitalData.municipioId = null;
  }
);

// Errores de validación para cada formulario
const hospitalErrors = reactive({
  nombre: "",
  direccion: "",
  departamentoId: "",
  municipioId: "",
  telefono: "",
  email: "",
  web: "",
});
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

// Función para guardar hospital
const guardarHospital = async () => {
  Object.keys(hospitalErrors).forEach((key) => {
    hospitalErrors[key] = "";
  });

  if (!hospitalData.nombre) hospitalErrors.nombre = "El nombre es obligatorio.";
  if (!hospitalData.direccion)
    hospitalErrors.direccion = "La dirección es obligatoria.";
  if (!hospitalData.departamentoId)
    hospitalErrors.departamentoId = "Seleccione un departamento.";
  if (!hospitalData.municipioId)
    hospitalErrors.municipioId = "Seleccione un municipio.";
  if (!hospitalData.telefono)
    hospitalErrors.telefono = "El teléfono es obligatorio.";
  if (!hospitalData.email) hospitalErrors.email = "El email es obligatorio.";

  if (Object.values(hospitalErrors).some((error) => error)) {
    Notify.create({
      type: "negative",
      position: "top-right",
      message: "Por favor, complete todos los campos obligatorios",
    });
    return;
  }

  const departamentoId =
    typeof hospitalData.departamentoId === "object"
      ? hospitalData.departamentoId.id
      : hospitalData.departamentoId;
  const departamentoDescripcion =
    typeof hospitalData.departamentoId === "object"
      ? hospitalData.departamentoId.descripcion
      : ""; // Si no es un objeto, asigna una cadena vacía o el valor predeterminado

  const municipioId =
    typeof hospitalData.municipioId === "object"
      ? hospitalData.municipioId.id
      : hospitalData.municipioId;
  const municipioDescripcion =
    typeof hospitalData.municipioId === "object"
      ? hospitalData.municipioId.descripcion
      : ""; // Si no es un objeto, asigna una cadena vacía o el valor predeterminado

  const hospitalInfo = {
    nombre: hospitalData.nombre,
    direccion: hospitalData.direccion,
    departamento_id: departamentoId,
    departamentoDescripcion: departamentoDescripcion,

    municipio_id: municipioId,
    municipioDescripcion: municipioDescripcion,
    telefono: hospitalData.telefono,
    email: hospitalData.email,
    web: hospitalData.web,
  };

  try {
    await hospitalStore.agregarHospital(hospitalInfo);
    Notify.create({
      type: "positive",
      position: "top-right",
      message: "Hospital guardado correctamente",
    });
    Object.keys(hospitalData).forEach((key) => {
      hospitalData[key] = "";
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      position: "top-right",
      message: "Error al guardar el hospital",
    });
  }
};

// Definir la función eliminarHospital para acceder a la store
const eliminarHospital = async (id) => {
  try {
    await hospitalStore.eliminarHospital(id);
    Notify.create({
      type: "warning",
      position: "top-right",
      message: "Hospital eliminado correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar hospital:", error);
    Notify.create({
      type: "negative",
      position: "top-right",
      message: "Error al eliminar el hospital",
    });
  }
};

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

  const tipoId =
    typeof medicamentoData.tipoId === "object"
      ? medicamentoData.tipoId.id
      : medicamentoData.tipoId;

  const tipoDescripcion =
    medicamentos.value.find((medicamento) => medicamento.id === tipoId)
      ?.descripcion || ""; // Obtener tipo_descripcion basado en tipoId

  const medicamentoInfo = {
    codigo: medicamentoData.codigo,
    descripcion: medicamentoData.descripcion,
    tipoId,
    tipo_descripcion: tipoDescripcion, // Incluir tipo_descripcion en el objeto
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

// Función para guardar estudio
const guardarEstudio = async () => {
  Object.keys(estudioErrors).forEach((key) => {
    estudioErrors[key] = "";
  });

  if (!estudioData.codigo)
    estudioErrors.codigo = "El código del estudio es obligatorio.";
  if (!estudioData.descripcion)
    estudioErrors.descripcion = "La descripción es obligatoria.";
  if (!estudioData.tipoId)
    estudioErrors.tipoId = "El tipo de estudio es obligatorio.";
  if (!estudioData.precioCosto)
    estudioErrors.precioCosto = "El precio de costo es obligatorio.";
  if (!estudioData.precioVenta)
    estudioErrors.precioVenta = "El precio de venta es obligatorio.";
  if (!estudioData.indicaciones)
    estudioErrors.indicaciones = "Las indicaciones son obligatorias.";
  if (!estudioData.facturar)
    estudioErrors.facturar = "El campo facturar es obligatirio.";
  if (!estudioData.status)
    estudioErrors.status = "El campo status es obligatirio.";

  if (Object.values(estudioErrors).some((error) => error)) {
    Notify.create({
      type: "negative",
      position: "top-right",
      message: "Por favor, complete todos los campos obligatorios",
    });
    return;
  }

  const tipoId =
    typeof estudioData.tipoId === "object"
      ? estudioData.tipoId.id
      : estudioData.tipoId;

  const tipoDescripcion =
    estudios.value.find((estudio) => estudio.id === tipoId)?.descripcion || ""; // Obtener tipo_descripcion basado en tipoId

  const estudioInfo = {
    codigo: estudioData.codigo,
    descripcion: estudioData.descripcion,
    tipoId,
    tipoDescripcion, // Incluir tipoDescripcion en el objeto
    indicaciones: estudioData.indicaciones,
    precioCosto: parseFloat(estudioData.precioCosto),
    precioVenta: parseFloat(estudioData.precioVenta),
    facturar: estudioData.facturar,
    status:
      typeof estudioData.status === "object"
        ? estudioData.status.value
        : estudioData.status,
  };

  try {
    await estudioStore.agregarEstudio(estudioInfo);
    Notify.create({
      type: "positive",
      message: "Estudio guardado correctamente",
      position: "top-right",
    });
    Object.keys(estudioData).forEach((key) => {
      estudioData[key] = "";
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      position: "top-right",
      message: "Error al guardar el estudio",
    });
  }
};
</script>

<!-- <style scoped>
.q-card {
  max-width: 1100px;
  margin: 0 auto;
}
.q-tab-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.listado-componente {
  max-width: 1800px;
  width: 100%;
  margin: 50px auto;
}
.text-primary {
  color: #1976d2;
}
</style> -->

<style scoped>
.q-card {
  max-width: 1100px;
  margin: 0 auto;
}

.wide-card {
  max-width: 700px;
  width: 100%;
  margin-bottom: 50px;
}

.q-tab-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.listado-componente {
  max-width: 1800px;
  width: 100%;
  margin: 50px auto;
  margin-top: -40px;
}

.text-primary {
  color: #1976d2;
}
.formS {
  border-top-left-radius: 40px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 30px;
  border-bottom-left-radius: 25px;
}
</style>
