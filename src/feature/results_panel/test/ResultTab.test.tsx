import { render, screen } from "@testing-library/react";
import ResultsTab from '../ResultsTab'

describe('Render result flow chart',()=>{
  it('Result flow chart should be rendered.',()=>{
  render(<ResultsTab 
          results={{}}
          theme='dark'
        />);
  const resultFlowChart = screen.getByTestId(/results-flow/i);
  expect(resultFlowChart).toBeInTheDocument();
  })
});