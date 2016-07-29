/**
 * Created by Raphson on 7/28/16.
 */
app.controller('HomeController', function($scope, $auth){
    console.log($auth.getPayload());
});