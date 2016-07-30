/**
 * Created by Raphson on 7/30/16.
 */
app.factory('gitHubService', function($http){
    return {
        searchRepo: function (searchWord) {
            return $http.get('/api/search/' + searchWord);
        }
    }
});