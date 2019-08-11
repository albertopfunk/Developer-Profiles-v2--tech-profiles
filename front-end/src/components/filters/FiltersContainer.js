import React, { Component } from "react";
// import styled from "styled-components";

import AreaOfWorkFilter from "./AreaOfWorkFilter";
import CurrentLocationFilter from "./CurrentLocationFilter";
import RelocateToFilter from "./RelocateToFilter";
import SortingFilter from "./SortingFilter";

class FiltersContainer extends Component {
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

  currentLocationFilter = async locationState => {
    const {
      selectedWithinMiles,
      chosenLocationLat,
      chosenLocationLon
    } = locationState;
    await this.props.setStateAsync({
      usersPage: 1,
      selectedWithinMiles,
      chosenLocationLat,
      chosenLocationLon,
      isUsingSortByChoice: true,
      isUsingCurrLocationFilter: true
    });
    this.props.loadUsers();
  };

  relocateToFilter = async chosenRelocateTo => {
    await this.props.setStateAsync({
      usersPage: 1,
      chosenRelocateTo,
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

  resetLocationFilters = async locationFilter => {
    if (locationFilter === "currLocationFilter") {
      await this.props.setStateAsync({
        isUsingCurrLocationFilter: false
      });
    } else if (locationFilter === "relocateToFilter") {
      await this.props.setStateAsync({
        isUsingRelocateToFilter: false
      });
    } else {
      return;
    }
    this.props.loadUsers();
  };

  render() {
    return (
      <aside>
        {/* Will need text input - str:sortByChoice */}
        <SortingFilter sortUsers={this.sortUsers} />

        <AreaOfWorkFilter
          toggleAreaOfWorkCheckbox={this.toggleAreaOfWorkCheckbox}
        />

        <CurrentLocationFilter
          resetLocationFilters={this.resetLocationFilters}
          currentLocationFilter={this.currentLocationFilter}
        />

        <RelocateToFilter
          resetLocationFilters={this.resetLocationFilters}
          relocateToFilter={this.relocateToFilter}
        />
      </aside>
    );
  }
}

export default FiltersContainer;
