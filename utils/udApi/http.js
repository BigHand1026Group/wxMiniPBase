/*
 * @Author: 陈志陶_cor
 * @Date: 2019-04-17 16:00:13
 * @Last Modified by: 陈志陶_cor
 * @Last Modified time: 2019-12-30 11:06:48
 */

function Http(http_o) {
  //返回值 Object
  //参数说明
  // o.baseUrl 这个参数根据传入的基础路径会初始化http中的所有请求方法
  // ... 待扩展
  var requestArr=[];//请求次数
  return {
    // 这个对象是包含全部所有的请求
    getFN(get_o) {
      //get 方法
      //参数说明
      // get_o.url 指的是请求的路径
      // udData Object：即userDefined Data 用户自定义数据，这是一个扩展字段
      if(http_o.getChangeRequestParameter){
        // get请求之前，修改或增加请求参数
        get_o=http_o.getChangeRequestParameter(get_o)
      }
      
      if(get_o.params){
        // 如果get请求有对象类型的params请求，则将params对象序列化到url中
          let arr = [];
          for(let i in get_o.params){
              if (get_o.params.hasOwnProperty(i)) {
                  arr.push(encodeURIComponent(i) + "=" + encodeURIComponent(get_o.params[i]));
              }
          }
          get_o.url+="?"+arr.join("&");
      }
      return new Promise((resolve, reject) => {
        Request({
          method: 'Get',
          url: get_o.url,
          udData: get_o.udData //预留扩展字段
        }).then(data => {
          resolve(data);
        });
      });
    },
    postFN(post_o) {
      //post 方法
      if(http_o.postChangeRequestParameter){
        // post请求之前，修改或增加请求参数
        post_o=http_o.postChangeRequestParameter(post_o)
      }
      
      return new Promise((resolve, reject) => {
        Request({
          method: 'Post',
          url: post_o.url,
          data:post_o.data,
          udData: post_o.udData, //预留扩展字段
          header:{'Content-type':'application/x-www-form-urlencoded'}
        }).then(data => {
          resolve(data);
        });
      });
    }
  };
  function Request(request_o) {
    //总请求方法,这是一个被独立处理出来的方法，因为这个方法是一个比较特殊的方法，首先这个方法不应被暴露出来，
    // 然后因为根据项目的独特性，最底层的拦截、加密、权限的实现和代码都有所不同，这里应该独立处理，方便以后移植和复用
    //这个方法是所有请求方法的底层方法，具有错误码拦截，权限管理（鉴权）等 拦截的功能
    // 返回值 Object
    //参数说明
    // o.method 请求类型
    // o.url 请求路径
    // o.data 请求参数
    // o.baseUrl 基本路径
    // udData Object：即userDefined Data 用户自定义数据，这是一个扩展字段
    //              fullData 这个字段为真的话，将返回 服务端返回的所有数据，默认返回data
    requestArr.push(request_o);//将请求加入数组
    if(http_o.startRequest){
      http_o.startRequest({http_o:http_o,request_o:request_o});//事件委托,请求之前
    }
    return new Promise((resolve, reject) => {
      if(http_o.beforeDefindFlow&&!request_o.skip){
        //请求之前自定义流程
        // skip 为 true 则不进入流程
        resolve(http_o.beforeDefindFlow({http_o:http_o,Request:Request,request_o:request_o}));
        requestArr.splice(0,1);//被劫持的请求之前，减少一个
        return;
      }
      var requestConfig = {
        //請求對象
        method: request_o.method,// 请求模式
        url: http_o.baseUrl + request_o.url,// 请求链接
        data: request_o.data,// 请求参数
        header:request_o.header?request_o.header:{'content-type': 'application/json'},// 默认值，请求header
        // 成功回调
        success(res) {
          if(http_o.changeData){
            // 如果有数据，则处理数据
            res=http_o.changeData(res)
          }
          if(http_o.httpEventCode&&http_o.httpEventCode['code'+res.status]){
            http_o.httpEventCode['code'+res.status](res);//事件委托,处理错误
          }
          if(http_o.endRequest){
            http_o.endRequest({...http_o,...res});//事件委托,请求之前
          }
          if(http_o.afterDefindFlow){
            //自定义流程
            resolve(http_o.afterDefindFlow({requestConfig:requestConfig,http_o:http_o,res:res,Request:Request,request_o:request_o}));
          }
          // http_o.httpEventCode['code'+res.data.code](res);//事件委托,处理错误
          if (request_o.udData && request_o.udData.fullData === true) {
            // 如果这里的fullData 为真的话,将返回服务器返回的所有数据
            resolve(res);
          }
          resolve(res.data);
        },
        // 失败回调
        fail(err) {
          console.error(err,'.response')
          var code=err.response&&err.response.status;//请求错误码
          if(http_o.httpEventCode&&http_o.httpEventCode['code'+code]){
            http_o.httpEventCode['code'+code](err);//事件委托,处理错误
          }
          reject(err);
        },
        // 完成回调
        complete(){
          //无论成功或者失败都会执行
          requestArr.splice(0,1);
          if(requestArr.length==0){
            // 批量请求全部完成
            if(http_o.startRequest){
              http_o.concurrentRequests();
            }
          }
        }
      };
      if (request_o.method === 'Get') delete requestConfig.data;
      if(request_o.udData&&request_o.udData.noBaseUrl)requestConfig.url=request_o.url;//如果不需要基础路径的话
      wx.request(requestConfig);
    });
  }
}

module.exports = {
  Http: Http
};
