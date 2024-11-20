<template>
  <q-card class="q-pa-sm q-mt-md bg-grey-1 rounded shadow-2xl">
    <!-- DataGrid -->
    <DxDataGrid
      :data-source="hospitales"
      key-expr="id"
      :show-borders="true"
      class="custom-data-grid"
      :allow-column-reordering="true"
      :column-auto-width="true"
      :column-resizing-mode="'widget'"
      height="400px"
    >
      <!-- Columnas -->
      <DxColumn data-field="nombre" caption="Nombre del Hospital">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="direccion" caption="Dirección">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="telefono" caption="Teléfono">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="email" caption="Correo Electrónico">
        <DxRequiredRule />
      </DxColumn>
      <DxColumn data-field="web" caption="Sitio Web" width="200px">
        <DxRequiredRule />
      </DxColumn>

      <!-- Botones de edición y eliminación -->
      <DxColumn type="buttons">
        <DxButton icon="edit" hint="Editar" @click="abrirFormularioEdicion" />
        <DxButton icon="trash" hint="Eliminar" @click="eliminarHospital" />
      </DxColumn>
    </DxDataGrid>

    <!-- Formulario de edición (modal) -->
    <q-dialog v-model="mostrarDialogo">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">Editar Hospital</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarCambios">
            <q-input
              v-model="hospitalSeleccionado.nombre"
              label="Nombre del Hospital"
              required
            />
            <q-input
              v-model="hospitalSeleccionado.direccion"
              label="Dirección"
              required
            />
            <q-input
              v-model="hospitalSeleccionado.telefono"
              label="Teléfono"
              required
            />
            <q-input
              v-model="hospitalSeleccionado.email"
              label="Correo Electrónico"
              type="email"
              required
            />
            <q-input
              v-model="hospitalSeleccionado.web"
              label="Sitio Web"
              type="url"
            />

            <div class="q-mt-md">
              <q-btn label="Guardar" color="primary" type="submit" />
              <q-btn
                label="Cancelar"
                color="negative"
                flat
                @click="cerrarDialogo"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-card>
</template>

<script setup>
import {
  DxDataGrid,
  DxColumn,
  DxRequiredRule,
  DxButton,
} from "devextreme-vue/data-grid";
import { useHospitalStore } from "../stores/DirectoriosStores";
import { storeToRefs } from "pinia";
import { Notify } from "quasar";
import { ref, onMounted } from "vue";

// Acceder a la tienda de hospitales
const hospitalStore = useHospitalStore();
const { hospitales, hospitalSeleccionado } = storeToRefs(hospitalStore);

// Estado para el modal
const mostrarDialogo = ref(false);

// Cargar hospitales al montar el componente
onMounted(() => {
  hospitalStore.cargarHospitales();
});

// Abrir el formulario de edición
const abrirFormularioEdicion = (e) => {
  hospitalStore.setHospitalSeleccionado(e.row.data); // Actualiza el hospital seleccionado
  mostrarDialogo.value = true; // Abre el modal
};

// Guardar los cambios del formulario
const guardarCambios = async () => {
  try {
    await hospitalStore.actualizarHospital(hospitalSeleccionado.value);
    Notify.create({
      type: "positive",
      message: "Hospital actualizado con éxito",
      position: "top-right",
    });
    cerrarDialogo();
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al actualizar el hospital",
      position: "top-right",
    });
    console.error("Error al guardar cambios:", error);
  }
};

// Cerrar el modal
const cerrarDialogo = () => {
  mostrarDialogo.value = false;
  hospitalStore.setHospitalSeleccionado(null); // Limpia el hospital seleccionado
};

// Eliminar hospital
const eliminarHospital = async (e) => {
  const hospitalId = e.row.data.id;
  try {
    await hospitalStore.eliminarHospital(hospitalId);
    Notify.create({
      type: "negative",
      message: "Hospital eliminado",
      position: "top-right",
    });
  } catch (error) {
    Notify.create({
      type: "negative",
      message: "Error al eliminar el hospital",
      position: "top-right",
    });
    console.error("Error al eliminar hospital:", error);
  }
};
</script>

<style scoped>
.custom-data-grid {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.q-card {
  margin: auto;
}
</style>
