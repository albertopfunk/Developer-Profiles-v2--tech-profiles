import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

function PageNotAuthorized() {
  return (
    <Main id="main-content" tabIndex="-1" aria-labelledby="main-heading">
      <Helmet>
        <title>Not Authorized • Tech Profiles</title>
      </Helmet>
      <h1 id="main-heading">Page Not Authorized!</h1>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  padding-top: 100px;
  background-color: pink;
`;

export default PageNotAuthorized;
