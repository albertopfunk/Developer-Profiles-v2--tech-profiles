import React from "react";

function UserInfo({
  userId,
  firstName,
  lastName,
  title,
  currentLocation,
  summary
}) {
  return (
    <div>
      <div className="name">
        {firstName || lastName ? (
          <p>
            {firstName} {lastName}
          </p>
        ) : (
          <p>No Name Listed</p>
        )}
      </div>
      <div>{title}</div>
      <div className="location">
        {currentLocation ? (
          <p>{currentLocation}</p>
        ) : (
          <p>No Location Listed</p>
        )}
      </div>
      <div id={`profile-${userId}-summary`} className="summary">
        {summary ? <p>{summary}</p> : <p>No Summary Listed</p>}
      </div>
    </div>
  );
}

export default UserInfo;
