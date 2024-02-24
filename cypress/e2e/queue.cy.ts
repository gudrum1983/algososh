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
  current,
  defaultStyleSelector,
  fieldset,
  first,
  head,
  headStyleSelector,
  input,
  tail,
  tailStyleSelector
} from '../support/constants';

const testValues = ['Hi', 'dear', 'revi', 'ewer'];
const length: number = testValues.length;

describe('Testing queue algorithm page', function () {
  beforeEach(function () {
    cy.visit(Path.queue);
    getDataCy('fieldset').within(() => {
      getDataCy('input-value').as(input).clear();
      getDataCy('button-add-tail').as(buttonAdd);
      getDataCy('button-delete-tail').as(buttonDelete);
      getDataCy('button-clear').as(buttonClear);
    }).as(fieldset);

    getDataCy('circle').as(circle);
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

  it('Correct animation of clearing the queue', () => {
    for (let value of testValues) {
      getAlias(input).should('not.be.disabled').type(value);
      getAlias(buttonAdd).should('not.be.disabled').click();
      getAlias(fieldset).should('not.be.disabled');
    }
    getAlias(circle).each(($el, index) => {
      if (index === 0) {
        cy.wrap($el).children(headStyleSelector).as('head').should('contain.text', 'head');
      } else if (index === (length - 1)) {
        cy.wrap($el).children(tailStyleSelector).should('contain.text', 'tail');
      }
    });

    getDataCy('letter').then(($elements) => {
      const nonEmptyElements = $elements.filter((index, element) => {
        return Cypress.$(element).text().trim() !== '';
      });
      cy.wrap(nonEmptyElements).should('have.length', 4);
    });
    getAlias(buttonClear).click();

    getDataCy('letter').then(($elements) => {
      const nonEmptyElements = $elements.filter((index, element) => {
        return Cypress.$(element).text().trim() !== '';
      });
      cy.wrap(nonEmptyElements).should('have.length', 0);
    });
    getAlias(circle).children(headStyleSelector).contains('head').should('have.length', 0);
    getAlias(circle).children(tailStyleSelector).contains('tail').should('have.length', 0);

  });

  it('Correct animation of adding to the queue', () => {
    testValues.forEach((value, index) => {
      getAlias(input).should('not.be.disabled').type(value);
      getAlias(buttonAdd).should('not.be.disabled').click();
      if (index === 0) {
        getAlias(circle).first().as(first).children(changingStyleSelector);
        getAlias(first).children(headStyleSelector).as(head).should('contain.text', 'head');
        getAlias(first).children(tailStyleSelector).as(tail).should('contain.text', 'tail');
        getAlias(circle).first().as(first).children(defaultStyleSelector);
        getAlias(head).should('contain.text', 'head');
        getAlias(tail).should('contain.text', 'tail');
      } else {
        getAlias(circle).eq(index).as(current).children(changingStyleSelector);
        getAlias(circle).eq(index - 1).children(tailStyleSelector).as('prevTail').should('contain.text', 'tail');
        getAlias(current).children(defaultStyleSelector);
        getAlias(current).children(tailStyleSelector).should('contain.text', 'tail');
        getAlias('prevTail').should('not.contain.text', 'tail');
      }
    });
  });


  it('Correct animation of removing from the queue', () => {
    testValues.forEach((value) => {
      getAlias(input).should('not.be.disabled').type(value);
      getAlias(buttonAdd).should('not.be.disabled').click();
    });
    getAlias(fieldset).should('not.be.disabled');

    for (let i = 0; i < length; i++) {
      getAlias(buttonDelete).should('not.be.disabled').click();
      if (i === (length - 1)) {
        getAlias(circle).eq(i).as('current').children(changingStyleSelector);
        getAlias(current).children(headStyleSelector).as(head).should('contain.text', 'head');
        getAlias(current).children(tailStyleSelector).as(tail).should('contain.text', 'tail');
        getAlias(circle).eq(i + 1).as('next');
        getAlias('next').children(headStyleSelector).as('nextHead').should('not.contain.text', 'head');
        getAlias('next').children(tailStyleSelector).as('nextTail').should('not.contain.text', 'tail');
        getAlias(current).children(defaultStyleSelector);
        getAlias(head).should('not.contain.text', 'head');
        getAlias(tail).should('not.contain.text', 'tail');
        getAlias('nextHead').should('contain.text', 'head');
        getAlias('nextTail').should('not.contain.text', 'tail');
      } else {
        getAlias(circle).eq(i).as('current').children(changingStyleSelector);
        getAlias(current).children(headStyleSelector).as('head').should('contain.text', 'head');
        getAlias(circle).eq(i + 1).children(headStyleSelector).as('nextHead').should('not.contain.text', 'head');
        getAlias(current).children(defaultStyleSelector);
        getAlias(head).should('not.contain.text', 'head');
        getAlias('nextHead').should('contain.text', 'head');
      }
      getAlias(fieldset).should('not.be.disabled');
    }
  });
});
