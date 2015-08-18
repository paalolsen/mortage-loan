var loanApp = angular.module('loan', ['ngRoute', 'ngMessages']);
 
loanApp.config(function($routeProvider) {
    
    $routeProvider
        .when('/home',      {templateUrl: 'pages/home.html'})
        .when('/search',    {templateUrl: 'pages/search.html'})
        .when('/loan',      {templateUrl: 'pages/loan.html'})
        .otherwise(         {redirectTo: '/home'});
});

// !!!NOT USED!!! <error-field error-variable="years"></error-field>
loanApp.directive('errorField', function(){
    
    return {
    
        scope: {
        
        },
        restrict: 'E',
        replace: true,
        link: function(scope, elem, attr) {
            
            scope.errorVar = attr.errorVariable;
            
            scope.getLayout() = function() {
                return 'pages/directive/error_tmpl_1.html'; 
            };
        }, 
        template: '<div ng-include="getLayout()"></div>' 
    }
    
});

loanApp.directive('testField', ['$log', '$parse', function($log, $parse) {
  return {
    require: 'ngModel',
    link: function(scope, elem, attr, ngModel) {
        
     scope.$watch(function (){
          return ngModel.$modelValue;
      }, function (value) {
         
         var fieldName      = attr.name;
         
         var testType       = attr.testFieldType;       // "INTEGER"
         var testMinSize    = attr.testFieldMinSize;    // Minimum number
         var testMaxSize    = attr.testFieldMaxSize;    // Maximum number
         var testSize       = attr.testFieldSize;       // Maximum number
         var testLength     = attr.testFieldLength;     // String length
         
         
         $log.info(testType + ' ' + testMinSize + ' ' + testMaxSize + ' ' + value);
         
         var error;
         var errors = [];
         
         // INTEGER/TEXT
         if( testType != undefined) {
             
             error = testForType(value, testType);
             
             if(error != "OK")
             {
                 errors.push(error);
                 $log.info('error pushed: ' + error);
             }
         }
         // MIN SIZE
         if(testMinSize != undefined ) {
             
            error = testForSize(value, testMinSize, ">");
             
            if(error != "OK")
             {
                 errors.push(error);
                 $log.info('error pushed: ' + error);
             }
         }         
         // MAX SIZE
         if(attr.testFieldMaxSize != undefined ) {
            
             error = testForSize(value, testMaxSize, "<");
            
             if(error != "OK")
             {
                 errors.push(error);
                 $log.info('error pushed: ' + error);
             }
         } 
         
         scope[(fieldName+'Error')] = [];    
         if(errors.length > 0)
         {
            scope[(fieldName+'Error')] = errors;             
         }
         
         ngModel.$parsers.unshift(function (value) {             
            
             ngModel.$setValidity( (fieldName+'Error'), errors.length == 0);

             return value;
          });
     
      })      
     
      function testForType(value, type) {
          
        if(type.toUpperCase() === "INTEGER"){              
            return Number(parseFloat(value))==value ? 'OK': 'You must enter a number'; 
         }
          
        //.... ++ other types, can include format attribute as well
          
        return 'Type ' + type + ' is wrong';           
      }
    
      function testForSize(value, size, operator) {
            
          if(operator === ">")
              return parseFloat(value) > size ? "OK" : "Number should be larger than " + size;
          if(operator === "<")
              return parseFloat(value) < size ? "OK" : "Number should be lower than " + size;
          if(operator === "=")
              return parseFloat(value) < size ? "OK" : "Number should be equal to " + size;
          
          return 'Operator ' + operator + ' is not valid';         
      }  
        
      function testForLength(value, length, operator) {
        
          if(operator === ">")
              return value.length > length ? "OK" : "Text should be longer than " + size;
          if(operator === "<")
              return value.length < length ? "OK" : "Text should be shorter than " + size;
          if(operator === "=")
              return value.length = length ? "OK" : "TExt should be " + size + " long";
          
          return 'Operator ' + operator + ' is not valid';  
              
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
                           "&totalNumberOfPayments=" + ($scope.years*12);    
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
 



