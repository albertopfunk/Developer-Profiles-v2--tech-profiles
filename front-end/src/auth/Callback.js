import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { ReactComponent as PageValidation } from "../global/assets/page-validation.svg"

import auth0Client from "./Auth";
import { httpClient } from "../global/helpers/http-requests";
import Spacer from "../global/helpers/spacer";

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
      <>
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
          <PageValidation className="page-icon"/>
        </MainContainerSkeleton>
        </>
    );
  }
}

const HeaderSkeleton = styled.header`
  width: 100%;
  height: 55px;
  padding: 5px;
  border-bottom: solid 1px rgba(229, 231, 235, 0.5);
  background-color: white;

  @media (min-width: 750px) {
    height: 75px;
  }
`;

const MainContainerSkeleton = styled.main`
  height: calc(100vh - 55px);
  padding: 30px 5px 50px 5px;
  background-color: hsl(240, 10%, 99%);
  text-align: center;

  .page-icon {
    max-width: 750px;
  }
`;

export default withRouter(Callback);
