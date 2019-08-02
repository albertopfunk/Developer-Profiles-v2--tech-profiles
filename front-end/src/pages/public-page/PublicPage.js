/*eslint no-console: ["error", { allow: ["error", "log"] }] */
import React, { Component } from "react";
import styled from "styled-components";
import axios from "axios";

// reset all users

// filter by will relocate too - filter by matching strings(user input location(s) with interested_location_names)
// interested location names will have to be transformed from 'string|string|string' to array

// filter by location within x miles - haversine formula
// function distanceWithFilter(lat1, lon1, lat2, lon2, filter) {
// 	if ((lat1 == lat2) && (lon1 == lon2)) {
// 		return 0;
// 	}
// 	else {
// 		let radlat1 = Math.PI * lat1/180;
// 		let radlat2 = Math.PI * lat2/180;
// 		let theta = lon1-lon2;
// 		let radtheta = Math.PI * theta/180;
// 		let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
// 		if (dist > 1) {
// 			dist = 1;
// 		}
// 		dist = Math.acos(dist);
// 		dist = dist * 180/Math.PI;
// 		dist = dist * 60 * 1.1515;

//     if (dist < filter) {
//       console.log('user is within chosen miles of origin location!')
//       return dist;
//     } else {
//       console.log('user to too far!')
//       return dist;
//     }

// 	}
// }

class PublicPage extends Component {
  state = {
    users: [],

    isWebDevChecked: false,
    isUIUXChecked: false,
    isIOSChecked: false,
    isAndroidChecked: false,

    isUsingLocationFilter: true, // false
    isUsingRelocateToFilter: true, // false

    selectedWithinMiles: 500, // 0
    // LA
    chosenLocationLat: 34.052235, // 0
    chosenLocationLon: -118.243683, // 0

    chosenRelocateTo: "Los Angeles, CA, USA" // ""
  };

  async componentDidMount() {
    this.loadUsers();
  }

  setStateAsync = state => {
    return new Promise(resolve => {
      this.setState(state, resolve);
    });
  };

  loadUsers = async () => {
    const {
      isWebDevChecked,
      isUIUXChecked,
      isIOSChecked,
      isAndroidChecked,
      isUsingLocationFilter,
      isUsingRelocateToFilter,
      selectedWithinMiles,
      chosenLocationLat,
      chosenLocationLon,
      chosenRelocateTo
    } = this.state;

    try {
      const users = await axios.post(`http://localhost:3001/users/infinite`, {
        isWebDevChecked,
        isUIUXChecked,
        isIOSChecked,
        isAndroidChecked,
        isUsingLocationFilter,
        isUsingRelocateToFilter,
        selectedWithinMiles,
        chosenLocationLat,
        chosenLocationLon,
        chosenRelocateTo
      });
      this.setState({ users: users.data });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  toggleAreaOfWorkCheckbox = async areaOfWork => {
    switch (areaOfWork) {
      case "Web Development":
        await this.setStateAsync(prevState => ({
          isWebDevChecked: !prevState.isWebDevChecked
        }));
        break;
      case "UI/UX":
        await this.setStateAsync(prevState => ({
          isUIUXChecked: !prevState.isUIUXChecked
        }));
        break;
      case "iOS":
        await this.setStateAsync(prevState => ({
          isIOSChecked: !prevState.isIOSChecked
        }));
        break;
      case "Android":
        await this.setStateAsync(prevState => ({
          isAndroidChecked: !prevState.isAndroidChecked
        }));
        break;
      default:
        return;
    }
    this.loadUsers();
  };

  locationFilter = async () => {
    await this.setStateAsync(prevState => ({
      isUsingLocationFilter: !prevState.isUsingLocationFilter
    }));
    this.loadUsers();
  }

  relocateToFilter = async () => {
    await this.setStateAsync(prevState => ({
      isUsingRelocateToFilter: !prevState.isUsingRelocateToFilter
    }));
    this.loadUsers();
  }

  // resetAllFilters = async () => {
  //   this.setState({
  //     isWebDevChecked: false,
  //     isUIUXChecked: false,
  //     isIOSChecked: false,
  //     isAndroidChecked: false,
  //     isUsingLocationFilter: false,
  //     isUsingRelocateToFilter: false
  //   })
  // }

  render() {
    console.log(this.state.users.length, this.state.users);
    //this.state.users.forEach(user => console.log(user.area_of_work))
    return (
      <main>
        <aside>
          <section>
            <h2>Filter by Area of Work</h2>
            <form>
              <label htmlFor="web-development">
                <input
                  type="checkbox"
                  name="area-of-work"
                  id="web-development"
                  onChange={() =>
                    this.toggleAreaOfWorkCheckbox("Web Development")
                  }
                />
                Web Development
              </label>
              <br />
              <label htmlFor="UI/UX">
                <input
                  type="checkbox"
                  name="area-of-work"
                  id="UI/UX"
                  onChange={() => this.toggleAreaOfWorkCheckbox("UI/UX")}
                />
                UI/UX
              </label>
              <br />
              <label htmlFor="iOS">
                <input
                  type="checkbox"
                  name="area-of-work"
                  id="iOS"
                  onChange={() => this.toggleAreaOfWorkCheckbox("iOS")}
                />
                iOS
              </label>
              <br />
              <label htmlFor="Android">
                <input
                  type="checkbox"
                  name="area-of-work"
                  id="Android"
                  onChange={() => this.toggleAreaOfWorkCheckbox("Android")}
                />
                Android
              </label>
            </form>
            {/* <form>
              <label htmlFor="DistanceFromLocation">
                  <input id="DistanceFromLocation" type="number"/>
              </label>
            </form> */}
          </section>
        </aside>
        <section>
          {this.state.users.length === 0 ? (
            <h1>Loading...</h1>
          ) : (
            <>
              {this.state.users.map(user => {
                return (
                  <User key={user.id}>
                    <p>{user.first_name}</p>
                    <p>{user.id}</p>
                    <p>{user.area_of_work}</p>
                    <p>{user.interested_location_names}</p>
                  </User>
                );
              })}
            </>
          )}
        </section>
      </main>
    );
  }
}

const User = styled.article`
  margin: 20px;
  border: solid;
`;

export default PublicPage;
