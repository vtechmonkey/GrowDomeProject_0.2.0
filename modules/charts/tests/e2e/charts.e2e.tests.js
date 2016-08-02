'use strict';

describe('Charts E2E Tests:', function () {
  describe('Test Charts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/charts');
      expect(element.all(by.repeater('chart in charts')).count()).toEqual(0);
    });
  });
});
