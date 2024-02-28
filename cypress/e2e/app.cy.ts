/// <reference types='cypress' />
import {getDataCy} from '../support/commands';

describe('Testing application availability', function () {
  beforeEach(function () {
    cy.visit('/');
  });

  it('Application is available at main page', function () {
    getDataCy('main-page').should('have.length', 1);
  });

  it('All navigation links are accessible', () => {
    getDataCy('navigation').within(() => {
      cy.get('a').each(page => {
        cy.request(page.prop('href'));
      });
    });
  });
});
