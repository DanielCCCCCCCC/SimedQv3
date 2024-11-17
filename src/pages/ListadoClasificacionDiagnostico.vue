<template>
  <div class="row">
    <h4 class="header-title">Clasificación de Diagnósticos</h4>
  </div>

  <!-- Vista de tarjetas para dispositivos móviles -->
  <div v-if="isMobileView" class="card-container">
    <div
      v-for="clasificacion in clasificaciones"
      :key="clasificacion.id"
      class="clasificacion-card"
    >
      <h5>{{ clasificacion.nombre }}</h5>
      <div class="card-actions">
        <q-btn
          icon="edit"
          label="Editar"
          color="primary"
          @click="onEditButtonClick(clasificacion)"
        />
        <q-btn
          icon="delete"
          label="Eliminar"
          color="negative"
          @click="onDeleteButtonClick(clasificacion.id)"
        />
      </div>
    </div>
  </div>

  <!-- DataGrid para pantallas grandes -->
  <div v-else id="app-container" class="q-mb-xl">
    <DxDataGrid
      :data-source="clasificaciones"
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

      <!-- Columna para nombre de clasificación -->
      <DxColumn
        data-field="nombre"
        caption="Nombre de Clasificación"
        :allow-sorting="true"
        min-width="150"
        width="200"
      />

      <!-- Botones de acción -->
      <DxColumn type="buttons">
        <DxButton name="edit" icon="edit" />
        <DxButton name="delete" icon="trash" @click="onDeleteButtonClick" />
      </DxColumn>

      <!-- Configuración de edición -->
      <DxEditing
        mode="popup"
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
        :popup="{
          title: 'Editar Clasificación',
          showTitle: true,
          width: 500,
          height: 300,
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
import { useClasificacionDiagnosticosStore } from "../stores/DiagnosticosStores";
import { Notify } from "quasar";
import { storeToRefs } from "pinia";
import { onMounted, computed } from "vue";

// Acceder a la tienda de clasificaciones de diagnósticos
const clasificacionStore = useClasificacionDiagnosticosStore();
const { clasificaciones } = storeToRefs(clasificacionStore);

// Computed para detectar si la vista es móvil
const isMobileView = computed(() => window.innerWidth < 600);

// Método para eliminar una clasificación
const onDeleteButtonClick = async (id) => {
  try {
    await clasificacionStore.eliminarClasificacion(id);
    Notify.create({
      message: "Clasificación eliminada exitosamente",
      color: "positive",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      message: "Error al eliminar la clasificación",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al eliminar clasificación:", error);
  }
};

onMounted(async () => {
  await clasificacionStore.cargarClasificaciones();
});
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
  text-align: center;
}

/* Estilos de tarjeta para vista móvil */
.card-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.clasificacion-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.clasificacion-card h5 {
  margin: 0 0 8px;
  font-size: 1.2em;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>
