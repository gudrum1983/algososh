/// <reference types='cypress' />
import {getCheckActivityButtonAddFillMultiple, getCheckDisableButtonAddMultiple, getDataCy} from '../support/commands';
import {Alias} from '../support/@types/selectors';
import {Path} from "../../src/types/path";

const inputValue: Alias = '@inputValue';
const inputIndex: Alias = '@inputIndex';
const buttonAddTail: Alias = '@buttonAddTail';
const buttonAddHead: Alias = '@buttonAddHead';
const buttonDeleteTail: Alias = '@buttonDeleteTail';
const buttonDeleteHead: Alias = '@buttonDeleteHead';
const buttonAddIndex: Alias = '@buttonAddIndex';
const buttonDeleteIndex: Alias = '@buttonDeleteIndex';
const circle: Alias = '@circle';
const defaultStyleSelector = '[class*=default]';
const changingStyleSelector = '[class*=changing]';
const modifiedStyleSelector = '[class*=modified]';
const headStyleSelector = '[class*=head]';
const tailStyleSelector = '[class*=tail]';

describe('Testing string reversal algorithm page', function () {
  beforeEach(function () {
    cy.visit(Path.list);
    getDataCy('fieldset-value').within(() => {
      getDataCy('input-value').as('inputValue').clear();
      getDataCy('button-add-tail').as('buttonAddTail');
      getDataCy('button-add-head').as('buttonAddHead');
      getDataCy('button-delete-tail').as('buttonDeleteTail');
      getDataCy('button-delete-head').as('buttonDeleteHead');
    });
    getDataCy('fieldset-index').within(() => {
      getDataCy('input-index').as('inputIndex').clear();
      getDataCy('button-add-by-index').as('buttonAddIndex');
      getDataCy('button-delete-by-index').as('buttonDeleteIndex');
    });
    getDataCy("circle").as("circle");
  });

  it('Submit button disabled with empty input', () => {
    getCheckDisableButtonAddMultiple([buttonAddTail, buttonAddHead, buttonAddIndex], inputValue);
    getCheckDisableButtonAddMultiple([buttonAddIndex, buttonDeleteIndex], inputIndex);
  });

  it('Submit button activity with filled value input', () => {
    getCheckActivityButtonAddFillMultiple([buttonAddHead, buttonAddTail, buttonAddIndex], inputValue, 'Hi');
  });

  it('Submit button activity with filled index input', () => {
    cy.get(inputValue).should('not.be.disabled').type('Hi');
    cy.get(buttonAddTail).click();
    cy.get(inputValue).should('not.be.disabled').type('dear');
    getCheckActivityButtonAddFillMultiple([buttonAddIndex, buttonDeleteIndex], inputIndex, '1');
  });

  it('default list', () => {

    cy.get(circle).should("not.have.length", 0).each(($el, index) => {
      cy.wrap($el).children(defaultStyleSelector).should('contain.text', '');
    });
    cy.get(circle).first().children(headStyleSelector).should('contain.text', 'head');
    cy.get(circle).last().children(tailStyleSelector).should('contain.text', 'tail');

    /*    cy.get(circle).each(($el, index) => {
          if (index === 0) {
            cy.wrap($el).children(headStyleSelector).as('head').should('contain.text', 'head');
          } else if (index === (length - 1)) {
            cy.wrap($el).children(tailStyleSelector).should('contain.text', 'tail');
          }
        });*/
    // Найти все элементы, которые нужно проверить
    /*    getDataCy('letter').then(($elements) => {
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
    */
  });


  it('addTail', () => {

    cy.get(inputValue).should('not.be.disabled').type('hi');
    cy.get(buttonAddTail).click();

    cy.get('@circle').each((element, index, $list) => {
      if (index === ($list.length - 2)) {
        cy.wrap(element)
          .children(headStyleSelector)
          .find("[class*='changing']")
          .should('contain.text', 'hi');
      }
    });
    cy.get('@circle').last().as('last').children(modifiedStyleSelector).should('contain.text', 'hi');
    cy.get('@last').children(defaultStyleSelector).should('contain.text', 'hi');

  });

  it('addHead', () => {

    cy.get(inputValue).should('not.be.disabled').type('hi');
    cy.get(buttonAddHead).click();

    cy.get('@circle').each((element, index, $list) => {
      if (index === 0) {
        cy.wrap(element)
          .children(headStyleSelector)
          .find("[class*='changing']")
          .should('contain.text', 'hi');
      }
    });
    cy.get('@circle').first().as('first').children(modifiedStyleSelector).should('contain.text', 'hi');
    cy.get('@first').children(defaultStyleSelector).should('contain.text', 'hi');

  });

  it('addIndex', () => {
    const valueIndex = 2;

    cy.get(inputValue).should('not.be.disabled').type('hi');
    cy.get(buttonAddTail).should('not.be.disabled').click();
    cy.get(inputValue).should('not.be.disabled').type('sun');
    cy.get(buttonAddTail).should('not.be.disabled').click();
    cy.get(inputValue).should('not.be.disabled').type('moon');
    cy.get(inputIndex).should('not.be.disabled').type(String(valueIndex));
    cy.get(buttonAddIndex).should('not.be.disabled').click();

    cy.get('@circle').children(changingStyleSelector).not("[class*='small']").as('test1').should('have.length', 1);
    cy.get('@test1').last().parent("[data-cy='circle']").children(headStyleSelector)
      .find("[class*='changing']")
      .should('contain.text', 'moon');
    cy.get('@test1').should('have.length', 2);
    cy.get('@test1').last().parent("[data-cy='circle']").children(headStyleSelector)
      .find("[class*='changing']")
      .should('contain.text', 'moon');
    cy.get('@circle').eq(valueIndex).as('testtt').children(modifiedStyleSelector).should('contain.text', 'moon');
    cy.get('@testtt').children(defaultStyleSelector).should('contain.text', 'moon');
    cy.get('@circle').children(changingStyleSelector).should('have.length', 0);
    cy.get('@circle').children(defaultStyleSelector).each((element, index, $list) => {
      if (index === 0) {
        cy.wrap(element).parent("[data-cy='circle']")
          .children(headStyleSelector)
          .should('contain.text', 'head');
      } else if (index === $list.length - 1) {
        cy.wrap(element).parent("[data-cy='circle']")
          .children(tailStyleSelector)
          .should('contain.text', 'tail');
      } else {
        cy.wrap(element).parent("[data-cy='circle']")
          .children(headStyleSelector)
          .should('not.contain.text', 'head');
        cy.wrap(element).parent("[data-cy='circle']")
          .children(tailStyleSelector)
          .should('not.contain.text', 'tail');
      }
    });
  });


  it('deleteTail', () => {
    cy.get(inputValue).should('not.be.disabled').type('moon');
    cy.get(buttonAddTail).should('not.be.disabled').click();
    cy.get(inputValue).should('not.be.disabled').type('sun');
    cy.get(buttonAddTail).should('not.be.disabled').click();
    cy.get(buttonDeleteTail).should('not.be.disabled').click();
    cy.get('@circle').children(defaultStyleSelector).last().should('not.contain.text', 'sun')
      .parent("[data-cy='circle']").children(tailStyleSelector)
      .find("[class*='changing']")
      .should('contain.text', 'sun');
    cy.get('@circle').children(defaultStyleSelector).last().should('contain.text', 'moon');
    cy.get('@circle').children(defaultStyleSelector).last().parent("[data-cy='circle']").children(tailStyleSelector).should('contain.text', 'tail');
  });

  it('deleteHead', () => {
    cy.get(inputValue).should('not.be.disabled').type('moon');
    cy.get(buttonAddHead).should('not.be.disabled').click();
    cy.get(inputValue).should('not.be.disabled').type('sun');
    cy.get(buttonAddHead).should('not.be.disabled').click();
    cy.get(buttonDeleteHead).should('not.be.disabled').click();
    cy.get('@circle').children(defaultStyleSelector).first().should('not.contain.text', 'sun')
      .parent("[data-cy='circle']").children(tailStyleSelector)
      .find("[class*='changing']")
      .should('contain.text', 'sun');
    cy.get('@circle').children(defaultStyleSelector).first().should('contain.text', 'moon');
    cy.get('@circle').children(defaultStyleSelector).first().parent("[data-cy='circle']").children(headStyleSelector).should('contain.text', 'head');
  });


  it('deleteIndex', () => {
    const valueIndex = 2;
    cy.get(inputValue).should('not.be.disabled').type('test');
    cy.get(buttonAddHead).should('not.be.disabled').click();
    cy.get(inputValue).should('not.be.disabled').type('hi');
    cy.get(buttonAddHead).should('not.be.disabled').click();
    cy.get(inputValue).should('not.be.disabled').type('sun');
    cy.get(buttonAddHead).should('not.be.disabled').click();
    cy.get(inputValue).should('not.be.disabled').type('moon');
    cy.get(buttonAddHead).should('not.be.disabled').click();
    cy.get(inputIndex).should('not.be.disabled').type(String(valueIndex));
    cy.get(buttonDeleteIndex).should('not.be.disabled').click();

    cy.get('@circle').children(changingStyleSelector).not("[class*='small']").as('test1').should('have.length', 1);
    cy.get('@test1').should('have.length', 2);
    cy.get('@circle').children(defaultStyleSelector).first().parent("[data-cy='circle']").children(tailStyleSelector)
      .find("[class*='changing']")
      .should('contain.text', 'hi');

    cy.get('@circle').eq(valueIndex).as('testtt').should('contain.text', 'test');
    cy.get('@testtt').children(defaultStyleSelector).should('contain.text', 'test');
    cy.get('@circle').children(changingStyleSelector).should('have.length', 0);
    cy.get('@circle').children(defaultStyleSelector).each((element, index, $list) => {
      if (index === 0) {
        cy.wrap(element).parent("[data-cy='circle']")
          .children(headStyleSelector)
          .should('contain.text', 'head');
      } else if (index === $list.length - 1) {
        cy.wrap(element).parent("[data-cy='circle']")
          .children(tailStyleSelector)
          .should('contain.text', 'tail');
      } else {
        cy.wrap(element).parent("[data-cy='circle']")
          .children(headStyleSelector)
          .should('not.contain.text', 'head');
        cy.wrap(element).parent("[data-cy='circle']")
          .children(tailStyleSelector)
          .should('not.contain.text', 'tail');
      }
    });
  });
});