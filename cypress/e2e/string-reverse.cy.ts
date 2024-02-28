/// <reference types='cypress' />
import {
  getAlias,
  checkDisabledFieldsetAfterClickButton,
  getDataCy, checkDisabledButtonsWithEmptyInput, checkActivityButtonsWithNonEmptyInput
} from '../support/commands';
import {Path} from '../../src/types/path';
import {
  button,
  changingStyleSelector,
  circle,
  defaultStyleSelector,
  fieldset,
  input,
  modifiedStyleSelector
} from '../support/constants';

const inputText = 'Hello';

describe('Testing string reversal algorithm page', function () {
  beforeEach(function () {
    cy.visit(Path.string);
    getDataCy('fieldset').within(() => {
      getDataCy('input-value').as(input).clear();
      getDataCy('button-submit').as(button);
    }).as(fieldset);
  });

  it('Submit button disabled with empty input', () => {
    checkDisabledButtonsWithEmptyInput([button], input);
  });

  it('Submit button activity with filled input', () => {
    checkActivityButtonsWithNonEmptyInput([button], input, inputText);
  });

  it('Fieldset disabled after submit button click', () => {
    checkDisabledFieldsetAfterClickButton(button, input, inputText, fieldset);
  });

  it('String reversal animation correctness check with 5 letters', () => {
    getAlias(input).type(inputText);
    getAlias(button).should('not.be.disabled').click();
    getDataCy('circle').as(circle);
    getAlias(circle).should('have.length', 5).each(($el, index) => {
      cy.wrap($el).children(defaultStyleSelector).should('contain', inputText[index]);
    });
    getAlias(circle).children(changingStyleSelector).should('have.length', 2);
    getAlias(circle).should('have.length', 5,).each(($el, index) => {
      if ([0, 4].includes(index)) {
        cy.wrap($el).children(changingStyleSelector).should('contain', inputText[index]);
      } else {
        cy.wrap($el).children(defaultStyleSelector).should('contain', inputText[index]);
      }
    });
    getAlias(circle).children(modifiedStyleSelector).should('have.length', 2);
    getAlias(circle).should('have.length', 5,).each(($el, index) => {
      if ([0, 4].includes(index)) {
        cy.wrap($el).children(modifiedStyleSelector).should('contain', inputText[4 - index]);
      } else if ([1, 3].includes(index)) {
        cy.wrap($el).children(changingStyleSelector).should('contain', inputText[index]);
      } else {
        cy.wrap($el).children(defaultStyleSelector).should('contain', inputText[index]);
      }
    });
    getAlias(circle).children(modifiedStyleSelector).should('have.length', 4);
    getAlias(circle).should('have.length', 5,).each(($el, index) => {
      if (index === 2) {
        cy.wrap($el).children(changingStyleSelector).should('contain', inputText[index]);
      } else {
        cy.wrap($el).children(modifiedStyleSelector).should('contain', inputText[4 - index]);
      }
    });
    getAlias(circle).children(modifiedStyleSelector).should('have.length', 5);
    getAlias(circle).should('have.length', 5,).each(($el, index) => {
      cy.wrap($el).children(modifiedStyleSelector).should('contain', inputText[4 - index]);
    });
  });
});