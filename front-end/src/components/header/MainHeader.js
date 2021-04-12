import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as BurgerMenu } from "./menu.svg";
import { ReactComponent as MenuClose } from "./close.svg";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { AuthContext } from "../../global/context/auth/AuthContext";

let closeOnBlurWait;
function MainHeader() {
  const { isValidated, signIn, signOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [announceMenuToggle, setAnnounceMenuToggle] = useState(false);

  useEffect(() => {
    return () => clearTimeout(closeOnBlurWait);
  }, []);

  function openMenu() {
    setIsMenuOpen(true);
    setAnnounceMenuToggle(true);
  }

  function closeMenu() {
    setIsMenuOpen(false);
    setAnnounceMenuToggle(true);
  }

  // function closeMenuBlur() {
  //   function closeOnBlurTimeOut() {
  //     if (
  //       document.activeElement.id !== "menu-button" &&
  //       document.activeElement.className !== "nav-item"
  //     ) {
  //       setIsMenuOpen(false);
  //       setAnnounceMenuToggle(false);
  //     }
  //   }

  //   closeOnBlurWait = setTimeout(() => {
  //     closeOnBlurTimeOut();
  //   }, 13);
  // }

  return (
    <Header>
      <div className="sr-only" aria-live="polite" aria-relevant="additions">
        {announceMenuToggle && isMenuOpen ? "Opened SubMenu" : null}
        {announceMenuToggle && !isMenuOpen ? "Closed SubMenu" : null}
      </div>

      <Nav aria-label="site">
        <Link to="/" className="site-logo">
          <picture>
            <source
              srcSet="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_40/v1594347155/tech-pros-v1-main/tech-profiles-logo.webp"
              media="(max-width: 850px)"
            />
            <source
              srcSet="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_40/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
              media="(max-width: 850px)"
            />
            <source srcSet="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.webp" />
            <img
              src="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
              alt="site logo link to profiles page"
            />
          </picture>
        </Link>

        {isValidated ? (
          <>
            {isMenuOpen ? (
              <button
                type="button"
                className="menu-button"
                aria-label="close menu"
                aria-expanded="true"
                onClick={closeMenu}
                // onBlur={closeMenuBlur}
              >
                <span aria-hidden="true">
                  <MenuClose />
                </span>
              </button>
            ) : (
              <button
                type="button"
                className="menu-button"
                aria-label="open menu"
                aria-expanded="false"
                onClick={openMenu}
              >
                <span aria-hidden="true">
                  <BurgerMenu />
                </span>
              </button>
            )}

            <ul
              aria-label="site navigation menu"
              className={`menu-group ${isMenuOpen ? "" : "hidden"}`}
            >
              <li>
                <Link
                  to="/"
                  className="nav-item"
                  // onClick={closeMenuBlur}
                  // onBlur={closeMenuBlur}
                >
                  Profiles
                </Link>
              </li>
              <li>
                <Link
                  to="/profile-dashboard"
                  className="nav-item"
                  // onClick={closeMenuBlur}
                  // onBlur={closeMenuBlur}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <button
                  className="nav-item"
                  type="button"
                  onClick={signOut}
                  // onBlur={closeMenuBlur}
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
  border-bottom: solid 1px rgba(229, 231, 235, .5);
  background-color: white;

  @media (min-width: 850px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    border-bottom: solid 1px rgba(229, 231, 235, .8);
  }
`;

const Nav = styled.nav`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;

  .site-logo {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    justify-self: start;
    padding: var(--nav-padding);
  }

  .menu-button {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    justify-self: end;
    padding: var(--nav-padding);
    border: none;
    background: white;

    @media (min-width: 850px) {
      display: none;
    }
  }

  .menu-group {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
    justify-self: stretch;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background-color: white;
    border-top: solid 1px rgba(229, 231, 235, .5);
    padding: 15px 0;

    @media (min-width: 850px) {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }
  }

  .menu-group.hidden {
    display: none;

    @media (min-width: 850px) {
      display: flex;
    }
  }
`;

export default MainHeader;
