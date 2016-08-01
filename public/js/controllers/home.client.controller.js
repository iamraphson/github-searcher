/**
 * Created by Raphson on 7/28/16.
 */
app.controller('HomeController', function($scope, $auth, spinnerService, gitHubService, toastr){
    $scope.result = false;
    $scope.gitSearchResponse = []; //Declare an empty array
    $scope.pageno = 1; // initialize page no to 1
    $scope.total_count = 0;
    $scope.itemsPerPage = 10; //this could be a dynamic value from a drop down
    $scope.search = function(){
        $scope.result = false;
        $scope.getResultsPage($scope.pageno);
    };
    $scope.getResultsPage = function(pageno) {
        spinnerService.show('html5spinner');
        gitHubService.searchRepo($scope.repo, $scope.itemsPerPage, pageno)
            .then(function(response){
                $scope.gitSearchResponse = response.data.repos;
                if($scope.gitSearchResponse.items.length > 0)
                    $scope.total_count = $scope.gitSearchResponse.total_count;

                if($scope.gitSearchResponse.total_count > 1000)
                    $scope.total_count = 1000;

                //console.log($scope.gitSearchResponse);
            })
            .catch(function(response){
                toastr.error(response.data.message, response.status);
            })
            .finally(function () {
                // Hide loading spinner whether our call succeeded or failed.
                spinnerService.hide('html5spinner');
                $scope.result = true;
            });
    }
});