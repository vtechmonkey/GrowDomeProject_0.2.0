'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Twitter = mongoose.model('Twitter'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, twitter;

/**
 * Twitter routes tests
 */
describe('Twitter CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Twitter
    user.save(function () {
      twitter = {
        name: 'Twitter name'
      };

      done();
    });
  });

  it('should be able to save a Twitter if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Twitter
        agent.post('/api/twitters')
          .send(twitter)
          .expect(200)
          .end(function (twitterSaveErr, twitterSaveRes) {
            // Handle Twitter save error
            if (twitterSaveErr) {
              return done(twitterSaveErr);
            }

            // Get a list of Twitters
            agent.get('/api/twitters')
              .end(function (twittersGetErr, twittersGetRes) {
                // Handle Twitter save error
                if (twittersGetErr) {
                  return done(twittersGetErr);
                }

                // Get Twitters list
                var twitters = twittersGetRes.body;

                // Set assertions
                (twitters[0].user._id).should.equal(userId);
                (twitters[0].name).should.match('Twitter name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Twitter if not logged in', function (done) {
    agent.post('/api/twitters')
      .send(twitter)
      .expect(403)
      .end(function (twitterSaveErr, twitterSaveRes) {
        // Call the assertion callback
        done(twitterSaveErr);
      });
  });

  it('should not be able to save an Twitter if no name is provided', function (done) {
    // Invalidate name field
    twitter.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Twitter
        agent.post('/api/twitters')
          .send(twitter)
          .expect(400)
          .end(function (twitterSaveErr, twitterSaveRes) {
            // Set message assertion
            (twitterSaveRes.body.message).should.match('Please fill Twitter name');

            // Handle Twitter save error
            done(twitterSaveErr);
          });
      });
  });

  it('should be able to update an Twitter if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Twitter
        agent.post('/api/twitters')
          .send(twitter)
          .expect(200)
          .end(function (twitterSaveErr, twitterSaveRes) {
            // Handle Twitter save error
            if (twitterSaveErr) {
              return done(twitterSaveErr);
            }

            // Update Twitter name
            twitter.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Twitter
            agent.put('/api/twitters/' + twitterSaveRes.body._id)
              .send(twitter)
              .expect(200)
              .end(function (twitterUpdateErr, twitterUpdateRes) {
                // Handle Twitter update error
                if (twitterUpdateErr) {
                  return done(twitterUpdateErr);
                }

                // Set assertions
                (twitterUpdateRes.body._id).should.equal(twitterSaveRes.body._id);
                (twitterUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Twitters if not signed in', function (done) {
    // Create new Twitter model instance
    var twitterObj = new Twitter(twitter);

    // Save the twitter
    twitterObj.save(function () {
      // Request Twitters
      request(app).get('/api/twitters')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Twitter if not signed in', function (done) {
    // Create new Twitter model instance
    var twitterObj = new Twitter(twitter);

    // Save the Twitter
    twitterObj.save(function () {
      request(app).get('/api/twitters/' + twitterObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', twitter.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Twitter with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/twitters/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Twitter is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Twitter which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Twitter
    request(app).get('/api/twitters/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Twitter with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Twitter if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Twitter
        agent.post('/api/twitters')
          .send(twitter)
          .expect(200)
          .end(function (twitterSaveErr, twitterSaveRes) {
            // Handle Twitter save error
            if (twitterSaveErr) {
              return done(twitterSaveErr);
            }

            // Delete an existing Twitter
            agent.delete('/api/twitters/' + twitterSaveRes.body._id)
              .send(twitter)
              .expect(200)
              .end(function (twitterDeleteErr, twitterDeleteRes) {
                // Handle twitter error error
                if (twitterDeleteErr) {
                  return done(twitterDeleteErr);
                }

                // Set assertions
                (twitterDeleteRes.body._id).should.equal(twitterSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Twitter if not signed in', function (done) {
    // Set Twitter user
    twitter.user = user;

    // Create new Twitter model instance
    var twitterObj = new Twitter(twitter);

    // Save the Twitter
    twitterObj.save(function () {
      // Try deleting Twitter
      request(app).delete('/api/twitters/' + twitterObj._id)
        .expect(403)
        .end(function (twitterDeleteErr, twitterDeleteRes) {
          // Set message assertion
          (twitterDeleteRes.body.message).should.match('User is not authorized');

          // Handle Twitter error error
          done(twitterDeleteErr);
        });

    });
  });

  it('should be able to get a single Twitter that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Twitter
          agent.post('/api/twitters')
            .send(twitter)
            .expect(200)
            .end(function (twitterSaveErr, twitterSaveRes) {
              // Handle Twitter save error
              if (twitterSaveErr) {
                return done(twitterSaveErr);
              }

              // Set assertions on new Twitter
              (twitterSaveRes.body.name).should.equal(twitter.name);
              should.exist(twitterSaveRes.body.user);
              should.equal(twitterSaveRes.body.user._id, orphanId);

              // force the Twitter to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Twitter
                    agent.get('/api/twitters/' + twitterSaveRes.body._id)
                      .expect(200)
                      .end(function (twitterInfoErr, twitterInfoRes) {
                        // Handle Twitter error
                        if (twitterInfoErr) {
                          return done(twitterInfoErr);
                        }

                        // Set assertions
                        (twitterInfoRes.body._id).should.equal(twitterSaveRes.body._id);
                        (twitterInfoRes.body.name).should.equal(twitter.name);
                        should.equal(twitterInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Twitter.remove().exec(done);
    });
  });
});
