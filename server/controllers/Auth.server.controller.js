/**
 * Created by Raphson on 7/27/16.
 */
var secrets = require('../../config/secrets'),
    token = require('../../config/token'),
    qs = require('querystring'),
    _ = require('lodash'),
    request = require('request');
module.exports = {
    welcome: function(req, res){
        return res.status(200).json({message: "Welcome to GITHUB API"});
    },

    authGithub: function(req, res){
        console.log("Auth Log");
        var accessTokenUrl = 'https://github.com/login/oauth/access_token';
        var userApiUrl = 'https://api.github.com/user';
        var params = {
            code: req.body.code,
            client_id: req.body.clientId,
            client_secret: secrets.GITHUB_SECRET,
            redirect_uri: req.body.redirectUri
        };
        // Step 1. Exchange authorization code for access token.
        request.get({ url: accessTokenUrl, qs: params }, function(err, response, accessToken) {
            accessToken = qs.parse(accessToken);
            var headers = { 'User-Agent': 'Satellizer' };
            //Step 2. Retrieve profile information about the current user.
            request.get(
                { url: userApiUrl, qs: accessToken, headers: headers, json: true },
                function(err, response, profile) {
                    var currentUser   = _.pick(profile, 'id', 'name', 'login', 'avatar_url', 'email');
                    return res.send({
                        token: token.createJWT(profile),
                        user: currentUser
                    });
            });
        });
    }
};