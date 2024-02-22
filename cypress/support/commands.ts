import {Alias, Selectors} from './@types/selectors';

declare global {
  namespace Cypress {
    interface Chainable {
      getDataCy: typeof getDataCy;
      getCheckActivityButtonAdd: typeof getCheckActivityButtonAdd;
      getCheckActivityButtonAddFill: typeof getCheckActivityButtonAddFill;
    }
  }
}

/**
 * Gets element using data-cy selector
 * @param input data-cy attribute value
 * @example
 * // this command
 * cy.getDataCy('header')
 * // will select this element
 * <div data-cy="header">
 * </div>
 *
 */
export const getDataCy = function (
  input: Selectors
) {

  Cypress.log({
    consoleProps() {
      return {
        selector: input,
      };
    },
    displayName: 'getDataCy',
    name: 'Get by [data-cy] attribute',
  });

  return cy.get(`[data-cy='${input}']`);

};

export const getCheckActivityButtonAdd = function (
  buttonAdd: Alias, inputValue: Alias
) {

  cy.get(inputValue).clear();
  return cy.get(buttonAdd).should('be.disabled');
};

export const getCheckActivityFieldset = function (
  buttonAdd: Alias, inputValue: Alias, value: string, fieldset: Alias
) {
  cy.get(inputValue).type(value);
  cy.get(fieldset).should('not.be.disabled');
  cy.get(buttonAdd).click();
  cy.get(fieldset).should('be.disabled');
  return cy.get(buttonAdd).should('not.be.disabled');
};

export const getCheckActivityButtonAddFill = function (
  buttonAdd: Alias, inputValue: Alias, value: string
) {

  cy.get(inputValue).type(value);
  return cy.get(buttonAdd).should('not.be.disabled');
};
