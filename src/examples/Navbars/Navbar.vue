<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import Breadcrumbs from "../Breadcrumbs.vue";
import ArgonAvatar from "@/components/ArgonAvatar.vue";


const store = useStore();
const isRTL = computed(() => store.state.isRTL);

const route = useRoute();

const currentRouteName = computed(() => {
  return route.name;
});


</script>

<script>
export default {
  components: {
    ArgonAvatar,
  },
};
</script>

<template>

  <nav
    class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
    :class="isRTL ? 'top-0 position-sticky z-index-sticky' : ''"
    v-bind="$attrs"
    id="navbarBlur"
    data-scroll="true"
  >
    <div class="px-3 py-1 container-fluid">
      <breadcrumbs
        :current-page="currentRouteName"
        :current-directory="currentRouteName"

      />
<!--              :current-directory="currentDirectory"-->
      <div
        class="mt-2 collapse navbar-collapse mt-sm-0 me-md-0 me-sm-4"
        :class="isRTL ? 'px-0' : 'me-sm-4'"
        id="navbar"
      >

        <div
          class="pe-md-3 d-flex align-items-center"
          :class="isRTL ? 'me-md-auto' : 'ms-md-auto'"
        >
          <argon-avatar image="https://demos.creative-tim.com/vue-soft-ui-dashboard-pro/img/team-1.66f62826.jpg" alt="Avatar" size="sm" circular  />
           <span class="mr-auto mx-2 text-light font-weight-bolder">张..</span>
        </div>

      </div>
    </div>
  </nav>
</template>
