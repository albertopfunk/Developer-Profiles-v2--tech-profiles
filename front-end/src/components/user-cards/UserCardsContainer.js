import React, { Component } from "react";
import axios from "axios";
import UserCard from "./UserCard";
// import styled from "styled-components";

class UserCardsContainer extends Component {
  expandUserCard = async id => {
    id = 5;
    try {
      const [education, experience, projects] = await Promise.all([
        axios.get(`http://localhost:3001/extras/${id}/education`),
        axios.get(`http://localhost:3001/extras/${id}/experience`),
        axios.get(`http://localhost:3001/extras/${id}/projects`)
      ]);
      console.log(experience.data)
      console.log(education.data)
      console.log(projects.data)
    } catch (err) {
      console.error(`${err.response.data.message} =>`, err);
    }
    return id;
  };

  render() {
    return (
      <section>
        {this.props.users.length === 0 ? (
          <h1>Loading...</h1>
        ) : (
          <>
            {this.props.users.map(user => {
              return (
                <UserCard
                  user={user}
                  key={user.id}
                  expandUserCard={this.expandUserCard}
                />
              );
            })}
          </>
        )}
      </section>
    );
  }
}

export default UserCardsContainer;
