import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import FocusReset from "./global/helpers/focus-reset";

ReactDOM.render(
  <BrowserRouter>
    <FocusReset>
      <App />
    </FocusReset>
  </BrowserRouter>,
  document.getElementById("root")
);

/*

1. Live region
<div
  role="status"
  aria-live="polite"
  aria-atomic="true"
>
  Notification messages goes here
</div>

2. Reset focus
Create a component that listens to route changes and
reset focus to container on route change
container should be right above the <Header/>
this will make the skip link the first tab, then the header

3. Skip Link
Skip link should be located above header
skip to main content/first heading

4. Links should have 'active states'

5. Page titles should be on every 'page'


*/
