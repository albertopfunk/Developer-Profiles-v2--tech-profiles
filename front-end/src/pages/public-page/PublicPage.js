/*eslint no-console: ["error", { allow: ["error", "log"] }] */
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

    isUsingLocationFilter: false,
    isUsingRelocateToFilter: true,

    selectedWithinMiles: 500, // 0
    // Boston
    chosenLocationLat: 42.361145, // 0
    chosenLocationLon: -71.057083, // 0

    chosenRelocateTo: "Boston, MA, USA", // ""

    isUsingSortByChoice: false, // always needs to be true when running any filter
    sortByChoice: "descending(newest-oldest)" // acending(oldest-newest) default, so we will not have to run this alg on initial load
  };

  async componentDidMount() {
    const users = await axios.get("http://localhost:3001/users")
    this.setState({users: users.data})
    // const users = await this.loadUsers();
    // this.setState({ users });
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
      isUsingLocationFilter,
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
          isUsingLocationFilter,
          isUsingRelocateToFilter,
          selectedWithinMiles,
          chosenLocationLat,
          chosenLocationLon,
          chosenRelocateTo,
          isUsingSortByChoice,
          sortByChoice
        }
      );

      return users.data;
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  infiniteScroll = async () => {
    await this.setStateAsync({ usersPage: this.state.usersPage + 1 });
    const users = await this.loadUsers();
    this.setState({ users: [...this.state.users, ...users] });
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
    const users = await this.loadUsers();
    this.setState({ users });
  };

  locationFilter = async () => {
    // selectedWithinMiles, chosenLocationLat, chosenLocationLon
    await this.setStateAsync({
      usersPage: 1,
      isUsingSortByChoice: true,
      isUsingLocationFilter: true
    });
    const users = await this.loadUsers();
    this.setState({ users });
  };

  relocateToFilter = async () => {
    // chosenRelocateTo
    await this.setStateAsync({
      usersPage: 1,
      isUsingSortByChoice: true,
      isUsingRelocateToFilter: true
    });
    const users = await this.loadUsers();
    this.setState({ users });
  };

  sortUsers = async () => {
    // sortByChoice
    await this.setStateAsync({ usersPage: 1, isUsingSortByChoice: true });
    const users = await this.loadUsers();
    this.setState({ users });
  };

  // resetAllFilters = async () => {
  //   this.setState({
  //     isWebDevChecked: false,
  //     isUIUXChecked: false,
  //     isIOSChecked: false,
  //     isAndroidChecked: false,
  //     isUsingLocationFilter: false,
  //     isUsingRelocateToFilter: false
  //   })
  // }

  render() {
    // console.log(this.state.users.length, this.state.users);
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
            <button onClick={this.infiniteScroll}>MORE USERS</button>
            {/* <form>
              <label htmlFor="DistanceFromLocation">
                  <input id="DistanceFromLocation" type="number"/>
              </label>
            </form> */}
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
