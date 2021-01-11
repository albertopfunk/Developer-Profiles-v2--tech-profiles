import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { ReactComponent as BurgerMenu } from "./menu.svg";
import { ReactComponent as MenuClose } from "./close.svg";

let closeOnBlurWait;
function MainHeader({ isValidated, signOut, signIn }) {
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

  return (
    <Header>
      <div className="sr-only" aria-live="polite" aria-relevant="additions">
        {announceMenuToggle && isMenuOpen ? "Opened SubMenu" : null}
        {announceMenuToggle && !isMenuOpen ? "Closed SubMenu" : null}
      </div>

      <Nav aria-label="site">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
            alt="site logo link to profiles page"
          />
        </Link>

        {isValidated ? (
          <>
            {isMenuOpen ? (
              <button
                id="menu-button"
                type="button"
                aria-label="close menu"
                aria-expanded="true"
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
              id="menu-group"
              aria-label="site navigation menu"
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
  border: solid red;
  width: 100%;
  padding: 0.3em 1em;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;

  #menu-button {
    border: none;
    background: white;
    padding: 0.4em;
  }

  #sub-menu-group {
    list-style: none;
    background-color: white;
    padding: 0.7em;
  }
`;

export default MainHeader;
