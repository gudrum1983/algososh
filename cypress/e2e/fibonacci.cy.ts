/// <reference types='cypress' />
import {
  getAlias, checkDisabledFieldsetAfterClickButton,
  getDataCy, checkDisabledButtonsWithEmptyInput, checkActivityButtonsWithNonEmptyInput
} from '../support/commands';
import {Path} from '../../src/types/path';
import {button, circle, fieldset, input} from '../support/constants';

const fibonacciNumbers = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584, 4181, 6765];
const maxValue = 19

describe('Testing fibonacci number finder algorithm page', function () {
  beforeEach(function () {
    cy.visit(Path.fibonacci);
    getDataCy('fieldset').within(() => {
      getDataCy('input-value').as(input).clear();
      getDataCy('button-submit').as(button);
    }).as(fieldset);
  });

  it('Submit button disabled with empty input', () => {
    checkDisabledButtonsWithEmptyInput([button], input);
  });

  it('Submit button enabled with non-empty input', () => {
    checkActivityButtonsWithNonEmptyInput([button], input, String(maxValue));
  });

  it('Fieldset disabled after submit button click', () => {
    checkDisabledFieldsetAfterClickButton(button, input, '2', fieldset);
  });

  it('Fibonacci animation correctness check with maximum value 19', () => {
    getAlias(input).type(String(maxValue));
    getAlias(button).click();
    let index: number = 0;
    getDataCy('circle').as(circle).should('have.length', index + 1).contains(fibonacciNumbers[index]);
    while(index < maxValue) {
      index++
      getAlias(circle).should('have.length', index + 1).eq(index).contains(fibonacciNumbers[index]);
    }
  });
});