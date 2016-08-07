/**
 * Created by Raphson on 7/30/16.
 */
var GitHubApi = require('github');
var mongoCache = require('../utils/CacheConfig');
var secrets = require('../../config/secrets');
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
     *Get contributors for the specified repository.
     * @param req
     * @param res
     */
    getRepoContributors: function(req, res){
        var repoOwner = req.params.repoOwner;
        var repoName = req.params.repoName;
        checkCacheForRepoData(repoOwner + '/' + repoName, function(result){
            /*if(result != null){
                console.log("from Cache System");
                return res.status(200).json({success: true, contributors: result});
            } else {*/
                console.log("from GithubAPI System");
                getContributorFromGit(req, function(status, data){
                    async.eachSeries(data.contributors,function(contributor, callback){
                        console.log(contributor);
                    },function(){
                        console.log("I am done");
                    });

                    if(status)
                        return res.status(200).json({success: true, contributors: data});
                    else
                        return res.status(500).json({message: data.message});
                });
            //}
        });
    }
};

var getContributorFromGit = function(req, cb){

    authForGitApi(req).repos.getContributors({
        user: req.params.repoOwner,
        repo: req.params.repoName,
        anon: false,
        per_page: req.params.itemPerPage,
        page: req.params.pageno
    }, function(err, response){
        if(err)
            cb(false, err);

        mongoCache.set(req.params.repoOwner + '/' + req.params.repoName,
            response, secrets.CACHE_TIMEOUT);
        cb(true, response);
    });
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
        return cb(result);

    });
};

var authForGitApi = function(req){
    var github = new GitHubApi({debug: false});
    github.authenticate({ type: "oauth", token: req.user.accessToken });
    return github;
};