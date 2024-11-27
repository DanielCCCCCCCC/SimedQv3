<template>
  <q-layout view="hHh Lpr fFf">
    <!-- Header -->
    <q-header elevated class="header">
      <q-toolbar>
        <q-btn
          flat
          dense
          icon="menu"
          @click="toggleSidebar"
          aria-label="Toggle Sidebar"
          class="toggle-btn"
        />
        <q-toolbar-title class="title"> SIMED </q-toolbar-title>
        <q-space />
        <!-- Espacio flexible para empujar el botón a la derecha -->
        <q-btn
          flat
          dense
          icon="logout"
          label="Cerrar Sesión"
          @click="logout"
          class="logout-btn"
        />
      </q-toolbar>
    </q-header>

    <!-- Sidebar (Drawer) -->
    <q-drawer
      :width="isCollapsed ? 70 : 300"
      show-if-above
      bordered
      side="left"
      elevated
      :breakpoint="768"
      class="sidebar"
      :mini="isCollapsed"
    >
      <div class="sidebar-nav">
        <q-list dense>
          <!-- Dashboard Group -->
          <q-expansion-item
            v-model="isDashboardOpen"
            :label="!isCollapsed ? 'Dashboard' : ''"
            icon="dashboard"
            dense
            class="menu-item expandable"
            @click="handleGroupClick('dashboard', $event)"
          >
            <q-list>
              <q-item
                clickable
                :to="dashboardItem.path"
                exact
                class="submenu-item"
                :class="{ active: isActive(dashboardItem.path) }"
                @click="handleItemClick(dashboardItem.path)"
              >
                <q-item-section avatar>
                  <q-icon :name="dashboardItem.icon" />
                </q-item-section>
                <q-item-section v-if="!isCollapsed" class="submenu-label">
                  {{ dashboardItem.label }}
                </q-item-section>
                <q-tooltip v-if="isCollapsed">{{
                  dashboardItem.label
                }}</q-tooltip>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Agenda Group -->
          <q-expansion-item
            v-model="isAgendaOpen"
            :label="!isCollapsed ? 'Agenda' : ''"
            icon="event"
            dense
            class="menu-item expandable"
            @click="handleGroupClick('agenda', $event)"
          >
            <q-list>
              <q-item
                v-for="item in agendaItems"
                :key="item.path"
                clickable
                :to="item.path"
                exact
                class="submenu-item"
                :class="{ active: isActive(item.path) }"
                @click="handleItemClick(item.path)"
              >
                <q-item-section avatar>
                  <q-icon :name="item.icon" />
                </q-item-section>
                <q-item-section v-if="!isCollapsed" class="submenu-label">
                  {{ item.label }}
                </q-item-section>
                <q-tooltip v-if="isCollapsed">{{ item.label }}</q-tooltip>
              </q-item>
            </q-list>
          </q-expansion-item>

          <!-- Administración y Mantenimiento Group -->
          <q-expansion-item
            v-model="isAdminOpen"
            :label="
              !isCollapsed ? 'Administración y Mantenimiento' : 'Administración'
            "
            icon="build"
            dense
            class="menu-item expandable"
            @click="handleGroupClick('admin', $event)"
          >
            <q-list>
              <q-item
                v-for="item in adminItems"
                :key="item.path"
                clickable
                :to="item.path"
                exact
                class="submenu-item"
                :class="{ active: isActive(item.path) }"
                @click="handleItemClick(item.path)"
              >
                <q-item-section avatar>
                  <q-icon :name="item.icon" />
                </q-item-section>
                <q-item-section v-if="!isCollapsed" class="submenu-label">
                  {{ item.label }}
                </q-item-section>
                <q-tooltip v-if="isCollapsed">{{ item.label }}</q-tooltip>
              </q-item>
            </q-list>
          </q-expansion-item>
        </q-list>
      </div>
    </q-drawer>

    <!-- Main Content -->
    <q-page-container class="content">
      <router-view />
    </q-page-container>
  </q-layout>
</template>
<script setup>
import { ref, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import {
  QLayout,
  QHeader,
  QToolbar,
  QBtn,
  QToolbarTitle,
  QDrawer,
  QList,
  QItem,
  QItemSection,
  QIcon,
  QTooltip,
  QExpansionItem,
  QPageContainer,
} from "quasar";
import { useAuthStore } from "../stores/auth"; // Asegúrate de que la ruta sea correcta

// Estado para el colapso del sidebar
const isCollapsed = ref(false);

// Estados para secciones expandibles
const isAgendaOpen = ref(false);
const isAdminOpen = ref(false);
const isDashboardOpen = ref(false);

// Router y Ruta Actual
const router = useRouter();
const route = useRoute();

// Definir los items para cada sección
const dashboardItem = {
  label: "Dashboard",
  path: "/dashboard",
  icon: "dashboard",
};

const agendaItems = [
  {
    label: "Control de Citas",
    path: "/controlCitasv2",
    icon: "calendar_today",
  },
  {
    label: "Contactos",
    path: "/contactos",
    icon: "contacts",
  },
  // Otros items...
];

const adminItems = [
  {
    label: "Directorio Pacientes",
    path: "/directoriopacientes",
    icon: "people",
  },
  // Otros items...
];

// Función para alternar el estado de colapso del sidebar
const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value;
};

// Función para manejar clic en ítems estándar
const handleItemClick = (path) => {
  if (isCollapsed.value) {
    // Si está colapsado, expandir el menú
    isCollapsed.value = false;
  } else {
    // Navegación ya manejada por <router-link>, solo colapsar el menú
    isCollapsed.value = false;
  }
};

// Función para manejar clic en grupos expandibles
const handleGroupClick = (group, event) => {
  if (isCollapsed.value) {
    // Si está colapsado, expandir el menú
    isCollapsed.value = false;
    // Prevenir la propagación del evento para que el submenú no intente expandirse
    event.preventDefault();
    event.stopPropagation();
  }
  // Si no está colapsado, el comportamiento de expansión es manejado por v-model de q-expansion-item
};

// Computed para determinar el ítem activo
const currentRoute = computed(() => route.path);

const isActive = (path) => currentRoute.value === path;

// Watcher para cerrar todos los submenús al colapsar el sidebar
watch(isCollapsed, (newVal) => {
  if (newVal) {
    isDashboardOpen.value = false;
    isAgendaOpen.value = false;
    isAdminOpen.value = false;
  }
});

// Watcher para actualizar currentRoute si es necesario
watch(
  () => route.path,
  (newPath) => {
    // Aquí podrías manejar algo si es necesario al cambiar de ruta
  }
);

// Importar y usar la tienda de autenticación
const authStore = useAuthStore();

// Función para cerrar sesión
const logout = async () => {
  try {
    await authStore.signOut();
    // Redirigir al login
    router.push({ name: "loginOrganizaciones" });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
  }
};
</script>

<style scoped>
/* General Styles */

/* Header */
.header {
  background-color: #ffffff !important;
  color: rgba(0, 0, 0, 0.42) !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.toggle-btn {
  background: none;
  border: none;
  color: #a787f6;
  font-size: 24px;
  cursor: pointer;
  margin-right: 20px;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

/* Sidebar */
.sidebar {
  background-color: rgba(255, 255, 255, 0.8) !important;
  color: #7f2cf4 !important;
  box-shadow: 2px 0 5px rgba(201, 141, 141, 0.1) !important;
  transition: width 0.3s ease, background-color 0.3s ease;
}

.sidebar-nav {
  padding: 20px 0;
}

.menu-item,
.submenu-item {
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: background-color 0.3s;
  color: #000000ab;
}

.menu-item.active,
.submenu-item.active {
  background-color: rgba(16, 9, 65, 0.2) !important;
  border-radius: 12px;
}

.menu-label,
.submenu-label {
  margin-left: 5px;
  font-size: 16px;
  color: #566371;
}

.toggle-icon {
  margin-left: auto;
  transition: transform 0.3s;
}

.expandable .toggle-icon {
  font-size: 20px;
  color: #716456;
}

.submenu {
  list-style: none;
  padding: 0;
  margin: 0 0 0 20px;
}

.submenu-item {
  padding: 8px 20px;
  color: #01011156;
}

.submenu-item:hover {
  background-color: #1d84222e !important;
  border-radius: 7px;
}

.tooltip {
  /* Estilos personalizados para tooltips si es necesario */
}

/* Main Content, AQUI LE ESTABLEZCO EL COLOR DE FONDO A LA PAGINA */
.content {
  padding-bottom: 40vh;
  background-color: #f6f6fa;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .sidebar--collapsed {
    transform: translateX(0) !important;
    width: 300px !important; /* Ajustado al nuevo ancho */
  }

  .content {
    margin-left: 0 !important;
    width: 100% !important;
  }
}
</style>
