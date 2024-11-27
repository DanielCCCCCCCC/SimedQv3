<template>
  <div class="grafico-container">
    <!-- Botón "Ir" en la esquina superior derecha -->
    <div>
      <button class="go-button" @click="goToScheduler">Ir</button>
    </div>

    <!-- Gráfico de barras -->
    <DxChart
      id="chart"
      :data-source="fichaIdentificacionStore.registrosPorDia"
      palette="Soft Pastel"
    >
      <!-- Serie de barras con bordes redondeados -->
      <DxSeries
        argument-field="day"
        value-field="registros"
        type="bar"
        color="#26A69A"
        :showInLegend="false"
        bar-padding="0.5"
        bar-width="12"
      />

      <!-- Configuración de la leyenda -->
      <DxLegend
        orientation="horizontal"
        horizontal-alignment="center"
        vertical-alignment="bottom"
        item-text-position="right"
      />

      <!-- Habilitar etiquetas para las barras -->
      <DxLabel :visible="true" />

      <!-- Habilitar tooltip -->
      <DxTooltip :enabled="true" />
    </DxChart>
  </div>
</template>
<script setup>
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import {
  DxChart,
  DxSeries,
  DxLegend,
  DxLabel,
  DxTooltip,
} from "devextreme-vue/chart";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

// Instancia de la tienda
const fichaIdentificacionStore = useFichaIdentificacionStore();
const { registrosPorDia } = storeToRefs(fichaIdentificacionStore);

// Acceder al router de Vue
const router = useRouter();

// Función para redirigir al scheduler
const goToScheduler = () => {
  router.push("/directoriopacientes");
};
</script>
<style scoped>
.grafico-container {
  position: relative; /* Para posicionar el botón de forma absoluta dentro del contenedor */
  width: 100%;
  max-width: 500px; /* Ajusta según tus necesidades */
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  margin: 0 auto; /* Centrar el contenedor si es necesario */
}

.go-button {
  position: absolute;
  top: -60px;
  right: 16px;
  background-color: rgba(0, 0, 0, 0.05); /* Casi transparente */
  border: none;
  color: #333;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
}

.go-button:hover {
  background-color: rgba(0, 0, 0, 0.1);
  color: #000;
}

/* Ajusta el tamaño del gráfico */
#chart {
  position: relative;
  top: -20px;
  height: 230px;
  width: 100%;
  max-width: 450px;
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}

/* Estilo de las barras: Bordes redondeados */
.dx-bar-series rect {
  rx: 6; /* Radio horizontal */
  ry: 6; /* Radio vertical */
}
</style>
