
/**
 * Created by EiT on 2015/11/6.
 */

// 手机号码验证
var mobile_reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
var sinup_step = 0,
    login_step_trans = 0,
    findPassword_step = 0;

// 状态重置
function formReset(){
  sinup_step = 0;
  login_step_trans = 0;
  findPassword_step = 0;
  $('form').each(function(){
    $(this).reset();
  })
}
//登录

//注册
$('#signup-form').on('submit',function(e){
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
      console.log(data)
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
})

// 注册--激活账号
$('#active-form').on('submit',function(e){
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
})

// 登录
$('#active-form').on('submit',function(e){
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
})

// 点击新用户注册
$('.signUp').on('click',function(){
  $('#login').modal('hide');
  login_step_trans = 1;
  $('#login').on('hidden.bs.modal',function(){
    if(login_step_trans = 1){
      $('#signup').modal('show');
    }
  })
})
// 忘记密码
$('.forgotPassword').on('click',function(){
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
})

// 找回密码
$('#findPassword-form').on('submit',function(e){
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
})
// 找回密码--激活账号
$('#findPasswordActive-form').on('submit',function(e){
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
})
//找回密码--设置新密码
$('#findPasswordNewPassword-form').on('submit',function(e){
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
})
$('input').on('keypress',function(){
  $('.error').hide();
})