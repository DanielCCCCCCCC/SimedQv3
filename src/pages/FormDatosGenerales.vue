<template>
  <q-page class="q-pa-md">
    <q-tabs
      v-model="tab"
      class="bg-white text-black q-mb-sm shadow-2 rounded-borders small-tabs"
    >
      <!-- Pestañas -->
      <q-tab
        name="Departamentos y Municipios"
        icon="location_city"
        label="Departamentos y Municipios"
      />
      <q-tab name="Grupo Sanguíneo" icon="bloodtype" label="Grupo Sanguíneo" />
      <q-tab name="Escolaridad" icon="school" label="Escolaridad" />
      <q-tab name="Estado Civil" icon="favorite" label="Estado Civil" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated swipeable>
      <!-- Panel para Departamentos y Municipios -->
      <q-tab-panel name="Departamentos y Municipios">
        <div class="row">
          <div class="col-3">
            <q-list bordered>
              <q-item
                clickable
                v-ripple
                @click="subTab = 'Departamento'"
                :active="subTab === 'Departamento'"
              >
                <q-item-section>Departamento</q-item-section>
              </q-item>
              <q-item
                clickable
                v-ripple
                @click="subTab = 'Municipio'"
                :active="subTab === 'Municipio'"
              >
                <q-item-section>Municipio</q-item-section>
              </q-item>
            </q-list>
          </div>

          <div class="col-9">
            <q-tab-panels v-model="subTab" animated>
              <!-- Subpanel para Departamento -->
              <q-tab-panel name="Departamento">
                <q-card
                  class="q-pa-sm q-mt-md formS bg-grey-1 rounded shadow-2xl wide-card"
                >
                  <q-card-section class="text-h6 text-primary">
                    Departamento
                  </q-card-section>
                  <q-form
                    @submit.prevent="guardarDepartamento"
                    class="q-gutter-md"
                  >
                    <q-input
                      v-model="departamentoData.descripcion"
                      label="Descripción"
                      outlined
                      dense
                      :error="!!formErrors.departamentoDescripcion"
                      :error-message="formErrors.departamentoDescripcion"
                    />
                    <div class="row justify-end q-mt-md">
                      <q-btn
                        label="Crear Departamento"
                        color="primary"
                        icon="add"
                        @click="guardarDepartamento"
                      />
                      <q-btn
                        label="Eliminar último agregado"
                        color="negative"
                        icon="delete"
                        @click="eliminarDepartamento"
                        class="q-ml-sm"
                      />
                    </div>
                  </q-form>
                </q-card>
              </q-tab-panel>

              <!-- Subpanel para Municipio -->
              <q-tab-panel name="Municipio">
                <q-card
                  class="q-pa-sm formS q-mt-md bg-grey-1 rounded shadow-2xl wide-card"
                >
                  <q-card-section class="text-h6 text-primary">
                    Municipio
                  </q-card-section>
                  <q-form
                    @submit.prevent="guardarMunicipio"
                    class="q-gutter-md"
                  >
                    <q-select
                      v-model="municipioData.departamentoId"
                      :options="departamentos"
                      option-value="id"
                      option-label="descripcion"
                      label="Departamento"
                      outlined
                      dense
                      :error="!!formErrors.municipioDepartamento"
                      :error-message="formErrors.municipioDepartamento"
                    />
                    <q-input
                      v-model="municipioData.descripcion"
                      label="Descripción"
                      outlined
                      dense
                      :error="!!formErrors.municipioDescripcion"
                      :error-message="formErrors.municipioDescripcion"
                    />
                    <div class="row justify-end q-mt-md">
                      <q-btn
                        label="Crear Municipio"
                        color="primary"
                        icon="add"
                        @click="guardarMunicipio"
                      />
                      <q-btn
                        label="Eliminar último agregado"
                        color="negative"
                        icon="delete"
                        @click="eliminarMunicipio"
                        class="q-ml-sm"
                      />
                    </div>
                  </q-form>
                </q-card>
              </q-tab-panel>
            </q-tab-panels>
          </div>
          <ListadoMunicipios />
        </div>
      </q-tab-panel>

      <!-- Panel para Grupo Sanguíneo -->
      <q-tab-panel name="Grupo Sanguíneo">
        <q-card
          class="formS q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl wide-card"
        >
          <q-card-section class="text-h6 text-primary">
            Grupo Sanguíneo
          </q-card-section>
          <q-form @submit.prevent="guardarGrupoSanguineo" class="q-gutter-md">
            <q-input
              v-model="grupoSanguineoData.descripcion"
              label="Descripción"
              outlined
              dense
              :error="!!formErrors.grupoSanguineoDescripcion"
              :error-message="formErrors.grupoSanguineoDescripcion"
            />
            <div class="row justify-end q-mt-md">
              <q-btn
                label="Crear Grupo Sanguíneo"
                color="primary"
                icon="add"
                @click="guardarGrupoSanguineo"
              />
              <q-btn
                label="Eliminar último agregado"
                color="negative"
                icon="delete"
                @click="eliminarGrupoSanguineo"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card>
        <div>
          <ListadoGrupoSanguineo />
        </div>
      </q-tab-panel>

      <!-- Panel para Escolaridad -->
      <q-tab-panel name="Escolaridad">
        <q-card
          class="formS q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl wide-card"
        >
          <q-card-section class="text-h6 text-primary">
            Escolaridad
          </q-card-section>
          <q-form @submit.prevent="guardarEscolaridad" class="q-gutter-md">
            <q-input
              v-model="escolaridadData.descripcion"
              label="Descripción"
              outlined
              dense
              :error="!!formErrors.escolaridadDescripcion"
              :error-message="formErrors.escolaridadDescripcion"
            />
            <div class="row justify-end q-mt-md">
              <q-btn
                label="Crear Escolaridad"
                color="primary"
                icon="add"
                @click="guardarEscolaridad"
              />
              <q-btn
                label="Eliminar último agregado"
                color="negative"
                icon="delete"
                @click="eliminarEscolaridad"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card>
        <div>
          <ListadoTipoEscolaridad />
        </div>
      </q-tab-panel>

      <!-- Panel para Estado Civil -->
      <q-tab-panel name="Estado Civil">
        <q-card
          class="formS q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl wide-card"
        >
          <q-card-section class="text-h6 text-primary">
            Estado Civil
          </q-card-section>
          <q-form @submit.prevent="guardarEstadoCivil" class="q-gutter-md">
            <q-input
              v-model="estadoCivilData.descripcion"
              label="Descripción"
              outlined
              dense
              :error="!!formErrors.estadoCivilDescripcion"
              :error-message="formErrors.estadoCivilDescripcion"
            />
            <div class="row justify-end q-mt-md">
              <q-btn
                label="Crear Estado Civil"
                color="primary"
                icon="add"
                @click="guardarEstadoCivil"
              />
              <q-btn
                label="Eliminar último agregado"
                color="negative"
                icon="delete"
                @click="eliminarEstadoCivil"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card>
        <div>
          <ListadoTipoEstadoCivil />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>
<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  useDepartamentoStore,
  useMunicipioStore,
  useGrupoSanguineoStore,
  useEscolaridadStore,
  useEstadoCivilStore,
} from "../stores/DatosGeneralesStores";
import ListadoMunicipios from "./ListadoMunicipios.vue";
import ListadoGrupoSanguineo from "./ListadoGrupoSanguineo.vue";
import ListadoTipoEscolaridad from "./ListadoTipoEscolaridad.vue";
import ListadoTipoEstadoCivil from "./ListadoTipoEstadoCivil.vue";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";

// Inicializar tiendas
const departamentoStore = useDepartamentoStore();
const municipioStore = useMunicipioStore();
const grupoSanguineoStore = useGrupoSanguineoStore();
const escolaridadStore = useEscolaridadStore();
const estadoCivilStore = useEstadoCivilStore();

// Datos reactivos
const departamentoData = reactive({ descripcion: "" });
const municipioData = reactive({ descripcion: "", departamentoId: null });
const grupoSanguineoData = reactive({ descripcion: "" });
const escolaridadData = reactive({ descripcion: "" });
const estadoCivilData = reactive({ descripcion: "" });

// Referencias a los datos
const { departamentos } = storeToRefs(departamentoStore);

// Estado de los errores de validación
const formErrors = reactive({
  departamentoDescripcion: "",
  municipioDepartamento: "",
  municipioDescripcion: "",
  grupoSanguineoDescripcion: "",
  escolaridadDescripcion: "",
  estadoCivilDescripcion: "",
});

// Cargar datos al montar el componente
onMounted(() => {
  departamentoStore.cargarDepartamentos();
  grupoSanguineoStore.cargarGruposSanguineos();
  escolaridadStore.cargarEscolaridades();
  estadoCivilStore.cargarEstadosCiviles();
});

// Funciones de guardar y eliminar para cada panel
const guardarDepartamento = async () => {
  formErrors.departamentoDescripcion = "";
  if (!departamentoData.descripcion) {
    formErrors.departamentoDescripcion =
      "La descripción del departamento es obligatoria.";
    return;
  }
  try {
    await departamentoStore.agregarDepartamento(departamentoData.descripcion);
    Notify.create({
      type: "positive",
      message: "Departamento creado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al crear departamento",
      position: "top-right",
    });
  }
  departamentoData.descripcion = "";
};

const guardarMunicipio = async () => {
  formErrors.municipioDepartamento = "";
  if (!municipioData.departamentoId) {
    formErrors.municipioDepartamento = "Seleccione un departamento.";
    return;
  }

  // Extraer el `id` y `descripcion` del departamento seleccionado
  const departamentoSeleccionado = departamentos.value.find(
    (d) =>
      d.id ===
      (typeof municipioData.departamentoId === "object"
        ? municipioData.departamentoId.id
        : municipioData.departamentoId)
  );

  const departamentoId = departamentoSeleccionado?.id || null;
  const departamentoDescripcion = departamentoSeleccionado?.descripcion || "";

  try {
    await municipioStore.agregarMunicipio(
      municipioData.descripcion,
      departamentoId,
      departamentoDescripcion
    );
    Notify.create({
      type: "positive",
      message: "Municipio creado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al crear municipio",
      position: "top-right",
    });
  }

  // Limpiar los campos después de guardar
  municipioData.descripcion = "";
  municipioData.departamentoId = null;
};

const guardarGrupoSanguineo = async () => {
  formErrors.grupoSanguineoDescripcion = "";
  if (!grupoSanguineoData.descripcion) {
    formErrors.grupoSanguineoDescripcion =
      "La descripción del grupo sanguíneo es obligatoria.";
    return;
  }
  try {
    await grupoSanguineoStore.agregarGrupoSanguineo(
      grupoSanguineoData.descripcion
    );
    Notify.create({
      type: "positive",
      message: "Grupo Sanguíneo creado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al crear grupo sanguíneo",
      position: "top-right",
    });
  }
  grupoSanguineoData.descripcion = "";
};

const guardarEscolaridad = async () => {
  formErrors.escolaridadDescripcion = "";
  if (!escolaridadData.descripcion) {
    formErrors.escolaridadDescripcion =
      "La descripción de escolaridad es obligatoria.";
    return;
  }
  try {
    await escolaridadStore.agregarEscolaridad(escolaridadData.descripcion);
    Notify.create({
      type: "positive",
      message: "Escolaridad creada exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al crear escolaridad",
      position: "top-right",
    });
  }
  escolaridadData.descripcion = "";
};

const guardarEstadoCivil = async () => {
  formErrors.estadoCivilDescripcion = "";
  if (!estadoCivilData.descripcion) {
    formErrors.estadoCivilDescripcion =
      "La descripción del estado civil es obligatoria.";
    return;
  }
  try {
    await estadoCivilStore.agregarEstadoCivil(estadoCivilData.descripcion);
    Notify.create({
      type: "positive",
      message: "Estado Civil creado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al crear estado civil",
      position: "top-right",
    });
  }
  estadoCivilData.descripcion = "";
};

// Funciones para eliminar el último agregado
const eliminarDepartamento = async () => {
  try {
    await departamentoStore.eliminarUltimoDepartamento();
    Notify.create({
      type: "positive",
      message: "Departamento eliminado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar departamento",
      position: "top-right",
    });
  }
};

const eliminarMunicipio = async () => {
  try {
    await municipioStore.eliminarUltimoMunicipio();
    Notify.create({
      type: "positive",
      message: "Municipio eliminado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar municipio",
      position: "top-right",
    });
  }
};

const eliminarGrupoSanguineo = async () => {
  try {
    await grupoSanguineoStore.eliminarUltimoGrupoSanguineo();
    Notify.create({
      type: "positive",
      message: "Grupo Sanguíneo eliminado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar grupo sanguíneo",
      position: "top-right",
    });
  }
};

const eliminarEscolaridad = async () => {
  try {
    await escolaridadStore.eliminarUltimaEscolaridad();
    Notify.create({
      type: "positive",
      message: "Escolaridad eliminada exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar escolaridad",
      position: "top-right",
    });
  }
};

const eliminarEstadoCivil = async () => {
  try {
    await estadoCivilStore.eliminarUltimoEstadoCivil();
    Notify.create({
      type: "positive",
      message: "Estado Civil eliminado exitosamente",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar estado civil",
      position: "top-right",
    });
  }
};

// Tabs de control
const tab = ref("Departamentos y Municipios");
const subTab = ref("Departamento");
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
</style>
