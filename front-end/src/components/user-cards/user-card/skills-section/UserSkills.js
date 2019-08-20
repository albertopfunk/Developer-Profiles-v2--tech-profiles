import React from "react";
import styled from "styled-components";

function UserSkills(props) {
  return (
    <Section>
      <section className="top">
        <strong>Top Skills</strong>
        {props.topSkills.length > 0 ? (
          props.topSkills.length > 3 ? (
            <>
              <p>{props.topSkills[0]}</p>
              <p>{props.topSkills[1]}</p>
              <p>{props.topSkills[2]}</p>
              <p>Expand for more skills</p>
            </>
          ) : (
            props.topSkills.map(skill => <p key={skill}>{skill}</p>)
          )
        ) : (
          <p>No Top Skills Listed</p>
        )}
      </section>

      <section className="additional">
        <strong>Additional Skills</strong>
        {props.additionalSkills.length > 0 ? (
          props.additionalSkills.length > 3 ? (
            <>
              <p>{props.additionalSkills[0]}</p>
              <p>{props.additionalSkills[1]}</p>
              <p>{props.additionalSkills[2]}</p>
              <p>Expand for more skills</p>
            </>
          ) : (
            props.additionalSkills.map(skill => <p key={skill}>{skill}</p>)
          )
        ) : (
          <p>No Additional Skills Listed</p>
        )}
      </section>
    </Section>
  );
}

const Section = styled.section`
  display: flex;
  > section {
    width: 50%;

  }
`;

export default UserSkills;
