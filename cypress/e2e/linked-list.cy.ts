/// <reference types='cypress' />
import {getCheckActivityButtonAddFillMultiple, getCheckActivityButtonAddMultiple, getDataCy} from '../support/commands';
import {Alias} from '../support/@types/selectors';
import {Path} from "../../src/types/path";

const inputText = 'Hello';
const inputValue: Alias = '@inputValue';
const inputIndex: Alias = '@inputIndex';
const buttonAddTail: Alias = '@buttonAddTail';
const buttonAddHead: Alias = '@buttonAddHead';
const buttonAddIndex: Alias = '@buttonAddIndex';
const buttonDeleteIndex: Alias = '@buttonDeleteIndex';
const fieldsetIndex: Alias = '@fieldsetIndex';
const circle: Alias = '@circle';
const defaultStyleSelector = '[class*=default]';
const changingStyleSelector = '[class*=changing]';
const modifiedStyleSelector = '[class*=modified]';

describe('Testing string reversal algorithm page', function () {
  beforeEach(function () {
    cy.visit(Path.list);
    getDataCy('fieldset-value').within(() => {
      getDataCy('input-value').as('inputValue').clear();
      getDataCy('button-add-tail').as('buttonAddTail');
      getDataCy('button-add-head').as('buttonAddHead');
    }).as('fieldsetValue');
    getDataCy('fieldset-index').within(() => {
      getDataCy('input-index').as('inputIndex').clear();
      getDataCy('button-add-by-index').as('buttonAddIndex');
      getDataCy('button-delete-by-index').as('buttonDeleteIndex');
    }).as('fieldsetIndex');

  });

  it('Submit button disabled with empty input', () => {
    getCheckActivityButtonAddMultiple([buttonAddTail, buttonAddHead, buttonAddIndex], inputValue);
    getCheckActivityButtonAddMultiple([buttonAddIndex, buttonDeleteIndex], inputIndex);
  });

  it('Submit button activity with filled input', () => {
    getCheckActivityButtonAddFillMultiple([buttonAddHead, buttonAddTail, buttonAddIndex], inputValue, 'Hi');
    cy.get(buttonAddTail).click();
    cy.get(inputValue).should('not.be.disabled').type('sun');
    getCheckActivityButtonAddFillMultiple([buttonAddIndex, buttonDeleteIndex], inputIndex, '1');
  });

  /*  it('Fieldset disabled after submit button click', () => {
      getCheckActivityFieldset(button, input, 'Hi', fieldset);
    });*/


  /*  it('String reversal animation correctness check with 5 letters', () => {

      cy.get(input).type(inputText);
      cy.get(button).click();
      getDataCy('circle').as('circle');


      cy.get(circle).should('have.length', 5).each(($el, index) => {
        cy.wrap($el).children(defaultStyleSelector).should('contain', inputText[index]);
      });

      cy.wait(1000);

      cy.get(circle).should('have.length', 5,).each(($el, index) => {
        if ([0, 4].includes(index)) {
          cy.wrap($el).children(changingStyleSelector).should('contain', inputText[index]);
        } else {
          cy.wrap($el).children(defaultStyleSelector).should('contain', inputText[index]);
        }
      });

      cy.wait(1000);

      cy.get(circle).should('have.length', 5,).each(($el, index) => {
        if ([0, 4].includes(index)) {
          cy.wrap($el).children(modifiedStyleSelector).should('contain', inputText[4 - index]);
        } else if ([1, 3].includes(index)) {
          cy.wrap($el).children(changingStyleSelector).should('contain', inputText[index]);
        } else {
          cy.wrap($el).children(defaultStyleSelector).should('contain', inputText[index]);
        }
      });

      cy.wait(1000);

      cy.get(circle).should('have.length', 5,).each(($el, index) => {
        if (index === 2) {
          cy.wrap('childrenChanging').should('contain', inputText[index]);
        } else {
          cy.wrap($el).children(modifiedStyleSelector).should('contain', inputText[4 - index]);
        }
      });

      cy.wait(1000);

      cy.get(circle).should('have.length', 5,).each(($el, index) => {
        cy.wrap($el).children(modifiedStyleSelector).should('contain', inputText[4 - index]);
      });
    });*/
});