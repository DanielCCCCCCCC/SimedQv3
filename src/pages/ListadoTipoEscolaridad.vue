<template>
  <div class="row">
    <h4 class="header-title">Escolaridades</h4>
  </div>
  <div id="app-container" class="q-mb-xl">
    <DxDataGrid
      :data-source="escolaridades"
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

      <!-- Columna para descripción -->
      <DxColumn
        data-field="descripcion"
        caption="Descripción"
        :allow-sorting="true"
        min-width="150"
        width="200"
      ></DxColumn>

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
          title: 'Editar Escolaridad',
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

<script>
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
import { useEscolaridadStore } from "../stores/DatosGeneralesStores";
import { storeToRefs } from "pinia";
import { onMounted } from "vue";
import { Notify } from "quasar"; // Importar para notificaciones

export default {
  components: {
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
  },
  setup() {
    const escolaridadStore = useEscolaridadStore();
    const { escolaridades } = storeToRefs(escolaridadStore);

    // Método para eliminar una escolaridad
    const onDeleteButtonClick = async (e) => {
      const id = e.row.data.id;
      try {
        await escolaridadStore.eliminarEscolaridad(id);
        Notify.create({
          message: "Escolaridad eliminada exitosamente",
          color: "positive",
          position: "top-right",
        });
      } catch (error) {
        console.error("Error al eliminar escolaridad:", error);
        Notify.create({
          message: "Error al eliminar escolaridad",
          color: "negative",
          position: "top-right",
        });
      }
    };

    onMounted(async () => {
      await escolaridadStore.cargarEscolaridades();
    });

    return {
      escolaridades,
      onDeleteButtonClick,
    };
  },
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
