import React from "react";
import styled from "styled-components";

function UserSummary({ userId, summary }) {
  return (
    <SummarySection aria-labelledby={`profile-${userId}-summary-header`}>
      <h4 id={`profile-${userId}-summary-header`} className="sr-only">
        profile summary
      </h4>
      {summary ? (
        <p id={`profile-${userId}-summary`} className="summary">
          {summary}
        </p>
      ) : (
        <p id={`profile-${userId}-summary`} className="sr-only">
          no summary listed
        </p>
      )}
    </SummarySection>
  );
}

const SummarySection = styled.div`
  grid-column: 1 / 2;
  grid-row: 3 / 4;
  place-self: center;
  text-align: center;

  @media (min-width: 1050px) {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
  }
`;

export default UserSummary;
