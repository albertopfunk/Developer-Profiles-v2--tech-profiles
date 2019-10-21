import React, {useState} from "react";
import styled from "styled-components";

import auth0Client from "../../auth/Auth";
import axios from "axios";
import UserCard from "../../components/user-cards/user-card/UserCard";

function ProfileDashboard() {

  const [userId, setUserId] = useState(0);

  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");

  const [firstNameDisplay, setFirstNameDisplay] = useState("");
  const [lastNameDisplay, setLastNameDisplay] = useState("");


  async function dashboardInit() {

    const userProfile = auth0Client.getProfile();
    const { email } = userProfile
    const user = await axios.get(`${process.env.REACT_APP_SERVER}/users/${email}`)
    const {
        id,
        image,
        public_email: publicEmail,
        first_name: firstName,
        last_name: lastName,
        area_of_work: areaOfWork,
        desired_title: title,

        current_location_name: currentLocation,
        github: github,
        linkedin: linkedin,
        portfolio: portfolio,
        
        interested_location_names: interestedLocations,
        summary: summary,
        top_skills: topSkills,
        additional_skills: additionalSkills,

    } = user.data;


    setUserId(id)

    setFirstNameDisplay(firstName)
    setLastNameDisplay(lastName)
  }



  async function editName(e) {
    e.preventDefault();
    
    const editUser = await axios.put(`${process.env.REACT_APP_SERVER}/users/${userId}`, {
      first_name: firstNameInput,
      last_name: lastNameInput
    });

    console.log(editUser)
    const editedUser = editUser.data
    setFirstNameDisplay(editedUser.first_name)
    setLastNameDisplay(editedUser.last_name)
  }


  return (
    <Main>
      <h1>Helloo Dashboard</h1>
      <button onClick={dashboardInit}>PROFILE</button>
      <br/>
      <h2>User Name Display</h2>
      <p>{firstNameDisplay}</p>
      <p>{lastNameDisplay}</p>

      <form onSubmit={e => editName(e)}>
        <label>{firstNameInput || "Enter First Name"}</label>
        <input type="text" placeholder="First Name" value={firstNameInput} onChange={e => setFirstNameInput(e.target.value)} /><br/>
        <label>{lastNameInput || "Enter Last Name"}</label>
        <input type="text" placeholder="Last Name" value={lastNameInput} onChange={e => setLastNameInput(e.target.value)} />
        <button>EDIT NAME</button>
      </form>
      <br/>
      <hr/>
      <UserCard
        usersLength={1}
        index={1}
        id={userId}
        // areaOfWork={user.area_of_work}
        // email={user.public_email}
        // image={user.image}
        firstName={firstNameDisplay}
        lastName={lastNameDisplay}
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

export default ProfileDashboard;
