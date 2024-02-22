/// <reference types="cypress" />
import {getDataCy} from "../support/commands";

describe('Testing page with algorithm string reverse', function () {
  beforeEach(function () {
    cy.visit('/string');
    cy.get('form').within(() => {
      getDataCy("input-value").as("input").clear();
      getDataCy("button-submit").as('button');
      getDataCy("fieldset").as('fieldset');
    }).as('form');
  });

  it('Submit button disabled with empty input', () => {
    cy.get('@input').clear();
    cy.get('@button').should('be.disabled');
  })


  it('Submit button activity with filled input', () => {
    cy.get('@input').type('Hello World');
    cy.get('@button').should('not.be.disabled');
  })

  it('Fieldset disabled after submit button click', () => {
    cy.get('@input').type('Hi');
    cy.get('@fieldset').should('not.be.disabled');
    cy.get('@button').click();
    cy.get("@fieldset").should('be.disabled');
    cy.get("@fieldset").should('not.be.disabled');
  });


  it('String reversal animation correctness check with 5 letters', () => {
    const inputText = 'Hello';
    const defaultStyleSelector = "[class*=default]";
    const changingStyleSelector = "[class*=changing]";
    const modifiedStyleSelector = "[class*=modified]";

    cy.get('@input').type(inputText);
    cy.get('@button').click();
    getDataCy("circle").as('circle');


    cy.get<HTMLElement>('@circle').should('have.length', 5,).each(($el, index) => {
      cy.wrap($el).children(defaultStyleSelector).should('contain', inputText[index]);
    });

    cy.wait(1000);

    cy.get('@circle', {timeout: 500}).should('have.length', 5,).each(($el, index) => {
      if ([0, 4].includes(index)) {
        cy.wrap($el).children(changingStyleSelector).should('contain', inputText[index]);
      } else {
        cy.wrap($el).children(defaultStyleSelector).should('contain', inputText[index]);
      }
    });

    cy.wait(1000);

    cy.get<HTMLElement>('@circle').should('have.length', 5,).each(($el, index) => {
      if ([0, 4].includes(index)) {
        cy.wrap($el).children(modifiedStyleSelector).should('contain', inputText[4 - index]);
      } else if ([1, 3].includes(index)) {
        cy.wrap($el).children(changingStyleSelector).should('contain', inputText[index]);
      } else {
        cy.wrap($el).children(defaultStyleSelector).should('contain', inputText[index]);
      }
    });

    cy.wait(1000);

    cy.get('@circle').should('have.length', 5,).each(($el, index) => {
      if (index === 2) {
        cy.wrap('childrenChanging').should('contain', inputText[index].toLowerCase());
      } else {
        cy.wrap($el).children(modifiedStyleSelector).should('contain', inputText[4 - index]);
      }
    });

    cy.wait(1000);

    cy.get('@circle').should('have.length', 5,).each(($el, index) => {
      cy.wrap($el).children(modifiedStyleSelector).should('contain', inputText[4 - index]);
    });
  });
});