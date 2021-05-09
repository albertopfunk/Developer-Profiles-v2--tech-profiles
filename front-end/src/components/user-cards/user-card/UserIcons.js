import React from "react";
import styled from "styled-components";
import { ReactComponent as GithubIcon } from "../../../global/assets/profile-github.svg";
import { ReactComponent as TwitterIcon } from "../../../global/assets/profile-twitter.svg";
import { ReactComponent as LinkedinIcon } from "../../../global/assets/profile-linkedin.svg";
import { ReactComponent as WebsiteIcon } from "../../../global/assets/profile-website.svg";

function UserIcons({ github, twitter, linkedin, portfolio }) {
  return (
    <IconsContainer>
      {github ? (
        <a href={github} target="_blank" rel="noreferrer" className="icon">
          <GithubIcon />
          <span className="sr-only">github profile(opens in new window)</span>
        </a>
      ) : null}

      {twitter ? (
        <a href={twitter} target="_blank" rel="noreferrer" className="icon">
          <TwitterIcon />
          <span className="sr-only">twitter profile(opens in new window)</span>
        </a>
      ) : null}

      {linkedin ? (
        <a href={linkedin} target="_blank" rel="noreferrer" className="icon">
          <LinkedinIcon />
          <span className="sr-only">linkedin profile(opens in new window)</span>
        </a>
      ) : null}

      {portfolio ? (
        <a href={portfolio} target="_blank" rel="noreferrer" className="icon">
          <WebsiteIcon />
          <span className="sr-only">website profile(opens in new window)</span>
        </a>
      ) : null}
    </IconsContainer>
  );
}

const IconsContainer = styled.div`
  grid-column: 1 / 2;
  grid-row: 4 / 5;
  place-self: center;
  display: flex;
  gap: 25px;

  @media (min-width: 1050px) {
    grid-column: 3 / 4;
    grid-row: 1 / 4;
    flex-direction: column;
    gap: 35px;
  }

  .icon {
    width: 30px;
    height: auto;

    @media (min-width: 1050px) {
      width: 40px;
    }
  }
`;

export default UserIcons;
