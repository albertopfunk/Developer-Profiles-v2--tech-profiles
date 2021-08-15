import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

function FocusReset({ location, children }) {
  const [previousLocation, setPreviousLocation] = useState(location.pathname);

  let focusRef = React.createRef();
  let currentLocation;

  useEffect(() => {
    if (focusRef.current && previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
      window.scroll(0, 0);
      focusRef.current.focus();
    }
  }, [focusRef, location.pathname, previousLocation]);

  if (location.pathname === "/callback") {
    return (
      <FocusContainer ref={focusRef} id="focus-reset" tabIndex="-1">
        {children}
      </FocusContainer>
    );
  }

  if (location.pathname.includes("dashboard")) {
    currentLocation = location.pathname.split(/[/-]/).join(" ").trim();
    return (
      <FocusContainer
        ref={focusRef}
        id="focus-reset"
        tabIndex="-1"
        aria-label={`Navigated to ${currentLocation}, press tab for skip links`}
      >
        <ul aria-label="skip links" className="skip-links">
          <li>
            <a
              href={`${location.pathname}#page-navigation`}
              className="skip-link"
            >
              Skip to Page Navigation
            </a>
          </li>

          <li>
            <a href={`${location.pathname}#main-content`} className="skip-link">
              Skip to Main Content
            </a>
          </li>

          <li>
            <a href={`${location.pathname}#profile-card`} className="skip-link">
              Skip to Profile Card
            </a>
          </li>
        </ul>
        {children}
      </FocusContainer>
    );
  }

  if (location.pathname === "/") {
    return (
      <FocusContainer
        ref={focusRef}
        id="focus-reset"
        tabIndex="-1"
        aria-label={"Navigated to profiles page, press tab for skip links"}
      >
        <ul aria-label="skip links" className="skip-links">
          <li>
            <a href={`${location.pathname}#filters`} className="skip-link">
              Skip to Filters
            </a>
          </li>

          <li>
            <a href={`${location.pathname}#main-content`} className="skip-link">
              Skip to Main Content
            </a>
          </li>
        </ul>
        {children}
      </FocusContainer>
    );
  }

  if (location.pathname === "/authorize") {
    currentLocation = "authorize page";
  } else if (location.pathname === "/private-policy") {
    currentLocation = "private policy page";
  } else {
    currentLocation = "page not found";
  }

  return (
    <FocusContainer
      ref={focusRef}
      id="focus-reset"
      tabIndex="-1"
      aria-label={`Navigated to ${currentLocation}, press tab for skip links`}
    >
      <ul aria-label="skip links" className="skip-links">
        <li>
          <a href={`${location.pathname}#main-content`} className="skip-link">
            Main Content
          </a>
        </li>
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
    /* fourth */
    z-index: 40;
    border: solid 0.5px;
    background-color: white;
    padding: 5px;

    &:focus {
      left: 2%;
    }
  }
`;

export default withRouter(FocusReset);
