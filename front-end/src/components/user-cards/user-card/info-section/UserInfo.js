import React from "react";

function UserInfo(props) {
  return (
    <section>
      <section className="name">
        {props.firstName || props.lastName ? (
          <p>
            {props.firstName} {props.lastName}
          </p>
        ) : (
          <p>No Name Listed</p>
        )}
      </section>
      <section className="location">
        {props.currentLocation ? (
          <p>{props.currentLocation}</p>
        ) : (
          <p>No Location Listed</p>
        )}
      </section>
      <section className="summary">
        {props.summary ? <p>{props.summary}</p> : <p>No Summary Listed</p>}
      </section>
    </section>
  );
}

export default UserInfo;
