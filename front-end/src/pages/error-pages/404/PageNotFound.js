import React from "react";
import styled from "styled-components";

function PageNotFound() {
  return (
    <Main>
      <h1>Page Not Found!</h1>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default PageNotFound;
