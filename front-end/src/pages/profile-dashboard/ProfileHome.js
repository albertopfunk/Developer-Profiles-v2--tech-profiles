import React, { useContext } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../global/context/user-profile/ProfileContext";

function ProfileHome() {
  const { loadingUser, user } = useContext(ProfileContext);

  console.log("HOME RENDER STATE", user);
  if (loadingUser) {
    return <h1>Loading...</h1>;
  }
  return (
    <Main>
      <h1>Helloo Dashboard Home</h1>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default ProfileHome;
