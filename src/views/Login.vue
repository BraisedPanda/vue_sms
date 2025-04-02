<script setup>
import { onBeforeUnmount, onBeforeMount } from "vue";
import { useStore } from "vuex";
// import Navbar from "@/examples/PageLayout/Navbar.vue";
import ArgonInput from "@/components/ArgonInput.vue";
import ArgonSwitch from "@/components/ArgonSwitch.vue";
import ArgonButton from "@/components/ArgonButton.vue";
const body = document.getElementsByTagName("body")[0];

const store = useStore();
onBeforeMount(() => {
  store.state.hideConfigButton = true;
  store.state.showNavbar = false;
  store.state.showSidenav = false;
  store.state.showFooter = false;
  body.classList.remove("bg-gray-100");
});
onBeforeUnmount(() => {
  store.state.hideConfigButton = false;
  store.state.showNavbar = true;
  store.state.showSidenav = true;
  store.state.showFooter = true;
  body.classList.add("bg-gray-100");
});
</script>

<script>

import * as loginService  from '@/api/login';
// import axios from 'axios';
export default {
  name: 'LoginCard',

  data() {
    return {
      loginUser: {
        username: '',
        password: '',
      },
      formRules: {
        //制定表单输入的规则
        username: [{required: true, message: '用户名不能为空', trigger: 'blur'}],
        password: [{required: true, message: '密码不能为空', trigger: 'blur'}]
      }
    }
  },

  methods: {
    doSubmit: function () {
      loginService.loginIn({
        "username": this.username,
        "password": this.password
      }, {
        withCredentials: true // 允许跨域请求携带Cookie
      }).then((res) => {
        if(res.code === 200) {
          // 假设后端返回的用户信息在response.data中
          const token = res.data;
          // 将用户信息存储在Local Storage中
          localStorage.setItem('token', token);
          // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          this.$router.replace('/home');
        }else {
          this.$MessageAi.showMessage(res.message);
        }
    }).catch(() => {
          this.$MessageAi.showMessage("服务器错误！")
      });
  },

  checkInfo: function () {
    if (this.username == "") {
      this.$MessageAi.showMessage('请输入帐号');
      this.isRight = false;
    } else if (this.username.length < 8 || this.username.length > 20) {
      this.$MessageAi.showMessage('账号长度必须为8-20个字符！');
      this.isRight = false;
    } else {
      //账号合法，校验密码
      if (this.password == "") {
        this.$MessageAi.showMessage('请输入密码');
        this.isRight = false;
      } else if (this.password.length < 6 || this.password.length > 16) {
        this.$MessageAi.showMessage('密码长度必须为6-16个字符！');
        this.isRight = false;
      } else {
        this.isRight = true;
      }
    }
  },




    onSubmit() {
      //判断表单是否符合规则
      this.$refs['loginForm'].validate((valid) => {
            if (valid) {
              if (this.loginUser.username !== '123456' || this.loginUser.password !== '123456'){
                // this.$message({
                //   message:'账号或密码错误',
                //   type: 'error',
                // });
                return;
              }
              this.$router.push({path:'/home'});
            }
          }
      )
    },


  }
}
</script>

<template>
<!--  <div class="container top-0 position-sticky z-index-sticky">-->
<!--    <div class="row">-->
<!--      <div class="col-12">-->
<!--        <navbar-->
<!--          isBlur="blur  border-radius-lg my-3 py-2 start-0 end-0 mx-4 shadow"-->
<!--          v-bind:darkMode="true"-->
<!--          isBtn="bg-gradient-success"-->
<!--        />-->
<!--      </div>-->
<!--    </div>-->
<!--  </div>-->
  <main class="mt-0 main-content">
    <section>
      <div class="page-header min-vh-100">
        <div class="container">
          <div class="row">
            <div
              class="mx-auto col-xl-4 col-lg-5 col-md-7 d-flex flex-column mx-lg-0"
            >
              <div class="card card-plain">
                <div class="pb-0 card-header text-start">
                  <h4 class="font-weight-bolder">Sign In</h4>
                  <p class="mb-0">Enter your email and password to sign in</p>
                </div>
                <div class="card-body">
                  <form role="form" @submit.prevent="doSubmit">
                    <div class="mb-3">
                      <argon-input
                        id="username"
                        type="text"
                        placeholder="User Name"
                        name="username"
                        v-model="username"
                        size="lg"
                      />
                    </div>
                    <div class="mb-3">
                      <argon-input
                        id="password"
                        type="password"
                        placeholder="Password"
                        name="password"
                        v-model="password"
                        size="lg"
                      />
                    </div>
                    <argon-switch id="rememberMe" name="remember-me"
                      >Remember me</argon-switch
                    >

                    <div class="text-center">
                      <argon-button
                        class="mt-4"
                        variant="gradient"
                        color="success"
                        fullWidth
                        size="lg"
                        @click="doSubmit"
                        >登录</argon-button
                      >
                    </div>
                  </form>
                </div>
                <div class="px-1 pt-0 text-center card-footer px-lg-2">
                  <p class="mx-auto mb-4 text-sm">
                    Don't have an account?
                    <a
                      href="javascript:;"
                      class="text-success text-gradient font-weight-bold"
                      @click="onSubmit"
                      >注册</a
                    >
                  </p>
                </div>
              </div>
            </div>
            <div
              class="top-0 my-auto text-center col-6 d-lg-flex d-none h-100 pe-0 position-absolute end-0 justify-content-center flex-column"
            >
              <div
                class="position-relative bg-gradient-primary h-100 m-3 px-7 border-radius-lg d-flex flex-column justify-content-center overflow-hidden"
                style="
                  background-image: url(&quot;https://raw.githubusercontent.com/creativetimofficial/public-assets/master/argon-dashboard-pro/assets/img/signin-ill.jpg&quot;);
                  background-size: cover;
                "
              >
                <span class="mask bg-gradient-success opacity-6"></span>
                <h4
                  class="mt-5 text-white font-weight-bolder position-relative"
                >
                  "Attention is the new currency"
                </h4>
                <p class="text-white position-relative">
                  The more effortless the writing looks, the more effort the
                  writer actually put into the process.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>
