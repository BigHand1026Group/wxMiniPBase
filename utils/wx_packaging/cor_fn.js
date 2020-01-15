function nUllChinPhone(){
    var sys = wx.getSystemInfoSync();
      var model = sys.model.toLowerCase();
  
      // 判断当前是否iphoneX
      var is_iphonex = /iphone\D*x/i.test(model);
      is_iphonex = is_iphonex || /iphone\D*xs|iphone11\,2/i.test(model);
      is_iphonex = is_iphonex || /iphone\D*xr|iphone11\,8/i.test(model);
      is_iphonex = is_iphonex || /iphone\D*xs\D*max|iphone11\,(4|6)/i.test(model);
      return is_iphonex
  }
function loading(text){
  wx.showLoading({
    title: text||'加载中',
    mask:true
  })
}
function upload(o,index,uploadImgs){
  //上传图片到osss
  // ↓↓↓↓↓↓↓↓↓↓用法如下
  // wxfn.upload({
  //   filePath:this.data.selectImages,// 由 wx.chooseImage 选择的图片路径 是一个数组
  //   url:o.inf.host,//仅仅需要域名地址，不需要dir 从接口返回的数据
  //   formData:{
  //     dir:o.inf.dir, //从接口返回的数据
  //     policy:o.inf.policy, //从接口返回的数据
  //     signature:o.inf.signature,//从接口返回的数据
  //     expire:o.inf.expire,//从接口返回的数据
  //     OSSAccessKeyId:o.inf.accessId,//从接口返回的数据
  //   },
  //   finish:(data)=>{
  //     resolve(data) //所有的文件上传成功回调函数 返回一个字符串数组
  //   },
  //   fail:(o)=>{
  //     reject(o) //上传失败
  //   }
  // })
  // ↑↑↑↑↑↑↑↑↑↑用法如上
    if(!(o.filePath instanceof Array)){
      o.finish(o.filePath)
      return;
    }
    if(o.filePath.length==0)return [];
    if(!index)index=0;//没有index
    if(!uploadImgs)uploadImgs=[]
    var filePath=o.filePath[index]
    if(!filePath){
      // 不存在路径时则说明上传完毕
      o.finish(uploadImgs)
      return;
    }
    var suffix=filePath.split('.')
    // o.formData.key=o.formData.dir+'/'+guid()+"."+suffix[suffix.length-1];
    if(filePath.match(/^http[s]?\:\/\/tmp/g)||filePath.match(/^wxfile\:\/\/tmp/g)){
      wx.uploadFile({
        url: o.url,
        filePath:filePath,
        name: 'imgFile',
        // formData: o.formData,
        success:(res)=>{
          const data = res.data
          // uploadImgs.push(o.url+'/'+o.formData.key)
          uploadImgs.push(JSON.parse(res.data).inf.imgUrl)
          upload(o,index+1,uploadImgs)
        },
        fail:(res)=>{
         if(o.fail)o.fail(o)
         upload(o,index+1,uploadImgs)
        }
      })
    }else{
      uploadImgs.push(filePath)
      upload(o,index+1,uploadImgs)
    }


}
function guid() {
  // 获取uuid
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0,
            v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
function compressImage(o, index, images){
  // 调用wx的压缩方法 递归压缩图片
  // 用法
    // this.compressImage({
    //   filePaths: e.detail.images,//选择
    //   quality: 0,
    //   finish: (images) => {
    //     this.setData({
    //       temp: images
    //     })
    //   }
    // })
  // 用法
    if(o.filePaths.length== 0)return [];
    if (!index) index = 0;//没有index
    if (!images) images = []
    var filePath = o.filePaths[index]
    if (!filePath) {
      // 不存在路径时则说明上传完毕
      o.finish(images)
      return;
    }

    wx.compressImage({
      src: filePath,
      quality: o.quality||80,
      success: (e) => {
        images.push(e.tempFilePath)
        compressImage(o, index + 1, images)
      },
      fail: (res) => {
        if (o.fail) o.fail(o)
        compressImage(o, index + 1, images)
      }
    })
}

function getDOMRect(o){
  // o.DOMName 选择的DOM 名称
  // o.getFields 如果o.getFields 为true 则获取 o.getFields的信息
  var fields=null;
  return new Promise(async (resolve,reject)=>{
    if(o.getFields){
      fields=await getFields(o)
    }
    wx.createSelectorQuery().selectAll(o.DOMName).boundingClientRect((res)=>{
      if(o.getFields&&fields)res.fields=fields
      resolve(res)
    }).exec()
  })
}

function getFields(o){
  // o.DOMName
  // o.properties
  // o.computedStyle
  return new Promise((resolve,reject)=>{
    wx.createSelectorQuery().selectAll(o.DOMName).fields({
      dataset: true,
      size: true,
      scrollOffset: true,
      properties:o.properties||[],
      computedStyle:o.computedStyle||[],
      context: true,
    }, function (res) {
      resolve(res)
    }).exec()
  })
}

function getUserInfo(){
  // 获取用户信息
  return new Promise((resolve,reject)=>{
    wx.getUserInfo({
      success: function(res) {
        resolve(res)
      },
      fail:function(){
        resolve(false)
      }
    })
  })
}

var system=false;
function getSystemInfo(o){
  // 获取系统信息
  if(!system||o){
    system=wx.getSystemInfoSync()
  }
  return system
}

function pay(o){
  // 支付函数
  return new Promise((resolve,reject)=>{
    if(!o.timeStamp||!o.nonceStr||!o.package||!o.paySign){
      // throw "参数不足"
      resolve({status:false,code:'zf4'})
      return;
    }
    wx.requestPayment({
      timeStamp:o.timeStamp.toString(),
      nonceStr:o.nonceStr,
      package:o.package,
      signType: 'MD5',
      paySign:o.paySign.toString(),
      success:(res)=>{
        resolve({status:true})
      },
      fail:(res)=>{ 
        resolve({status:false})
      }
    })
  })
}
function selectCot(id){
  // 选择组件的一个方法,使用方式为 wxFn.selectCot.call(this,'id') 这里需要指向当前的this
  return new Promise((resolve,reject)=>{
    if(this.selectComponent(id)){
      resolve(this.selectComponent(id))
    }else{
      resolve(false)
    }
  })
}

function login(){
  return new Promise((resolve,reject)=>{
    wx.login({
      success (res) {
        resolve(res)
      },
      fail(){
        resolve(false)
      }
    })
  })
}

function getDataSet(e){
  // 获取dataset的数据
  return e.currentTarget.dataset
}

function alert(str){
  // 简单的弹窗
  return new Promise((resolev,reject)=>{
    wx.showToast({
      title:str,
      icon:"none",
      mask:true,
      duration: 2000,
      complete:()=>{
        var time=setTimeout(()=>{
          clearTimeout(time);
          resolev("complete")
        },2000)
      }
    })
  })
}

function isok(r){
  // 判断 是否有异常
  if(r.res.status!=0){
    alert(r.res.errMsg)
    return false;
  }
  return true
}

function dbset(key,v){
  return wx.setStorageSync(key,v)
}
function dbget(key){
  return wx.getStorageSync(key)
}
function push(obj){
  wx.navigateTo(obj)
}
function re(obj){
  wx.redirectTo(obj)
}
function back(obj){
  wx.navigateBack(obj)
}
function tab(obj){
  wx.switchTab(obj)  
}
function reL(obj){
  wx.reLaunch(obj)
}
function getkey(){
  if(dbget('loginInfo')){
    return dbget('loginInfo')
  }else{
    re({url:"/pages/login/login"})
  }
}
function pagingStatus(o,index){
  // 判断分页的状态
  if (o.inf.arr.length == 0 && index == 1){
    // 暂无数据
    return 1//"null";
  }
  if (index != 1&&o.inf.arr.length == 0) {
    // 已经到达页尾判断逻辑是分页不是1且返回的数据为0
    return 2//"noMore";
  }
}
module.exports = {
  nUllChinPhone,
  loading,
  upload,
  compressImage,
  guid,
  getDOMRect,
  getFields,
  getUserInfo,
  getSystemInfo,
  pay,
  login,
  selectCot,
  getDataSet,
  alert,
  isok,
  dbset,
  dbget,
  push,
  back,
  tab,
  re,
  reL,
  getkey,
  pagingStatus,
}