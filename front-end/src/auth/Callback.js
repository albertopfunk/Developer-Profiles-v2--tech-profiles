import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import { withRouter } from "react-router-dom";
import auth0Client from "./Auth";

class Callback extends Component {
  async componentDidMount() {
    try {
      await auth0Client.handleAuthentication();
    } catch (err) {
      console.error("Unable to Authorize User", err);
      this.props.history.replace("/authorize");
    }

    const userProfile = auth0Client.getProfile();
    const { email, sub } = userProfile;
    if (!email || !sub) {
      console.error("Unable to Get User Profile");
      this.props.history.replace("/authorize");
    }

    let firstName = null;
    let lastName = null;

    if (sub.includes("google")) {
      firstName = userProfile.given_name;
      lastName = userProfile.family_name;
    }
    if (sub.includes("github")) {
      const userFullNameArr = userProfile.name.split(" ");
      firstName = userFullNameArr[0];
      lastName = userFullNameArr[1];
    }

    try {
      const user = await axios.post(
        `${process.env.REACT_APP_SERVER}/users/new`,
        {
          email,
          first_name: firstName,
          last_name: lastName
        }
      );

      const { status } = user;

      if (status === 201) {
        this.props.history.replace("/profile-dashboard/new");
      } else if (status === 200) {
        this.props.history.replace("/profile-dashboard");
      } else {
        console.error("Unable to Get User");
        this.props.history.replace("/authorize");
      }
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
      this.props.history.replace("/authorize");
    }
  }

  render() {
    return <Main>Loading profile...</Main>;
  }
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default withRouter(Callback);
