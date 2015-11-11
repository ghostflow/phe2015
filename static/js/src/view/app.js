/**
 * Created by allen on 15/7/23.
 */
define(function(require,exports){
  var util = require('../common/util'),
      config = require('../common/config'),
      handlebarsHelper =  require('../component/handlebarsHelper');

  var AppCollection = require('../collection/appCollection');
  var paginationModel = require('../model/pagination');
  var firstRequest = true;
  var app = Backbone.View.extend({
    el: '#verify',
    events: {
      'submit .verify-form': 'submitHandler'
    },
    initialize: function(){
      var _this = this;
      _this.$progress = this.$('.progress');
      _this.$comsumeRecordContent = this.$('.consume-record-content');

      if(!util.Cookie.get('sessionid')){
        location.href = 'login.html';
      }
      $.ajax({
        url: config.host+'/qmm/wd/app/near/mechant_detail',
        type: 'get',
        dataType: 'json',
        success:function(data){
          if(data.respcd === '0000'){
            location.href = 'near-merchant://get_profile?data=' + data.data.name;
          } else if (data.respcd == '2002') {
            location.href = 'near-merchant://login'
          }else {
            alert(data.resperr)
          }
        },
        error: function(){

        }
      })

      this.$('.verify-code').focus();
      this.listenTo(AppCollection,'add',this.addOne);
      util.getAjax(config.host+'/qmm/order/redeem_orders','len='+config.eachPageNumber,function(data){
        if(data.respcd === '0000'){
          if(data.data.count != '0'){
            paginationModel.set('totalNumber',data.data.count);
            paginationModel.set('totalPage',parseInt((paginationModel.get('totalNumber')/config.eachPageNumber)+1));
            AppCollection.add(data.data.orders);
            _this.render(data);
            firstRequest = false;
            _this.$comsumeRecordContent.show();
          } else{
            Materialize.toast('还没有兑换记录哦~',2000);
          }
        } else {
          Materialize.toast(data.resperr,2000);
        }
        _this.$progress.hide();
      },function(data){
        Materialize.toast('网络错误请刷新重试',2000);
        _this.$progress.hide();
      })
    },
    render: function(data){
      var myTemplate = Handlebars.compile($("#li-template").html());
      $(myTemplate(data.data.orders)).hide().prependTo($('#list')).slideDown();
      if(firstRequest){
        var paginationTemplate = Handlebars.compile($("#pagination-template").html());
        $(paginationTemplate(paginationModel.attributes)).appendTo($('#pagination'));
      }
    },
    addOne : function(){
      //console.log(AppCollection)
    },
    submitHandler : function(e){
      e.preventDefault();
      var _data = this.$('.verify-form').serialize();
      var _this = this;
      if($('.verify-code').val() != ''){
        this.$('.verify-submit').attr('disabled','disabled').addClass('disabled').html("验证中<span class='dotting'></span>");
        util.postAjax(config.host+'/qmm/order/redeem',_data,function(data){
          if (data.respcd === '0000'){
            Materialize.toast('验证成功',2000);
            AppCollection.unshift(data.data.order);
            _this.render(data);
            firstRequest = false;
            _this.buttonReset();
            _this.$('.verify-code').val('').focus();
          }else{
            Materialize.toast(data.resperr,2000);
            _this.buttonReset();
          }
        },function(){
          Materialize.toast('网络错误请重试',2000);
          _this.buttonReset();
        })
      }else {
        Materialize.toast('请填写验证码',2000);
      }

    },
    ajaxSuccess: function(){

    },
    buttonReset: function(){
      this.$('.verify-submit').removeAttr('disabled').removeClass('disabled').html('验证');
    }
  });
  return new app();
})