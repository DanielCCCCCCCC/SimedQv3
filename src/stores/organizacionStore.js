import { defineStore } from "pinia";
import { supabase } from "../supabaseClient"; // Importación de Supabase
import { ref } from "vue";

export const useOrganizacionStore = defineStore("organizacion", () => {
  const cargando = ref(false);
  const error = ref(null);
  const mensajeExito = ref(null);

  const registrarOrganizacion = async (datosOrganizacion, datosAdmin) => {
    cargando.value = true;
    error.value = null;
    mensajeExito.value = null;

    try {
      // Paso 1: Crear un usuario en Supabase Auth
      const { data: authUser, error: authError } = await supabase.auth.signUp({
        email: datosAdmin.email,
        password: datosAdmin.password,
      });

      if (authError) {
        throw new Error(`Error al crear usuario: ${authError.message}`);
      }

      console.log("Usuario creado en Auth:", authUser.user);

      // Paso 2: Crear el tenant
      const { data: tenantData, error: tenantError } = await supabase
        .from("tenants")
        .insert([
          {
            nombre: datosOrganizacion.nombre,
          },
        ])
        .select("id")
        .single();

      if (tenantError) {
        throw new Error(`Error al crear tenant: ${tenantError.message}`);
      }

      const tenantId = tenantData.id;
      console.log("Tenant creado con ID:", tenantId);

      // Paso 3: Crear la organización utilizando el ID del tenant
      const { data: orgData, error: orgError } = await supabase
        .from("organizacion")
        .insert([
          {
            id: tenantId, // Asegúrate de que este ID coincida con la clave primaria de 'tenants'
            nombre: datosOrganizacion.nombre,
            direccion: datosOrganizacion.direccion,
            email_contacto: datosOrganizacion.email_contacto,
            numero_telefono: datosOrganizacion.numero_telefono || null,
            sitio_web: datosOrganizacion.sitio_web || null,
          },
        ])
        .select()
        .single();

      if (orgError) {
        throw new Error(`Error al crear organización: ${orgError.message}`);
      }

      console.log("Organización creada:", orgData);

      // Paso 4: Asociar el usuario creado con el tenant en la tabla 'users'
      const { error: userError } = await supabase
        .from("users")
        .insert([
          {
            id: authUser.user.id, // ID del usuario creado en Supabase Auth
            email: datosAdmin.email,
            tenant_Id: tenantId,
            role: "admin",
          },
        ])
        .select()
        .single();

      if (userError) {
        throw new Error(`Error al asociar usuario: ${userError.message}`);
      }

      mensajeExito.value =
        "Organización y usuario administrador registrados exitosamente.";
      return { tenantId };
    } catch (err) {
      console.error("Error al registrar la organización:", err);
      error.value = err.message || "Ocurrió un error inesperado.";
      throw err;
    } finally {
      cargando.value = false;
    }
  };

  return {
    cargando,
    error,
    mensajeExito,
    registrarOrganizacion,
  };
});
