import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Route, useRouteMatch, Link, Switch } from "react-router-dom";
import styled from "styled-components";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import { ReactComponent as Home } from "../../global/assets/dashboard-home.svg";
import { ReactComponent as IdCard } from "../../global/assets/dashboard-id-card.svg";
import { ReactComponent as User } from "../../global/assets/dashboard-user.svg";
import { ReactComponent as Location } from "../../global/assets/dashboard-location.svg";
import { ReactComponent as Projects } from "../../global/assets/dashboard-projects.svg";
import { ReactComponent as Education } from "../../global/assets/dashboard-education.svg";
import { ReactComponent as Experience } from "../../global/assets/dashboard-experience.svg";
import { ReactComponent as CreditCard } from "../../global/assets/dashboard-credit-card.svg";

import MainHeader from "../../components/header/MainHeader";
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

/*

<focusreset>
  <mainHeader/>
  <pageNav/>
  <MainContent>
    <sections>
      stuff
    </sections>
  </MainContent>
</focusreset>

*/

function ProfileDashboard() {
  let { path, url } = useRouteMatch();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [userImage, setUserImage] = useState({
    previewImage: "",
    previewAvatar: "",
    removeUserImage: false,
    removeSavedAvatar: false,
  });
  const [stripePromise] = useState(() =>
    loadStripe(process.env.REACT_APP_STRIPE)
  );

  useEffect(() => {
    if (!user) {
      initProfile();
    }
  });

  async function initProfile() {
    const userProfile = auth0Client.getProfile();
    const { email } = userProfile;

    if (!email) {
      auth0Client.signOut("authorize");
      return;
    }

    const results = await getFullUser(email);
    if (results?.error) {
      auth0Client.signOut("authorize");
    }
  }

  async function getFullUser(email) {
    const [res, err] = await httpClient("POST", "/users/get-full", { email });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return { error: "error getting user information" };
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
      return { error: "error updating user information" };
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
      return { error: "error updating user information" };
    }

    return getFullUser(user.email);
  }

  return (
    <>
      <Announcer
        announcement="information loaded"
        ariaId="info-loaded-announcement"
        ariaLive="polite"
      />
      <PageHeader>
        <MainHeader setHeaderHeight={setHeaderHeight} />
        <PageNav aria-label="page">
          <ul className="nav-group">
            <li className="nav-item">
              <Link className="link" id="page-navigation" to={`${url}`}>
                <span className="link-text-sr-only">Home</span>
                <span className="link-text">Home</span>
                <span className="link-icon">
                  <Home className="icon" />
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="link" to={`${url}/personal-info`}>
                <span className="link-text-sr-only">Personal Info</span>
                <span className="link-text">Personal Info</span>
                <span className="link-icon">
                  <IdCard className="icon" />
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="link" to={`${url}/about-you`}>
                <span className="link-text-sr-only">About You</span>
                <span className="link-text">About You</span>
                <span className="link-icon">
                  <User className="icon" />
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="link" to={`${url}/where-to-find-you`}>
                <span className="link-text-sr-only">Where to Find You</span>
                <span className="link-text">Where to Find You</span>
                <span className="link-icon">
                  <Location className="icon" />
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="link" to={`${url}/projects`}>
                <span className="link-text-sr-only">Projects</span>
                <span className="link-text">Projects</span>
                <span className="link-icon">
                  <Projects className="icon" />
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="link" to={`${url}/education`}>
                <span className="link-text-sr-only">Education</span>
                <span className="link-text">Education</span>
                <span className="link-icon">
                  <Education className="icon" />
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="link" to={`${url}/experience`}>
                <span className="link-text-sr-only">Experience</span>
                <span className="link-text">Experience</span>
                <span className="link-icon">
                  <Experience className="icon" />
                </span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="link" to={`${url}/billing`}>
                <span className="link-text-sr-only">Billing</span>
                <span className="link-text">Billing</span>
                <span className="link-icon">
                  <CreditCard className="icon" />
                </span>
              </Link>
            </li>
          </ul>
        </PageNav>
      </PageHeader>

      <Main aria-labelledby="main-heading" headerHeight={headerHeight}>
        {loadingUser ? (
          <>
            <h1>Loading User</h1>
          </>
        ) : (
          <>
            <Elements stripe={stripePromise}>
              <ProfileContext.Provider
                value={{
                  user,
                  editProfile,
                  addUserExtras,
                  userImage,
                  setUserImage,
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
                previewImage={userImage.previewImage || userImage.previewAvatar}
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
                userImage={!userImage.removeUserImage && user.profile_image}
                avatarImage={!userImage.removeSavedAvatar && user.avatar_image}
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
          </>
        )}
      </Main>
    </>
  );
}

const PageHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100%;
  border-bottom: solid 1px rgba(229, 231, 235, 0.8);

  @media (min-width: 500px) {
    z-index: 0;
    border: none;
  }
`;

const PageNav = styled.nav`
  background-color: white;

  @media (min-width: 500px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
    padding-top: 75px;
    width: 50px;
    height: 100vh;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
  }

  @media (min-width: 600px) {
    z-index: 5;
  }

  @media (min-width: 750px) {
    width: 200px;
    padding-top: 95px;
  }

  .nav-group {
    display: flex;
    overflow-x: auto;

    @media (min-width: 500px) {
      overflow: none;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 10px;
    }

    @media (min-width: 750px) {
      align-items: flex-start;
    }

    .nav-item {
      padding: 10px;
      white-space: nowrap;
    }
  }

  .link {
    display: flex;
    gap: 5px;
    align-items: flex-start;
    justify-content: center;

    @media (min-width: 750px) {
      gap: 7px;
    }

    .link-text {
      display: inline-block;

      @media (min-width: 500px) {
        display: none;
      }

      @media (min-width: 750px) {
        display: inline-block;
      }
    }

    .link-text-sr-only {
      display: none;

      @media (min-width: 500px) {
        position: absolute;
        clip: rect(0, 0, 0, 0);
        height: 1px;
        width: 1px;
        margin: -1px;
        padding: 0;
        border: 0;
        overflow: hidden;
      }

      @media (min-width: 750px) {
        display: none;
      }
    }

    .link-icon {
      display: none;

      @media (min-width: 500px) {
        display: inline-block;
      }

      .icon {
        height: 1.2rem;

        @media (min-width: 750px) {
          height: 1.1rem;
        }
      }
    }
  }
`;

const Main = styled.main`
  min-height: 100vh;
  padding-top: ${(props) => `calc(40px + 20px + ${props.headerHeight}px);`};
  padding-right: 5px;
  padding-left: 5px;
  padding-bottom: 50px;
  background-color: hsl(240, 10%, 99%);

  @media (min-width: 500px) {
    padding-top: 75px;
    padding-left: 60px;
    padding-right: 10px;
  }

  @media (min-width: 750px) {
    padding-top: 95px;
    padding-left: 210px;
    padding-right: 10px;
  }
`;

export default ProfileDashboard;
