import { render, screen } from "@testing-library/react";
import ControlsTab from '../ControlsTab'

describe('ControlsTab', () => {
  it('should render the controls tab', () => {
    render(<ControlsTab 
      results={{}}
      theme = 'dark'
      setOpenCtrlModal={{}}
      openCtrlModal={false}
    />);

    const controlTab = screen.getByTestId(/controls-tab/i);
    expect(controlTab).toBeInTheDocument();
  })
});