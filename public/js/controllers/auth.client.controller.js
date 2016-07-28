/**
 * Created by Raphson on 7/28/16.
 */
app.controller('AuthController', function($scope, $auth, toastr, $location){
    $scope.authenticate = function(provider) {
        $auth.authenticate(provider).then(function() {
                toastr.success('You have successfully signed in');
                $location.path('/');
            }).catch(function(error) {
                if (error.error) {
                    // Popup error - invalid redirect_uri, pressed cancel button, etc.
                    toastr.error(error.error);
                } else if (error.data) {
                    // HTTP response error from server
                    toastr.error(error.data.message, error.status);
                } else {
                    toastr.error(error);
                }
            });
    };
});

app.controller('LogoutController', function($scope, $auth, toastr, $location){
    if (!$auth.isAuthenticated()) { return; }

    $auth.logout().then(function() {
        toastr.info('You have been logged out');
        $location.path('/auth/login');
    });
});