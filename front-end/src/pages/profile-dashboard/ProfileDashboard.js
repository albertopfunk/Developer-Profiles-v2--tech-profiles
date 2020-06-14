import React, { useState, useEffect } from "react";
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

import { httpClient } from "../../components/http-requests";
import { ProfileContext } from "../../global/context/user-profile/ProfileContext";
import UserCard from "../../components/user-cards/user-card/UserCard";
import auth0Client from "../../auth/Auth";

function ProfileDashboard() {
  const [loadingUser, setLoadingUser] = useState(true);
  const [user, setUser] = useState(null);
  const [previewImg, setPreviewImg] = useState({ image: "", id: "" });
  let { path, url } = useRouteMatch();

  useEffect(() => {
    if (!user) {
      initProfile();
    }
  });

  async function initProfile() {
    // setLoadingUser(true);
    const userProfile = auth0Client.getProfile();
    const { email } = userProfile;

    if (!email) {
      auth0Client.signOut("authorize");
      return;
    }

    getFullUser(email);
  }

  async function getFullUser(email) {
    const [res, err] = await httpClient("POST", "/users/get-full", { email });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      auth0Client.signOut("authorize");
      return;
    }

    setUser(res.data);
    setLoadingUser(false);
  }

  async function editProfile(data) {
    // setLoadingUser(true);
    const [res, err] = await httpClient("PUT", `/users/${user.id}`, data);

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    getFullUser(user.email);
  }

  async function addExtra(data, extra) {
    // setLoadingUser(true);
    const [res, err] = await httpClient("POST", `/extras/new/${extra}`, data);

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    getFullUser(user.email);
  }

  async function addUserExtras(requestsArr) {
    // setLoadingUser(true);
    let main = {
      ...requestsArr.shift()
    };

    let config;
    if (main.config) {
      config = { ...main.config, additional: requestsArr };
    } else {
      config = { additional: requestsArr };
    }

    const [res, err] = await httpClient(
      main.method,
      main.url,
      main.data ? main.data : {},
      config
    );

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    getFullUser(user.email);
  }

  console.log("===PROFILE DASH + PREVIOUS IMG===");

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
        previewImg={previewImg.image}
        extras={{
          locations: user.locations,
          topSkills: user.topSkills,
          additionalSkills: user.additionalSkills,
          education: user.education,
          experience: user.experience,
          projects: user.projects
        }}
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
        topSkills={user.top_skills_prev}
        additionalSkills={user.additional_skills_prev}
        github={user.github}
        twitter={user.twitter}
        linkedin={user.linkedin}
        portfolio={user.portfolio}
      />

      <br />
      <hr />

      <ProfileContext.Provider
        value={{
          loadingUser,
          user,
          editProfile,
          addExtra,
          addUserExtras,
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
