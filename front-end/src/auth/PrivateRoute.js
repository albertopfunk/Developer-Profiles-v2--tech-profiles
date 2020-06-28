import React from "react";
import { Redirect, withRouter } from "react-router-dom";
import auth0Client from "./Auth";

function PrivateRoute(props) {
  if (props.checkingSession) return <h3>Validating session...</h3>;
  return (
    <>
      {auth0Client.isAuthenticated() ? (
        props.children
      ) : (
        <Redirect to="/authorize" />
      )}
    </>
  );
}

export default withRouter(PrivateRoute);
