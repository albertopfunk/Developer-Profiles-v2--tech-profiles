import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import { ReactComponent as BurgerMenu } from "./menu.svg";
import { ReactComponent as MenuClose } from "./close.svg";

let closeOnBlurWait;
function MainHeader({ isValidated, signOut, signIn, location }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [announceMenuToggle, setAnnounceMenuToggle] = useState(false);
  const [announceNavChange, setannounceNavChange] = useState(false);
  const [previousLocation, setPreviousLocation] = useState(location.pathname);

  useEffect(() => {
    return () => clearTimeout(closeOnBlurWait);
  }, []);

  useEffect(() => {
    if (location.pathname !== previousLocation) {
      setPreviousLocation(location.pathname);
      setannounceNavChange(true);
      return;
    }
  }, [location, previousLocation]);

  function openMenu() {
    setIsMenuOpen(true);
    setAnnounceMenuToggle(true);
  }

  function closeMenu() {
    setIsMenuOpen(false);
    setAnnounceMenuToggle(true);
  }

  function closeMenuBlur() {
    function closeOnBlurTimeOut() {
      if (
        document.activeElement.id !== "menu-button" &&
        document.activeElement.className !== "nav-item"
      ) {
        setIsMenuOpen(false);
        setAnnounceMenuToggle(false);
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
        aria-live="assertive"
        aria-relevant="additions text"
      >
        {announceMenuToggle && isMenuOpen ? "Opened SubMenu" : null}
        {announceMenuToggle && !isMenuOpen ? "Closed SubMenu" : null}
        {announceNavChange
          ? `Navigated to ${currentLocation} • Tech Profiles, press tab for skip links`
          : null}
      </div>

      <Nav aria-label="site">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
            alt="website logo link to profiles page"
          />
        </Link>

        {isValidated ? (
          <>
            {isMenuOpen ? (
              <button
                id="menu-button"
                type="button"
                aria-label="close sub menu"
                aria-haspopup="true"
                aria-controls="sub-menu-group"
                onClick={closeMenu}
                onBlur={closeMenuBlur}
                >
                <span aria-hidden="true">
                  <MenuClose />
                </span>
              </button>
            ) : (
              <button
                id="menu-button"
                type="button"
                aria-label="open sub menu"
                aria-haspopup="true"
                aria-controls="sub-menu-group"
                onClick={openMenu}
              >
                <span aria-hidden="true">
                  <BurgerMenu />
                </span>
              </button>
            )}

            <ul
              id="sub-menu-group"
              aria-label="sub menu"
              className={`${isMenuOpen ? "_" : "hidden"}`}
            >
              <li>
                <Link
                  to="/"
                  className="nav-item"
                  onClick={closeMenuBlur}
                  onBlur={closeMenuBlur}
                >
                  Profiles
                </Link>
              </li>
              <li>
                <Link
                  to="/profile-dashboard"
                  className="nav-item"
                  onClick={closeMenuBlur}
                  onBlur={closeMenuBlur}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  className="nav-item"
                  type="button"
                  onClick={signOut}
                  onBlur={closeMenuBlur}
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

  #sub-menu-group {
    list-style: none;
    background-color: white;
    padding: 0.7em;
    position: absolute;
    right: 0;
    top: 100%;
  }
`;

export default withRouter(MainHeader);
