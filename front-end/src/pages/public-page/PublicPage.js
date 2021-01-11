import React, { Component } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import Filters from "../../components/forms/filters";
import UserCards from "../../components/user-cards/UserCards";

import { httpClient } from "../../global/helpers/http-requests";
import MainHeader from "../../components/header/MainHeader";

class PublicPage extends Component {
  state = {
    users: [],
    usersLength: 0,
    noMoreUsers: false,
    initialLoading: true,
    usersLoading: false,
    filtersLoading: false,
    nextCardIndex: 0,
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
    chosenRelocateToObj: {},
    sortChoice: "acending(oldest-newest)",
  };

  async componentDidMount() {
    const [res, err] = await httpClient("GET", "/users");

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    this.setState({
      users: res.data.users,
      usersLength: res.data.len,
      initialLoading: false,
      noMoreUsers: res.data.users.length <= 25 ? true : false,
    });
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
      this.state.chosenRelocateToObj !== nextState.chosenRelocateToObj ||
      this.state.sortChoice !== nextState.sortChoice
    ) {
      return false;
    }
    return true;
  }

  getFilteredUsers = async () => {
    const [res, err] = await httpClient("POST", "/users/filtered", {
      isWebDevChecked: this.state.isWebDevChecked,
      isUIUXChecked: this.state.isUIUXChecked,
      isIOSChecked: this.state.isIOSChecked,
      isAndroidChecked: this.state.isAndroidChecked,
      isUsingCurrLocationFilter: this.state.isUsingCurrLocationFilter,
      selectedWithinMiles: this.state.selectedWithinMiles,
      chosenLocationLat: this.state.chosenLocationLat,
      chosenLocationLon: this.state.chosenLocationLon,
      isUsingRelocateToFilter: this.state.isUsingRelocateToFilter,
      chosenRelocateToObj: this.state.chosenRelocateToObj,
      sortChoice: this.state.sortChoice,
    });

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    this.setState({
      users: res.data.users,
      usersLength: res.data.len,
      filtersLoading: false,
      noMoreUsers: res.data.users.length <= 25 ? true : false,
    });

    window.scrollTo(0, 0);
  };

  loadMoreUsers = async () => {
    this.setState({ usersLoading: true });

    const [res, err] = await httpClient(
      "GET",
      `/users/load-more/${this.state.usersPage + 1}`
    );

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    this.setState({
      users: [...this.state.users, ...res.data],
      usersPage: this.state.usersPage + 1,
      usersLoading: false,
      nextCardIndex: this.state.users.length,
    });

    if (this.state.users.length + res.data.length <= this.state.usersLength) {
      this.setState({
        noMoreUsers: false,
      });
    } else {
      this.setState({
        noMoreUsers: true,
      });
    }
  };

  updateUsers = (stateUpdate) => {
    this.setState(stateUpdate, () => this.getFilteredUsers());
  };

  render() {
    return (
      <>
        <div>
          <MainHeader
            isValidated={this.props.isValidated}
            signOut={this.props.signOut}
            signIn={this.props.signIn}
          />
          <Filters
            updateUsers={this.updateUsers}
            currentUsers={this.state.users.length}
            totalUsers={this.state.usersLength}
          />
        </div>

        <Main aria-labelledby="main-heading">
          <Helmet>
            <title>Profiles • Tech Profiles</title>
          </Helmet>
          <h1 id="main-heading">Profiles</h1>
          {this.state.initialLoading || this.state.filtersLoading ? (
            <div
              role="feed"
              aria-busy="true"
              aria-labelledby="profiles-heading"
            >
              <h2 id="profiles-heading">Loading Profiles</h2>
            </div>
          ) : (
            <UserCards
              loadMoreUsers={this.loadMoreUsers}
              noMoreUsers={this.state.noMoreUsers}
              nextCardIndex={this.state.nextCardIndex}
              isBusy={this.state.usersLoading}
              users={this.state.users}
              currentUsers={this.state.users.length}
              totalUsers={this.state.usersLength}
            />
          )}
        </Main>
      </>
    );
  }
}

const Main = styled.main`
  border: solid lightblue;
`;

export default PublicPage;
