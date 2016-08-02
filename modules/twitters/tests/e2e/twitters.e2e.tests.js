'use strict';

describe('Twitters E2E Tests:', function () {
  describe('Test Twitters page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/twitters');
      expect(element.all(by.repeater('twitter in twitters')).count()).toEqual(0);
    });
  });
});
