import { render, screen } from "@testing-library/react";
import ResultsTab from '../ResultsTab'

describe('ResultsTab', () => {
  it('should render the result flow chart', () => {
    render(<ResultsTab
      results={{}}
      theme='dark'
    />);

    const resultFlowChart = screen.getByTestId(/results-flow/i);
    expect(resultFlowChart).toBeInTheDocument();
  })
});