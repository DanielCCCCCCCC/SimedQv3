<template>
  <div>
    <h5 class="titulo">Estado de Pacientes</h5>
    <!-- Muestra el gráfico solo cuando los datos están listos -->
    <DxPieChart
      v-if="datosCargados"
      id="pie"
      :data-source="dataGraficoPacientes"
      type="doughnut"
      palette="Soft Pastel"
      width="300"
      height="250"
    >
      <DxSeries argument-field="estado" value-field="cantidad">
        <DxLabel :visible="true">
          <DxConnector :visible="true" />
        </DxLabel>
      </DxSeries>
      <DxExport :enabled="false" />
      <DxLegend
        :margin="0"
        horizontal-alignment="right"
        vertical-alignment="top"
      />
      <DxTooltip :enabled="true" :customize-tooltip="customizeTooltip">
        <DxFormat />
      </DxTooltip>
    </DxPieChart>
  </div>
</template>

<script setup>
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import { onMounted, ref } from "vue";
import DxPieChart, {
  DxLegend,
  DxSeries,
  DxTooltip,
  DxFormat,
  DxLabel,
  DxConnector,
  DxExport,
} from "devextreme-vue/pie-chart";
import { storeToRefs } from "pinia";

// Instancia de la tienda
const FichaIdentificacionStore = useFichaIdentificacionStore();
const { dataGraficoPacientes } = storeToRefs(FichaIdentificacionStore);

const datosCargados = ref(false);

onMounted(async () => {
  await FichaIdentificacionStore.cargarDatos();
  datosCargados.value = true; // Establece datosCargados a true cuando la carga está completa
});

const customizeTooltip = ({ valueText, percentText }) => ({
  text: `${valueText} pacientes (${percentText})`,
});
</script>
<style>
#DxPieChart {
  height: 200px;
  width: 500px;
  margin-top: 20px;
  margin-left: 10px;
}
.titulo {
  margin-top: 10px;
  font-family: "Segoe UI Light", "Helvetica Neue", "Trebuchet MS", "Verdana",
    "sans-serif";
  text-align: center;
}
</style>
