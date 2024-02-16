import React from 'react';
import {Button} from './button';
import {fireEvent, render, screen} from "@testing-library/react";
const TestRenderer = require('react-test-renderer');

describe('test Button component', () => {

  it('should render an active button with text', () => {
    const id: string = "ActiveButtonWithText";
    const tree = TestRenderer
      .create(<Button
        data-testid={id}
        text={id}
        disabled={false}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render an active button without text', () => {
    const id = "ActiveButtonWithoutText";
    const tree = TestRenderer
      .create(<Button
        data-testid={id}
        disabled={false}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a button with a loading indicator', () => {
    const id = "ButtonWithLoadingIndicator";
    const tree = TestRenderer
      .create(<Button
        data-testid={id}
        text={id}
        isLoader={true}/>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should render a disabled button with text', () => {
    const id = "DisabledButton";
    const tree = TestRenderer
      .create(<Button
        data-testid={id}
        text={id}
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
