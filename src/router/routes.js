import FormContactos from "../pages/FormContactos.vue";
import ListadoMedicos from "src/pages/ListadoMedicos.vue";
import FormDiagnosticos from "src/pages/FormDiagnosticos.vue";
import FormConfiMedicas from "src/pages/FormConfiMedicas.vue";
import FormDirectorios from "src/pages/FormDirectorios.vue";
import FormDirectorioPacientes from "src/pages/FormDirectorioPacientes.vue";
import SchedulerControlCita from "src/pages/SchedulerControlCita.vue";
import SchedulerControlCitaCopy from "src/pages/SchedulerControlCitacopy.vue";
import FormDatosGenerales from "src/pages/FormDatosGenerales.vue";
import FormMedicos from "src/pages/FormMedicos.vue";
const routes = [
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      { path: "", component: () => import("pages/IndexPage.vue") },
      {
        path: "controlCitas",
        component: SchedulerControlCita,
        name: "controlCitas",
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
      // {
      //   path: "grupSanguineo",
      //   component: FormGrupoSanguineo,
      //   name: "grupSanguineo",
      // },
      // {
      //   path: "escolaridad",
      //   component: FormEscolaridad,
      //   name: "escolaridad",
      // },
      // {
      //   path: "estadoCivil",
      //   component: FormEstadoCivil,
      //   name: "estadoCivil",
      // },
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
