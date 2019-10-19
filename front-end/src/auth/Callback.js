import React, { Component } from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import auth0Client from "./Auth";

class Callback extends Component {
  async componentDidMount() {
    await auth0Client.handleAuthentication();
    
    this.props.history.replace("/dashboard");
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
