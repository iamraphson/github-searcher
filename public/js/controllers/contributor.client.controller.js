/**
 * Created by Raphson on 8/1/16.
 */
app.controller('ContributorController', function($scope, $routeParams, $auth,
     spinnerService, gitHubService, toastr){

    $scope.result = false;
    $scope.repoContributorResponse = []; //Declare an empty array
    $scope.pageno = 1; // initialize page no to 1
    $scope.total_count = 0;
    $scope.itemsPerPage = 500; //this could be a dynamic value from a drop down

    $scope.getResultsPage = function(pageno) {
        spinnerService.show('html5spinner1');
        gitHubService.getRepoContributor($routeParams.repoOwner, $routeParams.repoName,
            $scope.itemsPerPage, pageno)
            .then(function(response){
                console.log(response.data);
                $scope.repoContributorResponse = response.data.contributors;
                if($scope.repoContributorResponse.length > 0)
                    $scope.total_count = $scope.repoContributorResponse.length;

                if($scope.repoContributorResponse.length > 1000)
                    $scope.total_count = 1000;

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