import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Route, Switch, withRouter } from "react-router-dom";

import { GlobalStyles } from "./global/styles/GlobalStyles";
import FocusReset from "./global/helpers/focus-reset/FocusReset";
import { AuthContext } from "./global/context/auth/AuthContext";
import auth0Client from "./auth/Auth";
import Callback from "./auth/Callback";

import LandingPage from "./pages/landing-page/LandingPage";
import ProfilesPage from "./pages/profiles-page/ProfilesPage";
import ProfileDashboard from "./pages/profile-dashboard/ProfileDashboard";
import PageNotAuthorized from "./pages/error-pages/not-authorized/PageNotAuthorized";
import PageNotFound from "./pages/error-pages/404/PageNotFound";
import SkeletonPage from "./pages/misc-pages/SkeletonPage";

function App({ location }) {
  // callback validates when user signs in
  // presetting state so cb doesn't route with invalidated state
  const [checkingSession, setCheckingSession] = useState(() =>
    location.pathname === "/callback" ? false : true
  );
  const [isValidated, setIsValidated] = useState(() =>
    location.pathname === "/callback" ? true : false
  );

  // session is validated and reset on each mount
  useEffect(() => {
    validateSession();
  }, []);

  async function validateSession() {
    if (location.pathname === "/callback") {
      return;
    }

    try {
      await auth0Client.silentAuth();
      ReactDOM.unstable_batchedUpdates(() => {
        setIsValidated(true);
        setCheckingSession(false);
      });
    } catch (err) {
      console.error("Silent Auth Failed", err);
      if (
        err.error === "login_required" &&
        location.pathname.includes("dashboard")
      ) {
        auth0Client.signOut("authorize");
      }
      ReactDOM.unstable_batchedUpdates(() => {
        setIsValidated(false);
        setCheckingSession(false);
      });
    }
  }

  function signIn() {
    auth0Client.signIn();
  }

  function signOut() {
    auth0Client.signOut();
  }

  if (checkingSession) {
    return (
      <>
        <GlobalStyles />
        <SkeletonPage />
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <AuthContext.Provider value={{ isValidated, signIn, signOut }}>
        <FocusReset>
          <Switch>
            <Route exact path="/">
              <LandingPage />
            </Route>
            <Route path="/profiles">
              <ProfilesPage />
            </Route>
            <Route path="/profile-dashboard">
              {isValidated ? <ProfileDashboard /> : <PageNotAuthorized />}
            </Route>
            <Route path="/callback">
              <Callback />
            </Route>
            <Route path="/authorize">
              <PageNotAuthorized />
            </Route>
            <Route>
              <PageNotFound />
            </Route>
          </Switch>
        </FocusReset>
      </AuthContext.Provider>
    </>
  );
}

export default withRouter(App);
