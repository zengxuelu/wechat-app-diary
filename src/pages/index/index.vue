<template>
  <div class="index-container">
    <index-swiper :imgUrls="imgUrls"></index-swiper>
    <div class="nav">
      <scroll-view class="scroll-view" scroll-x>
        <block v-for="(navItem, navIndex) in navList" :key="navIndex">
          <div class="nav-item" :class="[isActive == navIndex ? 'active' : '']" @tap="switechNav(navIndex)">{{navItem}}</div>
        </block>
      </scroll-view>
    </div>
    <div class="content-container">
      <div class="content-scroll-view">
        <div class="item" v-for="(diaryItem, diaryIndex) in diaryList" :key="diaryIndex" :data-idx="diaryIndex" @tap="navigateTo(diaryItem._id)">
          <div class="">
              <div class="img-box">
                <image :src="diaryItem.imagesList[0]" lazy-load="true" mode="aspectFill" />
              </div>
              <div class="info">
                <div class="avatar-container">
                  <image :src="diaryItem.avatarUrl" class="avatar"/>
                  <span>{{ diaryItem.nickname }}</span>
                </div>
                <div class="title">
                  <h1>{{ diaryItem.title }}</h1>
                  <p>{{ diaryItem.content }}</p>
                </div>
              </div>
          </div>
          <div class="icons">
              <div class="icons-item icons-item1">
                <image src="/static/images/eyes.png" class="eyes" />
                <p>{{ diaryItem.preview }}</p>
              </div>
              <div class="icons-item icons-item2">
                <div class="zan"></div>
                <p>{{ diaryItem.fabulous }}</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import indexSwiper from '../../components/indexSwiper'
import {toast} from '../../utils/index.js'

export default {
  data () {
    return {
      imgUrls: [],
      navList: ['全部', '最新', '我的'],
      isActive: 0,
      isAnimation: false,
      diaryList: []
    }
  },

  components: {
    indexSwiper
  },

  computed: {

  },

  methods: {
    navigateTo (id) {
      wx.navigateTo({
        url: '../diaryDetail/main?id=' + id
      })
    },
    switechNav (index) {
      this.isActive = index
      if (index === 0) {
        this.getDiaryList()
      }
      if (index === 1) {
        this.getNewList()
      }
      if (index === 2) {
        this.getOpenId()
      }
    },
    // 最近发布的，按时间排序前10条
    getNewList () {
      const that = this
      wx.showLoading({
        title: '加载中'
      })
      wx.cloud.callFunction({
        name: 'diaryList'
      }).then(res => {
        let infoList = res.result.data.reverse()
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        that.diaryList = infoList.slice(0, 10)
      })
    },
    // 获取openid
    getOpenId () {
      const that = this
      wx.cloud.callFunction({
        name: 'user'
      }).then(res => {
        that.openId = res.result.OPENID
        that.getMyList()
      })
    },
    // 获取自己发布的
    getMyList () {
      const that = this
      const db = wx.cloud.database()
      const diary = db.collection('diary')
      wx.showLoading({
        title: '加载中'
      })
      diary.where({
        _openid: that.openId
      }).get({
        success: function (res) {
          setTimeout(function () {
            wx.hideLoading()
          }, 2000)
          if (res.data.length === 0) {
            toast('您暂时没有发布文章日记', 'none')
          }
          that.diaryList = res.data.reverse()
        }
      })
    },
    // 通过云函数获取日记的list
    getDiaryList () {
      const that = this
      wx.showLoading({
        title: '加载中'
      })
      wx.cloud.callFunction({
        name: 'diaryList'
      }).then(res => {
        setTimeout(function () {
          wx.hideLoading()
        }, 2000)
        let infoList = res.result.data
        that.diaryList = infoList.sort(function (a, b) {
          return b.preview - a.preview
        })
        that.imgUrls = that.diaryList[0].imagesList
      })
    }
  },
  onShow () {

  },

  onReady () {
    wx.showLoading({
      title: '加载中...'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    this.getDiaryList()
  }
}
</script>

<style lang="less" scoped>
.nav {
  height: 40px;
  overflow: hidden;
  background: #eee;
  .scroll-view {
    width: 1000%;
    height: 100%;
  }
  .nav-item {
    float: left;
    line-height: 38px;
    padding: 0 10px;
    letter-spacing: 2px;
    font-size: 16px;
    &.active {
      color: #f00;
      border-bottom: 1px solid #f00;
    }
  }
}
.content-container {
  margin-top: 10px;
  border-top: 1rpx solid #ccc;
  background: rgb(240, 238, 238);
  .content-scroll-view {
    width: 100%;
    padding-top: 10px;
    display: flex;
    justify-content: start;
    flex-wrap: wrap;
    .item {
      width: 48%;
      padding: 5px;
      box-sizing: border-box;
      background: #fff;
      margin-left: 5px;
      margin-bottom: 10px;
      .img-box {
        width: 100%;
        height: 200rpx;
        image {
          display: block;
          width: 100%;
          height: 100%;
        }
      }
      .info {
        overflow: hidden;
        .avatar-container {
          float: left;
          width: 32%;
          overflow: hidden;
          .avatar {
            display: block;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            margin-top: 5px;
            border: 1rpx solid rgb(243, 234, 234);
          }
          span {
            display: block;
            font-size: 12px;
            color: #999;
            text-align: center;
          }
        }
        .title {
          float: right;
          width: 66%;
          margin-top: 5px;
          h1 {
            font-size: 14px;
            height: 20px;
            line-height: 22px;
            overflow: hidden;
            font-weight: 700;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          p {
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: wrap;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            margin-top: 5px;
            color: #666;
          }
        }
      }
      .icons {
        font-size: 12px;
        color: #999;
        .icons-item {
          position: relative;
          float: left;
          height: 40px;
          line-height: 40px;
          .eyes {
            display: inline-block;
            height: 15px;
            width: 15px;
            margin-right: 8px;
            margin-top: 12px;
            margin-left: 10px;
          }
          .zan {
            display: inline-block;
            height: 40px;
            width: 40px;
            background-image: url("https://zt2m.ztgame.com/act/yinxiong/images/web_heart_animation.png");
            background-position: left;
            background-repeat: no-repeat;
            background-size: 2900%;
            &.heartAnimation {
              display: inline-block;
              -webkit-animation-name: heartBlast;
              animation-name: heartBlast;
              -webkit-animation-duration: .8s;
              animation-duration: .8s;
              -webkit-animation-iteration-count: 1;
              animation-iteration-count: 1;
              -webkit-animation-timing-function: steps(28);
              animation-timing-function: steps(28);
              background-position: right;
            }
          }
          p {
            display: inline-block;
            height: 100%;
            vertical-align: top;
            line-height: 40px;
          }
          &.icons-item2 {
            float: right;
            margin-right: 5px;
          }
        }
      }
    }
  }
}

@keyframes heartBlast {
  0% {
    background-position: left;
  }
  100% {
    background-position: right;
  }
}
</style>

