import React from "react";

function AreaOfWorkFilter(props) {
  return (
    <section>
      <h2>Filter by Area of Work</h2>
      <form>
        <label htmlFor="web-development">
          <input
            type="checkbox"
            name="area-of-work"
            id="web-development"
            onChange={() => props.toggleAreaOfWorkCheckbox("Web Development")}
          />
          Web Development
        </label>
        <br />
        <label htmlFor="UI/UX">
          <input
            type="checkbox"
            name="area-of-work"
            id="UI/UX"
            onChange={() => props.toggleAreaOfWorkCheckbox("UI/UX")}
          />
          UI/UX
        </label>
        <br />
        <label htmlFor="iOS">
          <input
            type="checkbox"
            name="area-of-work"
            id="iOS"
            onChange={() => props.toggleAreaOfWorkCheckbox("iOS")}
          />
          iOS
        </label>
        <br />
        <label htmlFor="Android">
          <input
            type="checkbox"
            name="area-of-work"
            id="Android"
            onChange={() => props.toggleAreaOfWorkCheckbox("Android")}
          />
          Android
        </label>
      </form>
    </section>
  );
}

export default AreaOfWorkFilter;
