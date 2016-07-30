/**
 * Created by Raphson on 7/28/16.
 */
app.controller('HomeController', function($scope, $auth, spinnerService, gitHubService, toastr){
    $scope.result = false;
    $scope.search = function() {
        spinnerService.show('html5spinner');
        gitHubService.searchRepo($scope.repo)
            .then(function(response){
                $scope.gitSearchResponse = response.data.repos;
                console.log($scope.gitSearchResponse);
            })
            .catch(function(response){
                toastr.error(response.data.message, response.status);
            });
        /*$timeout(function() {
            spinnerService.hide('html5spinner');
            $scope.loggedIn = true;
        }, 2500);*/
    }
});