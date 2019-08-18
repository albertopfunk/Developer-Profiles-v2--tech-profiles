import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";

import FiltersContainer from "../../components/filters/FiltersContainer";
import UserCardsContainer from "../../components/user-cards/UserCardsContainer";

class PublicPage extends Component {
  state = {
    users: [],
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

  scrollSectionRef = React.createRef();

  // onInfinite = () => {
  //   console.log("Blup");
  //   console.log("Blup", this.scrollSectionRef.current);
  //   console.log("Blup", this.scrollSectionRef.current.scrollTop);
  //   console.log("Blup", this.scrollSectionRef.current.scrollY);
  //   console.log("Blup", this.scrollSectionRef.current.clientHeight);
  //   console.log("Blup", this.scrollSectionRef.current.scrollHeight);
  // }

  async componentDidMount() {
    
    // window.addEventListener("scroll", this.onInfinite);
    
    // use local storage for filters
    try {
      const users = await axios.get("http://localhost:3001/users");
      this.setState({ users: users.data, initialLoading: false });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  }

  // componentWillUnmount() {
  //   window.removeEventListener("scroll", this.onInfinite);
  // }

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

  setStateAsync = state => {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  };

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
        this.setState({
          users: [...this.state.users, ...users.data],
          infiniteLoading: false
        });
      } else {
        this.setState({ users: users.data, filtersLoading: false });
      }
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };




  infiniteScroll = async () => {
    if (this.state.infiniteLoading) {
      return;
    }
    console.log("alwatys")
    await this.setStateAsync({
      usersPage: this.state.usersPage + 1,
      infiniteLoading: true
    });
    this.loadUsers(true);
  };




  render() {
    console.log(this.state.users.length);
    return (
      <Main>
        <div className="container" ref={this.scrollSectionRef}>
          <FiltersContainer
            setStateAsync={this.setStateAsync}
            loadUsers={this.loadUsers}
          />
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

        <aside>
          {/* do not need this, infinite instead */}
          <button onClick={this.infiniteScroll}>
            {this.state.infiniteLoading ? (
              <span>Loading...</span>
            ) : (
              <span>More Users</span>
            )}
          </button>
        </aside>
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
