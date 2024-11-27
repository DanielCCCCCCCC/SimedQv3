<template>
  <div class="grafico-container">
    <!-- Botón "Ir" en la esquina superior derecha -->
    <button class="go-button" @click="goToScheduler">Ir</button>

    <!-- Muestra el gráfico solo cuando los datos están listos -->
    <DxPieChart
      v-if="datosCargados"
      id="pie"
      :data-source="dataGraficoPacientes"
      type="doughnut"
      palette="Soft Pastel"
      color="#26A69A"
      width="350"
      height="230"
    >
      <DxSeries argument-field="estado" value-field="cantidad">
        <DxLabel :visible="true">
          <DxConnector :visible="true" />
        </DxLabel>
      </DxSeries>
      <DxExport :enabled="false" />
      <DxLegend
        :margin="0"
        horizontal-alignment="left"
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
import { useRouter } from "vue-router";

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

// Acceder al router de Vue
const router = useRouter();

// Función para redirigir al scheduler
const goToScheduler = () => {
  router.push("/controlCitasv2");
};
</script>

<style scoped>
.grafico-container {
  position: relative; /* Para posicionar el botón de forma absoluta dentro del contenedor */
  top: 10px;
  width: 100%;
  max-width: 400px; /* Ajusta según tus necesidades */
  padding: 16px;
  border-radius: 8px;
  height: 230px;
  background-color: #fff;
  margin: 0 auto; /* Centrar el contenedor si es necesario */
}

.go-button {
  position: absolute;
  top: -70px;
  right: -5px;
  background-color: rgba(0, 0, 0, 0.05); /* Casi transparente */
  border: none;
  color: #333;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s, color 0.3s;
}

.go-button:hover {
  background-color: rgba(
    0,
    0,
    0,
    0.1
  ); /* Un poco más visible al pasar el cursor */
  color: #000;
}

.titulo {
  margin-top: 10px;
  font-family: "Segoe UI Light", "Helvetica Neue", "Trebuchet MS", "Verdana",
    "sans-serif";
  text-align: center;
}

/* Estilos adicionales si es necesario */
.dx-chart,
.dx-pie-chart {
  width: 100%; /* Asegura que el gráfico ocupe todo el ancho disponible */
  height: auto; /* Ajusta la altura automáticamente */
  max-width: 500px; /* Limita el tamaño máximo del gráfico */
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
  padding: 16px;
}

/* Estilo base para las tarjetas */
.card {
  display: flex;
  justify-content: center; /* Centra horizontalmente el contenido */
  align-items: center; /* Centra verticalmente el contenido */
  flex-direction: column; /* Asegura que los elementos estén en columna */
  margin-top: 10px;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  min-height: 300px; /* Altura mínima para evitar cambios abruptos */
  transition: all 0.3s ease; /* Transición suave al cambiar tamaño */
}

/* Centrar específicamente los gráficos internos */
.dx-chart .dxc-series-group,
.dx-pie-chart .dxc-series-group {
  transform: translate(0, 0); /* Asegura que el gráfico esté centrado */
}

/* Centrar la leyenda y otros elementos dentro del gráfico */
.dx-chart .dxc-legend,
.dx-pie-chart .dxc-legend {
  text-align: center;
  margin-top: 16px; /* Espaciado entre la leyenda y el gráfico */
  align-self: center;
}
</style>
