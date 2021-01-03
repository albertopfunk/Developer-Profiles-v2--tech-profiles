import React, { useEffect, useRef } from "react";
import styled from "styled-components";

import UserCard from "./user-card/UserCard";

function UserCards(props) {
  const feedSectionRef = useRef(null);
  const profileCardRefs = useRef(props.users.map(() => React.createRef()));
  const feedButtonRef = useRef(null);

  useEffect(() => {
    if (props.focusOnNextCard !== 0) {
      profileCardRefs.current[props.focusOnNextCard].current.focus();
    }
  }, [props.focusOnNextCard]);

  function backToTop() {
    window.scrollTo(0, 0);
    feedSectionRef.current.focus();
  }

  function userCardActions(action, index) {
    if (action === "start") {
      feedSectionRef.current.focus();
    }

    if (action === "end") {
      feedButtonRef.current.focus();
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
    <FeedSection ref={feedSectionRef} aria-labelledby="profiles-heading">
      <h2 id="profiles-heading">Current Profiles</h2>
      {props.totalUsers === 0 ? (
        <p>No Users Here! - Reset filters BTN</p>
      ) : (
        <>
          <ul aria-busy={props.isBusy} aria-label="profiles-feed">
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
          </ul>
          <div>
            {props.noMoreUsers ? (
              <div>
                <p>No more profiles to load</p>
                <button
                  type="button"
                  ref={feedButtonRef}
                  aria-label="no more profiles to load, back to top"
                  onClick={backToTop}
                >
                  Back to Top
                </button>
              </div>
            ) : (
              /*
                Alternatively, authors MAY include an article at either or 
                both ends of the loaded set of articles that includes an element, 
                such as a button, that lets the user request more articles to be loaded

                should this be inside the feed container?
              */
              <button
                type="button"
                ref={feedButtonRef}
                disabled={props.isBusy}
                onClick={props.loadMoreUsers}
              >
                {props.isBusy ? "Loading" : "Load More Profiles"}
              </button>
            )}
          </div>
        </>
      )}
    </FeedSection>
  );
}

const FeedSection = styled.section`
  padding-left: 300px;
  .back-to-top {
    position: fixed;
    top: 50%;
    right: 5%;
    transform: translateY(-50%);
  }
`;

const MemoUserCards = React.memo(UserCards);

export default MemoUserCards;
