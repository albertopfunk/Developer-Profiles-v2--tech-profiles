import React from "react";
import { GlobalStyles } from "./global-styles/GlobalStyles";
import PublicPage from "./pages/public-page/PublicPage";
// import Playground from "./Playground";

function App() {
  return (
    <div id="main-container">
      <GlobalStyles />
      <header>
        <h1>HEADERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR</h1>
      </header>

      <>
        {/* Landing
        Dashboard */}
        <PublicPage />
      </>
    </div>
  );
}

export default App;
