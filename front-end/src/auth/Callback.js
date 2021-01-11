import React, { Component } from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { Helmet } from "react-helmet";

import auth0Client from "./Auth";
import { httpClient } from "../global/helpers/http-requests";

class Callback extends Component {
  async componentDidMount() {
    let userProfile;
    let firstName = null;
    let lastName = null;

    try {
      userProfile = await auth0Client.handleAuthentication();
    } catch (err) {
      console.error("Unable to Authorize User =>", err);
      auth0Client.signOut("authorize");
      return;
    }

    const { email, sub } = userProfile;

    if (sub.includes("google")) {
      firstName = userProfile.given_name;
      lastName = userProfile.family_name;
    }

    if (sub.includes("github")) {
      const userFullNameArr = userProfile.name.split(" ");
      firstName = userFullNameArr[0];
      lastName = userFullNameArr[1];
    }

    const [res, err] = await httpClient("POST", "/users/new", {
      email,
      first_name: firstName,
      last_name: lastName,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      auth0Client.signOut("authorize");
      return;
    }

    if (res.status === 201) {
      this.props.history.replace("/profile-dashboard/new");
    } else if (res.status === 200) {
      this.props.history.replace("/profile-dashboard");
    } else {
      console.error("Unable to Get User");
      auth0Client.signOut("authorize");
    }
  }

  render() {
    return (
      <MainContainerSkeleton aria-labelledby="main-heading">
        <Helmet>
          <title>Validating Session • Tech Profiles</title>
        </Helmet>
        <h1 id="main-heading">Validating Session</h1>
      </MainContainerSkeleton>
    );
  }
}

const MainContainerSkeleton = styled.main`
  width: 100%;
  background-color: pink;
`;

export default withRouter(Callback);
