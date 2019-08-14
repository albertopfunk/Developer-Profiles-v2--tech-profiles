import React from "react";

function AreaOfWorkFilter(props) {
  async function toggleAreaOfWorkCheckbox(areaOfWork) {
    switch (areaOfWork) {
      case "Web Development":
        await props.setStateAsync(prevState => ({
          isWebDevChecked: !prevState.isWebDevChecked,
          usersPage: 1,
          isUsingSortByChoice: true
        }));
        break;
      case "UI/UX":
        await props.setStateAsync(prevState => ({
          isUIUXChecked: !prevState.isUIUXChecked,
          usersPage: 1,
          isUsingSortByChoice: true
        }));
        break;
      case "iOS":
        await props.setStateAsync(prevState => ({
          isIOSChecked: !prevState.isIOSChecked,
          usersPage: 1,
          isUsingSortByChoice: true
        }));
        break;
      case "Android":
        await props.setStateAsync(prevState => ({
          isAndroidChecked: !prevState.isAndroidChecked,
          usersPage: 1,
          isUsingSortByChoice: true
        }));
        break;
      default:
        return;
    }
    props.loadUsers();
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
