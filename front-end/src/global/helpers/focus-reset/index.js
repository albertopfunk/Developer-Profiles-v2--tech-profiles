import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

function FocusReset({ location, children }) {
  const [previousLocation, setPreviousLocation] = useState(location.pathname);

  let focusRef = React.createRef();

  useEffect(() => {
    if (focusRef.current && previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
      window.scroll(0, 0);
      focusRef.current.focus();
    }
  }, [focusRef, location.pathname, previousLocation]);

  console.log("-- Focus Reset --");

  if (location.pathname === "/callback") {
    return (
      <FocusContainer tabIndex="-1" ref={focusRef}>
        {children}
      </FocusContainer>
    );
  }

  return (
    <FocusContainer tabIndex="-1" ref={focusRef}>
      <ul aria-label="skip links">
        <li>
          <a href={`${location.pathname}#main-content`} className="skip-link">
            <span>Skip to Main Content</span>
          </a>
        </li>

        {location.pathname === "/" ? (
          <li>
            <a href={`${location.pathname}#filters`} className="skip-link">
              <span>Skip to Filters</span>
            </a>
          </li>
        ) : null}

        {location.pathname.includes("dashboard") ? (
          <>
            <li>
              <a
                href={`${location.pathname}#page-navigation`}
                className="skip-link"
              >
                <span>Skip to Page Navigation</span>
              </a>
            </li>
            <li>
              <a
                href={`${location.pathname}#profile-card-container`}
                className="skip-link"
              >
                <span>Skip to User Card</span>
              </a>
            </li>
          </>
        ) : null}
      </ul>
      {children}
    </FocusContainer>
  );
}

const FocusContainer = styled.div`
  .sr-only {
    position: absolute;
    clip: rect(0, 0, 0, 0);
    height: 1px;
    width: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
  }

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
