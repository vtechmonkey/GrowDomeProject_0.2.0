'use strict';

describe('Lightsensors E2E Tests:', function () {
  describe('Test Lightsensors page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/lightsensors');
      expect(element.all(by.repeater('lightsensor in lightsensors')).count()).toEqual(0);
    });
  });
});
