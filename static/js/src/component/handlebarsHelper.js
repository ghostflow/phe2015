/**
 * Created by allen on 15/6/24.
 */
define(function(require,exports){
  var util = require('../common/util');
  Handlebars.registerHelper("compare",function(v1,v2,options){
    if(v1 == v2){
      //满足添加继续执行
      return options.fn(this);
    }else{
      //不满足条件执行{{else}}部分
      return options.inverse(this);
    }
  });
  Handlebars.registerHelper("exist",function(v1,v2,options){
    if(!(v1 === v2)){
      //满足添加继续执行
      return options.fn(this);
    }else{
      //不满足条件执行{{else}}部分
      return options.inverse(this);
    }
  });
  return Handlebars;
})