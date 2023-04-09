import NodeReference, {NodeReferenceProps} from "@src/feature/controls_panel/views/NodeReference";
import { render, screen } from "@testing-library/react";

const testNodeReferenceProps: NodeReferenceProps = {
    theme: "light",
    updateCtrlValue:  jest.fn(),
    ctrlObj: {
        id: "plot-control",
        name: "Plot Control",
        type: "plot",
        minHeight: 10,
        minWidth: 10,
        layout: { i: "asd", x: 34, y: 34, w: 23, h: 3 },
        val: 30,
      }
} 

describe('Testing NodeREference.tsx Component', () => { 
    it("NodeREference should Render", () => {
        render(<NodeReference {...testNodeReferenceProps} />)
    })

    it("NodeREference should match tge Snapshot", () => {
        const {container} = render(<NodeReference {...testNodeReferenceProps} />)
        expect(container).toMatchSnapshot()
    })
 })