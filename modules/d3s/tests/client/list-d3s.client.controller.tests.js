(function () {
  'use strict';

  describe('D3s List Controller Tests', function () {
    // Initialize global variables
    var D3sListController,
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

      // create mock article
      mockD3 = new D3sService({
        _id: '525a8422f6d0f87f0e407a33',
        name: 'D3 Name'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the D3s List controller.
      D3sListController = $controller('D3sListController as vm', {
        $scope: $scope
      });

      //Spy on state go
      spyOn($state, 'go');
    }));

    describe('Instantiate', function () {
      var mockD3List;

      beforeEach(function () {
        mockD3List = [mockD3, mockD3];
      });

      it('should send a GET request and return all D3s', inject(function (D3sService) {
        // Set POST response
        $httpBackend.expectGET('api/d3s').respond(mockD3List);


        $httpBackend.flush();

        // Test form inputs are reset
        expect($scope.vm.d3s.length).toEqual(2);
        expect($scope.vm.d3s[0]).toEqual(mockD3);
        expect($scope.vm.d3s[1]).toEqual(mockD3);

      }));
    });
  });
})();
