import React from 'react'
import {Redirect, withRouter} from 'react-router-dom'
import auth0Client from './Auth';


function PrivateRoute(props) {
  return (
    <div>
      {auth0Client.isAuthenticated() ?
        props.children
        :
        <Redirect to="/authorize" />
      }
    </div>
  )
}

export default withRouter(PrivateRoute)
