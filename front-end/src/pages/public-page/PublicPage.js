import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";

import FiltersContainer from "../../components/filters/FiltersContainer";
import UserCardsContainer from "../../components/user-cards/UserCardsContainer";

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
    chosenRelocateTo: "",
    isUsingSortByChoice: false,
    sortByChoice: "acending(oldest-newest)"
  };

  async componentDidMount() {
    try {
      const users = await axios.get("http://localhost:3001/users");
      this.setState({ users: users.data, initialLoading: false });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const {
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

    if (
      isWebDevChecked !== nextState.isWebDevChecked ||
      isUIUXChecked !== nextState.isUIUXChecked ||
      isIOSChecked !== nextState.isIOSChecked ||
      isAndroidChecked !== nextState.isAndroidChecked ||
      isUsingCurrLocationFilter !== nextState.isUsingCurrLocationFilter ||
      selectedWithinMiles !== nextState.selectedWithinMiles ||
      chosenLocationLat !== nextState.chosenLocationLat ||
      chosenLocationLon !== nextState.chosenLocationLon ||
      isUsingRelocateToFilter !== nextState.isUsingRelocateToFilter ||
      chosenRelocateTo !== nextState.chosenRelocateTo ||
      isUsingSortByChoice !== nextState.isUsingSortByChoice ||
      sortByChoice !== nextState.sortByChoice
    ) {
      return false;
    }
    return true;
  }

  loadUsers = async isUsinginfinite => {
    // app filter loading is too fast so it will only show a flash
    // if (!isUsinginfinite) {
    //   this.setState({ filtersLoading: true });
    // }

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
      const users = await axios.get("http://localhost:3001/users/infinite", {
        params: {
          usersPage: usersPage,
          isUsinginfinite: isUsinginfinite,
          isWebDevChecked: isWebDevChecked,
          isUIUXChecked: isUIUXChecked,
          isIOSChecked: isIOSChecked,
          isAndroidChecked: isAndroidChecked,
          isUsingCurrLocationFilter: isUsingCurrLocationFilter,
          selectedWithinMiles: selectedWithinMiles,
          chosenLocationLat: chosenLocationLat,
          chosenLocationLon: chosenLocationLon,
          isUsingRelocateToFilter: isUsingRelocateToFilter,
          chosenRelocateTo: chosenRelocateTo,
          isUsingSortByChoice: isUsingSortByChoice,
          sortByChoice: sortByChoice
        }
      });

      if (isUsinginfinite) {
        if (users.data.length === 0) {
          this.setState({
            noMoreUsers: true,
            infiniteLoading: false
          });
        } else {
          this.setState({
            users: [...this.state.users, ...users.data],
            infiniteLoading: false,
            noMoreUsers: false
          });
        }
      } else {
        this.setState({
          users: users.data,
          filtersLoading: false,
          noMoreUsers: false
        });
      }
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
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
      () => this.loadUsers(true)
    );
  };

  updateUsers = stateUpdate => {
    this.setState(stateUpdate, () => this.loadUsers(false));
  };

  render() {
    console.log(this.state.users.length);
    return (
      <Main>
        <div className="container">
          <FiltersContainer updateUsers={this.updateUsers} />
          {this.state.initialLoading || this.state.filtersLoading ? (
            <p>LOADING...</p>
          ) : (
            <UserCardsContainer
              infiniteScroll={this.infiniteScroll}
              isBusy={this.state.infiniteLoading}
              users={this.state.users}
            />
          )}
        </div>
      </Main>
    );
  }
}

const Main = styled.main`
  background-color: lightblue;
  > div {
    display: flex;
  }
`;

export default PublicPage;
