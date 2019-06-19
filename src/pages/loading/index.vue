<template>
  <div class="loading">
    <div class="c-cube-1">
      <div class="c-cube">
        <div class="c-cube__side c-cube__side--front"></div>
        <div class="c-cube__side c-cube__side--back"></div>
        <div class="c-cube__side c-cube__side--right"></div>
        <div class="c-cube__side c-cube__side--left"></div>
        <div class="c-cube__side c-cube__side--top"></div>
      </div>
    </div>
    <div class="line line-1"></div>
    <div class="line line-2"></div>
    <div class="line line-3"></div>
    <div class="line line-4"></div>
    <p class="progress-text origin-font">{{count}}%</p>
  </div>
</template>

<script>
export default {
  data () {
    return {
      count: 0
    }
  },

  methods: {
    loading () {
      let timer = setInterval(() => {
        this.count += 1
        if (this.count >= 100) {
          this.count = 100
          clearInterval(timer)
          wx.switchTab({
            url: '../index/main'
          })
        }
      }, 40)
    }
  },

  created () {
    this.loading()
  }
}
</script>

<style lang="less" scoped>
.loading {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #fff;
  z-index: 110;
}
.loading .progress-text {
  position: absolute;
  top: 50%;
  left: 0;
  margin-top: 1.86667rem;
  width: 100%;
  color: #ff1224;
  font-size: 0.24rem;
  text-align: center;
}

.loading .c-cube {
  font-size: 0.8rem;
  transform: rotateX(-33.5deg) rotateY(45deg);
  transform-origin: 0.5em 0.5em;
  transform-style: preserve-3d;
  animation: spin-cube-right 1.2s linear infinite;
}

@keyframes spin-cube-right {
  0% {
    transform: rotateX(-33.5deg) rotateY(45deg);
  }

  to {
    transform: rotateX(-33.5deg) rotateY(225deg);
  }
}

.loading .c-cube__side {
  height: 1em;
  position: absolute;
  width: 1em;
}

.loading .c-cube__side--left,
.loading .c-cube__side--right {
  backface-visibility: hidden;
  border: 1px solid;
  border-image: linear-gradient(#ff1224, rgba(255, 18, 36, 0)) 2 100%;
  border-top: none;
  border-bottom: none;
  height: 5em;
}

.loading .c-cube__side--back,
.loading .c-cube__side--front {
  backface-visibility: hidden;
  border: 1px solid;
  border-image: linear-gradient(#ff1224, rgba(255, 18, 36, 0)) 2 100%;
  border-top: none;
  border-bottom: none;
  height: 5em;
}

.loading .c-cube__side--front {
  border-image: linear-gradient(180deg, #ff1224, rgba(255, 18, 36, 0)) 2 100%;
}

.loading .c-cube__side--bottom,
.loading .c-cube__side--top {
  border: 1px solid #ff1224;
  background: #fff;
}

.loading .c-cube__side--front {
  transform: translateZ(0.5em);
}

.loading .c-cube__side--back {
  transform: translateZ(-0.5em);
}

.loading .c-cube__side--right {
  transform: rotateY(90deg) translateZ(0.5em);
}

.loading .c-cube__side--left {
  transform: rotateY(-90deg) translateZ(0.5em);
}

.loading .c-cube__side--top {
  transform: rotateX(90deg) translateZ(0.5em);
}

.loading .c-cube-1 {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -2.13333rem;
  margin-left: -0.4rem;
  animation: cube-up-down-1 0.8s ease-in-out infinite alternate;
}

@keyframes cube-up-down-1 {
  0% {
    transform: translateZ(0);
  }

  to {
    transform: translate3d(0, -0.4rem, 0);
  }
}

.loading .c-cube-3,
.loading .line {
  position: absolute;
  top: 50%;
  left: 50%;
}

.loading .line {
  width: 1px;
  height: 1.33333rem;
  background: linear-gradient(-180deg, #ff1224, rgba(255, 18, 36, 0));
  animation: speed-line-anim 1.2s linear infinite both;
}

@keyframes speed-line-anim {
  0% {
    opacity: 0;
    transform: translateZ(0);
  }

  20% {
    opacity: 1;
    transform: translate3d(0, 40%, 0);
  }

  to {
    opacity: 0;
    transform: translate3d(0, 200%, 0);
  }
}

.loading .line-1 {
  margin-top: -2.4rem;
  margin-left: -1.33333rem;
  animation-delay: 0.2s;
  animation-duration: 1.5s;
}

.loading .line-2 {
  margin-left: -0.8rem;
  margin-top: -2.13333rem;
  animation-delay: 0.1s;
  animation-duration: 1s;
}

.loading .line-3 {
  margin-left: 0.4rem;
  margin-top: -1.86667rem;
  animation-delay: 0.6s;
  animation-duration: 1.4s;
}

.loading .line-4 {
  margin-left: 1.06667rem;
  margin-top: -2.4rem;
  animation-delay: 0.8s;
}
</style>
