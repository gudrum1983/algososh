/// <reference types='cypress' />
import {
  checkActivityButtonsWithNonEmptyInput,
  checkDisabledButtonsWithEmptyInput,
  checkDisabledFieldsetAfterClickButton,
  getAlias,
  getDataCy
} from '../support/commands';
import {Path} from '../../src/types/path';
import {
  buttonAdd,
  buttonClear,
  buttonDelete,
  changingStyleSelector,
  circle,
  defaultStyleSelector,
  fieldset,
  headStyleSelector,
  input
} from '../support/constants';

const testValues: Array<string> = ['Hi', 'dear', 'revi', 'ewer'];
const length: number = testValues.length;


describe('Testing stack algorithm page', function () {
  beforeEach(function () {
    cy.visit(Path.stack);
    getDataCy('fieldset').within(() => {
      getDataCy('input-value').as(input).clear();
      getDataCy('button-add-tail').as(buttonAdd);
      getDataCy('button-delete-tail').as(buttonDelete);
      getDataCy('button-clear').as(buttonClear);
    }).as(fieldset);
  });

  it('Submit button disabled with empty input', () => {
    checkDisabledButtonsWithEmptyInput([buttonAdd], input);
  });

  it('Submit button activity with filled input', () => {
    checkActivityButtonsWithNonEmptyInput([buttonAdd], input, 'Hi');
  });

  it('Fieldset disabled after submit button click', () => {
    checkDisabledFieldsetAfterClickButton(buttonAdd, input, 'Hi', fieldset);
  });

  it('Correct animation of clearing the stack', () => {
    for (let value of testValues) {
      getAlias(input).should('not.be.disabled').type(value);
      getAlias(buttonAdd).click();
      getDataCy('circle').as(circle);
    }
    getAlias(circle).should('have.length', length);
    getAlias(buttonClear).click();
    getAlias(circle).should('have.length', 0);
  });

  it('Correct animation of adding to the stack', () => {
    for (let value of testValues) {
      getAlias(input).should('not.be.disabled').type(value);
      getAlias(buttonAdd).click();
      getDataCy('circle').as('circle').last().children(changingStyleSelector).should('contain.text', value);
      getAlias(circle).last().children(defaultStyleSelector).should('contain.text', value);
      getAlias(circle).last().children(headStyleSelector).should('contain.text', 'top');
    }
  });

  it('Correct animation of removing from the stack', () => {
    for (let value of testValues) {
      getAlias(input).should('not.be.disabled').type(value);
      getAlias(buttonAdd).click();
    }
    getDataCy('circle').as('circle').should('have.length', length);
    for (let i = length - 1; i >= 2; i--) {
      getAlias(buttonDelete).should('not.be.disabled').click();
      getAlias(circle).last().last().children(changingStyleSelector).should('contain.text', testValues[i]);
      getAlias(circle).last().children(defaultStyleSelector).should('contain.text', testValues[i - 1]);
      getAlias(circle).last().children(headStyleSelector).should('contain.text', 'top');
      getAlias(circle).should('have.length', i);
    }
  });
});