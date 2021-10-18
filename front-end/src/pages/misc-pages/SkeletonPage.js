import React from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { ReactComponent as PageValidation } from "../../global/assets/tech-profiles-logo.svg";
import SiteLogo from "../../components/header/SiteLogo";

function SkeletonPage() {
  return (
    <>
      <HeaderSkeleton>
        <SiteLogo />
      </HeaderSkeleton>
      <Helmet>
        <title>Validating Session • Tech Profiles</title>
      </Helmet>
      <MainContainerSkeleton aria-labelledby="main-heading">
        <h1 id="main-heading" className="sr-only">
          Validating Session
        </h1>
        <div className="page-icon">
          <PageValidation className="icon" />
        </div>
      </MainContainerSkeleton>
    </>
  );
}

const HeaderSkeleton = styled.header`
  width: 100%;
  height: 55px;
  border-bottom: var(--border-sm);
  background-color: white;

  @media (min-width: 750px) {
    height: 75px;
  }
`;

const MainContainerSkeleton = styled.main`
  .page-icon {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .icon {
      width: 100%;
      max-width: 75px;
      height: auto;
      animation: sway 3s linear infinite;

      @keyframes sway {
        from {
          transform: rotate(0deg);
        }

        25% {
          transform: rotate(-15deg) scale(1.1);
        }

        50% {
          transform: rotate(0deg);
        }

        75% {
          transform: rotate(15deg) scale(1.1);
        }

        100% {
          transform: rotate(0deg);
        }
      }
    }
  }
`;

export default SkeletonPage;
