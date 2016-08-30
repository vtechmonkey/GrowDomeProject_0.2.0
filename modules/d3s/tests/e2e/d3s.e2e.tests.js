'use strict';

describe('D3s E2E Tests:', function () {
  describe('Test D3s page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/d3s');
      expect(element.all(by.repeater('d3 in d3s')).count()).toEqual(0);
    });
  });
});
