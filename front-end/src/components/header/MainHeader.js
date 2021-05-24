import React, { useContext, useEffect, useState } from "react";
import { ReactComponent as BurgerMenu } from "../../global/assets/header-nav.svg";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { AuthContext } from "../../global/context/auth/AuthContext";

let closeOnBlurWait;
// eslint-disable-next-line
function MainHeader(_, headerRef) {
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

  return (
    <Header ref={headerRef}>
      <div className="sr-only" aria-live="polite" aria-relevant="additions">
        {announceMenuToggle && isMenuOpen ? "Opened SubMenu" : null}
        {announceMenuToggle && !isMenuOpen ? "Closed SubMenu" : null}
      </div>

      <Nav aria-label="site">
        <div className="site-logo">
          <Link to="/">
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
        </div>

        {isValidated ? (
          <>
            {isMenuOpen ? (
              <button
                type="button"
                className="menu-button"
                aria-label="close menu"
                aria-expanded="true"
                onClick={closeMenu}
              >
                <BurgerMenu className="icon rotate" aria-hidden="true" />
              </button>
            ) : (
              <button
                type="button"
                className="menu-button"
                aria-label="open menu"
                aria-expanded="false"
                onClick={openMenu}
              >
                <BurgerMenu className="icon" aria-hidden="true" />
              </button>
            )}

            <ul
              aria-label="site navigation menu"
              className={`menu-group ${isMenuOpen ? "" : "hidden"}`}
            >
              <li>
                <Link to="/" className="nav-item">
                  Profiles
                </Link>
              </li>
              <li>
                <Link to="/profile-dashboard" className="nav-item">
                  Dashboard
                </Link>
              </li>
              <li>
                <button className="nav-item" type="button" onClick={signOut}>
                  Sign Out
                </button>
              </li>
            </ul>
          </>
        ) : (
          <button type="button" className="signin-button" onClick={signIn}>
            Sign In
          </button>
        )}
      </Nav>
    </Header>
  );
}

const Header = styled.header`
  border-bottom: solid 1px rgba(229, 231, 235, 0.5);
  background-color: white;
  padding: 5px;

  @media (min-width: 850px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    border-bottom: solid 1px rgba(229, 231, 235, 0.8);
  }
`;

const Nav = styled.nav`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;

  .site-logo {
    width: 100px;
    height: auto;
    grid-column: 1 / 2;
    grid-row: 1 / 2;
    justify-self: start;

    @media (min-width: 300px) {
      width: 120px;
    }

    img {
      width: 100%;
      height: auto;
    }
  }

  .signin-button {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    justify-self: end;
    border: none;
    background: white;
  }

  .menu-button {
    width: 30px;
    grid-column: 2 / 3;
    grid-row: 1 / 2;
    justify-self: end;
    border: none;
    background: white;

    @media (min-width: 300px) {
      width: 40px;
    }

    @media (min-width: 850px) {
      display: none;
    }

    .icon {
      transition: all 0.3s linear;
    }

    .icon.rotate {
      transform: rotate(90deg);
    }
  }

  .menu-group {
    grid-column: 1 / 3;
    grid-row: 2 / 3;
    justify-self: stretch;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    flex-wrap: wrap;
    gap: 15px;
    border-top: solid 1px rgba(229, 231, 235, 0.5);
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

export default React.forwardRef(MainHeader);
