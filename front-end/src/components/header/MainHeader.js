import React, { useContext, useEffect, useRef, useState } from "react";
import { ReactComponent as BurgerMenu } from "../../global/assets/header-nav.svg";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import { AuthContext } from "../../global/context/auth/AuthContext";

let closeOnBlurWait;
function MainHeader(props) {
  const { isValidated, signIn, signOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [announceMenuToggle, setAnnounceMenuToggle] = useState(false);

  const headerRef = useRef();

  useEffect(() => {
    props.setHeaderHeight(headerRef?.current?.offsetHeight ?? 60);
  }, [isMenuOpen]);

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

  const siteLogo = (
    <picture>
      <source
        srcSet="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_45/v1594347155/tech-pros-v1-main/tech-profiles-logo.webp"
        media="(max-width: 750px)"
      />
      <source
        srcSet="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_45/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
        media="(max-width: 750px)"
      />
      <source srcSet="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.webp" />
      <img
        src="https://res.cloudinary.com/dy5hgr3ht/image/upload/c_scale,h_65/v1594347155/tech-pros-v1-main/tech-profiles-logo.png"
        alt="site logo link to profiles page"
      />
    </picture>
  );

  const siteNav = (
    <ul aria-label="site navigation menu" className="menu-group">
      <li className="menu-item">
        <NavLink exact to="/" className="link" activeClassName="selected">
          <span className="link-text">Profiles</span>
        </NavLink>
      </li>
      <li className="menu-item">
        <NavLink
          to="/profile-dashboard"
          className="link"
          activeClassName="selected"
        >
          <span className="link-text">Dashboard</span>
        </NavLink>
      </li>
      <li className="menu-item">
        <button
          className="button control signout"
          type="button"
          onClick={signOut}
        >
          <span className="button-text">Sign Out</span>
        </button>
      </li>
    </ul>
  );

  let menuButton;
  if (isMenuOpen) {
    menuButton = (
      <button
        type="button"
        className="button menu-button"
        aria-label="close menu"
        aria-expanded="true"
        onClick={closeMenu}
      >
        <BurgerMenu className="icon rotate" aria-hidden="true" />
      </button>
    );
  } else {
    menuButton = (
      <button
        type="button"
        className="button menu-button"
        aria-label="open menu"
        aria-expanded="false"
        onClick={openMenu}
      >
        <BurgerMenu className="icon" aria-hidden="true" />
      </button>
    );
  }

  return (
    <Header ref={headerRef}>
      <div className="sr-only" aria-live="polite" aria-relevant="additions">
        {announceMenuToggle && isMenuOpen ? "Opened SubMenu" : null}
        {announceMenuToggle && !isMenuOpen ? "Closed SubMenu" : null}
      </div>

      <Nav aria-label="site">
        {isValidated ? (
          <>
            <div className="fixed-container">
              <div className="logo-container">
                <NavLink
                  exact
                  to="/"
                  className="site-logo"
                  activeClassName="selected"
                >
                  {siteLogo}
                </NavLink>
              </div>
              <div className="button-container mobile">{menuButton}</div>
              <div className="menu-container desktop">{siteNav}</div>
            </div>
            <div
              className={`menu-container mobile ${isMenuOpen ? "" : "hidden"}`}
            >
              {siteNav}
            </div>
          </>
        ) : (
          <div className="fixed-container">
            <div className="logo-container">
              <NavLink
                exact
                to="/"
                className="site-logo"
                activeClassName="selected"
              >
                {siteLogo}
              </NavLink>
            </div>
            <div className="button-container">
              <button
                type="button"
                className="button control signin"
                onClick={signIn}
              >
                <span className="button-text">Sign In</span>
              </button>
            </div>
          </div>
        )}
      </Nav>
    </Header>
  );
}

const Header = styled.header`
  border-bottom: solid 1px rgba(229, 231, 235, 0.5);
  background-color: white;

  @media (min-width: 600px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    border-bottom: solid 1px rgba(229, 231, 235, 0.8);
  }
`;

const Nav = styled.nav`
  .fixed-container {
    height: 55px;
    display: flex;
    padding: 0 5px;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    @media (min-width: 750px) {
      height: 75px;
    }




    .logo-container {
      min-width: 115px;
      width: 100%;
      /* flex-basis: 75%; */
      /* @media (min-width: 500px) {
        flex-basis: auto;
      } */

      .site-logo {
        picture {
          display: inline-block;
        }

        img {
          width: 100%;
          height: auto;
        }
      }
    }

    .button-container {
      /* flex-basis: 25%; */
      width: 100%;
      display: flex;
      justify-content: flex-end;

      &.mobile {
        height: 100%;
        overflow: hidden;

        @media (min-width: 500px) {
          display: none;
        }
      }

      .menu-button {
        width: 100%;
        max-width: 60px;

        .icon {
          transition: all 0.3s linear;
          height: 45px;
        }

        .icon.rotate {
          transform: rotate(90deg);
        }
      }

      .button.signin {
        width: 100%;
        max-width: 120px;
      }
    }
  }

  .menu-container {
    border-top: solid 1px rgba(229, 231, 235, 0.5);

    .menu-group {
      display: flex;
      /* align-items: center; */
      overflow-x: auto;

      .menu-item {
        flex-grow: 1;
        display: flex;
        white-space: nowrap;
        /* justify-content: center; */
        /* padding: 10px;

        &:not(:last-child) {
          border-right: solid 1px rgba(229, 231, 235, 0.8);
      
          @media (min-width: 500px) {
            border: none;
          }
        } */

        .link {
          flex-grow: 1;
          border-right: solid 1px rgba(229, 231, 235, 0.8);
          padding: 10px;
          text-align: center;

          /* &:hover {
            border-bottom: solid;
          } */

          &.selected {
            border-bottom: solid 2px;
          }

          &:hover .link-text {
            border-bottom: solid 1px;
          }
          &:focus .link-text {
            outline: 0.25rem solid transparent;
            border-bottom: solid 1px;
          }
          &:focus {
            outline: 0.25rem solid transparent;
            border: solid 1px;
          }
          &.selected .link-text {
            border-bottom: solid 1px transparent;
          }
        }

        .button.signout {
          flex-grow: 1;
        }
      }
    }
  }

  .menu-container.hidden {
    display: none;
  }

  .menu-container.desktop {
    display: none;

    @media (min-width: 500px) {
      display: block;
      flex-basis: 60%;
      border: none;
    }
  }

  .menu-container.mobile {
    @media (min-width: 500px) {
      display: none;
    }
  }
`;

export default MainHeader;
