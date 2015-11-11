/**
 * Created by EiT on 2015/7/29.
 */
define(function (require, exports) {
  var util = require('../common/util'),
      config = require('../common/config');
  var index = Backbone.View.extend({
    el: 'body',
    events: {
      'click #copy': 'copyHandler'
    },
    initialize: function () {
      $.ajax({
        url: config.host + '/qmm/wd/app/near/mechant_detail',
        type: 'get',
        dataType: 'json',
        success: function (data) {
          if (data.respcd === '0000') {
            $('#title').text(data.data.name);
            if (data.data.has_nearpay == '0') {
              $('.consuming-link').attr('href', 'create-card.html')
            } else {
              $('.consuming-link').attr('href', 'consuming.html')
            }
          } else if (data.respcd == '2002') {
            location.href = 'near-merchant://login'
          }
        },
        error: function () {
          alert('服务器异常，请重试')
        },
        complete: function(){
          console.log(document.cookie)
        }
      });
      $.ajax({
        url: config.host+'/qmm/wd/app/near/takeout_list',
        data:{
          "bottom_id":0,
          "limit": "0",
          "status": 0
        },
        type: 'get',
        dataType: 'json',
        success:function(data){
          if(data.respcd == '0000' && data.data.total_payed_count != 0){
            $('.new-takeout').text(data.data.total_payed_count).show();
          }
        }
      })
    }
  })
  return new index();
})