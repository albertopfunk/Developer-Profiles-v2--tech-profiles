import React, { useContext } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";

function DashboardProjects() {
  const { user } = useContext(ProfileContext);

  console.log("Projects", user);
  return (
    <Main>
      <h1>Hello Projects</h1>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default DashboardProjects;
