import React from "react";
import axios from "axios";
import styled from "styled-components";

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
      <Article
        tabIndex="0"
        aria-posinset={this.props.index + 1}
        aria-setsize={this.props.usersLength}
        aria-expanded={this.state.isCardExpanded}
      >
        {/* <aside className="favorite">Favorite</aside> */}

        <section>
          <div className="left">
            <section className="user-info">
              id:{this.props.id}
              <div className="img">
                image
                {/* add figure/figcation to all images */}
                <img
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%"
                  }}
                  src={this.props.image}
                  alt="user-avatar"
                />
              </div>
              <div className="basic-info">
                name, location, summary
                <p>{this.props.firstName}</p>
                <p>{this.props.currentLocation}</p>
              </div>
            </section>

            <section className="user-skills">
              top, additional
              <p>{topSkills[0]}</p>
              <p>{additionalSkills[0]}</p>
            </section>
          </div>

          <aside className="right">
            icons
            <p>{this.props.github}</p>
            <p>{this.props.linkedin}</p>
          </aside>
        </section>

        <section>
          {!isCardExpanded ? (
            <button onClick={() => this.expandUserCard(this.props.id)}>
              Expand
            </button>
          ) : (
            <button onClick={() => this.closeUserCard()}>Close</button>
          )}
        </section>

        {isCardExpanded ? (
          <section className="user-extras">
            {noExtras ? <p>Nothing to Show...</p> : null}
            {projects.length > 0 ? (
              <section className="projects">
                <p>{projects[0].project_title}</p>
              </section>
            ) : null}

            {education.length > 0 ? (
              <section className="education">
                <p>{education[0].school}</p>
              </section>
            ) : null}

            {experience.length > 0 ? (
              <section className="experience">
                <p>{experience[0].company_name}</p>
              </section>
            ) : null}

            {interestedLocations.length > 0 ? (
              <section className="interested-locations">
                <p>{interestedLocations[0]}</p>
              </section>
            ) : null}
          </section>
        ) : null}
      </Article>
    );
  }
}

const Article = styled.article`
  margin: 20px;
  border: solid;
`;

export default UserCard;
