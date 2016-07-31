/**
 * Created by Raphson on 7/28/16.
 */
app.controller('NavbarCtrl', function($scope, $auth, $rootScope){
    if($auth.isAuthenticated()){
        $rootScope.currentUser = $auth.getPayload();
    }
    $scope.isAuthenticated = function(){
        return $auth.isAuthenticated();
    }
});