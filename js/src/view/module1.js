/**
 * Created by EiT on 2015/11/12.
 */
define(function (require, exports) {
  var util = require('../common/util'),
    config = require('../common/config');

  var userInfo = require('../component/userInfo');

  var module1 = Backbone.View.extend({
    el: "body",
    events: {

    },
    initialize: function () {
      $('#range1').slider({
        min: '0',
        max: '100',
        step: '1',
        tooltip: 'always',
        tooltip_position: 'bottom',
        formatter: function(value) {
          return '当前值 ' + value;
        }
      });
      $('#range2').slider({
        min: '0',
        max: '100',
        step: '1',
        tooltip: 'always',
        tooltip_position: 'bottom',
        formatter: function(value) {
          return '当前值 ' + value;
        }
      });
    }
  })

  return new module1();

})