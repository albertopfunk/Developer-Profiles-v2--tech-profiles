import React, { useState } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";
import { ReactComponent as NotFoundPageIcon } from "../../../global/assets/page-not-found.svg";

import Spacer from "../../../global/helpers/spacer";

import MainHeader from "../../../components/header/MainHeader";

function PageNotFound() {
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
          <title>Not Found • Tech Profiles</title>
        </Helmet>
        <h1 id="main-heading">Page Not Found!</h1>
        <Spacer size="20" axis="vertical" />
        <NotFoundPageIcon className="page-icon" />
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
  border-bottom: var(--border-sm);
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

export default PageNotFound;
