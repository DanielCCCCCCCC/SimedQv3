<template>
  <div class="login-organizaciones">
    <h1>Login de Organizaciones</h1>

    <form @submit.prevent="handleLogin">
      <div>
        <label for="email">Email:</label>
        <input id="email" v-model="email" type="email" required />
      </div>

      <div>
        <label for="password">Contraseña:</label>
        <input id="password" v-model="password" type="password" required />
      </div>

      <button type="submit" :disabled="cargando">
        {{ cargando ? "Iniciando..." : "Iniciar Sesión" }}
      </button>
    </form>

    <div v-if="error" class="error">
      <p>Error: {{ error }}</p>
    </div>

    <div v-if="mensajeExito" class="success">
      <p>{{ mensajeExito }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { supabase } from "../supabaseClient";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");

const cargando = ref(false);
const error = ref(null);
const mensajeExito = ref(null);

const router = useRouter();

/**
 * Maneja el inicio de sesión del usuario.
 */
const handleLogin = async () => {
  error.value = null; // Limpiar mensajes de error anteriores
  cargando.value = true; // Mostrar estado de carga

  // Validaciones básicas
  if (!validarCampos()) {
    cargando.value = false; // Detener estado de carga si hay errores
    return;
  }

  try {
    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (loginError) {
      // console.error("Error al iniciar sesión:", loginError.message);
      error.value = loginError.message || "Error al iniciar sesión.";
      return;
    }

    // console.log("Usuario autenticado:", data.user);

    // Mensaje de éxito
    mensajeExito.value = "Inicio de sesión exitoso.";

    // Redirigir al dashboard
    router.push({ name: "dashboard" });
  } catch (err) {
    console.error("Error inesperado al iniciar sesión:", err.message);
    error.value = "Ocurrió un error inesperado.";
  } finally {
    cargando.value = false; // Ocultar estado de carga
  }
};

/**
 * Valida los campos del formulario.
 * @returns {boolean} `true` si los campos son válidos, `false` en caso contrario.
 */
const validarCampos = () => {
  if (!email.value.trim()) {
    error.value = "El email es obligatorio.";
    return false;
  }

  if (!password.value.trim()) {
    error.value = "La contraseña es obligatoria.";
    return false;
  }

  return true;
};
</script>

<style scoped>
.login-organizaciones {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.login-organizaciones form div {
  margin-bottom: 15px;
}

.login-organizaciones label {
  display: block;
  margin-bottom: 5px;
}

.login-organizaciones input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.login-organizaciones button {
  padding: 10px 20px;
}

.error {
  margin-top: 20px;
  color: red;
}

.success {
  margin-top: 20px;
  color: green;
}
</style>
