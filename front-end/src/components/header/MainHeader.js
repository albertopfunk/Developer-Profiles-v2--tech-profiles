import React from "react";
import styled from "styled-components";
import { Link, withRouter } from "react-router-dom";

import auth0Client from "../../auth/Auth";

function MainHeader(props) {
  const signOut = () => {
    auth0Client.signOut();
    props.history.replace("/");
  };

  return (
    <header>
      <Nav aria-label="site">
        <div>
          <Link to="/">Tech Profiles</Link>
        </div>

        <div>
          <Link to="/profiles">Profiles</Link>
          {auth0Client.isAuthenticated() ? (
            <>
              <Link to="/profile-dashboard">Dashboard</Link>
              <button onClick={() => signOut()}>Sign Out</button>
            </>
          ) : (
            <button onClick={auth0Client.signIn}>Sign In</button>
          )}
        </div>
      </Nav>
    </header>
  );
}

const Nav = styled.nav`
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

export default withRouter(MainHeader);
