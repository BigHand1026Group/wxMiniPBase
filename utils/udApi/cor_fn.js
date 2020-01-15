var fn={
    objHasProperty(obj,objProperty,index){
        // 判断对象的深层属性是否存在
        // obj 传入的对象
        // objProperty 传入的对象属性，深属性使用点号隔开obj.obj1.obj2.name 判断对象的属性是否存在,如果需要判断数组内的内容可使用下标 obj.arr.1.type //这里的1表示数组内的下标为1的元素 
        var propertys=objProperty.split('.');//获取对象的属性列表
        var propertysLength=propertys.length;//获取属性的长度
        if(!index)index=1;
        if(index==propertysLength){
            //如果长度吻合则返回true
            return {result:true,value:obj}
        }
        if(obj&&obj.hasOwnProperty(propertys[index])){
            // 如果有值，则继续遍历子属性
            return this.objHasProperty(obj[propertys[index]],objProperty,index+1)
        }else{
            return {result:false}
        }
    },
    roundFN(num,index){
        // 四舍五入
        // num 传入的数字
        // index 保留的位数
        if(!index)index=0
        index+=1;
        var str='0000000000000000000000000000000000';
        var roundNum=parseInt('1'+str.substring(0,index-1))
        return Math.round(num * roundNum) / roundNum
    },
    dividNumberFN(num){
        // 使用分号分隔数字
        var smallNum='';
        if(num.toString().indexOf('.')>-1){
            smallNum="."+num.toString().replace(/.*\./g,'');//获取.后面的数字
        }
        num=num.toString().replace(/\..*/g,'');//获取.前面的数字
        num=parseFloat(num).toLocaleString()+smallNum;
        return num
    },
    deepCopyFN(obj){
        // 深拷贝\
        // return JSON.parse(JSON.stringify(obj))
        if(typeof obj!=='object'){return obj;}
        let cloneObj = {};
        switch(obj.constructor){
            case Array:
            cloneObj = [];
            case Object:
            for(var property in obj){
                cloneObj[property] = typeof obj[property] === 'object'?this.deepCopyFN(obj[property]):obj[property];
            }
            break;
            case Map:
            cloneObj = new Map();
            obj.forEach((value,key)=>{
                cloneObj.set(key,typeof value==='object'?this.deepCopyFN(value):value);
            });
            break;
            case Set:
            cloneObj = new Set();
            obj.forEach(value=>{
                cloneObj.add(typeof value==='object'?this.deepCopyFN(value):value);
            });
            break;
        }
        return cloneObj;
    },
    trim(str){
        // 去除前后空格
        return str.replace(/(^\s*)|(\s*$)/g, "")
    },
    isNoEmpty(str){
        // 判断是否为空字符串
        // true 不空
        // false 空
        if(!str){
            return false
        }else{
            return /\S/.test(str)
        }
    },
    isPhone(phoneNumber){
        // 是否是手机号码
        return /^[1][3,4,5,6,7,8][0-9]{9}$/.test(phoneNumber)
    },
    isMail(mail){
        // 是否是邮箱
        return /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(mail)
    },
    getStrlen(str){
        // 获取字符串长度
        var len = 0;
        for (var i=0; i<str.length; i++) { 
         var c = str.charCodeAt(i); 
        //单字节加1 
         if ((c >= 0x0001 && c <= 0x007e) || (0xff60<=c && c<=0xff9f)) { 
           len++; 
         } 
         else { 
          len+=2; 
         } 
        } 
        return len;
      },
      subString(str, len){
        // 截取字符串
        var regexp = /[^\x00-\xff]/g;// 正在表达式匹配中文
        // 当字符串字节长度小于指定的字节长度时
        if (str.replace(regexp, "aa").length <= len) {
          return str;
        }
        // 假设指定长度内都是中文
        var m = Math.floor(len/2);
        for (var i = m, j = str.length; i < j; i++) {
          // 当截取字符串字节长度满足指定的字节长度
          if (str.substring(0, i).replace(regexp, "aa").length >= len) {
            return str.substring(0, i);
          }
        }
        return str;
    },
    subStrLen(o){
        // 根据传入的长度和专属后缀
        // o.str 传入的字符串
        // o.len
        // o.tipTxt 在截取的文字后边添加的后缀
        if(this.getStrlen(o.str)>o.len){
           return this.subString(o.str,o.len)+(o.tipTxt||'...');
        }else{
            return o.str
        }
    },
    isNumberOr0(num){
    // 转为整数 num
        var re = /^[0-9]+.?[0-9]*$/; 
        if(!re.test(num)){
            return 0
        }else{
            return num;
        }
    },
    numEnding(num,endStr){
        // 转千 或万 结尾（以千、万作为单位）
        var nums={
            "千":1000,
            "万":10000,
        }
        return num/nums[endStr]+endStr
    },
    arrIndexChange(array,index1,index2){
        let temp = array[index1];
        array[index1] = array[index2];
        array[index2] = temp;
        return array
    },
    lawfulM(value){
        // 合法的金钱
        value=value.toString().match(/[\d\.]+?/g)
        if(!value)return "0.00";
        var value=value.join("")
        return this.roundFN(parseFloat(value),2).toFixed(2)
    },
    rTime(d){
        // 兼容ios的时间
        if(d&&typeof(d)=="string"&&d.indexOf("-")>-1){
            d=d.replace(/-/g,'/')
        }
        return d
    },
    getDate(d){
        if(d&&typeof(d)=="string"&&d.indexOf("-")>-1){
            d=d.replace(/-/g,'/')
        }
        var date = new Date();
        if(d)date = new Date(d);
        var dateInfo={
            year:date.getFullYear(),
            month:date.getMonth()+1,
            day:date.getDate(),
            hour:date.getHours(),
            minute:date.getMinutes(),
            second:date.getSeconds(),
        }
        if(dateInfo.month<10)dateInfo.month="0"+dateInfo.month
        if(dateInfo.day<10)dateInfo.day="0"+dateInfo.day
        if(dateInfo.hour<10)dateInfo.hour="0"+dateInfo.hour
        if(dateInfo.minute<10)dateInfo.minute="0"+dateInfo.minute
        return dateInfo
    },
    fuseList(arr,arr2){
        // 融合数组 并且返回融合的数量，传入的数组以id为对比键
        if(arr.length<arr2.length){
            var temp=arr2;
            arr2=arr;
            arr=temp
        }
        var ids={};
        var fuse=0
        arr2.forEach((item,index)=>{
            ids[item.id]=item
        })
        arr.forEach((item,index)=>{
            if(ids[item.id]){
                fuse++;
                item=ids[item.id]
            }
        })
        return {list:arr,fuse:fuse}
    },
    guid() {
        // 获取uuid
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
              var r = Math.random() * 16 | 0,
                  v = c == 'x' ? r : (r & 0x3 | 0x8);
              return v.toString(16);
          });
    },
    awaitTime(time){
        // 延迟时间
        return new Promise((resolve,rejct)=>{
            setTimeout(()=>{
                resolve(true)
            },time||1000)
        })
    }

}
module.exports={
    fn:fn
}