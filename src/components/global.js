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
  .App-results-panel {
    background: ${({ theme }) => theme.body};
  }
  .App-results-panel h1 {
    color: ${({ theme }) => theme.text};
  }
  .save__controls {
    background: ${({ theme }) => theme.body};
  }  
  .save__controls a:hover {
    border-bottom: 5px solid ${({ theme }) => theme.text};    
  }
  .react-grid-item {
    background-color: ${({ theme }) => theme.body} !important;
  }
`;