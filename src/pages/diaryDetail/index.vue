<template>
  <div class="detail-container">
    <detail-swiper :detailImgs="detailImgs"></detail-swiper>
    <div class="detail-content">
      <div class="tt">{{ detailInfo.title }}</div>
      <div class="user">
        <div class="author">作者：{{ detailInfo.nickname }}</div>
        <div class="time">发布时间：{{ detailInfo.creatTime }}</div>
      </div>
      <div class="content">{{detailInfo.content}}</div>
      <div class="preview">
        <div class="icons-item icons-item2">
          <div class="zan" :class="{heartAnimation: isAnimate}" @tap="dianZan"></div>
          <p>{{detailInfo.fabulous}}</p>
        </div>
      </div>
    </div>

    <div class="comment-wrap">
      <div class="txt">
        <label for="content">评论：</label>
        <textarea id="content" class="content" v-model="content" placeholder="说点什么吧..." maxlength="60" @input="handleContentInput"></textarea>
        <div class="textarea-counter">{{contentCount}}/60</div>
      </div>
      <button class="release" size="mini" type="primary" open-type="getUserInfo" @getuserinfo="onGotUserInfo">发表评论</button>
      <div class="comment-info">
        <div class="comment-content">
          <block v-for="(comment, index) in commentList" :key="index">
            <div class="comment">
              <div class="avatar-box">
                <image class="avatar" mode="aspectFill" :src="comment.user.avatarUrl" />
                <p class="nickname">{{ comment.user.nickName }}</p>
              </div>
              <div class="comment-box">
                <div class="txt">{{ comment.content }}</div>
                <p class="time">{{ comment.time }}</p>
              </div>
            </div>
          </block>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {toast, getNowFormatDate} from '../../utils/index.js'
import detailSwiper from '../../components/detailSwiper'

export default {
  data () {
    return {
      detailInfo: {},
      detailImgs: [],
      isAnimate: false,
      isZan: false, // 是否已点过赞
      contentCount: 0, // 正文字数
      content: '', // 正文内容
      commentList: []
    }
  },

  computed: {

  },

  components: {
    detailSwiper
  },

  methods: {
    // 点赞
    dianZan () {
      const that = this
      const db = wx.cloud.database()
      const _id = this.$root.$mp.query.id
      const dianzan = db.collection('dianzan')
      dianzan.where({
        textId: _id,
        _openid: that.openId
      }).get({
        success: function (res) {
          if (res.data.length === 0) {
            that.addDZ()
            return false
          }
          toast('不能重复点赞哦！', 'none')
        }
      })
    },
    addDZ () {
      const that = this
      const _id = this.$root.$mp.query.id
      const db = wx.cloud.database()
      const dianzan = db.collection('dianzan')
      dianzan.add({
        data: {
          textId: _id,
          isZan: 1
        }
      }).then(res => {
        that.isAnimate = true
        that.changeDZCount(_id)
      })
    },
    changeDZCount (id) {
      const that = this
      wx.cloud.callFunction({
        name: 'dianzan',
        data: {
          _id: id
        }
      }).then(res => {
        toast('谢谢您的认可哦！', 'none')
        that.getDiaryDetail(id)
      })
    },
    getZan () {
      const that = this
      const db = wx.cloud.database()
      const _id = this.$root.$mp.query.id
      const dianzan = db.collection('dianzan')
      dianzan.where({
        textId: _id,
        _openid: that.openId
      }).get({
        success: function (res) {
          if (res.data.length) {
            that.isAnimate = true
          }
        }
      })
    },
    // 阅读人数
    addPreview (id) {
      wx.cloud.callFunction({
        name: 'preview',
        data: {
          _id: id
        }
      }).then(res => {

      })
    },

    getDiaryDetail (id) {
      const that = this
      const db = wx.cloud.database()
      const diary = db.collection('diary')
      diary.doc(id).get().then(res => {
        that.detailInfo = res.data
        that.detailImgs = res.data.imagesList
      })
    },
    // 获取openid
    getOpenId () {
      const that = this
      wx.cloud.callFunction({
        name: 'user'
      }).then(res => {
        that.openId = res.result.OPENID
      })
    },
    // 获取评论
    getComment (id) {
      const that = this
      const db = wx.cloud.database()
      const comment = db.collection('comment')
      comment.where({
        textId: id
      }).get({
        success: function (res) {
          that.commentList = res.data.reverse()
        }
      })
    },
    // 添加评论
    addComment () {
      if (this.content === '') {
        toast('请输入评论内容', 'none')
        return false
      }
      const that = this
      const db = wx.cloud.database()
      const comment = db.collection('comment')
      comment.add({
        data: {
          textId: this.$root.$mp.query.id, // 正文id
          user: that.userInfo, // 用户信息
          content: that.content, // 评论内容
          time: getNowFormatDate() // 评论时间
        }
      }).then(res => {
        that.contentCount = 0
        that.getComment(this.$root.$mp.query.id)
      })
    },
    // 判断用户是否发表过评论
    getIsComment () {
      const that = this
      const db = wx.cloud.database()
      const comment = db.collection('comment')
      comment.where({
        _openid: that.openId,
        textId: this.$root.$mp.query.id
      }).get().then(res => {
        if (res.data.length === 0) {
          that.addComment()
          toast('发表成功')
          that.content = ''
          return false
        }
        toast('不能重复发表评论哦！', 'none')
      })
    },
    handleContentInput (e) {
      this.contentCount = e.target.value.length
    },
    onGotUserInfo (e) {
      this.userInfo = e.target.userInfo
      this.getIsComment()
    }
  },

  created () {

  },

  onReady () {
    wx.showLoading({
      title: '加载中...'
    })
    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
    this.isAnimate = false
    this.getDiaryDetail(this.$root.$mp.query.id)
    this.addPreview(this.$root.$mp.query.id)
    this.getComment(this.$root.$mp.query.id)
    this.getOpenId()
    this.getZan()
  }
}
</script>

<style lang="less" scoped>
.detail-container {
  .detail-content {
    padding: 10px 20px;
    .tt {
      text-align: center;
      font-size: 16px;
      font-weight: 700;
    }
    .user {
      font-size: 12px;
      color: #999;
      margin-top: 6px;
      padding-bottom: 6px;
      border-bottom: 1rpx dashed #dfdfdf;
      overflow: hidden;
      .author {
        float: left;
      }
      .time {
        float: right;
      }
    }
    .content {
      font-size: 14px;
      padding-top: 20px;
      text-indent: 28px;
      line-height: 22px;
    }
    .preview {
      font-size: 14px;
      line-height: 22px;
      .icons-item {
        position: relative;
        float: right;
        height: 80px;
        margin-right: 5px;
        .zan {
          display: inline-block;
          height: 80px;
          width: 80px;
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
          line-height: 80px;
          font-size: 12px;
          color: #dfdfdf;
        }
      }
    }
  }
  .comment-wrap {
    margin: 80px 20px;
    font-size: 14px;
    .txt {
      position: relative;
      .content {
        font-size: 14px;
        padding: 10px;
        height: 80px;
      }
      .textarea-counter {
        position: absolute;
        bottom: 0;
        right: -10px;
        color: #dfdfdf;
      }
    }
    .release {
      margin-top: 10px;
    }
    .comment-info {
      margin-top: 10px;
      border-top: 1px solid #dfdfdf;
      .comment-content {
        padding-top: 20px;
        .comment {
          padding: 10px 6px;
          height: 80px;
          margin-bottom: 10px;
          border-bottom: 1px dashed #dfdfdf;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .avatar-box {
          width: 20%;
          .avatar {
            display: block;
            width: 50px;
            height: 50px;
            border-radius: 25px;
            margin-top: 5px;
            margin: 0 auto;
            border: 1rpx solid rgb(243, 234, 234);
          }
          .nickname {
            overflow: hidden;
            text-align: center;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 10px;
            margin-top: 4px;
          }
        }
        .comment-box {
          width: 78%;
          height: 100%;
          position: relative;
          .txt {
            color: #222;
            font-size: 12px;
            padding-top: 6px;
            line-height: 20px;
          }
          .time {
            position: absolute;
            bottom: -8px;
            right: 0;
            color:#999;
            font-size: 10px;
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
