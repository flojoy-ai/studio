import { fireEvent, getAllByText, render } from "@testing-library/react";
import KeyboardShortcutModal from "@src/feature/flow_chart_panel/views/KeyboardShortcutModal";

const testId = "keyboard_shortcut_modal";
// mock ReactModal component
jest.mock("react-modal", () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({ children }) => {
      return <div data-testid={testId}>{children}</div>;
    }),
  };
});

describe("KeyboardShortcutModal", () => {
  const onCloseMock = jest.fn();
  const theme = "light";
  beforeEach(() => {
    onCloseMock.mockClear();
  });

  it("renders correctly when isOpen is true", () => {
    const { getByTestId, getByText } = render(
      <KeyboardShortcutModal
        isOpen={true}
        onClose={onCloseMock}
        theme={theme}
      />
    );
    const modalContent = getByTestId(testId);
    expect(modalContent).toBeInTheDocument();
    expect(getByText("Windows")).toBeInTheDocument();
    expect(getByText("MacOs")).toBeInTheDocument();
    expect(modalContent).toMatchSnapshot();
  });

  it("calls onClose when the close button is clicked", () => {
    const { getByRole } = render(
      <KeyboardShortcutModal
        isOpen={true}
        onClose={onCloseMock}
        theme={theme}
      />
    );
    const closeButton = getByRole("button");
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("renders the correct keyboard shortcuts for each platform", () => {
    const { getByText, container } = render(
      <KeyboardShortcutModal
        isOpen={true}
        onClose={onCloseMock}
        theme={theme}
      />
    );
    const shortcuts = [
      {
        command: "Show/hide UI",
        platforms: {
          windows: "Ctrl \\",
          macOs: "⌘ z",
        },
      },
      {
        command: "Play",
        platforms: {
          windows: "Ctrl P",
          macOs: "⌘ P",
        },
      },
      // Add more keyboard shortcuts here
    ];
    shortcuts.forEach((shortcut) => {
      const commands = getAllByText(container, shortcut.command);
      commands.forEach((cmd) => {
        expect(cmd).toBeInTheDocument();
      });
      expect(getByText(shortcut.platforms["windows"])).toBeInTheDocument();
      expect(getByText(shortcut.platforms["macOs"])).toBeInTheDocument();
    });
  });
});
