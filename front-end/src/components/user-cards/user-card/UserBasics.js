import React from "react";
import styled from "styled-components";

function UserBasics({ userId, firstName, lastName, title, currentLocation }) {
  if (!firstName && !lastName && !title && !currentLocation) {
    return (
      <BasicsSection aria-labelledby={`profile-${userId}-basics-header`}>
        <h4 id={`profile-${userId}-basics-header`} className="sr-only">
          profile basics
        </h4>
        <p>No Info Listed</p>
      </BasicsSection>
    );
  }

  return (
    <BasicsSection aria-labelledby={`profile-${userId}-basics-header`}>
      <h4 id={`profile-${userId}-basics-header`} className="sr-only">
        profile basics
      </h4>
      {firstName || lastName ? (
        <p id={`profile-${userId}-name`} className="name">
          {firstName} {lastName}
        </p>
      ) : null}

      {title ? <p className="title">{title}</p> : null}

      {currentLocation ? <p className="location">{currentLocation}</p> : null}
    </BasicsSection>
  );
}

const BasicsSection = styled.section`
  min-width: fit-content;
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  place-self: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;

  @media (min-width: 1050px) {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    justify-self: start;
    align-self: center;
    text-align: left;
  }
`;

export default UserBasics;
