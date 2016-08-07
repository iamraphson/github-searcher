/**
 * Created by Raphson on 8/7/16.
 */
var cacheManager = require('cache-manager');
var mongoStore = require('cache-manager-mongodb');
module.exports = cacheManager.caching({
    store : mongoStore,
    uri : process.env.MONGO_URL,
    options : {
        host : '127.0.0.1',
        port : '27017',
        username : process.env.MONGO_USERNAME,
        password : process.env.MONGO_PASSWORD,
        database : process.env.MONGO_DATABASE,
        collection : "cacheManager",
        compression : false,
        server : {
            poolSize : 5,
            auto_reconnect: true
        }
    }
});