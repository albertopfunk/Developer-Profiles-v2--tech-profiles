import React from "react";
import styled from "styled-components";

import UserCard from "./user-card/UserCard";

function UserCards(props) {
  function backToTop() {
    window.scrollTo(0, 0);
  }

  return (
    <MainContent id="main-content" tabIndex="-1" role="feed">
      {props.usersLength === 0 ? (
        <p>No Users Here! - Reset filters BTN</p>
      ) : (
        <>
          {props.users.map((user, i) => {
            return (
              <UserCard
                key={user.id}
                usersLength={props.usersLength}
                index={i}
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
            );
          })}
        </>
      )}

      {props.isBusy ? (
        <p>Loading...</p>
      ) : (
        <div>
          {!props.canLoadMore ? (
            <button onClick={props.loadMoreUsers}>Load More</button>
          ) : (
            <div>
              <p>No more users to load</p>
              <button onClick={backToTop}>Back to Top</button>
            </div>
          )}
        </div>
      )}
    </MainContent>
  );
}

const MainContent = styled.main`
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
