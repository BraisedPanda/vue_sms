import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import Billing from "../views/Billing.vue";
import VirtualReality from "../views/VirtualReality.vue";
import RTL from "../views/Rtl.vue";
import Profile from "../views/Profile.vue";
import Signup from "../views/Signup.vue";
import Login from "../views/Login.vue";

const routes = [
  {
    path: "/",
    name: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "主页",
    component: Dashboard,
    meta:{
      needLogin: true
    }
  },
  {
    path: "/tables",
    name: "统计表",
    component: Tables,
    meta:{
      needLogin: true
    }
  },
  {
    path: "/billing",
    name: "Billing",
    component: Billing,
    meta:{
      needLogin: true
    }
  },
  {
    path: "/virtual-reality",
    name: "Virtual Reality",
    component: VirtualReality,
    meta:{
      needLogin: true
    }
  },
  {
    path: "/rtl-page",
    name: "RTL",
    component: RTL,
    meta:{
      needLogin: true
    }
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
    meta:{
      needLogin: true
    }
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta:{
      needLogin: false
    }
  },
  {
    path: "/signup",
    name: "Signup",
    component: Signup,
    meta:{
      needLogin: false
    }
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkActiveClass: "active",
});

export default router;
