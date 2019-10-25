import React, { useState, useContext } from "react";
import styled from "styled-components";

import UserCard from "../../../components/user-cards/user-card/UserCard";
import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";

function PersonalInfo() {
  const { loadingUser, user, editProfile } = useContext(ProfileContext);

  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");

  async function editName(e) {
    e.preventDefault();

    const inputs = {
      first_name: firstNameInput,
      last_name: lastNameInput
    };

    editProfile(inputs);
    setFirstNameInput("");
    setLastNameInput("");
  }

  console.log("P-INFO RENDER STATE", user);
  if (loadingUser) {
    return <h1>Loading...</h1>;
  }
  return (
    <Main>
      <h2>User Name Display</h2>
      <p>{user.first_name}</p>
      <p>{user.last_name}</p>

      <form onSubmit={e => editName(e)}>
        <label>{firstNameInput || "Enter First Name"}</label>
        <input
          type="text"
          placeholder="First Name"
          value={firstNameInput}
          onChange={e => setFirstNameInput(e.target.value)}
        />
        <br />
        <label>{lastNameInput || "Enter Last Name"}</label>
        <input
          type="text"
          placeholder="Last Name"
          value={lastNameInput}
          onChange={e => setLastNameInput(e.target.value)}
        />
        <button>EDIT NAME</button>
      </form>
      <br />
      <hr />
      <UserCard
        usersLength={1}
        index={1}
        id={user.id}
        // areaOfWork={user.area_of_work}
        // email={user.public_email}
        // image={user.image}
        firstName={user.first_name}
        lastName={user.last_name}
        // currentLocation={user.current_location_name}
        // summary={user.summary}
        // title={user.desired_title}
        // topSkills={user.top_skills}
        // additionalSkills={user.additional_skills}
        // github={user.github}
        // linkedin={user.linkedin}
        // portfolio={user.portfolio}
        // interestedLocations={user.interested_location_names}
      />
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default PersonalInfo;
