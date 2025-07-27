<script setup>
import { onBeforeMount, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";

import setNavPills from "@/assets/js/nav-pills.js";
import setTooltip from "@/assets/js/tooltip.js";
import ProfileCard from "./components/ProfileCard.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonButton from "@/components/ArgonButton.vue";

const body = document.getElementsByTagName("body")[0];

const store = useStore();

onMounted(() => {
  store.state.isAbsolute = true;
  setNavPills();
  setTooltip();
});
onBeforeMount(() => {
  store.state.imageLayout = "profile-overview";
  store.state.showNavbar = false;
  store.state.showFooter = true;
  store.state.hideConfigButton = true;
  body.classList.add("profile-overview");
});
onBeforeUnmount(() => {
  store.state.isAbsolute = false;
  store.state.imageLayout = "default";
  store.state.showNavbar = true;
  store.state.showFooter = true;
  store.state.hideConfigButton = false;
  body.classList.remove("profile-overview");
});
</script>
<template>
  <main>
    <div class="container-fluid">
      <div
        class="page-header min-height-300"
        style="
          background-image: url(&quot;https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80&quot;);
          margin-right: -24px;
          margin-left: -34%;
        "
      >
        <span class="mask bg-gradient-success opacity-6"></span>
      </div>
      <div class="card shadow-lg mt-n6">
        <div class="card-body p-3">
          <div class="row gx-4">
            <div class="col-auto">
              <div class="avatar avatar-xl position-relative">
                <img
                  src="../assets/img/photo.png"
                  alt="profile_image"
                  class="shadow-sm w-100 border-radius-lg"
                />
              </div>
            </div>
            <div class="col-auto my-auto">
              <div class="h-100">
                <h5 class="mb-1">王老师</h5>
                <p class="mb-0 font-weight-bold text-sm">个人信息</p>
              </div>
            </div>
            <div
              class="mx-auto mt-3 col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0"
            >

            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="py-4 container-fluid">
      <div class="row">
        <div class="col-md-8">
          <div class="card">
            <div class="card-header pb-0">
              <div class="d-flex align-items-center">
                <p class="mb-0">信息</p>
<!--                <argon-button color="success" size="sm" class="ms-auto"-->
<!--                  >Settings</argon-button-->
<!--                >-->
              </div>
            </div>
            <div class="card-body">
              <p class="text-uppercase text-sm">基本信息</p>
              <div class="row">
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >姓名</label
                  >
                  <p class="text-uppercase text-sm">王老师</p>
<!--                  <argon-input type="text" value="lucky.jesse" placeholder ="王老师" />-->
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >Email</label
                  >
                  <p class="text-uppercase text-sm">987433278@qq.com</p>
<!--                  <argon-input type="email" value="jesse@example.com" />-->
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >学科</label
                  >
                  <p class="text-uppercase text-sm">语文</p>
<!--                  <input class="form-control" type="text" value="Jesse" />-->
                </div>
                <div class="col-md-6">
                  <label for="example-text-input" class="form-control-label"
                    >年级</label
                  >
                  <p class="text-uppercase text-sm">四年级</p>
<!--                  <argon-input type="text" value="Lucky" />-->
                </div>
              </div>
              <hr class="horizontal dark" />
              <p class="text-uppercase text-sm">联系方式</p>
              <div class="row">
                <div class="col-md-12">
                  <label for="example-text-input" class="form-control-label"
                    >地址</label
                  >
                  <p class="text-uppercase text-sm">某某学校</p>
<!--                  <argon-input-->
<!--                    type="text"-->
<!--                    value="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"-->
<!--                  />-->
                </div>
                <div class="col-md-4">
                  <label for="example-text-input" class="form-control-label"
                    >城市</label
                  >
                  <p class="text-uppercase text-sm">合肥市</p>
<!--                  <argon-input type="text" value="New York" />-->
                </div>
                <div class="col-md-4">
                  <label for="example-text-input" class="form-control-label"
                    >行政区</label
                  >
                  <p class="text-uppercase text-sm">庐阳区</p>
<!--                  <argon-input type="text" value="United States" />-->
                </div>
                <div class="col-md-4">
                  <label for="example-text-input" class="form-control-label"
                    >行政区划代码</label
                  >
                  <p class="text-uppercase text-sm">340103</p>

<!--                  <argon-input type="text" value="437300" />-->
                </div>
              </div>
              <hr class="horizontal dark" />
              <p class="text-uppercase text-sm">座右铭</p>
              <div class="row">
                <div class="col-md-12">
                  <label for="example-text-input" class="form-control-label"
                    >座右铭</label
                  >
                  <p class="text-uppercase text-sm">其身正，不令而行；其身不正，虽令不从。</p>
<!--                  <argon-input-->
<!--                    type="text"-->
<!--                    value="A beautiful Dashboard for Bootstrap 5. It is Free and Open Source."-->
<!--                  />-->
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <profile-card />
        </div>
      </div>
    </div>
  </main>
</template>
