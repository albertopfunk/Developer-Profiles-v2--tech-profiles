import React, { Component } from "react";
// import styled from "styled-components";

import AreaOfWorkFilter from "./AreaOfWorkFilter";
import CurrentLocationFilter from "./CurrentLocationFilter";
import RelocateToFilter from "./RelocateToFilter";
import SortingFilter from "./SortingFilter";

class FiltersContainer extends Component {
  // Filters - props setStateAsync, loadUsers
  toggleAreaOfWorkCheckbox = async areaOfWork => {
    await this.props.setStateAsync({ usersPage: 1, isUsingSortByChoice: true });
    switch (areaOfWork) {
      case "Web Development":
        await this.props.setStateAsync(prevState => ({
          isWebDevChecked: !prevState.isWebDevChecked
        }));
        break;
      case "UI/UX":
        await this.props.setStateAsync(prevState => ({
          isUIUXChecked: !prevState.isUIUXChecked
        }));
        break;
      case "iOS":
        await this.props.setStateAsync(prevState => ({
          isIOSChecked: !prevState.isIOSChecked
        }));
        break;
      case "Android":
        await this.props.setStateAsync(prevState => ({
          isAndroidChecked: !prevState.isAndroidChecked
        }));
        break;
      default:
        return;
    }
    this.props.loadUsers();
  };

  // Filters - props setStateAsync, loadUsers
  currentLocationFilter = async () => {
    // selectedWithinMiles, chosenLocationLat, chosenLocationLon
    await this.props.setStateAsync({
      usersPage: 1,
      isUsingSortByChoice: true,
      isUsingCurrLocationFilter: true
    });
    this.props.loadUsers();
  };

  // Filters - props setStateAsync, loadUsers
  relocateToFilter = async () => {
    // chosenRelocateTo
    await this.props.setStateAsync({
      usersPage: 1,
      isUsingSortByChoice: true,
      isUsingRelocateToFilter: true
    });
    this.props.loadUsers();
  };

  // Filters - props setStateAsync, loadUsers
  sortUsers = async () => {
    // sortByChoice
    await this.props.setStateAsync({ usersPage: 1, isUsingSortByChoice: true });
    this.props.loadUsers();
  };

  // Filters - props setStateAsync, loadUsers
  resetLocationFilters = async () => {
    await this.props.setStateAsync({
      isUsingCurrLocationFilter: false,
      isUsingRelocateToFilter: false
    });
    this.props.loadUsers();
  };

  render() {
    return (
      <aside>
        {/* Will need text input - str:sortByChoice */}
        <SortingFilter sortUsers={this.sortUsers} />

        {/* No text input, checkboxes */}
        <AreaOfWorkFilter
          toggleAreaOfWorkCheckbox={this.toggleAreaOfWorkCheckbox}
        />

        {/* Will need text input - num:selectedWithinMiles, num:chosenLocationLat, num:chosenLocationLon */}
        <CurrentLocationFilter
          currentLocationFilter={this.currentLocationFilter}
        />

        {/* Will need text input - chosenRelocateTo */}
        <RelocateToFilter relocateToFilter={this.relocateToFilter} />

        <button type="reset" onClick={this.resetLocationFilters}>
          RESET
        </button>
      </aside>
    );
  }
}

export default FiltersContainer;
