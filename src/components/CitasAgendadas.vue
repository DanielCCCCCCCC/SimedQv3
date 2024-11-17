<template>
  <div class="card-container">
    <div class="info">
      <div class="amount">Citas Agendadas</div>
      <div class="label">Tendencia Semanal</div>
    </div>
    <DxChart
      v-if="appointmentsTrend.length > 0"
      :data-source="appointmentsTrend"
      :size="{ width: 500, height: 180 }"
    >
      <DxSeries
        type="bar"
        argument-field="period"
        value-field="count"
        color="#2f615e"
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

const store = useAppointmentsStore();

onMounted(() => {
  store.fetchAppointments();
});

const appointmentsTrend = computed(() =>
  store.appointmentsTrend.map((data) => ({
    ...data,
  }))
);
</script>

<style scoped>
.card-container {
  width: 530px;
  height: auto;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 0px;
  margin-bottom: 0px;
}

.icon {
  background-color: #fdecdc;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f48fb1;
  font-size: 24px;
}

.info {
  text-align: center;
  margin-top: 8px;
}

.amount {
  margin-top: -14px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.label {
  font-size: 12px;
  color: #888;
}

.dx-chart .dxc-area-series {
  fill: linear-gradient(
    to bottom,
    rgba(235, 84, 13, 0.5),
    rgba(223, 101, 15, 0)
  );
}
</style>
