// 劫持部分的顶级方法和劫持所有的事件
// var interceptConfig=require('./cor_intercept_install')
var intercept = {
  App: App,
  Page: Page,
  Component: Component,
  init(componentFns, pageFns) {
    // componentFns 是传入Component需要劫持的函数列表 如{name:created,fn:function}
    // pageFns 是传入    Page需要劫持的函数列表 如 name:created,fn:function}
    Component = function() {
      // 重写了 Component 顶级函数
      if (!componentFns) return intercept.Component(...arguments);
      componentFns.forEach((item, index) => {
        if (item&&item.name&&arguments[0] && arguments[0][item.name]) {
          //需要劫持的名称
          var fn = arguments[0][item.name];
          arguments[0][item.name] = function() {
            item.fn.call(this, ...arguments);
            fn.call(this, ...arguments);
          };
        }
      });
      return intercept.Component(...arguments);
    };
    Page = function() {
      //  重写了 Page 顶级函数
      var arg = arguments;
      if (pageFns) {
        pageFns.forEach((item, index) => {
          if (arg[0] && arg[0][item.name]) {
            var fn = arg[0][item.name];
            arg[0][item.name] = function() {
              item.fn.call(this, ...arguments);
              fn.call(this, ...arguments);
            };
          }
        });
      }
      if (arg[0] && arg[0].onLoad) {
        // 对onLoad 事件进行专门的定制 即=> 劫持所有的函数
        var fn = arg[0].onLoad;
        arg[0] = intercept.interceptPageFn(arg[0]);
        arg[0].onLoad = function() {
          fn.call(this, ...arguments);
        };
      }
      return intercept.Page(...arg);
    };
    //
    //     App = () => {
    //       if (arguments[0].onShow) {
    //         var oldOnShow = arguments[0].onShow;
    //         arguments[0].onShow = function() {
    //           console.log(
    //             'onShow---------------------------------------------------------------------------',
    //             this
    //           );
    //           oldOnShow(arguments);
    //         };
    //       }
    //       return this.App(...arguments);
    //     };
  },
  interceptPageFn(pageO) {
    for (var i in pageO) {
      if (typeof pageO[i] == 'function') {
        // 劫持了所有的函数
        let oldFn = pageO[i];
        let fnName = i;
        pageO[i] = function() {
          if (arguments[0] && arguments[0].type) {
            // console.log(arguments[0].type,fnName,'劫持函数');
          }
          return oldFn.call(this, ...arguments);
        };
      }
    }
    return pageO;
  }
};
// intercept.init(interceptConfig.componentFns,interceptConfig.pageFns);
module.exports = {
  intercept: intercept
};
