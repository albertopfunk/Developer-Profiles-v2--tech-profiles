import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { ReactComponent as NetworkingPageIcon } from "../../global/assets/page-networking.svg";

import MainHeader from "../../components/header/MainHeader";
import ControlButton from "../../components/forms/buttons/ControlButton";

import Spacer from "../../global/helpers/spacer";
import { AuthContext } from "../../global/context/auth/AuthContext";
import { httpClient } from "../../global/helpers/http-requests";

function LandingPage() {
  const { isValidated, signIn } = useContext(AuthContext);

  useEffect(() => {
    // wake up heroku
    wakeUp();
  }, []);

  async function wakeUp() {
    await httpClient("GET", "/hello");
  }

  return (
    <>
      <Helmet>
        <title>Tech Profiles</title>
      </Helmet>
      <MainHeader />
      <Spacer size="30" axis="vertical" />
      <Main>
        <HeadingContainer>
          <h1>Discover People in Tech</h1>
          <Spacer size="5" axis="vertical" />
          <p>
            Whether you want to hire someone or network, tech profiles helps you
            connect with like-minded people in your area.
          </p>
        </HeadingContainer>
        <Spacer size="10" axis="vertical" />
        <ContentContainer>
          <NetworkingPageIcon className="page-icon" />
          <Spacer size="20" axis="vertical" />
          <Controls>
            <Link to="/profiles">
              <span>View Profiles</span>
            </Link>

            {isValidated ? (
              <Link to="/profile-dashboard">
                <span>Edit Your Profile</span>
              </Link>
            ) : (
              <ControlButton
                type="button"
                onClick={signIn}
                buttonText={"Create a Profile"}
              />
            )}
          </Controls>
        </ContentContainer>
      </Main>
    </>
  );
}

const Main = styled.main`
  padding: 0 10px;
  text-align: center;
`;

const HeadingContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
`;

const ContentContainer = styled.div`
  width: 100%;
  max-width: 750px;
  margin: 0 auto;

  .page-icon {
    width: 100%;
    height: auto;
  }
`;

const Controls = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;

  button {
    flex-basis: 40%;
  }
  a {
    flex-basis: 40%;
    display: inline-block;
    white-space: nowrap;
    padding: 10px 15px 10px;
    border: var(--border-md);
    color: var(--dark-cyan-2);

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
`;

export default LandingPage;
