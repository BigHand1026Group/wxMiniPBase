// 复制版本号到粘贴板
var date = new Date();
const { exec } = require('child_process');
var fChange=require("./fileChange")
var version={
    year:date.getFullYear(),
    month:date.getMonth()+1,
    day:date.getDate(),
    hour:date.getHours(),
    minute:date.getMinutes(),
    second:date.getSeconds(),
}
version.month<10?version.month="0"+version.month:''
version.day<10?version.day="0"+version.day:''
exec('clip').stdin.end(`v${version.year.toString().substring(2,4)}.${version.month}.${version.day}.${version.hour}.${version.minute}`);
// fChange.changeLoopGetRedCircle(true);//注释请求的小红点
// fChange.setMode("locality");//设置为本地