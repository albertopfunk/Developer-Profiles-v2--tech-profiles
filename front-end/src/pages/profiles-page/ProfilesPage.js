import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { ReactComponent as ErrorPageIcon } from "../../global/assets/page-error.svg";
import { ReactComponent as ConstructionPageIcon } from "../../global/assets/page-construction.svg";

import { httpClient } from "../../global/helpers/http-requests";
import { PROFILES_STATUS } from "../../global/helpers/variables";
import useToggle from "../../global/helpers/hooks/useToggle";
import Spacer from "../../global/helpers/spacer";

import MainHeader from "../../components/header/MainHeader";
import Filters from "../../components/forms/filters";
import UserCards from "../../components/user-cards/UserCards";

/*

<focusreset>
  <mainHeader/>
  <filtersNav/>
  <MainContent>
    <sections>
      stuff
    </sections>
  </MainContent>
</focusreset>

*/

function ProfilesPage() {
  const [pageStatus, setPageStatus] = useState(PROFILES_STATUS.initialLoading);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [cardsStatus, setCardsStatus] = useState(PROFILES_STATUS.idle);
  const [cardFocusIndex, setCardFocusIndex] = useState(0);
  const [users, setUsers] = useState({
    users: [],
    len: 0,
    page: 1,
    usersToLoad: true,
  });

  const [resetToggle, setResetToggle] = useToggle();
  const [filters, setFilters] = useState({
    isWebDevChecked: false,
    isUIUXChecked: false,
    isIOSChecked: false,
    isAndroidChecked: false,
    isUsingCurrLocationFilter: false,
    selectedWithinMiles: 0,
    chosenLocationLat: 0,
    chosenLocationLon: 0,
    isUsingRelocateToFilter: false,
    chosenRelocateToObj: {},
    sortChoice: "acending(oldest-newest)",
  });

  useEffect(() => {
    initUsers();
  }, []);

  async function initUsers() {
    const [res, err] = await httpClient("GET", "/users");

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      setPageStatus(PROFILES_STATUS.initialError);
      return;
    }

    setUsers({
      users: res.data.users,
      len: res.data.len,
      page: 1,
      usersToLoad: res.data.len > 25 ? true : false,
    });

    setPageStatus(PROFILES_STATUS.idle);
  }

  async function getFilteredUsers(filtersUpdate) {
    let loadingTimeout = setTimeout(() => {
      setPageStatus(PROFILES_STATUS.filtersLoading);
    }, 250);

    const updatedFilters = {
      ...filters,
      ...filtersUpdate,
    };

    const [res, err] = await httpClient(
      "POST",
      "/users/filtered",
      updatedFilters
    );
    clearTimeout(loadingTimeout);

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      setPageStatus(PROFILES_STATUS.filtersError);
      return;
    }

    setFilters(updatedFilters);
    setUsers({
      users: res.data.users,
      len: res.data.len,
      page: 1,
      usersToLoad: res.data.len > 25 ? true : false,
    });
    setPageStatus(PROFILES_STATUS.idle);
    window.scrollTo(0, 0);
  }

  async function loadMoreUsers() {
    let loadingTimeout = setTimeout(() => {
      setCardsStatus(PROFILES_STATUS.paginationLoading);
    }, 250);

    const [res, err] = await httpClient(
      "GET",
      `/users/load-more/${users.page + 1}`
    );
    clearTimeout(loadingTimeout);

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      setCardsStatus(PROFILES_STATUS.paginationError);
      return;
    }

    const updatedUsers = [...users.users, ...res.data];
    setUsers({
      ...users,
      users: updatedUsers,
      page: users.page + 1,
      usersToLoad: users.len > updatedUsers.length ? true : false,
    });
    setCardFocusIndex(users.users.length);
    setCardsStatus(PROFILES_STATUS.idle);
  }

  async function resetFilters() {
    let loadingTimeout = setTimeout(() => {
      setPageStatus(PROFILES_STATUS.initialLoading);
    }, 250);

    const [res, err] = await httpClient("GET", "/users");
    clearTimeout(loadingTimeout);

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      setPageStatus(PROFILES_STATUS.initialError);
      return;
    }

    setUsers({
      users: res.data.users,
      len: res.data.len,
      page: 1,
      usersToLoad: res.data.len > 25 ? true : false,
    });
    setFilters({
      isWebDevChecked: false,
      isUIUXChecked: false,
      isIOSChecked: false,
      isAndroidChecked: false,
      isUsingCurrLocationFilter: false,
      selectedWithinMiles: 0,
      chosenLocationLat: 0,
      chosenLocationLon: 0,
      isUsingRelocateToFilter: false,
      chosenRelocateToObj: {},
      sortChoice: "acending(oldest-newest)",
    });
    setCardFocusIndex(0);
    setResetToggle();
    setPageStatus(PROFILES_STATUS.idle);
  }
  return (
    <ProfilesPageContainer headerHeight={headerHeight}>
      <div className="header-container">
        <MainHeader setHeaderHeight={setHeaderHeight} />
        <Filters
          updateUsers={getFilteredUsers}
          currentUsers={users.users.length}
          totalUsers={users.len}
          resetFilters={resetFilters}
          resetFilterToggle={resetToggle}
          headerHeight={headerHeight}
        />
      </div>

      <div className="main-container">
        <main id="main-content" tabIndex="-1" aria-labelledby="main-heading">
          <Helmet>
            <title>Profiles • Tech Profiles</title>
          </Helmet>
          <h1 id="main-heading" className="sr-only">
            Profiles
          </h1>

          {pageStatus === PROFILES_STATUS.initialLoading ||
          pageStatus === PROFILES_STATUS.filtersLoading ? (
            <div
              role="feed"
              className="skeleton-section"
              aria-busy="true"
              aria-labelledby="profiles-heading"
            >
              <h2 id="profiles-heading">Loading Profiles</h2>
              <Spacer size="20" axis="vertical" />
              <ConstructionPageIcon className="page-icon" />
            </div>
          ) : null}

          {pageStatus === PROFILES_STATUS.initialError ||
          pageStatus === PROFILES_STATUS.filtersError ? (
            <div
              role="feed"
              className="skeleton-section"
              aria-labelledby="profiles-heading"
            >
              <h2 id="profiles-heading">Page Error</h2>
              <Spacer size="20" axis="vertical" />
              <ErrorPageIcon className="page-icon" />
            </div>
          ) : null}

          {pageStatus === PROFILES_STATUS.idle ? (
            <UserCards
              users={users.users}
              loadMoreUsers={loadMoreUsers}
              usersToLoad={users.usersToLoad}
              cardFocusIndex={cardFocusIndex}
              isIdle={cardsStatus === PROFILES_STATUS.idle}
              isBusy={cardsStatus === PROFILES_STATUS.paginationLoading}
              isError={cardsStatus === PROFILES_STATUS.paginationError}
              currentUsers={users.users.length}
              totalUsers={users.len}
              resetFilters={resetFilters}
            />
          ) : null}
        </main>
      </div>
    </ProfilesPageContainer>
  );
}

const ProfilesPageContainer = styled.div`
  .main-container {
    padding-top: ${(props) => `calc(1px + 4.4rem + ${props.headerHeight}px);`};

    @media (min-width: 600px) {
      padding-top: ${(props) => `calc(${props.headerHeight}px);`};
      padding-left: 200px;
    }

    @media (min-width: 800px) {
      padding-left: 275px;
    }
  }

  .header-container {
    position: fixed;
    top: 0;
    left: 0;
    /* second mobile */
    z-index: 20;
    width: 100%;
    border-bottom: solid 1px rgba(229, 231, 235, 0.8);

    @media (min-width: 600px) {
      border: none;
    }
  }

  main {
    min-height: 100vh;
    padding: 30px 5px 50px;

    @media (min-width: 600px) {
      padding-left: 15px;
      padding-right: 15px;
    }

    .skeleton-section {
      text-align: center;

      .page-icon {
        max-width: 750px;
      }
    }
  }
`;

export default ProfilesPage;
