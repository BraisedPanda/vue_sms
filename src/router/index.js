import { createRouter, createWebHistory } from "vue-router";
import Dashboard from "../views/Dashboard.vue";
import Tables from "../views/Tables.vue";
import InputGradeTable from "../views/components/InputGradeTable.vue";
import StudentChart from "../views/components/chart/StudentChart.vue";
import Billing from "../views/Billing.vue";
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
    name: "考试成绩查询",
    component: Tables,
    meta:{
      needLogin: true
    }
  },
  {
    path: "/inputGrade",
    name: "新建考试成绩",
    component: InputGradeTable,
    meta:{
      needLogin: true
    }
  },
  {
    path: "/studentChart",
    name: "学生成绩报表",
    component: StudentChart,
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
