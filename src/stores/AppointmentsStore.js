import { defineStore } from "pinia";
import { supabase } from "../supabaseClient";
const tenantId = "a780935f-76e7-46c7-98a3-b4c3ab9bb2c3"; // Tenant fijo

export const useAppointmentsStore = defineStore("appointments", {
  state: () => ({
    appointments: [],
    appointmentsTrend: [],
  }),
  actions: {
    async fetchAppointments() {
      const { data, error } = await supabase
        .from("appointments")
        .select(
          "id, title, startDate, endDate, allDay, repeat, description, nombre, medico, tipoCita"
        );

      if (error) {
        console.error("Error al obtener las citas:", error);
      } else {
        this.appointments = data || [];
        this.calculateAppointmentsTrend();
      }
    },
    async addAppointment(appointment) {
      try {
        const { data, error } = await supabase
          .from("appointments")
          .insert([appointment])
          .select(); // Asegúrate de incluir .select() para obtener los datos insertados

        if (error) {
          console.error("Error inserting appointment:", error);
          throw error;
        }

        if (data && data.length > 0) {
          // Cita agregada exitosamente
          return data[0];
        } else {
          console.error(
            "No se recibieron datos de Supabase después de insertar la cita."
          );
          throw new Error("No data returned from Supabase.");
        }
      } catch (error) {
        console.error("Error en addAppointment:", error);
        throw error;
      }
    },
    async updateAppointment(id, updates) {
      console.log("Actualizando cita con ID:", id, "y datos:", updates);
      const { error } = await supabase
        .from("appointments")
        .update(updates)
        .eq("id", id);
      if (error) {
        console.error("Error al actualizar la cita en Supabase:", error);
      } else {
        // Actualiza los datos localmente en el estado
        const index = this.appointments.findIndex((app) => app.id === id);
        if (index !== -1) {
          this.appointments[index] = {
            ...this.appointments[index],
            ...updates,
          };
        }
        this.calculateAppointmentsTrend();
      }
    },

    async deleteAppointment(id) {
      const { error } = await supabase
        .from("appointments")
        .delete()
        .eq("id", id);
      if (error) {
        console.error("Error al eliminar la cita en Supabase:", error);
      } else {
        this.appointments = this.appointments.filter((app) => app.id !== id);
        this.calculateAppointmentsTrend();
      }
    },
    calculateAppointmentsTrend() {
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const groupedData = [];

      // Define los límites de cada semana (7 días)
      const startOfMonth = new Date(currentYear, currentMonth, 1);

      for (let i = 0; i < 5; i++) {
        const startOfWeek = new Date(startOfMonth);
        startOfWeek.setDate(startOfMonth.getDate() + i * 7);

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        groupedData.push({
          period: `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`,
          count: 0,
        });
      }

      this.appointments.forEach((appointment) => {
        const date = new Date(appointment.startDate);

        if (
          date.getMonth() === currentMonth &&
          date.getFullYear() === currentYear
        ) {
          groupedData.forEach((week, index) => {
            const startOfWeek = new Date(
              currentYear,
              currentMonth,
              1 + index * 7
            );
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 7); // Ajuste para incluir el último día

            if (date >= startOfWeek && date <= endOfWeek) {
              week.count++;
            }
          });
        }
      });

      this.appointmentsTrend = groupedData;
    },
  },
});
