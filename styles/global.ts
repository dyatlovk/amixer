import { createGlobalStyle } from 'styled-components'

export const GlobalStyles = createGlobalStyle`
  body {
    font: 400 10px/1.5em "JetBrains Mono", sans-serif;
    color: ${({ theme }) => theme.text};
    user-select: none;
  }

  svg {
    line-height: 1;
  }
`
