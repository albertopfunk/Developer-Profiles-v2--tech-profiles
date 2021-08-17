import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Route, Switch, withRouter } from "react-router-dom";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { ReactComponent as PageValidation } from "./global/assets/page-validation.svg";

import { GlobalStyles } from "./global/styles/GlobalStyles";
import FocusReset from "./global/helpers/focus-reset/FocusReset";
import { AuthContext } from "./global/context/auth/AuthContext";
import Spacer from "./global/helpers/spacer";
import auth0Client from "./auth/Auth";
import Callback from "./auth/Callback";

import ProfilesPage from "./pages/profiles-page/ProfilesPage";
import ProfileDashboard from "./pages/profile-dashboard/ProfileDashboard";
import PageNotAuthorized from "./pages/error-pages/not-authorized/PageNotAuthorized";
import PageNotFound from "./pages/error-pages/404/PageNotFound";
// import PrivatePolicy from "./pages/misc-pages/private-policy/PrivatePolicy";

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
        <HeaderSkeleton>
          <picture>
            <source
              srcSet="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_45/v1594347155/tech-pros-v1-main/tech-profiles-logo.webp"
              media="(max-width: 750px)"
            />
            <source
              srcSet="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_45/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
              media="(max-width: 750px)"
            />
            <source srcSet="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.webp" />
            <img
              src="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
              alt="site logo link to profiles page"
            />
          </picture>
        </HeaderSkeleton>
        <Helmet>
          <title>Validating Session • Tech Profiles</title>
        </Helmet>
        <MainContainerSkeleton aria-labelledby="main-heading">
          <h1 id="main-heading">Validating Session</h1>
          <Spacer size="20" axis="vertical" />
          <PageValidation className="page-icon" />
        </MainContainerSkeleton>
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
              <ProfilesPage />
            </Route>
            <Route path="/profile-dashboard">
              {isValidated ? <ProfileDashboard /> : <PageNotAuthorized />}
            </Route>
            {/* <Route path="/private-policy">
              <PrivatePolicy />
            </Route> */}
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

const HeaderSkeleton = styled.header`
  width: 100%;
  height: 55px;
  padding: 5px;
  border-bottom: var(--border-sm);
  background-color: white;

  @media (min-width: 750px) {
    height: 75px;
  }
`;

const MainContainerSkeleton = styled.main`
  height: 100%;
  padding: 30px 5px 50px 5px;
  background-color: hsl(240, 10%, 99%);
  text-align: center;

  .page-icon {
    max-width: 750px;
  }
`;

export default withRouter(App);
