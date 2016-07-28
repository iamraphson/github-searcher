var authCtrl = require('./controllers/Auth.server.controller');
module.exports = function(app){
    app.post('/auth/github', authCtrl.authGithub);
};