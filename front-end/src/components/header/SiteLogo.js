import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

function SiteLogo() {
  return (
    <LogoContainer>
      <NavLink exact to="/" className="site-logo">
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
      </NavLink>
    </LogoContainer>
  );
}

const LogoContainer = styled.div`
  min-width: 120px;
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
`;

export default SiteLogo;
