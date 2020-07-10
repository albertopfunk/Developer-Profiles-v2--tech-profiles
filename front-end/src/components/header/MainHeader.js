import React from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";
import { ReactComponent as BurgerMenu } from "./menu.svg";
import { ReactComponent as MenuClose } from "./close.svg";

import auth0Client from "../../auth/Auth";
import { useState } from "react";

function MainHeader(props) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  function signOut() {
    auth0Client.signOut();
    props.history.replace("/");
  }

  function toggleMobileNav() {
    setIsMobileNavOpen(!isMobileNavOpen);
  }

  function closeMobileNav() {
    if (isMobileNavOpen) {
      setIsMobileNavOpen(false);
    }
  }

  return (
    <Header>
      <nav aria-label="site" className="desktop-nav">
        <ul id="nav-logo">
          <li>
            <Link to="/">
              <img
                src="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
                alt=""
              />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        </ul>

        <ul id="nav-menu">
          <li>
            <Link to="/profiles">Profiles</Link>
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
            <Link onClick={closeMobileNav} to="/">
              <img
                src="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_45/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
                alt=""
              />
              <span className="sr-only">Home</span>
            </Link>
          </li>
        </ul>

        <button
          id="menu-button"
          aria-haspopup="true"
          aria-controls="nav-menu"
          onClick={toggleMobileNav}
        >
          {isMobileNavOpen ? (
            <>
              <span aria-hidden="true">
                <MenuClose />
              </span>
              <span className="sr-only">Close</span>
            </>
          ) : (
            <>
              <span aria-hidden="true">
                <BurgerMenu />
              </span>
              <span className="sr-only">Open</span>
            </>
          )}
        </button>

        <ul
          id="nav-menu"
          aria-labelledby="menu-button"
          className={`${isMobileNavOpen ? "_" : "hidden"}`}
        >
          <li>
            <Link onClick={toggleMobileNav} to="/profiles">
              Profiles
            </Link>
          </li>
          {auth0Client.isAuthenticated() ? (
            <>
              <li>
                <Link onClick={toggleMobileNav} to="/profile-dashboard">
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
