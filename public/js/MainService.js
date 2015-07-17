//This is where Angular does API calls on the node back end from the front end
angular.module('MainService', []).factory('Main', ['$http', function($http) {

	return {
        // call to get all alerts
        get : function() {
            return $http.get('/alerts');
        },


         // these will work when more API routes are defined on the Node side of things
        // call to POST and create a new alert
        create : function(alertData) {
            return $http.post('/alerts', alertData);
        },

        // call to DELETE an alert
        delete : function(id) {
            return $http.delete('/alerts/' + id);
        }
    }       

}]);