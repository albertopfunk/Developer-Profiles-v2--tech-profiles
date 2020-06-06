import React from "react";
import styled from "styled-components";

// Test Ideas
// renders with 3 skills + 'Expand for more skills' if there are more than 3 skills
// renders all skills if there are less than 3 skills
// renders no skills listed if there are 0 skills

function UserSkills(props) {
  return (
    <Section>
      <section className="top">
        <strong>Top Skills</strong>
        {props.topSkills ? (
          <div>
            {props.topSkills
              .split(",")
              .filter((el, i) => i < 3 && el)
              .map(skill => (
                <p key={skill}>{skill}</p>
              ))}
            <p>Expand for more skills</p>
          </div>
        ) : (
          <p>No Top Skills Listed</p>
        )}
      </section>

      <section className="additional">
        <strong>Additional Skills</strong>
        {props.additionalSkills ? (
          <div>
            {props.additionalSkills
              .split(",")
              .filter((el, i) => i < 3 && el)
              .map(skill => (
                <p key={skill}>{skill}</p>
              ))}
            <p>Expand for more skills</p>
          </div>
        ) : (
          <p>No Top Skills Listed</p>
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
