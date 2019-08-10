import React from "react";

// usercard info
// first name
// last name
// profile image
// location
// bio/summary
// desired title
// public email
// area of work
// website link
// github link
// linkedin link
// top, additional, familiar skills

// resume link?
// twitter link?
// codesandbox link?
// codepen link?
// share profile?

// expanded user card info
// projects
// education
// experience
// interested location names

function UserCard(props) {
  return (
    <article style={{ margin: "20px", border: "solid" }}>
      <p>{props.user.first_name}</p>
      <p>{props.user.id}</p>
      <p>{props.user.area_of_work}</p>
      <p>{props.user.current_location_name}</p>
      <p>{props.user.interested_location_names}</p>
      <button onClick={() => props.expandUserCard(props.user.id)}>
        Expand
      </button>
    </article>
  );
}

export default UserCard;
