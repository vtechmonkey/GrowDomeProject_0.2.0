'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Chart = mongoose.model('Chart'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, chart;

/**
 * Chart routes tests
 */
describe('Chart CRUD tests', function () {

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

    // Save a user to the test db and create new Chart
    user.save(function () {
      chart = {
        name: 'Chart name'
      };

      done();
    });
  });

  it('should be able to save a Chart if logged in', function (done) {
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

        // Save a new Chart
        agent.post('/api/charts')
          .send(chart)
          .expect(200)
          .end(function (chartSaveErr, chartSaveRes) {
            // Handle Chart save error
            if (chartSaveErr) {
              return done(chartSaveErr);
            }

            // Get a list of Charts
            agent.get('/api/charts')
              .end(function (chartsGetErr, chartsGetRes) {
                // Handle Chart save error
                if (chartsGetErr) {
                  return done(chartsGetErr);
                }

                // Get Charts list
                var charts = chartsGetRes.body;

                // Set assertions
                (charts[0].user._id).should.equal(userId);
                (charts[0].name).should.match('Chart name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Chart if not logged in', function (done) {
    agent.post('/api/charts')
      .send(chart)
      .expect(403)
      .end(function (chartSaveErr, chartSaveRes) {
        // Call the assertion callback
        done(chartSaveErr);
      });
  });

  it('should not be able to save an Chart if no name is provided', function (done) {
    // Invalidate name field
    chart.name = '';

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

        // Save a new Chart
        agent.post('/api/charts')
          .send(chart)
          .expect(400)
          .end(function (chartSaveErr, chartSaveRes) {
            // Set message assertion
            (chartSaveRes.body.message).should.match('Please fill Chart name');

            // Handle Chart save error
            done(chartSaveErr);
          });
      });
  });

  it('should be able to update an Chart if signed in', function (done) {
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

        // Save a new Chart
        agent.post('/api/charts')
          .send(chart)
          .expect(200)
          .end(function (chartSaveErr, chartSaveRes) {
            // Handle Chart save error
            if (chartSaveErr) {
              return done(chartSaveErr);
            }

            // Update Chart name
            chart.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Chart
            agent.put('/api/charts/' + chartSaveRes.body._id)
              .send(chart)
              .expect(200)
              .end(function (chartUpdateErr, chartUpdateRes) {
                // Handle Chart update error
                if (chartUpdateErr) {
                  return done(chartUpdateErr);
                }

                // Set assertions
                (chartUpdateRes.body._id).should.equal(chartSaveRes.body._id);
                (chartUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Charts if not signed in', function (done) {
    // Create new Chart model instance
    var chartObj = new Chart(chart);

    // Save the chart
    chartObj.save(function () {
      // Request Charts
      request(app).get('/api/charts')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Chart if not signed in', function (done) {
    // Create new Chart model instance
    var chartObj = new Chart(chart);

    // Save the Chart
    chartObj.save(function () {
      request(app).get('/api/charts/' + chartObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', chart.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Chart with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/charts/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Chart is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Chart which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Chart
    request(app).get('/api/charts/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Chart with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Chart if signed in', function (done) {
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

        // Save a new Chart
        agent.post('/api/charts')
          .send(chart)
          .expect(200)
          .end(function (chartSaveErr, chartSaveRes) {
            // Handle Chart save error
            if (chartSaveErr) {
              return done(chartSaveErr);
            }

            // Delete an existing Chart
            agent.delete('/api/charts/' + chartSaveRes.body._id)
              .send(chart)
              .expect(200)
              .end(function (chartDeleteErr, chartDeleteRes) {
                // Handle chart error error
                if (chartDeleteErr) {
                  return done(chartDeleteErr);
                }

                // Set assertions
                (chartDeleteRes.body._id).should.equal(chartSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Chart if not signed in', function (done) {
    // Set Chart user
    chart.user = user;

    // Create new Chart model instance
    var chartObj = new Chart(chart);

    // Save the Chart
    chartObj.save(function () {
      // Try deleting Chart
      request(app).delete('/api/charts/' + chartObj._id)
        .expect(403)
        .end(function (chartDeleteErr, chartDeleteRes) {
          // Set message assertion
          (chartDeleteRes.body.message).should.match('User is not authorized');

          // Handle Chart error error
          done(chartDeleteErr);
        });

    });
  });

  it('should be able to get a single Chart that has an orphaned user reference', function (done) {
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

          // Save a new Chart
          agent.post('/api/charts')
            .send(chart)
            .expect(200)
            .end(function (chartSaveErr, chartSaveRes) {
              // Handle Chart save error
              if (chartSaveErr) {
                return done(chartSaveErr);
              }

              // Set assertions on new Chart
              (chartSaveRes.body.name).should.equal(chart.name);
              should.exist(chartSaveRes.body.user);
              should.equal(chartSaveRes.body.user._id, orphanId);

              // force the Chart to have an orphaned user reference
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

                    // Get the Chart
                    agent.get('/api/charts/' + chartSaveRes.body._id)
                      .expect(200)
                      .end(function (chartInfoErr, chartInfoRes) {
                        // Handle Chart error
                        if (chartInfoErr) {
                          return done(chartInfoErr);
                        }

                        // Set assertions
                        (chartInfoRes.body._id).should.equal(chartSaveRes.body._id);
                        (chartInfoRes.body.name).should.equal(chart.name);
                        should.equal(chartInfoRes.body.user, undefined);

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
      Chart.remove().exec(done);
    });
  });
});
