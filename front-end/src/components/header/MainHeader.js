import React from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import { ReactComponent as BurgerMenu } from "./menu.svg";
import { ReactComponent as MenuClose } from "./close.svg";

import auth0Client from "../../auth/Auth";
import { useState } from "react";
import Announcer from "../../global/helpers/announcer";

function MainHeader(props) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [shouldAnnounce, setShouldAnnounce] = useState(false);

  function signOut() {
    auth0Client.signOut();
    props.history.replace("/");
  }

  function openMobileNav() {
    setIsMobileNavOpen(true);
    setShouldAnnounce(true);
  }

  function closeMobileNav() {
    setIsMobileNavOpen(false);
    setShouldAnnounce(true);
  }

  function resetNav() {
    setIsMobileNavOpen(false);
    setShouldAnnounce(false);
  }

  return (
    <Header>
      {shouldAnnounce && isMobileNavOpen ? (
        <Announcer announcement="Opened Mobile Navigation" />
      ) : null}
      {shouldAnnounce && !isMobileNavOpen ? (
        <Announcer announcement="Closed Mobile Navigation" />
      ) : null}
      <nav aria-label="site" className="desktop-nav">
        <ul id="nav-logo">
          <li>
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
                alt=""
              />
              <span className="sr-only">Home Page</span>
            </Link>
          </li>
        </ul>

        <ul id="nav-menu">
          <li>
            <Link to="/">Profiles</Link>
          </li>
          {auth0Client.isAuthenticated() ? (
            <>
              <li>
                <Link to="/profile-dashboard">Dashboard</Link>
              </li>
              <li>
                <button type="button" onClick={signOut}>
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <button type="button" onClick={auth0Client.signIn}>
                Sign In
              </button>
            </li>
          )}
        </ul>
      </nav>

      <nav aria-label="site" className="mobile-nav">
        <ul id="nav-logo">
          <li>
            <Link onClick={resetNav} to="/">
              <img
                src="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_45/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
                alt=""
              />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        </ul>

        {isMobileNavOpen ? (
          <button
            id="menu-button"
            aria-haspopup="true"
            aria-controls="nav-menu"
            onClick={closeMobileNav}
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
            aria-controls="nav-menu"
            onClick={openMobileNav}
          >
            <span aria-hidden="true">
              <BurgerMenu />
            </span>
            <span className="sr-only">Open</span>
          </button>
        )}

        <ul
          id="nav-menu"
          aria-labelledby="menu-button"
          className={`${isMobileNavOpen ? "_" : "hidden"}`}
        >
          <li>
            <Link onClick={resetNav} to="/">
              Profiles
            </Link>
          </li>
          {auth0Client.isAuthenticated() ? (
            <>
              <li>
                <Link onClick={resetNav} to="/profile-dashboard">
                  Dashboard
                </Link>
              </li>
              <li>
                <button type="button" onClick={signOut}>
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <li>
              <button type="button" onClick={auth0Client.signIn}>
                Sign In
              </button>
            </li>
          )}
        </ul>
      </nav>
    </Header>
  );
}

const Header = styled.header`
  background-color: white;
  width: 100%;
  padding: 0.3em 1em;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;

  nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  ul,
  li {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  #nav-logo {
    /* unsure why there is bottom 'content' padding */
    /* adding padding top to even out a bit */
    padding-top: 7.5px;
  }

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

  .hidden {
    display: none;
  }

  .mobile-nav {
    #menu-button {
      border: none;
      background: white;
      padding: 0.4em;
    }

    #nav-menu {
      background-color: white;
      padding: 0.7em;
      position: absolute;
      right: 0;
      top: 100%;
    }
  }
  .desktop-nav {
    display: none;
  }

  @media (min-width: 1100px) {
    .desktop-nav {
      display: flex;
      #nav-menu {
        display: flex;
      }
    }
    .mobile-nav {
      display: none;
    }
  }
`;

export default withRouter(MainHeader);
