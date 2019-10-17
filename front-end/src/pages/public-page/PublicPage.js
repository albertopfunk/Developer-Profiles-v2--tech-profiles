import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";

import Filters from "../../components/filters/Filters";
import UserCards from "../../components/user-cards/UserCards";

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
      const users = await axios.get(`${process.env.REACT_APP_SERVER}/users`);
      this.setState({ users: users.data, initialLoading: false });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (
      this.state.isWebDevChecked !== nextState.isWebDevChecked ||
      this.state.isUIUXChecked !== nextState.isUIUXChecked ||
      this.state.isIOSChecked !== nextState.isIOSChecked ||
      this.state.isAndroidChecked !== nextState.isAndroidChecked ||
      this.state.isUsingCurrLocationFilter !== nextState.isUsingCurrLocationFilter ||
      this.state.selectedWithinMiles !== nextState.selectedWithinMiles ||
      this.state.chosenLocationLat !== nextState.chosenLocationLat ||
      this.state.chosenLocationLon !== nextState.chosenLocationLon ||
      this.state.isUsingRelocateToFilter !== nextState.isUsingRelocateToFilter ||
      this.state.chosenRelocateTo !== nextState.chosenRelocateTo ||
      this.state.isUsingSortByChoice !== nextState.isUsingSortByChoice ||
      this.state.sortByChoice !== nextState.sortByChoice
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

    try {
      const users = await axios.get(`${process.env.REACT_APP_SERVER}/users/infinite`, {
        params: {
          usersPage: this.state.usersPage,
          isUsinginfinite,
          isWebDevChecked: this.state.isWebDevChecked,
          isUIUXChecked: this.state.isUIUXChecked,
          isIOSChecked: this.state.isIOSChecked,
          isAndroidChecked: this.state.isAndroidChecked,
          isUsingCurrLocationFilter: this.state.isUsingCurrLocationFilter,
          selectedWithinMiles: this.state.selectedWithinMiles,
          chosenLocationLat: this.state.chosenLocationLat,
          chosenLocationLon: this.state.chosenLocationLon,
          isUsingRelocateToFilter: this.state.isUsingRelocateToFilter,
          chosenRelocateTo: this.state.chosenRelocateTo,
          isUsingSortByChoice: this.state.isUsingSortByChoice,
          sortByChoice: this.state.sortByChoice
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
        window.scrollTo(0,0);
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
    // console.log(this.state.users.length);
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
