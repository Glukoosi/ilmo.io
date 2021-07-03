import { createWebHistory, createRouter } from "vue-router";
import Home from "../views/Home.vue";
import Default from "../views/Default.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
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