import {Aliases, Selectors} from './@types/selectors';

declare global {
  namespace Cypress {
    interface Chainable {
      getDataCy: typeof getDataCy;
    }
  }
}

export const getDataCy = function (
  input: Selectors
) {
  return cy.get(`[data-cy='${input}']`);
};

export const getAlias = function (
  input: Aliases
) {
  return cy.get(`@${input}`);
};
export const checkDisabledButtonsWithEmptyInput = function (
  buttons: Aliases[], inputValue: Aliases
) {
  getAlias(inputValue).clear();
  return buttons.forEach((el) => {
    getAlias(el).should('be.disabled');
  });
};
export function checkDisabledFieldsetAfterClickButton(buttonAdd: Aliases, inputValue: Aliases, value: string, fieldset: Aliases
) {
  getAlias(inputValue).type(value);
  getAlias(fieldset).should('not.be.disabled');
  getAlias(buttonAdd).click();
  return getAlias(fieldset).should('be.disabled');
}
export function checkActivityButtonsWithNonEmptyInput(buttons: Aliases[], inputValue: Aliases, value: string) {
  getAlias(inputValue).type(value);
  return buttons.forEach((el) => {
    getAlias(el).should('not.be.disabled');
  });
}