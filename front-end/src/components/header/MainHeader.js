import React, { useContext, useEffect, useRef, useState } from "react";
import { ReactComponent as BurgerMenu } from "../../global/assets/header-nav.svg";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

import ControlButton from "../forms/buttons/ControlButton";
import { AuthContext } from "../../global/context/auth/AuthContext";
import IconButton from "../forms/buttons/IconButton";

let closeOnBlurWait;
function MainHeader(props) {
  const { isValidated, signIn, signOut } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [announceMenuToggle, setAnnounceMenuToggle] = useState(false);

  const headerRef = useRef();

  useEffect(() => {
    if (!headerRef.current || !props.setHeaderHeight) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      props.setHeaderHeight(entries[0].contentRect.height);
    });

    resizeObserver.observe(headerRef.current);

    return () => resizeObserver.disconnect();
  }, []);

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
        <NavLink to="/profiles" className="link" activeClassName="selected">
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
      <li className="menu-item menu-item__button">
        <ControlButton
          type="button"
          onClick={signOut}
          buttonText={"sign out"}
          classNames="signout-button"
        />
      </li>
    </ul>
  );

  let menuButton;
  if (isMenuOpen) {
    menuButton = (
      <IconButton
        type="button"
        size="xl"
        classNames="menu-button"
        ariaLabel="close menu"
        icon={<BurgerMenu className="icon rotate" />}
        attributes={{
          "aria-expanded": "true",
        }}
        onClick={closeMenu}
      />
    );
  } else {
    menuButton = (
      <IconButton
        type="button"
        size="xl"
        classNames="menu-button"
        ariaLabel="open menu"
        icon={<BurgerMenu className="icon" />}
        attributes={{
          "aria-expanded": "false",
        }}
        onClick={openMenu}
      />
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
                <NavLink exact to="/" className="site-logo">
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
              <NavLink exact to="/" className="site-logo">
                {siteLogo}
              </NavLink>
            </div>
            <div className="button-container">
              <ControlButton
                type="button"
                onClick={signIn}
                buttonText={"sign in / sign up"}
                classNames="signin-button"
              />
            </div>
          </div>
        )}
      </Nav>
    </Header>
  );
}

const Header = styled.header`
  border-bottom: var(--border-sm);
  background-color: white;
  z-index: var(--header-layer);
`;

const Nav = styled.nav`
  .fixed-container {
    height: 55px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;

    @media (min-width: 750px) {
      height: 75px;
    }

    .logo-container {
      min-width: 115px;
      width: 100%;

      @media (min-width: 500px) {
        flex-basis: 40%;
      }

      .site-logo {
        display: inline-block;
        height: 55px;
        padding: 5px;
        // selected and focus placeholder
        border: solid 2px transparent;

        @media (min-width: 750px) {
          height: 75px;
        }

        &:focus {
          // contrast mode fallback
          outline: 2.5px solid transparent;
          border-color: var(--dark-green-3);
        }

        // removing focus styles when using mouse
        &:focus:not(:focus-visible) {
          outline: none;
          border-color: transparent;
        }

        picture {
          display: inline-block;
          width: 100%;
          height: 100%;
        }

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .button-container {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding-right: 5px;

      &.mobile {
        width: 40%;
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
        }

        .icon.rotate {
          transform: rotate(90deg);
        }
      }

      .signin-button {
        width: 100%;
        max-width: 155px;

        @media (min-width: 400px) {
          max-width: 175px;
        }

        @media (min-width: 750px) {
          max-width: 200px;
        }

        @media (min-width: 1000px) {
          max-width: 250px;
        }
      }
    }
  }

  .menu-container {
    .menu-group {
      display: flex;

      .menu-item {
        flex-grow: 1;
        display: flex;
        white-space: nowrap;

        .link {
          flex-grow: 1;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .signout-button {
          flex-grow: 1;
        }
      }
    }

    &.mobile {
      border-top: var(--border-sm);
      overflow-x: auto;

      @media (min-width: 500px) {
        display: none;
      }

      .menu-group {
        .menu-item {
          &.menu-item__button {
            padding: 10px 5px;
          }
          .link {
            padding: 10px;
          }
        }
      }
    }

    &.desktop {
      display: none;

      @media (min-width: 500px) {
        display: block;
        flex-basis: 60%;
        height: 100%;
      }

      .menu-group {
        height: 100%;

        .menu-item {
          align-items: stretch;

          &.menu-item__button {
            padding: 0 5px;
            justify-content: center;
            align-items: center;
          }

          .signout-button {
            max-width: 250px;
          }
        }
      }
    }

    &.hidden {
      display: none;
    }

    .menu-group {
      .menu-item {
        border-right: var(--border-sm);

        &:last-child {
          border-right: none;
        }

        .link {
          color: var(--dark-cyan-2);
          // selected and focus placeholder
          border: solid 2px transparent;

          &.selected {
            color: var(--dark-green-3);
            border-bottom-color: var(--dark-green-3);
          }

          // next 3 selectors are due to focus-visible
          // not being fully supported yet
          &:focus {
            // contrast mode fallback
            outline: 2.5px solid transparent;
            border-color: var(--dark-green-3);
          }

          // removing focus styles when using mouse
          &:focus:not(:focus-visible) {
            outline: none;
            border-color: transparent;
          }

          // undoing removal of bottom border from above selector when using mouse
          &.selected:focus:not(:focus-visible) {
            border-bottom-color: var(--dark-green-3);
          }

          &:active {
            color: var(--dark-green-3);
          }

          .link-text {
            // hover and focus placeholder
            border: solid 1px transparent;
          }

          &:hover:not(.selected) .link-text {
            border-bottom-color: currentColor;
          }

          &:focus:not(.selected) .link-text {
            border-bottom-color: currentColor;
          }
        }
      }
    }
  }
`;

export default MainHeader;
