// Archivo: MedicoStores.js
import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "../supabaseClient"; // Asegúrate de tener configurado supabaseClient

export const useMedicoStore = defineStore("medicoStore", () => {
  const medicos = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3"; // Reemplaza con tu tenant ID

  // Función para cargar médicos desde Supabase
  async function cargarMedicos() {
    const { data, error } = await supabase
      .from("medicos")
      .select("*")
      .eq("tenant_Id", tenantId); // Filtra por el tenant_Id
    if (error) {
      console.error("Error al cargar médicos:", error.message);
    } else {
      medicos.value = data;
    }
  }

  // Función para agregar un médico a la base de datos de Supabase
  async function agregarMedico(medico) {
    const { data, error } = await supabase
      .from("medicos")
      .insert([{ ...medico, tenant_Id: tenantId }]);

    if (error) {
      console.error("Error al agregar médico:", error.message);
      return null;
    } else if (data && data.length > 0) {
      medicos.value.push(data[0]);
      return data[0];
    }
  }

  // Función para eliminar un médico de la base de datos de Supabase
  async function eliminarMedico(id) {
    const { error } = await supabase.from("medicos").delete().eq("id", id);
    if (error) {
      console.error("Error al eliminar médico:", error.message);
      return false;
    } else {
      medicos.value = medicos.value.filter((medico) => medico.id !== id);
      return true;
    }
  }
  //
  //
  //
  // Función para actualizar un médico en la base de datos de Supabase
  async function actualizarMedico(medico) {
    if (!medico.id) {
      console.error("Error: el ID del médico es indefinido.");
      return false;
    }
    const { data, error } = await supabase
      .from("medicos")
      .update({
        nombre: medico.nombre,
        direccion: medico.direccion,
        especialidadId: medico.especialidadId,
        telefonoCasa: medico.telefonoCasa,
        email: medico.email,
      })
      .eq("id", medico.id);

    if (error) {
      console.error("Error al actualizar médico:", error.message);
      return false;
    } else if (data && data.length > 0) {
      // Actualiza el médico en la lista localmente
      const index = medicos.value.findIndex((item) => item.id === medico.id);
      if (index !== -1) {
        medicos.value[index] = data[0];
      }
      return true;
    }
  }

  // Llamar a cargarMedicos al montar la store
  cargarMedicos();

  return {
    medicos,
    agregarMedico,
    cargarMedicos,
    eliminarMedico,
    actualizarMedico,
  };
});
