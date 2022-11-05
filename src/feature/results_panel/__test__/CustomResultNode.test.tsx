import { render, screen } from "@testing-library/react";
import CustomResultNode from '../CustomResultNode'
import { ReactFlowProvider } from "react-flow-renderer";

describe('CustomResultNode', () => {
  const ReactFlowProviderAny: any = ReactFlowProvider;

  it('should render a result node', () => {
    render(
      <ReactFlowProviderAny>
        <CustomResultNode 
          data={{}}
        />
      </ReactFlowProviderAny>
    );

    const resultNode = screen.getByTestId('result-node');
    expect(resultNode).toBeInTheDocument();

    const resultNodeHandleLeft = screen.getByTestId('result-node-handle-left');
    expect(resultNodeHandleLeft).toBeInTheDocument();

    const resultNodeHandleRight = screen.getByTestId('result-node-handle-right');
    expect(resultNodeHandleRight).toBeInTheDocument();
  })
});