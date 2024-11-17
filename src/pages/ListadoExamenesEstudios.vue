<template>
  <div class="row">
    <h4 class="header-title">Estudios</h4>
  </div>

  <!-- Vista de tarjetas para pantallas pequeñas -->
  <div v-if="isMobileView" class="card-container">
    <div v-for="estudio in estudios" :key="estudio.id" class="estudio-card">
      <h5>{{ estudio.descripcion }}</h5>
      <p><strong>Fecha de Creación:</strong> {{ estudio.created_at }}</p>
      <div class="card-actions">
        <q-btn
          icon="edit"
          label="Editar"
          color="primary"
          @click="onEditButtonClick(estudio)"
        />
        <q-btn
          icon="delete"
          label="Eliminar"
          color="negative"
          @click="onDeleteButtonClick(estudio.id)"
        />
      </div>
    </div>
  </div>

  <!-- DataGrid para pantallas grandes -->
  <div v-else id="app-container" class="q-mb-xl">
    <DxDataGrid
      :data-source="estudios"
      :allow-column-reordering="true"
      :show-borders="true"
      class="custom-data-grid"
      :row-alternation-enabled="true"
      key-expr="id"
    >
      <!-- Columnas de Estudios -->
      <DxColumn
        data-field="descripcion"
        caption="Tipo de Estudio"
        :allow-sorting="true"
      />
      <DxColumn
        data-field="created_at"
        caption="Fecha de Creación"
        data-type="date"
        :allow-sorting="true"
      />

      <!-- Columna de botones de acción -->
      <DxColumn type="buttons">
        <DxButton name="edit" icon="edit" @click="onEditButtonClick" />
        <DxButton name="delete" icon="trash" @click="onDeleteButtonClick" />
      </DxColumn>

      <!-- Resumen de estudios -->
      <DxSummary>
        <DxGroupItem summary-type="count" display-format="{0} estudios" />
      </DxSummary>

      <!-- Edición de datos en ventana modal -->
      <DxEditing
        mode="popup"
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
        :popup="{
          title: 'Editar Información del Estudio',
          showTitle: true,
          width: 700,
          height: 400,
        }"
      />

      <!-- Paginación y filtros -->
      <DxPaging :enabled="true" :page-size="10" />
      <DxFilterRow :visible="true" />
      <DxHeaderFilter :visible="true" />
      <DxColumnChooser :enabled="true" />
      <DxSearchPanel :visible="true" />
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
  DxSummary,
  DxGroupItem,
  DxColumnChooser,
  DxSearchPanel,
  DxButton,
} from "devextreme-vue/data-grid";
import { useEstudioStore } from "../stores/DirectoriosStores";
import { storeToRefs } from "pinia";
import { onMounted, computed } from "vue";
import { Notify } from "quasar";

// Acceder a la tienda de estudios
const estudioStore = useEstudioStore();
const { estudios } = storeToRefs(estudioStore);

// Detecta si la pantalla es pequeña para mostrar la vista de tarjetas
const isMobileView = computed(() => window.innerWidth < 600);

// Función para editar un estudio
const onEditButtonClick = async (estudio) => {
  try {
    await estudioStore.actualizarEstudio(estudio);
    Notify.create({
      message: "Estudio actualizado exitosamente",
      color: "positive",
      position: "top-right",
    });
  } catch (error) {
    console.error("Error al actualizar estudio:", error);
    Notify.create({
      message: "Error al actualizar estudio",
      color: "negative",
      position: "top-right",
    });
  }
};

// Función para eliminar un estudio
const onDeleteButtonClick = async (id) => {
  try {
    await estudioStore.eliminarEstudio(id);
    Notify.create({
      message: "Estudio eliminado exitosamente",
      color: "positive",
      position: "top-right",
    });
  } catch (error) {
    console.error("Error al eliminar estudio:", error);
    Notify.create({
      message: "Error al eliminar estudio",
      color: "negative",
      position: "top-right",
    });
  }
};

onMounted(async () => {
  await estudioStore.cargarEstudios();
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
  margin-bottom: -1px;
}

/* Estilos de tarjeta para vista móvil */
.card-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.estudio-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.estudio-card h5 {
  margin: 0 0 8px;
  font-size: 1.2em;
  margin-top: 200px;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>
