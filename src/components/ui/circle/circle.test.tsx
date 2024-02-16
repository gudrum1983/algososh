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
    const id: string = "CircleWithoutLetter";
    const tree = TestRenderer
      .create(<Circle
        data-testid={id}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle with letter', () => {
    const id: string = "CircleWithLetter";
    const tree = TestRenderer
      .create(<Circle
        data-testid={id}
        letter={text}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle with a text header', () => {
    const id: string = "CircleWithTextHead";
    const tree = TestRenderer
      .create(<Circle
        data-testid={id}
        letter={text}
        head={head}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle with a circle header', () => {
    const id: string = "CircleWithCircleHead";
    const tree = TestRenderer
      .create(<Circle
        data-testid={id}
        letter={text}
        head={<Circle letter={head} isSmall={true} state={ElementStates.Changing}/>}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle with a text tail', () => {
    const id: string = "CircleWithTextTail";
    const tree = TestRenderer
      .create(<Circle
        data-testid={id}
        letter={text}
        tail={tail}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle with a circle tail', () => {
    const id: string = "CircleWithCircleTail";
    const tree = TestRenderer
      .create(<Circle
        data-testid={id}
        letter={text}
        head={<Circle letter={tail} isSmall={true} state={changState}/>}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle with index', () => {
    const id: string = "CircleWithIndex";
    const tree = TestRenderer
      .create(<Circle
        data-testid={id}
        letter={text}
        index={index}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a small circle', () => {
    const id: string = "SmallCircle";
    const tree = TestRenderer
      .create(<Circle
        data-testid={id}
        letter={text}
        isSmall={true}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle in default state', () => {
    const id: string = "DefaultCircle";
    const tree = TestRenderer
      .create(<Circle
        data-testid={id}
        letter={text}
        state={defState}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle in changing state', () => {
    const id: string = "ChangingCircle";
    const tree = TestRenderer
      .create(<Circle
        data-testid={id}
        letter={text}
        state={changState}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a circle in modified state', () => {
    const id: string = "ModifiedCircle";
    const tree = TestRenderer
      .create(<Circle
        data-testid={id}
        letter={text}
        state={modState}
      />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});