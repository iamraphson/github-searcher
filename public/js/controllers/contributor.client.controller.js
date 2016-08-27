/**
 * Created by Raphson on 8/1/16.
 */
app.controller('ContributorController', function($scope, $routeParams, $auth,
     spinnerService, gitHubService, toastr){

    $scope.result = false;
    $scope.repoContributorResponse = []; //Declare an empty array

    $scope.getResultsPage = function() {
        spinnerService.show('html5spinner1');
        gitHubService.getRepoContributor($routeParams.repoOwner, $routeParams.repoName)
            .then(function(response){
                console.log(response.data);
                $scope.repoContributorResponse = response.data.contributors;
            })
            .catch(function(response){
                toastr.error(response.data.message, response.status);
            })
            .finally(function () {
                // Hide loading spinner whether our call succeeded or failed.
                spinnerService.hide('html5spinner1');
                $scope.result = true;
            });
    };

    //$scope.getResultsPage($scope.pageno);
});