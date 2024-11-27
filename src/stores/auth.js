// src/stores/auth.js

import { defineStore } from "pinia";
import { supabase } from "../supabaseClient"; // Ajusta la ruta si es necesario
import { ref, watch, computed } from "vue";

export const useAuthStore = defineStore("auth", () => {
  // Estados reactivos
  const user = ref(null);
  const session = ref(null);
  const tenant_Id = ref(null);
  const role = ref(null);
  const isAuthenticated = ref(false);
  const loading = ref(false);
  const error = ref(null);
  const isLoading = ref(true);

  /**
   * Obtiene los detalles adicionales del usuario desde la tabla `users`.
   * @param {string} userId - ID del usuario autenticado.
   * @returns {Object|null} - Detalles del usuario o null si no se encuentra.
   */
  const fetchUserDetails = async (userId) => {
    try {
      const { data, error: fetchError } = await supabase
        .from("users")
        .select("tenant_Id, role")
        .eq("id", userId)
        .maybeSingle(); // Permite devolver una fila o null

      if (fetchError) {
        console.error(
          "Error al obtener detalles del usuario:",
          fetchError.message
        );
        return null;
      }

      if (!data) {
        console.log("No se encontraron detalles para el usuario.");
        return null;
      }

      return data;
    } catch (err) {
      console.error(
        "Error inesperado al obtener detalles del usuario:",
        err.message
      );
      return null;
    }
  };

  /**
   * Inicializa el estado de autenticación, verificando si hay una sesión activa.
   */
  const initialize = async () => {
    try {
      // Primero revisamos si hay un token almacenado en localStorage
      const storedToken = localStorage.getItem("access_token");
      if (storedToken) {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.setSession(storedToken);
        if (sessionError) throw sessionError;

        const session = sessionData.session;
        console.log("Sesión activa:", session);

        if (!session) {
          console.log("No se pudo restablecer la sesión con el token.");
          return;
        }

        const userId = session.user.id;
        console.log("Sesión activa, ID del usuario:", userId);

        const userDetails = await fetchUserDetails(userId);
        if (userDetails) {
          tenant_Id.value = userDetails.tenant_Id;
          role.value = userDetails.role;
          console.log("Estado de autenticación actualizado:", {
            tenant_Id: tenant_Id.value,
            role: role.value,
          });
          isAuthenticated.value = true;
          user.value = session.user;
          session.value = session;
        } else {
          console.log(
            "No se encontraron detalles del usuario en la tabla 'users'."
          );
          resetAuthState();
        }
      } else {
        // Si no hay token almacenado, no hay sesión activa
        console.log("No hay token almacenado.");
      }
    } catch (err) {
      console.error("Error al inicializar la autenticación:", err.message);
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Getter para obtener el user_id
   */
  const user_id = computed(() => (user.value ? user.value.id : null));

  /**
   * Inicia sesión con email y contraseña.
   * @param {string} email
   * @param {string} password
   */
  const signIn = async (email, password) => {
    loading.value = true;
    error.value = null;
    console.log(`Iniciando sesión para el email: ${email}`);
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (signInError) {
        console.error("Error al iniciar sesión:", signInError.message);
        throw signInError;
      }

      console.log("Sesión iniciada exitosamente:", data.session);
      session.value = data.session;
      user.value = data.user;
      isAuthenticated.value = true;

      // Guardar el token en localStorage
      if (data.session && data.session.access_token) {
        localStorage.setItem("access_token", data.session.access_token);
      }

      const userDetails = await fetchUserDetails(data.user.id);
      if (userDetails) {
        tenant_Id.value = userDetails.tenant_Id;
        role.value = userDetails.role;
        console.log("Tenant ID y Rol asignados:", tenant_Id.value, role.value);
      } else {
        console.warn("El usuario no tiene una entrada en la tabla 'users'.");
        resetAuthState();
      }
    } catch (err) {
      console.error("Error al iniciar sesión:", err.message);
      error.value = err.message;
      resetAuthState();
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Cierra la sesión del usuario.
   */
  const signOut = async () => {
    loading.value = true;
    try {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        console.error("Error al cerrar sesión:", signOutError.message);
        throw signOutError;
      }

      console.log("Sesión cerrada exitosamente.");
      resetAuthState();

      // Eliminar el token del localStorage
      localStorage.removeItem("access_token");
    } catch (err) {
      console.error("Error al cerrar sesión:", err.message);
      throw err;
    } finally {
      loading.value = false;
    }
  };

  /**
   * Maneja los cambios en el estado de autenticación.
   * @param {string} event - Evento de autenticación.
   * @param {Object} sessionData - Datos de la sesión.
   */
  const handleAuthStateChange = (event, sessionData) => {
    console.log("Evento de autenticación recibido:", event);

    if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
      const newSession = sessionData;
      session.value = newSession;
      user.value = newSession.user;
      isAuthenticated.value = true;

      if (newSession.access_token) {
        localStorage.setItem("access_token", newSession.access_token);
      }

      fetchUserDetails(newSession.user.id).then((userDetails) => {
        if (userDetails) {
          tenant_Id.value = userDetails.tenant_Id;
          role.value = userDetails.role;
          console.log(
            "Tenant ID y Rol asignados:",
            tenant_Id.value,
            role.value
          );
        } else {
          console.warn("El usuario no tiene una entrada en la tabla 'users'.");
          resetAuthState();
        }
      });
    } else if (event === "SIGNED_OUT") {
      resetAuthState();
      localStorage.removeItem("access_token"); // Eliminar token al cerrar sesión
    }
  };

  /**
   * Restablece el estado de autenticación (usado en errores o al cerrar sesión).
   */
  const resetAuthState = () => {
    user.value = null;
    session.value = null;
    tenant_Id.value = null;
    role.value = null;
    isAuthenticated.value = false;
    error.value = null;
  };

  /**
   * Suscribe a los cambios en el estado de autenticación.
   */
  const subscribeToAuthChanges = () => {
    supabase.auth.onAuthStateChange(handleAuthStateChange);
  };

  // Inicializar la autenticación y suscribirse a los cambios
  initialize();
  subscribeToAuthChanges();

  return {
    user,
    session,
    tenant_Id,
    role,
    user_id, // Agregado para acceder fácilmente al user_id
    isAuthenticated,
    loading,
    error,
    initialize,
    signIn,
    signOut,
    fetchUserDetails,
  };
});
