import { render } from "@testing-library/react";
import PreJobOperationShow from "@src/feature/common/PreJobOperationShow";

jest.mock("@mantine/core", () => ({
  __esModule: true,
  default: jest.fn(({ children }) => <div>{children}</div>),
  Modal: jest.fn(({ children }) => <div>{children}</div>),
  useMantineTheme: jest.fn(() => ({
    colors: {
      dark: [, , , , , , , , , "#000"],
      gray: ["gray", , ,],
      red: [, , , , , , , , "red"],
    },
  })),
}));

describe("PreJobOperationShow", () => {
  it("should render correctly", () => {
    const outputs = ["Rendered this text!"];
    const { container, getByText } = render(
      <PreJobOperationShow opened={true} close={jest.fn} outputs={outputs} />
    );
    const elem = getByText(outputs[0]);
    expect(elem).toBeInTheDocument();
    expect(container).toMatchSnapshot();
  });
});
