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
  * Correct the font size and margin on h1 elements within section and
  * article contexts in Chrome, Edge, Firefox, and Safari.
  */

  h1 {
    font-size: 2em;
    margin: 0.67em 0;
  }
  
  /**
  * Remove all margin/padding on headers
  */

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
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
  * Remove the margin on nested lists in Chrome, Edge, IE, and Safari.
  */

  dl dl,
  dl ol,
  dl ul,
  ol dl,
  ul dl {
    margin: 0;
  }

  /**
  * Remove the margin on nested lists in Edge 18- and IE.
  */

  ol ol,
  ol ul,
  ul ol,
  ul ul {
    margin: 0;
  }


  /**
  * Remove all margin/padding on lists
  */

  ul, ol, li, dl, dd, dt {
    margin: 0;
    padding: 0;
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
  * Add the correct display in IE.
  */

  main {
    display: block;
  }

  /**
  * Remove the list style on navigation lists in all browsers (opinionated).
  */

  nav ol,
  nav ul {
    list-style: none;
    padding: 0;
    margin: 0;
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
  * Remove the gray background on active links in IE 10.
  */

  a {
    background-color: transparent;
  }

  /**
  * Add the correct text decoration in Edge 18-, IE, and Safari.
  */

  abbr[title] {
    text-decoration: underline;
    text-decoration: underline dotted;
  }

  /**
  * Add the correct font weight in Chrome, Edge, and Safari.
  */

  b,
  strong {
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
  * Add the correct display in IE 9-.
  */

  audio,
  video {
    display: inline-block;
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
  * Remove the border on images within links in IE 10-.
  */

  img {
    border-style: none;
  }

  /**
  * Change the fill color to match the text color in all browsers (opinionated).
  */

  svg:not([fill]) {
    fill: currentColor;
  }

  /**
  * Hide the overflow in IE.
  */

  svg:not(:root) {
    overflow: hidden;
  }

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
  * Remove the margin on controls in Safari.
  */

  button,
  input,
  select {
    margin: 0;
  }

  /**
  * 1. Show the overflow in IE.
  * 2. Remove the inheritance of text transform in Edge 18-, Firefox, and IE.
  */

  button {
    overflow: visible; /* 1 */
    text-transform: none; /* 2 */
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
  * 1. Change the inconsistent appearance in all browsers (opinionated).
  * 2. Correct the padding in Firefox.
  */

  fieldset {
    border: 1px solid #a0a0a0; /* 1 */
    padding: 0.35em 0.75em 0.625em; /* 2 */
  }

  /**
  * Show the overflow in Edge 18- and IE.
  */

  input {
    overflow: visible;
  }

  /**
  * 1. Correct the text wrapping in Edge 18- and IE.
  * 2. Correct the color inheritance from fieldset elements in IE.
  */

  legend {
    color: inherit; /* 2 */
    display: table; /* 1 */
    max-width: 100%; /* 1 */
    white-space: normal; /* 1 */
  }

  /**
  * 1. Add the correct display in Edge 18- and IE.
  * 2. Add the correct vertical alignment in Chrome, Edge, and Firefox.
  */

  progress {
    display: inline-block; /* 1 */
    vertical-align: baseline; /* 2 */
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
  * Remove the padding in IE 10-.
  */

  [type="checkbox"],
  [type="radio"] {
    padding: 0;
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
  * Add the correct display in Edge 18- and IE.
  */

  details {
    display: block;
  }

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

  /* Scripting
  * ========================================================================== */

  /**
  * Add the correct display in IE 9-.
  */

  canvas {
    display: inline-block;
  }

  /**
  * Add the correct display in IE.
  */

  template {
    display: none;
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

  /**
  * Add the correct display in IE 10-.
  */

  [hidden] {
    display: none;
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

  [aria-hidden="false"][hidden]:not(:focus) {
    clip: rect(0, 0, 0, 0);
    position: absolute;
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
