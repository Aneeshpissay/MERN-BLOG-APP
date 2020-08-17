import { createGlobalStyle} from "styled-components"
export const GlobalStyles = createGlobalStyle`
  body {
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Quicksand;
    transition: all 0.50s linear;
  }
  .dark{
    background: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    font-family: Quicksand;
    transition: all 0.50s linear;
  }
  `
