(function () {
  'use strict';

  describe('D3s Controller Tests', function () {
    // Initialize global variables
    var D3sController,
      $scope,
      $httpBackend,
      $state,
      Authentication,
      D3sService,
      mockD3;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$state_, _$httpBackend_, _Authentication_, _D3sService_) {
      // Set a new global scope
      $scope = $rootScope.$new();

      // Point global variables to injected services
      $httpBackend = _$httpBackend_;
      $state = _$state_;
      Authentication = _Authentication_;
      D3sService = _D3sService_;

      // create mock D3
      mockD3 = new D3sService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'D3 Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the D3s controller.
      D3sController = $controller('D3sController as vm', {
        $scope: $scope,
        d3Resolve: {}
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('vm.save() as create', function () {
      var sampleD3PostData;

      beforeEach(function () {
        // Create a sample D3 object
        sampleD3PostData = new D3sService({
          name: 'D3 Name'
        });

        $scope.vm.d3 = sampleD3PostData;
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (D3sService) {
        // Set POST response
        $httpBackend.expectPOST('api/d3s', sampleD3PostData).respond(mockD3);

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL redirection after the D3 was created
        expect($state.go).toHaveBeenCalledWith('d3s.view', {
          d3Id: mockD3._id
        });
      }));

      it('should set $scope.vm.error if error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/d3s', sampleD3PostData).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      });
    });

    describe('vm.save() as update', function () {
      beforeEach(function () {
        // Mock D3 in $scope
        $scope.vm.d3 = mockD3;
      });

      it('should update a valid D3', inject(function (D3sService) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/d3s\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        $scope.vm.save(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($state.go).toHaveBeenCalledWith('d3s.view', {
          d3Id: mockD3._id
        });
      }));

      it('should set $scope.vm.error if error', inject(function (D3sService) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/d3s\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        $scope.vm.save(true);
        $httpBackend.flush();

        expect($scope.vm.error).toBe(errorMessage);
      }));
    });

    describe('vm.remove()', function () {
      beforeEach(function () {
        //Setup D3s
        $scope.vm.d3 = mockD3;
      });

      it('should delete the D3 and redirect to D3s', function () {
        //Return true on confirm message
        spyOn(window, 'confirm').and.returnValue(true);

        $httpBackend.expectDELETE(/api\/d3s\/([0-9a-fA-F]{24})$/).respond(204);

        $scope.vm.remove();
        $httpBackend.flush();

        expect($state.go).toHaveBeenCalledWith('d3s.list');
      });

      it('should should not delete the D3 and not redirect', function () {
        //Return false on confirm message
        spyOn(window, 'confirm').and.returnValue(false);

        $scope.vm.remove();

        expect($state.go).not.toHaveBeenCalled();
      });
    });
  });
})();
