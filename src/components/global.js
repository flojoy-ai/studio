import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::after,
  *::before {
    box-sizing: border-box;
  }
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
  a {
    color: ${({ theme }) => theme.text};
  }
  details {
    text-align: left;
    font-family: monospace;
    font-size: 18px;
    border-bottom: 1px solid;
    margin-bottom: 40px;
  }
`;