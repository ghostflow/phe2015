/**
 * Created by EiT on 2015/7/29.
 */
define(function (require, exports) {
  var util = require('../common/util'),
      config = require('../common/config'),
      Handlebars = require('../component/handlebarsHelper'),
      consumingRouter = require('../routes/consuming'),
      consumingModel = require('../model/consuming');
  var poll = require('../component/longPoll');

  var bottom_id = 0,
      firstRequest = true,
      loading = false,
      last_payed_order_id = 0,
      start = 1;
  var consuming = Backbone.View.extend({
    el: 'body',
    events: {
      'swipeLeft': 'swipeHandler',
      'swipeRight': 'swipeHandler',
      'tap .new-record': 'refreshHandler'
    },
    initialize: function () {
      _this = this;
      $(window).scroll(function () {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight == scrollHeight) {
          if (!loading){
            loading = true;
            if(consumingModel.get('status') == 0){
              _this.getAjax();
            }else if(consumingModel.get('status') == 1){
              _this.getQrAjax();
            }
          }
        }
      });
      this.listenTo(consumingModel,'change',this.tabHandler);
      if(location.hash == ''){
        consumingModel.set('status',0);
      };
    },
    getAjax: function() {
      _this = this;
      $.ajax({
        url: config.host + '/qmm/wd/app/near/order_list',
        data: 'bottom_id=' + bottom_id + '&limit=20',
        type: 'get',
        dataType: 'json',
        success: function (data) {
          if (data.respcd == '0000') {
            $('.discount').text(data.data.discount);
            if (data.data.data_detail != '') {
              var consumingTemplate = Handlebars.compile($("#consuming-template").html());
              $('#consuming .content').append(consumingTemplate(data.data));
              firstRequest = false;
              bottom_id = $('.order-id').last().data('id');
              last_payed_order_id = $('.order-id').first().data('id');
            } else if (firstRequest) {
              $('#consuming .content').append($('<div class="no-record">暂时没有记录哦~</div>'))
            } else {
              _this.toast('没有更多了...')
            }
          } else if (data.respcd == '2002') {
            location.href = 'near-merchant://login'
          } else {
            _this.toast(data.resperr);
          }
        },
        complete: function(){
          try{
            xhr;
          }
          catch(e){
            poll.update(5,last_payed_order_id);
          }
          loading = false;
        }
      })
    },
    getQrAjax : function (){
      _this = this;
      $.ajax({
        url: 'https://openapi2.qfpay.com/trade/v1/tradelist?busicd=800207&format=jsonp',
        data: {
          len : 20,
          start : start
        },
        type: 'get',
        dataType: 'jsonp',
        success: function(data){
          if (data.respcd == '0000') {
            if(data.data.tradelist.body != ''){
              // 将数组转换为json格式
              var _data = data.data.tradelist,
                  _head = _data.head,
                  _body = _data.body;
                  _data.jsonData = [];
              for (var i = 0;i < _body.length;i++){
                var _tmp = {};
                for (var j = 0;j < _head.length;j++){
                  _tmp[_head[j]] = _body[i][j];
                }
                _data.jsonData.push(_tmp);
                delete _tmp;
              }

              var qrPayTemplate = Handlebars.compile($("#qr-pay-template").html());
              $('#qr-pay .content').append(qrPayTemplate(data.data));
              start += 20;
              firstRequest = false;
            }else if (firstRequest){
              $('#qr-pay .content').append($('<div class="no-record">暂时没有记录哦~</div>'))
            } else {
              _this.toast('没有更多了...');
            }
          } else if (data.respcd == '2002') {
            location.href = 'near-merchant://login'
          } else {
            _this.toast(data.resperr);
          }
        },
        complete: function(){
          loading = false;
        }
      })
    },
    paint : function(){
      var x = consumingModel.get('status') > consumingModel.previous('status')
      if(x){
        if(consumingModel.get('status') != 0){
          bottom_id = 0;
          try{
            xhr;
            if(consumingModel.get('status') > 0){
              xhr.abort();
              delete xhr;
            }
          }catch(e){}
          setTimeout(function(){
            $('#qr-pay').addClass('showing').show();
            $('#wrap-content').addClass('trans trans-left');
            $('.slider-bar').addClass('slider-bar-trans');
            $('header a').removeClass('active')
              .eq(consumingModel.get('status')).addClass('active');
          },0);
          setTimeout(function(){
            $('#wrap-content').removeClass('trans trans-left');
            $('#qr-pay').removeClass('showing');
            $('#consuming').hide().find('.content').empty();
          },500)
        }
      }else {
        start = 1;
        delete window.date;
        setTimeout(function(){
          $('#consuming').addClass('showing').show();
          $('#wrap-content').addClass('trans trans-right')
          $('.slider-bar').removeClass('slider-bar-trans');
          $('header a').removeClass('active')
            .eq(consumingModel.get('status')).addClass('active');
        },0)
        setTimeout(function(){
          $('#wrap-content').removeClass('trans trans-right');
          $('#consuming').removeClass('showing');
          $('#qr-pay').hide().removeClass('showing').find('.content').empty();
        },500)
      }
      firstRequest = true;
      loading = true;
    },
    tabHandler: function(){
      this.paint();
      if(consumingModel.get('status') == 0){
        this.getAjax();
      }else if (consumingModel.get('status') == 1){
        this.getQrAjax();
      }
    },
    toast: function (msg) {
      $('<div class="toast">'+msg+'</div>').appendTo($('body'));
      setTimeout(function () {
        $('.toast').remove();
      }, 2000)
    },
    'refreshHandler': function () {
      window.location.reload();
    },
    swipeHandler: function(e){
      if(e.type == 'swipeLeft'){
        location.hash = '#qrPay';
      }else if(e.type == 'swipeRight'){
        location.hash = '#discount';
      }
    }
  })
  return new consuming();
})