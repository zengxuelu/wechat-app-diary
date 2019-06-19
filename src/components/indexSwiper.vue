<template>
  <div class="index-swiper">
    <swiper class="swiper-container" 
    :indicator-dots="indicatorDots" 
    :autoplay="autoplay" 
    :interval="interval" 
    :duration="duration"
    indicator-color="rgba(255, 255, 255, .8)"
    circular="true"
    >
      <block v-for="(item, index) in imgUrls" :key="index">
        <swiper-item class="slide-item">
          <image :src="item" mode="aspectFill" lazy-load="true" class="slide-image"/>
        </swiper-item>
      </block>
    </swiper>
  </div>
</template>

<script>
export default {
  data () {
    return {
      indicatorDots: true,
      autoplay: true,
      interval: 3000,
      duration: 500
    }
  },
  props: ['imgUrls'],

  onLoad () {

  }
}
</script>

<style lang="less" scoped>
.swiper-container {
  height: 200px;
  .slide-item {
    width: 100%;
    height: 100%;
    .slide-image {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
}
</style>
