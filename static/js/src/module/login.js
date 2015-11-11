/**
 * Created by allen on 15/7/2.
 */
define(function(require,exports){
  var util = require('../common/util'),
      config = require('../common/config');
  $('form').on('submit',function(e){
    e.preventDefault();
    var _data = $(this).serialize();
    util.postAjax(config.host+'/qmm/shop/v1/signin',_data,function(data){
      if(data.respcd !== '0000'){
        $('.error').text(data.resperr).slideDown();
      }else {
        util.Cookie.set('sessionid',data.data.sessionid,180);
        util.Cookie.set('qf_uid',data.data.userid,180);
        localStorage.setItem('shop-name',data.data.shop_info.shopname);
        location.href = 'redeem.html';
      }
    },function(){
      $('.error').text('网络错误，请稍后重试').slideDown();
    })
  })
})