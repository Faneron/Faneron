var assert = require('assert');
var User = require('../../models/user');
var Comment = require('../../models/comment');
var Project = require('../../models/project');
var mongoose = require('mongoose');

describe('User', function() {

    /*
     * Variables used by multiple function calls
     */
    // both user_no_error objects should save individually without raising errors
    var user_no_error1 = {
        info: {
            username: 'good1',
            email: 'good1@good.com',
            password: 'good1password'
        }
    }

    var user_no_error2 = {
        info: {
            username: 'good2',
            email: 'good2@good.com',
            password: 'good2password'
        }
    }

    /*
     * Hooks
     */

    var db = mongoose.connection;
    before(function(done) {
        var defaultDB = 'mongodb://localhost/hack-dj';
        db.on('error', function() {
            console.log("connection error");
        });
        db.once('open', function() {
            done();
        });
        mongoose.connect(defaultDB);
    });

    beforeEach(function(done) {
        if(db.users) {
            db.users.remove({});
        }
        done();
    });

    after(function(done) {
        db.close();
        done();
    });

    /*
     * Actual testing
     */

    describe('default', function() {

        it('should save a user with no information with error', function(done) {
            var user = new User.User();
            user.save(function(err, product, numAffected) {
                if(err) {
                    done();
                } else {
                    throw new Error();
                }
            });
        });
        
    });

    describe('info', function() {
        describe('username', function() {

            it('should throw an error when there are duplicated usernames', function(done) {
                var user1 = new User.User(user_no_error1);
                var user2 = new User.User(user_no_error2);
                // set user2's username to the same as user 1
                user2.info.username = user1.info.username;
                user1.save(function(err, product, numAffected) {
                    if(err) {
                        // No error should be raised yet here
                        throw new Error(err.message);
                    }
                    user2.save(function(err, product, numAffected) {
                        if(err) {
                            done();
                        }
                        throw new Error('Validation did not successfully catch error');
                    });
                })
            });

        });
    });
});