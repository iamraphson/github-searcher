/**
 * Created by Raphson on 7/27/16.
 */
var app = angular.module('githubSearch', ['ngRoute', 'ngStorage', 'ngMessages', 'angularMoment',
    'angularSpinners', 'angularUtils.directives.dirPagination',
    'angular-loading-bar', 'ui.bootstrap', 'toastr', 'ngSanitize', 'ngLodash', 'satellizer', 'appRoutes'])
    .config(['cfpLoadingBarProvider', '$httpProvider','$authProvider',
        function(cfpLoadingBarProvider, $httpProvider, $authProvider){

        $authProvider.baseUrl = '/';
        $authProvider.authHeader = 'Authorization';
        $authProvider.authToken = 'Bearer';
        $authProvider.storageType = 'localStorage';

        $authProvider.github({
            //clientId: '19bf78ad112be0318698'
            clientId: 'ee56a3907763f5966ebf'
        });

        // GitHub
       $authProvider.github({
            url: '/auth/github',
            authorizationEndpoint: 'https://github.com/login/oauth/authorize',
            redirectUri: window.location.origin + "/auth/login",
            optionalUrlParams: ['scope'],
            scope: [''],
            scopeDelimiter: ' ',
            oauthType: '2.0',
            popupOptions: { width: 1020, height: 618 }
        });

        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = false;
    }]);
