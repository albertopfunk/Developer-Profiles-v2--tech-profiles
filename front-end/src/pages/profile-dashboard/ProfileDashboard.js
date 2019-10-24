import React, { useEffect, useState } from "react";
import {Route, useRouteMatch, Link, Switch} from 'react-router-dom'
import styled from "styled-components";

import auth0Client from "../../auth/Auth";
import axios from "axios";
import ProfileHome from "./ProfileHome";
import NewUser from "./new-user/NewUser";
import PersonalInfo from "./personal-info/PersonalInfo";

function ProfileDashboard() {

  const [user, setUser] = useState(null)

  let { path, url } = useRouteMatch();


  useEffect(() => {

    async function getProfile() {
      const userProfile = auth0Client.getProfile();
      const { email } = userProfile;
      const user = await axios.get(
        `${process.env.REACT_APP_SERVER}/users/${email}`
      );
      setUser(user)
    }
    getProfile()

    // const {
    //   id,
    //   image,
    //   public_email: publicEmail,
    //   first_name: firstName,
    //   last_name: lastName,
    //   area_of_work: areaOfWork,
    //   desired_title: title,

    //   current_location_name: currentLocation,
    //   github,
    //   linkedin,
    //   portfolio,

    //   interested_location_names: interestedLocations,
    //   summary,
    //   top_skills: topSkills,
    //   additional_skills: additionalSkills
    // } = user.data;


    // console.log(
    //   id,
    //   image,
    //   publicEmail,
    //   firstName,
    //   lastName,
    //   areaOfWork,
    //   title,
    //   currentLocation,
    //   github,
    //   linkedin,
    //   portfolio,
    //   interestedLocations,
    //   summary,
    //   topSkills,
    //   additionalSkills
    // );


  }, []);

  console.log(url, path, user)

  return (
    <Main>
      
      <header>
        <Link to={`${url}`}>Home</Link>
        <Link to={`${url}/personal-info`}>P info</Link>
        <Link to={`${url}/new`}>N user</Link>
      </header>

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
