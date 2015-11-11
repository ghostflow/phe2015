/**
 * Created by allen on 15/8/19.
 */

// 隐藏头部
function hideNav(){
  $('.top-nav').hide();
}

//新消息
function new_order(){
  var num = $('.new-record-number');
  num.text(parseInt(num.text()) + 1);
  $('.new-record').show();
}

//index 外卖 新消息
function index_takeout_new_order(){
  var num = $('.new-takeout');
  num.text(parseInt(num.text())+1).show();
}
