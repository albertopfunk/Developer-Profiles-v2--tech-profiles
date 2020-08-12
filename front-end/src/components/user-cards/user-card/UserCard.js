import React from "react";
import styled from "styled-components";

import UserImage from "./UserImage";
import UserInfo from "./UserInfo";
import UserTitle from "./UserTitle";
import UserSkills from "./UserSkills";
import UserIcons from "./UserIcons";
import UserExtras from "../user-extras/UserExtras";
import { useState } from "react";

// resume link?
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

function UserCard(props) {
  const [isCardExpanded, setIsCardExpanded] = useState(false);

  console.log("=====USER CARD=====");

  return (
    <UserArticle
      id="profile-card"
      tabIndex="0"
      aria-posinset={props.index + 1}
      aria-setsize={props.usersLength}
      aria-expanded={isCardExpanded}
    >
      {/* <aside className="favorite">Favorite</aside> */}

      <UserSection>
        <div>
          <div>
            <strong>{props.id}</strong>

            {props.dashboard ? (
              <UserImage previewImg={props.previewImg} image={props.image} />
            ) : (
              <UserImage image={props.image} />
            )}

            <UserInfo
              firstName={props.firstName}
              lastName={props.lastName}
              currentLocation={props.currentLocation}
              summary={props.summary}
            />
          </div>

          <UserTitle title={props.title} />

          <UserSkills
            topSkills={props.topSkills}
            additionalSkills={props.additionalSkills}
          />
        </div>

        <UserIcons
          github={props.github}
          twitter={props.twitter}
          linkedin={props.linkedin}
          portfolio={props.portfolio}
        />
      </UserSection>

      <UserExtras
        dashboard={props.dashboard}
        userId={props.id}
        extras={props.extras}
        setAriaExpanded={setIsCardExpanded}
      />
    </UserArticle>
  );
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
