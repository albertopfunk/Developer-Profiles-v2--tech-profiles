import React from "react";

function UserBasics({ userId, firstName, lastName, title, currentLocation }) {
  return (
    <>
      <div id={`profile-${userId}-name`} className="name">
        {firstName || lastName ? (
          <p>
            {firstName} {lastName}
          </p>
        ) : (
          <p>No Name Listed</p>
        )}
      </div>

      <div className="location">
        {currentLocation ? <p>{currentLocation}</p> : <p>No Location Listed</p>}
      </div>

      <div className="title">
        <p>{title}</p>
      </div>
    </>
  );
}

export default UserBasics;
