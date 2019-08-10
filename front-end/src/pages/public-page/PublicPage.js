/*eslint no-console: ["warn", { allow: ["error"] }] */
import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";

// reset all users

// sort choices
//  descending(newest-oldest)
//  acending(oldest-newest)

class PublicPage extends Component {
  state = {
    users: [],

    usersPage: 1,

    // add little loading indicators so users know when filter is being ran,
    // disable while loading to avoid misuse
    isWebDevChecked: false,
    isUIUXChecked: false,
    isIOSChecked: false,
    isAndroidChecked: false,

    isUsingCurrLocationFilter: false,
    isUsingRelocateToFilter: false,

    selectedWithinMiles: 500, // 0
    // Boston
    chosenLocationLat: 42.361145, // 0
    chosenLocationLon: -71.057083, // 0

    chosenRelocateTo: "Boston, MA, USA", // ""

    isUsingSortByChoice: false, // always needs to be true when running any filter
    sortByChoice: "acending(oldest-newest)" // acending(oldest-newest) default, so we will not have to run this alg on initial load
  };

  async componentDidMount() {
    try {
      const users = await axios.get("http://localhost:3001/users");
      this.setState({ users: users.data });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  }

  setStateAsync = state => {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  };

  loadUsers = async () => {
    const {
      usersPage,
      isWebDevChecked,
      isUIUXChecked,
      isIOSChecked,
      isAndroidChecked,
      isUsingCurrLocationFilter,
      isUsingRelocateToFilter,
      selectedWithinMiles,
      chosenLocationLat,
      chosenLocationLon,
      chosenRelocateTo,
      isUsingSortByChoice,
      sortByChoice
    } = this.state;

    try {
      const users = await axios.post(
        `http://localhost:3001/users/infinite/${usersPage}`,
        {
          isWebDevChecked,
          isUIUXChecked,
          isIOSChecked,
          isAndroidChecked,
          isUsingCurrLocationFilter,
          isUsingRelocateToFilter,
          selectedWithinMiles,
          chosenLocationLat,
          chosenLocationLon,
          chosenRelocateTo,
          isUsingSortByChoice,
          sortByChoice
        }
      );
      // if users.data.length === 0 = no users returned
      return users.data;
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  infiniteScroll = async () => {
    await this.setStateAsync({ usersPage: this.state.usersPage + 1 });
    try {
      const users = await this.loadUsers();
      // if state.length === users.length = no more users to add
      this.setState({ users: [...this.state.users, ...users] });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  toggleAreaOfWorkCheckbox = async areaOfWork => {
    await this.setStateAsync({ usersPage: 1, isUsingSortByChoice: true });
    switch (areaOfWork) {
      case "Web Development":
        await this.setStateAsync(prevState => ({
          isWebDevChecked: !prevState.isWebDevChecked
        }));
        break;
      case "UI/UX":
        await this.setStateAsync(prevState => ({
          isUIUXChecked: !prevState.isUIUXChecked
        }));
        break;
      case "iOS":
        await this.setStateAsync(prevState => ({
          isIOSChecked: !prevState.isIOSChecked
        }));
        break;
      case "Android":
        await this.setStateAsync(prevState => ({
          isAndroidChecked: !prevState.isAndroidChecked
        }));
        break;
      default:
        return;
    }

    try {
      const users = await this.loadUsers();
      this.setState({ users });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  currentLocationFilter = async () => {
    // selectedWithinMiles, chosenLocationLat, chosenLocationLon
    await this.setStateAsync({
      usersPage: 1,
      isUsingSortByChoice: true,
      isUsingCurrLocationFilter: true
    });
    try {
      const users = await this.loadUsers();
      this.setState({ users });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  relocateToFilter = async () => {
    // chosenRelocateTo
    await this.setStateAsync({
      usersPage: 1,
      isUsingSortByChoice: true,
      isUsingRelocateToFilter: true
    });
    try {
      const users = await this.loadUsers();
      this.setState({ users });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  sortUsers = async () => {
    // sortByChoice
    await this.setStateAsync({ usersPage: 1, isUsingSortByChoice: true });
    try {
      const users = await this.loadUsers();
      this.setState({ users });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  resetLocationFilters = async () => {
    await this.setStateAsync({
      isUsingCurrLocationFilter: false,
      isUsingRelocateToFilter: false
    });
    try {
      const users = await this.loadUsers();
      this.setState({ users });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  render() {
    //console.log(this.state.users.length);
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
                  onChange={() =>
                    this.toggleAreaOfWorkCheckbox("Web Development")
                  }
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
            <button onClick={this.currentLocationFilter}>LOCATE WITHIN</button>
            <button onClick={this.relocateToFilter}>RELOCATE TO</button>
          </section>
        </aside>
        <button onClick={this.infiniteScroll}>MORE USERS</button>
        <button onClick={this.resetLocationFilters}>RESET</button>
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
                    <p>{user.current_location_name}</p>
                    <p>{user.interested_location_names}</p>
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
