import React from "react";
import { GlobalStyles } from "./global-styles/GlobalStyles";

import MainHeader from './components/header/MainHeader';
import PublicPage from "./pages/public-page/PublicPage";

function App() {
  return (
    <>
      <GlobalStyles />
      <MainHeader />
      <PublicPage />
    </>
  );
}

export default App;
