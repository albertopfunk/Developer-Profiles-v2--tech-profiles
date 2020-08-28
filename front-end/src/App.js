import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { GlobalStyles } from "./global/styles/GlobalStyles";
import { Helmet } from "react-helmet";

import PublicPage from "./pages/public-page/PublicPage";
import ProfileDashboard from "./pages/profile-dashboard/ProfileDashboard";
import PageNotAuthorized from "./pages/error-pages/not-authorized/PageNotAuthorized";
import PageNotFound from "./pages/error-pages/404/PageNotFound";
import PrivatePolicy from "./pages/misc-pages/private-policy/PrivatePolicy";
import Callback from "./auth/Callback";
import MainHeader from "./components/header/MainHeader";

import auth0Client from "./auth/Auth";
import Announcer from "./global/helpers/announcer";
import styled from "styled-components";
import FocusReset from "./global/helpers/focus-reset";

// callback handles validation when user signs in
// since it only routes to dashboard when validation is successful
// i'm presetting state so cb doesn't route to dash with invalidated state
function App({ location }) {
  const [checkingSession, setCheckingSession] = useState(() =>
    location.pathname === "/callback" ? false : true
  );
  const [isValidated, setIsValidated] = useState(() =>
    location.pathname === "/callback" ? true : false
  );

  useEffect(() => {
    validateSession();
    // another issue with useEffect
    // eslint requires validateSession as a dep
    // when I add it there, react warns to add the whole
    // function inside useEffect, when I do that
    // deps will now require location.pathname
    // adding location.pathname to the deps will cause
    // useEffect to run on every navigation change
    // rechecking and changing loading states each time
    // eslint-disable-next-line
  }, []);

  async function validateSession() {
    if (location.pathname === "/callback") {
      return;
    }

    try {
      await auth0Client.silentAuth();
      setIsValidated(true);
      setCheckingSession(false);
    } catch (err) {
      console.error("Silent Auth Failed", err);
      setIsValidated(false);
      setCheckingSession(false);
      if (
        err.error === "login_required" &&
        location.pathname.includes("dashboard")
      ) {
        auth0Client.signOut("authorize");
      }
    }
  }

  function signIn() {
    auth0Client.signIn();
  }

  function signOut() {
    auth0Client.signOut();
  }

  console.log("-- App --");

  if (checkingSession) {
    return (
      <>
        <GlobalStyles />
        <HeaderSkeleton />
        <Helmet>
          <title>Validating Session • Tech Profiles</title>
        </Helmet>
        <MainContainerSkeleton aria-labelledby="main-heading">
          <h1 id="main-heading">Validating Session</h1>
        </MainContainerSkeleton>
      </>
    );
  }

  return (
    <>
      <GlobalStyles />
      <Announcer
        announcement="Page Loaded"
        ariaId="validating-session-announcement"
      />
      <FocusReset>
        <MainHeader
          isValidated={isValidated}
          signOut={signOut}
          signIn={signIn}
        />
        <Switch>
          <Route exact path="/">
            <PublicPage />
          </Route>
          <Route path="/profile-dashboard">
            {isValidated ? <ProfileDashboard /> : <PageNotAuthorized />}
          </Route>
          <Route path="/private-policy">
            <PrivatePolicy />
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
    </>
  );
}

const HeaderSkeleton = styled.header`
  background-color: white;
  width: 100%;
  height: 100px;
  padding: 0.3em 1em;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
`;

const MainContainerSkeleton = styled.main`
  width: 100%;
  padding-top: 100px;
  background-color: pink;
`;

export default withRouter(App);
