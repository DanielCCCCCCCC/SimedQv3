<template>
  <div class="paciente-details-card">
    <button class="close-button" @click="$emit('close')">&times;</button>

    <div class="header">
      <img
        :src="form.photo || 'https://via.placeholder.com/100'"
        alt="Foto del paciente"
        class="patient-photo"
      />
      <div class="header-info">
        <div class="name-container">
          <p id="titulo">{{ form.nombres }} {{ form.apellidos }}</p>
          <p v-if="!isEditable"></p>
          <div v-else>
            <!-- <q-input
              v-model="form.nombres"
              label="Nombre"
              outlined
              dense
              :rules="[(val) => !!val || 'Este campo es obligatorio']"
            />
            <q-input
              v-model="form.apellidos"
              label="Apellido"
              outlined
              dense
              :rules="[(val) => !!val || 'Este campo es obligatorio']"
            /> -->
          </div>
        </div>
        <span
          class="status"
          :class="{
            'active-status': form.activo,
            'inactive-status': !form.activo,
          }"
        >
          {{ form.activo ? "Activo" : "Inactivo" }}
        </span>
        <q-checkbox
          v-if="isEditable"
          v-model="form.activo"
          label="Estado Activo"
          color="primary"
          dense
        />
      </div>
    </div>

    <div class="details">
      <!-- Información Personal -->
      <div class="detail-item">
        <h3 class="section-title">Información Personal</h3>
        <q-input
          v-model="form.nombres"
          label="Nombre"
          outlined
          dense
          v-if="isEditable"
          :rules="[(val) => !!val || 'Este campo es obligatorio']"
        />
        <div v-else class="detail-text">{{ form.nombres }}</div>

        <q-input
          v-model="form.apellidos"
          label="Apellido"
          outlined
          dense
          v-if="isEditable"
          :rules="[(val) => !!val || 'Este campo es obligatorio']"
        />
        <div v-else class="detail-text">{{ form.apellidos }}</div>

        <q-input
          v-model="form.dni"
          label="DNI"
          outlined
          dense
          v-if="isEditable"
          :rules="[(val) => !!val || 'Este campo es obligatorio']"
        />
        <div v-else class="detail-text">{{ form.dni }}</div>

        <q-input
          v-if="isEditable"
          v-model="form.fechaNacimiento"
          label="Fecha de Nacimiento"
          outlined
          dense
          type="date"
          :rules="[(val) => !!val || 'Este campo es obligatorio']"
        />
        <q-input
          v-if="isEditable"
          v-model="form.sexo"
          label="Sexo"
          outlined
          dense
          :rules="[(val) => !!val || 'Este campo es obligatorio']"
        />

        <q-select
          v-if="isEditable"
          v-model="form.estadoCivil"
          :options="estadosCiviles"
          label="Estado Civil"
          option-value="id"
          option-label="descripcion"
          outlined
          dense
          :rules="[(val) => !!val || 'Selecciona un estado civil']"
        />
      </div>

      <!-- Datos de Contacto -->
      <div class="detail-item">
        <h3 class="section-title">Datos de Contacto</h3>
        <q-input
          v-model="form.telPersonal"
          label="Teléfono"
          outlined
          dense
          v-if="isEditable"
          :rules="[(val) => !!val || 'Este campo es obligatorio']"
        />
        <div v-else class="detail-text">{{ form.telPersonal }}</div>

        <q-input
          v-if="isEditable"
          v-model="form.telCasa"
          label="Teléfono Casa"
          outlined
          dense
        />
        <q-input
          v-model="form.email"
          label="Correo"
          outlined
          dense
          v-if="isEditable"
          :rules="[(val) => !!val || 'Este campo es obligatorio']"
        />
        <div v-else class="detail-text">{{ form.email }}</div>

        <q-input
          v-model="form.direccion"
          label="Dirección"
          outlined
          dense
          v-if="isEditable"
          :rules="[(val) => !!val || 'Este campo es obligatorio']"
        />
        <div v-else class="detail-text">{{ form.direccion }}</div>

        <q-select
          v-if="isEditable"
          v-model="form.departamento"
          :options="departamentos"
          option-value="id"
          option-label="descripcion"
          label="Departamento"
          outlined
          dense
          :rules="[(val) => !!val || 'Selecciona un departamento']"
        />

        <q-select
          v-if="isEditable"
          v-model="form.municipio"
          :options="filteredMunicipios"
          option-value="id"
          option-label="descripcion"
          label="Municipio"
          outlined
          dense
          :rules="[(val) => !!val || 'Selecciona un municipio']"
        />

        <q-input
          v-model="form.organizacion"
          label="Organización"
          outlined
          dense
          v-if="isEditable"
        />
      </div>
      <!-- Información Médica -->
      <div class="detail-item">
        <h3 class="section-title">Información Médica</h3>
        <q-select
          v-if="isEditable"
          v-model="form.medico"
          :options="medicos"
          option-value="id"
          option-label="nombre"
          label="Seleccione el Médico"
          outlined
          dense
          :rules="[(val) => !!val || 'Selecciona un médico']"
        />
        <div v-else class="detail-text">
          {{ form.medico?.nombre || "Sin asignar" }}
        </div>

        <q-select
          v-if="isEditable"
          v-model="form.tipo"
          :options="tpacientes"
          option-value="id"
          option-label="descripcion"
          label="Tipo de Paciente"
          outlined
          dense
          :rules="[(val) => !!val || 'Selecciona un tipo de paciente']"
        />

        <q-select
          v-if="isEditable"
          v-model="form.grupoSanguineo"
          :options="gruposSanguineos"
          option-value="id"
          option-label="descripcion"
          label="Grupo Sanguíneo"
          outlined
          dense
          :rules="[(val) => !!val || 'Selecciona un grupo sanguíneo']"
        />

        <q-input
          v-if="isEditable"
          v-model="form.alergias"
          label="Alergias"
          outlined
          dense
        />
      </div>
    </div>

    <div class="actions">
      <q-btn
        label="Editar"
        color="primary"
        @click="toggleEdit"
        v-if="!isEditable"
      />
      <q-btn
        label="Guardar"
        color="positive"
        @click="guardarDatosFormulario"
        v-if="isEditable"
        :disable="!isFormValid"
      />
    </div>
  </div>
  <div class="p">
    <p>@Dios te bendiga</p>
  </div>
</template>
<script>
import { ref, reactive, computed, watch, onMounted } from "vue";
import { useFichaIdentificacionStore } from "../stores/fichaIdentificacionStores";
import { useTiposPacientesStore } from "../stores/ConfiMedicasStores";
import {
  useEstadoCivilStore,
  useDepartamentoStore,
  useMunicipioStore,
  useGrupoSanguineoStore,
  useEscolaridadStore,
} from "../stores/DatosGeneralesStores";
import { useMedicoStore } from "src/stores/MedicoStores";
import { storeToRefs } from "pinia";

export default {
  name: "PacientePanel",
  emits: ["close"],
  props: {
    paciente: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const fichaIdentificacionStore = useFichaIdentificacionStore();
    const { actualizarPaciente } = fichaIdentificacionStore;
    const form = reactive({ ...props.paciente });
    const isEditable = ref(false);

    const {
      tpacientes,
      estadosCiviles,
      departamentos,
      municipios,
      gruposSanguineos,
      escolaridades,
      medicos,
    } = storeToRefs({
      tpacientes: useTiposPacientesStore().tpacientes,
      estadosCiviles: useEstadoCivilStore().estadosCiviles,
      departamentos: useDepartamentoStore().departamentos,
      municipios: useMunicipioStore().municipios,
      gruposSanguineos: useGrupoSanguineoStore().gruposSanguineos,
      escolaridades: useEscolaridadStore().escolaridades,
      medicos: useMedicoStore().medicos,
    });

    const filteredMunicipios = computed(() => {
      if (!form.departamento) return [];
      return municipios.value.filter(
        (municipio) => municipio.departamentoId === form.departamento.id
      );
    });

    const setSelectedValues = () => {
      form.tipo =
        tpacientes.value.find((tipo) => tipo.id === props.paciente.tipoId) ||
        null;

      form.medico =
        medicos.value.find((medico) => medico.id === props.paciente.medicoId) ||
        null;

      form.estadoCivil =
        estadosCiviles.value.find(
          (estado) => estado.id === props.paciente.estadoCivilId
        ) || null;

      form.departamento =
        departamentos.value.find(
          (depto) => depto.id === props.paciente.departamentoId
        ) || null;

      form.municipio =
        municipios.value.find(
          (muni) => muni.id === props.paciente.municipioId
        ) || null;

      form.escolaridad =
        escolaridades.value.find(
          (esc) => esc.id === props.paciente.escolaridadId
        ) || null;

      form.grupoSanguineo =
        gruposSanguineos.value.find(
          (grupo) => grupo.id === props.paciente.grupoSanguineoId
        ) || null;
    };

    watch(
      () => props.paciente,
      (newPaciente) => {
        Object.assign(form, newPaciente);
        setSelectedValues();
      },
      { immediate: true, deep: true }
    );

    onMounted(setSelectedValues);

    const toggleEdit = () => {
      isEditable.value = !isEditable.value;
    };

    const isFormValid = computed(() => {
      return (
        form.nombres &&
        form.apellidos &&
        form.dni &&
        form.fechaNacimiento &&
        form.sexo &&
        form.estadoCivil &&
        form.telPersonal &&
        form.email &&
        form.direccion &&
        form.departamento &&
        form.municipio &&
        form.medico &&
        form.tipo &&
        form.grupoSanguineo
      );
    });

    const guardarDatosFormulario = () => {
      const pacienteActualizado = {
        id: form.id,
        fechaRegistro: form.fechaRegistro,
        codigo: form.codigo,
        activo: form.activo,
        tipoId: form.tipo?.id,
        medicoId: form.medico?.id,
        dni: form.dni,
        nombres: form.nombres,
        apellidos: form.apellidos,
        fechaNacimiento: form.fechaNacimiento,
        sexo: form.sexo,
        estadoCivilId: form.estadoCivil?.id,
        direccion: form.direccion,
        telCasa: form.telCasa,
        telPersonal: form.telPersonal,
        email: form.email,
        departamentoId: form.departamento?.id,
        municipioId: form.municipio?.id,
        organizacion: form.organizacion,
        conyugue: form.conyugue,
        madre: form.madre,
        padre: form.padre,
        escolaridadId: form.escolaridad?.id,
        ocupacion: form.ocupacion,
        grupoSanguineoId: form.grupoSanguineo?.id,
        alergias: form.alergias,
        vih: form.vih ?? false,
      };

      actualizarPaciente(pacienteActualizado)
        .then(() => {
          isEditable.value = false;
        })
        .catch((error) => {
          console.error("Error al actualizar los datos del paciente:", error);
        });
    };

    return {
      form,
      isEditable,
      toggleEdit,
      guardarDatosFormulario,
      isFormValid,
      tpacientes,
      estadosCiviles,
      departamentos,
      municipios,
      gruposSanguineos,
      escolaridades,
      filteredMunicipios,
      medicos,
    };
  },
};
</script>

<style scoped>
.paciente-details-card {
  padding-top: 35px;
  padding-left: 14px;
  background-color: #ffffff;
  border-radius: 8px;
  max-width: 400px;
  width: 285px;
  margin: auto;
  margin-top: 40px;
  position: relative;
}

#titulo {
  font-size: 20px;
  margin: 0;
}

.name-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.section-title {
  font-size: 16px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
  color: #333;
}
.header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 5px;
}

.patient-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 15px;
}

.header-info {
  flex: 1;
}

.status {
  font-size: 14px;
  padding: 2px 6px;
  border-radius: 4px;
  margin-top: 4px;
}

.active-status {
  color: #28a745;
  background-color: #e6f4ea;
}

.inactive-status {
  color: #dc3545;
  background-color: #f8d7da;
}

.details {
  margin-bottom: 20px;
}

.detail-item {
  margin-bottom: 15px;
}

.label {
  display: block;
  font-weight: 600;
  margin-bottom: 5px;
}

.detail-text {
  font-size: 14px;
  padding: 4px 0;
}

.actions {
  display: flex;
  justify-content: space-between;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
.p {
  margin-top: 15px;
  margin-right: 5px;
  font-size: 10px;
  text-align: right;
  color: darkred;
}
</style>
