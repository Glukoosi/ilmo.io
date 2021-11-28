import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Default from "../views/Default.vue";
import Create from "../views/Create.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/create",
    name: "Create",
    component: Create,
  },
  {
    path: "/:slug",
    name: "Default",
    component: Default,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;