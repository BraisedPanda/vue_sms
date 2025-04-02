<template>
  <div v-if="visible" class="alert text-white font-weight-bold alert-danger alert-dismissible fade show" role="alert">
    {{ message }}
    <button type="button" class="btn-close d-flex justify-content-center align-items-center" data-bs-dismiss="alert"
            @click="hideMessage" aria-label="Close"></button>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {


  setup() {
    const visible = ref(false);
    const message = ref('');

    function showMessage(msg) {
      message.value = msg;
      visible.value = true;
      setTimeout(hideMessage, 5000); // 3秒后自动隐藏
    }

    function hideMessage() {
      visible.value = false;
      message.value = '';
    }

    return {
      visible,
      message,
      showMessage,
      hideMessage
    };
  }
};
</script>

<style scoped>
.alert {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1050;
}
</style>
