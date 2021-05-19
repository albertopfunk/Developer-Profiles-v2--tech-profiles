import React from "react";
import styled from "styled-components";

// Additional Area of Work
// AR/VR
// Blockchain
// Data Science
// AI

function AreaOfWorkFilter(props) {
  const developmentRef = React.createRef();
  const designRef = React.createRef();
  const iosRef = React.createRef();
  const androidRef = React.createRef();

  function toggleAreaOfWorkCheckbox() {
    props.updateUsers({
      isWebDevChecked: developmentRef.current.checked,
      isUIUXChecked: designRef.current.checked,
      isIOSChecked: iosRef.current.checked,
      isAndroidChecked: androidRef.current.checked,
    });
  }

  return (
    <AreaOfWorkFieldset>
      <legend>Filter by Area of Work</legend>
      <div className="flex-container">
        <label htmlFor="web-development">
          <input
            ref={developmentRef}
            type="checkbox"
            name="area-of-work"
            id="web-development"
            onChange={toggleAreaOfWorkCheckbox}
          />
          Development
        </label>
        <br />
        <label htmlFor="Design">
          <input
            ref={designRef}
            type="checkbox"
            name="area-of-work"
            id="Design"
            onChange={toggleAreaOfWorkCheckbox}
          />
          Design
        </label>
        <br />
        <label htmlFor="iOS">
          <input
            ref={iosRef}
            type="checkbox"
            name="area-of-work"
            id="iOS"
            onChange={toggleAreaOfWorkCheckbox}
          />
          iOS
        </label>
        <br />
        <label htmlFor="Android">
          <input
            ref={androidRef}
            type="checkbox"
            name="area-of-work"
            id="Android"
            onChange={toggleAreaOfWorkCheckbox}
          />
          Android
        </label>
      </div>
    </AreaOfWorkFieldset>
  );
}

const AreaOfWorkFieldset = styled.fieldset`
  & > .flex-container {
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
  }
`;

export default AreaOfWorkFilter;
