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
    image: "",
    isCardExpanded: false,
    hasRequestedExtras: false,
    noExtras: false
  };

  componentDidMount() {
    this.setUserInfo();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.image !== prevProps.image ||
      this.props.interestedLocations !== prevProps.interestedLocations ||
      this.props.topSkills !== prevProps.topSkills ||
      this.props.additionalSkills !== prevProps.additionalSkills
    ) {
      this.setUserInfo();
      this.closeUserCard();
    }
    if (this.props.extrasUpdate !== prevProps.extrasUpdate) {
      this.closeUserCard();
      this.setState({ hasRequestedExtras: false });
    }
  }

  setUserInfo = () => {
    if (this.props.interestedLocations) {
      let interestedLocations = this.props.interestedLocations.split("|");
      this.setState({ interestedLocations });
    }
    if (this.props.topSkills) {
      let topSkills = this.props.topSkills.split(",");
      this.setState({ topSkills });
    }
    if (this.props.additionalSkills) {
      let additionalSkills = this.props.additionalSkills.split(",");
      this.setState({ additionalSkills });
    }
    if (this.props.image) {
      let image = this.props.image.split(",");
      image = image[0];
      this.setState({ image });
    }
  };

  handleImgErr = () => {
    this.setState({ image: "" });
  };

  expandUserCard = async id => {
    if (this.state.hasRequestedExtras) {
      this.setState({ isCardExpanded: true });
      if (
        this.state.topSkills.length > 0 ||
        this.state.additionalSkills.length > 0 ||
        this.state.projects.length > 0 ||
        this.state.education.length > 0 ||
        this.state.experience.length > 0 ||
        this.state.interestedLocations.length > 0
      ) {
        this.setState({
          noExtras: false
        });
      } else {
        this.setState({
          noExtras: true
        });
      }
      return;
    }

    try {
      const [education, experience, projects] = await Promise.all([
        axios.get(`${process.env.REACT_APP_SERVER}/extras/${id}/education`),
        axios.get(`${process.env.REACT_APP_SERVER}/extras/${id}/experience`),
        axios.get(`${process.env.REACT_APP_SERVER}/extras/${id}/projects`)
      ]);

      this.setState({ hasRequestedExtras: true, isCardExpanded: true });

      if (
        projects.data.length > 0 ||
        education.data.length > 0 ||
        experience.data.length > 0
      ) {
        this.setState({
          education: education.data,
          experience: experience.data,
          projects: projects.data,
          noExtras: false
        });
      } else {
        if (
          this.state.interestedLocations.length > 0 ||
          this.state.additionalSkills.length > 0 ||
          this.state.topSkills.length > 0
        ) {
          this.setState({
            noExtras: false
          });
        } else {
          this.setState({
            noExtras: true
          });
        }
      }
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
  };

  closeUserCard = () => {
    this.setState({ isCardExpanded: false });
  };

  render() {
    console.log("=====USER CARD=====", this.state);
    const {
      education,
      experience,
      projects,
      interestedLocations,
      isCardExpanded,
      noExtras,
      topSkills,
      additionalSkills,
      image
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
              <strong>{this.props.id}</strong>

              {this.props.dashboard ? (
                <UserImage
                  handleImgErr={this.handleImgErr}
                  previewImg={this.props.previewImg}
                  image={image}
                />
              ) : (
                <UserImage handleImgErr={this.handleImgErr} image={image} />
              )}

              <UserInfo
                firstName={this.props.firstName}
                lastName={this.props.lastName}
                currentLocation={this.props.currentLocation}
                summary={this.props.summary}
              />
            </div>

            <UserTitle title={this.props.title} />

            {this.props.dashboard ? (
              <UserSkills
                deleteFunctionality
                topSkills={topSkills}
                additionalSkills={additionalSkills}
              />
            ) : (
              <UserSkills
                topSkills={topSkills}
                additionalSkills={additionalSkills}
              />
            )}
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
