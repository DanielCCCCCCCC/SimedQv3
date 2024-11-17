<template>
  <q-page class="q-pa-md">
    <!-- Barra de navegación de pestañas -->
    <q-tabs
      v-model="tab"
      class="bg-white text-black q-mb-sm shadow-2 rounded-borders small-tabs"
    >
      <q-tab
        name="Especialidades Médicas"
        icon="medical_services"
        label="Especialidades Médicas"
      />
      <q-tab
        name="Tipos de Estudios"
        icon="description"
        label="Tipos de Estudios"
      />
      <q-tab
        name="Tipos de Medicamentos"
        icon="medication"
        label="Tipos de Medicamentos"
      />
      <q-tab
        name="Tipos de Pacientes"
        icon="people"
        label="Tipos de Pacientes"
      />
      <q-tab
        name="Grupos de Contactos"
        icon="group"
        label="Grupos de Contactos"
      />
      <q-tab name="Tipos de Citas" icon="event" label="Tipos de Citas" />
    </q-tabs>

    <q-tab-panels v-model="tab" animated swipeable>
      <!-- Panel para Especialidades Médicas -->
      <q-tab-panel name="Especialidades Médicas">
        <q-card
          class="q-pa-sm q-mt-md formS bg-grey-1 rounded shadow-2xl wide-card"
        >
          <q-card-section class="text-h6 text-primary"
            >Especialidades Médicas</q-card-section
          >
          <q-form @submit.prevent="guardarEspecialidad" class="q-gutter-md">
            <q-input
              v-model="especialidadData.descripcion"
              label="Descripción"
              outlined
              dense
            />
            <div class="row justify-end q-mt-md">
              <q-btn
                label="Crear"
                color="primary"
                icon="add"
                @click="guardarEspecialidad"
              />
              <q-btn
                label="Eliminar"
                color="negative"
                icon="delete"
                @click="eliminarEspecialidad"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card>
        <div>
          <ListadoEspecialidadesMedicas />
        </div>
      </q-tab-panel>

      <!-- Panel para Tipos de Estudios -->
      <q-tab-panel name="Tipos de Estudios">
        <q-card
          class="q-pa-sm q-mt-md bg-grey-1 formS rounded shadow-2xl wide-card"
        >
          <q-card-section class="text-h6 text-primary"
            >Tipos de Estudios</q-card-section
          >
          <q-form @submit.prevent="guardarEstudio" class="q-gutter-md">
            <q-input
              v-model="estudioData.descripcion"
              label="Descripción"
              outlined
              dense
            />
            <div class="row justify-end q-mt-md">
              <q-btn
                label="Crear"
                color="primary"
                icon="add"
                @click="guardarEstudio"
              />
              <q-btn
                label="Eliminar"
                color="negative"
                icon="delete"
                @click="eliminarEstudio"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card>
        <div>
          <ListadoTiposEstudios />
        </div>
      </q-tab-panel>

      <!-- Panel para Tipos de Medicamentos -->
      <q-tab-panel name="Tipos de Medicamentos">
        <q-card
          class="q-pa-sm q-mt-md bg-grey-1 formS rounded shadow-2xl wide-card"
        >
          <q-card-section class="text-h6 text-primary"
            >Tipos de Medicamentos</q-card-section
          >
          <q-form @submit.prevent="guardarMedicamento" class="q-gutter-md">
            <q-input
              v-model="medicamentoData.descripcion"
              label="Descripción"
              outlined
              dense
            />
            <div class="row justify-end q-mt-md">
              <q-btn
                label="Crear"
                color="primary"
                icon="add"
                @click="guardarMedicamento"
              />
              <q-btn
                label="Eliminar"
                color="negative"
                icon="delete"
                @click="eliminarMedicamento"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card>
        <div>
          <ListadoTiposMedicamentos />
        </div>
      </q-tab-panel>

      <!-- Panel para Tipos de Pacientes -->
      <q-tab-panel name="Tipos de Pacientes">
        <q-card
          class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl formS wide-card"
        >
          <q-card-section class="text-h6 text-primary"
            >Tipos de Pacientes</q-card-section
          >
          <q-form @submit.prevent="guardarPaciente" class="q-gutter-md">
            <q-input
              v-model="pacienteData.descripcion"
              label="Descripción"
              outlined
              dense
            />
            <div class="row justify-end q-mt-md">
              <q-btn
                label="Crear"
                color="primary"
                icon="add"
                @click="guardarPaciente"
              />
              <q-btn
                label="Eliminar"
                color="negative"
                icon="delete"
                @click="eliminarPaciente"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card>
        <div>
          <ListadoTipoPacientes />
        </div>
      </q-tab-panel>

      <!-- Panel para Grupos de Contactos -->
      <q-tab-panel name="Grupos de Contactos">
        <q-card
          class="q-pa-sm q-mt-md bg-grey-1 rounded formS shadow-2xl wide-card"
        >
          <q-card-section class="text-h6 text-primary"
            >Grupos de Contactos</q-card-section
          >
          <q-form @submit.prevent="guardarGrupoContacto" class="q-gutter-md">
            <q-input
              v-model="grupoContactoData.descripcion"
              label="Descripción"
              outlined
              dense
            />
            <div class="row justify-end q-mt-md">
              <q-btn
                label="Crear"
                color="primary"
                icon="add"
                @click="guardarGrupoContacto"
              />
              <q-btn
                label="Eliminar"
                color="negative"
                icon="delete"
                @click="eliminarGrupoContacto"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card>
        <ListadoGruposContactos />
      </q-tab-panel>

      <!-- Panel para Tipos de Citas -->
      <q-tab-panel name="Tipos de Citas">
        <q-card
          class="q-pa-sm q-mt-md bg-grey-1 rounded formS shadow-2xl wide-card"
        >
          <q-card-section class="text-h6 text-primary"
            >Tipos de Citas</q-card-section
          >
          <q-form @submit.prevent="guardarCita" class="q-gutter-md">
            <q-input
              v-model="citaData.descripcion"
              label="Descripción"
              outlined
              dense
            />
            <div class="row justify-end q-mt-md">
              <q-btn
                label="Crear"
                color="primary"
                icon="add"
                @click="guardarCita"
              />
              <q-btn
                label="Eliminar"
                color="negative"
                icon="delete"
                @click="eliminarCita"
                class="q-ml-sm"
              />
            </div>
          </q-form>
        </q-card>
        <div>
          <ListadoTiposCitas />
        </div>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { Notify } from "quasar";
import ListadoEspecialidadesMedicas from "./ListadoEspecialidadesMedicas.vue";
import ListadoTiposEstudios from "./ListadoTiposEstudios.vue";
import ListadoTiposMedicamentos from "./ListadoTiposMedicamentos.vue";
import ListadoTipoPacientes from "./ListadoTipoPacientes.vue";
import ListadoGruposContactos from "./ListadoGruposContactos.vue";
import ListadoTiposCitas from "./ListadoTiposCitas.vue";

// Estado para las pestañas activas
const tab = ref("Especialidades Médicas");

// Función de validación genérica
const validarCampo = (data, campo) => {
  return data[campo].trim() ? "" : `El campo ${campo} es obligatorio.`;
};

// Especialidades Médicas
import { useEspecialidadMedicaStore } from "../stores/ConfiMedicasStores";
const especialidadData = ref({ descripcion: "" });
const especialidadStore = useEspecialidadMedicaStore();

const guardarEspecialidad = async () => {
  const error = validarCampo(especialidadData.value, "descripcion");
  if (error) {
    Notify.create({ message: error, color: "negative", position: "top-right" });
    return;
  }
  await especialidadStore.agregarEspecialidad(
    especialidadData.value.descripcion
  );
  especialidadData.value.descripcion = "";
  Notify.create({
    message: "Especialidad guardada exitosamente",
    color: "positive",
    position: "top-right",
  });
};

const eliminarEspecialidad = async () => {
  await especialidadStore.eliminarUltimaEspecialidad();
  Notify.create({
    message: "Última especialidad eliminada",
    color: "warning",
    position: "top-right",
  });
};

// Tipos de Estudios
import { useTiposEstudiosStore } from "../stores/ConfiMedicasStores";
const estudioData = ref({ descripcion: "" });
const tiposEstudiosStore = useTiposEstudiosStore();

const guardarEstudio = async () => {
  const error = validarCampo(estudioData.value, "descripcion");
  if (error) {
    Notify.create({ message: error, color: "negative", position: "top-right" });
    return;
  }
  await tiposEstudiosStore.agregarEstudio(estudioData.value.descripcion);
  estudioData.value.descripcion = "";
  Notify.create({
    message: "Tipo de estudio guardado exitosamente",
    color: "positive",
    position: "top-right",
  });
};

const eliminarEstudio = async () => {
  await tiposEstudiosStore.eliminarUltimoEstudio();
  Notify.create({
    message: "Último tipo de estudio eliminado",
    color: "warning",
    position: "top-right",
  });
};

// Tipos de Medicamentos
import { useTiposMedicamentosStore } from "../stores/ConfiMedicasStores";
const medicamentoData = ref({ descripcion: "" });
const tiposMedicamentosStore = useTiposMedicamentosStore();

const guardarMedicamento = async () => {
  const error = validarCampo(medicamentoData.value, "descripcion");
  if (error) {
    Notify.create({ message: error, color: "negative", position: "top-right" });
    return;
  }
  await tiposMedicamentosStore.agregarMedicamento(
    medicamentoData.value.descripcion
  );
  medicamentoData.value.descripcion = "";
  Notify.create({
    message: "Tipo de medicamento guardado exitosamente",
    color: "positive",
    position: "top-right",
  });
};

const eliminarMedicamento = async () => {
  await tiposMedicamentosStore.eliminarUltimoMedicamento();
  Notify.create({
    message: "Último tipo de medicamento eliminado",
    color: "warning",
    position: "top-right",
  });
};

// Tipos de Pacientes
import { useTiposPacientesStore } from "../stores/ConfiMedicasStores";
const pacienteData = ref({ descripcion: "" });
const tiposPacientesStore = useTiposPacientesStore();

const guardarPaciente = async () => {
  const error = validarCampo(pacienteData.value, "descripcion");
  if (error) {
    Notify.create({ message: error, color: "negative", position: "top-right" });
    return;
  }
  await tiposPacientesStore.agregarPaciente(pacienteData.value.descripcion);
  pacienteData.value.descripcion = "";
  Notify.create({
    message: "Tipo de paciente guardado exitosamente",
    color: "positive",
    position: "top-right",
  });
};

const eliminarPaciente = async () => {
  await tiposPacientesStore.eliminarUltimoPaciente();
  Notify.create({
    message: "Último tipo de paciente eliminado",
    color: "warning",
    position: "top-right",
  });
};

// Grupos de Contactos
import { useGruposContactosStore } from "../stores/ConfiMedicasStores";
const grupoContactoData = ref({ descripcion: "" });
const gruposContactosStore = useGruposContactosStore();

const guardarGrupoContacto = async () => {
  const error = validarCampo(grupoContactoData.value, "descripcion");
  if (error) {
    Notify.create({ message: error, color: "negative", position: "top-right" });
    return;
  }
  await gruposContactosStore.agregarGrupo(grupoContactoData.value.descripcion);
  grupoContactoData.value.descripcion = "";
  Notify.create({
    message: "Grupo de contacto guardado exitosamente",
    color: "positive",
    position: "top-right",
  });
};

const eliminarGrupoContacto = async () => {
  await gruposContactosStore.eliminarUltimoGrupo();
  Notify.create({
    message: "Último grupo de contacto eliminado",
    color: "warning",
    position: "top-right",
  });
};

// Tipos de Citas
import { useTiposCitasStore } from "../stores/ConfiMedicasStores";
// import ListadoTiposEstudios from "./ListadoTiposEstudios.vue";
const citaData = ref({ descripcion: "" });
const tiposCitasStore = useTiposCitasStore();

const guardarCita = async () => {
  const error = validarCampo(citaData.value, "descripcion");
  if (error) {
    Notify.create({ message: error, color: "negative", position: "top-right" });
    return;
  }
  await tiposCitasStore.agregarCita(citaData.value.descripcion);
  citaData.value.descripcion = "";
  Notify.create({
    message: "Tipo de cita guardado exitosamente",
    color: "positive",
    position: "top-right",
  });
};

const eliminarCita = async () => {
  await tiposCitasStore.eliminarUltimaCita();
  Notify.create({
    message: "Último tipo de cita eliminado",
    color: "warning",
    position: "top-right",
  });
};
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
