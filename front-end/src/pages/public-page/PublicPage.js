import React, { Component } from "react";
import styled from "styled-components";
import { Helmet } from "react-helmet";

import Filters from "../../components/forms/filters";
import UserCards from "../../components/user-cards/UserCards";
import { httpClient } from "../../global/helpers/http-requests";
import Announcer from "../../global/helpers/announcer";

class PublicPage extends Component {
  state = {
    users: [],
    usersLength: 0,
    noMoreUsers: false,
    initialLoading: true,
    usersLoading: false,
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
    });

    if (res.data.users.length < this.state.usersLength) {
      this.setState({
        noMoreUsers: false,
      });
    } else {
      this.setState({
        noMoreUsers: true,
      });
    }

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
    });

    if (this.state.users.length + res.data.length < this.state.usersLength) {
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
    console.log(
      "===PUBLIC PAGE===",
      this.state.users.length,
      "TOTAL",
      this.state.usersLength
    );
    return (
      <MainContainer>
        <Helmet>
          <title>Profiles • Tech Profiles</title>
        </Helmet>
        {/* sr-only heading */}
        <Filters updateUsers={this.updateUsers} />
        {this.state.initialLoading || this.state.filtersLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            <Announcer
              announcement={`Showing ${this.state.users.length} of ${this.state.usersLength} Users`}
              ariaId="users-feed-announcement"
              ariaLive="polite"
            />
            <UserCards
              loadMoreUsers={this.loadMoreUsers}
              canLoadMore={this.state.noMoreUsers}
              isBusy={this.state.usersLoading}
              users={this.state.users}
              usersLength={this.state.usersLength}
            />
          </>
        )}
      </MainContainer>
    );
  }
}

const MainContainer = styled.div`
  padding-top: 100px;
  background-color: lightblue;
`;

export default PublicPage;
