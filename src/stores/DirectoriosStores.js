// src/stores/ConfiMedicasStores.js
import { defineStore } from "pinia";
import { ref, reactive, watch, onMounted } from "vue";
import { supabase } from "../supabaseClient";

// Helper para cargar y guardar en localStorage
function loadFromLocalStorage(key, defaultValue) {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
}

function saveToLocalStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

//
//
//
//
//
//
//// Tienda para Hospitales
export const useHospitalStore = defineStore("hospitalStore", () => {
  const hospitales = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";

  const cargarHospitales = async () => {
    try {
      const { data, error } = await supabase
        .from("hospitales")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar hospitales:", error);
      } else {
        hospitales.value = data || [];
      }
      console.log("Hospitales:", hospitales.value);
    } catch (err) {
      console.error("Error en cargarHospitales:", err.message);
    }
  };

  const agregarHospital = async (hospitalInfo) => {
    const hospitalConTenant = { ...hospitalInfo, tenant_Id }; // Agrega tenant_Id al crear un hospital

    try {
      const { data, error } = await supabase
        .from("hospitales")
        .insert([hospitalConTenant], { returning: "representation" });

      if (error) {
        console.error("Error al agregar hospital:", error);
      } else if (data && data[0]) {
        hospitales.value.push(data[0]);
      }
    } catch (err) {
      console.error("Error en agregarHospital:", err.message);
    }
  };

  const eliminarHospital = async (id) => {
    try {
      const { error } = await supabase.from("hospitales").delete().eq("id", id);

      if (error) {
        console.error("Error al eliminar hospital:", error);
      } else {
        hospitales.value = hospitales.value.filter((h) => h.id !== id);
      }
    } catch (err) {
      console.error("Error en eliminarHospital:", err.message);
    }
  };

  return { hospitales, cargarHospitales, agregarHospital, eliminarHospital };
});

//
//
//
//
//
//
//
///
///Tienda para Medicamentos
export const useMedicamentoStore = defineStore("medicamentoStore", () => {
  const medicamentos = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";

  const cargarMedicamentos = async () => {
    try {
      const { data, error } = await supabase

        .from("medicamentos")
        .select("*")

        .order("created_at", { ascending: true });
      if (error) {
        console.error("Error al cargar hospitales:", error);
      } else {
        medicamentos.value = data || []; // Asigna el array completo a `hospitales.value`
      }
      console.log("Medicamentos:", medicamentos.value); // Para depurar
    } catch (err) {
      console.error("Error en cargarmMdicamentos:", err.message);
    }
  };

  const agregarMedicamento = async (medicamento) => {
    // Verifica si el medicamento ya existe
    if (!medicamentos.value.some((m) => m.codigo === medicamento.codigo)) {
      const { data, error } = await supabase
        .from("medicamentos")
        .insert([{ ...medicamento, tenant_Id: tenantId }])
        .select(); // Asegura que siempre intente devolver los datos insertados

      if (error) {
        console.error("Error al agregar medicamento:", error);
        return;
      }

      if (data && data.length > 0) {
        medicamentos.value.push(data[0]);
      } else {
        console.warn("No se devolvieron datos después de la inserción.");
      }
    } else {
      console.warn("Este medicamento ya existe.");
    }
  };

  const eliminarMedicamento = async (id) => {
    const { error } = await supabase.from("medicamentos").delete().eq("id", id);

    if (error) {
      console.error("Error al eliminar medicamento:", error);
    } else {
      medicamentos.value = medicamentos.value.filter((m) => m.id !== id);
    }
  };

  return {
    medicamentos,
    cargarMedicamentos,
    agregarMedicamento,
    eliminarMedicamento,
  };
});

///
///
///
///
//
///
// Tienda para Estudios
export const useEstudioStore = defineStore("examenesEstudios", () => {
  const estudios = ref([]);
  const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3";

  const cargarEstudios = async () => {
    try {
      const { data, error } = await supabase

        .from("examenesEstudios")
        .select("*")

        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar hospitales:", error);
      } else {
        estudios.value = data || []; // Asigna el array completo a `hospitales.value`
      }
      console.log("Medicamentos:", estudios.value); // Para depurar
    } catch (err) {
      console.error("Error en cargarmMdicamentos:", err.message);
    }
  };

  const agregarEstudio = async (estudioInfo) => {
    const { data, error } = await supabase.from("examenesEstudios").insert([
      {
        ...estudioInfo,
        tenant_id: tenantId,
        updated_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("Error al agregar estudio:", error);
    } else if (data && data.length > 0) {
      estudios.value.push(data[0]);
    }
  };

  const eliminarEstudio = async (id) => {
    const { error } = await supabase
      .from("examenesEstudios")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error al eliminar la cita:", error);
    } else {
      estudios.value = estudios.value.filter((estudios) => estudios.id !== id);
    }
    onMounted(cargarEstudios);
  };

  return {
    estudios,
    cargarEstudios,
    agregarEstudio,
    eliminarEstudio,
  };
});
