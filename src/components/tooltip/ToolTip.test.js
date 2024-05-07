import React from "react";
import { render, screen } from '@testing-library/react';
import ToolTip from './ToolTip';

describe('ToolTip component', () => {
  test('Does not render tooltip when tooltipView is false', () => {
    render(<ToolTip tooltipView={false} date="01-01-2024" transactionsCount={5} />);
    const tooltip = screen.queryByText(/transactions on/i);
    expect(tooltip).not.toBeInTheDocument();
  });

  test('Does not render tooltip when date is empty', () => {
    render(<ToolTip tooltipView={true} date="" transactionsCount={5} />);
    const tooltip = screen.queryByText(/transactions on/i);
    expect(tooltip).not.toBeInTheDocument();
  });

  test('Renders correct text for zero transactions count', () => {
    render(<ToolTip tooltipView={true} date="01-01-2024" transactionsCount={0} />);
    const tooltip = screen.getByText(/No transactions on/i);
    expect(tooltip).toBeInTheDocument();
  });

  test('Renders correct text for transactions count greater than zero', () => {
    render(<ToolTip tooltipView={true} date="01-01-2024" transactionsCount={5} />);
    const tooltip = screen.getByText(/5 transactions on/i);
    expect(tooltip).toBeInTheDocument();
  });

  test('Formats date correctly', () => {
    render(<ToolTip tooltipView={true} date="01-01-2024" transactionsCount={5} />);
    const tooltip = screen.getByText(/January 1, 2024/i);
    expect(tooltip).toBeInTheDocument();
  });
});
