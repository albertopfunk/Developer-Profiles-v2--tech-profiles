import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
    /*
  ------------------------------------------------------------------------
                      RESET
  ------------------------------------------------------------------------
  */

  /*! normalize.css v8.0.1 | MIT License | https://github.com/necolas/normalize.css | https://necolas.github.io/normalize.css/8.0.1/normalize.css */


  /* Document */
  html {
    line-height: 1.5;
    -webkit-text-size-adjust: 100%;
    /* custom */
    box-sizing: border-box;
    font-family: sans-serif;
  }
  /* custom */
  *, *:before, *:after {
    box-sizing: inherit;
    position: relative;
    transition: all 0.2s ease;
  }


  /* Sections */
  body {
    margin: 0;
  }
  main {
    display: block;
  }
  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }


  /* Grouping content */
  hr {
    box-sizing: content-box;
    height: 0;
    overflow: visible;
  }
  pre {
    font-family: monospace, monospace;
    font-size: 1em;
  }


  /* Text-level semantics */
  a {
    background-color: transparent;
  }
  abbr[title] {
    border-bottom: none;
    text-decoration: underline;
    text-decoration: underline dotted;
  }
  b,
  strong {
    font-weight: bolder;
  }
  code,
  kbd,
  samp {
    font-family: monospace, monospace;
    font-size: 1em;
  }
  small {
    font-size: 80%;
  }
  sub,
  sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
  }
  sub {
    bottom: -0.25em;
  }
  sup {
    top: -0.5em;
  }


  /* Embedded content */
  img {
    border-style: none;
  }


  /* Forms */
  button,
  input,
  optgroup,
  select,
  textarea {
    font-family: inherit;
    font-size: 100%;
    line-height: 1.5;
    margin: 0;
  }
  button,
  input {
    overflow: visible;
  }
  button,
  select {
    text-transform: none;
  }
  button,
  [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: button;
  }
  button::-moz-focus-inner,
  [type="button"]::-moz-focus-inner,
  [type="reset"]::-moz-focus-inner,
  [type="submit"]::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }
  button:-moz-focusring,
  [type="button"]:-moz-focusring,
  [type="reset"]:-moz-focusring,
  [type="submit"]:-moz-focusring {
    outline: 1px dotted ButtonText;
  }
  fieldset {
    padding: 0.35em 0.75em 0.625em;
  }
  legend {
    box-sizing: border-box;
    color: inherit;
    display: table;
    max-width: 100%;
    padding: 0;
    white-space: normal;
  }
  progress {
    vertical-align: baseline;
  }
  textarea {
    overflow: auto;
  }
  [type="checkbox"],
  [type="radio"] {
    box-sizing: border-box;
    padding: 0;
  }
  [type="number"]::-webkit-inner-spin-button,
  [type="number"]::-webkit-outer-spin-button {
    height: auto;
  }
  [type="search"] {
    -webkit-appearance: textfield;
    outline-offset: -2px;
  }
  [type="search"]::-webkit-search-decoration {
    -webkit-appearance: none;
  }
  ::-webkit-file-upload-button {
    -webkit-appearance: button;
    font: inherit;
  }


 /* Interactive */
  details {
    display: block;
  }
  summary {
    display: list-item;
  }


  /* Misc */
  template {
    display: none;
  }
  [hidden] {
    display: none;
  }



  /*
  ------------------------------------------------------------------------
                General Styles
  ------------------------------------------------------------------------
  */

  :root {
    --primary_color:#001940;
    --secondary-color:#EE6C4D;
  }

  .sr-only {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
  }

  .hidden {
    display: none;
  }
`;
