<template>
  <div class="row">
    <h4 class="header-title">Hospitales</h4>
  </div>

  <!-- Vista de tarjetas para móvil -->
  <div v-if="isMobileView" class="card-container">
    <div
      v-for="hospital in hospitales"
      :key="hospital.id"
      class="hospital-card"
    >
      <h5>{{ hospital.nombre }}</h5>
      <p><strong>Dirección:</strong> {{ hospital.direccion }}</p>
      <p>
        <strong>Departamento:</strong> {{ hospital.departamentoDescripcion }}
      </p>
      <p><strong>Municipio:</strong> {{ hospital.municipioDescripcion }}</p>
      <p><strong>Teléfono:</strong> {{ hospital.telefono }}</p>
      <p><strong>Email:</strong> {{ hospital.email }}</p>
      <p>
        <strong>Sitio Web:</strong>
        <a :href="hospital.web" target="_blank">{{ hospital.web }}</a>
      </p>
      <!-- Botones de acción en la tarjeta -->
      <q-btn
        icon="edit"
        label="Editar"
        color="primary"
        @click="actualizarHospital(hospital)"
      />
      <q-btn
        icon="delete"
        label="Eliminar"
        color="negative"
        @click="eliminarHospital(hospital.id)"
      />
    </div>
  </div>

  <!-- DataGrid para pantallas grandes -->
  <div v-else id="app-container" class="q-mb-xl">
    <DxDataGrid
      :data-source="hospitales"
      :allow-column-reordering="true"
      :show-borders="true"
      class="custom-data-grid"
      :row-alternation-enabled="true"
      key-expr="id"
    >
      <DxScrolling mode="virtual" />
      <DxColumnChooser :enabled="true" />
      <DxSorting mode="multiple" />
      <DxHeaderFilter :visible="true" />
      <DxLoadPanel :show-pane="true" />

      <!-- Columnas con ordenamiento habilitado -->
      <DxColumn
        data-field="nombre"
        caption="Nombre"
        :allow-sorting="true"
        min-width="150"
        width="180"
      />
      <DxColumn
        data-field="direccion"
        caption="Dirección"
        :allow-sorting="true"
        min-width="150"
        width="140"
      />
      <DxColumn
        data-field="departamentoDescripcion"
        caption="Departamento"
        :allow-sorting="true"
        min-width="100"
        width="130"
      />
      <DxColumn
        data-field="municipioDescripcion"
        caption="Municipio"
        :allow-sorting="true"
        min-width="100"
        width="120"
      />
      <DxColumn
        data-field="telefono"
        caption="Teléfono"
        :allow-sorting="true"
        min-width="100"
        width="100"
      />
      <DxColumn
        data-field="email"
        caption="Email"
        :allow-sorting="true"
        min-width="100"
        width="160"
      />
      <DxColumn
        data-field="web"
        caption="Sitio Web"
        :allow-sorting="true"
        min-width="100"
        width="150"
      />

      <!-- Botones de acción para editar y eliminar -->
      <DxColumn type="buttons">
        <DxButton name="edit" icon="edit" @click="actualizarHospital" />
        <DxButton name="delete" icon="trash" @click="eliminarHospital" />
      </DxColumn>

      <!-- Configuración de edición de datos con ventana modal -->
      <DxEditing
        mode="popup"
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
        :popup="{
          title: 'Editar Información del Hospital',
          showTitle: true,
          width: 700,
          height: 400,
        }"
      />

      <!-- Paginación y filtros -->
      <DxPaging :enabled="true" :page-size="10" />
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />
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
  DxColumnChooser,
  DxScrolling,
  DxSorting,
  DxLoadPanel,
} from "devextreme-vue/data-grid";
import { useHospitalStore } from "../stores/DirectoriosStores";
import { storeToRefs } from "pinia";
import { onMounted, computed } from "vue";
import { Notify } from "quasar";

const hospitalStore = useHospitalStore();
const { hospitales } = storeToRefs(hospitalStore);

// Detecta si la pantalla es móvil
const isMobileView = computed(() => window.innerWidth < 600);

onMounted(async () => {
  await hospitalStore.cargarHospitales();
});

// Función para actualizar hospital
const actualizarHospital = (hospital) => {
  hospitalStore.actualizarHospital(hospital).then(() => {
    Notify.create({
      type: "positive",
      message: "Hospital actualizado con éxito",
      position: "top-right",
    });
  });
};

// Función para eliminar hospital
const eliminarHospital = (hospitalId) => {
  hospitalStore.eliminarHospital(hospitalId).then(() => {
    Notify.create({
      type: "negative",
      message: "Hospital eliminado",
      position: "top-right",
    });
  });
};
</script>

<style scoped>
#app-container {
  padding: 0 4px;
  background-color: #f9f9f9;
  width: 100%;
}

.custom-data-grid {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 1px 0 1px;
  text-align: center;
}

/* Estilos de tarjeta para vista móvil */
.card-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.hospital-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.hospital-card h5 {
  margin: 0 0 8px;
  font-size: 1.2em;
}
</style>
