import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

function FocusReset({ location, children }) {
  const [previousLocation, setPreviousLocation] = useState("");
  const [pageLoaded, setPageLoaded] = useState(false);

  let focusRef = React.createRef();

  useEffect(() => {
    setTimeout(() => {
      setPageLoaded(true);
    }, 300);
  }, []);

  useEffect(() => {
    if (focusRef.current && previousLocation !== location.pathname) {
      setPreviousLocation(location.pathname);
      window.scroll(0, 0);
      focusRef.current.focus();
    }
  }, [focusRef, previousLocation, location.pathname]);

  useEffect(() => {
    if (previousLocation !== location.pathname) {
      setPageLoaded(false);
      setTimeout(() => {
        setPageLoaded(true);
      }, 300);
    }
  }, [previousLocation, location.pathname]);

  const currentLocation = location.pathname.split(/[/-]/).join(" ");

  return (
    <FocusContainer tabIndex="-1" ref={focusRef}>
      {pageLoaded ? (
        <p role="alert">{`Navigated to ${currentLocation} • Tech Profiles, press tab for skip links`}</p>
      ) : null}
      <ul>
        <li>
          <a href={`${location.pathname}#main-heading`} className="skip-link">
            <span>Skip to Main Content</span>
          </a>
        </li>

        {/* <li>
          <a href={`${location.pathname}#filters-heading`} className="skip-link">
            <span>Skip to Filters</span>
          </a>
        </li> */}

        <li>
          <a
            href={`${location.pathname}#page-navigation`}
            className="skip-link"
          >
            <span>Skip to Page Navigation</span>
          </a>
        </li>
        <li>
          <a href={`${location.pathname}#profile-card`} className="skip-link">
            <span>Skip to User Card</span>
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
