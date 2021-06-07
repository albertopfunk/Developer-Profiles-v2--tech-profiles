import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

function FocusReset({ location, children }) {
  const [previousLocation, setPreviousLocation] = useState(location.pathname);
  const [currentMainContentEl, setCurrentMainContentEl] = useState("");
  const [currentFilterEl, setCurrentFilterEl] = useState("");
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
    const mainContent = document.querySelector("[data-main-content='true']");
    const mainContentId = mainContent?.id ?? "";
    setCurrentMainContentEl(mainContentId);
  }

  function getFilterId() {
    const filter = document.querySelector("[data-filter-content='true']");
    const filterId = filter?.id ?? "";
    setCurrentFilterEl(filterId);
  }

  function getUserCardId() {
    const userCard = document.querySelector("[data-user-card='true']");
    const userCardId = userCard?.id ?? "";
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
            <a
              href={`${location.pathname}#${currentMainContentEl}`}
              className="skip-link"
              onFocus={getMainContentId}
            >
              Skip to Main Content
            </a>
          </li>

          <li>
            <a
              href={`${location.pathname}#${currentUserCardEl}`}
              className="skip-link"
              onFocus={getUserCardId}
            >
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
        tabIndex="-1"
        aria-label={"Navigated to profiles page, press tab for skip links"}
      >
        <ul aria-label="skip links" className="skip-links">
          <li>
            <a
              href={`${location.pathname}#${currentFilterEl}`}
              className="skip-link"
              onFocus={getFilterId}
            >
              Skip to Filters
            </a>
          </li>

          <li>
            <a
              href={`${location.pathname}#${currentUserCardEl}`}
              className="skip-link"
              onFocus={getUserCardId}
            >
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
    z-index: 100;
    border: solid 0.5px;
    background-color: white;
    padding: 5px;

    &:focus {
      left: 2%;
    }
  }
`;

export default withRouter(FocusReset);
