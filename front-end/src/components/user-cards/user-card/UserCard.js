import React from "react";
import axios from "axios";
import styled from "styled-components";

import UserImage from "./UserImage";
import UserInfo from "./UserInfo";
import UserTitle from "./UserTitle";
import UserSkills from "./UserSkills";
import UserIcons from "./UserIcons";
import UserControls from "./UserControls";
import UserExtras from "../user-extras/UserExtras";

// resume link?
// twitter link?
// codesandbox link?
// codepen link?
// share profile?

// missing aria
/*
https://www.w3.org/TR/wai-aria-practices/examples/feed/feedDisplay.html
aria-label
aria-describedby
*/

// Keyboard control
/*
https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/Feed_Role
Page Down: Move focus to next article.
Page Up: Move focus to previous article.
Control + End: Move focus to the first focusable element after the feed.
Control + Home: Move focus to the first focusable element before the feed.
*/

// Test Ideas
// renders with user info(name, location) or replacement UI
// When user expands card, expanded section should show
// either with a user extra section(s) or with 'nothing to show' mssg

class UserCard extends React.Component {
  state = {
    education: [],
    experience: [],
    projects: [],
    interestedLocations: [],
    topSkills: [],
    additionalSkills: [],
    isCardExpanded: false,
    hasRequestedExtras: false,
    noExtras: false
  };

  componentDidMount() {
    let interestedLocations = [];
    let topSkills = [];
    let additionalSkills = [];

    if (this.props.interestedLocations) {
      interestedLocations = this.props.interestedLocations.split("|");
    }
    if (this.props.topSkills) {
      topSkills = this.props.topSkills.split(",");
    }
    if (this.props.additionalSkills) {
      additionalSkills = this.props.additionalSkills.split(",");
    }

    this.setState({
      interestedLocations,
      topSkills,
      additionalSkills
    });
  }

  expandUserCard = async id => {
    if (this.state.hasRequestedExtras) {
      if (
        this.state.topSkills.length > 0 ||
        this.state.additionalSkills.length > 0 ||
        this.state.projects.length > 0 ||
        this.state.education.length > 0 ||
        this.state.experience.length > 0 ||
        this.state.interestedLocations.length > 0
      ) {
        this.setState({
          isCardExpanded: true
        });
      } else {
        this.setState({
          isCardExpanded: true,
          noExtras: true
        });
      }
    } else {
      try {
        const [education, experience, projects] = await Promise.all([
          axios.get(`${process.env.REACT_APP_SERVER}/extras/${id}/education`),
          axios.get(`${process.env.REACT_APP_SERVER}/extras/${id}/experience`),
          axios.get(`${process.env.REACT_APP_SERVER}/extras/${id}/projects`)
        ]);

        if (
          projects.data.length > 0 ||
          education.data.length > 0 ||
          experience.data.length > 0 ||
          this.state.interestedLocations.length > 0
        ) {
          this.setState({
            hasRequestedExtras: true,
            isCardExpanded: true,
            education: education.data,
            experience: experience.data,
            projects: projects.data
          });
        } else {
          this.setState({
            hasRequestedExtras: true,
            isCardExpanded: true,
            noExtras: true
          });
        }
      } catch (err) {
        console.error(`${err.response.data.message} =>`, err);
      }
    }
  };

  closeUserCard = () => {
    this.setState({ isCardExpanded: false });
  };

  render() {
    const {
      education,
      experience,
      projects,
      interestedLocations,
      isCardExpanded,
      noExtras,
      topSkills,
      additionalSkills
    } = this.state;

    return (
      <UserArticle
        tabIndex="0"
        aria-posinset={this.props.index + 1}
        aria-setsize={this.props.usersLength}
        aria-expanded={this.state.isCardExpanded}
      >
        {/* <aside className="favorite">Favorite</aside> */}

        <UserSection>
          <div>
            <div>
              <UserImage image={this.props.image} />

              <UserInfo
                firstName={this.props.firstName}
                lastName={this.props.lastName}
                currentLocation={this.props.currentLocation}
                summary={this.props.summary}
              />
            </div>

            <UserTitle title={this.props.title} />

            <UserSkills
              topSkills={topSkills}
              additionalSkills={additionalSkills}
            />
          </div>

          <UserIcons
            github={this.props.github}
            linkedin={this.props.linkedin}
            portfolio={this.props.portfolio}
          />
        </UserSection>

        <UserControls
          id={this.props.id}
          isCardExpanded={isCardExpanded}
          expandUserCard={this.expandUserCard}
          closeUserCard={this.closeUserCard}
        />

        {isCardExpanded ? (
          <UserExtras
            topSkills={topSkills}
            additionalSkills={additionalSkills}
            education={education}
            experience={experience}
            projects={projects}
            interestedLocations={interestedLocations}
            noExtras={noExtras}
          />
        ) : null}
      </UserArticle>
    );
  }
}

const UserArticle = styled.article`
  margin: 40px;
  border: solid blue;
  max-width: 1000px;
`;

const UserSection = styled.section`
  border: solid green;
  display: flex;
  > div {
    > div {
      display: flex;
    }
  }
`;

export default UserCard;
