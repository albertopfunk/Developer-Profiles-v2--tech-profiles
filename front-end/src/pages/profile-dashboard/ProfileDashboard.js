import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Helmet } from "react-helmet";
import {
  Route,
  useRouteMatch,
  Switch,
  useLocation,
  NavLink,
} from "react-router-dom";
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
import { ReactComponent as PageLoadingIcon } from "../../global/assets/page-loading.svg";

import MainHeader from "../../components/header/MainHeader";
import UserCard from "../../components/user-cards/user-card/UserCard";
import ProfileHome from "./ProfileHome";
import NewUser from "./new-user/NewUser";
import PersonalInfo from "./personal-info/PersonalInfo";
import AboutYou from "./about-you/AboutYou";
import YourWhereabouts from "./your-whereabouts/YourWhereabouts";
import DashboardProjects from "./projects/DashboardProjects";
import DashboardEducation from "./education/DashboardEducation";
import DashboardExperience from "./experience/DashboardExperience";
import DashboardBilling from "./billing/DashboardBilling";
import DashboardNotFound from "../error-pages/404/DashboardNotFound";

import { httpClient } from "../../global/helpers/http-requests";
import { ProfileContext } from "../../global/context/user-profile/ProfileContext";
import auth0Client from "../../auth/Auth";
import Announcer from "../../global/helpers/announcer";
import Spacer from "../../global/helpers/spacer";

function ProfileDashboard() {
  let { path, url } = useRouteMatch();
  let location = useLocation();
  const [headerHeight, setHeaderHeight] = useState(0);
  const [navHeight, setNavHeight] = useState(0);
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

  const navRef = useRef();

  useEffect(() => {
    if (!navRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      setNavHeight(entries[0].contentRect.height);
    });

    resizeObserver.observe(navRef.current);

    return () => resizeObserver.disconnect();
  }, []);

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

  function getMainHeading() {
    const trimmedPathname = location.pathname
      .split(/[/-]/)
      .splice(3)
      .join(" ")
      .trim();

    switch (trimmedPathname) {
      case "":
        return "Home";
      case "new":
        return "Quickstart";
      case "personal info":
        return "Personal Info";
      case "about you":
        return "About You";
      case "your whereabouts":
        return "Your Whereabouts";
      case "projects":
        return "Projects";
      case "education":
        return "Education";
      case "experience":
        return "Experience";
      case "billing":
        return "Billing";
      default:
        return "Not Found";
    }
  }

  const mainHeading = getMainHeading();

  return (
    <ProfileDashboardContainer
      headerHeight={headerHeight}
      navHeight={navHeight}
    >
      <Helmet>
        <title>Profile Dashboard {mainHeading} • Tech Profiles</title>
      </Helmet>
      <Announcer
        announcement="information loaded"
        ariaId="info-loaded-announcement"
        ariaLive="polite"
      />
      <PageHeader>
        <MainHeader setHeaderHeight={setHeaderHeight} />
        <PageNav
          ref={navRef}
          id="page-navigation"
          tabIndex="-1"
          headerHeight={headerHeight}
          aria-label="page"
        >
          <ul className="nav-group">
            <li className="nav-item">
              <NavLink
                exact
                to={`${url}`}
                className="link"
                activeClassName="selected"
              >
                <span className="link-icon">
                  <Home className="icon" />
                </span>
                <span className="link-text">Home</span>
                <span className="link-text-sr-only">Home</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to={`${url}/personal-info`}
                className="link"
                activeClassName="selected"
              >
                <span className="link-icon">
                  <IdCard className="icon" />
                </span>
                <span className="link-text">Personal Info</span>
                <span className="link-text-sr-only">Personal Info</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to={`${url}/about-you`}
                className="link"
                activeClassName="selected"
              >
                <span className="link-icon">
                  <User className="icon" />
                </span>
                <span className="link-text">About You</span>
                <span className="link-text-sr-only">About You</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to={`${url}/your-whereabouts`}
                className="link"
                activeClassName="selected"
              >
                <span className="link-icon">
                  <Location className="icon" />
                </span>
                <span className="link-text">Your Whereabouts</span>
                <span className="link-text-sr-only">Your Whereabouts</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to={`${url}/projects`}
                className="link"
                activeClassName="selected"
              >
                <span className="link-icon">
                  <Projects className="icon" />
                </span>
                <span className="link-text">Projects</span>
                <span className="link-text-sr-only">Projects</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to={`${url}/education`}
                className="link"
                activeClassName="selected"
              >
                <span className="link-icon">
                  <Education className="icon" />
                </span>
                <span className="link-text">Education</span>
                <span className="link-text-sr-only">Education</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to={`${url}/experience`}
                className="link"
                activeClassName="selected"
              >
                <span className="link-icon">
                  <Experience className="icon" />
                </span>
                <span className="link-text">Experience</span>
                <span className="link-text-sr-only">Experience</span>
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                to={`${url}/billing`}
                className="link"
                activeClassName="selected"
              >
                <span className="link-icon">
                  <CreditCard className="icon" />
                </span>
                <span className="link-text">Billing</span>
                <span className="link-text-sr-only">Billing</span>
              </NavLink>
            </li>
          </ul>
        </PageNav>
      </PageHeader>

      <div className="main-container">
        <Main
          id="main-content"
          tabIndex="-1"
          aria-labelledby="main-heading"
          headerHeight={headerHeight}
          navHeight={navHeight}
        >
          {loadingUser ? (
            <div className="skeleton-section">
              <h1 className="sr-only">Loading User</h1>
              <div className="icon-container">
                <PageLoadingIcon className="icon" />
              </div>
            </div>
          ) : (
            <>
              <h1 id="main-heading">{mainHeading}</h1>
              <Spacer axis="vertical" size="30" />
              <div className="flex-container">
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

                      <Route path={`${path}/your-whereabouts`}>
                        <YourWhereabouts />
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

                      <Route>
                        <DashboardNotFound />
                      </Route>
                    </Switch>
                  </ProfileContext.Provider>
                </Elements>

                <section
                  id="profile-card"
                  tabIndex="-1"
                  aria-labelledby="profile-card-heading"
                >
                  <h2 id="profile-card-heading">Profile Preview</h2>
                  <Spacer axis="vertical" size="15" />
                  <UserCard
                    previewImage={
                      userImage.previewImage || userImage.previewAvatar
                    }
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
                    avatarImage={
                      !userImage.removeSavedAvatar && user.avatar_image
                    }
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
              </div>
            </>
          )}
        </Main>
      </div>
    </ProfileDashboardContainer>
  );
}

const ProfileDashboardContainer = styled.div`
  & > .main-container {
    padding-top: ${(props) =>
      `calc(5px + ${props.navHeight}px + ${props.headerHeight}px);`};
    padding-left: 5px;
    padding-right: 5px;

    @media (min-width: 500px) {
      padding-top: ${(props) => `calc(5px + ${props.headerHeight}px);`};
      padding-left: calc(50px + 5px);
      padding-right: 5px;
    }

    @media (min-width: 750px) {
      padding-left: calc(200px + 5px);
      padding-right: 5px;
    }
  }
`;

const PageHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--header-layer);
  width: 100%;
  border-bottom: var(--border-sm);
  
  @media (min-width: 500px) {
    border-bottom: none;
  }
`;

const PageNav = styled.nav`
  background-color: white;
  max-height: ${(props) => `calc(100vh - ${props.headerHeight}px);`};
  overflow-y: auto;

  @media (min-width: 500px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--side-nav-layer);
    padding-top: 56px;
    width: 50px;
    min-height: 100vh;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
  }

  @media (min-width: 750px) {
    width: 200px;
    padding-top: 76px;
  }

  .nav-group {
    display: flex;
    overflow-x: auto;

    @media (min-width: 500px) {
      overflow: none;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
    }

    .nav-item {
      border-right: var(--border-sm);

      @media (min-width: 500px) {
        border-right: none;
        border-bottom: var(--border-sm);
      }

      &:last-child {
        border-right: none;
      }
    }
  }

  .link {
    // allow for padding
    display: inline-block;
    padding: 10px 15px;
    // no wrap of white space in ul and display all li in one line
    white-space: nowrap;
    // default color
    color: var(--dark-cyan-2);
    // selected and focus placeholder
    border: solid 2px transparent;

    // icon only
    @media (min-width: 500px) {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 10px;
    }

    // icon + text
    @media (min-width: 750px) {
      padding-top: 20px;
      justify-content: flex-start;
      gap: 10px;
    }

    &.selected {
      color: var(--dark-green-3);
      border-bottom-color: var(--dark-green-3);

      @media (min-width: 500px) {
        border-bottom-color: transparent;
        border-right-color: var(--dark-green-3);
      }
    }

    // next 3 selectors are due to focus-visible
    // not being fully supported yet
    &:focus {
      // contrast mode fallback
      outline: 2.5px solid transparent;
      border-color: var(--dark-green-3);
    }

    // removing focus styles when using mouse
    &:focus:not(:focus-visible) {
      outline: none;
      border-color: transparent;
    }

    // undoing removal of bottom border from above selector when using mouse
    &.selected:focus:not(:focus-visible) {
      border-bottom-color: var(--dark-green-3);

      @media (min-width: 500px) {
        border-bottom-color: transparent;
        border-right-color: var(--dark-green-3);
      }
    }

    &:active {
      color: var(--dark-green-3);
    }

    .link-text {
      // hover and focus placeholder
      border: solid 1px transparent;

      @media (min-width: 500px) {
        display: none;
      }

      @media (min-width: 750px) {
        display: inline-block;
      }
    }

    &:hover:not(.selected) .link-text {
      border-bottom-color: currentColor;
    }

    &:focus:not(.selected) .link-text {
      border-bottom-color: currentColor;
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
        display: flex;
        justify-content: center;
      }

      .icon {
        height: 1.2rem;

        @media (min-width: 750px) {
          height: 1.1rem;
        }
      }
    }

    &:hover .icon {
      @media (min-width: 500px) {
        fill: var(--dark-green-3);
      }
    }
  }
`;

const Main = styled.main`
  padding: 25px 5px 50px;
  scroll-margin-top: ${(props) =>
    `calc(5px + ${props.navHeight}px + ${props.headerHeight}px);`};

  @media (min-width: 500px) {
    scroll-margin-top: ${(props) => `calc(5px + ${props.headerHeight}px);`};
    padding-left: 15px;
    padding-right: 15px;
  }

  @media (min-width: 750px) {
    padding-left: 25px;
    padding-right: 25px;
  }

  & > .flex-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 30px;

    @media (min-width: 500px) {
      padding-left: 10px;
      padding-right: 10px;
    }

    @media (min-width: 750px) {
      padding-left: 20px;
      padding-right: 20px;
    }

    @media (min-width: 1150px) {
      flex-direction: row;
      gap: 50px;
    }

    @media (min-width: 1600px) {
      justify-content: space-evenly;
    }

    & > section {
      flex-basis: 50%;
      padding: 5px;
    }
  }

  .skeleton-section {
    text-align: center;

    .icon-container {
      height: 50vh;
      width: 100%;
      max-width: 750px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;

      .icon {
        width: 100%;
        max-width: 75px;
      }
    }
  }
`;

export default ProfileDashboard;
