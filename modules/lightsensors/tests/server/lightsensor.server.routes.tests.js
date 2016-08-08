'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Lightsensor = mongoose.model('Lightsensor'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, lightsensor;

/**
 * Lightsensor routes tests
 */
describe('Lightsensor CRUD tests', function () {

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

    // Save a user to the test db and create new Lightsensor
    user.save(function () {
      lightsensor = {
        name: 'Lightsensor name'
      };

      done();
    });
  });

  it('should be able to save a Lightsensor if logged in', function (done) {
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

        // Save a new Lightsensor
        agent.post('/api/lightsensors')
          .send(lightsensor)
          .expect(200)
          .end(function (lightsensorSaveErr, lightsensorSaveRes) {
            // Handle Lightsensor save error
            if (lightsensorSaveErr) {
              return done(lightsensorSaveErr);
            }

            // Get a list of Lightsensors
            agent.get('/api/lightsensors')
              .end(function (lightsensorsGetErr, lightsensorsGetRes) {
                // Handle Lightsensor save error
                if (lightsensorsGetErr) {
                  return done(lightsensorsGetErr);
                }

                // Get Lightsensors list
                var lightsensors = lightsensorsGetRes.body;

                // Set assertions
                (lightsensors[0].user._id).should.equal(userId);
                (lightsensors[0].name).should.match('Lightsensor name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Lightsensor if not logged in', function (done) {
    agent.post('/api/lightsensors')
      .send(lightsensor)
      .expect(403)
      .end(function (lightsensorSaveErr, lightsensorSaveRes) {
        // Call the assertion callback
        done(lightsensorSaveErr);
      });
  });

  it('should not be able to save an Lightsensor if no name is provided', function (done) {
    // Invalidate name field
    lightsensor.name = '';

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

        // Save a new Lightsensor
        agent.post('/api/lightsensors')
          .send(lightsensor)
          .expect(400)
          .end(function (lightsensorSaveErr, lightsensorSaveRes) {
            // Set message assertion
            (lightsensorSaveRes.body.message).should.match('Please fill Lightsensor name');

            // Handle Lightsensor save error
            done(lightsensorSaveErr);
          });
      });
  });

  it('should be able to update an Lightsensor if signed in', function (done) {
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

        // Save a new Lightsensor
        agent.post('/api/lightsensors')
          .send(lightsensor)
          .expect(200)
          .end(function (lightsensorSaveErr, lightsensorSaveRes) {
            // Handle Lightsensor save error
            if (lightsensorSaveErr) {
              return done(lightsensorSaveErr);
            }

            // Update Lightsensor name
            lightsensor.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Lightsensor
            agent.put('/api/lightsensors/' + lightsensorSaveRes.body._id)
              .send(lightsensor)
              .expect(200)
              .end(function (lightsensorUpdateErr, lightsensorUpdateRes) {
                // Handle Lightsensor update error
                if (lightsensorUpdateErr) {
                  return done(lightsensorUpdateErr);
                }

                // Set assertions
                (lightsensorUpdateRes.body._id).should.equal(lightsensorSaveRes.body._id);
                (lightsensorUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Lightsensors if not signed in', function (done) {
    // Create new Lightsensor model instance
    var lightsensorObj = new Lightsensor(lightsensor);

    // Save the lightsensor
    lightsensorObj.save(function () {
      // Request Lightsensors
      request(app).get('/api/lightsensors')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Lightsensor if not signed in', function (done) {
    // Create new Lightsensor model instance
    var lightsensorObj = new Lightsensor(lightsensor);

    // Save the Lightsensor
    lightsensorObj.save(function () {
      request(app).get('/api/lightsensors/' + lightsensorObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', lightsensor.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Lightsensor with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/lightsensors/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Lightsensor is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Lightsensor which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Lightsensor
    request(app).get('/api/lightsensors/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Lightsensor with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Lightsensor if signed in', function (done) {
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

        // Save a new Lightsensor
        agent.post('/api/lightsensors')
          .send(lightsensor)
          .expect(200)
          .end(function (lightsensorSaveErr, lightsensorSaveRes) {
            // Handle Lightsensor save error
            if (lightsensorSaveErr) {
              return done(lightsensorSaveErr);
            }

            // Delete an existing Lightsensor
            agent.delete('/api/lightsensors/' + lightsensorSaveRes.body._id)
              .send(lightsensor)
              .expect(200)
              .end(function (lightsensorDeleteErr, lightsensorDeleteRes) {
                // Handle lightsensor error error
                if (lightsensorDeleteErr) {
                  return done(lightsensorDeleteErr);
                }

                // Set assertions
                (lightsensorDeleteRes.body._id).should.equal(lightsensorSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Lightsensor if not signed in', function (done) {
    // Set Lightsensor user
    lightsensor.user = user;

    // Create new Lightsensor model instance
    var lightsensorObj = new Lightsensor(lightsensor);

    // Save the Lightsensor
    lightsensorObj.save(function () {
      // Try deleting Lightsensor
      request(app).delete('/api/lightsensors/' + lightsensorObj._id)
        .expect(403)
        .end(function (lightsensorDeleteErr, lightsensorDeleteRes) {
          // Set message assertion
          (lightsensorDeleteRes.body.message).should.match('User is not authorized');

          // Handle Lightsensor error error
          done(lightsensorDeleteErr);
        });

    });
  });

  it('should be able to get a single Lightsensor that has an orphaned user reference', function (done) {
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

          // Save a new Lightsensor
          agent.post('/api/lightsensors')
            .send(lightsensor)
            .expect(200)
            .end(function (lightsensorSaveErr, lightsensorSaveRes) {
              // Handle Lightsensor save error
              if (lightsensorSaveErr) {
                return done(lightsensorSaveErr);
              }

              // Set assertions on new Lightsensor
              (lightsensorSaveRes.body.name).should.equal(lightsensor.name);
              should.exist(lightsensorSaveRes.body.user);
              should.equal(lightsensorSaveRes.body.user._id, orphanId);

              // force the Lightsensor to have an orphaned user reference
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

                    // Get the Lightsensor
                    agent.get('/api/lightsensors/' + lightsensorSaveRes.body._id)
                      .expect(200)
                      .end(function (lightsensorInfoErr, lightsensorInfoRes) {
                        // Handle Lightsensor error
                        if (lightsensorInfoErr) {
                          return done(lightsensorInfoErr);
                        }

                        // Set assertions
                        (lightsensorInfoRes.body._id).should.equal(lightsensorSaveRes.body._id);
                        (lightsensorInfoRes.body.name).should.equal(lightsensor.name);
                        should.equal(lightsensorInfoRes.body.user, undefined);

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
      Lightsensor.remove().exec(done);
    });
  });
});
