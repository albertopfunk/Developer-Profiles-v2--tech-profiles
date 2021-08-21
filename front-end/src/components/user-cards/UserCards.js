import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import UserCard from "./user-card/UserCard";
import ControlButton from "../forms/buttons/ControlButton";

import Spacer from "../../global/helpers/spacer";

function UserCards({
  users,
  loadMoreUsers,
  usersToLoad,
  cardFocusIndex,
  isIdle,
  isBusy,
  isError,
  currentUsers,
  totalUsers,
  resetFilters,
}) {
  const profileCardRefs = users.map(() => React.createRef());
  let focusOnNextCardRef = useRef();

  useEffect(() => {
    if (!focusOnNextCardRef.current) {
      return;
    }
    profileCardRefs[cardFocusIndex].current.focus();
    focusOnNextCardRef.current = false;
  }, [cardFocusIndex]);

  function backToTopFocus(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }
    profileCardRefs[0].current.focus();
    window.scrollTo(0, 0);
  }

  function backToTop() {
    window.scrollTo(0, 0);
  }

  function loadMoreFocus(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }
    focusOnNextCardRef.current = true;
  }

  function userCardActions(action, index) {
    // focus on feed container
    if (action === "start") {
      profileCardRefs[0].current.focus();
    }

    // focus on bottom button
    if (action === "end") {
      profileCardRefs[currentUsers - 1].current.focus();
    }

    if (action === "previous") {
      if (index === 0) {
        profileCardRefs[currentUsers - 1].current.focus();
        return;
      }
      profileCardRefs[index - 1].current.focus();
    }

    if (action === "next") {
      if (index === currentUsers - 1) {
        profileCardRefs[0].current.focus();
        return;
      }
      profileCardRefs[index + 1].current.focus();
    }
  }

  if (totalUsers === 0) {
    return (
      <Feed
        id="profile-cards"
        tabIndex="-1"
        role="feed"
        aria-busy={isBusy}
        aria-labelledby="profiles-heading"
      >
        <h2 id="profiles-heading" className="sr-only">
          Current Profiles
        </h2>
        <Spacer axis="vertical" size="50" />
        <div className="feed-control">
          <p className="info-mssg">No Users Here!</p>
          <Spacer axis="vertical" size="5" />
          <ControlButton
            type="reset"
            onClick={resetFilters}
            buttonText="reset filters"
          />
        </div>
      </Feed>
    );
  }

  return (
    <Feed
      id="profile-cards"
      role="feed"
      aria-busy={isBusy}
      aria-labelledby="profiles-heading"
    >
      <h2 id="profiles-heading" className="sr-only">
        Current Profiles
      </h2>

      <div className="feed-grid">
        {users.map((user, i) => {
          return (
            <UserCard
              ref={profileCardRefs[i]}
              key={user.id}
              userCardActions={userCardActions}
              index={i}
              totalUsers={totalUsers}
              userId={user.id}
              areaOfWork={user.area_of_work}
              email={user.public_email}
              profileImage={user.profile_image}
              avatarImage={user.avatar_image}
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
          );
        })}
      </div>

      <Spacer axis="vertical" size="50" />

      <div className="feed-control">
        {isIdle && usersToLoad ? (
          <ControlButton
            type="button"
            onClick={loadMoreUsers}
            onKeyDown={(e) => loadMoreFocus(e)}
            buttonText="load more profiles"
          />
        ) : null}

        {isIdle && !usersToLoad ? (
          <>
            <p className="info-mssg">No more profiles to load</p>
            <Spacer axis="vertical" size="5" />
            <ControlButton
              type="button"
              onClick={backToTop}
              onKeyDown={(e) => backToTopFocus(e)}
              buttonText="back to top"
              ariaLabel="no more profiles to load, back to top"
            />
          </>
        ) : null}

        {isBusy ? (
          <ControlButton type="button" disabled="true" buttonText="loading" />
        ) : null}

        {isError ? (
          <>
            <p>Error loading profiles</p>
            <ControlButton
              type="button"
              onClick={loadMoreUsers}
              onKeyDown={(e) => loadMoreFocus(e)}
              buttonText="retry"
              ariaLabel="error loading profiles, retry"
            />
          </>
        ) : null}
      </div>
    </Feed>
  );
}

const Feed = styled.div`
  padding-bottom: 30px;

  button {
    width: 100%;
    max-width: 450px;
  }

  .feed-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(550px, 100%), 1fr));
    justify-items: center;
    align-items: start;
    grid-gap: 50px;
  }

  .feed-control {
    width: 90%;
    margin: 0 auto;
    text-align: center;
  }
`;

const MemoUserCards = React.memo(UserCards);

export default MemoUserCards;
