<template>
  <div class="row justify-center q-py-md">
    <h4 class="header-title">Contactos Existentes</h4>
  </div>

  <!-- Vista de tarjetas para dispositivos móviles -->
  <div v-if="isMobileView" class="card-container">
    <div v-for="contacto in contactos" :key="contacto.id" class="contact-card">
      <h5>{{ contacto.nombre }}</h5>
      <p><strong>Dirección:</strong> {{ contacto.direccion }}</p>
      <p><strong>Organización:</strong> {{ contacto.organizacion }}</p>
      <p><strong>Email:</strong> {{ contacto.email }}</p>
      <p><strong>Teléfono Casa:</strong> {{ contacto.telefonoCasa }}</p>
      <div class="card-actions">
        <q-btn
          icon="edit"
          label="Editar"
          color="primary"
          @click="handleEdit(contacto)"
        />
        <q-btn
          icon="delete"
          label="Eliminar"
          color="negative"
          @click="handleDelete(contacto.id)"
        />
      </div>
    </div>
  </div>

  <!-- DataGrid para pantallas grandes -->
  <div v-else id="app-container" class="q-mb-xl q-px-md q-pa-xs q-py-md">
    <DxDataGrid
      :data-source="contactosConDetalles"
      :allow-column-reordering="true"
      :show-borders="true"
      :row-alternation-enabled="true"
      key-expr="id"
      :width="responsiveWidth"
    >
      <DxColumn
        data-field="nombreContacto"
        caption="Nombre"
        :allow-sorting="true"
      />
      <DxColumn
        data-field="direccionContacto"
        caption="Dirección"
        :allow-sorting="true"
      />
      <DxColumn
        data-field="organizacionContacto"
        caption="Organización"
        :allow-sorting="true"
      />
      <DxColumn
        data-field="grupoDescripcion"
        caption="Grupo de Contacto"
        :allow-sorting="true"
        :visible="true"
      />
      <DxColumn
        data-field="departamentoDescripcion"
        caption="Departamento"
        :allow-sorting="true"
        :visible="true"
        width="140px"
      />
      <DxColumn
        data-field="municipioDescripcion"
        caption="Municipio"
        :allow-sorting="true"
        :visible="true"
        width="140px"
      />

      <DxColumn
        data-field="emailContacto"
        caption="E-mail"
        :allow-sorting="true"
      />
      <DxColumn
        data-field="telefonoCasaContacto"
        caption="Teléfono Casa"
        :allow-sorting="true"
        :visible="false"
      />
      <DxColumn
        data-field="telefonoPersonalContacto"
        caption="Tel. Personal"
        :allow-sorting="true"
        :visible="true"
        width="100px"
      />
      <DxColumn
        data-field="observacionContacto"
        caption="Observaciones"
        :allow-sorting="true"
        :visible="true"
      />

      <DxEditing
        mode="popup"
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
        :popup="{
          title: 'Editar Información del Contacto',
          showTitle: true,
          width: 700,
          height: 470,
        }"
      />
      <DxPaging :enabled="true" :page-size="10" />
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />
      <DxColumn type="buttons">
        <DxButton
          name="edit"
          icon="edit"
          @click="(event) => handleEdit(event.row.data)"
        />
        <DxButton name="delete" icon="trash" />
      </DxColumn>
    </DxDataGrid>
  </div>
</template>

<script setup>
import {
  DxDataGrid,
  DxColumn,
  DxPaging,
  DxFilterRow,
  DxHeaderFilter,
  DxEditing,
  DxButton,
} from "devextreme-vue/data-grid";
import { ref, onMounted, onUnmounted, computed, defineProps } from "vue";
import { useContactStore } from "../stores/ContacStores";
import { useGruposContactosStore } from "../stores/ConfiMedicasStores";
import { useDepartamentoStore } from "src/stores/DatosGeneralesStores";
import { useMunicipioStore } from "src/stores/DatosGeneralesStores";
import { Notify } from "quasar";
import { storeToRefs } from "pinia";

const gruposContactosStore = useGruposContactosStore();
const departamentoStore = useDepartamentoStore();
const municipioStore = useMunicipioStore();

const { grupos } = storeToRefs(gruposContactosStore);
const { departamentos } = storeToRefs(departamentoStore);
const { municipios } = storeToRefs(municipioStore);

const emit = defineEmits(["editarContacto"]);

// Access the contact store
const contactStore = useContactStore();
const { contactos } = storeToRefs(contactStore);

// Fetch contacts on mount and listen for window resizing
onMounted(async () => {
  await contactStore.cargarContactos();
  await gruposContactosStore.cargarGrupos();
  await departamentoStore.cargarDepartamentos();
  await municipioStore.cargarMunicipios();
  await contactStore.cargarContactos();
  window.addEventListener("resize", updateWidth);
  console.log("Grupos ln 164: ", grupos.value);
});

onUnmounted(() => {
  window.removeEventListener("resize", updateWidth);
});

// Propiedad computada con comprobaciones de seguridad
const contactosConDetalles = computed(() => {
  return (contactos.value || []).map((contacto) => {
    const grupo = (grupos.value || []).find(
      (grp) => grp.id === Number(contacto.grupoIdContacto)
    );
    const departamento = (departamentos.value || []).find(
      (dept) => dept.id === Number(contacto.departamentoIdContacto)
    );
    const municipio = (municipios.value || []).find(
      (mun) => mun.id === Number(contacto.municipioIdContacto)
    );
    return {
      ...contacto,

      grupoDescripcion: grupo ? grupo?.descripcion : "Grupo no encontrado",

      departamentoDescripcion: departamento
        ? departamento.descripcion
        : "Departamento no encontrado",
      municipioDescripcion: municipio
        ? municipio.descripcion
        : "Municipio no encontrado",
    };
  });
});

// Check for mobile view
const isMobileView = computed(() => window.innerWidth < 600);
const responsiveWidth = ref(window.innerWidth < 600 ? "100%" : "auto");
const updateWidth = () =>
  (responsiveWidth.value = window.innerWidth < 600 ? "100%" : "auto");

const handleEdit = (contacto) => {
  if (contacto && contacto.id) {
    console.log(
      "ListadoContactos.vue: Contacto recibido para editar con ID:",
      contacto.id
    );
    // Emitir el evento 'editarContacto' con el contacto como payload
    emit("editarContacto", contacto);
  } else {
    console.error("El contacto recibido es inválido:", contacto);
  }
};

// Handle deleting a contact
const handleDelete = async (contactoId) => {
  try {
    await eliminarContacto(contactoId);
    Notify.create({
      message: "Contacto eliminado exitosamente",
      color: "green",
      position: "top-right",
    });
  } catch (error) {
    console.error("Error al eliminar el contacto:", error);
    Notify.create({
      message: "Error al eliminar el contacto",
      color: "red",
      position: "top-right",
    });
  }
};
</script>

<style scoped>
#app-container {
  padding: 0 4px;
  background-color: #ffffff;
  margin-top: -20px;
  margin-bottom: 80px;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  text-align: center;
  margin-bottom: -10px;
}

/* Vista de tarjetas en dispositivos móviles */
.card-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.contact-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.contact-card h5 {
  margin: 0 0 8px;
  font-size: 1.2em;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>
