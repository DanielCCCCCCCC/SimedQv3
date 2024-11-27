<!-- src/components/contactsForm.vue -->
<template>
  <q-page class="q-pa-md flex flex-center">
    <q-card class="shadow-2 rounded-borders form-card">
      <q-card-section>
        <div class="q-mb-md flex justify-between items-center">
          <h2 class="text-h4 text-primary">
            {{ isEditMode ? "Editar Contacto" : "Agregar Contacto" }}
          </h2>
          <q-btn
            label="Volver al Listado"
            color="secondary"
            icon="arrow_back"
            flat
            @click="volverAlListado"
          />
        </div>

        <q-form @submit.prevent="guardarcontact">
          <div class="row q-col-gutter-md">
            <!-- Información Personal -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="formData.nombreContacto"
                label="Nombre"
                outlined
                dense
                required
                class="q-mb-md"
              />
              <q-input
                v-model="formData.direccionContacto"
                label="Dirección"
                outlined
                dense
                required
                class="q-mb-md"
              />
              <q-select
                v-model="formData.grupoIdContacto"
                :options="grupos"
                label="Grupo"
                option-value="id"
                option-label="descripcion"
                outlined
                dense
                required
                class="q-mb-md"
              />
              <q-input
                v-model="formData.organizacionContacto"
                label="Organización"
                outlined
                dense
                class="q-mb-md"
              />
            </div>

            <!-- Información de Ubicación -->
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
                required
                class="q-mb-md"
                :error="!!formErrors.departamentoIdContacto"
                :error-message="formErrors.departamentoIdContacto"
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
                required
                class="q-mb-md"
                :error="!!formErrors.municipioIdContacto"
                :error-message="formErrors.municipioIdContacto"
              />
              <q-input
                v-model="formData.emailContacto"
                label="Email"
                type="email"
                outlined
                dense
                required
                class="q-mb-md"
                :error="!!formErrors.emailContacto"
                :error-message="formErrors.emailContacto"
              />
            </div>
          </div>

          <div class="row q-col-gutter-md">
            <!-- Información de Contacto -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="formData.telefonoCasaContacto"
                label="Teléfono Casa"
                outlined
                mask="####-####"
                dense
                class="q-mb-md"
                :error="!!formErrors.telefonoCasaContacto"
                :error-message="formErrors.telefonoCasaContacto"
              />
              <q-input
                v-model="formData.telefonoPersonalContacto"
                label="Teléfono Personal"
                outlined
                mask="####-####"
                dense
                class="q-mb-md"
                :error="!!formErrors.telefonoPersonalContacto"
                :error-message="formErrors.telefonoPersonalContacto"
              />
            </div>

            <!-- Observaciones -->
            <div class="col-12 col-md-6">
              <q-input
                v-model="formData.observacionContacto"
                label="Observación"
                outlined
                type="textarea"
                dense
                class="q-mb-md"
                counter
                maxlength="500"
              />
            </div>
          </div>

          <div class="flex justify-center q-mt-lg">
            <q-btn
              :label="isEditMode ? 'Actualizar Contacto' : 'Guardar Contacto'"
              color="primary"
              type="submit"
              class="full-width"
              unelevated
              rounded
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import {
  useDepartamentoStore,
  useMunicipioStore,
} from "../stores/DatosGeneralesStores";
import { useGruposContactosStore } from "../stores/ConfiMedicasStores";
import { useContactStore } from "../stores/ContacStores";
import { Notify } from "quasar";
import { storeToRefs } from "pinia";

const route = useRoute();
const router = useRouter();

// Tiendas
const departamentoStore = useDepartamentoStore();
const municipioStore = useMunicipioStore();
const contactStore = useContactStore();
const gruposContactosStore = useGruposContactosStore();

const { grupos } = storeToRefs(gruposContactosStore);
const { departamentos } = storeToRefs(departamentoStore);
const { municipios } = storeToRefs(municipioStore);

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

// Manejo de errores (puedes implementar validaciones más robustas)
const formErrors = ref({});

// Modo edición
const isEditMode = ref(false);
const contactId = route.params.id || null;

// Computed para filtrar los municipios según el departamento seleccionado
const filteredMunicipios = computed(() => {
  const deptId = Number(formData.value.departamentoIdContacto);
  if (!deptId) return [];
  return municipios.value.filter(
    (municipio) => Number(municipio.departamentoId) === deptId
  );
});

// Manejar el cambio de departamento
function onDepartamentoChange(departamentoId) {
  formData.value.departamentoIdContacto = departamentoId;
  formData.value.municipioIdContacto = null; // Resetear el municipio al cambiar de departamento
}

// Watchers para depuración (opcional)
watch(
  () => formData.value.departamentoIdContacto,
  (newVal) => {
    console.log("Departamento seleccionado:", newVal);
  }
);

watch(filteredMunicipios, (newVal) => {
  console.log("Municipios filtrados:", newVal);
});

// Cargar datos del médico si es edición
onMounted(async () => {
  await gruposContactosStore.cargarGrupos();
  await departamentoStore.cargarDepartamentos();
  await municipioStore.cargarMunicipios();

  console.log("Grupos cargados:", grupos.value);
  console.log("Departamentos cargados:", departamentos.value);
  console.log("Municipios cargados:", municipios.value);

  if (contactId) {
    isEditMode.value = true;
    try {
      const contact = await contactStore.obtenerContactoPorId(contactId);
      if (contact) {
        formData.value = {
          nombreContacto: contact.nombreContacto,
          direccionContacto: contact.direccionContacto,
          organizacionContacto: contact.organizacionContacto,
          grupoIdContacto: contact.grupoIdContacto,
          departamentoIdContacto: contact.departamentoIdContacto,
          municipioIdContacto: contact.municipioIdContacto,
          emailContacto: contact.emailContacto,
          telefonoCasaContacto: contact.telefonoCasaContacto,
          telefonoPersonalContacto: contact.telefonoPersonalContacto,
          observacionContacto: contact.observacionContacto,
        };
      } else {
        Notify.create({
          message: "Médico no encontrado",
          color: "negative",
          position: "top-right",
        });
        router.push({ name: "contactsList" });
      }
    } catch (error) {
      console.error("Error al obtener médico:", error);
      Notify.create({
        message: "Error al cargar el médico",
        color: "negative",
        position: "top-right",
      });
      router.push({ name: "contactsList" });
    }
  }
});

// Función para guardar o actualizar el médico
async function guardarcontact() {
  const contactData = { ...formData.value };

  // Opcional: Implementar validaciones antes de guardar
  formErrors.value = {}; // Resetear errores

  if (!contactData.nombreContacto) {
    formErrors.value.nombreContacto = "El nombre es obligatorio.";
  }
  if (!contactData.direccionContacto) {
    formErrors.value.direccionContacto = "La dirección es obligatoria.";
  }
  if (!contactData.grupoIdContacto) {
    formErrors.value.grupoIdContacto = "El grupo es obligatorio.";
  }
  if (!contactData.departamentoIdContacto) {
    formErrors.value.departamentoIdContacto = "El departamento es obligatorio.";
  }
  if (!contactData.municipioIdContacto) {
    formErrors.value.municipioIdContacto = "El municipio es obligatorio.";
  }
  if (!contactData.emailContacto) {
    formErrors.value.emailContacto = "El email es obligatorio.";
  }
  // Agrega más validaciones según sea necesario

  // Verificar si hay errores
  if (Object.keys(formErrors.value).length > 0) {
    Notify.create({
      message: "Por favor, corrige los errores en el formulario.",
      color: "negative",
      position: "top-right",
    });
    return;
  }

  try {
    if (isEditMode.value) {
      await contactStore.actualizarContacto(contactId, contactData);
      Notify.create({
        message: "Médico actualizado exitosamente",
        color: "positive",
        position: "top-right",
      });
    } else {
      await contactStore.agregarContacto(contactData);
      Notify.create({
        message: "Médico agregado exitosamente",
        color: "positive",
        position: "top-right",
      });
    }
    router.push({ name: "contactsList" });
  } catch (error) {
    console.error("Error al guardar médico:", error);
    Notify.create({
      message: "Hubo un error al guardar el médico",
      color: "negative",
      position: "top-right",
    });
  }
}

// Función para volver al listado
function volverAlListado() {
  router.push({ name: "contactsList" });
}
</script>

<style scoped>
.form-card {
  max-width: 800px; /* Aumenta el ancho máximo del formulario */
  width: 100%;
  margin: auto; /* Centra el card */
  background-color: #ffffff; /* Fondo blanco para mejor legibilidad */
}

.text-primary {
  color: #1976d2 !important; /* Color primario de Quasar */
}

.form-card h2 {
  font-weight: bold;
}

.q-btn.flat.round {
  border-radius: 50%;
}

.q-card-section {
  padding: 24px;
}

@media (max-width: 1024px) {
  .form-card {
    max-width: 700px;
  }
}

@media (max-width: 768px) {
  .form-card {
    max-width: 100%;
  }
}
</style>
