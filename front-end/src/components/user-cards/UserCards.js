import React, { useEffect, useState } from "react";
import styled from "styled-components";

import UserCard from "./user-card/UserCard";

// Test Ideas
// renders list of articles
// renders 14 articles
// renders additional 14 articles onInfinite() fire

function UserCards(props) {
  const scrollSectionRef = React.createRef();
  const [canScrollUp, setCanScrollUp] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", onInfinite, true);
    return () => {
      window.removeEventListener("scroll", onInfinite, true);
    };
  });

  function onInfinite() {
    if (!canScrollUp) {
      if (window.scrollY > 3000) {
        setCanScrollUp(true);
      }
    }
    if (canScrollUp) {
      if (window.scrollY < 3000) {
        setCanScrollUp(false);
      }
    }

    if (scrollSectionRef.current && !props.isBusy) {
      if (
        scrollSectionRef.current.scrollHeight - window.scrollY <
        scrollSectionRef.current.scrollHeight / 3
      ) {
        props.infiniteScroll();
      }
    }
  }

  function backToTop() {
    window.scrollTo(0, 0);
  }

  return (
    <Section role="feed" aria-busy={props.isBusy} ref={scrollSectionRef}>
      {props.users.length === 0 ? (
        <h1>No Users Here! - Reset filters BTN</h1>
      ) : (
        <div>
          {canScrollUp ? (
            <aside className="back-to-top">
              <button onClick={backToTop}>Back to Top</button>
            </aside>
          ) : null}
          {props.users.map((user, i) => {
            return (
              <UserCard
                usersLength={props.users.length}
                index={i}
                key={user.id}
                id={user.id}
                areaOfWork={user.area_of_work}
                email={user.public_email}
                image={user.image}
                firstName={user.first_name}
                lastName={user.last_name}
                currentLocation={user.current_location_name}
                summary={user.summary}
                title={user.desired_title}
                topSkills={user.top_skills}
                additionalSkills={user.additional_skills}
                github={user.github}
                linkedin={user.linkedin}
                portfolio={user.portfolio}
                interestedLocations={user.interested_location_names}
              />
            );
          })}
        </div>
      )}
      {props.isBusy ? (
        <aside aria-hidden="true">
          <h1>Loading...</h1>
        </aside>
      ) : null}
    </Section>
  );
}

const Section = styled.section`
  border: solid orange;
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
