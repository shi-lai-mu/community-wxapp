var drawQrcode = require('../../public/rqcode/index.js');
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: ''
  },

  onLoad: function () {

    // drawQrcode({
    //   canvasId: 'userInfo',
    //   text: /*app.globalData.info ? String(app.globalData.info._id) :*/ 'false',
    //   // icon: {
    //   //   width: 100,
    //   //   height: 100
    //   // }
    // });
    let self = this;

    app.sendMessage.apply(this, [{
      content: '用程序内的扫码才有效!',
      icon: 'saoma',
      hideTime: 5000
    }]);

    drawQrcode.qrcode('qrcode', app.globalData.info._id, 250, 250,false,{
      icon: {
        width: 50,
        height: 30
      }
    });
    
    drawQrcode.barcode('barcode', app.globalData.info._id, 250, 50);

    // setTimeout(() => {
    //   wx.canvasToTempFilePath({
    //     canvasId: 'userInfo',
    //     success: function (res) {
    //       var tempFilePath = res.tempFilePath;
    //       console.log(res)
    //       self.setData({
    //         img: res.tempFilePath
    //       })
    //     },
    //     fail: err => {
    //       console.log(err)
    //     }
    //   });
    // }, 1000);
  },

  /**
   * 翻页触发的函数
   */
  movePage: function(e) {
    console.log(e.detail.current)
  }
})