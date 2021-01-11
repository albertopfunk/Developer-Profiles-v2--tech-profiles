import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import UserCard from "./user-card/UserCard";

function UserCards(props) {
  const profileCardRefs = useRef(props.users.map(() => React.createRef()));
  let focusOnNextCardRef = useRef();

  useEffect(() => {
    if (!focusOnNextCardRef.current) {
      return;
    }
    profileCardRefs.current[props.nextCardIndex].current.focus();
    focusOnNextCardRef.current = false;
  }, [props.nextCardIndex]);

  function backToTopFocus(e) {
    if (e.keyCode !== 13 && e.keyCode !== 32) {
      return;
    }
    profileCardRefs.current[0].current.focus();
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
      profileCardRefs.current[0].current.focus();
    }

    if (action === "end") {
      profileCardRefs.current[props.currentUsers - 1].current.focus();
    }

    if (action === "previous") {
      if (index === 0) {
        profileCardRefs.current[props.currentUsers - 1].current.focus();
        return;
      }
      profileCardRefs.current[index - 1].current.focus();
    }

    if (action === "next") {
      if (index === props.currentUsers - 1) {
        profileCardRefs.current[0].current.focus();
        return;
      }
      profileCardRefs.current[index + 1].current.focus();
    }
  }

  return (
    <Feed
      role="feed"
      aria-busy={props.isBusy}
      aria-labelledby="profiles-heading"
    >
      <h2 id="profiles-heading" className="sr-only">Current Profiles</h2>
      {props.totalUsers === 0 ? (
        <p>No Users Here! - Reset filters BTN</p>
      ) : (
        <>
          {props.users.map((user, i) => {
            return (
              <UserCard
                ref={profileCardRefs.current[i]}
                key={user.id}
                userCardActions={userCardActions}
                index={i}
                totalUsers={props.totalUsers}
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
            );
          })}
          <div>
            {props.noMoreUsers ? (
              <div>
                <p>No more profiles to load</p>
                <button
                  type="button"
                  aria-label="no more profiles to load, back to top"
                  onClick={backToTop}
                  onKeyDown={(e) => backToTopFocus(e)}
                >
                  Back to Top
                </button>
              </div>
            ) : (
              <button
                type="button"
                disabled={props.isBusy}
                onClick={props.loadMoreUsers}
                onKeyDown={(e) => loadMoreFocus(e)}
              >
                {props.isBusy ? "Loading" : "Load More Profiles"}
              </button>
            )}
          </div>
        </>
      )}
    </Feed>
  );
}

const Feed = styled.div`
  border: solid greenyellow;
  .back-to-top {
    position: fixed;
    top: 50%;
    right: 5%;
    transform: translateY(-50%);
  }
`;

const MemoUserCards = React.memo(UserCards);

export default MemoUserCards;
