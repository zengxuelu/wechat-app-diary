<template>
  <div class="write-container">
    <div class="title">
      <label for="title">文章标题：</label>
      <input type="text" id="title" v-model="title" class="w-tt" placeholder="请输入文章标题" maxlength="20" focus="true" @input="handleTitleInput">
      <div class="title-counter">{{titleCount}}/20</div>
    </div>
    <div class="title">
      <label for="content">文章内容：</label>
      <textarea id="content" class="content" v-model="content" placeholder="请输入文章内容..." maxlength="500" @input="handleContentInput"></textarea>
      <div class="textarea-counter">{{contentCount}}/500</div>
    </div>
    <button type="default" size="mini" @tap="chooseImage" class="add-img">添加图片</button>
    <div class="images-wrap">
      <block v-for="(imgItem, imgIndex) in imagesList" :key="imgIndex">
        <div class="s-image-wrap">
          <image class="image" :src="imgItem" lazy-load="true" mode="aspectFill" :data-idx="imgIndex" @tap="handleImagePreview" />
          <button type="warn" size="mini" class="image-remover" :data-idx="imgIndex" @tap="removeImage">删除</button>
        </div>
      </block>
    </div>
    <button type="primary" size="default" class="submit-form" open-type="getUserInfo" lang="zh_CN" @getuserinfo="onGotUserInfo">发布文章</button>
  </div>
</template>

<script>
import {toast, getNowFormatDate} from '../../utils/index.js'

export default {
  data () {
    return {
      titleCount: 0, // 标题字数
      title: '', // 标题内容
      contentCount: 0, // 正文字数
      content: '', // 正文内容
      imagesList: [] // 存储用户上传的图片
    }
  },

  components: {

  },

  methods: {
    chooseImage () {
      const that = this
      wx.chooseImage({
        count: 9,
        sizeType: ['original', 'compressed'],
        sourceType: ['album', 'camera'],
        success: function (res) {
          // 将选择的图片上传到云服务器中
          for (let i = 0; i < res.tempFilePaths.length; i++) {
            let filePath = res.tempFilePaths[i]
            const name = Math.random() * 1000000
            const cloudPath = name + filePath.match(/\.[^.]+?$/)[0]
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                let images = that.imagesList.concat(res.fileID)
                that.imagesList = images.length <= 9 ? images : images.slice(0, 9)
              }
            })
          }
        }
      })
    },
    // 限制标题字数
    handleTitleInput (e) {
      this.titleCount = e.target.value.length
    },
    // 限制标题字数
    handleContentInput (e) {
      this.contentCount = e.target.value.length
    },
    // 全屏预览图片
    handleImagePreview (e) {
      console.log(e)
      let idx = e.target.dataset.idx
      let images = this.imagesList
      wx.previewImage({
        current: images[idx], // 当前预览的图片索引
        urls: images // 所有要预览的图片
      })
    },
    // 移除不想要的图
    removeImage (e) {
      const that = this
      const idx = e.target.dataset.idx // 当前需要移除的图片索引
      wx.showModal({
        title: '提示',
        content: '您确定删除这张照片吗？',
        success (res) {
          if (res.confirm) {
            that.imagesList.splice(idx, 1)
            toast('删除成功')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    },
    // 发布文章
    onGotUserInfo (e) {
      if (this.title === '') {
        toast('请输入文章标题', 'none')
        return false
      }
      if (this.content === '') {
        toast('请输入文章内容', 'none')
        return false
      }
      if (this.imagesList.length === 0) {
        toast('您还没上传图片', 'none')
        return false
      }
      this.userInfo = e.target.userInfo
      this.getOpenId()
    },
    // 往数据库里写数据
    sendMessage () {
      const that = this
      const db = wx.cloud.database()
      const diary = db.collection('diary')
      diary.add({
        data: {
          title: that.title,
          content: that.content,
          imagesList: that.imagesList,
          avatarUrl: that.userInfo.avatarUrl,
          nickname: that.userInfo.nickName,
          preview: 0,
          fabulous: 0,
          creatTime: getNowFormatDate()
        }
      }).then(res => {
        toast('发布成功')
        that.title = that.content = ''
        that.titleCount = that.contentCount = 0
        that.imagesList = []
      })
    },
    // 获取openid
    getOpenId () {
      const that = this
      wx.cloud.callFunction({
        name: 'user',
        data: {}
      }).then(res => {
        that.openId = res.result.OPENID
        that.sendMessage()
      })
    }
  },

  created () {

  }
}
</script>

<style lang="less" scoped>
.write-container {
  padding: 20px;
}
.title {
  font-size: 16px;
  position: relative;
  .w-tt, .content {
    font-size: 14px;
    padding: 10px;
    margin: 6px 0;
  }
  .w-tt {
    border-bottom: 1px solid #dfdfdf;
  }
  .content {
    width: 100%;
    box-sizing: border-box;
  }
  .title-counter {
    position: absolute;
    top: 40px;
    right: 0;
    color: #dfdfdf;
  }
  .textarea-counter {
    position: absolute;
    bottom: 0;
    right: 0;
    color: #dfdfdf;
  }
}
.add-img {
  margin: 10px auto;
}
.images-wrap {
  overflow: hidden;
  .s-image-wrap {
    float: left;
    width: 30%;
    margin: 0 1.5% 10px;
    .image {
      display: block;
      width: 100%;
      height: 100px;
    }
    .image-remover {
      margin-top: 5px;
    }
  }
}
.submit-form {
  margin-top: 20px;
}
</style>
