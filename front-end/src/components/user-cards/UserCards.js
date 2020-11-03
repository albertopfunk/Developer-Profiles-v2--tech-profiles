import React from "react";
import styled from "styled-components";

import UserCard from "./user-card/UserCard";

class UserCards extends React.Component {
  optionRefs = [];

  setOptionRefs = (element, index) => {
    if (element !== null) {
      this.optionRefs[index] = element;
    }
  };

  backToTop = () => {
    window.scrollTo(0, 0);
  }
  // moving user card element to here
  // since I will be needing it for refs and keyboard control
  render() {
    return (
      <FeedSection
        id="profiles-feed"
        tabIndex="-1"
        role="feed"
        aria-labelledby="profiles-heading"
        aria-busy={this.props.isBusy}
      >
        <h2 id="profiles-heading">Current Profiles</h2>
        {this.propstotalUsers === 0 ? (
          <p>No Users Here! - Reset filters BTN</p>
        ) : (
          <>
            {this.props.users.map((user, i) => {
              return (
                <article
                  ref={(ref) => {
                    this.setOptionRefs(ref, i);
                  }}
                  key={user.id}
                  id="profile-card"
                  // tabIndex="0"
                  aria-posinset={i + 1}
                  aria-setsize={this.props.totalUsers}
                  // aria-expanded={isCardExpanded}
                  aria-labelledby="profile-heading"
                >
                  <UserCard
                    index={i}
                    id={user.id}
                    areaOfWork={user.area_of_work}
                    email={user.public_email}
                    image={user.image}
                    firstName={user.first_name}
                    lastName={user.last_name}
                    currentLocation={user.current_location_name}
                    summary={user.summary}
                    title={user.desired_title}
                    topSkills={user.top_skills_prev}
                    additionalSkills={user.additional_skills_prev}
                    github={user.github}
                    twitter={user.twitter}
                    linkedin={user.linkedin}
                    portfolio={user.portfolio}
                    />
                  </article>

              );
            })}
          </>
        )}
        <div>
          {!this.props.canLoadMore ? (
            <button
              type="button"
              onClick={this.props.loadMoreUsers}
              disabled={this.props.isBusy}
              >
                {this.props.isBusy ?
                  "Load More Profiles"
                  :
                  "Loading"
                }
              </button>
          ) : (
            <div>
              <p>No more profiles to load</p>
              <button type="button" onClick={this.backToTop}>Back to Top</button>
            </div>
          )}
        </div>
      </FeedSection>
    );
  }
}

const FeedSection = styled.section`
  border: solid orange;
  padding-left: 300px;
  .back-to-top {
    position: fixed;
    top: 50%;
    right: 5%;
    transform: translateY(-50%);
  }
`;

const MemoUserCards = React.memo(UserCards);

export default MemoUserCards;
