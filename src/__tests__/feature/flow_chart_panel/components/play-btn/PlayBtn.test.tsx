import { render, fireEvent, screen } from "@testing-library/react";
import PlayBtn from "@src/feature/flow_chart_panel/components/play-btn/PlayBtn";

const theme = "light";

describe("PlayBtn component", () => {
  it("renders correctly with default props", () => {
    render(<PlayBtn theme={theme} />);
    const playBtn = screen.getByRole("button");
    expect(playBtn).toBeInTheDocument();
    expect(playBtn).toHaveClass("btn__play", theme);
    expect(playBtn).not.toBeDisabled();
    expect(playBtn).toHaveAttribute("title", "Run Script");
    expect(playBtn).toMatchSnapshot();
  });

  it("calls onClick function when clicked", () => {
    const handleClick = jest.fn();
    render(<PlayBtn theme={theme} onClick={handleClick} />);
    const playBtn = screen.getByRole("button");
    fireEvent.click(playBtn);
    expect(handleClick).toHaveBeenCalled();
  });

  it("adds animation class on click", () => {
    render(<PlayBtn theme={theme} />);
    const playBtn = screen.getByRole("button");
    fireEvent.click(playBtn);
    expect(playBtn).toHaveClass("animate");
  });

  it("removes animation class after 1 second", async () => {
    jest.useFakeTimers();
    render(<PlayBtn theme={theme} />);
    const playBtn = screen.getByRole("button");
    fireEvent.click(playBtn);
    expect(playBtn).toHaveClass("animate");
    jest.advanceTimersByTime(1000);
    expect(playBtn).not.toHaveClass("animate");
  });

  it("disables button when 'disabled' prop is true", () => {
    render(<PlayBtn theme={theme} disabled={true} />);
    const playBtn = screen.getByRole("button");
    expect(playBtn).toBeDisabled();
    expect(playBtn).toHaveAttribute("title", "Server is offline");
  });
});
