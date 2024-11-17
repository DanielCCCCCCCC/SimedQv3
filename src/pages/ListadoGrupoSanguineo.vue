<template>
  <div class="row">
    <h4 class="header-title">Grupos Sanguíneos</h4>
  </div>
  <div id="app-container" class="q-mb-xl">
    <DxDataGrid
      :data-source="gruposSanguineos"
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

      <!-- Columna de descripción con ordenamiento habilitado -->
      <DxColumn
        data-field="descripcion"
        caption="Descripción"
        :allow-sorting="true"
        min-width="150"
        width="200"
      ></DxColumn>

      <!-- Botones de acción para editar y eliminar -->
      <DxColumn type="buttons">
        <DxButton name="edit" icon="edit" />
        <DxButton name="delete" icon="trash" @click="onDeleteButtonClick" />
      </DxColumn>

      <!-- Configuración de edición de datos con ventana modal -->
      <DxEditing
        mode="popup"
        :allow-updating="true"
        :allow-adding="true"
        :allow-deleting="true"
        :popup="{
          title: 'Editar Grupo Sanguíneo',
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
import { useGrupoSanguineoStore } from "../stores/DatosGeneralesStores";
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
    const grupoSanguineoStore = useGrupoSanguineoStore();
    const { gruposSanguineos } = storeToRefs(grupoSanguineoStore);

    // Método para eliminar un grupo sanguíneo
    const onDeleteButtonClick = async (e) => {
      const id = e.row.data.id;
      try {
        await grupoSanguineoStore.eliminarGrupoSanguineo(id);
        Notify.create({
          message: "Grupo sanguíneo eliminado exitosamente",
          color: "positive",
          position: "top-right",
        });
      } catch (error) {
        console.error("Error al eliminar grupo sanguíneo:", error);
        Notify.create({
          message: "Error al eliminar grupo sanguíneo",
          color: "negative",
          position: "top-right",
        });
      }
    };

    onMounted(async () => {
      await grupoSanguineoStore.cargarGruposSanguineos();
    });

    return {
      gruposSanguineos,
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
