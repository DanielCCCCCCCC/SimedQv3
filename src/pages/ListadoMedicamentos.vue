<template>
  <div class="row">
    <h4 class="header-title">Medicamentos y Otros</h4>
  </div>

  <!-- Vista de tarjetas para pantallas pequeñas -->
  <div v-if="isMobileView" class="card-container">
    <div
      v-for="medicamento in medicamentos"
      :key="medicamento.codigo"
      class="medicamento-card"
    >
      <h5>{{ medicamento.descripcion }}</h5>
      <p><strong>Código:</strong> {{ medicamento.codigo }}</p>
      <p><strong>Tipo:</strong> {{ medicamento.tipo }}</p>
      <p><strong>Precio Costo:</strong> {{ medicamento.precioCosto }}</p>
      <p><strong>Precio Venta:</strong> {{ medicamento.precioVenta }}</p>
      <p><strong>Status:</strong> {{ medicamento.status }}</p>
      <div class="card-actions">
        <q-btn
          icon="edit"
          label="Editar"
          color="primary"
          @click="actualizarMedicamento(medicamento)"
        />
        <q-btn
          icon="delete"
          label="Eliminar"
          color="negative"
          @click="eliminarMedicamento(medicamento.codigo)"
        />
      </div>
    </div>
  </div>

  <!-- DataGrid para pantallas grandes -->
  <div v-else id="app-container" class="q-mb-xl">
    <DxDataGrid
      :data-source="medicamentos"
      :allow-column-reordering="true"
      :show-borders="true"
      class="custom-data-grid"
      :row-alternation-enabled="true"
      key-expr="codigo"
    >
      <!-- Columnas con ordenamiento habilitado -->
      <DxColumn data-field="codigo" caption="Código" :allow-sorting="true" />
      <DxColumn
        data-field="descripcion"
        caption="Descripción"
        :allow-sorting="true"
      />
      <DxColumn
        data-field="tipo"
        caption="Tipo"
        :allow-sorting="true"
        :visible="false"
      />
      <DxColumn
        data-field="indicaciones"
        caption="Indicaciones"
        :allow-sorting="true"
        :visible="false"
      />
      <DxColumn
        data-field="precioCosto"
        caption="Precio Costo"
        :allow-sorting="true"
        :visible="false"
      />
      <DxColumn
        data-field="precioVenta"
        caption="Precio Venta"
        :allow-sorting="true"
      />
      <DxColumn
        data-field="facturar"
        caption="Facturar"
        :allow-sorting="true"
        :visible="false"
      />
      <DxColumn data-field="status" caption="Status" :allow-sorting="true" />

      <!-- Botones de acción -->
      <DxColumn type="buttons">
        <DxButton name="edit" icon="edit" @click="actualizarMedicamento" />
        <DxButton name="delete" icon="trash" @click="eliminarMedicamento" />
      </DxColumn>

      <!-- Configuración de edición y filtros -->
      <DxEditing
        mode="popup"
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
        :popup="{
          title: 'Editar Información del Medicamento',
          showTitle: true,
          width: 700,
          height: 400,
        }"
      />
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
} from "devextreme-vue/data-grid";
import { useMedicamentoStore } from "../stores/DirectoriosStores";
import { storeToRefs } from "pinia";
import { onMounted, computed } from "vue";
import { Notify } from "quasar";

const medicamentoStore = useMedicamentoStore();
const { medicamentos } = storeToRefs(medicamentoStore);

// Detecta si la pantalla es pequeña para mostrar la vista de tarjetas
const isMobileView = computed(() => window.innerWidth < 600);

onMounted(async () => {
  await medicamentoStore.cargarMedicamentos();
});

// Función para actualizar medicamento
const actualizarMedicamento = (medicamento) => {
  medicamentoStore.actualizarMedicamento(medicamento).then(() => {
    Notify.create({
      type: "positive",
      message: "Medicamento actualizado con éxito",
      position: "top-right",
    });
  });
};

// Función para eliminar medicamento
const eliminarMedicamento = (medicamentoCodigo) => {
  medicamentoStore.eliminarMedicamento(medicamentoCodigo).then(() => {
    Notify.create({
      type: "negative",
      message: "Medicamento eliminado",
      position: "top-right",
    });
  });
};
</script>

<style scoped>
#app-container {
  padding: 0 4px;
  background-color: #ffffff;
  width: 100%;
  margin-bottom: -1px;
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

.medicamento-card {
  border: 1px solid #ddd;
  padding: 16px;
  border-radius: 8px;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.medicamento-card h5 {
  margin: 0 0 8px;
  font-size: 1.2em;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}
</style>
