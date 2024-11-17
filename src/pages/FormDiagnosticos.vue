<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="tab"
      class="bg-white text-black q-mb-sm shadow-2 rounded-borders small-tabs"
    >
      <q-tab
        name="ClasificacionDiagnosticos"
        icon="list"
        label="Clasificación de Diagnósticos"
      />
      <q-tab name="Diagnosticos" icon="assignment" label="Diagnósticos" />
      <q-tab
        name="ControlesMedicion"
        icon="bar_chart"
        label="Controles de Medición"
      />
    </q-tabs>

    <q-tab-panels v-model="tab" animated swipeable>
      <!-- Pestaña: Clasificación de Diagnósticos -->
      <q-tab-panel name="ClasificacionDiagnosticos">
        <q-col cols="3">
          <q-card class="q-pa-sm bg-grey-1 formS rounded shadow-2xl wide-card">
            <q-card-section class="text-h6 text-primary">
              Clasificación de Diagnósticos
            </q-card-section>
            <q-form @submit.prevent="guardarClasificacion" class="q-gutter-md">
              <q-input
                v-model="clasificacionData.nombre"
                label="Nombre"
                outlined
                dense
                :error="!!formErrors.clasificacionNombre"
                :error-message="formErrors.clasificacionNombre"
              />
              <div class="row justify-end q-mt-md">
                <q-btn
                  label="Crear"
                  color="primary"
                  icon="add"
                  @click="guardarClasificacion"
                />
                <q-btn
                  label="Eliminar último agregado"
                  color="negative"
                  icon="delete"
                  @click="eliminarUltimaClasificacion"
                  class="q-ml-sm"
                />
              </div>
            </q-form>
          </q-card>
          <div>
            <ListadoClasificacionDiagnostico />
          </div>
        </q-col>
      </q-tab-panel>

      <!-- Pestaña: Diagnósticos -->
      <q-tab-panel name="Diagnosticos">
        <q-col cols="3">
          <q-card class="q-pa-sm bg-grey-1 formS rounded shadow-2xl">
            <q-card-section class="text-h6 text-primary"
              >Diagnósticos</q-card-section
            >
            <q-form @submit.prevent="guardarDiagnostico" class="q-gutter-md">
              <q-input
                v-model="diagnosticoData.descripcion"
                label="Descripción"
                outlined
                dense
                :error="!!formErrors.diagnosticoDescripcion"
                :error-message="formErrors.diagnosticoDescripcion"
              />
              <q-select
                v-model="diagnosticoData.clasificacion"
                :options="opcionesClasificaciones"
                option-value="id"
                option-label="label"
                label="Clasificación"
                outlined
                dense
                :error="!!formErrors.diagnosticoClasificacion"
                :error-message="formErrors.diagnosticoClasificacion"
              />
              <div class="row justify-end q-mt-md q-ml-xl q-mr-xl">
                <q-btn
                  label="Crear"
                  color="primary"
                  icon="add"
                  @click="guardarDiagnostico"
                  class="q-mr-sm"
                />
                <q-btn
                  label="Eliminar último agregado"
                  color="negative"
                  icon="delete"
                  @click="eliminarUltimoDiagnostico"
                />
              </div>
            </q-form>
          </q-card>
        </q-col>
        <q-col cols="9">
          <div>
            <ListadoDiagnosticos />
          </div>
        </q-col>
      </q-tab-panel>

      <!-- Pestaña: Controles de Medición -->
      <q-tab-panel name="ControlesMedicion">
        <q-col cols="3">
          <q-card class="q-pa-sm formS bg-grey-1 rounded shadow-2xl">
            <q-card-section class="text-h6 text-primary"
              >Controles de Medición</q-card-section
            >
            <q-form @submit.prevent="guardarControl" class="q-gutter-md">
              <q-input
                v-model="controlData.descripcion"
                label="Descripción"
                outlined
                dense
                :error="!!formErrors.controlDescripcion"
                :error-message="formErrors.controlDescripcion"
              />
              <div class="row justify-end q-mt-md q-ml-xl q-mr-xl">
                <q-btn
                  label="Crear"
                  color="primary"
                  icon="add"
                  @click="guardarControl"
                />
                <q-btn
                  label="Eliminar último agregado"
                  color="negative"
                  icon="delete"
                  @click="eliminarUltimoControl"
                  class="q-ml-sm"
                />
              </div>
            </q-form>
          </q-card>
        </q-col>
        <q-col cols="9">
          <div>
            <!-- <q-card class="q-pa-md t bg-grey-1 rounded shadow-2xl"> -->
            <ListadoControlMedicion />
            <!-- </q-card> -->
          </div>
        </q-col>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import { Notify } from "quasar";
import {
  useClasificacionDiagnosticosStore,
  useDiagnosticosStore,
  useControlesMedicionStore,
} from "../stores/DiagnosticosStores";
import { storeToRefs } from "pinia";
import ListadoClasificacionDiagnostico from "./ListadoClasificacionDiagnostico.vue";
import ListadoDiagnosticos from "./ListadoDiagnosticos.vue";
import ListadoControlMedicion from "./ListadoControlMedicion.vue";

// Inicializar tiendas
const clasificacionDiagnosticosStore = useClasificacionDiagnosticosStore();
const diagnosticosStore = useDiagnosticosStore();
const controlesMedicionStore = useControlesMedicionStore();

// Datos reactivos
const clasificacionData = reactive({ nombre: "" });
const diagnosticoData = reactive({ descripcion: "", clasificacion: null });
const controlData = reactive({ descripcion: "" });

// Referencias a los datos de la tienda
const { clasificaciones } = storeToRefs(clasificacionDiagnosticosStore);

// Opciones de clasificación para el select
const opcionesClasificaciones = computed(() =>
  clasificaciones.value.map((clasificacion) => ({
    label: clasificacion.nombre,
    id: clasificacion.id,
  }))
);

// Estado de los errores de validación
const formErrors = reactive({
  clasificacionNombre: "",
  diagnosticoDescripcion: "",
  diagnosticoClasificacion: "",
  controlDescripcion: "",
});

// Cargar datos al montar el componente
onMounted(() => {
  clasificacionDiagnosticosStore.cargarClasificaciones();
  diagnosticosStore.cargarDiagnosticos();
  controlesMedicionStore.cargarControles();
});

// Funciones de guardar y eliminar
const guardarClasificacion = () => {
  formErrors.clasificacionNombre = "";
  if (!clasificacionData.nombre) {
    formErrors.clasificacionNombre =
      "El nombre de la clasificación es obligatorio.";
    return;
  }
  clasificacionDiagnosticosStore.agregarClasificacion(clasificacionData.nombre);
  clasificacionData.nombre = ""; // Limpiar campo
  Notify.create({
    message: "Clasificación guardada",
    position: "top-right",
    color: "positive",
  });
};

const guardarDiagnostico = async () => {
  formErrors.diagnosticoDescripcion = "";
  formErrors.diagnosticoClasificacion = "";

  if (!diagnosticoData.descripcion) {
    formErrors.diagnosticoDescripcion =
      "La descripción del diagnóstico es obligatoria.";
    return;
  }

  if (!diagnosticoData.clasificacion) {
    formErrors.diagnosticoClasificacion = "Seleccione una clasificación.";
    return;
  }

  const clasificacionSeleccionada = opcionesClasificaciones.value.find(
    (clasificacion) =>
      clasificacion.id === Number(diagnosticoData.clasificacion)
  );

  try {
    await diagnosticosStore.agregarDiagnostico(
      diagnosticoData.descripcion,
      diagnosticoData.clasificacion,
      clasificacionSeleccionada.label
    );
    diagnosticoData.descripcion = "";
    diagnosticoData.clasificacion = null;
    Notify.create({
      message: "Diagnóstico guardado",
      color: "positive",
      position: "top-right",
    });
  } catch (err) {
    console.error("Error al guardar diagnóstico:", err);
    Notify.create({
      type: "negative",
      message: "Error al guardar el diagnóstico",
      position: "top-right",
    });
  }
};

const guardarControl = () => {
  formErrors.controlDescripcion = "";
  if (!controlData.descripcion) {
    formErrors.controlDescripcion =
      "La descripción del control es obligatoria.";
    return;
  }
  controlesMedicionStore.agregarControl(controlData.descripcion);
  controlData.descripcion = ""; // Limpiar campo
  Notify.create({
    message: "Control guardado",
    position: "top-right",
    color: "positive",
  });
};

// Funciones para eliminar el último elemento
const eliminarUltimaClasificacion = () =>
  clasificacionDiagnosticosStore.eliminarUltimaClasificacion();
const eliminarUltimoDiagnostico = () =>
  diagnosticosStore.eliminarUltimoDiagnostico();
const eliminarUltimoControl = () =>
  controlesMedicionStore.eliminarUltimoControl();

// Tabs de control
const tab = ref("ClasificacionDiagnosticos");
</script>

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
.t {
  margin-top: 25px;
}
</style>
