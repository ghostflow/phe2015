/**
 * Created by allen on 15/8/6.
 */
define(function(require,exports){
  var util = require('../common/util'),
      config = require('../common/config'),
      Handlebars = require('../component/handlebarsHelper'),
      takeoutRouter = require('../routes/takeout'),
      appModel = require('../model/takeout');
  var poll = require('../component/longPoll');
  var bottom_id = 0,
      last_payed_order_id = 0,
      status = 0,
      firstRequest = true,
      timerList = [],
      loading = false,
      animating = false,
      clickTab = false;
  var takeout = Backbone.View.extend({
    el: 'body',
    events: {
      'click .new-record': 'refreshHandler',
      'click .accept': 'acceptHandler'
    },
    initialize: function(){
      _this = this;
      $(window).scroll(function(){
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();
        if (scrollTop + windowHeight == scrollHeight) {
          if(!loading){
            firstRequest = false;
            loading = true;
            _this.getAjax();
          }
        }
      });
      this.listenTo(appModel,'change',this.tabHandler);
      if(location.hash == ''){
        appModel.set('status',0);
      }
      this.$el.on('click tap',this.preventClick)
      Backbone.on('countDown',this.setCountDown,this)
    },
    render: function(data){
      _this = this;
      if (data.respcd == '0000'){
        var countTemplate = Handlebars.compile($("#count-template").html());
        this.$('footer').html(countTemplate(data.data));
        this.$('nav a').eq(appModel.get('status')).addClass('active');
        if(data.data.data_detail != ''){
          var takeoutTemplate = Handlebars.compile($("#takeout-template").html());
          for (var i in data.data.data_detail){
            switch (appModel.get('status')){
              case 3 :
                data.data.data_detail[i].finished = true;
                break;
              case 2 :
                data.data.data_detail[i].delivery = true;
                break;
              case 1 :
                data.data.data_detail[i].process = true;
                break;
              default :
                data.data.data_detail[i].newOrder = true;
                break;
            }
            for (var m in data.data.data_detail[i].orders){
              var obj = data.data.data_detail[i].orders[m];
              _this.setCountDown(obj);
              _this.setStatus(obj);
            }
          }
          if(clickTab){
            this.paint($(takeoutTemplate(data.data)));
          }else {
            this.$('#wrap-content').html(this.$('#wrap-content').html()+takeoutTemplate(data.data));
            animating = false;
            clickTab = false;
          }
          firstRequest = true;
          bottom_id = this.$('.order-id').last().data('id');
        }else if (firstRequest) {
          this.paint();
        } else {
          animating = false;
          clickTab = false;
          _this.toast('没有更多了...');
        }
        last_payed_order_id = data.data.last_payed_order_id;
      } else if (data.respcd == '2002') {
        location.href = 'near-merchant://login'
      } else {
        _this.toast(data.resperr)
      }

      try{
        xhr;
        if(appModel.get('status') > 0){
          xhr.abort();
          delete xhr;
        }
      }
      catch(e){
        if(appModel.get('status') <= 0) {
          poll.update(6,last_payed_order_id);
        }
      }
    },
    paint : function(el){
      if(arguments.length == 0){
        el = $("<div class='parent-list no-record current'>暂时没有订单哦~</div>");
      }
      _class = appModel.get('status') > appModel.previous('status') ?
        "next" : "previous";
      _arrow = appModel.get('status') > appModel.previous('status') ?
        "left" : "right";
      el.removeClass('current').addClass(_class)
        .appendTo(this.$('#wrap-content'));
      setTimeout(function(){
        $('#wrap-content').addClass('trans trans-'+_arrow);
      },0);
      setTimeout(function(){
        $('#wrap-content').removeClass('trans trans-'+_arrow).find('.'+_class).removeClass(_class).addClass('current')
            .siblings('.current').remove();
        animating = false;
        clickTab = false;
      },500)
    },
    tabHandler : function(e){
      this.clearTimerList(timerList);
      clickTab = true;
      timerList = [];
      firstRequest = true;
      bottom_id = 0;
      if(!loading){
        loading = true;
        this.getAjax();
      }
    },
    acceptHandler: function(e){
      var target = this.$(e.target);
      var order_id = target.data('id');
      this.postAjax(order_id,'accepted','is_accepted');
    },
    getAjax: function(){
      _this = this;
      $.ajax({
        url: config.host+'/qmm/wd/app/near/takeout_list',
        data:{
          "bottom_id":bottom_id,
          "limit": "10",
          "status": appModel.get('status')
        },
        type: 'get',
        dataType: 'json',
        beforeSend: function(){
          animating = true;
          $("#loading").show();
        },
        success:function(data){
          _this.render(data);
        },
        complete:function(){
          loading = false;
          $("#loading").hide();
        }
      })
    },
    postAjax: function(id,status,judge){
      _this = this;
      $.ajax({
        url: config.host + '/qmm/wd/app/near/confirm_'+status,
        type: 'post',
        data: {
          near_order_id:id
        },
        dataType:'json',
        success: function(data){
          if (data.respcd == '0000' && data.data[judge] == 1){
            _this.clearTimerList(timerList);
            timerList = [];
            firstRequest = true;
            bottom_id = 0;
            this.$('#wrap-content ul').remove();
            _this.getAjax();
            _this.toast('确认成功!')
          }else {
            _this.toast(data.resperr)
          }
        },
        error:function(){
          alert('服务器错误，请重试!')
        }
      })
    },
    setCountDown : function(obj){
      var second;
      if(appModel.get('status') == 3){
        second = obj.finish_duration;
      }else {
        second = obj.countdown;
      }
      if (second >=0){
        obj.minutes = Math.floor(second/60) >= 10 ? Math.floor(second/60) : "0" + Math.floor(second/60);
        obj.seconds = second%60 >= 10 ? second%60 : "0" + second%60;
        obj.overMinute = obj.minutes - obj.required_time/60 + 1;
        if(appModel.get('status') != 3){
          _this.startCountDown(obj);
        }
      }else {
        obj.overTime = true;
      }
    },
    setStatus : function(obj){
      obj.status = appModel.get('status');
    },
    startCountDown : function(obj){
      window["timer"+obj.near_order_id] = setInterval(function(){
        var el = $('#'+ obj.near_order_id).find('.business-handle').find('em');
        if (obj.seconds > 0){
          obj.seconds--;
          obj.seconds = obj.seconds >= 10 ? obj.seconds : "0" + obj.seconds;
          el.html('距离送达还有 <span>' + obj.minutes + "分" + obj.seconds + "秒" + '</span>')
        }else if (obj.minutes > 0){
          obj.seconds = 59;
          obj.minutes--;
          obj.minutes = obj.minutes >= 10 ? obj.minutes : "0" + obj.minutes;
          el.html('距离送达还有 <span>' + obj.minutes + "分" + obj.seconds + "秒" + '</span>')
        }else {
          clearInterval(window["timer"+obj.near_order_id]);
          el.html('已延迟,建议和顾客说明原因');
        }
      },1000);
      timerList.push(window["timer"+obj.near_order_id]);
    },
    clearTimerList: function(list){
      for(var i =0;i<=list.length;i++){
        clearInterval(list[i]);
      }
    },
    toast : function(msg){
      $('<div class="toast"></div>').text(msg).appendTo($('body'));
      setTimeout(function(){
        $('.toast').remove();
      },2000)
    },
    'refreshHandler': function(){
      location.reload();
    },
    preventClick: function(e){
      if(animating){
        e.preventDefault();
      }
    }
  })
  return  new takeout();
})