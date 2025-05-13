<template>
  <div class="card card-carousel overflow-hidden h-100 p-0">
    <div
      id="carouselExampleCaptions"
      class="carousel slide h-100"
      data-bs-ride="carousel"
    >
      <div class="carousel-inner border-radius-lg h-100">
        <div
          class="carousel-item h-100 active"
          :style="{
            backgroundImage:
              'url(' + imgUrl1 + ')',
            backgroundSize: 'cover',
          }"
        >
          <div
            class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-3"
          >
            <h5 class="text-white bold  mb-3">{{content}}</h5>
            <p class="text-sm">{{title}} · {{author}}</p>
          </div>
        </div>

        <div
          class="carousel-item h-100"
          :style="{
            backgroundImage:
              'url(' + imgUrl2 + ')',
            backgroundSize: 'cover',
          }"
        >
          <div
            class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-3"
          >

            <h5 class="text-white bold  mb-3">{{content2}}</h5>
            <p class="text-sm">{{title2}} · {{author2}}</p>
          </div>
        </div>

        <div
          class="carousel-item h-100"
          :style="{
            backgroundImage:'url(' + imgUrl3 + ')',
            backgroundSize: 'cover',
          }"
        >
          <div
              class="carousel-caption d-none d-md-block bottom-0 text-start start-0 ms-3"
          >

            <h5 class="text-white bold  mb-3">{{content3}}</h5>
            <p class="text-sm">{{title3}} · {{author3}}</p>
          </div>
        </div>

      </div>
      <button
        class="carousel-control-prev w-5 me-3"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Previous</span>
      </button>
      <button
        class="carousel-control-next w-5 me-3"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span class="carousel-control-next-icon" aria-hidden="true"></span>
        <span class="visually-hidden">Next</span>
      </button>
    </div>
  </div>
</template>

<script>

// import * as settingService from "@/api/settingInfoService";


export default {

  data() {
    const jinrishici = require('jinrishici');

    const title = '';
    const author = '';
    const content = '';
    const title2 = '';
    const author2 = '';
    const content2 = '';
    const title3 = '';
    const author3 = '';
    const content3 = '';
    const imgUrl1 = '';
    const imgUrl2 = '';
    const imgUrl3 = '';

    return {
      jinrishici,
      title,
      author,
      content,
      title2,
      author2,
      content2,
      title3,
      author3,
      content3,
      imgUrl1,
      imgUrl2,
      imgUrl3,

    };
  },
  mounted() {

  },

  created() {
    this.getImageUrl()
    this.loadSentence();
  },

  methods: {

    loadSentence: function() {
      try {
        this.jinrishici.load(result => {
          this.content = result.data.content
          this.title = result.data.origin.title
          this.author = result.data.origin.author
        });
        this.jinrishici.load(result => {
          this.content2 = result.data.content
          this.title2 = result.data.origin.title
          this.author2 = result.data.origin.author
        });
        this.jinrishici.load(result => {
          this.content3 = result.data.content
          this.title3 = result.data.origin.title
          this.author3 = result.data.origin.author
        });
      }catch (error) {
        console.error('jinrishici捕获到错误:', error);
      }
     
    },

    getImageUrl() {
      this.imgUrl1 = 'https://bing.img.run/rand.php';
      this.imgUrl2 = 'https://bing.img.run/rand_1366x768.php';
      this.imgUrl3 = 'https://bing.img.run/rand_m.php';

      // settingService.getImageUrl().then(response => {
      //   if (response.code === 200) {
      //     this.imgUrl1 = response.data.imageUrl1;
      //     this.imgUrl2 = response.data.imageUrl2;
      //     this.imgUrl3 = response.data.imageUrl3;
      //
      //   }
      // });
    },





  },
};
</script>
