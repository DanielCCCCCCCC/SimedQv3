<template>
  <div class="card-container">
    <!-- Botón "Ir" en la esquina superior derecha -->
    <button class="go-button" @click="goToScheduler">Ir</button>

    <div class="info">
      <!-- <div class="amount">Citas Agendadas</div> -->
      <div class="label">Tendencia Semanal</div>
    </div>
    <DxChart
      v-if="appointmentsTrend.length > 0"
      :data-source="appointmentsTrend"
      :size="{ width: 550, height: 230 }"
    >
      <DxSeries
        type="bar"
        argument-field="period"
        value-field="count"
        color="#26A69A"
        :point="{ visible: true, size: 8 }"
        :showInLegend="false"
      >
        <!-- Habilitar las etiquetas para mostrar el número de citas en cada punto -->
        <DxLabel :visible="true">
          <template #customizeText="{ valueText }">
            {{ valueText }} citas
          </template>
        </DxLabel>
      </DxSeries>
    </DxChart>
  </div>
</template>
<script setup>
import { DxChart, DxSeries, DxLabel } from "devextreme-vue/chart";
import { useAppointmentsStore } from "../stores/AppointmentsStore";
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

// Acceder al store de citas
const store = useAppointmentsStore();

// Acceder al router de Vue
const router = useRouter();

// Obtener la tendencia de citas desde el store
const appointmentsTrend = computed(() =>
  store.appointmentsTrend.map((data) => ({
    ...data,
  }))
);

// Fetch de citas al montar el componente
onMounted(() => {
  store.fetchAppointments();
});

// Función para redirigir al scheduler
const goToScheduler = () => {
  router.push("/controlCitasv2");
};
</script>
<style scoped>
.card-container {
  position: relative;
  width: 570px;
  top: -40px;
  padding: 16px;
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 0px;
}

.go-button {
  position: absolute;
  top: -20px;
  right: 16px;
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

.info {
  text-align: center;
  margin-top: 40px; /* Ajustado para no interferir con el botón */
}

.label {
  font-size: 18px;
  color: #888;
}

.dx-chart .dxc-area-series {
  fill: linear-gradient(
    to bottom,
    rgba(235, 84, 13, 0.5),
    rgba(223, 101, 15, 0)
  );
}

/* Opcional: Asegurar que el gráfico no se superponga con el botón */
.card-container > .info,
.card-container > DxChart {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
