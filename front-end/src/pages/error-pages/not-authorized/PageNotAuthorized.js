import React, { useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { ReactComponent as NotAuthorizedPageIcon } from "../../../global/assets/page-not-authorized.svg";

import Spacer from "../../../global/helpers/spacer";

import MainHeader from "../../../components/header/MainHeader";

function PageNotAuthorized() {
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <>
      <HeaderContainer>
        <MainHeader setHeaderHeight={setHeaderHeight} />
      </HeaderContainer>
      <Main
        id="main-content"
        aria-labelledby="main-heading"
        headerHeight={headerHeight}
      >
        <Helmet>
          <title>Not Authorized • Tech Profiles</title>
        </Helmet>
        <h1 id="main-heading">Not Authorized, Please Log In!</h1>
        <Spacer size="20" axis="vertical" />
        <NotAuthorizedPageIcon className="page-icon" />
      </Main>
    </>
  );
}

const HeaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: var(--header-layer);
  width: 100%;
  border-bottom: solid 1px rgba(229, 231, 235, 0.8);
`;

const Main = styled.main`
  height: ${(props) => `calc(100vh - ${props.headerHeight}px);`};
  padding-top: ${(props) => `calc(30px + ${props.headerHeight}px);`};
  padding-right: 5px;
  padding-left: 5px;
  padding-bottom: 50px;
  background-color: hsl(240, 10%, 99%);
  text-align: center;

  .page-icon {
    max-width: 750px;
  }
`;

export default PageNotAuthorized;
