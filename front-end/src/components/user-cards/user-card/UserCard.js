import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import UserImage from "./UserImage";
import UserInfo from "./UserInfo";
import UserTitle from "./UserTitle";
import UserSkills from "./UserSkills";
import UserIcons from "./UserIcons";
import UserExtras from "../user-extras/UserExtras";

import { httpClient } from "../../../global/helpers/http-requests";

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

const UserCard = React.forwardRef((props, articleRef) => {
  const [userExtras, setUserExtras] = useState({});
  const [loadingExtras, setLoadingExtras] = useState(false);
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [announceCardToggle, setAnnounceCardToggle] = useState(false);
  const [noExtras, setNoExtras] = useState(false);
  const [hasRequestedExtras, setHasRequestedExtras] = useState(false);

  useEffect(() => {
    if (props.userExtras) {
      setIsCardExpanded(false);
      setHasRequestedExtras(true);
      setUserExtras(props.userExtras);

      if (
        props.userExtras.locations.length === 0 &&
        props.userExtras.topSkills.length === 0 &&
        props.userExtras.additionalSkills.length === 0 &&
        props.userExtras.education.length === 0 &&
        props.userExtras.experience.length === 0 &&
        props.userExtras.projects.length === 0
      ) {
        setNoExtras(true);
      } else {
        setNoExtras(false);
      }
    }
  }, [props.userExtras]);

  async function expandUserCard() {
    if (hasRequestedExtras) {
      ReactDOM.unstable_batchedUpdates(() => {
        setIsCardExpanded(true);
        setAnnounceCardToggle(true);
      });
      return;
    }

    setLoadingExtras(true);
    const [res, err] = await httpClient(
      "GET",
      `/users/get-extras/${props.userId}`
    );

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      return;
    }

    if (
      res.data.locations.length === 0 &&
      res.data.topSkills.length === 0 &&
      res.data.additionalSkills.length === 0 &&
      res.data.education.length === 0 &&
      res.data.experience.length === 0 &&
      res.data.projects.length === 0
    ) {
      ReactDOM.unstable_batchedUpdates(() => {
        setUserExtras({});
        setNoExtras(true);
        setHasRequestedExtras(true);
        setIsCardExpanded(true);
        setAnnounceCardToggle(true);
        setLoadingExtras(false);
      });
      return;
    }

    ReactDOM.unstable_batchedUpdates(() => {
      setUserExtras(res.data);
      setNoExtras(false);
      setHasRequestedExtras(true);
      setIsCardExpanded(true);
      setAnnounceCardToggle(true);
      setLoadingExtras(false);
    });
  }

  function closeUserCard() {
    setIsCardExpanded(false);
    setAnnounceCardToggle(true);
  }

  function sendCardAction(e) {
    if (!props.userCardActions) {
      return;
    }

    // ctrl+home
    if (e.ctrlKey && e.keyCode === 36) {
      e.preventDefault();
      props.userCardActions("start", props.index);
    }

    // ctrl+end
    if (e.ctrlKey && e.keyCode === 35) {
      e.preventDefault();
      props.userCardActions("end", props.index);
    }

    // page up
    if (e.keyCode === 33) {
      e.preventDefault();
      props.userCardActions("previous", props.index);
    }

    // page down
    if (e.keyCode === 34) {
      e.preventDefault();
      props.userCardActions("next", props.index);
    }

    // enter and space
    if (e.keyCode === 13 || e.keyCode === 32) {
      if (!isCardExpanded) {
        expandUserCard();
      } else {
        closeUserCard();
      }
    }
  }

  return (
    // articles in feed are interactive
    // eslint-disable-next-line
    <li
      ref={articleRef}
      id={`profile-${props.userId}-card`}
      tabIndex="0" // eslint-disable-line
      // aria-posinset={props.index + 1}
      // aria-setsize={props.totalUsers}
      aria-expanded={isCardExpanded}
      aria-labelledby={`profile-${props.userId}-heading`}
      aria-describedby={`profile-${props.userId}-summary`}
      onKeyDown={(e) => sendCardAction(e)}
    >
      <h3 id={`profile-${props.userId}-heading`}>{`${
        props.firstName || "user"
      }'s Profile`}</h3>
      {/* <aside className="favorite">Favorite</aside> */}

      <div className="sr-only" aria-live="polite" aria-relevant="additions">
        {announceCardToggle && isCardExpanded ? "card expanded" : null}
        {announceCardToggle && !isCardExpanded ? "card collapsed" : null}
      </div>

      <UserSection>
        <div>
          <div>
            <strong>{props.userId}</strong>

            <UserImage previewImg={props.previewImg} image={props.image} />

            <UserInfo
              userId={props.userId}
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

      <section>
        {!isCardExpanded ? (
          <button
            type="button"
            disabled={loadingExtras}
            onClick={expandUserCard}
          >
            Expand Profile
          </button>
        ) : (
          <button type="button" onClick={closeUserCard}>
            Collapse Profile
          </button>
        )}
      </section>

      {isCardExpanded ? (
        <UserExtras userExtras={userExtras} noExtras={noExtras} />
      ) : null}
    </li>
  );
});

const UserSection = styled.section`
  display: flex;
  > div {
    > div {
      display: flex;
    }
  }
`;

export default UserCard;
