<script setup>
defineProps({
  rowReverse: {
    type: Boolean,
    default: false,
  },
  title: {
    type: [Object, String],
    required: true,
    text: {
      type: String,
    },
    color: {
      type: String,
    },
  },
  description: {
    type: String,
    default: "",
  },
  value: {
    type: [Object, String, Number],
    required: true,
    text: {
      type: [String, Number],
    },
    color: {
      type: String,
    },
  },
  percentage: {
    type: [Object, String],
    value: {
      type: String,
    },
    color: {
      type: String,
    },
    default: () => ({
      color: "success",
    }),
  },
  img: {
    type: [String, Object],
    component: {
      type: String,
    },
    src: {
      type: String,
    },
    shape: {
      type: String,
    },
    default: () => ({
      background: "bg-white",
      shape: " border-radius-md",
    }),
  },
  classContent: {
    type: String,
    default: "",
  },
});
</script>
<template>
  <div class="mb-3 card">
    <div class="p-3 card-body">
      <div
        class="d-flex"
        :class="rowReverse ? '' : 'flex-row-reverse justify-content-between'"
      >
        <div class="text-center shadow icon icon-shape border-radius-md me-2">
          <img
              class="text-lg opacity-10"
              :src="img.src"
              width="60"
              height="60"
              aria-hidden="true"
           alt="">
        </div>


        <div :class="classContent">
          <div class="numbers">
            <p
              class="mb-0 text-sm text-uppercase font-weight-bold"
              :class="title.color"
            >
              {{ typeof title === "string" ? title : title.text }}
            </p>
            <h5 :class="`mb-0 font-weight-bolder ${value.color}`">
              {{
                (value && typeof value === "string") ||
                (value && typeof value === "number")
                  ? value
                  : value.text
              }}
              <span
                v-if="percentage && typeof percentage === 'string'"
                class="text-sm font-weight-bolder"
              >
                {{ percentage }}
              </span>
              <span
                v-if="percentage && typeof percentage === 'object'"
                :class="`text-sm font-weight-bolder text-${percentage.color}`"
              >
                {{ percentage.value }}
              </span>
            </h5>

            <p v-if="description" class="mt-2 mb-0 text-sm" v-html="description"></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
