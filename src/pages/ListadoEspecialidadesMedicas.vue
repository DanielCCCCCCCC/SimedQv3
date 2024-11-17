<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <DxDataGrid
      :data-source="especialidades"
      key-expr="id"
      :show-borders="true"
      class="custom-data-grid"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :column-resizing-mode="'widget'"
      height="400px"
    >
      <!-- Columnas -->
      <DxColumn data-field="descripcion" caption="Especialidad Médica">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn
        data-field="created_at"
        caption="Fecha de Creación"
        data-type="date"
        :format="{ type: 'shortDate' }"
      >
        <DxRequiredRule />
      </DxColumn>

      <!-- Botones de edición y eliminación -->
      <DxColumn type="buttons">
        <DxButton icon="edit" hint="Editar" @click="actualizarEspecialidad" />
        <DxButton icon="trash" hint="Eliminar" @click="eliminarEspecialidad" />
      </DxColumn>

      <!-- Opciones adicionales -->
      <DxSummary>
        <DxGroupItem summary-type="count" displayFormat="{0} especialidades" />
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
import { useEspecialidadMedicaStore } from "../stores/ConfiMedicasStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";

// Instancia de la tienda y referencia reactiva
const especialidadesStore = useEspecialidadMedicaStore();
const { especialidades } = storeToRefs(especialidadesStore);
especialidadesStore.cargarEspecialidades();

// Función para actualizar especialidad
const actualizarEspecialidad = (e) => {
  const especialidad = e.row.data;
  especialidadesStore.actualizarEspecialidad(especialidad).then(() => {
    Notify.create({
      type: "positive",
      message: "Especialidad actualizada con éxito",
      position: "top-right",
    });
  });
};

// Función para eliminar especialidad
const eliminarEspecialidad = (e) => {
  const especialidadId = e.row.data.id;
  especialidadesStore.eliminarEspecialidad(especialidadId).then(() => {
    Notify.create({
      type: "negative",
      message: "Especialidad eliminada",
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
</style>
