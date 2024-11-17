import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { supabase } from "../supabaseClient"; // Asegúrate de tener configurado supabaseClient
import { parseISO, format, startOfMonth, endOfMonth } from "date-fns"; // Asegúrate de importar parseISO
import { es } from "date-fns/locale";

export const useFichaIdentificacionStore = defineStore(
  "fichaIdentificacion",
  () => {
    const formIdentificacion = ref([]);
    const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3"; // Reemplaza con tu tenant ID

    const cargarDatos = async () => {
      const { data, error } = await supabase
        .from("fichaIdentificacion")
        .select("*")

        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar los datos de identificación:", error);
      } else {
        formIdentificacion.value = data || [];
      }
    };

    const guardarDatos = async (nuevoFormulario) => {
      const fechaRegistro = new Date().toLocaleDateString("en-CA");
      const { data, error } = await supabase
        .from("fichaIdentificacion")
        .insert([{ ...nuevoFormulario, fechaRegistro, tenant_id: tenantId }]);

      if (error) {
        console.error("Error al guardar los datos de identificación:", error);
      } else if (data && data[0]) {
        formIdentificacion.value.push(data[0]);
      }
    };
    const actualizarPaciente = async (pacienteActualizado) => {
      try {
        const { data, error } = await supabase
          .from("fichaIdentificacion")
          .update(pacienteActualizado)
          .eq("id", pacienteActualizado.id);

        if (error) {
          console.error("Error en la actualización:", error);
          throw error;
        } else if (!data || data.length === 0) {
          console.warn(
            "Actualización fallida: No se encontraron registros con el id proporcionado."
          );
          throw new Error(
            "La actualización falló. No se encontraron registros actualizados."
          );
        }

        const index = formIdentificacion.value.findIndex(
          (p) => p.id === pacienteActualizado.id
        );
        if (index !== -1) {
          formIdentificacion.value[index] = data[0];
        }
      } catch (error) {
        console.error("Error al actualizar los datos del paciente:", error);
      }
    };

    const eliminarPaciente = async (id) => {
      const { error } = await supabase
        .from("fichaIdentificacion")
        .delete()
        .eq("id", id);

      if (error) {
        console.error("Error al eliminar el paciente:", error);
      } else {
        formIdentificacion.value = formIdentificacion.value.filter(
          (p) => p.id !== id
        );
      }
    };

    const registrosPorDia = computed(() => {
      // Obtén el primer y último día del mes actual
      const inicioMes = startOfMonth(new Date());
      const finMes = endOfMonth(new Date());

      // Inicializa un objeto para almacenar el conteo acumulado por cada día de la semana
      const conteoPorDia = {
        lunes: 0,
        martes: 0,
        miércoles: 0,
        jueves: 0,
        viernes: 0,
        sábado: 0,
        domingo: 0,
      };

      // Filtra los registros dentro del mes actual y agrúpalos por día de la semana
      formIdentificacion.value
        .filter((paciente) => {
          // Asegúrate de que `fechaRegistro` esté en el formato de fecha correcto
          const fechaRegistro = parseISO(paciente.fechaRegistro); // Usa parseISO para convertir la fecha
          return fechaRegistro >= inicioMes && fechaRegistro <= finMes;
        })
        .forEach((paciente) => {
          const fechaRegistro = parseISO(paciente.fechaRegistro); // Usa parseISO para convertir la fecha
          const diaSemana = format(fechaRegistro, "EEEE", { locale: es });
          conteoPorDia[diaSemana.toLowerCase()] += 1;
        });

      // Convierte el objeto de conteo a un arreglo para usarlo en el gráfico
      return Object.entries(conteoPorDia).map(([day, registros]) => ({
        day,
        registros,
      }));
    });

    const totalActivos = computed(
      () => formIdentificacion.value.filter((p) => p.activo).length
    );
    console.log("ACTIVOS LN92 " + totalActivos.value);

    const totalInactivos = computed(
      () => formIdentificacion.value.filter((p) => !p.activo).length
    );
    console.log("INACTIVOS LN92 " + totalInactivos.value);

    const dataGraficoPacientes = computed(() => [
      { estado: "Activos", cantidad: totalActivos.value },
      { estado: "Inactivos", cantidad: totalInactivos.value },
    ]);

    return {
      formIdentificacion,
      cargarDatos,
      guardarDatos,
      actualizarPaciente,
      eliminarPaciente,
      registrosPorDia,
      totalActivos,
      totalInactivos,
      dataGraficoPacientes,
      tipoOptions: ref(["Tipo1", "Tipo2", "Tipo3"]),
      medicoNOptions: ref(["Medico1", "Medico2", "Medico3"]),
      medicoOptions: ref(["Medico1", "Medico2", "Medico3"]),
      medicoCabeceraOptions: ref(["MedicoCab1", "MedicoCab2"]),
      referidoPorOptions: ref(["Referido1", "Referido2"]),
      departamentoOptions: ref(["Estado1", "Estado2"]),
      municipioOptions: ref(["Municipio1", "Municipio2"]),
      sexoOptions: ref(["Masculino", "Femenino"]),
      estadoCivilOptions: ref(["Soltero", "Casado", "Viudo"]),
      grupoSanguineoOptions: ref([
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ]),
    };
  }
);
