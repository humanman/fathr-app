angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

    $routeProvider

        // home page
        .when('/', {
            templateUrl: 'views/index.html',
            controller: 'MainController'
        })

        // alerts page that will use the AlertController
        .when('/alerts', {
            templateUrl: 'views/alerts.html',
            controller: 'AlertController'
        });

    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);
