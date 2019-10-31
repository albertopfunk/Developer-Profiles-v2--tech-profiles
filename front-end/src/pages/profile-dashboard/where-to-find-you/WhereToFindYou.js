import React, { useContext } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";

function WhereToFindYou() {
  const { loadingUser, user } = useContext(ProfileContext);

  console.log("Where to Find You", user);
  if (loadingUser) {
    return <h1>Loading...</h1>;
  }
  return (
    <Main>
      <h1>Hello Where to Find You</h1>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default WhereToFindYou
