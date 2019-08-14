import React, { Component } from "react";
// import styled from "styled-components";
import axios from "axios";

import FiltersContainer from "../../components/filters/FiltersContainer";
import UserCardsContainer from "../../components/user-cards/UserCardsContainer";

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
    selectedWithinMiles: 0,
    chosenLocationLat: 0,
    chosenLocationLon: 0,
    chosenRelocateTo: "",
    isUsingSortByChoice: false,
    sortByChoice: "acending(oldest-newest)"
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

  loadUsers = async infinite => {
    const {
      usersPage,
      isWebDevChecked,
      isUIUXChecked,
      isIOSChecked,
      isAndroidChecked,
      isUsingCurrLocationFilter,
      selectedWithinMiles,
      chosenLocationLat,
      chosenLocationLon,
      isUsingRelocateToFilter,
      chosenRelocateTo,
      isUsingSortByChoice,
      sortByChoice
    } = this.state;

    try {
      const users = await axios.post(
        "http://localhost:3001/users/infinite",
        {
          infinite,
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
        }
      );
      if (infinite === "infinite") {
        this.setState({ users: [...this.state.users, ...users.data] });
      } else {
        this.setState({ users: users.data });
      }
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  infiniteScroll = async () => {
    await this.setStateAsync({ usersPage: this.state.usersPage + 1 });
    this.loadUsers("infinite");
  };

  render() {
    console.log(this.state.users.length);
    return (
      <main>
        <FiltersContainer
          setStateAsync={this.setStateAsync}
          loadUsers={this.loadUsers}
        />
        <UserCardsContainer users={this.state.users} />

        {/* Can contain scrolling logic, and call infiniteScroll */}
        {/* props infiniteScroll */}
        <aside>
          <button onClick={this.infiniteScroll}>MORE USERS</button>
        </aside>
      </main>
    );
  }
}

export default PublicPage;
