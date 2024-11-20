<template>
  <q-page class="q-pa-md flex flex-center">
    <q-form
      class="bg-grey-2 shadow-2 q-pa-md rounded-xl formS"
      style="max-width: 600px; width: 100%"
      @submit.prevent="guardarContacto"
    >
      <h1 class="text-h4 text-sky-500 text-center q-mb-md uppercase">
        {{ isEditMode ? "Editar Contacto" : "Agregar Contacto" }}
      </h1>

      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-3 flex flex-center">
          <q-avatar color="blue" size="96px" class="form-avatar">
            <q-icon name="person" size="48px" />
          </q-avatar>
        </div>
        <div class="col-12 col-md-9">
          <q-input
            v-model="formData.nombreContacto"
            label="Nombre"
            outlined
            dense
          />
          <q-input
            v-model="formData.direccionContacto"
            label="Dirección"
            outlined
            dense
          />
        </div>
      </div>

      <div class="row q-mt-sm q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-select
            v-model="formData.grupoIdContacto"
            :options="grupos"
            label="Grupo"
            option-value="id"
            option-label="descripcion"
            outlined
            dense
          />
          <div class="col-12 col-md-6">
            <q-input
              v-model="formData.organizacionContacto"
              label="Organizacion"
              outlined
              dense
            />
          </div>
        </div>

        <div class="col-12 col-md-6">
          <q-select
            v-model="formData.departamentoIdContacto"
            :options="departamentos"
            label="Departamento"
            option-value="id"
            option-label="descripcion"
            outlined
            dense
            @update:model-value="onDepartamentoChange"
          />
          <q-select
            v-model="formData.municipioIdContacto"
            :options="filteredMunicipios"
            label="Municipio"
            option-value="id"
            option-label="descripcion"
            outlined
            dense
            :disable="!formData.departamentoIdContacto"
          />
        </div>
      </div>

      <div class="row q-col-gutter-sm">
        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.emailContacto"
            label="Email"
            type="email"
            outlined
            dense
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.telefonoCasaContacto"
            label="Teléfono Casa"
            outlined
            mask="####-####"
            dense
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.observacionContacto"
            label="Observacion"
            outlined
            type="textarea"
            dense
          />
        </div>
        <div class="col-12 col-md-6">
          <q-input
            v-model="formData.telefonoPersonalContacto"
            label="Teléfono Personal"
            outlined
            mask="####-####"
            dense
          />
        </div>
      </div>

      <div class="flex justify-center q-mt-sm">
        <q-btn
          :label="isEditMode ? 'Actualizar Contacto' : 'Guardar Contacto'"
          color="primary"
          type="submit"
          class="full-width"
        />
      </div>
    </q-form>
    <div class="dataG">
      <ListadoContactos @editarContacto="cargarContactoParaEditar" />
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  useDepartamentoStore,
  useMunicipioStore,
} from "../stores/DatosGeneralesStores";
import { useGruposContactosStore } from "../stores/ConfiMedicasStores";
import { useContactStore } from "../stores/ContacStores";
import ListadoContactos from "./ListadoContactos.vue";
import { Notify } from "quasar";
import { storeToRefs } from "pinia";

// Tiendas
const departamentoStore = useDepartamentoStore();
const municipioStore = useMunicipioStore();
const contactStore = useContactStore();
const gruposContactosStore = useGruposContactosStore();

const { grupos } = storeToRefs(gruposContactosStore);
const { departamentos } = storeToRefs(departamentoStore);
const { municipios } = storeToRefs(municipioStore);

onMounted(async () => {
  await gruposContactosStore.cargarGrupos();
  await departamentoStore.cargarDepartamentos();
  await municipioStore.cargarMunicipios();

  // Depuración inicial para verificar datos cargados
  console.log("Departamentos cargados:", departamentos.value);
  console.log("Municipios cargados:", municipios.value);
});

// Datos del formulario
const formData = ref({
  nombreContacto: "",
  direccionContacto: "",
  organizacionContacto: "",
  grupoIdContacto: null,
  departamentoIdContacto: null,
  municipioIdContacto: null,
  emailContacto: "",
  telefonoCasaContacto: "",
  telefonoPersonalContacto: "",
  observacionContacto: "",
});
const isEditing = ref(false);
let selectedContactoId = null;

function cargarContactoParaEditar(contacto) {
  console.log("Datos del contacto recibidos para edición:", contacto);
  // Convertir especialidadId a número

  // Encontrar el grupo
  const grupo = grupos.value.find((grp) => grp.id === contacto.grupoIdContacto);

  // Encontrar el departamento
  const departamento = departamentos.value.find(
    (dept) => dept.id === contacto.departamentoIdContacto
  );

  // Actualizar los municipios filtrados
  if (departamento) {
    onDepartamentoChange(departamento);
  }

  // Encontrar el municipio (después de actualizar los municipios filtrados)
  const municipio = filteredMunicipios.value.find(
    (mun) => mun.id === contacto.municipioIdContacto
  );

  // Actualizar el formulario
  formData.value = {
    nombreContacto: contacto.nombreContacto,
    direccionContacto: contacto.direccionContacto,
    organizacionContacto: contacto.organizacionContacto,
    grupoIdContacto: grupo ? grupo : null,
    departamentoIdContacto: departamento ? departamento : null,
    municipioIdContacto: municipio ? municipio : null,
    emailContacto: contacto.emailContacto,
    telefonoCasaContacto: contacto.telefonoCasaContacto,
    telefonoPersonalContacto: contacto.telefonoPersonalContacto,
    observacionContacto: contacto.observacionContacto,
  };
  console.log("Grupo ID en contacto:", contacto.grupoIdContacto);
  console.log("Lista de grupos:", grupos.value);

  console.log("Municipio ID en contacto:", contacto.municipioIdContacto);
  console.log("Lista de municipios filtrados:", filteredMunicipios.value);

  // console.log("Datos del formulario con información cargada:", formData.value);

  selectedContactId = contacto.id;
  isEditMode.value = true;
}

// Computed para filtrar los municipios según el departamento seleccionado
const filteredMunicipios = computed(() => {
  if (!formData.value.departamentoIdContacto) return [];
  const result = municipios.value.filter(
    (municipio) =>
      municipio.departamentoId === formData.value.departamentoIdContacto.id
  );
  console.log("Municipios filtrados:", result);
  return result;
});

// Manejar el cambio de departamento
function onDepartamentoChange(departamento) {
  console.log("Departamento seleccionado:", departamento);
  formData.value.departamentoIdContacto = departamento;
  formData.value.municipioIdContacto = null; // Resetear el municipio al cambiar de departamento

  // Filtrar los municipios correspondientes al departamento seleccionado
  filteredMunicipios.value = municipios.value.filter(
    (municipio) => municipio.departamentoId === departamento.id
  );
}

// Modo edición
const isEditMode = ref(false);
let selectedContactId = null;

// Guardar o actualizar contacto
async function guardarContacto() {
  const contactoData = {
    ...formData.value,
    grupoIdContacto: formData.value.grupoIdContacto?.id,
    departamentoIdContacto: formData.value.departamentoIdContacto?.id,
    municipioIdContacto: formData.value.municipioIdContacto?.id,
  };

  console.log("Datos de contacto a guardar:", contactoData);

  try {
    if (isEditMode.value) {
      await contactStore.actualizarContacto({
        id: selectedContactId,
        ...contactoData,
      });
      Notify.create({
        message: "Contacto actualizado exitosamente",
        color: "positive",
        position: "top-right",
      });
    } else {
      await contactStore.agregarContacto(contactoData);
      Notify.create({
        message: "Contacto guardado exitosamente",
        color: "positive",
        position: "top-right",
      });
    }
    resetFormulario();
  } catch (error) {
    console.error("Error al guardar contacto:", error);
    Notify.create({
      message: "Hubo un error al guardar el contacto",
      color: "negative",
      position: "top-right",
    });
  }
}

// Resetear formulario
function resetFormulario() {
  formData.value = {
    nombreContacto: "",
    direccionContacto: "",
    organizacionContacto: "",

    grupoIdContacto: null,
    departamentoIdContacto: null,
    municipioIdContacto: null,
    emailContacto: "",
    telefonoCasaContacto: "",
    telefonoPersonalContacto: "",
    observacionContacto: "",
  };
  isEditMode.value = false;
  selectedContactId = null;
}
</script>

<style scoped>
.formS {
  border-radius: 20px;
}

.q-mb-sm {
  margin-bottom: 1em;
}

.dataG {
  margin-top: -20px;
}
.formS {
  border-top-left-radius: 40px;
  border-top-right-radius: 15px;
  border-bottom-right-radius: 40px;
  border-bottom-left-radius: 25px;
}
</style>
