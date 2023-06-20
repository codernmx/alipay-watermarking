
const ctx = my.createCanvasContext('myCanvas')
Page({
  data: {
    imageHeight: 0,
    imageWidth: 0,
    systemInfo: my.getSystemInfoSync(),
    phptoFlag: '0', // 1拍照
    address: ''
  },
  onLoad(query) {
    my.getLocation({
      type: 3, // 获取经纬度和省市区县数据
      success: (res) => {
        console.log(res);
        this.setData({
          address: res.city + '·' + res.district + '·' + res.pois[0].name
        })
      },
      fail: (res) => {
        my.alert({ title: '定位失败', content: JSON.stringify(res) });
      },
      complete: () => { },
    });
  },
  //返回拍照
  back() {
    this.setData({ phptoFlag: '0' })
  },
  takePhoto() {
    const cameraContext = my.createCameraContext('camera');
    cameraContext.takePhoto({
      quality: 'high',
      success: res => {
        // .tempImagePath
        this.drawImage(res.tempImagePath)
      },
      fail(err) {
        console.log(err);
      },
    });
  },
  chooseImg() {
    my.chooseImage({
      count: 1,
      sizeType: '["original","compressed"]',
      sourceType: '["camera","album"]',
      storeToAlbum: false,
      success: res => {
        console.log(res);
        my.getImageInfo({
          src: res.tempFilePaths[0],
          success: info => {
            console.log(info);
            const { width, height } = info
            this.setData({ imageHeight: height, imageWidth: width })

            this.drawImage(res.tempFilePaths[0])
          },
        })

      }
    });
  },
  onCameraReady(e) {
    console.log('相机初始化完成');
    this.cameraContext = my.createCameraContext('camera');
    this.cameraContext.takePhoto({
      success(res) {
        console.log(res);
      }
    })
  },
  onCameraError(e) {
    console.log('相机发生异常');
  },
  onCameraStop(e) {
    console.log('相机终止');
  },
  drawImage: function (imagePath) {
    const _this = this
    my.getImageInfo({
      src: imagePath,
      success: info => {
        const width = this.data.systemInfo.screenWidth
        const height = this.data.systemInfo.screenHeight - 50
        this.setData({ imageHeight: height, imageWidth: width, phptoFlag: '1' })
        ctx.drawImage(imagePath, 0, 0, width, height)
        ctx.setFontSize(20)
        ctx.setFillStyle('rgba(255, 255, 255)')
        ctx.fillText(new Date().toLocaleString().replace(/\//g, '-'), 20, height - 150 - 30)
        ctx.fillText(_this.data.address, 20, height - 150)
        ctx.draw(false, function () {
          console.log('添加水印成功~', width, height, '图片宽高~');
        })
      },
    })
  },
  saveImage: function () {
    const _this = this
    my.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: _this.data.imageWidth,
      height: _this.data.imageHeight,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log(res, 'save-res');
        my.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function () {
            my.showToast({
              content: '保存成功',
              icon: 'none',
              duration: 2000
            })
          },
          fail: function () {
            my.showToast({
              content: '保存失败，请查看右上角是否开启权限~',
              icon: 'none',
              duration: 2000
            })
          }
        })
      },
      fail: err => {
        console.log(err, 'err');
      }
    })
  },

  onReady() {
    // 页面加载完成
  },
  onShow() {
    // 页面显示
  },
  onHide() {
    // 页面隐藏
  },
  onUnload() {
    // 页面被关闭
  },
  onTitleClick() {
    // 标题被点击
  },
  onPullDownRefresh() {
    // 页面被下拉
  },
  onReachBottom() {
    // 页面被拉到底部
  },
  onShareAppMessage() {
    // 返回自定义分享信息
    return {
      title: 'My App',
      desc: 'My App description',
      path: 'pages/index/index',
    };
  },
});
