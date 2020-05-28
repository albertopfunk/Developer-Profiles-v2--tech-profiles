import React, { Component } from "react";
import styled from "styled-components";

import Filters from "../../components/filters/Filters";
import UserCards from "../../components/user-cards/UserCards";
import { httpClient } from "../../components/http-requests";

class PublicPage extends Component {
  state = {
    users: [],
    noMoreUsers: false,
    initialLoading: true,
    infiniteLoading: false,
    filtersLoading: false,
    usersPage: 1,
    isWebDevChecked: false,
    isUIUXChecked: false,
    isIOSChecked: false,
    isAndroidChecked: false,
    isUsingCurrLocationFilter: false,
    selectedWithinMiles: 0,
    chosenLocationLat: 0,
    chosenLocationLon: 0,
    isUsingRelocateToFilter: false,
    chosenRelocateToArr: [],
    isUsingSortByChoice: false,
    sortByChoice: "acending(oldest-newest)"
  };

  async componentDidMount() {
    const [res, err] = await httpClient("GET", "/users");

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    this.setState({ users: res.data, initialLoading: false });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.isWebDevChecked !== nextState.isWebDevChecked ||
      this.state.isUIUXChecked !== nextState.isUIUXChecked ||
      this.state.isIOSChecked !== nextState.isIOSChecked ||
      this.state.isAndroidChecked !== nextState.isAndroidChecked ||
      this.state.isUsingCurrLocationFilter !==
        nextState.isUsingCurrLocationFilter ||
      this.state.selectedWithinMiles !== nextState.selectedWithinMiles ||
      this.state.chosenLocationLat !== nextState.chosenLocationLat ||
      this.state.chosenLocationLon !== nextState.chosenLocationLon ||
      this.state.isUsingRelocateToFilter !==
        nextState.isUsingRelocateToFilter ||
      this.state.chosenRelocateToArr !== nextState.chosenRelocateToArr ||
      this.state.isUsingSortByChoice !== nextState.isUsingSortByChoice ||
      this.state.sortByChoice !== nextState.sortByChoice
    ) {
      return false;
    }
    return true;
  }

  getFilteredUsers = async () => {
    const [res, err] = await httpClient("POST", "users/filtered", {
      usersPage: this.state.usersPage,
      isWebDevChecked: this.state.isWebDevChecked,
      isUIUXChecked: this.state.isUIUXChecked,
      isIOSChecked: this.state.isIOSChecked,
      isAndroidChecked: this.state.isAndroidChecked,
      isUsingCurrLocationFilter: this.state.isUsingCurrLocationFilter,
      selectedWithinMiles: this.state.selectedWithinMiles,
      chosenLocationLat: this.state.chosenLocationLat,
      chosenLocationLon: this.state.chosenLocationLon,
      isUsingRelocateToFilter: this.state.isUsingRelocateToFilter,
      chosenRelocateToArr: this.state.chosenRelocateToArr,
      isUsingSortByChoice: this.state.isUsingSortByChoice,
      sortByChoice: this.state.sortByChoice
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    this.setState({
      users: res.data,
      filtersLoading: false,
      noMoreUsers: false
    });
    window.scrollTo(0, 0);
  };

  loadMoreUsers = async () => {
    const [res, err] = await httpClient(
      "GET",
      `users/load-more/${this.state.usersPage}`
    );

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    if (res.data.length === 0) {
      this.setState({
        noMoreUsers: true,
        infiniteLoading: false
      });
      return;
    }

    this.setState({
      users: [...this.state.users, ...res.data],
      infiniteLoading: false,
      noMoreUsers: false
    });
  };

  infiniteScroll = () => {
    if (this.state.infiniteLoading || this.state.noMoreUsers) {
      return;
    }
    this.setState(
      {
        usersPage: this.state.usersPage + 1,
        infiniteLoading: true
      },
      () => this.loadMoreUsers()
    );
  };

  updateUsers = stateUpdate => {
    this.setState(stateUpdate, () => this.getFilteredUsers());
  };

  render() {
    console.log("===PUBLIC PAGE===", this.state.users.length);
    return (
      <Main>
        <Filters updateUsers={this.updateUsers} />
        {this.state.initialLoading || this.state.filtersLoading ? (
          <h1>Loading...</h1>
        ) : (
          <UserCards
            infiniteScroll={this.infiniteScroll}
            isBusy={this.state.infiniteLoading}
            users={this.state.users}
          />
        )}
      </Main>
    );
  }
}

const Main = styled.main`
  padding-top: 100px;
  background-color: lightblue;
`;

export default PublicPage;
