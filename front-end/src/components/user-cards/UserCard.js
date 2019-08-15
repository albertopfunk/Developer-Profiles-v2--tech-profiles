import React from "react";
import axios from "axios";

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
    additionalSkills: []
  };

  componentDidMount() {
    const interestedLocations = this.props.interestedLocations.split("|");
    const topSkills = this.props.topSkills.split(",");
    const additionalSkills = this.props.additionalSkills.split(",");
    this.setState({
      interestedLocations,
      topSkills,
      additionalSkills
    });
  }

  expandUserCard = async id => {
    try {
      const [education, experience, projects] = await Promise.all([
        axios.get(`http://localhost:3001/extras/${id}/education`),
        axios.get(`http://localhost:3001/extras/${id}/experience`),
        axios.get(`http://localhost:3001/extras/${id}/projects`)
      ]);

      this.setState({
        education: education.data,
        experience: experience.data,
        projects: projects.data
      });
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
    return id;
  };

  render() {
    const {
      projects,
      education,
      experience,
      interestedLocations,
      topSkills,
      additionalSkills
    } = this.state;

    return (
      <article style={{ margin: "20px", border: "solid" }}>

        {/* <aside className="favorite">Favorite</aside> */}

        <section>

          <div className="left">

            <section className="user-info">
              <div className="img">
              image
              {this.props.id}
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
          <button onClick={() => this.expandUserCard(this.props.id)}>
            Expand
          </button>
        </section>




        {projects.length > 0 ||
        education.length > 0 ||
        experience.length > 0 ? (
          <section className="user-extras">
            <section className="projects">
              <p>{projects[0].project_title}</p>
            </section>
            <section className="education">
              <p>{education[0].school}</p>
            </section>
            <section className="experience">
              <p>{experience[0].company_name}</p>
            </section>
            <section className="interested-locations">
              <p>{interestedLocations[0]}</p>
            </section>
          </section>
        ) : null}
      </article>
    );
  }
}

export default UserCard;
