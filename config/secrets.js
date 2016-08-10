/**
 * Created by Raphson on 7/27/16.
 */
module.exports = {
    TOKEN_SECRET : process.env.TOKEN_SECRET,
    GITHUB_SECRET: process.env.GITHUB_SECRET,
    CACHE_TIMEOUT: (60 * 1440),//86400000
    db: process.env.MONGO_URL || 'mongodb://localhost/github-searcher',
};