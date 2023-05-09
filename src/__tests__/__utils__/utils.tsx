import { ColorSchemeProvider, MantineProvider } from "@mantine/styles";
import { darkTheme } from "@src/feature/common/theme";
import {
  Queries,
  RenderOptions,
  RenderResult,
  queries,
  render,
} from "@testing-library/react";

// export function renderWithTheme<
//   Q extends Queries = typeof queries,
//   Container extends Element | DocumentFragment = HTMLElement,
//   BaseElement extends Element | DocumentFragment = Container
// >(ui: React.ReactElement, options: RenderOptions<Q, Container, BaseElement>) {
//   return render(<MantineProvider>{ui}</MantineProvider>, options);
// }
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
