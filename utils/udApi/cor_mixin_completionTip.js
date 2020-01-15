// 劫持onshow
function kidnap(vm){
    vm.getCompleteTip=function(){
        console.log('getCompleteTip')
        clearTimeout(this.getCompleteTimer)
        var app = getApp()
        // 用户未登录
        if (!app.globalData.userData) {
            console.log('用户未登录')
            return ;
        }
        // 获取最新消息的方法
        if(this.selectComponent("#corCompletionTip")){
            console.log('请求任务完成情况')
            this.selectComponent("#corCompletionTip").getCompleteTip();
        }
    }

    // 190614 丘骏_jun
    vm.getCompleteTipDelay = function(delay){
        if (this.getCompleteTip) {
            // console.log('getCompleteTipDelay')
            this.getCompleteTimer = setTimeout(()=>{
                this.getCompleteTip()
            }, delay || 0)
        }
    }

    // console.log('未开放福利中心 - 任务请求')
    // return;
    if(vm.onShow){
        // 如果存在onshow，则劫持
        var onShow=vm.onShow
        vm.onShow=function(){
            vm.getCompleteTip.call(this)
            onShow.call(this,...arguments);
        }
    }else{
        // 如果没有存在onshow，则对onshow进行赋值，调用任务完成提醒
        vm.onShow=function(){
            vm.getCompleteTip.call(this)
        }
    }
    
}
module.exports={
    kidnap
}