/// <reference types='cypress' />
import {
  getCheckActivityButtonAdd,
  getCheckActivityButtonAddFill,
  getCheckActivityFieldset,
  getDataCy
} from '../support/commands';
import {Alias} from '../support/@types/selectors';

const fibonacciNumbers = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765];
const maxValue = 19
const input: Alias = '@input';
const button: Alias = '@button';
const fieldset: Alias = '@fieldset';
const circle: Alias = '@circle';

describe('Testing fibonacci number finder algorithm page', function () {
  beforeEach(function () {
    cy.visit('/fibonacci');
    cy.get('fieldset').within(() => {
      getDataCy('input-value').as('input').clear();
      getDataCy('button-submit').as('button');
    }).as('fieldset');
  });

  it('Submit button disabled with empty input', () => {
    getCheckActivityButtonAdd(button, input);
  });

  it('Submit button enabled with non-empty input', () => {
    getCheckActivityButtonAddFill(button, input, String(maxValue));
  });

  it('Fieldset disabled after submit button click', () => {
    getCheckActivityFieldset(button, input, '2', fieldset);
  });

  it('Fibb animation correctness check with 5 letters', () => {
    cy.get(input).type(String(maxValue));
    cy.get(button).click();
    let index: number = 0;
    getDataCy('circle').as('circle').should('have.length', index + 1).contains(fibonacciNumbers[index]);
    while(index < maxValue) {
      index++
      cy.get(circle).should('have.length', index + 1).eq(index).contains(fibonacciNumbers[index]);
    }
  });
});