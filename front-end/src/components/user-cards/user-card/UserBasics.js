import React from "react";
import styled from "styled-components";

function UserBasics({ userId, firstName, lastName, title, currentLocation }) {
  if (!firstName && !lastName && !title && !currentLocation) {
    return (
      <BasicsContainer>
        <p>No Info Listed</p>
      </BasicsContainer>
    );
  }

  return (
    <BasicsContainer>
      {firstName || lastName ? (
        <p id={`profile-${userId}-name`} className="name">
          {firstName} {lastName}
        </p>
      ) : null}

      {title ? <p className="title">{title}</p> : null}

      {currentLocation ? <p className="location">{currentLocation}</p> : null}
    </BasicsContainer>
  );
}

const BasicsContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 1 / 2;
  place-self: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-align: center;
`;

export default UserBasics;
