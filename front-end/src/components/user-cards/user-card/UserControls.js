import React from "react";
import styled from "styled-components";

// Test Ideas
// renders expand button if card is not expanded
// renders close button if card is expanded

function UserControls(props) {
  return (
    <Section>
      {!props.isCardExpanded ? (
        <button onClick={() => props.expandUserCard(props.id)}>Expand</button>
      ) : (
        <button onClick={props.closeUserCard}>Close</button>
      )}
    </Section>
  );
}

const Section = styled.section`
  border: solid red;
`;

export default UserControls;
