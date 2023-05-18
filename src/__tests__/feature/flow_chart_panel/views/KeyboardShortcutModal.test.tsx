import { fireEvent, getAllByText, getByTestId } from "@testing-library/react";
import KeyboardShortcutModal from "@src/feature/flow_chart_panel/views/KeyboardShortcutModal";
import { renderWithTheme } from "@src/__tests__/__utils__/utils";

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
  beforeEach(() => {
    onCloseMock.mockClear();
  });

  it("renders correctly when isOpen is true", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <KeyboardShortcutModal isOpen={true} onClose={onCloseMock} />
    );
    const modalContent = getByTestId(testId);
    expect(modalContent).toBeInTheDocument();
    expect(getByText("Windows")).toBeInTheDocument();
    expect(getByText("MacOs")).toBeInTheDocument();
    expect(modalContent).toMatchSnapshot();
  });

  it("calls onClose when the close button is clicked", () => {
    const { getByTestId } = renderWithTheme(
      <KeyboardShortcutModal isOpen={true} onClose={onCloseMock} />
    );
    const closeButton = getByTestId("button");
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  it("renders the correct keyboard shortcuts for each platform", () => {
    const { getByTestId, getByText } = renderWithTheme(
      <KeyboardShortcutModal isOpen={true} onClose={onCloseMock} />
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
    const keyContainer = getByTestId("key_container");
    expect(keyContainer).toBeInTheDocument();
    shortcuts.forEach((shortcut) => {
      const commands = getAllByText(keyContainer, shortcut.command);
      commands.forEach((cmd) => {
        expect(cmd).toBeInTheDocument(); 
      });
      expect(getByText(shortcut.platforms["windows"])).toBeInTheDocument();
      expect(getByText(shortcut.platforms["macOs"])).toBeInTheDocument();
    });
  });
});
