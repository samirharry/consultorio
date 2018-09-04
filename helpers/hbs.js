const moment = require('moment')

module.exports = {
  formatDate: function(date, format){
    return moment(date).format(format)
  },
  sum: function(a, b) {
    return a + b;
  },
  diff: function(a, b) {
    return (a > b) ? a - b : b - a;
  },
  equals: function(arg1, arg2, options){
    if (arg1) arg1 = arg1.toString()
    if (arg2) arg2 = arg2.toString()
    return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
  },
  times: function(n, block) {
    var accum = '';
    for(var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
  },
  ifCond: function (v1, operator, v2, options) {
    if (v2 != null && v2 != undefined) {
      switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
      }
    } else {
      if(v1) {
        return operator.fn(this);
      } else {
        return operator.inverse(this);
      }
    }
  }
}
