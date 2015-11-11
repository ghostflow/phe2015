/**
 * Created by allen on 15/9/25.
 */
define(function(require,exports) {
  var util = require('../common/util'),
      config = require('../common/config');

  var poll = {
    errorSleepTime : 500,
    date : util.formatDate(new Date(),'yyyy-MM-dd'),
    update : function(type,id){
      this.type = type;
      this.order_id = id;
      xhr = $.ajax({
        url: config.host + '/instant/push_order',
        type: 'get',
        dataType: 'json',
        timeout: '60000',
        data: {
          "order_id" : this.order_id
        },
        success: this.successHandler,
        error: this.errorHandler
      });
      return xhr;
    },
    successHandler : function(data){
      if(data.respcd == '0000'){
        poll.order_id = data.data[data.data.length - 1].near_order_id;
        for (var i=0;i<data.data.length;i++){
          if (data.data[i].order_type !== poll.type){
            delete data.data[i];
          }
        }
        if (data.data != ""){
          var newOrderTemplate = Handlebars.compile($("#new-order-template").html());
          if($('.list').length == 0){
            if(poll.type == 6){
              $("#wrap-content").empty()
                  .append($("<ul class=\"parent-list current\"><li><p>" + poll.date + "<em>待接单<span class=\"count\">0</span>单, 共<span class=\"total-price\">0</span>元</em></p><ul class=\"list\"></ul></li></ul>"))
            }else if (poll.type == 5){
              $("#wrap").empty()
                  .append($("<ul><li><p>"+ poll.date+"<em>成交<span class=\"count\">0</span>单, 共<span class=\"total-price\">0</span>元</em></p><ul class=\"list\"></ul></li></ul>"))
            }
          }
          var list =  $('.list').eq(0),
              count = list.parent().find('.count'),
              count_text = count.text(),
              total_price = list.parent().find('.total-price'),
              total_price_text = Number(total_price.text()),
              bottom_count = $(".new-order").find('em'),
              bottom_count_text = Number(bottom_count.text());
          for(var i = 0;i < data.data.length;i++){
            count_text ++;
            total_price_text += Number(data.data[i].real_price);
            // 外卖 开始倒计时
            if(poll.type == 6) {
              bottom_count_text ++;
              Backbone.trigger('countDown', data.data[i]);
            }
          }
          count.text(count_text);
          total_price.text(total_price_text.toFixed(2));
          bottom_count.text(bottom_count_text);
          list.prepend(newOrderTemplate(data.data)).ready(function(){
            // 买单 新订单slideIn
            if(poll.type == 5){
              setTimeout(function(){
                $('.new-order').addClass('trans-left')
                    .parent().addClass('trans-ul');
              },0);
              setTimeout(function(){
                $('.new-order').removeClass('trans trans-left')
                    .parent().removeClass('trans-ul');
              },500);
              setTimeout(function(){
                $('.new-order').removeClass('new-order')
              },10000)
            }
          });
        }
        poll.errorSleepTime = 500;
        poll.update(poll.type,poll.order_id);
      }

    },
    errorHandler : function(xhr,settings, error){
      // 外卖中如果切换到其他tab，则停止请求。
      if(settings == 'abort'){
        return;
      }
      poll.errorSleepTime *= 2;
      window.setTimeout(function(){
        poll.update(poll.type,poll.order_id);
      },poll.errorSleepTime)
    }
  };
  return poll;
});