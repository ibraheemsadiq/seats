(function() {
    'use strict';

    angular
        .module('public')
        .controller('MainController', MainController)
        .directive('myCoalitions',  myCoalitions)
    /** @ngInject */
    function MainController($timeout,$filter, $compile, $scope, toastr, $mdToast, $resource, $log) {
        var vm = this;

        vm.user = {};
        vm.user.seats = [];
        vm.user.seatValue = [];
        vm.calculation = [0,0,0,0,0,0,0,0,0,0];
        vm.sumValues = 0;
        vm.sumLpValues =0;
        vm.sumPValues = 0;
        vm.coalitionCount = 0;
        vm.seats = [];
        vm.msg = [];

        function isInArray(constraints, word) {
            //console.log(constraints);
            //console.log('word is');
            //console.log(word);

            var arr = Object.keys(constraints).map(function (key) { return constraints[key]; });

            if(word == undefined)
                return true;
            else
                return arr.indexOf(word.toLowerCase()) > -1;
        }
        // ******************************* Check for entity exists or not ***************************//

        vm.validateSeat = function (name, model) {

            var count = 0;

            console.log(typeof vm.data[3].seats.values[model]);
            if((typeof vm.data[3].seats.values[model]) == 'undefined')
            {
                model++;
                $('#seatValue'+model).focus();
                return;
            }
            if(typeof vm.data[3].seats.values[model].entity == 'undefined')
              if(vm.data[3].seats.values[model].entity != 'piraten')
                vm.data[3].seats.values.push([vm.data[3].seats.values[model].entity]);

            for(var i=0;i<vm.data[3].seats.values.length;i++)
              if((typeof vm.data[3].seats.values[i]) != 'undefined')
                if(vm.data[3].seats.values[i].entity == vm.data[3].seats.values[model].entity)
                    count++;
            console.log('name and model is');
            console.log(name+model+count);
            console.log('#seatValue'+model+1);

            if(count > 1)
                vm.data[3].seats.values[model].entity = '';

            var entity = isInArray(vm.constraints[0] , vm.data[3].seats.values[model].entity);
            if(entity)
                $scope.userForm[name].$setValidity("eNumber", true);
            else
                $scope.userForm[name].$setValidity("eNumber", false);
            model++;
            $('#seatValue'+model).focus();

        }
        // ******************************* update value of seats ***************************//

        vm.validateSeatValue = function (model) {
            var count = 0;
            console.log('entitiy is asdfsdf');
            console.log(vm.data[3].seats.values[model]);

            if(typeof vm.data[3].seats.values[model] == 'undefined')
            {
              alert(model);
                return;
            }

            var value = vm.data[3].seats.values[model].entity;
            console.log('-------check value is-----');
            console.log( vm.data[3].seats.values);
            console.log(model);

            if(value == undefined)
            {
                return;
            }
            var entity = isInArray(vm.constraints[0] , value);
            for(var i=0;i<vm.data[3].seats.values.length;i++)
                if((typeof vm.data[3].seats.values[i]) != 'undefined')
                  if(vm.data[3].seats.values[i].entity == value)
                    count++;


            if(entity)
            {
                var arr = [];
                if(value == '')
                {
                    console.log('removing id'+model);
                    angular.element("#"+model).remove();
                    vm.data[3].seats.values.splice(model, 1);
                    vm.updateCoalition();

                }
                else
                if(count == 1 )
                {

                    console.log('lenght is ');
                    console.log(angular.element('#'+model).length);

                    if (!angular.element('#'+model).length ) {
                        vm.updateCoalition();
                    }
                    vm.calculate();


                }

            }

        }
        // ******************************* update coalition area ***************************//

        vm.updateCoalition = function () {
            $scope.filteredItems = $filter('filter')(vm.data[3].seats.values, function(item){return item.entity !="";});
            $scope.filteredItems = $filter('filter')($scope.filteredItems , function(item){return item.entity != undefined;});


            var seats = $scope.filteredItems;
            var combinations = vm.data[3].seats.combinations;
            console.log('check combinations');
            console.log(combinations);
            $("section").remove();
            for(var i=0;i< seats.length;i++)
            {
                if((typeof vm.data[3].seats.values[i]) != 'undefined')
                {
                    if((typeof vm.data[3].seats.values[i].entity !='undefined'))
                    {
                        vm.data[3].seats.values[i].entity = vm.data[3].seats.values[i].entity.replace("_party", "");
                        vm.seats.push(vm.data[3].seats.values[i].entity);

                    }

                 var arr = [];
                for(var j=0;j< combinations.length; j++)
                {
                    if((combinations[j].indexOf(seats[i].entity)) > -1)
                    {
                        arr.push(j);

                    }

                }
                var compiledeHTML = $compile("<div id="+i+" my-coalitions   key="+seats[i].entity+"  check="+arr+"></div>")($scope);
                angular.element("#calculations").before(compiledeHTML);
                if(i==seats.length-1)
                    vm.calculate();
                }

            }


        }
        // ******************************* update percentage area ***************************//

        vm.validatepercentage = function (name, model) {
            if($scope.userForm[name].$viewValue == '')
                vm.data[3].percentages.current.splice(model,1);
            var entity = isInArray(vm.constraints[0] , $scope.userForm[name].$viewValue);
            if(entity)
                $scope.userForm[name].$setValidity("eNumber", true);
            else
                $scope.userForm[name].$setValidity("eNumber", false);
        }


        vm.response = {value : false};

        // ******************************* get Constraints ***************************//

        vm.getConstraints = function () {

            var Api = $resource("http://http://52.10.6.76:3000/constraints");
            Api.query({ method: 'GET', operation: 'view' }).$promise.then(function(data) {
                vm.loader = false;
                vm.constraints = data;

                $log.debug(data);

            }, function(errResponse) {
                if(errResponse)
                    $log.debug(errResponse);
                //////console.log('error');
                //////console.log(errResponse);

                // fail
                //////console.log(errResponse);
            });

        }
        // ******************************* calculate for coalition combination***************************//

        vm.calculate = function () {
            vm.coalitionCount =0;
            ////console.log(vm.sumValues);
            ////console.log('combination calculate is');
            ////console.log(vm.combinations);
            //console.log(vm.data[3].seats);
            vm.sumValues = 0;
            console.log('current seats are');
            console.log(vm.data[3].seats);
            for(var i=0; i<vm.data[3].seats.values.length;i++)
            {
                if((typeof vm.data[3].seats.values[i] != 'undefined'))
                vm.sumValues += vm.data[3].seats.values[i].value;
            }
            //console.log('sum value is');
            //console.log(vm.sumValues);
            //console.log('combinations ar');
            //console.log(vm.combinations);
            for(i=0; i <= vm.data[3].seats.combinations.length ;i++)
            {
                console.log(i);

                var calculation = 0;
                var value = '';
                Array.prototype.remove = function(from, to) {
                    var rest = this.slice((to || from) + 1 || this.length);
                    this.length = from < 0 ? this.length + from : from;
                    return this.push.apply(this, rest);
                };

                if(typeof vm.data[3].seats.combinations[i] != 'undefined')
                    if(vm.data[3].seats.combinations[i].length !=0)
                        for(var j=0; j< vm.data[3].seats.combinations[i].length; j++ )
                        {

                            var count = 0;
                            value = vm.data[3].seats.combinations[i][j];
                            console.log('value is ');
                            console.log(value);
                            if(vm.data[3].seats.values.indexOf(value))

                            for(var k=0; k < vm.data[3].seats.values.length; k++)
                              if((typeof vm.data[3].seats.values[k]) != 'undefined')
                                if(vm.data[3].seats.values[k].entity == value)
                                {
                                    count++;
                                    console.log('matched and calculating');
                                    console.log(vm.data[3].seats.values[k].value);
                                    calculation += vm.data[3].seats.values[k].value;

                                }
                            if(count==0)
                                vm.data[3].seats.combinations[i].splice(j,1);


                        }
                    else
                        vm.data[3].seats.combinations.remove(i);

                if(calculation !=0 )
                {
                    vm.coalitionCount ++;
                    vm.calculation[i] = calculation-Math.floor(vm.sumValues/2);
                }
                else
                {
                    console.log('check this');
                    console.log(i);
                    console.log(vm.data[3].seats.combinations[i]);
                    vm.calculation[i] = 0;
                }


            }
        }
        // ******************************* combination select/unselect ***************************//

        $scope.$on('opCombination', function (event, arg) {
            if(arg.toggle == false)
            {
                console.log('arg is');
                console.log(arg);
                console.log(vm.data[3].seats.combinations);
                if(arg.index > vm.data[3].seats.combinations.length+1)
                    return;

                if(typeof vm.data[3].seats.combinations[arg.index] == 'undefined')
                {
                    vm.data[3].seats.combinations.push([arg.value]);
                }
                else
                    vm.data[3].seats.combinations[arg.index].push(arg.value);
            }
            else
            {
                var index = vm.data[3].seats.combinations[arg.index].indexOf(arg.value);
                vm.data[3].seats.combinations[arg.index].splice(index, 1);
            }


            if(typeof vm.data[3].seats.combinations[arg.index] != 'undefined')
                if(vm.data[3].seats.combinations[arg.index].length > vm.constraints[7].entity_count_per_row_max )
                    vm.msg[arg.index] = 'Maximum count per row required is ' + vm.constraints[7].entity_count_per_row_max;
                else
                if(vm.data[3].seats.combinations[arg.index].length < vm.constraints[7].entity_count_per_row_min && vm.data[3].seats.combinations[arg.index].length!=0)
                    vm.msg[arg.index] = 'Minimum count per row required is ' + vm.constraints[7].entity_count_per_row_min;
                else
                    vm.msg[arg.index] = '';


            vm.calculate();
        });
        vm.getData = function () {
            ////console.log('calling');
            var Api = $resource("http://http://52.10.6.76:3000/data");
            Api.query({ method: 'GET', operation: 'view' }).$promise.then(function(data) {
                vm.loader = false;
                vm.data = data;


                ////console.log(seats);

                for(var i=0;i< vm.data[3].percentages.current.length;i++) {
                    vm.data[3].percentages.current[i].entity = vm.data[3].percentages.current[i].entity.replace("_party", "");
                    vm.sumPValues+= vm.data[3].percentages.current[i].value;

                }

                for(i=0;i< vm.data[3].percentages.last.length;i++) {
                    vm.data[3].percentages.last[i].entity = vm.data[3].percentages.last[i].entity.replace("_party", "");
                    vm.sumLpValues += vm.data[3].percentages.last[i].value;
                }




                vm.updateCoalition();


                $log.debug(data);

            }, function(errResponse) {
                if(errResponse)
                    $log.debug(errResponse);
                //////console.log('error');
                //////console.log(errResponse);

                // fail
                //////console.log(errResponse);
            });

        }
        vm.getConstraints();
        vm.getData();


        vm.showToastr = showToastr;


        function showToastr() {
            vm.message = false;
            if (angular.element('#sumLpValue').hasClass('activeRed')) {
                vm.message = 'Please fill Last Perecentages correctly'
            }

            if (angular.element('#sumPValue').hasClass('activeRed')) {
                vm.message = 'Please fill Perecentages correctly'
            }

            if (angular.element('#countCoalition').hasClass('activeRed')) {
                vm.message = 'Please select the coalition according to counts required'
            }
            if(vm.message)
            {
                $scope.showActionToast = function() {
                    var toast = $mdToast.simple()
                        .textContent(vm.message)
                        .parent(document.querySelectorAll('#toaster'))
                        .position('top right')
                        .hideDelay(false)
                        .action('x');
                    $mdToast.show(toast).then(function(response) {
                        if ( response == 'ok' ) {
                           // alert('You clicked the \'UNDO\' action.');
                        }
                    });
                };
                $scope.showActionToast();
                return;
            }
            var Api = $resource('http://http://52.10.6.76:3000/data/save');

            ////console.log(vm.data);
            var obj = {};
            for(var i=0;i< vm.data[3].seats.values.length;i++) {
                if((typeof vm.data[3].seats.values[i]) != 'undefined')
                    if((typeof vm.data[3].seats.values[i].entity) != 'undefined')
                      if (vm.data[3].seats.values[i].entity.indexOf("_party") == -1)
                        vm.data[3].seats.values[i].entity += "_party";

            }
            for(i=0;i< vm.data[3].percentages.current.length;i++) {
                if((typeof vm.data[3].seats.values[i]) != 'undefined')
                  if (vm.data[3].percentages.current[i].entity.indexOf("_party") == -1)
                    vm.data[3].percentages.current[i].entity += "_party";
            }
            for(i=0;i< vm.data[3].percentages.last.length;i++) {
                if((typeof vm.data[3].seats.values[i]) != 'undefined')
                  if (vm.data[3].percentages.last[i].entity.indexOf("_party") == -1)
                    vm.data[3].percentages.last[i].entity += "_party";

            }

            obj.source = vm.data[0];
            obj.turnout = vm.data[1];
            obj.threshold = vm.data[2];
            $scope.filteredItems = $filter('filter')(vm.data[3].seats.values, function(item){return item.entity !="";});
            $scope.filteredItems = $filter('filter')($scope.filteredItems , function(item){return item.entity != undefined;});

            obj.data = vm.data[3];
            obj.data.seats.values = $scope.filteredItems;

           Api.get({data: obj}).$promise.then(function(data) {
           ////console.log('data');
           vm.loader = false;
           if(data)
           {
           toastr.info('Data Saved Successfully');
           setTimeout(function(){
           window.location.reload();
           }, 1000);
           }

           }, function(errResponse) {
           if(errResponse)
           $log.debug(errResponse);

           // fail
           ////console.log(errResponse);
           });


            //vm.classAnimation = '';
        }

    }

    function myCoalitions() {

        return {

            controller: function ($scope, $rootScope) {

                $scope.addClass = function (event, index, number, value) {
                    var toggle = false;


                    if(angular.element(event.target).hasClass('md-raised'))
                    {
                        if(angular.element(event.target).hasClass('mdwarn'))
                        {
                            angular.element(event.target).removeClass('mdwarn');
                            toggle = true;
                        }
                        else
                            angular.element(event.target).addClass('mdwarn');
                    }
                    else
                    {
                        if(angular.element(event.target).parent().hasClass('mdwarn'))
                        {
                            angular.element(event.target).parent().removeClass('mdwarn');
                            toggle = true;
                        }
                        else
                            angular.element(event.target).parent().addClass('mdwarn');
                    }

                    $rootScope.$broadcast('opCombination', {index: index, number: number, value: value, toggle: toggle});

                }
                $scope.userSelected =  function(user){
                    var array = $scope.check.split(',');
                    var a = array.indexOf(user.toString());
                    if(a > -1)
                        return true;
                }

            },
            restrict: 'A',
            replace: true,
            scope: {
                check: '@check',
                key: '@key',
                id: '@id'
            },
            template: ' <section layout="column" layout-sm="column" layout-align="center center" layout-wrap> '
            +'<md-button class="md-raised button0" ng-class="{'+'mdwarn'+' : userSelected(0)}" ng-click="addClass($event , 0, id, key)">{{key}}</md-button>'
            +'<md-button class="md-raised button1" ng-class="{'+'mdwarn'+' : userSelected(1)}" ng-click="addClass($event , 1, id, key)">{{key}}</md-button>'
            +'<md-button class="md-raised button2" ng-class="{'+'mdwarn'+' : userSelected(2)}" ng-click="addClass($event , 2, id, key)">{{key}}</md-button>'
            +'<md-button class="md-raised button3" ng-class="{'+'mdwarn'+' : userSelected(3)}" ng-click="addClass($event , 3, id, key)">{{key}}</md-button>'
            +'<md-button class="md-raised button4" ng-class="{'+'mdwarn'+' : userSelected(4)}" ng-click="addClass($event , 4, id, key)">{{key}}</md-button>'
            +'<md-button class="md-raised button5" ng-class="{'+'mdwarn'+' : userSelected(5)}" ng-click="addClass($event , 5, id, key)">{{key}}</md-button>'
            +'<md-button class="md-raised button6" ng-class="{'+'mdwarn'+' : userSelected(6)}" ng-click="addClass($event , 6, id, key)">{{key}}</md-button>'
            +'<md-button class="md-raised button7" ng-class="{'+'mdwarn'+' : userSelected(7)}" ng-click="addClass($event , 7, id, key)">{{key}}</md-button>'
            +'<md-button class="md-raised button8" ng-class="{'+'mdwarn'+' : userSelected(8)}" ng-click="addClass($event , 8, id, key)">{{key}}</md-button>'
            +'<md-button class="md-raised button9" ng-class="{'+'mdwarn'+' : userSelected(9)}" ng-click="addClass($event , 9, id, key)">{{key}}</md-button>'
            +'</section>'
        };
    }


})();
