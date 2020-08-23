import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import { GlobalStyles } from "./global/styles/GlobalStyles";

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

function App(props) {
  const [checkingSession, setCheckingSession] = useState(true);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    validateSession();
  }, []);

  async function validateSession() {
    if (props.location.pathname === "/callback") {
      setCheckingSession(false);
      return;
    }
    try {
      await auth0Client.silentAuth();
      if (auth0Client.isAuthenticated()) {
        setIsValidated(true);
        setCheckingSession(false);
      } else {
        setIsValidated(false);
        setCheckingSession(false);
      }
    } catch (err) {
      console.error("Silent Auth Failed", err);
      auth0Client.signOut("authorize");
    }
  }

  console.log("-- App --");

  if (checkingSession) {
    return (
      <>
        <GlobalStyles />
        {/* needs to be like loading user, a skeleton */}
        <HeaderSkeleton />
        <Announcer
          announcement="Validating Session"
          ariaId="validating-session-announcement"
        />
        <MainContainerSkeleton>
          <h1>Validating Session</h1>
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
        <MainHeader isValidated={isValidated} />
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
  padding: 0.3em 1em;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;
`;

const MainContainerSkeleton = styled.div`
  width: 100%;
  padding-top: 100px;
  background-color: pink;
`;

export default withRouter(App);
