/**
 * Created by Raphson on 7/26/16.
 */
require('dotenv').load();
var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    cors = require('cors'),
    routes = require('./server/routes');

//setup application port
var port = process.env.PORT || 3000;

var app = express();
/**
 Express Configuration
 */
if(process.env.NODE_ENV === "production"){
    app.use(function(req, res, next) {
        var protocol = req.get('x-forwarded-proto');
        protocol == 'https' ? next() : res.redirect('https://' + req.hostname + req.url);
    });
}

//Enable Cross Origin access control
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static( __dirname + "/public" ));

routes(app);
/*
 Config for frontend routes
 */
app.get('*', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

/**
 * Start application server
 */
app.listen(port, function(){
    console.log("Server listening on port " + port);
});