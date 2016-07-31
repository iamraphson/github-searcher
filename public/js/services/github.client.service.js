/**
 * Created by Raphson on 7/30/16.
 */
app.factory('gitHubService', function($http){
    return {
        searchRepo: function (searchWord, itemPerPage, pageNumber) {
            return $http.get('/api/search/' + searchWord + '/' + itemPerPage + '/' + pageNumber);
        }
    }
});