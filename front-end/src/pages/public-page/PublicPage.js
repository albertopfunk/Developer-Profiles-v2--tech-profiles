import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";

class PublicPage extends Component {
  state = {
    users: [],

    isWebDevChecked: false,
    isUIUXChecked: false,
    isIOSChecked: false,
    isAndroidChecked: false
  };

  async componentDidMount() {
    const users = await axios.get("http://localhost:3001/users");
    this.setState({ users: users.data });
  }

  toggleAreaOfWorkCheckbox = areaOfWork => {
    switch (areaOfWork) {
      case "Web Development":
        this.setState(prevState => ({
          isWebDevChecked: !prevState.isWebDevChecked
        }));
        break;
      case "UI/UX":
        this.setState(prevState => {
          return { isUIUXChecked: !prevState.isUIUXChecked };
        });
        break;
      case "iOS":
        this.setState(prevState => {
          return { isIOSChecked: !prevState.isIOSChecked };
        });
        break;
      case "Android":
        this.setState(prevState => {
          return { isAndroidChecked: !prevState.isAndroidChecked };
        });
        break;
      default:
        return;
    }
    this.filterByAreaOfWork();
  }

  filterByAreaOfWork = async () => {
    const usersData = await axios.get("http://localhost:3001/users");
    let users = usersData.data;

    const {
      isWebDevChecked,
      isUIUXChecked,
      isIOSChecked,
      isAndroidChecked
    } = this.state;

    if (!isWebDevChecked && !isUIUXChecked && !isIOSChecked && !isAndroidChecked) {
      this.setState({ users });
      return;
    }

    users = users.filter(user => user.area_of_work !== null);

    if (!isWebDevChecked) {
      users = users.filter(user => user.area_of_work !== "Web Development");
    }

    if (!isUIUXChecked) {
      users = users.filter(user => user.area_of_work !== "UI/UX");
    }

    if (!isIOSChecked) {
      users = users.filter(user => user.area_of_work !== "iOS");
    }

    if (!isAndroidChecked) {
      users = users.filter(user => user.area_of_work !== "Android");
    }

    this.setState({ users });
  };

  // filter
  // click on checkbox
  // if box is 'checked'
  // filter users.area_of_work with areaOfWork param
  // toggle isWebDevChecked, isUIUXChecked, isIOSChecked, isAndroidChecked
  // ONLY SHOW 'CHECKED' users when one or more filter is checked
  // if box is 'unchecked'
  // filter users.area_of_work with areaOfWork param
  // toggle isWebDevChecked, isUIUXChecked, isIOSChecked, isAndroidChecked
  // ONLY SHOW 'CHECKED' users when one or more filter is unchecked
  // show ALL users when all filters are unchecked

  render() {
    //console.log(this.state.users.length, this.state.users);
    //this.state.users.forEach(user => console.log(user.area_of_work))
    return (
      <main>
        <aside>
          <section>
            <h2>Filter by Area of Work</h2>
            <form>
              <label htmlFor="web-development">
                <input
                  type="checkbox"
                  name="area-of-work"
                  id="web-development"
                  onChange={() => this.toggleAreaOfWorkCheckbox("Web Development")}
                />
                Web Development
              </label>
              <br />
              <label htmlFor="UI/UX">
                <input
                  type="checkbox"
                  name="area-of-work"
                  id="UI/UX"
                  onChange={() => this.toggleAreaOfWorkCheckbox("UI/UX")}
                />
                UI/UX
              </label>
              <br />
              <label htmlFor="iOS">
                <input
                  type="checkbox"
                  name="area-of-work"
                  id="iOS"
                  onChange={() => this.toggleAreaOfWorkCheckbox("iOS")}
                />
                iOS
              </label>
              <br />
              <label htmlFor="Android">
                <input
                  type="checkbox"
                  name="area-of-work"
                  id="Android"
                  onChange={() => this.toggleAreaOfWorkCheckbox("Android")}
                />
                Android
              </label>
            </form>
          </section>
        </aside>
        <section>
          {this.state.users.length === 0 ? (
            <h1>Loading...</h1>
          ) : (
            <>
              {this.state.users.map(user => {
                return (
                  <User key={user.id}>
                    <p>{user.first_name}</p>
                    <p>{user.id}</p>
                    <p>{user.area_of_work}</p>
                  </User>
                );
              })}
            </>
          )}
        </section>
      </main>
    );
  }
}

const User = styled.article`
  margin: 20px;
  border: solid;
`;

export default PublicPage;
