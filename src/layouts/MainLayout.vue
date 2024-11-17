<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-dark text-white">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          @click="toggleLeftDrawer"
          aria-label="Menu"
        />
        <q-toolbar-title>SIMED</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" class="layout" show-if-above bordered>
      <q-list>
        <!-- Agenda Section -->
        <q-expansion-item class="sidebar-expansion" label="Agenda" icon="event">
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/controlCitas' }"
            clickable
            @click="
              openTab('controlCitas', 'Control de Citas', '/controlCitas')
            "
          >
            <q-item-section>Control de Citas</q-item-section>
          </q-item>
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/controlCitasv2' }"
            clickable
            @click="
              openTab(
                'controlCitasv2',
                'Control de Citas V2',
                '/controlCitasv2'
              )
            "
          >
            <q-item-section>Control de Citas V2</q-item-section>
          </q-item>
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/contactos' }"
            clickable
            @click="openTab('contactos', 'Contactos', '/contactos')"
          >
            <q-item-section>Contactos</q-item-section>
          </q-item>
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/medicos' }"
            clickable
            @click="openTab('medicos', 'Médicos', '/medicos')"
          >
            <q-item-section>Médicos</q-item-section>
          </q-item>
        </q-expansion-item>

        <!-- Expediente Section -->
        <q-expansion-item
          class="sidebar-expansion"
          label="Expediente"
          icon="folder"
        >
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/visor-pacientes' }"
            clickable
            @click="
              openTab(
                'visorPacientes',
                'Visor de Pacientes',
                '/visor-pacientes'
              )
            "
          >
            <q-item-section>Visor de pacientes</q-item-section>
          </q-item>
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/abrir-expedientes' }"
            clickable
            @click="
              openTab(
                'abrirExpedientes',
                'Abrir Expedientes',
                '/abrir-expedientes'
              )
            "
          >
            <q-item-section>Abrir expedientes</q-item-section>
          </q-item>
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/recetas' }"
            clickable
            @click="openTab('recetas', 'Recetas', '/recetas')"
          >
            <q-item-section>Recetas</q-item-section>
          </q-item>
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/control-medicion' }"
            clickable
            @click="
              openTab(
                'controlMedicion',
                'Control de Medición',
                '/control-medicion'
              )
            "
          >
            <q-item-section>Control de medición</q-item-section>
          </q-item>
        </q-expansion-item>

        <!-- Administración y Mantenimiento Section -->
        <q-expansion-item
          class="sidebar-expansion"
          label="Administración y Mantenimiento"
          icon="build"
        >
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/directoriopacientes' }"
            clickable
            @click="
              openTab(
                'directorioPacientes',
                'Directorio Pacientes',
                '/directoriopacientes'
              )
            "
          >
            <q-item-section>Directorio Pacientes</q-item-section>
          </q-item>
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/directorios' }"
            clickable
            @click="
              openTab('directorios', 'Sección de Directorios', '/directorios')
            "
          >
            <q-item-section>Sección de Directorios</q-item-section>
          </q-item>
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/diagnosticos' }"
            clickable
            @click="
              openTab(
                'diagnosticos',
                'Sección de Diagnósticos',
                '/diagnosticos'
              )
            "
          >
            <q-item-section>Sección de Diagnósticos</q-item-section>
          </q-item>
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/configuracionesMedicas' }"
            clickable
            @click="
              openTab(
                'configuracionesMedicas',
                'Configuraciones Médicas',
                '/configuracionesMedicas'
              )
            "
          >
            <q-item-section>Configuraciones Médicas</q-item-section>
          </q-item>
          <q-item
            class="sidebar-item"
            :class="{ active: selectedRoute === '/datosGenerales' }"
            clickable
            @click="
              openTab('datosGenerales', 'Datos Generales', '/datosGenerales')
            "
          >
            <q-item-section>Datos Generales</q-item-section>
          </q-item>
        </q-expansion-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <!-- Pestañas dinámicas -->
      <q-tabs v-model="selectedTab" class="tabs-container" dense>
        <div v-for="tab in tabs" :key="tab.name" class="tab-container">
          <q-tab
            :name="tab.name"
            :label="tab.label"
            @click="navigateTo(tab.path)"
          />
          <q-btn
            flat
            dense
            round
            class="close-btn"
            icon="close"
            @click.stop="closeTab(tab.name)"
          />
        </div>
      </q-tabs>

      <!-- Contenido de las pestañas -->
      <q-tab-panels v-model="selectedTab" animated>
        <q-tab-panel v-for="tab in tabs" :key="tab.name" :name="tab.name">
          <router-view />
        </q-tab-panel>
      </q-tab-panels>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Notify } from "quasar";

const leftDrawerOpen = ref(false);
const tabs = ref([{ name: "default", label: "Inicio", path: "/" }]);
const selectedTab = ref("default");
const selectedRoute = ref("/");
const router = useRouter();
const route = useRoute();

// Recuperar el estado de las pestañas y la ruta activa
onMounted(() => {
  const savedTabs = localStorage.getItem("tabs");
  const savedRoute = localStorage.getItem("selectedRoute");

  if (savedTabs) {
    tabs.value = JSON.parse(savedTabs);
    selectedTab.value = tabs.value[0]?.name || "default";
  }

  if (savedRoute) {
    selectedRoute.value = savedRoute;
    router.push(savedRoute);
  } else {
    selectedRoute.value = route.path;
  }
});

// Guardar cambios en pestañas y rutas activas
watch(tabs, (newTabs) => {
  localStorage.setItem("tabs", JSON.stringify(newTabs));
});
watch(route, (newRoute) => {
  selectedRoute.value = newRoute.path;
  localStorage.setItem("selectedRoute", newRoute.path);
});

// Alternar el menú lateral
const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

// Navegar y abrir pestañas
const navigateTo = (path) => {
  router.push(path);
};

// Abrir una nueva pestaña
const openTab = (name, label, path) => {
  if (!tabs.value.find((tab) => tab.name === name)) {
    tabs.value.push({ name, label, path });
    localStorage.setItem("tabs", JSON.stringify(tabs.value));
  }
  selectedTab.value = name;
  router.push(path);
};

// Cerrar pestañas (asegurando al menos una abierta)
const closeTab = (name) => {
  if (tabs.value.length === 1) {
    Notify.create({
      type: "negative",
      message: "Debe haber al menos una pestaña abierta.",
      position: "top",
      timeout: 3000,
    });
    return;
  }

  const index = tabs.value.findIndex((tab) => tab.name === name);
  if (index !== -1) {
    tabs.value.splice(index, 1);
    localStorage.setItem("tabs", JSON.stringify(tabs.value));

    if (tabs.value.length > 0) {
      const nextTab = tabs.value[index - 1] || tabs.value[0];
      selectedTab.value = nextTab.name;
      router.push(nextTab.path);
    }
  }
};
</script>

<style scoped>
.layout {
  background-color: #1f1f1f;
  color: #e0e0e0;
}

.sidebar-expansion {
  color: #e0e0e0;
  background-color: #333333;
}

.sidebar-item {
  background-color: transparent;
  color: #e0e0e0;
  transition: background-color 0.3s, color 0.3s;
}

.sidebar-item.active {
  background-color: #1e88e5;
  color: white;
}

.sidebar-item:hover {
  background-color: #3b82f6;
  color: white;
}

.tabs-container {
  background-color: #ffffff;
  color: #000000;
}

.tab-container {
  display: flex;
  align-items: center;
  position: relative;
}

.close-btn {
  position: absolute;
  right: 4px;
  top: 4px;
  color: #000;
  font-size: 7px;
  margin-right: -8px;
}
</style>
