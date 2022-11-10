import { render, screen } from "@testing-library/react";
import ResultsTab from './ResultsTabView'

describe('ResultsTab', () => {
  it('should render the result flow chart', () => {
    render(<ResultsTab
      results={{}}
    />);

    const resultFlowChart = screen.getByTestId(/results-flow/i);
    expect(resultFlowChart).toBeInTheDocument();
  })
});