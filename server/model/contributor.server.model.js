/**
 * Created by Raphson on 8/7/16.
 */
var mongoose = require('mongoose'),
    contributorSchema = mongoose.Schema({
        contributor_id: { type: String, required: true },
        contributor_username: { type: String, required: true },
        contributor_name: { type: String },
        contributor_email: { type: String },
        contributor_location: { type: String }
    });

module.exports = mongoose.model('Contributor', contributorSchema, 'contributors');