import React, { useState, useEffect } from "react";
import { Route, useRouteMatch, Link, Switch } from "react-router-dom";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import UserCard from "../../components/user-cards/user-card/UserCard";
import ProfileHome from "./ProfileHome";
import NewUser from "./new-user/NewUser";
import PersonalInfo from "./personal-info/PersonalInfo";
import AboutYou from "./about-you/AboutYou";
import WhereToFindYou from "./where-to-find-you/WhereToFindYou";
import DashboardProjects from "./projects/DashboardProjects";
import DashboardEducation from "./education/DashboardEducation";
import DashboardExperience from "./experience/DashboardExperience";
import DashboardBilling from "./billing/DashboardBilling";

import { httpClient } from "../../global/helpers/http-requests";
import { ProfileContext } from "../../global/context/user-profile/ProfileContext";
import auth0Client from "../../auth/Auth";
import Announcer from "../../global/helpers/announcer";

function ProfileDashboard() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [previewImg, setPreviewImg] = useState({ image: "", id: "" });
  let { path, url } = useRouteMatch();

  useEffect(() => {
    if (!user) {
      initProfile();
    }
  });

  function initProfile() {
    const userProfile = auth0Client.getProfile();
    const { email } = userProfile;

    if (!email) {
      auth0Client.signOut("authorize");
      return;
    }

    getFullUser(email);
  }

  // I am returning so children can wait for
  // the user to be updated before re-rendering
  async function getFullUser(email) {
    const [res, err] = await httpClient("POST", "/users/get-full", { email });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      // prob better not sign out user if err
      // OR maybe make authorize page customizable
      // you can sign out and put a custom message
      // like 'unable to get profile, please sign in and try again'
      auth0Client.signOut("authorize");
      return false;
    }

    setUser(res.data);
    setLoadingUser(false);
    return true;
  }

  async function editProfile(data) {
    const [res, err] = await httpClient("PUT", `/users/${user.id}`, data);

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return false;
    }

    const fullUserSuccess = await getFullUser(user.email);
    if (fullUserSuccess) {
      return true;
    } else {
      return false;
    }
  }

  async function addUserExtras(requestsArr) {
    let main = {
      ...requestsArr.shift(),
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
      return false;
    }

    const fullUserSuccess = await getFullUser(user.email);
    if (fullUserSuccess) {
      return true;
    } else {
      return false;
    }
  }

  console.log("-- Main Dashboard --")

  if (loadingUser) {
    // main skeleton loader
    return (
      <div>
        <Helmet>
          <title>Profile Dashboard • Tech Profiles</title>
        </Helmet>
        <h1>Loading Information...</h1>
        <Announcer
        announcement="Loading Information"
        ariaId="loading-information-announcement"
      />
      </div>
    );
  }

  return (
    <MainContainer>
      <Helmet>
        <title>Profile Dashboard • Tech Profiles</title>
      </Helmet>

      <nav id="page-navigation" aria-label="page">
        <ul>
          <li>
            <Link to={`${url}`}>Home</Link>
          </li>

          <li>
            <Link to={`${url}/new`}>New user</Link>
          </li>

          <li>
            <Link to={`${url}/personal-info`}>Personal Info</Link>
          </li>

          <li>
            <Link to={`${url}/about-you`}>About You</Link>
          </li>

          <li>
            <Link to={`${url}/where-to-find-you`}>Where to Find You</Link>
          </li>

          <li>
            <Link to={`${url}/projects`}>Projects</Link>
          </li>

          <li>
            <Link to={`${url}/education`}>Education</Link>
          </li>

          <li>
            <Link to={`${url}/experience`}>Experience</Link>
          </li>

          <li>
            <Link to={`${url}/billing`}>Billing</Link>
          </li>
        </ul>
      </nav>

      <div className="content-container">
        <ProfileContext.Provider
          value={{
            user,
            editProfile,
            addUserExtras,
            setPreviewImg,
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

        <aside>
          <UserCard
            dashboard
            previewImg={previewImg.image}
            extras={{
              locations: user.locations,
              topSkills: user.topSkills,
              additionalSkills: user.additionalSkills,
              education: user.education,
              experience: user.experience,
              projects: user.projects,
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
        </aside>
      </div>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  width: 100%;
  padding-top: 100px;
  background-color: pink;
  display: flex;
  flex-wrap: nowrap;
  .content-container {
    display: flex;
    flex-wrap: wrap;
  }
`;

export default ProfileDashboard;
