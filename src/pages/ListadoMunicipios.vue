<template>
  <div id="app-container">
    <DxDataGrid
      id="dataGrid"
      :data-source="municipios"
      key-expr="id"
      :allow-column-resizing="true"
      :column-auto-width="true"
      :allow-column-reordering="true"
    >
      <!-- Agrupación por departamento -->
      <DxColumn
        data-field="departamentoDescripcion"
        :group-index="0"
        sort-order="asc"
      >
        <DxRequiredRule />
      </DxColumn>

      <!-- Columna para el nombre del municipio -->
      <DxColumn data-field="descripcion" caption="Municipio">
        <DxRequiredRule />
      </DxColumn>

      <!-- Columna de botones de acción -->
      <DxColumn type="buttons">
        <DxButton name="edit" />
        <DxButton name="delete" />
      </DxColumn>

      <DxColumnChooser :enabled="true" />
      <DxColumnFixing :enabled="true" />
      <DxFilterRow :visible="true" />
      <DxSearchPanel :visible="true" />
      <DxGroupPanel :visible="true" />
      <DxSummary>
        <DxGroupItem summary-type="count" displayFormat="{0} municipios" />
      </DxSummary>
      <DxGrouping :auto-expand-all="expanded" />
      <DxToolbar>
        <DxItem name="groupPanel" />
        <DxItem location="after" template="button-template" />
        <DxItem name="exportButton" />
        <DxItem name="columnChooserButton" />
        <DxItem name="searchPanel" />
      </DxToolbar>
      <template #button-template>
        <DxButton
          :text="expanded ? 'Contraer Todo' : 'Expandir Todo'"
          :width="136"
          @click="toggleExpand"
        />
      </template>
    </DxDataGrid>
  </div>
</template>

<script>
import {
  DxDataGrid,
  DxColumn,
  DxRequiredRule,
  DxColumnChooser,
  DxColumnFixing,
  DxFilterRow,
  DxSearchPanel,
  DxGroupPanel,
  DxSummary,
  DxGroupItem,
  DxGrouping,
  DxToolbar,
  DxItem,
} from "devextreme-vue/data-grid";
import { DxButton } from "devextreme-vue/button";
import { useMunicipioStore } from "../stores/DatosGeneralesStores";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";

export default {
  name: "App",
  components: {
    DxDataGrid,
    DxColumn,
    DxRequiredRule,
    DxColumnChooser,
    DxColumnFixing,
    DxFilterRow,
    DxSearchPanel,
    DxGroupPanel,
    DxSummary,
    DxGroupItem,
    DxGrouping,
    DxToolbar,
    DxItem,
    DxButton,
  },
  setup() {
    const municipioStore = useMunicipioStore();
    const { municipios } = storeToRefs(municipioStore);
    const expanded = ref(false);

    // Cargar municipios cuando el componente se monta
    onMounted(async () => {
      await municipioStore.cargarMunicipios();
    });

    // Alternar el estado expandido
    const toggleExpand = () => {
      expanded.value = !expanded.value;
    };

    return {
      municipios,
      expanded,
      toggleExpand,
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
