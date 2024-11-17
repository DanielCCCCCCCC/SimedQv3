<template>
  <div class="row">
    <h4 class="header-title">Diagnósticos</h4>
  </div>

  <!-- Vista de tarjetas para dispositivos móviles -->
  <div v-if="isMobileView" class="card-container">
    <div
      v-for="diagnostico in diagnosticos"
      :key="diagnostico.id"
      class="diagnostico-card"
    >
      <h5>{{ diagnostico.descripcion }}</h5>
      <p>
        <strong>Clasificación:</strong>
        {{ diagnostico.clasificacionDescripcion }}
      </p>
      <div class="card-actions">
        <q-btn
          icon="edit"
          label="Editar"
          color="primary"
          @click="onEditButtonClick(diagnostico)"
        />
        <q-btn
          icon="delete"
          label="Eliminar"
          color="negative"
          @click="onDeleteButtonClick(diagnostico.id)"
        />
      </div>
    </div>
  </div>

  <!-- DataGrid para pantallas grandes -->
  <div v-else id="app-container" class="q-mb-xl">
    <DxDataGrid
      :data-source="diagnosticos"
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

      <!-- Columnas para descripción y clasificación -->
      <DxColumn
        data-field="descripcion"
        caption="Descripción"
        :allow-sorting="true"
        min-width="150"
        width="200"
      />
      <DxColumn
        data-field="clasificacionDescripcion"
        caption="Clasificación"
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
          title: 'Editar Diagnóstico',
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
import { useDiagnosticosStore } from "../stores/DiagnosticosStores";
import { Notify } from "quasar";
import { storeToRefs } from "pinia";
import { onMounted, computed } from "vue";

// Acceder a la tienda de diagnósticos
const diagnosticoStore = useDiagnosticosStore();
const { diagnosticos } = storeToRefs(diagnosticoStore);

// Computed para detectar si la vista es móvil
const isMobileView = computed(() => window.innerWidth < 600);

// Método para eliminar un diagnóstico
const onDeleteButtonClick = async (id) => {
  try {
    await diagnosticoStore.eliminarDiagnostico(id);
    Notify.create({
      message: "Diagnóstico eliminado exitosamente",
      color: "positive",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      message: "Error al eliminar el diagnóstico",
      color: "negative",
      position: "top-right",
    });
    console.error("Error al eliminar diagnóstico:", error);
  }
};

onMounted(async () => {
  await diagnosticoStore.cargarDiagnosticos();
});
</script>
<!--
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

.card-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.diagnostico-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.diagnostico-card h5 {
  margin: 0 0 8px;
  font-size: 1.2em;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style> -->
