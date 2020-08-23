import React from "react";
import { Redirect, withRouter } from "react-router-dom";
import auth0Client from "./Auth";

function PrivateRoute(props) {
  console.log("-- Private Route --");

  if (props.checkingSession)
    return (
      <main>
        <h3>Heloooooo jelloooooo mellooooooo...</h3>
      </main>
    );

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
