import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

function FocusReset({ location, children }) {
  const [previousLocation, setPreviousLocation] = useState("");

  let focusRef = React.createRef();

  useEffect(() => {
    if (focusRef.current && previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
      focusRef.current.focus();
    }
  }, [focusRef, previousLocation, location.pathname]);

  return (
    <FocusContainer tabIndex="-1" ref={focusRef}>
      <a href={`${location.pathname}#main-heading`} className="skip-link">
        <span>Skip to Main Content</span>
      </a>
      <a href={`${location.pathname}#profile-card`} className="skip-link">
        <span>Skip to User Card</span>
      </a>
      {children}
    </FocusContainer>
  );
}

const FocusContainer = styled.div`
  .skip-link {
    position: absolute;
    top: 2%;
    left: -999px;
    z-index: 15;

    &:focus {
      left: 2%;
    }

    span {
      display: inline-block;
      padding: 0.7em;
      background-color: antiquewhite;
      border: solid;
    }
  }
`;

export default withRouter(FocusReset);
