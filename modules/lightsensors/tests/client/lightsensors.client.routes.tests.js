(function () {
  'use strict';

  describe('Lightsensors Route Tests', function () {
    // Initialize global variables
    var $scope,
      LightsensorsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _LightsensorsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      LightsensorsService = _LightsensorsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('lightsensors');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/lightsensors');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          LightsensorsController,
          mockLightsensor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('lightsensors.view');
          $templateCache.put('modules/lightsensors/client/views/view-lightsensor.client.view.html', '');

          // create mock Lightsensor
          mockLightsensor = new LightsensorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Lightsensor Name'
          });

          //Initialize Controller
          LightsensorsController = $controller('LightsensorsController as vm', {
            $scope: $scope,
            lightsensorResolve: mockLightsensor
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:lightsensorId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.lightsensorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            lightsensorId: 1
          })).toEqual('/lightsensors/1');
        }));

        it('should attach an Lightsensor to the controller scope', function () {
          expect($scope.vm.lightsensor._id).toBe(mockLightsensor._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/lightsensors/client/views/view-lightsensor.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          LightsensorsController,
          mockLightsensor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('lightsensors.create');
          $templateCache.put('modules/lightsensors/client/views/form-lightsensor.client.view.html', '');

          // create mock Lightsensor
          mockLightsensor = new LightsensorsService();

          //Initialize Controller
          LightsensorsController = $controller('LightsensorsController as vm', {
            $scope: $scope,
            lightsensorResolve: mockLightsensor
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.lightsensorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/lightsensors/create');
        }));

        it('should attach an Lightsensor to the controller scope', function () {
          expect($scope.vm.lightsensor._id).toBe(mockLightsensor._id);
          expect($scope.vm.lightsensor._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/lightsensors/client/views/form-lightsensor.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          LightsensorsController,
          mockLightsensor;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('lightsensors.edit');
          $templateCache.put('modules/lightsensors/client/views/form-lightsensor.client.view.html', '');

          // create mock Lightsensor
          mockLightsensor = new LightsensorsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Lightsensor Name'
          });

          //Initialize Controller
          LightsensorsController = $controller('LightsensorsController as vm', {
            $scope: $scope,
            lightsensorResolve: mockLightsensor
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:lightsensorId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.lightsensorResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            lightsensorId: 1
          })).toEqual('/lightsensors/1/edit');
        }));

        it('should attach an Lightsensor to the controller scope', function () {
          expect($scope.vm.lightsensor._id).toBe(mockLightsensor._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/lightsensors/client/views/form-lightsensor.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
