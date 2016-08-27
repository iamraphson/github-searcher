/**
 * Created by Raphson on 7/30/16.
 */
var GitHubApi = require('github');
var async = require("async");
var _ = require('lodash');
var mongoCache = require('../utils/CacheConfig');
var secrets = require('../../config/secrets');
var Contributor = require('../model/contributor.server.model');
module.exports = {

    /**
     * Search repositories.
     * @param req
     * @param res
     */
    searchRepo: function(req, res){
        var github = authForGitApi(req);

        github.search.repos({
            q : req.params.search_word,
            per_page: req.params.itemPerPage,
            page: req.params.pageno
        }, function(err, response) {
            if(err)
                return res.status(500).json({message: err.message});
            return res.status(200).json({success: true, repos: response});
        });
    },

    /**
     * Get contributors for the specified repository.
     * @param req
     * @param res
     */
    getRepoContributors: function(req, res){
        var repoOwner = req.params.repoOwner;
        var repoName = req.params.repoName;
        getTotalContributor(req);
        checkCacheForRepoData(repoOwner + '/' + repoName, function(result){
            if(result != null){
                console.log("from Cache System");
                return res.status(200).json({success: true, contributors: result});
            } else {
                console.log("from GithubAPI System");
                getContributorFromGit(req, function(status, data){
                    //console.log(data.length);
                    if(status){
                        var index = 0;
                        async.eachSeries(data,function(contributor, callback){
                            Contributor.find({contributor_id: contributor.id}, function(err, userContributor) {
                                if(userContributor.length > 0){
                                    console.log("Getting user info from local mongodb!!");
                                    index = findIndexInData(data, userContributor[0].contributor_id);
                                    data[index].user = userContributor[0];
                                    callback();
                                } else {
                                    console.log("Getting user info from git server!!");
                                    async.waterfall([
                                            function(callback) {
                                                authForGitApi(req).users.getForUser({
                                                    user: contributor.login
                                                }, function(err, response){
                                                    if(err){
                                                        console.log("Some error i think-> " + err.message);
                                                        callback(true);
                                                    }
                                                    callback(null,response,contributor.id + "->" + contributor.login);
                                                });
                                            },
                                            function(githubResponse,githubId,callback) {
                                                var contributorData = {
                                                    contributor_id: githubResponse.id,
                                                    contributor_username: githubResponse.login,
                                                    contributor_name: githubResponse.name,
                                                    contributor_email: githubResponse.email,
                                                    contributor_location: githubResponse.location
                                                };
                                                // create a new Data
                                                var newData = Contributor(contributorData);
                                                newData.save(function(err) {
                                                    if (err) console.log(err);
                                                });
                                                index = findIndexInData(data, githubResponse.id);
                                                data[index].user = contributorData;
                                                callback();
                                            }],function(){
                                                callback();
                                        }
                                    );
                                }
                            });
                            },function(){
                                console.log("output");
                                mongoCache.set(repoOwner + '/' + repoName, JSON.stringify(data),
                                    {ttl: secrets.CACHE_TIMEOUT}, function(err){
                                        console.log(err);
                                    });
                                return res.status(200).json({success: true, contributors: data});
                            });
                    } else {
                        return res.status(500).json({message: data.message});
                    }
                });
            }
        });
    }
};

var getContributorFromGit = function(req, cb){
    var pageNum = 1;
    var contributor = [];

    (function loop() {
        authForGitApi(req).repos.getContributors({
            user: req.params.repoOwner,
            repo: req.params.repoName,
            anon: false,
            per_page: 100,
            page: pageNum
        }, function(err, response){
            /*console.log(err);
            console.log("page num-> " + pageNum +" while response count-> " + response.length);*/
            if(err){
                cb(false, contributor);
            }
            async.eachSeries(response,function(userContributor, callback){
                contributor.push(userContributor);
                callback();
            });
            if(response.length != 0){
                pageNum++;
                loop();
            } else {
                console.log("total count -> " + contributor.length);
                cb(true, contributor);
            }
        });
    }());
};

/**
 * Check if cache is set...
 * @param key
 * @param cb
 */
var checkCacheForRepoData = function(key, cb){
    mongoCache.get(key, function(err, result) {
        if (err) {
            console.log(err);
            return cb(null);
        }
        return cb(JSON.parse(result));

    });
};

var authForGitApi = function(req){
    var github = new GitHubApi({debug: false});
    github.authenticate({ type: "oauth", token: req.user.accessToken });
    return github;
};

var getTotalContributor = function(req){
    authForGitApi(req).repos.getStatsContributors({
        user: req.params.repoOwner,
        repo: req.params.repoName,
    }, function(err, response){
        return response;
    });
};

var findIndexInData = function(data, value) {
    var result = -1;
    data.some(function (item, i) {
        if (item.id == value) {
            result = i;
            return true;
        }
    });
    return result;
};