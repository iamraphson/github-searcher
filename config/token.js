/**
 * Created by Raphson on 7/27/16.
 */
var jwt = require('jwt-simple'),
    moment = require('moment');
    secrets = require('./secrets');

module.exports = {
    createJWT : function(user){
        var payLoad = {
            sub: user,
            iat: moment().unix(),
            exp: moment().add(0.5, 'days').unix()
        };

        return jwt.encode(payLoad, secrets.TOKEN_SECRET);
    },

    ensureAuthenticated : function(req, res, next){
        if(!req.header('Authorization')){
            return res.status(401).send({
                message : "Please make sure your reuqest has an Authorization header"
            });
        }

        var token = req.header('Authorization').split(' ')[1];
        var payload = null;

        try{
            payload = jwt.decode(token, secrets.TOKEN_SECRET);
        } catch(err){
            return res.status(401).send({
                message: err.message
            })
        }

        if(payload.exp <= moment().unix()){
            return res.status(401).json({
                message: "Token has expired"
            });
        }
        req.user = payload.sub;
        next();
    }
};