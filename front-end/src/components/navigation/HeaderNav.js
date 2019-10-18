import React from 'react'
import { Link, withRouter } from "react-router-dom";

//import auth0Client from '../../Auth';


function HeaderNav(props) {
  // const signOut = () => {
  //   auth0Client.signOut();
  //   props.history.replace('/');
  // };

  return (
    <nav>
      <Link to="/profiles">Profiles</Link>
      {/* {auth0Client.isAuthenticated() ?
        <>
          <Link to="/dashboard">Dashboard</Link>
          <button onClick={() => signOut()}>Sign Out</button>
        </>
        :
        <button onClick={auth0Client.signIn}>Sign In</button>
      } */}
    </nav>
  )
}

export default withRouter(HeaderNav)
