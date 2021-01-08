import React from "react";

function UserInfo(props) {
  return (
    <div>
      <div className="name">
        {props.firstName || props.lastName ? (
          <p>
            {props.firstName} {props.lastName}
          </p>
        ) : (
          <p>No Name Listed</p>
        )}
      </div>
      <div className="location">
        {props.currentLocation ? (
          <p>{props.currentLocation}</p>
        ) : (
          <p>No Location Listed</p>
        )}
      </div>
      <div id={`profile-${props.userId}-summary`} className="summary">
        {props.summary ? <p>{props.summary}</p> : <p>No Summary Listed</p>}
      </div>
    </div>
  );
}

export default UserInfo;
