<template>
  <div class="detail-swiper">
      <swiper class="swiper-container" 
      :indicator-dots="indicatorDots" 
      :autoplay="autoplay" 
      :interval="interval" 
      :duration="duration"
      indicator-color="rgba(255, 255, 255, .8)"
      circular="true"
      >
        <block v-for="(item, index) in detailImgs" :key="index">
          <swiper-item class="slide-item">
            <image :src="item" mode="aspectFill" class="slide-image" lazy-load="true" :data-idx="index" @tap="handleImagePreview" />
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
  props: ['detailImgs'],

  methods: {
    // 全屏预览图片
    handleImagePreview (e) {
      let idx = e.target.dataset.idx
      let images = this.detailImgs
      wx.previewImage({
        current: images[idx],
        urls: images
      })
    }
  },

  onLoad () {

  }
}
</script>

<style lang="less" scoped>
.detail-swiper {
  height: 200px;
  .swiper-container {
    height: 100%;
  }
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
