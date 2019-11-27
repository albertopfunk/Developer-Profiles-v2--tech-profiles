import React, { useContext, useState } from "react";
import styled from "styled-components";

import { ProfileContext } from "../../../global/context/user-profile/ProfileContext";

function DashboardEducation() {
  const { loadingUser, user, addExtra } = useContext(ProfileContext);
  const [school, setSchool] = useState("")
  const [fieldOfStudy, setFieldOfStudy] = useState("")




  async function submitAdd(e) {
    e.preventDefault();

    if (
      !school &&
      !fieldOfStudy
    ) {
      return;
    }

    const inputs = {user_id: user.id};
    if (school) {
      inputs.school = school;
      setSchool("");
    }

    // make dates similar to the credit card exp dates
    // <MM/YY> to <MM/YY>

    if (fieldOfStudy) {
      inputs.field_of_study = fieldOfStudy;
      setFieldOfStudy("");
    }

    addExtra(inputs, "education");
  }

  console.log("Education", user);
  if (loadingUser) {
    return <h1>Loading...</h1>;
  }
  return (
    <Main>
      <h1>Hello Education</h1>
      <form onSubmit={e => submitAdd(e)}>
        <input
          type="text"
          placeholder="School"
          value={school}
          onChange={e => setSchool(e.target.value)}
        />

        <br />

        <input
          type="text"
          placeholder="Field of Study"
          value={fieldOfStudy}
          onChange={e => setFieldOfStudy(e.target.value)}
        />

        <button>Submit</button>
      </form>
    </Main>
  );
}

const Main = styled.main`
  width: 100%;
  height: 100vh;
  padding-top: 100px;
  background-color: pink;
`;

export default DashboardEducation;
