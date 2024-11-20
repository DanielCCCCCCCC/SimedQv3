// fichaIdentificacionStores.js

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

    // Función para cargar datos desde Supabase
    const cargarDatos = async () => {
      const { data, error } = await supabase
        .from("fichaIdentificacion")
        .select("*")
        .eq("tenant_id", tenantId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error al cargar los datos de identificación:", error);
      } else {
        // Convertir IDs a números si es necesario = solo lo hago para confirmar que son numeros los IDs

        formIdentificacion.value = (data || []).map((paciente) => ({
          ...paciente,
          tipoId: Number(paciente.tipoId),
          medicoId: Number(paciente.medicoId),
          estadoCivilId: Number(paciente.estadoCivilId),
          departamentoId: Number(paciente.departamentoId),
          municipioId: Number(paciente.municipioId),
          escolaridadId: Number(paciente.escolaridadId),
          grupoSanguineoId: Number(paciente.grupoSanguineoId),
          // Asegúrate de convertir otros IDs si existen
        }));
      }
    };

    // Función para guardar un nuevo paciente
    const guardarDatos = async (nuevoFormulario) => {
      const fechaRegistro = new Date().toISOString(); // Usar formato ISO para fechas
      const { data, error } = await supabase
        .from("fichaIdentificacion")
        .insert([{ ...nuevoFormulario, fechaRegistro, tenant_id: tenantId }])
        .select(); // Seleccionar para obtener el registro insertado
      console.log(nuevoFormulario);
      if (error) {
        console.error("Error al guardar los datos de identificación:", error);
        return null;
      } else if (data && data.length > 0) {
        formIdentificacion.value.push(data[0]);
        return data[0];
      } else {
        console.warn("Paciente guardado, pero sin datos devueltos.");
        return null;
      }
    };

    // Función para actualizar un paciente existente
    const actualizarPaciente = async (pacienteActualizado) => {
      if (!pacienteActualizado.id) {
        console.error("Error: el ID del paciente es indefinido.");
        return false;
      }
      try {
        const { data, error } = await supabase
          .from("fichaIdentificacion")
          .update({
            fechaRegistro: pacienteActualizado.fechaRegistro,
            codigo: pacienteActualizado.codigo,
            activo: pacienteActualizado.activo,
            tipoId: pacienteActualizado.tipoId,
            medicoId: pacienteActualizado.medicoId,
            dni: pacienteActualizado.dni,
            nombres: pacienteActualizado.nombres,
            apellidos: pacienteActualizado.apellidos,
            fechaNacimiento: pacienteActualizado.fechaNacimiento,
            sexo: pacienteActualizado.sexo,
            estadoCivilId: pacienteActualizado.estadoCivilId,
            observaciones: pacienteActualizado.observaciones,
            direccion: pacienteActualizado.direccion,
            telCasa: pacienteActualizado.telCasa,
            telPersonal: pacienteActualizado.telPersonal,
            email: pacienteActualizado.email,
            departamentoId: pacienteActualizado.departamentoId,
            municipioId: pacienteActualizado.municipioId,
            organizacion: pacienteActualizado.organizacion,
            conyugue: pacienteActualizado.conyugue,
            madre: pacienteActualizado.madre,
            padre: pacienteActualizado.padre,
            escolaridadId: pacienteActualizado.escolaridadId,
            ocupacion: pacienteActualizado.ocupacion,
            grupoSanguineoId: pacienteActualizado.grupoSanguineoId,
            alergias: pacienteActualizado.alergias,
            // Agrega otros campos necesarios si existen
          })
          .eq("id", pacienteActualizado.id)
          .eq("tenant_id", tenantId) // Asegura que solo actualizas del tenant actual
          .select(); // Seleccionar para obtener el registro actualizado

        if (error) {
          console.error("Error al actualizar paciente:", error.message);
          return false;
        } else if (data && data.length > 0) {
          // Actualiza el paciente en la lista localmente
          const index = formIdentificacion.value.findIndex(
            (p) => p.id === pacienteActualizado.id
          );
          if (index !== -1) {
            formIdentificacion.value[index] = data[0];
          }
          console.log("Paciente actualizado:", data[0]);
          return true;
        } else {
          console.warn(
            "Actualización fallida: No se encontraron registros con el id proporcionado."
          );
          return false;
        }
      } catch (error) {
        console.error("Error al conectar con Supabase:", error);
        return false;
      }
    };

    // Función para eliminar un paciente
    const eliminarPaciente = async (id) => {
      const { error } = await supabase
        .from("fichaIdentificacion")
        .delete()
        .eq("id", id)
        .eq("tenant_id", tenantId); // Asegura que solo eliminas del tenant actual

      if (error) {
        console.error("Error al eliminar el paciente:", error);
        return false;
      } else {
        formIdentificacion.value = formIdentificacion.value.filter(
          (p) => p.id !== id
        );
        console.log("Paciente eliminado:", id);
        return true;
      }
    };

    // Computed para registros por día de la semana
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
          const diaClave = diaSemana.toLowerCase();
          if (conteoPorDia.hasOwnProperty(diaClave)) {
            conteoPorDia[diaClave] += 1;
          }
        });

      // Convierte el objeto de conteo a un arreglo para usarlo en el gráfico
      return Object.entries(conteoPorDia).map(([day, registros]) => ({
        day,
        registros,
      }));
    });

    // Computed para totales de activos e inactivos
    const totalActivos = computed(
      () => formIdentificacion.value.filter((p) => p.activo).length
    );
    console.log("ACTIVOS LN92 " + totalActivos.value);

    const totalInactivos = computed(
      () => formIdentificacion.value.filter((p) => !p.activo).length
    );
    console.log("INACTIVOS LN92 " + totalInactivos.value);

    // Computed para datos del gráfico de pacientes
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
    };
  }
);
