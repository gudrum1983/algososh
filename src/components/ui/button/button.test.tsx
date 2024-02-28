import React from 'react';
import {Button} from './button';
import {fireEvent, render, screen} from "@testing-library/react";
const TestRenderer = require('react-test-renderer');

describe('test Button component', () => {

  const text: string = "text";

  it('should render an active button with text', () => {
    const tree = TestRenderer
      .create(<Button
        text={text}
        disabled={false}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render an active button without text', () => {
    const tree = TestRenderer
      .create(<Button
        disabled={false}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a button with a loading indicator', () => {
    const tree = TestRenderer
      .create(<Button
        text={text}
        isLoader={true}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a disabled button with text', () => {
    const tree = TestRenderer
      .create(<Button
        text={text}
        disabled={true}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

describe('test callback Button component', () => {
  it('should invoke onClick button', () => {
    const id = "onClickActiveButton";
    const mockFn = jest.fn();
    render(<Button
      data-testid={id}
      onClick={mockFn}/>);
    const button = screen.getByTestId(id);
    fireEvent.click(button);
    expect(mockFn).toHaveBeenCalledTimes(1);
  });

  it('should dont invoke onClick button with a loading indicator', () => {
    const id = "onClickButtonWithLoadingIndicator";
    const mockFn = jest.fn();
    render(<Button
      data-testid={id}
      onClick={mockFn}
      isLoader={true}/>);
    const button = screen.getByTestId(id);
    fireEvent.click(button);
    expect(mockFn).toHaveBeenCalledTimes(0);
  });

  it('should dont invoke onClick button disabled', () => {
    const id = "onClickButtonWithDisabled";
    const mockFn = jest.fn();
    render(<Button
      data-testid={id}
      onClick={mockFn}
      disabled={true}/>);
    const button = screen.getByTestId(id);
    fireEvent.click(button);
    expect(mockFn).toHaveBeenCalledTimes(0);
  });
});
