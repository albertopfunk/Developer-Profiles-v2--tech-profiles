import React, { Component } from "react";
import UserCard from "./UserCard";
// import styled from "styled-components";

class UserCardsContainer extends Component {
  expandUserCard = async id => {
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
