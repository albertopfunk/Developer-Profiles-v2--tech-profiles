import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

function FocusReset({ location, children }) {
  const [previousLocation, setPreviousLocation] = useState(location.pathname);
  const [currentMainContentEl, setCurrentMainContentEl] = useState("")

  let focusRef = React.createRef();
  let currentLocation;

  useEffect(() => {
    if (focusRef.current && previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
      window.scroll(0, 0);
      focusRef.current.focus();
    }
  }, [focusRef, location.pathname, previousLocation]);

  function checkIds() {
    console.log("EL", document.querySelector('[data-main-content]'))
    console.log(currentMainContentEl)

    const mainContentId = document.querySelector('[data-main-content]').id
    console.log("ID", mainContentId)
    setCurrentMainContentEl(mainContentId)
  }

  if (location.pathname === "/callback") {
    return (
      <FocusContainer tabIndex="-1" ref={focusRef}>
        {children}
      </FocusContainer>
    );
  }

  if (location.pathname.includes("dashboard")) {
    currentLocation = location.pathname.split(/[/-]/).join(" ").trim();
    return (
      <FocusContainer
        ref={focusRef}
        tabIndex="-1"
        aria-label={`Navigated to ${currentLocation}, press tab for skip links`}
      >
        <ul aria-label="skip links">
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
              href={`${location.pathname}#${currentMainContentEl}`}
              className="skip-link"
              onFocus={checkIds}
            >
              <span>Skip to profile Information</span>
            </a>
          </li>

          <li>
            <a href={`${location.pathname}#profile-card`} className="skip-link">
              <span>Skip to Profile Card</span>
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
        tabIndex="-1"
        aria-label={"Navigated to profiles page, press tab for skip links"}
      >
        <ul aria-label="skip links">
          <li>
            <a href={`${location.pathname}#filters`} className="skip-link">
              <span>Skip to Filters</span>
            </a>
          </li>

          <li>
            <a
              href={`${location.pathname}#profiles-feed`}
              className="skip-link"
            >
              <span>Skip to Profiles Feed</span>
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
      tabIndex="-1"
      aria-label={`Navigated to ${currentLocation}, press tab for skip links`}
    >
      <ul aria-label="skip links">
        <li>
          <a href={`${location.pathname}#main-content`} className="skip-link">
            <span>Main Content</span>
          </a>
        </li>
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
