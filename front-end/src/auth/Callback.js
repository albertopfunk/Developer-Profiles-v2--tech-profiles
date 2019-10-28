import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";
import { withRouter } from "react-router-dom";
import auth0Client from "./Auth";

class Callback extends Component {
  async componentDidMount() {
    await auth0Client.handleAuthentication();

    const userProfile = auth0Client.getProfile();
    const { email, sub } = userProfile;
    let firstName = "";
    let lastName = "";

    if (sub.includes("google")) {
      firstName = userProfile.given_name;
      lastName = userProfile.family_name;
    } else if (sub.includes("github")) {
      const userFullNameArr = userProfile.name.split(" ");
      firstName = userFullNameArr[0];
      lastName = userFullNameArr[1];
    } else {
      firstName = null;
      lastName = null;
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
        this.props.history.replace("/");
      }
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
      this.props.history.replace("/");
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
