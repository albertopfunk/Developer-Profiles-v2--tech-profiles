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
        <div className="flex-item">
          <input
            ref={developmentRef}
            type="checkbox"
            name="area-of-work"
            id="web-development"
            onChange={toggleAreaOfWorkCheckbox}
          />
          <label htmlFor="web-development">Development</label>
        </div>

        <div className="flex-item">
          <input
            ref={designRef}
            type="checkbox"
            name="area-of-work"
            id="Design"
            onChange={toggleAreaOfWorkCheckbox}
          />
          <label htmlFor="Design">Design</label>
        </div>

        <div className="flex-item">
          <input
            ref={iosRef}
            type="checkbox"
            name="area-of-work"
            id="iOS"
            onChange={toggleAreaOfWorkCheckbox}
          />
          <label htmlFor="iOS">iOS</label>
        </div>

        <div className="flex-item">
          <input
            ref={androidRef}
            type="checkbox"
            name="area-of-work"
            id="Android"
            onChange={toggleAreaOfWorkCheckbox}
          />
          <label htmlFor="Android">Android</label>
        </div>
      </div>
    </AreaOfWorkFieldset>
  );
}

const AreaOfWorkFieldset = styled.fieldset`
  .flex-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;

    .flex-item {
      display: flex;
      gap: 3px;
      align-items: center;
      justify-content: flex-start;
    }
  }
`;

export default AreaOfWorkFilter;
