import React from "react";
import ReactDOM from "react-dom";
import UserExtras from "../UserExtras";

it("should render 'Nothing to Show' when nothing is passed in component", () => {
  const container = document.createElement("div");
  ReactDOM.render(<UserExtras noExtras={true} />, container);
  expect(container.textContent).toMatch("Nothing to Show");
});

it("should render section if section prop contains items", () => {
  const container = document.createElement("div");
  ReactDOM.render(
    <UserExtras
      noExtras={false}
      projects={[{ project_title: "TestProject" }]}
    />,
    container
  );
  expect(container.textContent).toMatch("TestProject");
});

it("should render multiple sections if section props contains items", () => {
  const container = document.createElement("div");
  ReactDOM.render(
    <UserExtras
      noExtras={false}
      projects={[{ project_title: "TestProject" }]}
      education={[{ school: "TestSchool" }]}
      interestedLocations={["Los Angeles, CA, USA"]}
    />,
    container
  );
  expect(container.textContent).toMatch("TestProject");
  expect(container.textContent).toMatch("TestSchool");
  expect(container.textContent).toMatch("Los Angeles, CA, USA");
});
