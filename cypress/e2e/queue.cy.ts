/// <reference types='cypress' />
import {
  getCheckActivityButtonAdd,
  getCheckActivityButtonAddFill,
  getCheckActivityFieldset,
  getDataCy
} from '../support/commands';
import {Alias} from '../support/@types/selectors';
import {Path} from "../../src/types/path";

const testValues = ['Hi', 'dear', 'revi', 'ewer'];
const length: number = testValues.length;

const input: Alias = '@input';
const buttonAdd: Alias = '@buttonAdd';
const buttonDelete: Alias = '@buttonDelete';
const buttonClear: Alias = '@buttonClear';
const fieldset: Alias = '@fieldset';
const circle: Alias = '@circle';
const defaultStyleSelector = '[class*=default]';
const changingStyleSelector = '[class*=changing]';
const headStyleSelector = '[class*=head]';
const tailStyleSelector = '[class*=tail]';

describe('Testing string reversal algorithm page', function () {
  beforeEach(function () {
    cy.visit(Path.queue);
    cy.get('fieldset').within(() => {
      getDataCy('input-value').as('input').clear();
      getDataCy('button-add-tail').as('buttonAdd');
      getDataCy('button-delete-tail').as('buttonDelete');
      getDataCy('button-clear').as('buttonClear');
    }).as('fieldset');

    getDataCy("circle").as('circle');
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

  it.only('Button clear correct', () => {
    for (let value of testValues) {
      cy.get(input).should('not.be.disabled').type(value);
      cy.get(buttonAdd).should('not.be.disabled').click();
      cy.get(fieldset).should('not.be.disabled');
    }
    cy.get(circle).each(($el, index) => {
      if (index === 0) {
        cy.wrap($el).children(headStyleSelector).as('head').should('contain.text', 'head');
      } else if (index === (length - 1)) {
        cy.wrap($el).children(tailStyleSelector).should('contain.text', 'tail');
      }
    });
    // Найти все элементы, которые нужно проверить
    getDataCy('letter').then(($elements) => {
      // Фильтровать элементы, у которых нет значения
      const nonEmptyElements = $elements.filter((index, element) => {
        return Cypress.$(element).text().trim() !== '';
      });
      // Проверить, что количество пустых элементов соответствует ожидаемому
      cy.wrap(nonEmptyElements).should("have.length", 4);
    });
    cy.get(buttonClear).click();

    getDataCy('letter').then(($elements) => {
      // Фильтровать элементы, у которых нет значения
      const nonEmptyElements = $elements.filter((index, element) => {
        return Cypress.$(element).text().trim() !== '';
      });
      // Проверить, что количество пустых элементов соответствует ожидаемому
      cy.wrap(nonEmptyElements).should("have.length", 0);
    });
    cy.get("@circle").children(headStyleSelector).contains('head').should("have.length", 0);
    cy.get("@circle").children(tailStyleSelector).contains('tail').should("have.length", 0);

  });

  it('Button add correct', () => {
    testValues.forEach((value, index) => {
      cy.get(input).should('not.be.disabled').type(value);
      cy.get(buttonAdd).should('not.be.disabled').click();
      if (index === 0) {
        cy.get(circle).first().as('first').children(changingStyleSelector);
        cy.get('@first').children(headStyleSelector).as('head').should('contain.text', 'head');
        cy.get('@first').children(tailStyleSelector).as('tail').should('contain.text', 'tail');
        cy.get(circle).first().as('first').children(defaultStyleSelector);
        cy.get('@head').should('contain.text', 'head');
        cy.get('@tail').should('contain.text', 'tail');
      } else {
        cy.get(circle).eq(index).as('current').children(changingStyleSelector);
        cy.get(circle).eq(index - 1).children(tailStyleSelector).as('prevTail').should('contain.text', 'tail');
        cy.get('@current').children(defaultStyleSelector);
        cy.get('@current').children(tailStyleSelector).should('contain.text', 'tail');
        cy.get('@prevTail').should("not.contain.text");
      }
    });
  });


  it('Button delete correct', () => {
    testValues.forEach((value) => {
      cy.get(input).should('not.be.disabled').type(value);
      cy.get(buttonAdd).should('not.be.disabled').click();
    });
    cy.get(fieldset).should('not.be.disabled');

    for (let i = 0; i < length; i++) {
      cy.get(buttonDelete).should('not.be.disabled').click();
      if (i === (length - 1)) {
        cy.get(circle).eq(i).as('current').children(changingStyleSelector);
        cy.get("@current").children(headStyleSelector).as('head').should('contain.text', 'head');
        cy.get('@current').children(tailStyleSelector).as('tail').should('contain.text', 'tail');
        cy.get(circle).eq(i + 1).as('next');
        cy.get('@next').children(headStyleSelector).as('nextHead').should("not.contain.text");
        cy.get('@next').children(tailStyleSelector).as('nextTail').should("not.contain.text");
        cy.get('@current').children(defaultStyleSelector);
        cy.get('@head').should("not.contain.text");
        cy.get('@tail').should("not.contain.text");
        cy.get('@nextHead').should('contain.text', 'head');
        cy.get('@nextTail').should("not.contain.text");
      } else {
        cy.get(circle).eq(i).as('current').children(changingStyleSelector);
        cy.get("@current").children(headStyleSelector).as('head').should('contain.text', 'head');
        cy.get(circle).eq(i + 1).children(headStyleSelector).as('nextHead').should("not.contain.text");
        cy.get('@current').children(defaultStyleSelector);
        cy.get('@head').should("not.contain.text");
        cy.get('@nextHead').should('contain.text', 'head');
      }
      cy.get(fieldset).should('not.be.disabled');
    }

  });
})
;