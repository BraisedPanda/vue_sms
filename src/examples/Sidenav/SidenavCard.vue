<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
const store = useStore();

const layout = computed(() => store.state.layout);
defineProps({
  card: {
    type: Object,
    required: true,
    title: String,
    description: String,
    links: {
      type: Array,
      label: String,
      route: String,
      color: String,
    },
  },
});
</script>
<template>
  <div
    v-show="layout !== 'landing'"
    class="card card-plain shadow-none"
    id="sidenavCard"
  >
    <div class="p-3 card-body text-center w-100 pt-0">
      <img
        class="w-50 mx-auto"
        src="@/assets/img/illustrations/rocket-white.png"
        alt="sidebar_illustration"
      />

<!--      <h6 class="mb-0 text-dark up">Need Help ?</h6>-->


<!--      <p class="text-xs font-weight-bold">Please check our docs</p>-->
    </div>


<!--    <a-->
<!--      href="https://www.creative-tim.com/learning-lab/vue/overview/argon-dashboard/"-->
<!--      target="_blank"-->
<!--      class="mb-3 btn btn-dark btn-sm w-100"-->
<!--    >-->
<!--      Documentation-->
<!--    </a>-->

  </div>
</template>
