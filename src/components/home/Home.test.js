import React from "react";
import { render, screen } from '@testing-library/react';
import Home from './Home'

jest.mock('lottie-react', () => ({
  Lottie: jest.fn(() => null),
}));

describe("Home component", () => {
  test('Renders Correctly', () => {
    render(<Home isLoading={true} />);
    // const heading = screen.queryByText(/Pay/i);
    // expect(heading).toBeInTheDocument();
  });
});
