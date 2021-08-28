import { createGlobalStyle } from "styled-components";

export const GlobalStyles = createGlobalStyle`
  
  /* Base
  * ========================================================================== */

  :root {
    --lighter-cyan-base: 171.4, 70%;
    --lighter-cyan-1: hsl(var(--lighter-cyan-base), 99%);
    --lighter-cyan-2: hsl(var(--lighter-cyan-base), 96%);
    --lighter-cyan-3: hsl(var(--lighter-cyan-base), 85%);    

    --light-cyan-base: 169.8, 74.6%;
    --light-cyan-1: hsl(var(--light-cyan-base), 97%);
    --light-cyan-2: hsl(var(--light-cyan-base), 86%);
    --light-cyan-3: hsl(var(--light-cyan-base), 75%);

    --cyan-base: 177.1, 60.7%;
    --cyan-1: hsl(var(--cyan-base), 64%);
    --cyan-2: hsl(var(--cyan-base), 53%);
    --cyan-3: hsl(var(--cyan-base), 42%);

    --dark-cyan-base: 187.2, 93.5%;
    --dark-cyan-1: hsl(var(--dark-cyan-base), 23%);
    --dark-cyan-2: hsl(var(--dark-cyan-base), 12%);
    --dark-cyan-3: hsl(var(--dark-cyan-base), 1%);

    --green-base: 156.7, 58.4%;
    --green-1: hsl(var(--green-base), 54%);
    --green-2: hsl(var(--green-base), 43%);
    --green-3: hsl(var(--green-base), 32%);

    --dark-green-base: 118.5, 38%;
    --dark-green-1: hsl(var(--dark-green-base), 52%);
    --dark-green-2: hsl(var(--dark-green-base), 41%);
    --dark-green-3: hsl(var(--dark-green-base), 30%);

    --border-sm: 1px solid var(--light-cyan-2);
    --border-md: 2px solid var(--light-cyan-2);
    --border-lg: 3px solid var(--light-cyan-2);

    --border-radius-sm: 2.5px;
    --border-radius-md: 6.25px;
    --border-radius-lg: 10px;

    --box-shadow-primary: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
        rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
    --box-shadow-focus: 0 0 0 2.5px var(--dark-cyan-3);

    --top-layer: 40;
    --header-layer: 30;
    --side-nav-layer: 20;
    --first-layer: 10;
  }

  html {
    height: -webkit-fill-available;
    cursor: default;
    box-sizing: border-box;
    background: var(--lighter-cyan-1);

    /*only break work when necessary and add hyphen*/
    overflow-wrap: anywhere;
    word-break: break-word;
    hyphens: auto;

    /*Prevent adjustments of font size Windows Phone/iOS*/
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;

    /*Remove grey highlight on links in iOS*/
    -webkit-tap-highlight-color: transparent;

    @media (prefers-reduced-motion: no-preference) {
      scroll-behavior: smooth;
    }
  }

  *,
  *::before,
  *::after {
    box-sizing: inherit;
    position: relative;
    outline-width: 2.5px;
    outline-color: var(--dark-cyan-3);
  }

  html,
  body {
    margin: 0;
    padding: 0;
  }

  body {
    min-height: 100vh;
    min-height: -webkit-fill-available;
  }

  #root, #focus-reset {
    min-height: 100vh;
  }

  [tabindex="-1"] {
    outline-width: 3px;
    outline-offset: -1;
    outline-color: var(--cyan-3);
  }

  /* Forms/controls
  * ========================================================================== */

  /*block labels to stay above inputs*/
  label {
    display: block;
  }

  /*Remove the margin and padding on controls*/
  button,
  input,
  fieldset,
  select,
  textarea {
    margin: 0;
    padding: 0;
  }

  /*1rem default for inputs to avoid zoom on ios*/
  input, select, textarea {
    font-size: 1rem;
  }

  /*Correct the inability to style buttons in iOS and Safari*/
  button,
  [type="button"],
  [type="reset"],
  [type="submit"] {
    -webkit-appearance: button;
  }

  /*Resetting fieldset*/
  fieldset {
    border: none;
  }

  /*Remove the inheritance of text transform in Firefox*/
  select {
    text-transform: none;
  }

  /*Textareas only resize vertically by default*/
  textarea {
    resize: vertical;
  }

  /*Single taps are dispatched immediately on clickable elements*/
  a,
  button,
  input,
  label,
  textarea,
  [tabindex] {
    -ms-touch-action: manipulation;
    touch-action: manipulation;
  }

  /**
  * 1. Correct the odd appearance in Chrome, Edge, and Safari.
  * 2. Correct the outline style in Safari.
  */
  [type="search"] {
    -webkit-appearance: textfield; /* 1 */
    outline-offset: -2px; /* 2 */
  }

  /* Correct the cursor style of increment and decrement buttons in Safari*/
  ::-webkit-inner-spin-button,
  ::-webkit-outer-spin-button {
    height: auto;
  }

  /**
  * 1. Correct the inability to style upload buttons in iOS and Safari.
  * 2. Change font properties to inherit in Safari.
  * 3. pointer for button appearance
  */
  ::-webkit-file-upload-button {
    -webkit-appearance: button; /* 1 */
    font: inherit; /* 2 */
    cursor: pointer; /* 3 */
  }

  /*Button defaults*/
  button {
    border: none;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
    background-color: transparent;
  }

  /*Input defaults*/
  input[type=text],
  input[type=url],
  input[type=email],
  input[type=textarea],
  select, textarea {
    width: 100%;
    max-width: 450px;
    min-height: 35px;
    padding: 5px;
    border: var(--border-sm);
    border-radius: var(--border-radius-sm);
    box-shadow: inset 0 0.0625em 0.125em rgb(10 10 10 / 5%);
  }

  select {
    background-color: var(--light-cyan-1);
  }

  /* a11y/UI
  * ========================================================================== */

  /*Remove the additional :invalid styles in Firefox*/
  :-moz-ui-invalid {
    box-shadow: none;
  }

  /*visual cursor hints*/
  [aria-busy="true"] {
    cursor: progress;
  }

  [aria-disabled="true"],
  [disabled] {
    cursor: not-allowed;
    pointer-events: none;
  }

  /*Remove the inner padding in Chrome, Edge, and Safari on macOS*/
  ::-webkit-search-decoration {
    -webkit-appearance: none;
  }

  /* For images to not be able to exceed their container */
  img {
    max-width: 100%;
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

  // default icon color
  svg:not(.page-icon):not([fill]) {
    fill: var(--dark-cyan-2);
  }

  /* Grouping content
  * ========================================================================== */

  /*Remove all margin/padding on lists*/
  ul, ol, li, dl, dd, dt {
    margin: 0;
    padding: 0;
  }

  /*default list styles*/
  ul, ol {
    list-style: none;
  }

  /* Text-level styles
  * ========================================================================== */

  /*default header styles*/
  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
    font-family: Georgia, 'Times New Roman', Times, serif;
  }

  /*default text styles*/
  p,
  a,
  button,
  li,
  dd,
  dt,
  label,
  b,
  strong,
  legend {
    margin: 0;
    padding: 0;
    font-family: "Roboto", sans-serif;
  }

  /*line height for text*/
  p, dd, li {
    line-height: 1.5;
  }

  /*remove default link decoration*/
  a {
    text-decoration: none;
  }

  /*bold font weight for titles/important text*/
  b,
  strong,
  dt,
  legend {
    font-weight: bold;
  }

  /* Text-level sizing
  * ========================================================================== */

  p,
  a,
  button,
  li,
  dd,
  dt,
  label,
  b,
  strong,
  legend {
    font-size: 1rem;
  }

  h4 {
    font-size: 1.125rem;

    @media (min-width: 1000px) {
      font-size: 1.2rem;
    }
  }

  h3 {
    font-size: 1.266rem;

    @media (min-width: 1000px) {
      font-size: 1.44rem;
    }
  }

  h2 {
    font-size: 1.424rem;

    @media (min-width: 1000px) {
      font-size: 1.728rem;
    }
  }

  h1 {
    font-size: 1.602rem;

    @media (min-width: 1000px) {
      font-size: 2.074rem;
    }
  }

  /* General styles
  * ========================================================================== */

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

  .visually-hidden-relative {
    display: inline-block;
    position: relative;
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

  .input-err {
    border: 2px solid red;
  }

  .info-mssg {
    color: var(--dark-cyan-2);
    font-size: 0.9rem;
  }

  .err-mssg {
    color: red;
    font-size: 0.9rem;
  }

  .success-mssg {
    color: var(--dark-green-2);
    font-size: 0.9rem;
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
