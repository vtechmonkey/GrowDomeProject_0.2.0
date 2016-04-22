'use strict';

describe('Customers E2E Tests:', function() {
  describe('Test Customers page', function() {
    it('Should not include new Customers', function() {
      browser.get('http://localhost:3000/#!/customers');
      expect(element.all(by.repeater('customer in customers')).count()).toEqual(0);
    });
  });
});
