// themes.js
import { createGlobalStyle } from 'styled-components';
import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

export const themes = {
    light: lightTheme,
    dark: darkTheme,
};

export const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: 'Roboto', sans-serif;
    background-color: ${(props) => props.theme.bodyBackground};
    color: ${(props) => props.theme.textColor};
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  .container {
    background-color: ${(props) => props.theme.containerBackground};
    color: ${(props) => props.theme.textColor};
    padding: 50px;
    border-radius: 15px;
    box-shadow: 0px 8px 20px rgba(0, 0, 0, 0.2);
    width: 90%;
    max-width: 600px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  h1 {
    font-family: 'Georgia', serif;
    font-size: 32px;
    color: #e6e9f0;
  }

  h2 {
    font-size: 28px;
    color: ${(props) => props.theme.subtitleColor};
    margin-bottom: 15px;
    font-weight: 500;
  }

  .subtitle {
    font-size: 20px;
    margin-bottom: 30px;
    color: #f0f0f0;
  }

  .input-container input {
    width: 100%;
    padding: 12px;
    margin: 12px 0;
    border: none;
    border-radius: 8px;
    background-color: ${(props) => props.theme.inputBackground};
    font-size: 16px;
    color: ${(props) => props.theme.inputColor};
  }

  .button {
    background-color: ${(props) => props.theme.buttonBackground};
    color: ${(props) => props.theme.inputColor};
    border: none;
    border-radius: 20px;
    padding: 15px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    width: 100%;
    margin: 10px 0;
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease;
  }

  .button:hover {
    background-color: ${(props) => props.theme.buttonHoverBackground};
    transform: translateY(-3px);
  }

  .product-card {
    background-color: ${(props) => props.theme.productCardBackground};
    padding: 25px;
    border-radius: 15px;
    border: 2px solid ${(props) => props.theme.productCardBorder};
    box-shadow: ${(props) => props.theme.productCardHoverShadow};
    text-align: left;
    transition: transform 0.3s, box-shadow 0.3s;
  }

  .product-card:hover {
    transform: ${(props) => props.theme.productCardHoverTransform};
    box-shadow: 0px 12px 25px rgba(0, 0, 0, 0.6);
  }

  .product-card h3 {
    font-family: 'Audiowide', sans-serif;
    color: ${(props) => props.theme.buttonBackground};
    font-size: 24px;
    margin-bottom: 8px;
  }

  .product-card p {
    color: ${(props) => props.theme.productCardTextColor};
    font-size: 16px;
  }

  p button {
    background: none;
    border: none;
    color: ${(props) => props.theme.buttonBackground};
    cursor: pointer;
    text-decoration: underline;
    font-weight: bold;
    font-size: 16px;
  }

  p button:hover {
    color: ${(props) => props.theme.buttonHoverBackground};
  }

  .back-button,
  .button-container button:last-child {
    background-color: ${(props) => props.theme.buttonBackground};
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 15px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    margin-top: 10px;
  }

  .back-button:hover,
  .button-container button:last-child:hover {
    background-color: ${(props) => props.theme.buttonHoverBackground};
  }
`;
