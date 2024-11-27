import FormContactos from "../pages/FormContactos.vue";
import ListadoMedicos from "../pages/ListadoMedicos.vue";
import FormDiagnosticos from "../pages/FormDiagnosticos.vue";
import FormConfiMedicas from "../pages/FormConfiMedicas.vue";
import FormDirectorios from "../pages/FormDirectorios.vue";
import FormDirectorioPacientes from "../pages/FormDirectorioPacientes.vue";
import SchedulerControlCita from "../pages/SchedulerControlCita.vue";
import SchedulerControlCitaCopy from "../pages/SchedulerControlCitacopy.vue";
import FormDatosGenerales from "../pages/FormDatosGenerales.vue";
import FormMedicos from "../pages/FormMedicos.vue";
import DashboardIndicadores from "../pages/DashboardIndicadores.vue";
import ListadoContactos from "src/pages/ListadoContactos.vue";
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "dashboard",
        component: DashboardIndicadores,
        name: "dashboard",
      },
      {
        path: "controlCitasv2",
        component: SchedulerControlCitaCopy,
        name: "controlCitasv2",
      },
      {
        path: "contactos",
        component: FormContactos,
        name: "contactos",
      },
      {
        path: "ListadoContactos",
        component: ListadoContactos,
        name: "ListadoContactos",
      },

      { path: "medicos", component: FormMedicos, name: "medicos" },
      { path: "listamedicos", component: ListadoMedicos, name: "listamedicos" },
      {
        path: "directorios",
        component: FormDirectorios,
        name: "directorios",
      },
      {
        path: "diagnosticos",
        component: FormDiagnosticos,
        name: "diagnosticos",
      },
      {
        path: "configuracionesMedicas",
        component: FormConfiMedicas,
        name: "configuracionesMedicas",
      },
      {
        path: "directoriopacientes",
        component: FormDirectorioPacientes,
        name: "directoriopacientes",
      },
      {
        path: "datosGenerales",
        component: FormDatosGenerales,
        name: "datosGenerales",
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
