import React, { Component } from "react";
// import styled from "styled-components";
import axios from "axios";

import FiltersContainer from "../../components/filters/FiltersContainer";
import UserCardsContainer from "../../components/user-cards/UserCardsContainer";

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

  loadUsers = async infinite => {
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
