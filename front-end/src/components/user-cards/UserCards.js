import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import UserCard from "./user-card/UserCard";

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
    if (action === "start") {
      profileCardRefs[0].current.focus();
    }

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
      <Feed role="feed" aria-busy={isBusy} aria-labelledby="profiles-heading">
        <h2 id="profiles-heading" className="sr-only">
          Current Profiles
        </h2>
        <p>No Users Here!</p>
        <button type="reset" onClick={resetFilters}>
          reset filters
        </button>
      </Feed>
    );
  }

  return (
    <Feed role="feed" aria-busy={isBusy} aria-labelledby="profiles-heading">
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

      <div className="feed-controls">
        {isIdle && usersToLoad ? (
          <div className="control">
            <button
              type="button"
              className="button button-control"
              onClick={loadMoreUsers}
              onKeyDown={(e) => loadMoreFocus(e)}
            >
              <span className="button-text">Load More Profiles</span>
            </button>
          </div>
        ) : null}

        {isIdle && !usersToLoad ? (
          <div className="control">
            <p>No more profiles to load</p>
            <button
              type="button"
              className="button button-control"
              aria-label="no more profiles to load, back to top"
              onClick={backToTop}
              onKeyDown={(e) => backToTopFocus(e)}
            >
              <span className="button-text">Back to Top</span>
            </button>
          </div>
        ) : null}

        {isBusy ? (
          <div className="control">
            <button
              type="button"
              className="button button-control"
              disabled="true"
            >
              <span className="button-text">Loading</span>
            </button>
          </div>
        ) : null}

        {isError ? (
          <div className="control">
            <p>Error loading profiles</p>
            <button
              type="button"
              className="button button-control"
              aria-label="error loading profiles, retry"
              onClick={loadMoreUsers}
              onKeyDown={(e) => loadMoreFocus(e)}
            >
              <span className="button-text">Retry</span>
            </button>
          </div>
        ) : null}
      </div>
    </Feed>
  );
}

const Feed = styled.div`
  .feed-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(550px, 100%), 1fr));
    justify-items: center;
    align-items: start;
    grid-gap: 50px;
  }

  .feed-controls {
    margin-top: 30px;

    .control {
      width: 90%;
      margin: 0 auto;
      text-align: center;

      button {
        width: 90%;
      }
    }
  }
`;

const MemoUserCards = React.memo(UserCards);

export default MemoUserCards;
