import React from "react";
import styled from "styled-components";

function UserSummary({ userId, summary }) {
  return (
    <SummaryContainer>
      {summary ? (
        <p id={`profile-${userId}-summary`} className="summary">
          {summary}
        </p>
      ) : null}
    </SummaryContainer>
  );
}

const SummaryContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 3 / 4;
  place-self: center;
  text-align: center;
`;

export default UserSummary;
