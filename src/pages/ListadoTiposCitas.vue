<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <DxDataGrid
      :data-source="citas"
      key-expr="id"
      :show-borders="true"
      class="custom-data-grid"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :column-resizing-mode="'widget'"
      height="400px"
    >
      <!-- Columnas -->
      <DxColumn data-field="descripcion" caption="Tipo de Cita">
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
        <DxButton icon="edit" hint="Editar" @click="actualizarCita" />
        <DxButton icon="trash" hint="Eliminar" @click="eliminarCita" />
      </DxColumn>

      <!-- Opciones adicionales -->
      <DxSummary>
        <DxGroupItem summary-type="count" displayFormat="{0} citas" />
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
import { useTiposCitasStore } from "../stores/ConfiMedicasStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";

const citasStore = useTiposCitasStore();
const { citas } = storeToRefs(citasStore);
citasStore.cargarCitas();

// Función para actualizar cita
const actualizarCita = (e) => {
  const cita = e.row.data;
  citasStore.actualizarCita(cita).then(() => {
    Notify.create({
      type: "positive",
      message: "Cita actualizada con éxito",
      position: "top-right",
    });
  });
};

// Función para eliminar cita
const eliminarCita = (e) => {
  const citaId = e.row.data.id;
  citasStore.eliminarCita(citaId).then(() => {
    Notify.create({
      type: "negative",
      message: "Cita eliminada",
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
