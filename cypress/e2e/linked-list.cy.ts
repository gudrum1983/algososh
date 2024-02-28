/// <reference types='cypress' />
import {
  checkActivityButtonsWithNonEmptyInput,
  checkDisabledButtonsWithEmptyInput,
  getAlias,
  getDataCy
} from '../support/commands';
import {Aliases} from '../support/@types/selectors';
import {Path} from '../../src/types/path';
import {
  changingStyleSelector, circle, circleDataCySelector, current,
  defaultStyleSelector, first,
  headStyleSelector,
  modifiedStyleSelector, smallStyleSelector,
  tailStyleSelector
} from '../support/constants';

const inputValue: Aliases = 'inputValue';
const inputIndex: Aliases = 'inputIndex';
const buttonAddTail: Aliases = 'buttonAddTail';
const buttonAddHead: Aliases = 'buttonAddHead';
const buttonDeleteTail: Aliases = 'buttonDeleteTail';
const buttonDeleteHead: Aliases = 'buttonDeleteHead';
const buttonAddIndex: Aliases = 'buttonAddIndex';
const buttonDeleteIndex: Aliases = 'buttonDeleteIndex';
const last: Aliases = 'last';

function checkDefaultList(circleAlias: Aliases) {
  getAlias(circleAlias).should('not.have.length', 0).each(($el, index) => {
    cy.wrap($el).children(defaultStyleSelector).should('contain.text', '');
  });
  getAlias(circleAlias).first().children(headStyleSelector).should('contain.text', 'head');
  getAlias(circleAlias).last().children(tailStyleSelector).should('contain.text', 'tail');
}

describe('Testing string reversal algorithm page', function () {
  beforeEach(function () {
    cy.visit(Path.list);
    getDataCy('fieldset-value').within(() => {
      getDataCy('input-value').as(inputValue).clear();
      getDataCy('button-add-tail').as(buttonAddTail);
      getDataCy('button-add-head').as(buttonAddHead);
      getDataCy('button-delete-tail').as(buttonDeleteTail);
      getDataCy('button-delete-head').as(buttonDeleteHead);
    });
    getDataCy('fieldset-index').within(() => {
      getDataCy('input-index').as(inputIndex).clear();
      getDataCy('button-add-by-index').as(buttonAddIndex);
      getDataCy('button-delete-by-index').as(buttonDeleteIndex);
    });
    getDataCy('circle').as(circle);
  });

  it('Submit button disabled with empty input', () => {
    checkDisabledButtonsWithEmptyInput([buttonAddTail, buttonAddHead, buttonAddIndex], inputValue);
    checkDisabledButtonsWithEmptyInput([buttonAddIndex, buttonDeleteIndex], inputIndex);
  });

  it('Submit button activity with filled value input', () => {
    checkActivityButtonsWithNonEmptyInput([buttonAddHead, buttonAddTail, buttonAddIndex], inputValue, 'Hi');
  });

  it('Submit button activity with filled index input', () => {
    getAlias(inputValue).should('not.be.disabled').type('Hi');
    getAlias(buttonAddTail).click();
    getAlias(inputValue).should('not.be.disabled').type('dear');
    checkActivityButtonsWithNonEmptyInput([buttonAddIndex, buttonDeleteIndex], inputIndex, '1');
  });

  it('Correct default list', () => {
    checkDefaultList(circle);
  });


  it('Correct animation of adding to the tail of the list', () => {

    getAlias(inputValue).should('not.be.disabled').type('hi');
    getAlias(buttonAddTail).click();

    getAlias(circle).each((element, index, $list) => {
      if (index === ($list.length - 2)) {
        cy.wrap(element)
          .children(headStyleSelector)
          .find(changingStyleSelector)
          .should('contain.text', 'hi');
      }
    });
    getAlias(circle).last().as(last).children(modifiedStyleSelector).should('contain.text', 'hi');
    getAlias(last).children(defaultStyleSelector).should('contain.text', 'hi');

  });

  it('Correct animation of adding to the head of the list', () => {

    getAlias(inputValue).should('not.be.disabled').type('hi');
    getAlias(buttonAddHead).click();

    getAlias(circle).each((element, index) => {
      if (index === 0) {
        cy.wrap(element)
          .children(headStyleSelector)
          .find(changingStyleSelector)
          .should('contain.text', 'hi');
      }
    });
    getAlias(circle).first().as(first).children(modifiedStyleSelector).should('contain.text', 'hi');
    getAlias(first).children(defaultStyleSelector).should('contain.text', 'hi');

  });

  it('Correct animation of adding by index of the list', () => {
    const valueIndex = 2;

    getAlias(inputValue).should('not.be.disabled').type('hi');
    getAlias(buttonAddTail).should('not.be.disabled').click();
    getAlias(inputValue).should('not.be.disabled').type('sun');
    getAlias(buttonAddTail).should('not.be.disabled').click();
    getAlias(inputValue).should('not.be.disabled').type('moon');
    getAlias(inputIndex).should('not.be.disabled').type(String(valueIndex));
    getAlias(buttonAddIndex).should('not.be.disabled').click();

    getAlias(circle).children(changingStyleSelector).not(smallStyleSelector).as(current).should('have.length', 1);
    getAlias(current).last().parent(circleDataCySelector).children(headStyleSelector)
      .find(changingStyleSelector)
      .should('contain.text', 'moon');
    getAlias(current).should('have.length', 2);
    getAlias(current).last().parent(circleDataCySelector).children(headStyleSelector)
      .find(changingStyleSelector)
      .should('contain.text', 'moon');
    getAlias(circle).eq(valueIndex).as(current).children(modifiedStyleSelector).should('contain.text', 'moon');
    getAlias(current).children(defaultStyleSelector).should('contain.text', 'moon');
    getAlias(circle).children(changingStyleSelector).should('have.length', 0);
    checkDefaultList(circle)
  });


  it('Correct animation of removing tail from the list', () => {
    getAlias(inputValue).should('not.be.disabled').type('moon');
    getAlias(buttonAddTail).should('not.be.disabled').click();
    getAlias(inputValue).should('not.be.disabled').type('sun');
    getAlias(buttonAddTail).should('not.be.disabled').click();
    getAlias(buttonDeleteTail).should('not.be.disabled').click();
    getAlias(circle).children(defaultStyleSelector).last().should('not.contain.text', 'sun')
      .parent(circleDataCySelector).children(tailStyleSelector)
      .find(changingStyleSelector)
      .should('contain.text', 'sun');
    getAlias(circle).children(defaultStyleSelector).last().should('contain.text', 'moon');
    getAlias(circle).children(defaultStyleSelector).last().parent(circleDataCySelector).children(tailStyleSelector).should('contain.text', 'tail');
    checkDefaultList(circle)

  });

  it('Correct animation of removing head from the list', () => {
    getAlias(inputValue).should('not.be.disabled').type('moon');
    getAlias(buttonAddHead).should('not.be.disabled').click();
    getAlias(inputValue).should('not.be.disabled').type('sun');
    getAlias(buttonAddHead).should('not.be.disabled').click();
    getAlias(buttonDeleteHead).should('not.be.disabled').click();
    getAlias(circle).children(defaultStyleSelector).first().should('not.contain.text', 'sun')
      .parent(circleDataCySelector).children(tailStyleSelector)
      .find(changingStyleSelector)
      .should('contain.text', 'sun');
    getAlias(circle).children(defaultStyleSelector).first().should('contain.text', 'moon');
    getAlias(circle).children(defaultStyleSelector).first().parent(circleDataCySelector).children(headStyleSelector).should('contain.text', 'head');
    checkDefaultList(circle)
  });


  it('Correct animation of removing by index of the list', () => {
    const valueIndex = 2;
    getAlias(inputValue).should('not.be.disabled').type('test');
    getAlias(buttonAddHead).should('not.be.disabled').click();
    getAlias(inputValue).should('not.be.disabled').type('hi');
    getAlias(buttonAddHead).should('not.be.disabled').click();
    getAlias(inputValue).should('not.be.disabled').type('sun');
    getAlias(buttonAddHead).should('not.be.disabled').click();
    getAlias(inputValue).should('not.be.disabled').type('moon');
    getAlias(buttonAddHead).should('not.be.disabled').click();
    getAlias(inputIndex).should('not.be.disabled').type(String(valueIndex));
    getAlias(buttonDeleteIndex).should('not.be.disabled').click();
    getAlias(circle).children(changingStyleSelector).not(smallStyleSelector).as(current).should('have.length', 1);
    getAlias(current).should('have.length', 2);
    getAlias(circle).children(defaultStyleSelector).first().parent(circleDataCySelector).children(tailStyleSelector)
      .find(changingStyleSelector)
      .should('contain.text', 'hi');
    getAlias(circle).eq(valueIndex).as(current).should('contain.text', 'test');
    getAlias(current).children(defaultStyleSelector).should('contain.text', 'test');
    getAlias(circle).children(changingStyleSelector).should('have.length', 0);
    checkDefaultList(circle)
  });

});