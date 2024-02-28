import React from 'react';
import {Circle} from "./circle";
import {ElementStates} from "../../../types/element-states";

const TestRenderer = require('react-test-renderer');

describe('test Circle component', () => {

  const text: string = "text";
  const head: string = "head";
  const tail: string = "tail";
  const index: number = 33;
  const defState: ElementStates = ElementStates.Default;
  const changState: ElementStates = ElementStates.Changing;
  const modState: ElementStates = ElementStates.Modified;


  it('should render a circle without letter', () => {
    const tree = TestRenderer
      .create(<Circle/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle with letter', () => {
    const tree = TestRenderer
      .create(<Circle
        letter={text}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle with a text header', () => {

    const tree = TestRenderer
      .create(<Circle
        letter={text}
        head={head}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle with a circle header', () => {

    const tree = TestRenderer
      .create(<Circle
        letter={text}
        head={<Circle letter={head} isSmall={true} state={ElementStates.Changing}/>}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle with a text tail', () => {

    const tree = TestRenderer
      .create(<Circle
        letter={text}
        tail={tail}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle with a circle tail', () => {

    const tree = TestRenderer
      .create(<Circle
        letter={text}
        head={<Circle letter={tail} isSmall={true} state={changState}/>}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle with index', () => {

    const tree = TestRenderer
      .create(<Circle
        letter={text}
        index={index}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a small circle', () => {

    const tree = TestRenderer
      .create(<Circle
        letter={text}
        isSmall={true}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle in default state', () => {
    const tree = TestRenderer
      .create(<Circle
        letter={text}
        state={defState}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle in changing state', () => {
    const tree = TestRenderer
      .create(<Circle
        letter={text}
        state={changState}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle in modified state', () => {
    const tree = TestRenderer
      .create(<Circle
        letter={text}
        state={modState}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});