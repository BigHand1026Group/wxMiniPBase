// 该文件在上传的时候执行
var fs=require('fs')
var path=require("path")
var fChange=require("./fileChange")
fChange.changeBaseUrl();// 修改为线上的版本和关闭假数据
// fChange.changeLoopGetRedCircle(false);// 解除 获取小红点的注释

