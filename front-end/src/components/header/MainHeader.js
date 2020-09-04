import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import { ReactComponent as BurgerMenu } from "./menu.svg";
import { ReactComponent as MenuClose } from "./close.svg";

let closeOnBlurWait;
function MainHeader({ isValidated, signOut, signIn, location }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [shouldAnnounce, setShouldAnnounce] = useState(false);
  const [shouldAnnounceNav, setShouldAnnounceNav] = useState(false);
  const [previousLocation, setPreviousLocation] = useState(location.pathname);

  useEffect(() => {
    return () => clearTimeout(closeOnBlurWait);
  }, []);

  useEffect(() => {
    if (location.pathname !== previousLocation) {
      setPreviousLocation(location.pathname);
      setShouldAnnounceNav(true);
      return;
    }
  }, [location, previousLocation]);

  function openMobileNav() {
    setIsMobileNavOpen(true);
    setShouldAnnounce(true);
  }

  function closeMobileNav() {
    setIsMobileNavOpen(false);
    setShouldAnnounce(true);
  }

  function closeMobileNavOnBlur() {
    function closeOnBlurTimeOut() {
      if (
        document.activeElement.id !== "menu-button" &&
        document.activeElement.className !== "nav-item"
      ) {
        setIsMobileNavOpen(false);
        setShouldAnnounce(false);
      }
    }

    closeOnBlurWait = setTimeout(() => {
      closeOnBlurTimeOut();
    }, 13);
  }

  console.log("-- Main Header --");

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

  return (
    <Header>
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
        aria-relevant="additions text"
      >
        {shouldAnnounce && isMobileNavOpen ? "Opened SubMenu" : null}
        {shouldAnnounce && !isMobileNavOpen ? "Closed SubMenu" : null}
      </div>

      <div
        className="sr-only"
        aria-live="assertive"
        aria-atomic="true"
        aria-relevant="additions text"
      >
        {shouldAnnounceNav
          ? `Navigated to ${currentLocation} • Tech Profiles, press tab for skip links`
          : null}
      </div>

      <Nav aria-label="site">
        <Link to="/" aria-hidden="true" tabIndex="-1">
          <img
            src="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
            alt=""
          />
        </Link>

        {isValidated ? (
          <>
            {isMobileNavOpen ? (
              <button
                id="menu-button"
                aria-haspopup="true"
                aria-controls="nav-group"
                onClick={closeMobileNav}
                onBlur={closeMobileNavOnBlur}
              >
                <span aria-hidden="true">
                  <MenuClose />
                </span>
                <span className="sr-only">Close</span>
              </button>
            ) : (
              <button
                id="menu-button"
                aria-haspopup="true"
                aria-controls="nav-group"
                onClick={openMobileNav}
              >
                <span aria-hidden="true">
                  <BurgerMenu />
                </span>
                <span className="sr-only">Open</span>
              </button>
            )}

            <ul
              id="nav-group"
              aria-label="sub menu"
              className={`${isMobileNavOpen ? "_" : "hidden"}`}
            >
              <li>
                <Link
                  to="/"
                  className="nav-item"
                  onClick={closeMobileNavOnBlur}
                  onBlur={closeMobileNavOnBlur}
                >
                  Profiles
                </Link>
              </li>
              <li>
                <Link
                  to="/profile-dashboard"
                  className="nav-item"
                  onClick={closeMobileNavOnBlur}
                  onBlur={closeMobileNavOnBlur}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  className="nav-item"
                  type="button"
                  onClick={signOut}
                  onBlur={closeMobileNavOnBlur}
                >
                  Sign Out
                </button>
              </li>
            </ul>
          </>
        ) : (
          <button type="button" onClick={signIn}>
            Sign In
          </button>
        )}
      </Nav>
    </Header>
  );
}

const Header = styled.header`
  background-color: white;
  width: 100%;
  height: 100px;
  padding: 0.3em 1em;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;

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
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;

  .hidden {
    display: none;
  }

  #menu-button {
    border: none;
    background: white;
    padding: 0.4em;
  }

  #nav-group {
    list-style: none;
    background-color: white;
    padding: 0.7em;
    position: absolute;
    right: 0;
    top: 100%;
  }
`;

export default withRouter(MainHeader);
