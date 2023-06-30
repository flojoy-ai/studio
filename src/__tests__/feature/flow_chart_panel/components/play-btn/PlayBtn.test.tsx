import { fireEvent, screen } from "@testing-library/react";
import PlayBtn from "@src/feature/flow_chart_panel/components/play-btn/PlayBtn";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";

describe("PlayBtn component", () => {
  it("renders correctly with default props", () => {
    renderWithTheme(<PlayBtn onPlay={jest.fn()} />);
    const playBtn = screen.getByRole("button");
    expect(playBtn).toBeInTheDocument();
    expect(playBtn).not.toBeDisabled();
    expect(playBtn).toHaveAttribute("title", "Run Script");
    expect(playBtn).toMatchSnapshot();
  });

  it("calls onClick function when clicked", () => {
    const handleClick = jest.fn();
    renderWithTheme(<PlayBtn onPlay={handleClick} />);
    const playBtn = screen.getByRole("button");
    fireEvent.click(playBtn);
    expect(handleClick).toHaveBeenCalled();
  });

  it("adds animation class on click", () => {
    renderWithTheme(<PlayBtn onPlay={jest.fn()} />);
    const playBtn = screen.getByRole("button");
    fireEvent.click(playBtn);
    expect(playBtn).toHaveClass("animate");
  });

  it("removes animation class after 1 second", async () => {
    jest.useFakeTimers();
    renderWithTheme(<PlayBtn onPlay={jest.fn()} />);
    const playBtn = screen.getByRole("button");
    fireEvent.click(playBtn);
    expect(playBtn).toHaveClass("animate");
    jest.advanceTimersByTime(1000);
    expect(playBtn).not.toHaveClass("animate");
  });

  it("disables button when 'disabled' prop is true", () => {
    renderWithTheme(<PlayBtn onPlay={jest.fn()} disabled={true} />);
    const playBtn = screen.getByRole("button");
    expect(playBtn).toBeDisabled();
    expect(playBtn).toHaveAttribute("title", "Server is offline");
  });
});
