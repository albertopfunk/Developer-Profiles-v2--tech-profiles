import React, { useState, useEffect } from "react";
import axios from "axios";
import { Route, useRouteMatch, Link, Switch } from "react-router-dom";
import styled from "styled-components";

import ProfileHome from "./ProfileHome";
import NewUser from "./new-user/NewUser";
import PersonalInfo from "./personal-info/PersonalInfo";
import AboutYou from "./about-you/AboutYou";
import WhereToFindYou from "./where-to-find-you/WhereToFindYou";
import DashboardProjects from "./projects/DashboardProjects";
import DashboardEducation from "./education/DashboardEducation";
import DashboardExperience from "./experience/DashboardExperience";
import DashboardBilling from "./billing/DashboardBilling";

import auth0Client from "../../auth/Auth";
import { ProfileContext } from "../../global/context/user-profile/ProfileContext";
import UserCard from "../../components/user-cards/user-card/UserCard";

function ProfileDashboard() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  const [previewImg, setPreviewImg] = useState("");
  const [extrasUpdate, setExtrasUpdate] = useState(false);
  let { path, url } = useRouteMatch();

  useEffect(() => {
    if (!user) {
      initProfile();
    }
  });

  async function initProfile() {
    const userProfile = auth0Client.getProfile();
    const { email } = userProfile;

    if (!email) {
      console.error("Unable to Get User Profile");
      auth0Client.signOut("authorize");
    }
    try {
      const user = await axios.post(
        `${process.env.REACT_APP_SERVER}/users/get-single`,
        { email }
      );
      setUser(user.data);
      setLoadingUser(false);
    } catch (err) {
      console.error(`Error Getting User By Email`, err);
      auth0Client.signOut("authorize");
    }
  }

  async function editProfile(input) {
    try {
      const newUser = await axios.put(
        `${process.env.REACT_APP_SERVER}/users/${user.id}`,
        input
      );
      setUser(newUser.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addExtra(input, extra) {
    try {
      await axios.post(
        `${process.env.REACT_APP_SERVER}/extras/new/${extra}`,
        input
      );
      setExtrasUpdate(!extrasUpdate);
    } catch (err) {
      console.error(err);
    }
  }

  console.log("===PROFILE DASH + PREVIOUS IMG===", previewImg);

  if (loadingUser) {
    return <h1>Loading...</h1>;
  }
  return (
    <Main>
      <header>
        <Link to={`${url}`}>Home</Link>
        <br />
        <Link to={`${url}/new`}>New user</Link>
        <br />
        <Link to={`${url}/personal-info`}>Personal Info</Link>
        <br />
        <Link to={`${url}/about-you`}>About You</Link>
        <br />
        <Link to={`${url}/where-to-find-you`}>Where to Find You</Link>
        <br />
        <Link to={`${url}/projects`}>Projects</Link>
        <br />
        <Link to={`${url}/education`}>Education</Link>
        <br />
        <Link to={`${url}/experience`}>Experience</Link>
        <br />
        <Link to={`${url}/billing`}>Billing</Link>
      </header>

      <br />
      <hr />

      <UserCard
        dashboard
        extrasUpdate={extrasUpdate}
        previewImg={previewImg}
        usersLength={1}
        index={1}
        id={user.id}
        areaOfWork={user.area_of_work}
        email={user.public_email}
        image={user.image}
        firstName={user.first_name}
        lastName={user.last_name}
        currentLocation={user.current_location_name}
        summary={user.summary}
        title={user.desired_title}
        topSkills={user.top_skills}
        additionalSkills={user.additional_skills}
        github={user.github}
        linkedin={user.linkedin}
        portfolio={user.portfolio}
        interestedLocations={user.interested_location_names}
      />

      <br />
      <hr />

      <ProfileContext.Provider
        value={{
          loadingUser,
          user,
          editProfile,
          addExtra,
          setPreviewImg
        }}
      >
        <Switch>
          <Route exact path={`${path}`}>
            <ProfileHome />
          </Route>

          <Route path={`${path}/new`}>
            <NewUser />
          </Route>

          <Route path={`${path}/personal-info`}>
            <PersonalInfo />
          </Route>

          <Route path={`${path}/about-you`}>
            <AboutYou />
          </Route>

          <Route path={`${path}/Where-to-find-you`}>
            <WhereToFindYou />
          </Route>

          <Route path={`${path}/projects`}>
            <DashboardProjects />
          </Route>

          <Route path={`${path}/education`}>
            <DashboardEducation />
          </Route>

          <Route path={`${path}/experience`}>
            <DashboardExperience />
          </Route>

          <Route path={`${path}/billing`}>
            <DashboardBilling />
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
