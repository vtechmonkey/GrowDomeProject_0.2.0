'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  D3 = mongoose.model('D3'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, d3;

/**
 * D3 routes tests
 */
describe('D3 CRUD tests', function () {

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

    // Save a user to the test db and create new D3
    user.save(function () {
      d3 = {
        name: 'D3 name'
      };

      done();
    });
  });

  it('should be able to save a D3 if logged in', function (done) {
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

        // Save a new D3
        agent.post('/api/d3s')
          .send(d3)
          .expect(200)
          .end(function (d3SaveErr, d3SaveRes) {
            // Handle D3 save error
            if (d3SaveErr) {
              return done(d3SaveErr);
            }

            // Get a list of D3s
            agent.get('/api/d3s')
              .end(function (d3sGetErr, d3sGetRes) {
                // Handle D3 save error
                if (d3sGetErr) {
                  return done(d3sGetErr);
                }

                // Get D3s list
                var d3s = d3sGetRes.body;

                // Set assertions
                (d3s[0].user._id).should.equal(userId);
                (d3s[0].name).should.match('D3 name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an D3 if not logged in', function (done) {
    agent.post('/api/d3s')
      .send(d3)
      .expect(403)
      .end(function (d3SaveErr, d3SaveRes) {
        // Call the assertion callback
        done(d3SaveErr);
      });
  });

  it('should not be able to save an D3 if no name is provided', function (done) {
    // Invalidate name field
    d3.name = '';

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

        // Save a new D3
        agent.post('/api/d3s')
          .send(d3)
          .expect(400)
          .end(function (d3SaveErr, d3SaveRes) {
            // Set message assertion
            (d3SaveRes.body.message).should.match('Please fill D3 name');

            // Handle D3 save error
            done(d3SaveErr);
          });
      });
  });

  it('should be able to update an D3 if signed in', function (done) {
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

        // Save a new D3
        agent.post('/api/d3s')
          .send(d3)
          .expect(200)
          .end(function (d3SaveErr, d3SaveRes) {
            // Handle D3 save error
            if (d3SaveErr) {
              return done(d3SaveErr);
            }

            // Update D3 name
            d3.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing D3
            agent.put('/api/d3s/' + d3SaveRes.body._id)
              .send(d3)
              .expect(200)
              .end(function (d3UpdateErr, d3UpdateRes) {
                // Handle D3 update error
                if (d3UpdateErr) {
                  return done(d3UpdateErr);
                }

                // Set assertions
                (d3UpdateRes.body._id).should.equal(d3SaveRes.body._id);
                (d3UpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of D3s if not signed in', function (done) {
    // Create new D3 model instance
    var d3Obj = new D3(d3);

    // Save the d3
    d3Obj.save(function () {
      // Request D3s
      request(app).get('/api/d3s')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single D3 if not signed in', function (done) {
    // Create new D3 model instance
    var d3Obj = new D3(d3);

    // Save the D3
    d3Obj.save(function () {
      request(app).get('/api/d3s/' + d3Obj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', d3.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single D3 with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/d3s/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'D3 is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single D3 which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent D3
    request(app).get('/api/d3s/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No D3 with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an D3 if signed in', function (done) {
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

        // Save a new D3
        agent.post('/api/d3s')
          .send(d3)
          .expect(200)
          .end(function (d3SaveErr, d3SaveRes) {
            // Handle D3 save error
            if (d3SaveErr) {
              return done(d3SaveErr);
            }

            // Delete an existing D3
            agent.delete('/api/d3s/' + d3SaveRes.body._id)
              .send(d3)
              .expect(200)
              .end(function (d3DeleteErr, d3DeleteRes) {
                // Handle d3 error error
                if (d3DeleteErr) {
                  return done(d3DeleteErr);
                }

                // Set assertions
                (d3DeleteRes.body._id).should.equal(d3SaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an D3 if not signed in', function (done) {
    // Set D3 user
    d3.user = user;

    // Create new D3 model instance
    var d3Obj = new D3(d3);

    // Save the D3
    d3Obj.save(function () {
      // Try deleting D3
      request(app).delete('/api/d3s/' + d3Obj._id)
        .expect(403)
        .end(function (d3DeleteErr, d3DeleteRes) {
          // Set message assertion
          (d3DeleteRes.body.message).should.match('User is not authorized');

          // Handle D3 error error
          done(d3DeleteErr);
        });

    });
  });

  it('should be able to get a single D3 that has an orphaned user reference', function (done) {
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

          // Save a new D3
          agent.post('/api/d3s')
            .send(d3)
            .expect(200)
            .end(function (d3SaveErr, d3SaveRes) {
              // Handle D3 save error
              if (d3SaveErr) {
                return done(d3SaveErr);
              }

              // Set assertions on new D3
              (d3SaveRes.body.name).should.equal(d3.name);
              should.exist(d3SaveRes.body.user);
              should.equal(d3SaveRes.body.user._id, orphanId);

              // force the D3 to have an orphaned user reference
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

                    // Get the D3
                    agent.get('/api/d3s/' + d3SaveRes.body._id)
                      .expect(200)
                      .end(function (d3InfoErr, d3InfoRes) {
                        // Handle D3 error
                        if (d3InfoErr) {
                          return done(d3InfoErr);
                        }

                        // Set assertions
                        (d3InfoRes.body._id).should.equal(d3SaveRes.body._id);
                        (d3InfoRes.body.name).should.equal(d3.name);
                        should.equal(d3InfoRes.body.user, undefined);

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
      D3.remove().exec(done);
    });
  });
});
