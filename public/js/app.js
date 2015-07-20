angular.module('fathr', ['ui.bootstrap', 'ui.bootstrap.datetimepicker','angular-flash.service', 'angular-flash.flash-alert-directive']);
// angular.module('fathr', ['ui.bootstrap', 'ui.bootstrap.datetimepicker']).controller('DatePickerCtrl',
// function ($scope, $http, $location, $timeout) {
var DatePickerCtrl = function ($scope, $http, $location, $timeout) {
 

  $scope.form = {};
  $scope.errorMessage = '';
  $scope.alertMe = function(flash) {
    if ($scope.form.date === undefined){$scope.form.date = new Date();}
        //trying to create flash message based on nummber
    if ($scope.form.phone === undefined || $scope.form.phone.length != 10) { 
    // Publish a error flash
      $scope.errors = "Please input number as 10 digits with no spaces - 1234567890"; }
    else{

      $http.post('/alerts', $scope.form).
      success(function(data) {
        $scope.successYeah = "Your message has been successfully sent to " + data.phone + ", " +data.date;
       
        // $scope.submit = function(){alert("successful");};
        $location.path('/');
       
        // $scope.reset();
      }).error(function(err) {
        $scope.errorMessage = err;
        console.log(err);
      });
    }
  };

  $scope.reset = function() {
    $scope.user    = angular.copy($scope.form);
    $scope.errors  = '';
    $scope.successYeah = '';
  };

  $scope.dateTimeNow = function() {
    $scope.date = new Date();
  };
  $scope.dateTimeNow();
  
  $scope.toggleMinDate = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
   
  $scope.maxDate = new Date('2014-06-22');
  $scope.toggleMinDate();

  $scope.dateOptions = {
    startingDay: 1,
    showWeeks: false
  };
  
  // Disable weekend selection
  $scope.disabled = function(calendarDate, mode) {
    return mode === 'day' && ( calendarDate.getDay() === 0 || calendarDate.getDay() === 6 );
  };
  
  $scope.hourStep = 1;
  $scope.minuteStep = 15;

  $scope.timeOptions = {
    hourStep: [1, 2, 3],
    minuteStep: [1, 5, 10, 15, 25, 30]
  };

  $scope.showMeridian = true;
  $scope.timeToggleMode = function() {
    $scope.showMeridian = !$scope.showMeridian;
  };
  
  $scope.$watch("date", function(value) {
    console.log('New date value:' + value);
  }, true);
  
  $scope.resetHours = function() {
    $scope.date.setHours(1);
  };
};
