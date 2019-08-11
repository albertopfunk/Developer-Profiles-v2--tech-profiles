import React from "react";
import { GlobalStyles } from "./global-styles/GlobalStyles";
import PublicPage from "./pages/public-page/PublicPage";

function App() {
  return (
    <div id="main-container">
      <GlobalStyles />
      <header>
        <h1>HEADER</h1>
      </header>

      <>
        <PublicPage />
      </>
    </div>
  );
}

export default App;
