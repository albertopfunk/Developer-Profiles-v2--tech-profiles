import React from "react";
import { Route, Switch } from "react-router-dom";
import { GlobalStyles } from "./global-styles/GlobalStyles";

import MainHeader from './components/header/MainHeader';
import LandingPage from "./pages/landing-page/LandingPage";
import PublicPage from "./pages/public-page/PublicPage";
import ProfileDashboard from "./pages/profile-dashboard/ProfileDashboard";
import Callback from './Callback';
import PrivateRoute from './PrivateRoute';
import PageNotAuthorized from "./pages/error-pages/not-authorized/PageNotAuthorized";
import PageNotFound from "./pages/error-pages/404/PageNotFound";


function App() {
  console.log(process.env.REACT_APP_TEST)
  return (
    <>
      <GlobalStyles />
      <MainHeader />
      <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route path="/profiles">
          <PublicPage />
        </Route>
        <Route path="/dashboard">
          <PrivateRoute>
            <ProfileDashboard />
          </PrivateRoute>
        </Route>
        <Route path='/callback'>
          <Callback />
        </Route>
        <Route path='/authorize'>
          <PageNotAuthorized />
        </Route>
        <Route>
          <PageNotFound />
        </Route>
      </Switch>
    </>
  );
}

export default App;
