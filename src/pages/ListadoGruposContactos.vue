<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <DxDataGrid
      :data-source="grupos"
      key-expr="id"
      :show-borders="true"
      class="custom-data-grid"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :column-resizing-mode="'widget'"
      height="400px"
    >
      <!-- Columnas -->
      <DxColumn data-field="descripcion" caption="Grupo de Contacto">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="created_at"
        caption="Fecha de Creación"
        data-type="date"
      >
        <DxRequiredRule />
      </DxColumn>

      <!-- Botones de edición y eliminación -->
      <DxColumn type="buttons">
        <DxButton icon="edit" hint="Editar" @click="actualizarGrupo" />
        <DxButton icon="trash" hint="Eliminar" @click="eliminarGrupo" />
      </DxColumn>

      <!-- Opciones adicionales -->
      <DxSummary>
        <DxGroupItem summary-type="count" displayFormat="{0} grupos" />
      </DxSummary>
      <DxColumnChooser :enabled="true" />
      <DxFilterRow :visible="true" />
      <DxSearchPanel :visible="true" />
      <DxGroupPanel :visible="true" />
      <DxGrouping :auto-expand-all="false" />
    </DxDataGrid>
  </q-card>
</template>

<script setup>
import {
  DxDataGrid,
  DxColumn,
  DxRequiredRule,
  DxSummary,
  DxGroupItem,
  DxColumnChooser,
  DxFilterRow,
  DxSearchPanel,
  DxGroupPanel,
  DxGrouping,
  DxButton,
} from "devextreme-vue/data-grid";
import { useGruposContactosStore } from "../stores/ConfiMedicasStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";

const gruposStore = useGruposContactosStore();
const { grupos } = storeToRefs(gruposStore);
gruposStore.cargarGrupos();

// Función para actualizar grupo
const actualizarGrupo = (e) => {
  const grupo = e.row.data;
  gruposStore.actualizarGrupo(grupo).then(() => {
    Notify.create({
      type: "positive",
      message: "Grupo actualizado con éxito",
      position: "top-right",
    });
  });
};

// Función para eliminar grupo
const eliminarGrupo = (e) => {
  const grupoId = e.row.data.id;
  gruposStore.eliminarGrupo(grupoId).then(() => {
    Notify.create({
      type: "negative",
      message: "Grupo eliminado",
      position: "top-right",
    });
  });
};
</script>

<style scoped>
#app-container {
  padding: 0 4px;
  background-color: #f9f9f9;
  width: 100%; /* Ajuste para que ocupe el 100% del ancho disponible */
}

.custom-data-grid {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%; /* Hacer que el DataGrid ocupe el 100% del ancho del contenedor */
}

.header-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 1px 0 1px;
  text-align: center;
}
</style>
