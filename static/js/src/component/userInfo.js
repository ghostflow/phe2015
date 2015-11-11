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
      findPassword_step = 0;

  var userInfo = Backbone.View.extend({
    el: 'body',
    events: {
      'submit #signup-form': 'signupFormHandler',
      'submit #active-form': 'activeFormHandler',
      'submit #login-form': 'loginFormHandler',
      'click .signUp': 'signUpFormHandler',
      'click .forgotPassword': 'forgotPasswordHandler',
      'submit #findPassword-form': 'findPasswordFormHandler',
      'submit #findPasswordActive-form': 'findPasswordActiveFormHandler',
      'submit #findPasswordNewPassword-form': 'findPasswordNewPasswordFormHandler',
      'keypress input': 'hideErrorHandler'
    },
    initialize: function () {

    },
    //注册
    signupFormHandler: function(e){
      e.preventDefault();
      if($('.mobile').val() == ''){
        $('.error').text('请输入手机号').show();
        return;
      }else if($('.password').val() == ''){
        $('.error').text('请输入密码').show();
        return;
      }else if(!mobile_reg.test($('.mobile').val())){
        $('.error').text('请输入正确的手机号').show();
        return;
      }else if($('.password').val().length < 6 || $('.password').val().length > 16){
        $('.error').text('请输入6-16位密码').show();
        return;
      }
      $.ajax({
        //url: "http://www.pheworld.net:8080/register",
        url: 'http://172.26.10.2:8080/register',
        data: $('#signup-form').serialize(),
        type: 'post',
        dataType: 'json',
        success: function(data){

        }
      })
      var mobile = $('.mobile').val();
      $('#signup').modal('hide');
      sinup_step = 1;
      $('#signup').on('hidden.bs.modal', function (e) {
        if(sinup_step == 1){
          $('.current-mobile').text(mobile);
          $('#active').modal('show');
        }

      })
    },
    // 注册--激活账号
    activeFormHandler: function(e){
      e.preventDefault();
      //$.ajax({
      //
      //})
      $('#active').modal('hide');
      sinup_step = 2;
      $('#active').on('hidden.bs.modal', function (e) {
        if(sinup_step == 2){
          $('#activeSuccess').modal('show');
        }
      })
    },
    // 登录
    loginFormHandler: function(e){
      e.preventDefault();
      //$.ajax({
      //
      //})
      $('#active').modal('hide');
      sinup_step = 2;
      $('#active').on('hidden.bs.modal', function (e) {
        if(sinup_step == 2){
          $('#activeSuccess').modal('show');
        }
      })
    },
    // 点击新用户注册
    signUpFormHandler: function(e){
      $('#login').modal('hide');
      login_step_trans = 1;
      $('#login').on('hidden.bs.modal',function(){
        if(login_step_trans = 1){
          $('#signup').modal('show');
        }
      })
    },
    // 忘记密码
    forgotPasswordHandler: function(e){
      $('#login').modal('hide');
      $('#signup').modal('hide');
      login_step_trans = 2;
      $('#login').on('hidden.bs.modal',function(){
        if(login_step_trans = 2){
          $('#findPassword').modal('show');
        }
      })
      $('#signup').on('hidden.bs.modal',function(){
        if(login_step_trans = 2){
          $('#findPassword').modal('show');
        }
      })
    },
    // 找回密码
    findPasswordFormHandler: function(e){
      e.preventDefault();
      //$.ajax({
      //
      //})
      var mobile = $('.findPassword-mobile').val();
      $('#findPassword').modal('hide');
      findPassword_step = 1;
      $('#findPassword').on('hidden.bs.modal', function (e) {
        if(findPassword_step == 1){
          $('.current-mobile').text(mobile);
          $('#findPasswordActive').modal('show');
        }
      })
    },
    // 找回密码--激活账号
    findPasswordActiveFormHandler: function(e){
      e.preventDefault();
      //$.ajax({
      //
      //})
      var mobile = $('.findPassword-mobile').val();
      $('#findPasswordActive').modal('hide');
      findPassword_step = 2;
      $('#findPasswordActive').on('hidden.bs.modal', function (e) {
        if(findPassword_step == 2){
          $('.current-mobile').text(mobile);
          $('#findPasswordNewPassword').modal('show');
        }
      })
    },
    //找回密码--设置新密码
    findPasswordNewPasswordFormHandler: function(e){
      e.preventDefault();
      //$.ajax({
      //
      //})
      $('#findPasswordNewPassword').modal('hide');
      findPassword_step = 3;
      $('#findPasswordNewPassword').on('hidden.bs.modal', function (e) {
        if(findPassword_step == 3){
          $('#NewPasswordSuccess').modal('show');
        }
      })
    },
    hideErrorHandler: function(){
      $('.error').hide();
    }
  })
  return new userInfo();
})