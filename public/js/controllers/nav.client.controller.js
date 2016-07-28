/**
 * Created by Raphson on 7/28/16.
 */
app.controller('NavbarCtrl', function($scope, $auth){
    $scope.isAuthenticated = function(){
        return $auth.isAuthenticated();
    }
});