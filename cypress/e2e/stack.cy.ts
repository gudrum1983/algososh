/// <reference types='cypress' />
import {
  getCheckActivityButtonAdd,
  getCheckActivityButtonAddFill,
  getCheckActivityFieldset,
  getDataCy
} from '../support/commands';
import {Alias} from '../support/@types/selectors';
import {Path} from "../../src/types/path";

const input: Alias = '@input';
const buttonAdd: Alias = '@buttonAdd';
const buttonDelete: Alias = '@buttonDelete';
const buttonClear: Alias = '@buttonClear';
const fieldset: Alias = '@fieldset';
const circle: Alias = '@circle';
const headStyleSelector = '[class*=head]';
const defaultStyleSelector = '[class*=default]';
const changingStyleSelector = '[class*=changing]';

describe('Testing string reversal algorithm page', function () {
  beforeEach(function () {
    cy.visit(Path.stack);
    cy.get('fieldset').within(() => {
      getDataCy('input-value').as('input').clear();
      getDataCy('button-add-tail').as('buttonAdd');
      getDataCy('button-delete-tail').as('buttonDelete');
      getDataCy('button-clear').as('buttonClear');
    }).as('fieldset');
  });

  it('Submit button disabled with empty input', () => {
    getCheckActivityButtonAdd(buttonAdd, input);
  });

  it('Submit button activity with filled input', () => {
    getCheckActivityButtonAddFill(buttonAdd, input, 'Hi');
  });

  it('Fieldset disabled after submit button click', () => {
    getCheckActivityFieldset(buttonAdd, input, 'Hi', fieldset);
  });

  it('Button clear correct', () => {
    for (let i = 1; i < 4; i++) {
      cy.get(input).should('not.be.disabled').type(String(i));
      cy.get(buttonAdd).click();
      getDataCy("circle").as("circle");
    }
    cy.get(circle).should("have.length", 3);
    cy.get(buttonClear).click();
    cy.get(circle).should("have.length", 0);
  });

  it('Button add correct animation', () => {
    const testValues = ['Hi', 'dear', 'revi', 'ewer'];
    for (let index in testValues) {
      cy.get(input).should('not.be.disabled').type(testValues[index]);
      cy.get(buttonAdd).click();
      getDataCy('circle').as('circle').last().children(changingStyleSelector).should('contain.text', testValues[index]);
      cy.get(circle).last().children(defaultStyleSelector).should('contain.text', testValues[index]);
      cy.get(circle).last().children(headStyleSelector).should("contain.text", 'top');
    }
  });

  it('Button delete correct animation', () => {
    const testValues = ['Hi', 'dear', 'revi', 'ewer'];
    const length = testValues.length;
    for (let index in testValues) {
      cy.get(input).should('not.be.disabled').type(testValues[index]);
      cy.get(buttonAdd).click();
    }
    getDataCy('circle').as('circle').should('have.length', length)

    for (let i = length - 1; i >= 2; i--) {
      cy.get(buttonDelete).should('not.be.disabled').click();
      cy.get(circle).last().last().children(changingStyleSelector).should('contain.text', testValues[i]);
      cy.get(circle).last().children(defaultStyleSelector).should('contain.text', testValues[i - 1]);
      cy.get(circle).last().children(headStyleSelector).should("contain.text", 'top');
      cy.get(circle).should('have.length', i)
    }
  });
});