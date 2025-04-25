<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

import SidenavItem from "./SidenavItem.vue";
import SidenavCard from "./SidenavCard.vue";

const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const getRoute = () => {
  const route = useRoute();
  const routeArr = route.path.split("/");
  return routeArr[1];
};
</script>

<script>
export default {
  methods: {
    logout: function () {
      localStorage.removeItem('token');
      this.$router.replace('/login');
    }
  }
}

</script>


<template>
  <div
    class="collapse navbar-collapse w-auto h-auto h-100"
    id="sidenav-collapse-main"
  >
    <ul class="navbar-nav">
      <li class="nav-item">
        <sidenav-item
          to="/home"
          :class="getRoute() === 'home' ? 'active' : ''"
          :navText="'主页'"
        >
          <template v-slot:icon>
            <i class="ni ni-tv-2 text-primary text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/quireGrade"
          :class="getRoute() === 'tables' ? 'active' : ''"
          :navText="'考试成绩查询'"
        >
                    <template v-slot:icon>
                      <i
                        class="vxe-icon-search text-info text-sm opacity-10"
                      ></i>
                    </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
            to="/inputGrade"
            :class="getRoute() === 'tables' ? 'active' : ''"
            :navText="'新建考试成绩'"
        >
          <template v-slot:icon>
            <i
                class="vxe-icon-add text-warning text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>
      <li class="mt-3 nav-item">
        <h6 class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6 ms-2">
          统计分析
        </h6>
      </li>
      <li class="nav-item">
        <sidenav-item
            to="/studentGradeChart"
            :class="getRoute() === 'tables' ? 'active' : ''"
            :navText="'学生成绩报表'"
        >
          <template v-slot:icon>
            <i
                class="vxe-icon-chart-line text-success text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
            to="/classGradeChart"
            :class="getRoute() === 'tables' ? 'active' : ''"
            :navText="'班级成绩报表'"
        >
          <template v-slot:icon>
            <i
                class="vxe-icon-chart-pie text-primary text-sm opacity-10"
            ></i>
          </template>
        </sidenav-item>
      </li>
      <li class="nav-item">
        <sidenav-item
          to="/billing"
          :class="getRoute() === 'billing' ? 'active' : ''"
          :navText="isRTL ? 'الفواتیر' : 'Billing'"
        >
          <template v-slot:icon>
            <i class="ni ni-credit-card text-success text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="mt-3 nav-item">
        <h6
          v-if="isRTL"
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          صفحات المرافق
        </h6>

        <h6
          v-else
          class="text-xs ps-4 text-uppercase font-weight-bolder opacity-6"
          :class="isRTL ? 'me-4' : 'ms-2'"
        >
          ACCOUNT PAGES
        </h6>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/profile"
          :class="getRoute() === 'profile' ? 'active' : ''"
          :navText="isRTL ? 'حساب تعريفي' : 'Profile'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-02 text-dark text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/loginService"
          :class="getRoute() === 'login' ? 'active' : ''"
          :navText="isRTL ? 'تسجيل الدخول' : '登录'"
        >
          <template v-slot:icon>
            <i class="ni ni-single-copy-04 text-danger text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item">
        <sidenav-item
          to="/signup"
          :class="getRoute() === 'signup' ? 'active' : ''"
          :navText="isRTL ? 'اشتراك' : 'Sign Up'"
        >
          <template v-slot:icon>
            <i class="ni ni-collection text-info text-sm opacity-10"></i>
          </template>
        </sidenav-item>
      </li>

      <li class="nav-item" @click="logout">
        <sidenav-item
            to="/signup"
            :class="getRoute() === 'signup' ? 'active' : ''"
            :navText="isRTL ? 'اشتراك' : '登出'"
        >
          <template v-slot:icon>
            <i class="ni ni-cart text-info text-sm opacity-10" ></i>
          </template>
        </sidenav-item>
      </li>
    </ul>
  </div>

  <div class="pt-3 mx-3 mt-3 sidenav-footer">
    <sidenav-card
      :card="{
        title: 'Need Help?',
        description: 'Please check our docs',
        links: [
          {
            label: 'Documentation',
            route:
              'https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/',
            color: 'dark',
          },
          {
            label: 'Buy now',
            route:
              'https://www.creative-tim.com/product/vue-argon-dashboard-pro?ref=vadp',
            color: 'success',
          },
        ],
      }"
    />
  </div>
</template>
