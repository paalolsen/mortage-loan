var loanApp = angular.module('loan', ['ngRoute']);
 
loanApp.config(function($routeProvider) {
    
    $routeProvider
        .when('/home',      {templateUrl: 'pages/home.html'})
        .when('/search',    {templateUrl: 'pages/search.html'})
        .when('/loan',      {templateUrl: 'pages/loan.html'})
        .otherwise(         {redirectTo: '/home'});
});


loanApp.directive('testField', ['$log', function($log/*$parse*/) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attr, ngModel) {
        
     scope.$watch(function (){
          return ngModel.$modelValue;
      }, function (value) {
         
         //var model = attr.ngModel;
         
         var testType       = attr.testFieldType;
         var testMinSize    = attr.testFieldMinSize;
         var testMaxSize    = attr.testFieldMaxSize;
         
         
         alert(testType + ' ' + testMinSize + ' ' + testMaxSize);
         
         // INTEGER/TEXT
         if(attr.testFieldType != undefined) {
             $log.info('IsInteger?: ' + testForType(testType, value));
             $log.info('TYPE-TEST ' + value+ '->attr.testFieldType: ' + attr.testFieldType);
         }
         // MIN SIZE
         if(attr.testFieldMinSize != undefined) {
            $log.info('MIN-SIZE: ' + value+ '->attr.testFieldMinSize: ' +attr.testFieldMinSize);
         }         
         // MAX SIZE
         if(attr.testFieldMaxSize != undefined) {
             $log.info('MAX-SIZE: ' + value+ '->attr.testFieldMaxLength: ' + attr.testFieldMaxLength);
         }
         
     
      })
        
      function testForType(type, value) {
        alert(value + ' -- ' + type);
         if(type.toUpperCase === "INTEGER"){ 
             alert(value);
            return Number(parseFloat(value))==value;
         }
         
      }
    
      function testForLengt(variable, length, isMax) {
     
         
      }       
     
    }
  };
}]);


loanApp.filter('dateFilter', ['$filter', function ($filter) {
    return function (input, format) {
        
        if (isNaN(input)) 
            return input;  
        
        input = "\/Date("+input+"-0000)\/";
        
        return (input) ? $filter('date')(parseInt(input.substr(6)), format) : '';
    };
}]);

loanApp.factory('loanFactory', ['$http', function($http) {
    
    var searchParams = {};
    var url;                // = 'mock/cicero.json';
   
    var type = 'get';
    
    return {
        setSearchParams: function($scope) {

            searchParams = "loanRaisingMonth="  + "9" +
                           "&loanRaisingYear="  + "2015" + 
                           "&principalAmount="  + $scope.amount +
                           "&annualNominalInterestRate=" +  $scope.rate +
                           "&totalNumberOfPayments=" + $scope.years;    
        },
        setUrl: function(urlApi) {
            url = urlApi;
        },
        setType: function(httpType) {
            type = httpType;
        },
        getData: function() {
            
            if(type === 'get') {
                return $http.get(url); 
            }
            else if(type === 'jsonp') {
                return $http.jsonp(url + searchParams,{ method: 'GET'});

            }           
        }
    };
}]);


loanApp.controller('LoanCtrl', ['$scope', '$location', 'loanFactory', function($scope,  $location, loanFactory) {
    
   if(false) {   

        loanFactory.setUrl('mock/cicero.json');
        loanFactory.setType('get');
   }
   else {
        loanFactory.setUrl('https://cfs-ws-itera.cicero.no/cfp/6/ws/rest/calculator/calculateLoan?_jsonp=JSON_CALLBACK&');
        loanFactory.setType('jsonp');
   }
    
    $scope.calculateLoan = function() {
        
            loanFactory.setSearchParams($scope);        
            loanFactory.getData().then(function (data) {

            $scope.dataResult = data.data;
            $location.path('/loan');
        });
    }
    
    $scope.resetValues  = function() {
        $scope.amount = '';
        $scope.year   = '';        
        $scope.rate   = '';        
        
         $location.path('/home');       

    };
     
    
}]);
 



