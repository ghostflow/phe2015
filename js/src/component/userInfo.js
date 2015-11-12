/**
 * Created by EiT on 2015/7/29.
 */
define(function (require, exports) {
  var util = require('../common/util'),
    config = require('../common/config');
  // 手机号码验证
  var mobile_reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
  var sinup_step = 0,
      login_step_trans = 0,
      findPassword_step = 0,
      mobile = 0,
      fpmobile = 0,
      timer = null;

  var userInfo = Backbone.View.extend({
    el: 'body',
    events: {
      'submit #signup-form': 'signupFormHandler',
      'submit #active-form': 'activeFormHandler',
      'submit #login-form': 'loginFormHandler',
      'click .signUp': 'signUpFormHandler',
      'click .forgotPassword': 'forgotPasswordHandler',
      'click .has-account': 'hasAccountHandler',
      'submit #findPassword-form': 'findPasswordFormHandler',
      'submit #findPasswordActive-form': 'findPasswordActiveFormHandler',
      'submit #findPasswordNewPassword-form': 'findPasswordNewPasswordFormHandler',
      'keypress input': 'hideErrorHandler',
      'show.bs.modal #login': 'loginModalShowHandler',
      'show.bs.modal #findPassword': 'findPasswordModalShowHandler',
      'show.bs.modal #signup': 'signupModalShowHandler',
      'hidden.bs.modal #findPassword': 'findPasswordModalHideHandler',
      'hidden.bs.modal #findPasswordActive': 'findPasswordActiveModalHideHandler',
      'hidden.bs.modal #findPasswordNewPassword': 'findPasswordNewPasswordActiveModalHideHandler',
      'hidden.bs.modal #NewPasswordSuccess': 'NewPasswordSuccessModalHideHandler',
      'hidden.bs.modal #login': 'loginModalHideHandler',
      'hidden.bs.modal #signup': 'signupModalHideHandler',
      'hidden.bs.modal #active': 'activeModalHideHandler',
      'hidden.bs.modal #activeSuccess': 'activeSuccessModalHideHandler',
      'click .message-button': 'sendMessageHandler'
    },
    initialize: function () {

    },
    NewPasswordSuccessModalHideHandler: function(){
      clearInterval(timer);
      $('.count').text(3);
    },
    activeSuccessModalHideHandler: function(){
      clearInterval(timer);
      $('.count').text(3);
    },
    loginModalHideHandler: function(){
      if(login_step_trans == 1){
        $('#signup').modal('show');
      }else if(login_step_trans == 2){
        $('#findPassword').modal('show');
      }
    },
    findPasswordNewPasswordActiveModalHideHandler: function(){
      clearInterval(timer);
      if(findPassword_step == 3){
        $('#NewPasswordSuccess').modal('show');
        this.startCount(3,1,'NewPasswordSuccess');
      }
    },
    findPasswordActiveModalHideHandler: function(){
      $('.message-button').html('<span class="message-count">20</span>秒后可重新发送短信').attr('disabled','disabled');
      if(findPassword_step == 2){
        $('.current-mobile').text(fpmobile);
        $('#findPasswordNewPassword').modal('show');
      }
    },
    findPasswordModalHideHandler: function(){
      if(findPassword_step == 1){
        $('.current-mobile').text(fpmobile);
        $('#findPasswordActive').modal('show');
        this.startCount(20,2,'message-count','message-button');
      }
    },
    findPasswordModalShowHandler: function(){
      findPassword_step = 0;
      $('.error').hide();
    },
    //注册
    signupFormHandler: function(e){
      _this = this;
      e.preventDefault();
      if($('.mobile').val() == ''){
        this.showError('请输入手机号')
        return;
      }else if($('.password').val() == ''){
        this.showError('请输入密码')
        return;
      }else if(!mobile_reg.test($('.mobile').val())){
        this.showError('请输入正确的手机号')
        return;
      }else if($('.password').val().length < 8 || $('.password').val().length > 16){
        this.showError('请输入8-16位密码')
        return;
      }
      //util.postAjax(config.host+'mobile',$('#signup-form').serialize(),function(data){
      //  if(data.status == '-1'){
      //    _this.showError(data.msg);
      //  }else if(data.status == '200'){
          mobile = $('.mobile').val();
          sinup_step = 1;
          $('#signup').modal('hide');
        //}
      //})
    },
    // 注册--激活账号
    activeFormHandler: function(e){
      _this = this;
      e.preventDefault();
      //util.postAjax(config.host+'register',$('#signup-form').serialize()+'&'+$('#active-form').serialize(),function(data){
      //  if(data.status != '200'){
      //    _this.showError(data.msg);
      //  }else if(data.status == '200'){
          sinup_step = 2;
          $('#active').modal('hide');
      //  }
      //})
    },
    // 登录
    loginFormHandler: function(e){
      _this = this;
      e.preventDefault();
      if($('login-mobile').val() == ''){
        this.showError('请输入手机号')
        return;
      }else if($('.login-password').val() == ''){
        this.showError('请输入密码')
        return;
      }else if(!mobile_reg.test($('.login-mobile').val())){
        this.showError('请输入正确的手机号')
        return;
      }else if($('.login-password').val().length < 8 || $('.login-password').val().length > 16){
        this.showError('请输入8-16位密码')
        return;
      }
      //util.postAjax(config.host+'login',$('#login-form').serialize(),function(data){
      //  if(data.status != '200'){
      //    _this.showError(data.msg);
      //  }else if(data.status == '200'){
          _this.toast('登录成功！')
          $('#login').modal('hide');
      //  }
      //})
    },
    // 点击新用户注册
    signUpFormHandler: function(e){
      login_step_trans = 1;
      $('#login').modal('hide');
    },
    // 已有账号登录
    hasAccountHandler: function(e){
      this.$(e.target).parents('.modal').modal('hide');
      $('#login').modal('show');
    },
    // 忘记密码
    forgotPasswordHandler: function(e){
      login_step_trans = 2;
      $('#login').modal('hide');
    },
    // 找回密码
    findPasswordFormHandler: function(e){
      _this = this;
      e.preventDefault();
      if($('.findPassword-mobile').val() == '') {
        this.showError('请输入手机号')
        return;
      } if(!mobile_reg.test($('.findPassword-mobile').val())){
        this.showError('请输入正确的手机号')
        return;
      }
      //util.postAjax(config.host+'mobile',$('#findPassword-form').serialize(),function(data){
      //  if(data.status != '200'){
      //    _this.showError(data.msg);
      //  }else if(data.status == '200'){
        fpmobile = $('.findPassword-mobile').val();
        findPassword_step = 1;
        $('#findPassword').modal('hide');
      //  }
      //})
    },
    // 找回密码--激活账号
    findPasswordActiveFormHandler: function(e){
      e.preventDefault();
      if($('.find-code').val() == ''){
        this.showError('请输入激活码')
        return;
      }
      //util.postAjax(config.host+'identifying',$('#findPassword-form').serialize()+'&'+$('#findPasswordActive-form').serialize(),function(data){
      //  if(data.status != '200'){
      //    _this.showError(data.msg);
      //  }else if(data.status == '200'){
        findPassword_step = 2;
        $('#findPasswordActive').modal('hide');
      //  }
      //})

    },
    //找回密码--设置新密码
    findPasswordNewPasswordFormHandler: function(e){
      e.preventDefault();
      if($('.find-password').val() == ''){
        this.showError('请输入密码')
        return;
      }else if($('.find-password').val().length < 8 || $('.find-password').val().length > 16){
        this.showError('请输入8-16位密码')
        return;
      }
      //util.postAjax(config.host+'change_password',$('#findPassword-form').serialize()+'&'+$('#findPasswordActive-form').serialize()+'&'+
      // $('#findPasswordNewPassword-form').serialize(),function(data){
      //  if(data.status != '200'){
      //    _this.showError(data.msg);
      //  }else if(data.status == '200'){
          findPassword_step = 3;
          $('#findPasswordNewPassword').modal('hide');
      //  }
      //})
    },
    loginModalShowHandler: function(){
      login_step_trans = 0;
      clearInterval(timer);
      $('.message-count').text(20);
      $('.error').hide();
    },
    signupModalShowHandler: function(){
      sinup_step = 0;
      clearInterval(timer);
      $('.message-count').text(20);
      $('.error').hide();
    },
    signupModalHideHandler: function(){
      if(sinup_step == 1){
        $('.current-mobile').text(mobile);
        $('#active').modal('show');
        this.startCount(20,2,'message-count','message-button')
      }
    },
    activeModalHideHandler: function(){
      clearInterval(timer);
      $('.message-button').html('<span class="message-count">20</span>秒后可重新发送短信').attr('disabled','disabled');
      if(sinup_step == 2){
        $('#activeSuccess').modal('show');
        this.startCount(3,1,'activeSuccess');
      }
    },
    startCount: function(num,type,el,buttonEl){
      var _num = num;
      if(type == 1){
        timer = setInterval(function(){
          if(_num != 0){
            _num--;
            $('.count').text(_num);
          }else {
            $('#'+el).modal('hide');
          }
        },1000);
      }else if(type == 2){
        timer = setInterval(function(){
          if(_num != 0){
            _num--;
            $('.'+el).text(_num);
          }else {
            clearInterval(timer);
            $('.'+buttonEl).removeAttr('disabled').text('重新发送');
          }
        },1000);
      }
    },
    sendMessageHandler: function(){
      _this = this;
      //util.postAjax(config.host+'mobile',$('#signup-form').serialize(),function(data){
      //  if(data.status == '-1'){
      //    _this.showError(data.msg);
      //  }else if(data.status == '200'){
          $('.message-button').html('<span class="message-count">20</span>秒后可重新发送短信');
          _this.startCount(20,2,'message-count','message-button')
      //}
      //})
    },
    toast: function (msg) {
      $('<div class="toast">'+msg+'</div>').appendTo($('body'));
      setTimeout(function () {
        $('.toast').remove();
      }, 2000)
    },
    showError: function(msg){
      $('.error').text(msg).show();
    },
    hideErrorHandler: function(){
      $('.error').hide();
    }
  })
  return new userInfo();
})