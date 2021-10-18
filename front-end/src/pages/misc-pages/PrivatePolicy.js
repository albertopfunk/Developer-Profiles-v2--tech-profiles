import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

function PrivatePolicy() {
  return (
    <Main id="main-content" tabIndex="-1" aria-labelledby="main-heading">
      <Helmet>
        <title>Private Policy • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">Private Policy</h1>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  padding-top: 100px;
  background-color: pink;
`;

export default PrivatePolicy;
