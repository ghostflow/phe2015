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

  //注册一个表示状态的Helper，0为确认订单，1为完成送达，2为按时送达(超时)
  Handlebars.registerHelper("transformat",function(value){
    if(value==0){
      return "确认订单";
    }else if(value==1){
      return "完成送达";
    }else {
      return "按时送达"
    }
  });
  // 订单列表中过滤date信息
  Handlebars.registerHelper('dateValidater',function(newDate,options){
    if(window.date != newDate){
      window.date = newDate;
      return options.fn(this);
    }
  });
  // 最新订单是否为今天
  Handlebars.registerHelper('isToday',function(date,options){
    if(util.formatDate(new Date(),'yyyy-MM-dd') == date){
      return options.fn(this);
    }
  });
  Handlebars.registerHelper('todayStat',function(options){
    var stat = options.data.root.todaystat['000000'];
    return stat.txamtsum/100 + ' (' + stat.txcnt + '笔)'
  });
  Handlebars.registerHelper('amtFormat',function(amt){
    return amt/100;
  });
  Handlebars.registerHelper('dateFormat',function(date,options){
    return util.formatDate(date,'hh:mm:ss');
  });
  return Handlebars;
})