import React from 'react';
import styled from "styled-components";

//import auth0Client from '../../Auth';


function ProfileDashboard() {
  function getIt() {
    // console.log(auth0Client.getProfile())
    // console.log(auth0Client.getIdToken())
    // console.log(auth0Client.isAuthenticated())
  }
  return (
    <Main>
      <h1>Helloo Dashboard</h1>
      <button onClick={getIt}>PROFILE</button>
    </Main>
  )
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default ProfileDashboard;
