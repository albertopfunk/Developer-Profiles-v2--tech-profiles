import React, { useContext } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";

function DashboardExperience() {
  const { user } = useContext(ProfileContext);

  console.log("Experience", user);
  return (
    <Main>
      <h1>Hello Experience</h1>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default DashboardExperience;
