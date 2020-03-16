var fs=require('fs')
var path=require("path")
// var loopGetRedCircleUrl=path.resolve(__dirname,'../../../utils/service/cor_user.js')
// var loopGetRedCircleText=fs.readFileSync(loopGetRedCircleUrl);//
module.exports={
    async changeLoopGetRedCircle(type){
        // 上传的时候打开轮询获取小红点
        console.log('changeLoopGetRedCircle')
        var r=loopGetRedCircleText.toString()
        if(type)r=r.replace(/\/\/return;\/\/上传的时候解开/g,'return;//上传的时候解开');//注释获取小红点
        if(!type)r=r.replace(/return;\/\/上传的时候解开/g,'//return;//上传的时候解开');//获取小红点
        fs.writeFileSync(loopGetRedCircleUrl,r)
        // await this.await(10)
    },
    changeBaseUrl(){
        // 修改请求地址
        console.log('changeBaseUrl')
        var baseUrl=path.resolve(__dirname,'../../../config/baseConfig.js')
        var r=fs.readFileSync(baseUrl)
        var rr=r.toString().replace(/mode\:\".+?\"/g,'mode:"online"').replace(/mock:true/g,'mock:false')
        fs.writeFileSync(baseUrl,rr);
    },
    setMode(mode){
        // 设置请求类型
        if(!mode) throw "请设置请求的类型"
        var baseUrl=path.resolve(__dirname,'../config/baseConfig.js')
        var r=fs.readFileSync(baseUrl)
        var rr=r.toString().replace(/mode\:\".+?\"/g,`mode:"${mode}"`)
        fs.writeFileSync(baseUrl,rr);
    },
    await(time){
        if(time)time=time*1000
        return new Promise((resolve,rejct)=>{
            setTimeout(()=>{
                resolve(true)
            },time||1000)
        })
    }
}