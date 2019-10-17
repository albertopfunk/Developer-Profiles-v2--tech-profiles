import React from 'react'
import styled from "styled-components";
import { Link } from "react-router-dom";
import HeaderNav from '../navigation/HeaderNav';

function MainHeader() {
  return (
    <Header>
      <Link to="/">Developer Profiles</Link>
      <HeaderNav />
    </Header>
  )
}

const Header = styled.header`
  border: solid;
  height: 100px;
  width: 100%;
  background-color: white;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 10;

  display: flex;
  justify-content: space-between;
`;

export default MainHeader
