var assert = require("assert");
var Stage = require("../../models/stage");
var Project = require("../../models/project");
var User = require("../../models/user");
var mongoose = require('mongoose');

describe("Testing Project's ", function() {
    var db = mongoose.connection;
    before(function(done) {
        var defaultDB = 'mongodb://localhost/hack-dj';
        db.on('error', function() {
            console.log("connection error");
        });
        db.once('open', function() {
            db.
            done();
        });
        mongoose.connect(defaultDB);
    });

    after(function(done) {
        db.close();
        done();
    });
    

    // Testing

    describe("_projects property, ", function() {
        it("should create an empty project", function(done) {
            var stage = new Stage({
                _projects: []
            });
            stage.save(function(err, numAffected, product) {
                console.log(stage);
                if(err) throw err;
                else done();
            });
        });
        it("should add a bunch of projects", function(done) {
            var user = new User.User({
                info: {
                    username: "Test",
                    email: "mw@mw.org",
                    password: "af2848af"
                }
            });
            user.save(function(err){
                if(err) throw err;
                var project = new Project.Project({
                    info: {
                        _user: user._id,
                        title: "title",
                        description: "description"
                    }
                });
                project.save(function(err) {
                    if(err) throw err;
                    var stage = new Stage({
                        _projects: [project._id],
                    });
                    stage.save(function(err) {
                        if(err) throw err;
                        else done();
                    })
                });
            });
        });
    });
});