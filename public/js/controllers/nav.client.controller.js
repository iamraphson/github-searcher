/**
 * Created by Raphson on 7/28/16.
 */
app.controller('NavbarCtrl', function($scope, $auth, $rootScope){
    if($auth.isAuthenticated()){
        $rootScope.currentUser = $auth.getPayload();
<<<<<<< HEAD
        console.log($rootScope.currentUser)
        console.log($rootScope)
=======
        console.log($rootScope.currentUser);
>>>>>>> d16fa6e98f06717d09965818c626395501dbf28a
    }
    $scope.isAuthenticated = function(){
        return $auth.isAuthenticated();
    }
});