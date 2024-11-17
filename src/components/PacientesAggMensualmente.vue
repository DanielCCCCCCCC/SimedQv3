<template>
  <div>
    <h5 class="titulo">Registros semanales por dia</h5>

    <DxChart id="chart" :data-source="fichaIdentificacionStore.registrosPorDia">
      <DxSeries
        argument-field="day"
        value-field="registros"
        type="bar"
        color="#26A69A"
      />
    </DxChart>
  </div>
</template>

<script setup>
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import { DxChart, DxSeries } from "devextreme-vue/chart";

// Instancia de la tienda
const fichaIdentificacionStore = useFichaIdentificacionStore();
</script>
<style>
#chart {
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
