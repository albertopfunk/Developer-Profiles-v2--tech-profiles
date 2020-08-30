import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import Announcer from "../announcer";

function FocusReset({ location, children }) {
  const [previousLocation, setPreviousLocation] = useState(location.pathname);
  const [shouldAnnounce, setShouldAnnounce] = useState(false);

  let focusRef = React.createRef();

  useEffect(() => {
    if (focusRef.current && previousLocation !== location.pathname) {
      if (!shouldAnnounce) setShouldAnnounce(true);
      setPreviousLocation(location.pathname);
      window.scroll(0, 0);
      focusRef.current.focus();
    }
  }, [focusRef, location.pathname, previousLocation, shouldAnnounce]);

  let currentLocation;
  if (location.pathname === "/") {
    currentLocation = "profiles page";
  } else if (location.pathname.includes("dashboard")) {
    currentLocation = location.pathname.split(/[/-]/).join(" ").trim();
  } else if (location.pathname === "/authorize") {
    currentLocation = "authorize page";
  } else if (location.pathname === "/private-policy") {
    currentLocation = "private policy page";
  } else {
    currentLocation = "page not found";
  }

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
      {shouldAnnounce ? (
        <Announcer
          announcement={`Navigated to ${currentLocation} • Tech Profiles, press tab for skip links`}
          ariaId="navigation-announcer"
        />
      ) : null}
      <ul>
        <li>
          <a href={`${location.pathname}#main-content`} className="skip-link">
            <span>Skip to Main Content</span>
          </a>
        </li>

        {currentLocation === "profiles page" ? (
          <li>
            <a href={`${location.pathname}#filters`} className="skip-link">
              <span>Skip to Filters</span>
            </a>
          </li>
        ) : null}

        {currentLocation.includes("dashboard") ? (
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
