import React from 'react'
import styled from "styled-components";

function MainHeader() {
  return (
    <Header>
      <h1>Header</h1>
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
`;

export default MainHeader
