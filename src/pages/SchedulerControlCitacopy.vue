<template>
  <div class="scheduler-container">
    <CitasAgendadas />
  </div>
  <!-- <div>
    <q-btn label="Seleccionar Paciente" @click="openPatientModal" />
    <span v-if="selectedPatient">{{ selectedPatient }}</span>
    <span v-else>No seleccionado</span>
  </div> -->

  <div class="scheduler-container">
    <DxScheduler
      :data-source="computedAppointments"
      :current-view="currentView"
      :current-date="currentDate"
      :time-zone="'America/Tegucigalpa'"
      :height="650"
      :cell-duration="30"
      :start-day-hour="0"
      :end-day-hour="24"
      :views="views"
      :first-day-of-week="1"
      :onAppointmentAdded="onAppointmentAdded"
      :onAppointmentUpdated="onAppointmentUpdated"
      :onAppointmentDeleted="onAppointmentDeleted"
      @appointmentFormOpening="onAppointmentFormOpening"
      key-expr="id"
    >
      <DxView type="day" name="Día" />
      <DxView type="workWeek" name="Días Laborales" />
      <DxView type="week" name="Semana" />
      <DxView type="month" name="Mes" />
      <DxView type="agenda" name="Agenda" />
    </DxScheduler>

    <!-- Modal para buscar pacientes -->
    <q-dialog v-model="isModalOpen" persistent>
      <q-card style="width: 80%; max-width: 800px">
        <q-card-section>
          <div class="text-h6">Seleccionar Paciente</div>
        </q-card-section>
        <q-card-section>
          <DxDataGrid
            :data-source="formIdentificacion"
            :show-borders="true"
            :height="400"
            @selection-changed="onPatientSelected"
          >
            <DxSearchPanel
              :width="300"
              :visible="true"
              placeholder="Buscar Paciente"
            />

            <DxSelection mode="single" />
            <DxColumn data-field="nombres" caption="Nombres" />
            <DxColumn data-field="apellidos" caption="Apellidos" />
            <DxColumn data-field="dni" caption="DNI" />
            <DxColumn data-field="tipoDescripcion" caption="Tipo" />
          </DxDataGrid>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cerrar" @click="isModalOpen = false" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { DxScheduler, DxView } from "devextreme-vue/scheduler";

import { useAppointmentsStore } from "../stores/AppointmentsStore";
import { useMedicoStore } from "../stores/MedicoStores";
import { useTiposCitasStore } from "src/stores/ConfiMedicasStores";
import { useFichaIdentificacionStore } from "src/stores/fichaIdentificacionStores";
import { onMounted, ref, computed } from "vue";
import { storeToRefs } from "pinia";
import CitasAgendadas from "src/components/CitasAgendadas.vue";
import {
  DxDataGrid,
  DxColumn,
  DxSelection,
  DxSearchPanel,
} from "devextreme-vue/data-grid";
import { supabase } from "../supabaseClient";
import { Notify } from "quasar"; // Importar Notify de Quasar

// Variables reactivas
const isModalOpen = ref(false);
const selectedPatient = ref(null);
const selectedPatientId = ref(null);
const appointmentForm = ref(null);
const currentAppointmentData = ref(null);

const store = useAppointmentsStore();
const MedicoStore = useMedicoStore();
const TiposCitasStore = useTiposCitasStore();
const FichaIdentificacionStore = useFichaIdentificacionStore();

const { medicos } = storeToRefs(MedicoStore);
const { citas } = storeToRefs(TiposCitasStore);
const { formIdentificacion } = storeToRefs(FichaIdentificacionStore);

const appointments = computed(() => store.appointments);
const currentDate = ref(new Date());
const currentView = ref("month");
const views = ["day", "week", "workWeek", "month", "agenda"];

onMounted(() => {
  store.fetchAppointments();
  MedicoStore.cargarMedicos();
  TiposCitasStore.cargarCitas();
  FichaIdentificacionStore.cargarDatos();
  console.log("Datos de pacientes cargados:", formIdentificacion.value);
});

// Función para obtener el inicio del día a las 12:00 AM
const getStartOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
};

// Función para obtener el final del día a las 11:59 PM
const getEndOfDay = (date) => {
  const newDate = new Date(date);
  newDate.setHours(23, 59, 59, 999);
  return newDate;
};

// Función para formatear la fecha a ISO sin zona horaria
const formatDateToISO = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

// Función para verificar superposición de citas
const checkAppointmentOverlap = async (appointment) => {
  const { startDate, endDate, medico, nombre, id } = appointment;

  // Formatear las fechas
  const start = formatDate(startDate);
  const end = formatDate(endDate);

  // Construir la consulta
  const { data: overlappingAppointments, error } = await supabase
    .from("appointments")
    .select("*")
    .neq("id", id || 0)
    .or(`medico.eq.${medico},nombre.eq.${nombre}`)
    .lt("startDate", end)
    .gt("endDate", start);

  if (error) {
    console.error("Error al verificar superposiciones:", error);
    throw error;
  }

  return overlappingAppointments.length > 0;
};

const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

// Computed property para concatenar título y nombre del paciente
const computedAppointments = computed(() =>
  store.appointments.map((appointment) => {
    const paciente = formIdentificacion.value.find(
      (p) => p.id === parseInt(appointment.nombre)
    );
    const nombrePaciente = paciente
      ? `${paciente.nombres} ${paciente.apellidos}`
      : "Paciente no asignado";

    return {
      ...appointment,
      text: `${appointment.title} - ${nombrePaciente}`,
      startDate: new Date(appointment.startDate),
      endDate: new Date(appointment.endDate),
    };
  })
);

// Abrir modal al hacer clic en "Seleccionar Paciente"
const openPatientModal = () => {
  console.log(formIdentificacion.value);
  isModalOpen.value = true;
};

const onAppointmentFormOpening = (e) => {
  const form = e.form;
  appointmentForm.value = form;
  currentAppointmentData.value = e.appointmentData;
  const isAllDay = e.appointmentData.allDay || false;

  // Inicializar selectedPatient y selectedPatientId al editar una cita
  if (currentAppointmentData.value.nombre) {
    const paciente = formIdentificacion.value.find(
      (p) => p.id === parseInt(currentAppointmentData.value.nombre)
    );
    if (paciente) {
      selectedPatient.value = `${paciente.nombres} ${paciente.apellidos}`;
      selectedPatientId.value = paciente.id;
    } else {
      selectedPatient.value = "No seleccionado";
      selectedPatientId.value = null;
    }
  } else {
    selectedPatient.value = "No seleccionado";
    selectedPatientId.value = null;
  }

  form.option("items", [
    {
      itemType: "group",
      caption: "Detalles de la Cita",
      colCount: 1,
      items: [
        {
          dataField: "title",
          editorType: "dxTextBox",
          label: { text: "Asunto de la cita" },
          editorOptions: {
            value: e.appointmentData.title || e.appointmentData.text,
          },
        },
        {
          dataField: "allDay",
          editorType: "dxCheckBox",
          label: { text: "Todo el día" },
          editorOptions: {
            value: isAllDay,
            onValueChanged: (args) => {
              const isChecked = args.value;
              form.getEditor("startDate").option("disabled", isChecked);
              form.getEditor("endDate").option("disabled", isChecked);

              if (isChecked) {
                const startDate = getStartOfDay(
                  form.getEditor("startDate").option("value")
                );
                const endDate = getEndOfDay(
                  form.getEditor("startDate").option("value")
                );

                form.updateData("startDate", startDate);
                form.updateData("endDate", endDate);
              }
            },
          },
        },
        {
          dataField: "startDate",
          editorType: "dxDateBox",
          label: { text: "Fecha y Hora Inicial" },
          editorOptions: {
            type: "datetime",
            displayFormat: "dd/MM/yyyy hh:mm a",
            value: e.appointmentData.startDate,
            disabled: isAllDay,
            onValueChanged: (args) => {
              const startDate = args.value;
              const endDate = new Date(startDate);
              endDate.setMinutes(endDate.getMinutes() + 30);
              form.updateData("endDate", endDate);
            },
          },
        },
        {
          dataField: "endDate",
          editorType: "dxDateBox",
          label: { text: "Fecha y Hora Final" },
          editorOptions: {
            type: "datetime",
            displayFormat: "dd/MM/yyyy hh:mm a",
            value: e.appointmentData.endDate,
            disabled: isAllDay,
          },
        },
        {
          dataField: "tipoCita",
          editorType: "dxSelectBox",
          label: { text: "Tipo de Cita" },
          editorOptions: {
            dataSource: citas.value,
            displayExpr: "descripcion",
            valueExpr: "id",
            value: parseInt(e.appointmentData.tipoCita),
            placeholder: "Selecciona un tipo de cita",
          },
        },
      ],
    },
    {
      itemType: "group",
      caption: "Información del Paciente",
      colCount: 1,
      items: [
        {
          dataField: "selectedPatientName",
          editorType: "dxTextBox",
          label: { text: "Paciente Seleccionado" },
          editorOptions: {
            readOnly: true,
            value: selectedPatient.value,
          },
        },
        {
          itemType: "simple",
          template: () => {
            const container = document.createElement("div");

            // Botón para abrir el modal
            const button = document.createElement("button");
            button.textContent = "Seleccionar Paciente";
            button.className = "btn btn-primary";
            button.onclick = () => openPatientModal();

            container.appendChild(button);
            return container;
          },
        },
        {
          dataField: "medico",
          editorType: "dxSelectBox",
          label: { text: "Médico" },
          editorOptions: {
            dataSource: medicos.value,
            displayExpr: "nombre",
            valueExpr: "id",
            value: parseInt(e.appointmentData.medico),
            placeholder: "Selecciona un médico",
          },
        },
        {
          dataField: "description",
          editorType: "dxTextArea",
          label: { text: "Descripción" },
          editorOptions: {
            value: e.appointmentData.description,
          },
        },
      ],
    },
  ]);
};

const onAppointmentAdded = async (e) => {
  try {
    const appointmentData = e.appointmentData;

    // Preparar nueva cita con fechas formateadas
    const newAppointment = {
      title: appointmentData.title || appointmentData.text,
      startDate: appointmentData.allDay
        ? formatDate(getStartOfDay(appointmentData.startDate))
        : formatDate(appointmentData.startDate),
      endDate: appointmentData.allDay
        ? formatDate(getEndOfDay(appointmentData.startDate))
        : formatDate(appointmentData.endDate),
      allDay: appointmentData.allDay,
      repeat: appointmentData.repeat,
      description: appointmentData.description,
      nombre: selectedPatientId.value, // ID del paciente seleccionado
      medico: appointmentData.medico,
      tipoCita: appointmentData.tipoCita,
    };

    // Verificar superposición de citas
    const hasOverlap = await checkAppointmentOverlap({
      ...newAppointment,
      id: 0, // ID 0 para nuevas citas
    });

    if (hasOverlap) {
      // Notificar al usuario
      Notify.create({
        message:
          "El médico o el paciente ya tiene una cita en este rango de tiempo.",
        color: "negative",
        position: "top-right",
      });
      // Cancelar la operación
      throw new Error("Superposición de citas detectada.");
    }

    // Guardar la cita si no hay superposición
    const { data, error } = await store.addAppointment(newAppointment);

    if (error) {
      console.error("Error al guardar la cita en Supabase:", error.message);
    } else if (data && data[0]) {
      console.log("Cita agregada exitosamente:", data[0]);
      await store.fetchAppointments();
    } else {
      console.error("No se pudo obtener la cita creada de Supabase.");
    }
  } catch (error) {
    console.error("Error al agregar la cita:", error);
  }
};

const onAppointmentUpdated = async (e) => {
  try {
    const appointmentData = e.appointmentData;

    // Preparar cita actualizada con fechas formateadas
    const updatedAppointment = {
      id: appointmentData.id,
      title: appointmentData.title || appointmentData.text,
      startDate: appointmentData.allDay
        ? formatDate(getStartOfDay(appointmentData.startDate))
        : formatDate(appointmentData.startDate),
      endDate: appointmentData.allDay
        ? formatDate(getEndOfDay(appointmentData.startDate))
        : formatDate(appointmentData.endDate),
      allDay: appointmentData.allDay,
      repeat: appointmentData.repeat,
      description: appointmentData.description,
      nombre: selectedPatientId.value || appointmentData.nombre,
      medico: appointmentData.medico,
      tipoCita: appointmentData.tipoCita,
    };

    // Verificar superposición de citas
    const hasOverlap = await checkAppointmentOverlap(updatedAppointment);

    if (hasOverlap) {
      // Notificar al usuario
      Notify.create({
        message:
          "El médico o el paciente ya tiene una cita en este rango de tiempo.",
        color: "negative",
        position: "top",
      });
      // Cancelar la operación
      throw new Error("Superposición de citas detectada.");
    }

    // Actualizar la cita si no hay superposición
    if (appointmentData.id) {
      await store.updateAppointment(appointmentData.id, updatedAppointment);
      console.log("Cita actualizada exitosamente:", updatedAppointment);
      await store.fetchAppointments();
    } else {
      console.error("No se encontró el ID de la cita para actualizar");
    }
  } catch (error) {
    console.error("Error al actualizar la cita:", error);
  }
};

const onAppointmentDeleted = async (e) => {
  try {
    await store.deleteAppointment(e.appointmentData.id);

    // Después de eliminar, recargar las citas
    await store.fetchAppointments();
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
  }
};

// Manejar selección de paciente desde el modal
const onPatientSelected = (e) => {
  const patient = e.selectedRowsData[0];
  if (patient) {
    const { nombres, apellidos, id } = patient;
    selectedPatient.value = `${nombres} ${apellidos}`;
    selectedPatientId.value = id;

    // Actualizar datos del formulario sin sobrescribir otros campos
    if (appointmentForm.value && currentAppointmentData.value) {
      currentAppointmentData.value.nombre = id; // Almacena el ID del paciente
      appointmentForm.value.updateData(
        "selectedPatientName",
        selectedPatient.value
      );
    }

    isModalOpen.value = false;
  }
};
</script>

<style scoped>
.scheduler-container {
  background-color: #f9fafc;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.dx-scheduler .dx-scheduler-header-panel-cell {
  font-weight: bold;
  color: #333;
}

.dx-scheduler .dx-scheduler-time-panel-cell {
  font-size: 14px;
  color: #666;
}

.dx-scheduler .dx-scheduler-navigator-previous,
.dx-scheduler .dx-scheduler-navigator-next {
  color: #1976d2;
}

.dx-scheduler .dx-scheduler-navigator-caption {
  font-size: 18px;
  color: #1976d2;
  font-weight: bold;
}
</style>
