import { createRouter, createWebHistory } from "@ionic/vue-router";
import HomePage from "../views/HomePage.vue";
import PrintAmountView from "../views/PrintAmountView.vue";
import LoginScreen from "@/views/LoginScreen.vue";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/home",
    name: "Home",
    component: HomePage,
  },
  {
    path: "/print-amount",
    name: "PrintAmount",
    component: PrintAmountView,
  },
  {
    path: "/login",
    name: "Login",
    component: LoginScreen,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
