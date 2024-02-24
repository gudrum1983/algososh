/// <reference types='cypress' />
import {
  getCheckActivityButtonAdd,
  getCheckActivityButtonAddFill,
  getCheckActivityFieldset,
  getDataCy
} from '../support/commands';
import {Alias} from '../support/@types/selectors';
import {Path} from "../../src/types/path";
import {changingStyleSelector, defaultStyleSelector, modifiedStyleSelector} from "../support/constants";

const inputText = 'Hello';
const input: Alias = '@input';
const button: Alias = '@button';
const fieldset: Alias = '@fieldset';
const circle: Alias = '@circle';


describe('Testing string reversal algorithm page', function () {
  beforeEach(function () {
    cy.visit(Path.string);
    cy.get('fieldset').within(() => {
      getDataCy('input-value').as('input').clear();
      getDataCy('button-submit').as('button');
    }).as('fieldset');
  });

  it('Submit button disabled with empty input', () => {
    getCheckActivityButtonAdd(button, input);
  });

  it('Submit button activity with filled input', () => {
    getCheckActivityButtonAddFill(button, input, 'Hello world');
  });

  it('Fieldset disabled after submit button click', () => {
    getCheckActivityFieldset(button, input, 'Hi', fieldset);
  });


  it('String reversal animation correctness check with 5 letters', () => {

    cy.get(input).type(inputText);
    cy.get(button).should('not.be.disabled').click();
    getDataCy('circle').as('circle');


    cy.get(circle).should('have.length', 5).each(($el, index) => {
      cy.wrap($el).children(defaultStyleSelector).should('contain', inputText[index]);
    });

    cy.get(circle).children(changingStyleSelector).should('have.length', 2)


    cy.get(circle).should('have.length', 5,).each(($el, index) => {
      if ([0, 4].includes(index)) {
        cy.wrap($el).children(changingStyleSelector).should('contain', inputText[index]);
      } else {
        cy.wrap($el).children(defaultStyleSelector).should('contain', inputText[index]);
      }
    });

    cy.get(circle).children(modifiedStyleSelector).should('have.length', 2)

    cy.get(circle).should('have.length', 5,).each(($el, index) => {
      if ([0, 4].includes(index)) {
        cy.wrap($el).children(modifiedStyleSelector).should('contain', inputText[4 - index]);
      } else if ([1, 3].includes(index)) {
        cy.wrap($el).children(changingStyleSelector).should('contain', inputText[index]);
      } else {
        cy.wrap($el).children(defaultStyleSelector).should('contain', inputText[index]);
      }
    });

    cy.get(circle).children(modifiedStyleSelector).should('have.length', 4)

    cy.get(circle).should('have.length', 5,).each(($el, index) => {
      if (index === 2) {
        cy.wrap('childrenChanging').should('contain', inputText[index]);
      } else {
        cy.wrap($el).children(modifiedStyleSelector).should('contain', inputText[4 - index]);
      }
    });

    cy.get(circle).children(modifiedStyleSelector).should('have.length', 5)

    cy.get(circle).should('have.length', 5,).each(($el, index) => {
      cy.wrap($el).children(modifiedStyleSelector).should('contain', inputText[4 - index]);
    });
  });
});