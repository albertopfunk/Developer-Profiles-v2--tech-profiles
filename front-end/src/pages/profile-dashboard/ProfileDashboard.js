/*

<div>
  focus container
  <header>nav</header>
  <nav>page nav #page nav</nav>
  <main>
    h1 dashboard page
    <section>
      h2 form section #user information
      <div>err summary</div>
      <form></form>
    </section>
    <section>
      h2 user card section #user card
      <article>
        h3 user card
      </article>
    </section>
  <main>
</div>

*/

import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Route, useRouteMatch, Link, Switch } from "react-router-dom";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
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
import MainHeader from "../../components/header/MainHeader";

function ProfileDashboard() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [previewImg, setPreviewImg] = useState({ image: "", id: "" });
  const stripePromise = loadStripe(process.env.REACT_APP_STRIPE);
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

  async function getFullUser(email) {
    const [res, err] = await httpClient("POST", "/users/get-full", { email });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      // auth0Client.signOut("authorize");
      return {error: "error getting user information"};
    }

    ReactDOM.unstable_batchedUpdates(() => {
      setUser(res.data);
      setLoadingUser(false);
    });
  }

  async function editProfile(data) {
    const [res, err] = await httpClient("PUT", `/users/${user.id}`, data);

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return {error: "error updating user information"};
    }

    return getFullUser(user.email);
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
      return {error: "error updating user information"};
    }

    return getFullUser(user.email);
  }

  if (loadingUser) {
    // main skeleton loader
    // nav should be present here too
    return (
      <div>
        <Helmet>
          <title>Profile Dashboard • Tech Profiles</title>
        </Helmet>
        <h1>Loading Information...</h1>
      </div>
    );
  }

  return (
    <MainContainer>
      <Announcer
        announcement="information loaded"
        ariaId="info-loaded-announcement"
        ariaLive="polite"
        />
      <PageHeader>
        <MainHeader />
        <nav aria-label="page">
          <ul>
            <li>
              <Link id="page-navigation" to={`${url}`}>
                Home
              </Link>
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
      </PageHeader>

      <main aria-labelledby="main-heading">
        <Elements stripe={stripePromise}>
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
        </Elements>

        <section aria-labelledby="profile-card-heading">
          <h2 id="profile-card-heading">Current Profile Card Preview</h2>
          <UserCard
            previewImg={previewImg.image}
            userExtras={{
              locations: user.locations,
              topSkills: user.topSkills,
              additionalSkills: user.additionalSkills,
              education: user.education,
              experience: user.experience,
              projects: user.projects,
            }}
            index={0}
            totalUsers={1}
            userId={user.id}
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
        </section>
      </main>
    </MainContainer>
  );
}

const MainContainer = styled.div`
  width: 100%;
  background-color: pink;
`;

const PageHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  background-color: white;
  border-bottom: solid 0.5px;
`;

export default ProfileDashboard;
