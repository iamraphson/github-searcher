var authCtrl = require('./controllers/Auth.server.controller');
var gitHubCtrl = require('./controllers/Github.server.controller');
var token = require('../config/token');
module.exports = function(app){
    app.post('/auth/github', authCtrl.authGithub);

    app.get('/api/search/:search_word', token.ensureAuthenticated, gitHubCtrl.searchRepo);
};