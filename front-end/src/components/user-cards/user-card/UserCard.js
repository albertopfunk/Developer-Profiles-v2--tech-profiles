import React from "react";
import axios from "axios";
import styled from "styled-components";

import UserImage from "./img-section/UserImage";
import UserInfo from "./info-section/UserInfo";
import UserSkills from "./skills-section/UserSkills";
import UserIcons from "./icons-section/UserIcons";
import UserExtras from "./extras-section/UserExtras";

// resume link?
// twitter link?
// codesandbox link?
// codepen link?
// share profile?

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
          axios.get(`http://localhost:3001/extras/${id}/education`),
          axios.get(`http://localhost:3001/extras/${id}/experience`),
          axios.get(`http://localhost:3001/extras/${id}/projects`)
        ]);

        if (
          projects.length > 0 ||
          education.length > 0 ||
          experience.length > 0 ||
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

            <section className="user-title">{this.props.title}</section>

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

        <ExpandControlsSection>
          {!isCardExpanded ? (
            <button onClick={() => this.expandUserCard(this.props.id)}>
              Expand
            </button>
          ) : (
            <button onClick={() => this.closeUserCard()}>Close</button>
          )}
        </ExpandControlsSection>

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

const ExpandControlsSection = styled.section`
  border: solid red;
`;

export default UserCard;
