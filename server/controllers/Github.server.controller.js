/**
 * Created by Raphson on 7/30/16.
 */
var GitHubApi = require('github');
module.exports = {
    searchRepo: function(req, res){
        var github = authForGitApi(req);
        console.log(req.params.itemPerPage);
        console.log(req.params.pageno);
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
     * Get All repo contributor
     * @param req
     * @param res
     */
    getRepoContributors: function(req, res){
        var github = authForGitApi(req);
    },
};

var authForGitApi = function(req){
    var github = new GitHubApi({debug: true});
    github.authenticate({ type: "oauth", token: req.user.accessToken });
    return github;
};