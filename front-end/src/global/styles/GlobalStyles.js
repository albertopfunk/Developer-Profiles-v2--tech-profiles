import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  /* Document
  * ========================================================================== */

  /**
  * 1. Add border box sizing in all browsers (opinionated).
  * 2. Backgrounds do not repeat by default (opinionated).
  */

  *,
  ::before,
  ::after {
    box-sizing: border-box; /* 1 */
    background-repeat: no-repeat; /* 2 */
  }

  /**
  * 1. Add text decoration inheritance in all browsers (opinionated).
  * 2. Add vertical alignment inheritance in all browsers (opinionated).
  */

  ::before,
  ::after {
    text-decoration: inherit; /* 1 */
    vertical-align: inherit; /* 2 */
  }

  /**
  * 1. Use the default cursor in all browsers (opinionated).
  * 2. Change the line height in all browsers (opinionated).
  * 3. Use a 4-space tab width in all browsers (opinionated).
  * 4. Remove the grey highlight on links in iOS (opinionated).
  * 5. Prevent adjustments of font size after orientation changes in
  *    IE on Windows Phone and in iOS.
  * 6. Breaks words to prevent overflow in all browsers (opinionated).
  */

  html {
    cursor: default; /* 1 */
    line-height: 1.5; /* 2 */
    -moz-tab-size: 4; /* 3 */
    tab-size: 4; /* 3 */
    -webkit-tap-highlight-color: transparent /* 4 */;
    -ms-text-size-adjust: 100%; /* 5 */
    -webkit-text-size-adjust: 100%; /* 5 */
    word-break: break-word; /* 6 */
    font-family: Arial, Helvetica, sans-serif;
  }

  /* Sections
  * ========================================================================== */

  /**
  * Remove the margin in all browsers (opinionated).
  */

  body {
    margin: 0;
  }
  
  /**
  * Remove all margin/padding on headers
  */

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
    font-family: Georgia, 'Times New Roman', Times, serif;
  }

  /**
  * Remove all margin/padding on text
  */
  p {
    margin: 0;
    padding: 0;
  }

  /* Grouping content
  * ========================================================================== */

  /**
  * Remove all margin/padding on lists
  * as well as default list styles
  */

  ul, ol, li, dl, dd, dt {
    margin: 0;
    padding: 0;
  }

  ul, ol {
    list-style: none;
  }

  /**
  * 1. Correct the inheritance of border color in Firefox.
  * 2. Add the correct box sizing in Firefox.
  * 3. Show the overflow in Edge 18- and IE.
  */

  hr {
    color: inherit; /* 1 */
    height: 0; /* 2 */
    overflow: visible; /* 3 */
  }

  /**
  * 1. Correct the inheritance and scaling of font size in all browsers.
  * 2. Correct the odd em font sizing in all browsers.
  * 3. Prevent overflow of the container in all browsers (opinionated).
  */

  pre {
    font-family: monospace, monospace; /* 1 */
    font-size: 1em; /* 2 */
    overflow: auto; /* 3 */
    -ms-overflow-style: scrollbar; /* 3 */
  }

  /* Text-level semantics
  * ========================================================================== */

  /**
  * Add the correct text decoration in Edge 18-, IE, and Safari.
  */

  abbr[title] {
    text-decoration: underline;
    text-decoration: underline dotted;
  }

  /**
  * bolder font weight for titles/important text
  */

  b,
  strong,
  dt,
  legend {
    font-size: .9rem;
    font-weight: bolder;
  }

  /**
  * 1. Correct the inheritance and scaling of font size in all browsers.
  * 2. Correct the odd em font sizing in all browsers.
  */

  code,
  kbd,
  samp {
    font-family: monospace, monospace; /* 1 */
    font-size: 1em; /* 2 */
  }

  /**
  * Add the correct font size in all browsers.
  */

  small {
    font-size: 80%;
  }

  /* Embedded content
  * ========================================================================== */

  /*
  * Change the alignment on media elements in all browsers (opinionated).
  */

  audio,
  canvas,
  iframe,
  img,
  svg,
  video {
    vertical-align: middle;
  }

  /**
  * Add the correct display in iOS 4-7.
  */

  audio:not([controls]) {
    display: none;
    height: 0;
  }

  /**
  * Remove the border on iframes in all browsers (opinionated).
  */

  iframe {
    border-style: none;
  }

  /**
  * Change the fill color to match the text color in all browsers (opinionated).
  */

  /* svg:not([fill]) {
    fill: currentColor;
  } */


  /* Tabular data
  * ========================================================================== */

  /**
  * 1. Collapse border spacing in all browsers (opinionated).
  * 2. Correct table border color inheritance in all Chrome, Edge, and Safari.
  * 3. Remove text indentation from table contents in Chrome, Edge, and Safari.
  */

  table {
    border-collapse: collapse; /* 1 */
    border-color: inherit; /* 2 */
    text-indent: 0; /* 3 */
  }

  /* Forms
  * ========================================================================== */

  /**
  * Remove the margin and padding on controls.
  */

  button,
  input,
  select {
    margin: 0;
    padding: 0;
  }

  /**
  * 1rem default for inputs to avoid zoom on ios
  */

  input, select, textarea {
    font-size: 1rem;
  }


  /**
  * Correct the inability to style buttons in iOS and Safari.
  */

  button,
  [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: button;
  }

  /**
  * 1. resetting fieldset
  */

  fieldset {
    border: none;
    margin: 0;
    padding: 0;
  }

  /**
  * Remove the inheritance of text transform in Firefox.
  */

  select {
    text-transform: none;
  }

  /**
  * 1. Remove the margin in Firefox and Safari.
  * 2. Remove the default vertical scrollbar in IE.
  * 3. Change the resize direction in all browsers (opinionated).
  */

  textarea {
    margin: 0; /* 1 */
    overflow: auto; /* 2 */
    resize: vertical; /* 3 */
    resize: block; /* 3 */
  }

  /**
  * 1. Correct the odd appearance in Chrome, Edge, and Safari.
  * 2. Correct the outline style in Safari.
  */

  [type="search"] {
    -webkit-appearance: textfield; /* 1 */
    outline-offset: -2px; /* 2 */
  }

  /**
  * Correct the cursor style of increment and decrement buttons in Safari.
  */

  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    height: auto;
  }

  /**
  * Correct the text style of placeholders in Chrome, Edge, and Safari.
  */

  ::-webkit-input-placeholder {
    color: inherit;
    opacity: 0.54;
  }

  /**
  * Remove the inner padding in Chrome, Edge, and Safari on macOS.
  */

  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  /**
  * 1. Correct the inability to style upload buttons in iOS and Safari.
  * 2. Change font properties to inherit in Safari.
  */

  ::-webkit-file-upload-button {
    -webkit-appearance: button; /* 1 */
    font: inherit; /* 2 */
  }

  /**
  * Remove the inner border and padding of focus outlines in Firefox.
  */

  ::-moz-focus-inner {
    border-style: none;
    padding: 0;
  }

  /**
  * Restore the focus outline styles unset by the previous rule in Firefox.
  */

  :-moz-focusring {
    outline: 1px dotted ButtonText;
  }

  /**
  * Remove the additional :invalid styles in Firefox.
  */

  :-moz-ui-invalid {
    box-shadow: none;
  }

  /* Interactive
  * ========================================================================== */

  /*
  * Add the correct styles in Edge 18-, IE, and Safari.
  */

  dialog {
    background-color: white;
    border: solid;
    color: black;
    display: block;
    height: -moz-fit-content;
    height: -webkit-fit-content;
    height: fit-content;
    left: 0;
    margin: auto;
    padding: 1em;
    position: absolute;
    right: 0;
    width: -moz-fit-content;
    width: -webkit-fit-content;
    width: fit-content;
  }

  dialog:not([open]) {
    display: none;
  }

  /*
  * Add the correct display in all browsers.
  */

  summary {
    display: list-item;
  }

  /* User interaction
  * ========================================================================== */

  /*
  * Remove the tapping delay in IE 10.
  */

  a,
  area,
  button,
  input,
  label,
  select,
  summary,
  textarea,
  [tabindex] {
    touch-action: manipulation;
    -ms-touch-action: manipulation;
  }


  /* Accessibility
  * ========================================================================== */

  /**
  * Change the cursor on busy elements in all browsers (opinionated).
  */

  [aria-busy="true"] {
    cursor: progress;
  }

  /*
  * Change the cursor on control elements in all browsers (opinionated).
  */

  [aria-controls] {
    cursor: pointer;
  }

  /*
  * Change the cursor on disabled, not-editable, or otherwise
  * inoperable elements in all browsers (opinionated).
  */

  [aria-disabled="true"],
  [disabled] {
    cursor: not-allowed;
  }

  /*
  * Change the display on visually hidden accessible elements
  * in all browsers (opinionated).
  */

  [aria-hidden="false"][hidden] {
    display: initial;
  }


  /*
  ------------------------------------------------------------------------
                General Styles
  ------------------------------------------------------------------------
  */

  :root {
    --primary_color:#001940;
    --secondary-color:#EE6C4D;

    --nav-padding: 10px 15px;
  }


  //

  h4 {
    font-size: 1rem;

    @media (min-width: 750px) {
      font-size: 1.1rem;
    }
  }

  h3 {
    font-size: 1.1rem;

    @media (min-width: 750px) {
      font-size: 1.3rem;
    }
  }

  h2 {
    font-size: 1.25rem;

    @media (min-width: 750px) {
      font-size: 1.5rem;
    }
  }

  h1 {
    font-size: 1.3rem;
    /* text-transform: uppercase; */

    @media (min-width: 750px) {
      font-size: 1.6rem;
    }
  }

  p, li, dd, label {
    font-size: .9rem;

    @media (min-width: 750px) {
      font-size: .9rem;
    }
  }

  button {
    font-size: .8rem;
    /* text-transform: uppercase; */


    @media (min-width: 750px) {
      font-size: .8rem;
    }
  }

  a {
    font-size: .8rem;
    text-decoration: none;

    @media (min-width: 750px) {
      font-size: 1rem;
    }
  }




  input[type=text],
  input[type=url],
  input[type=email],
  input[type=textarea],
  select {
    width: 100%;
    min-height: 30px;
  }

  label {
    display: block;
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

  .icon {
    fill: black;
  }

  .button {
    border: none;
    background-color: white;
    cursor: pointer;
    user-select: none;
  }

  .button-control {
    background: hsl(340deg 100% 32%);
    border-radius: 10px;
    transition: filter 50ms ease-in;
    -webkit-tap-highlight-color: transparent;
    outline-offset: 1px;

    &:focus {
      outline: 2.5px solid transparent;
    }

    &:focus .button-text {
      filter: brightness(110%);
      transition: filter 50ms ease-in;
    }

    &:focus:not(:focus-visible) .button-text {
      filter: none;
    }
    
    &:focus-visible .button-text {
      box-shadow: inset 0 0 4px 2.5px #2727ad;
      transform: translateY(-5px);
      transition: transform 75ms ease-out;
    }

    

    &:hover {
      transition: filter 50ms ease-in;
      filter: brightness(110%);
    }

    &:hover .button-text {
      transform: translateY(-5px);
      transition: transform 75ms ease-out;
    }

    &:active .button-text {
      transform: translateY(-2px);
      transition: transform ease-out;
    }


    .button-text {
      display: block;
      padding: 10px 0;
      border-radius: 10px;
      background: hsl(345deg 100% 47%);
      color: white;
      transform: translateY(-4px);
      will-change: transform;
      transition: transform 75ms ease-out;


      @media (min-width: 750px) {
      padding: 15px 0;

      }
    }
  }

  .info-group {
    width: 95%;
    max-width: 600px;

    @media (min-width: 350px) {
      width: 100%;
    }

    .flex-row {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      align-items: flex-start;
      gap: 20px;

      @media (min-width: 350px) {
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        gap: 30px;
      }

      @media (min-width: 500px) {
        gap: 50px;
      }

      .flex-col {
        flex-basis: 0;
        flex-shrink: 0;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        gap: 20px;
      }
    }
  }
`;
