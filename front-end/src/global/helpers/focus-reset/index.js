import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

function FocusReset({ location, children }) {
  const [previousLocation, setPreviousLocation] = useState(location.pathname);
  const [currentMainContentEl, setCurrentMainContentEl] = useState("");
  const [currentUserCardEl, setCurrentUserCardEl] = useState("");

  let focusRef = React.createRef();
  let currentLocation;

  useEffect(() => {
    if (focusRef.current && previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
      window.scroll(0, 0);
      focusRef.current.focus();
    }
  }, [focusRef, location.pathname, previousLocation]);

  function getMainContentId() {
    const mainContentId = document.querySelector("[data-main-content]").id;
    setCurrentMainContentEl(mainContentId);
  }

  function getUserCardId() {
    const userCardId = document.querySelector("[data-user-card='true']").id;
    setCurrentUserCardEl(userCardId);
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
              onFocus={getMainContentId}
            >
              <span>Skip to Main Content</span>
            </a>
          </li>

          <li>
            <a
              href={`${location.pathname}#${currentUserCardEl}`}
              className="skip-link"
              onFocus={getUserCardId}
            >
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
            <a href={`${location.pathname}#sorting-select`} className="skip-link">
              <span>Skip to Filters</span>
            </a>
          </li>

          <li>
            <a
              href={`${location.pathname}#${currentUserCardEl}`}
              className="skip-link"
              onFocus={getUserCardId}
            >
              <span>Skip to Main Content</span>
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
