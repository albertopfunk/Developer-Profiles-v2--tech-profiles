import React from "react";

// Additional Area of Work
// AR/VR
// Blockchain
// Data Science
// AI

function AreaOfWorkFilter(props) {
  function toggleAreaOfWorkCheckbox(areaOfWork) {
    switch (areaOfWork) {
      case "Development":
        props.updateUsers((prevState) => ({
          isWebDevChecked: !prevState.isWebDevChecked,
        }));
        break;
      case "Design":
        props.updateUsers((prevState) => ({
          isUIUXChecked: !prevState.isUIUXChecked,
        }));
        break;
      case "iOS":
        props.updateUsers((prevState) => ({
          isIOSChecked: !prevState.isIOSChecked,
        }));
        break;
      case "Android":
        props.updateUsers((prevState) => ({
          isAndroidChecked: !prevState.isAndroidChecked,
        }));
        break;
      default:
        console.error("unable to find area of work");
        return;
    }
  }

  return (
    <fieldset>
      <legend>Filter by Area of Work</legend>
      <label htmlFor="web-development">
        <input
          type="checkbox"
          name="area-of-work"
          id="web-development"
          onChange={() => toggleAreaOfWorkCheckbox("Development")}
        />
        Development
      </label>
      <br />
      <label htmlFor="Design">
        <input
          type="checkbox"
          name="area-of-work"
          id="Design"
          onChange={() => toggleAreaOfWorkCheckbox("Design")}
        />
        Design
      </label>
      <br />
      <label htmlFor="iOS">
        <input
          type="checkbox"
          name="area-of-work"
          id="iOS"
          onChange={() => toggleAreaOfWorkCheckbox("iOS")}
        />
        iOS
      </label>
      <br />
      <label htmlFor="Android">
        <input
          type="checkbox"
          name="area-of-work"
          id="Android"
          onChange={() => toggleAreaOfWorkCheckbox("Android")}
        />
        Android
      </label>
    </fieldset>
  );
}

export default AreaOfWorkFilter;
