var assert = require('assert'),
    User = require('../../models/user'),
    Comment = require('../../models/comment'),
    Project = require('../../models/project');

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

    before(function(done) {

    });

    beforeEach(function(done) {

    });
    
    afterEach(function(done) {

    });

    after(function(done) {

    });

    /*
     * Actual testing
     */

    describe('default', function() {

        it('should save a user with no information without error', function(done) {
            var user = new User();
            user.save(function(err, product, numAffected) {
                if(err) {
                    throw new Error(err.message);
                }
                done();
            });
        });
        
    });

    describe('info', function() {
        describe('username', function() {

            it('should throw an error when there are duplicated usernames', function(done) {
                var user1 = new User(user_no_error);
                var user2 = new User(user_no_error2);
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