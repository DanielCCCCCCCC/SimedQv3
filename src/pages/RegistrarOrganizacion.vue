<template>
  <div class="registrar-organizacion">
    <h1>Registrar Nueva Organización</h1>

    <form @submit.prevent="handleSubmit">
      <!-- Campos de la organización -->
      <div>
        <label for="nombre">Nombre de la Organización:</label>
        <input id="nombre" v-model="nombre" type="text" required />
      </div>

      <div>
        <label for="direccion">Dirección:</label>
        <input id="direccion" v-model="direccion" type="text" required />
      </div>

      <div>
        <label for="email_contacto">Email de Contacto:</label>
        <input
          id="email_contacto"
          v-model="email_contacto"
          type="email"
          required
        />
      </div>

      <div>
        <label for="numero_telefono">Número de Teléfono:</label>
        <input id="numero_telefono" v-model="numero_telefono" type="text" />
      </div>

      <div>
        <label for="sitio_web">Sitio Web:</label>
        <input id="sitio_web" v-model="sitio_web" type="url" />
      </div>

      <!-- Campos del administrador -->
      <h2>Datos del Administrador</h2>
      <div>
        <label for="admin_email">Email del Administrador:</label>
        <input id="admin_email" v-model="admin_email" type="email" required />
      </div>
      <div>
        <label for="admin_password">Contraseña del Administrador:</label>
        <input
          id="admin_password"
          v-model="admin_password"
          type="password"
          required
        />
      </div>

      <button type="submit" :disabled="cargando">
        {{ cargando ? "Registrando..." : "Registrar Organización" }}
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
import { useOrganizacionStore } from "../stores/organizacionStore";
import { useRouter } from "vue-router";

// Campos de la organización
const nombre = ref("");
const direccion = ref("");
const email_contacto = ref("");
const numero_telefono = ref("");
const sitio_web = ref("");

// Campos del administrador
const admin_email = ref("");
const admin_password = ref("");

// Estado del formulario
const organizacionStore = useOrganizacionStore();
const router = useRouter();
const error = ref(null);
const mensajeExito = ref(null);
const cargando = ref(false);

/**
 * Maneja el envío del formulario.
 */
// src/pages/RegistrarOrganizacion.vue

const handleSubmit = async () => {
  cargando.value = true;
  error.value = null;

  const datosOrganizacion = {
    nombre: nombre.value,
    direccion: direccion.value,
    email_contacto: email_contacto.value,
    numero_telefono: numero_telefono.value || null,
    sitio_web: sitio_web.value || null,
  };

  const datosAdmin = {
    email: admin_email.value,
    password: admin_password.value,
  };

  try {
    await organizacionStore.registrarOrganizacion(
      datosOrganizacion,
      datosAdmin
    );
    mensajeExito.value = "Organización registrada exitosamente.";
    router.push({ name: "dashboard" });
  } catch (err) {
    error.value =
      err.message || "Ocurrió un error al registrar la organización.";
  } finally {
    cargando.value = false;
  }
};

/**
 * Valida los campos del formulario.
 * @returns {boolean} `true` si el formulario es válido; `false` en caso contrario.
 */
const validarFormulario = () => {
  if (!nombre.value.trim()) {
    error.value = "El nombre de la organización es obligatorio.";
    return false;
  }

  if (!direccion.value.trim()) {
    error.value = "La dirección es obligatoria.";
    return false;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email_contacto.value)) {
    error.value = "El email de contacto no es válido.";
    return false;
  }

  if (!emailRegex.test(admin_email.value)) {
    error.value = "El email del administrador no es válido.";
    return false;
  }

  if (admin_password.value.length < 6) {
    error.value = "La contraseña debe tener al menos 6 caracteres.";
    return false;
  }

  return true;
};

/**
 * Limpia los campos del formulario.
 */
const limpiarFormulario = () => {
  nombre.value = "";
  direccion.value = "";
  email_contacto.value = "";
  numero_telefono.value = "";
  sitio_web.value = "";

  admin_email.value = "";
  admin_password.value = "";

  error.value = null;
  mensajeExito.value = null;
};
</script>

<style scoped>
.registrar-organizacion {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.registrar-organizacion form div {
  margin-bottom: 15px;
}

.registrar-organizacion label {
  display: block;
  margin-bottom: 5px;
}

.registrar-organizacion input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

.registrar-organizacion button {
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
