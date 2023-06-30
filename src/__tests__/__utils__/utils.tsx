import { ColorSchemeProvider, MantineProvider } from "@mantine/styles";
import { darkTheme } from "@src/feature/common/theme";
import { RenderOptions, render } from "@testing-library/react";

export function renderWithTheme(
  ui: React.ReactElement,
  options?: Omit<RenderOptions, "queries">
) {
  return render(
    <ColorSchemeProvider colorScheme="dark" toggleColorScheme={jest.fn()}>
      <MantineProvider theme={darkTheme}>{ui}</MantineProvider>,
    </ColorSchemeProvider>,
    options
  );
}
