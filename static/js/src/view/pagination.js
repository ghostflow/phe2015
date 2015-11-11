/**
 * Created by allen on 15/7/24.
 */
define(function(require,exports){
  var util = require('../common/util'),
      config = require('../common/config'),
      handlebarsHelper =  require('../component/handlebarsHelper');

  var paginationModel = require('../model/pagination');
  var pagination = Backbone.View.extend({
    el : '#pagination',
    events: {
      'click .pre-page': 'switchPageHandler',
      'click .next-page': 'switchPageHandler',
      'submit .searchForm': 'searchHandler'
    },
    render: function(data){
      $('#list').children().remove();
      var myTemplate = Handlebars.compile($("#li-template").html());
      $(myTemplate(data.data.orders)).hide().appendTo($('#list')).slideDown();

      $('#pagination').find('ul').remove();
      var paginationTemplate = Handlebars.compile($("#pagination-template").html());
      $(paginationTemplate(paginationModel.attributes)).appendTo($('#pagination'));
    },
    initialize: function(){
      this.listenTo(paginationModel,'change:page',this.fetch)
    },
    fetch: function(){
      var _this = this;
      util.getAjax(config.host+'/qmm/order/redeem_orders','len='+config.eachPageNumber+'&page='+paginationModel.get('page'),
      function(data){
        _this.render(data);
      },function(){
          })
    },
    switchPageHandler: function(e){
      var currentPage = paginationModel.get('page');
      if(e.target.className == 'pre-page'){
        if(currentPage == 1){
          return;
        }
        currentPage -= 1;
      }else {
        if(currentPage == paginationModel.get('totalPage')){
          return;
        }
        currentPage += 1;
      }
      paginationModel.set('page',currentPage);
    },
    searchHandler: function(e){
      e.preventDefault();
      var num = this.$('.page-num').val();
      var re = /^[1-9]+[0-9]*]*$/;   //判断正整数

      if (!re.test(num) || num > paginationModel.get('totalPage')) {
        Materialize.toast("请输入正确的页码",2000);
        this.$('.page-num').val('');
      }else {
        paginationModel.set('page',parseInt(num));
      }

    }
  })
  return new pagination();
})