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
  div {
    border-color: ${({ theme }) => theme.text};
  }
  details {
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
    border-bottom: 0.5px solid ${({ theme }) => theme.text};
  }  
  .react-tabs__tab-list {
    border-bottom: 0.5px solid ${({ theme }) => theme.text};
  }
  .App-controls-panel {
    background-color: ${({ theme }) => theme.body};
  }
  .ctrl-outputs-canvas {
    /* Graph paper pattern */
    background-image: 
    -webkit-linear-gradient(0deg, transparent .05em, rgba(0,0,0,.05) .05em, rgba(0,0,0,.05) .125000em, transparent .125000em),
    -webkit-linear-gradient(rgba(0,0,0,.05) .062500em, transparent .062500em); 
  }
  .ReactModal__Content {
    background: ${({ theme }) => theme.body} !important;
  }
  .ReactModal__Overlay {
    background: ${({ theme }) => theme.overlay} !important;
  }
  .ctrl-output, .ctrl-input {
    background: ${({ theme }) => theme.body} !important;
  }
  .react-tabs__tab--selected {
    border-bottom: 5px solid ${({ theme }) => theme.underline};
  }
`;