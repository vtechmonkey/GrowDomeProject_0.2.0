(function () {
  'use strict';

  describe('Charts Route Tests', function () {
    // Initialize global variables
    var $scope,
      ChartsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _ChartsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      ChartsService = _ChartsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('charts');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/charts');
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
          ChartsController,
          mockChart;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('charts.view');
          $templateCache.put('modules/charts/client/views/view-chart.client.view.html', '');

          // create mock Chart
          mockChart = new ChartsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Chart Name'
          });

          //Initialize Controller
          ChartsController = $controller('ChartsController as vm', {
            $scope: $scope,
            chartResolve: mockChart
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:chartId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.chartResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            chartId: 1
          })).toEqual('/charts/1');
        }));

        it('should attach an Chart to the controller scope', function () {
          expect($scope.vm.chart._id).toBe(mockChart._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/charts/client/views/view-chart.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          ChartsController,
          mockChart;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('charts.create');
          $templateCache.put('modules/charts/client/views/form-chart.client.view.html', '');

          // create mock Chart
          mockChart = new ChartsService();

          //Initialize Controller
          ChartsController = $controller('ChartsController as vm', {
            $scope: $scope,
            chartResolve: mockChart
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.chartResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/charts/create');
        }));

        it('should attach an Chart to the controller scope', function () {
          expect($scope.vm.chart._id).toBe(mockChart._id);
          expect($scope.vm.chart._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/charts/client/views/form-chart.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          ChartsController,
          mockChart;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('charts.edit');
          $templateCache.put('modules/charts/client/views/form-chart.client.view.html', '');

          // create mock Chart
          mockChart = new ChartsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Chart Name'
          });

          //Initialize Controller
          ChartsController = $controller('ChartsController as vm', {
            $scope: $scope,
            chartResolve: mockChart
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:chartId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.chartResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            chartId: 1
          })).toEqual('/charts/1/edit');
        }));

        it('should attach an Chart to the controller scope', function () {
          expect($scope.vm.chart._id).toBe(mockChart._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/charts/client/views/form-chart.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
