import React, {useState} from "react";
import styled from "styled-components";

import auth0Client from "../../auth/Auth";
import axios from "axios";
import UserCard from "../../components/user-cards/user-card/UserCard";

function ProfileDashboard() {

  const [userId, setUserId] = useState(0);
  const [isNewUser, setIsNewUser] = useState(null);


  const [firstNameInput, setFirstNameInput] = useState("");
  const [lastNameInput, setLastNameInput] = useState("");

  const [firstNameDisplay, setFirstNameDisplay] = useState("");
  const [lastNameDisplay, setLastNameDisplay] = useState("");


  async function dashboardInit() {

    const userProfile = auth0Client.getProfile();
    const { email, sub } = userProfile

    let firstName = "";
    let lastName = "";
    
    if (sub.includes("google")) {
      console.log("===GOOGLE===")
      console.log(userProfile.given_name)
      firstName = userProfile.given_name;
      console.log(userProfile.family_name)
      lastName = userProfile.family_name;
    }
    if (sub.includes("github")) {
      console.log("===GITHUB===")
      const userFullNameArr = userProfile.name.split(" ");
      console.log(userFullNameArr[0])
      firstName = userFullNameArr[0];
      console.log(userFullNameArr[1])
      lastName = userFullNameArr[1];
    }
    if (sub.includes("auth0")) {
      console.log("===AUTH0===")
    }

    const user = await axios.post(`${process.env.REACT_APP_SERVER}/users/new`, {
      email,
      first_name: firstName,
      last_name: lastName
    })

    const {status, data} = user;
    
    console.log("============")
    console.log(status, data)
    console.log("============")
    console.log("============")
    console.log(data.first_name)
    console.log(data.last_name)
    console.log("============")
    
    status === 201 ? setIsNewUser(true) : setIsNewUser(false)

    // only thing that needs to be accessed by all dashboard components
    // maybe use session for user info to avoid api calls
    setUserId(data.id)


    // not part of init
    setFirstNameDisplay(data.first_name)
    setLastNameDisplay(data.last_name)
  }

  console.log("NEW USER?", isNewUser)



  async function editName(e) {
    e.preventDefault();
    const editUser = await axios.put(`${process.env.REACT_APP_SERVER}/users/${userId}`, {
      first_name: firstNameInput,
      last_name: lastNameInput
    });

    // how you can update UI and UserCard
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
