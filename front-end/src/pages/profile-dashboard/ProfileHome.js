import React, { useContext } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../global/context/user-profile/ProfileContext";

function ProfileHome() {
  const { user } = useContext(ProfileContext);

  return (
    <Section>
      <h1>Helloo Dashboard Home</h1>
    </Section>
  );
}

const Section = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default ProfileHome;
