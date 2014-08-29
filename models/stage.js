var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var stageSchema = new mongoose.Schema({
    _projects: [{
        type: Schema.Types.ObjectId,
        ref: 'Project'
    }]
});

var Stage = mongoose.model('Stage', stageSchema);

module.exports = Stage;