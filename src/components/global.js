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
    text-align: center;
    border-bottom: 1px solid;
    margin-bottom: 40px;
    color: ${({ theme }) => theme.text};
  }
  summary {
    text-align: left;
    color: ${({ theme }) => theme.text};
  }
  .Results {
    background: ${({ theme }) => theme.body};
  }
  .Results h1 {
    color: ${({ theme }) => theme.text};
  }
`;