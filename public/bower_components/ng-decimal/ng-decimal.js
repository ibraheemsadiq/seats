angular.module('ng-decimal', []).directive('ngDecimal', ['$filter', '$interpolate', function ($filter, $interpolate) {
    var FLOAT_REGEXP_1 = /^\$?\d+(.\d{3})*(\,\d*)?$/; //Numbers like: 1.123,56
    var FLOAT_REGEXP_2 = /^\$?\d+(,\d{3})*(\.\d*)?$/; //Numbers like: 1,123.56
    var nDecimal = 0;
    var decimalPlaces = function (num) {
        var match = ('' + num).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
        if (!match) return 0;
        return Math.max(0, (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0));
    }
    var formatNumber = function (_num, d) {
        if (d == undefined) {
            if (nDecimal == undefined) {
                d = decimalPlaces(_num);
            } else {
                d = nDecimal;
            }
        }
        return (isNaN(d) || d === undefined) ? $filter('number')(_num) : $filter('number')(_num, d);
    };
    var getNumber = function (_num, d) {
        if (d == undefined) {
            if (nDecimal == undefined) {
                d = decimalPlaces(_num);
            } else {
                d = nDecimal;
            }
        }
        if (!isNaN(_num)) _num = _num.toString();
        if (FLOAT_REGEXP_1.test(_num)) {
            var num = parseFloat(_num.replace('.', '').replace(',', '.'));
        } else if (FLOAT_REGEXP_2.test(_num)) {
            var num = parseFloat(_num.replace(',', ''))
        } else {
            var num = 0;
        }
        if (!isNaN(d) || d !== undefined && d !== decimalPlaces(_num)) num = num.toFixed(d);
        return num;
    };
    return {
        require: 'ngModel', scope: false, restrict: 'A', link: function (scope, elm, attrs, ctrl) {
            attrs.$observe('decimal', function (newValue) {
                if (newValue == undefined || newValue == "" || isNaN(newValue)) {
                    nDecimal = 0;
                } else {
                    nDecimal = newValue;
                }
                var newNumber = getNumber(elm.val());
                ctrl.$setViewValue(formatNumber(newNumber));
                ctrl.$render();
            });
            elm.bind('blur', function () {
                ctrl.$viewValue = formatNumber(ctrl.$modelValue, attrs.decimal);
                ctrl.$render();
            });
            ctrl.$parsers.unshift(function (viewValue) {
                var testnum = getNumber(viewValue);
                ctrl.$setValidity('float', (testnum === 0 ? false : true));
                return (testnum === 0 ? undefined : testnum);
            });
            ctrl.$formatters.unshift(function (modelValue) {
                return modelValue === undefined ? modelValue : formatNumber(modelValue, attrs.decimal);
            });
        }
    };
}]);
