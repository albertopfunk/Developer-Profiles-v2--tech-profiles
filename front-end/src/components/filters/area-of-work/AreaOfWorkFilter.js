import React from "react";

// Additional Area of Work
  // AR/VR
  // Blockchain
  // Data Science
  // AI

function AreaOfWorkFilter(props) {
  function toggleAreaOfWorkCheckbox(areaOfWork) {
    switch (areaOfWork) {
      case "Web Development":
        props.updateUsers(prevState => ({
          isWebDevChecked: !prevState.isWebDevChecked,
          usersPage: 1,
          isUsingSortByChoice: true
        }));
        break;
      case "UI/UX":
        props.updateUsers(prevState => ({
          isUIUXChecked: !prevState.isUIUXChecked,
          usersPage: 1,
          isUsingSortByChoice: true
        }));
        break;
      case "iOS":
        props.updateUsers(prevState => ({
          isIOSChecked: !prevState.isIOSChecked,
          usersPage: 1,
          isUsingSortByChoice: true
        }));
        break;
      case "Android":
        props.updateUsers(prevState => ({
          isAndroidChecked: !prevState.isAndroidChecked,
          usersPage: 1,
          isUsingSortByChoice: true
        }));
        break;
      default:
        console.error("unable to find area of work");
        return;
    }
  }

  return (
    <section>
      <h2>Filter by Area of Work</h2>
      <form>
        <label htmlFor="web-development">
          <input
            type="checkbox"
            name="area-of-work"
            id="web-development"
            onChange={() => toggleAreaOfWorkCheckbox("Web Development")}
          />
          Web Development
        </label>
        <br />
        <label htmlFor="UI/UX">
          <input
            type="checkbox"
            name="area-of-work"
            id="UI/UX"
            onChange={() => toggleAreaOfWorkCheckbox("UI/UX")}
          />
          UI/UX
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
      </form>
    </section>
  );
}

export default AreaOfWorkFilter;
