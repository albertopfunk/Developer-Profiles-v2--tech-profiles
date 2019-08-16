import React from "react";
import UserCard from "./UserCard";
// import styled from "styled-components";

function UserCardsContainer(props) {
  return (
    <section>
      {props.users.length === 0 ? (
        <h1>No Users Here! - Reset filters BTN</h1>
      ) : (
        <>
          {props.users.map(user => {
            return (
              <UserCard
                key={user.id}
                id={user.id}
                email={user.public_email}
                firstName={user.first_name}
                lastName={user.last_name}
                image={user.image}
                title={user.desired_title}
                areaOfWork={user.area_of_work}
                summary={user.summary}
                currentLocation={user.current_location_name}
                interestedLocations={user.interested_location_names}
                github={user.github}
                linkedin={user.linkedin}
                portfolio={user.portfolio}
                topSkills={user.top_skills}
                additionalSkills={user.additional_skills}
              />
            );
          })}
        </>
      )}
    </section>
  );
}

const MemoUserCardsContainer = React.memo(UserCardsContainer);

export default MemoUserCardsContainer;
