module.exports={
    events: {},//事件中心
    on(eventName,fn){
        // 添加事件
        var id=Math.random()*100000000000000000
        this.events[eventName] = this.events[eventName] || [];
        this.events[eventName].push({fn:fn,id:id});
        return id
    },
    off(eventName,id){
        // 解除事件
        if(!eventName)console.error('缺少事件名称')
        if (this.events[eventName]&&id){
            for (var i = 0; i < this.events[eventName].length; i++) {
                if (this.events[eventName][i]&&this.events[eventName][i].id==id) {
                    this.events[eventName].splice(i, 1);
                    break;
                }
            };
        }
        if(!id)this.events[eventName]=[];
    },
    emit: function (eventName, data) {
        // 触发事件
        this.time=setTimeout(()=>{
            clearTimeout(this.time)
            if (this.events[eventName]) {
                this.events[eventName].forEach(function(item) {
                    item.fn(data);
                });
            }
        },30)
    },
}