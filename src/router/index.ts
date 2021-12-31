import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../views/app/Home.vue";
import App from "@/views/App.vue";
import Auth from "@/views/ResetPassword.vue";
import NotFound from "@/views/NotFound.vue";
import NoAvailableService from "@/views/NoAvaliableService.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/auth/:token",
    name: "Auth",
    props: true,
    component: Auth,
  },
  {
    path: "/",
    component: App,
    children: [
      {
        path: "",
        redirect: "roadmap",
      },
      {
        path: "notifications",
        name: "NotificationList",
        component: () => import("../views/app/activities/ActivityList.vue"),
      },
      {
        path: "roadmap",
        name: "Roadmap",
        component: () => import("../views/roadmap/Roadmap.vue"),
      },
      {
        path: "appointments",
        name: "Appointments",
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () =>
          import("../views/app/appointments/AppointmentList.vue"),
      },
      {
        path: "appointments/new",
        name: "AppointmentsNew",
        component: () =>
          import("../views/app/appointments/AppointmentForm.vue"),
      },
      {
        path: "appointments/:id",
        name: "AppointmentsEdit",
        props: true,
        component: () =>
          import("../views/app/appointments/AppointmentForm.vue"),
      },
      {
        path: "/clients",
        name: "Clients",
        component: () => import("../views/app/clients/ClientList.vue"),
      },
      {
        path: "clients/new",
        name: "ClientsNew",
        component: () => import("../views/app/clients/ClientForm.vue"),
      },
      {
        path: "clients/:id",
        name: "ClientsEdit",
        props: true,
        component: () => import("../views/app/clients/ClientForm.vue"),
      },
      {
        path: "grantors",
        name: "Grantors",
        component: () => import("../views/app/grantors/GrantorList.vue"),
      },
      {
        path: "grantors/new",
        name: "GrantorsNew",
        component: () => import("../views/app/grantors/GrantorForm.vue"),
      },
      {
        path: "grantors/:id",
        name: "GrantorsEdit",
        props: true,
        component: () => import("../views/app/grantors/GrantorForm.vue"),
      },
      {
        path: "groups",
        name: "Groups",
        component: () => import("../views/app/groups/GroupList.vue"),
      },
      {
        path: "groups/new",
        name: "GroupsNew",
        component: () => import("../views/app/groups/GroupForm.vue"),
      },
      {
        path: "groups/:id",
        name: "GroupsEdit",
        props: true,
        component: () => import("../views/app/groups/GroupForm.vue"),
      },
      {
        path: "users",
        name: "Users",
        component: () => import("../views/app/users/UserList.vue"),
      },
      {
        path: "users/new",
        name: "UsersNew",
        component: () => import("../views/app/users/UserForm.vue"),
      },
      {
        path: "users/:id",
        name: "UsersEdit",
        props: true,
        component: () => import("../views/app/users/UserForm.vue"),
      },
      {
        path: "documents",
        name: "Documents",
        component: () => import("../views/app/documents/DocumentList.vue"),
      },
      {
        path: "documents/new",
        name: "DocumentsNew",
        component: () => import("../views/app/documents/DocumentForm.vue"),
      },
      {
        path: "documents/:id",
        name: "DocumentsEdit",
        props: true,
        component: () => import("../views/app/documents/DocumentForm.vue"),
      },
      {
        path: "documentComments/:id",
        name: "DocumentComments",
        props: true,
        component: () => import("../views/app/documents/DocumentComments.vue"),
      },
    ],
  },
  {
    path: "/notAvailableService",
    name: "NotAvailableService",
    component: NoAvailableService,
  },
  {
    path: "*",
    name: "NotFound",
    component: NotFound,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
