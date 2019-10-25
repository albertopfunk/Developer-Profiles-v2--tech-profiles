import React, { useState, useEffect } from "react";
import axios from "axios";
import { Route, useRouteMatch, Link, Switch } from "react-router-dom";
import styled from "styled-components";

import ProfileHome from "./ProfileHome";
import NewUser from "./new-user/NewUser";
import PersonalInfo from "./personal-info/PersonalInfo";

import auth0Client from "../../auth/Auth";
import { ProfileContext } from "../../global/context/user-profile/ProfileContext";

function ProfileDashboard() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  let { path, url } = useRouteMatch();

  useEffect(() => {
    initProfile();
  }, []);

  async function initProfile() {
    const userProfile = auth0Client.getProfile();
    const { email } = userProfile;

    try {
      const user = await axios.get(
        `${process.env.REACT_APP_SERVER}/users/${email}`
      );
      setUser(user.data);
      setLoadingUser(false);
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  }

  async function editProfile(input) {
    const newUser = await axios.put(
      `${process.env.REACT_APP_SERVER}/users/${user.id}`,
      input
    );
    setUser(newUser.data);
  }

  console.log("DASH RENDER STATE");
  return (
    <Main>
      <header>
        <Link to={`${url}`}>Home</Link>
        <br />
        <Link to={`${url}/personal-info`}>P info</Link>
        <br />
        <Link to={`${url}/new`}>N user</Link>
      </header>

      <ProfileContext.Provider value={{ loadingUser, user, editProfile }}>
        <Switch>
          <Route exact path={`${path}`}>
            <ProfileHome />
          </Route>

          <Route path={`${path}/personal-info`}>
            <PersonalInfo />
          </Route>

          <Route path={`${path}/new`}>
            <NewUser />
          </Route>
        </Switch>
      </ProfileContext.Provider>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default ProfileDashboard;
