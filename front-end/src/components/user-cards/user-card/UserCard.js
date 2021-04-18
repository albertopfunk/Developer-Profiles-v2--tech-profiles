import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import styled from "styled-components";

import { httpClient } from "../../../global/helpers/http-requests";
import { CARD_STATUS } from "../../../global/helpers/variables";

import UserImage from "./UserImage";
import UserBasics from "./UserBasics";
import UserSkills from "./UserSkills";
import UserIcons from "./UserIcons";
import UserExtras from "../user-extras/UserExtras";
import UserSummary from "./UserSummary";

// resume link?
// codesandbox link?
// codepen link?
// share profile?

const UserCard = React.forwardRef((props, articleRef) => {
  const [userExtras, setUserExtras] = useState({});
  const [cardStatus, setCardStatus] = useState(CARD_STATUS.idle);
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

    let loadingTimeout = setTimeout(() => {
      setCardStatus(CARD_STATUS.loading);
    }, 250);

    const [res, err] = await httpClient(
      "GET",
      `/users/get-extras/${props.userId}`
    );
    clearTimeout(loadingTimeout);

    if (err) {
      console.error(`${res.mssg} => ${res.err}`);
      setCardStatus(CARD_STATUS.error);
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
        setCardStatus(CARD_STATUS.idle);
      });
      return;
    }

    ReactDOM.unstable_batchedUpdates(() => {
      setUserExtras(res.data);
      setNoExtras(false);
      setHasRequestedExtras(true);
      setIsCardExpanded(true);
      setAnnounceCardToggle(true);
      setCardStatus(CARD_STATUS.idle);
    });
  }

  function closeUserCard() {
    setIsCardExpanded(false);
    setAnnounceCardToggle(true);
  }

  function userCardActions(e) {
    // enter and space
    // local actions
    if (e.keyCode === 13 || e.keyCode === 32) {
      e.preventDefault();
      if (!isCardExpanded) {
        expandUserCard();
      } else {
        closeUserCard();
      }
      return;
    }

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
  }

  return (
    // feed article is interactive and expandable
    // eslint-disable-next-line
    <UserCardContainer
      ref={articleRef}
      id={`profile-${props.userId}-card`}
      data-user-card={props.index === 0 ? "true" : "false"}
      tabIndex="0" // eslint-disable-line
      aria-posinset={props.index + 1}
      aria-setsize={props.totalUsers}
      aria-expanded={isCardExpanded}
      aria-labelledby={`profile-${props.userId}-heading`}
      aria-describedby={`profile-${props.userId}-summary`}
      onKeyDown={(e) => userCardActions(e)}
    >
      <h3 id={`profile-${props.userId}-heading`} className="sr-only">{`${
        props.firstName || "user"
      }'s Profile`}</h3>
      {/* <aside className="favorite">Favorite</aside> */}

      <div className="sr-only" aria-live="polite" aria-relevant="additions">
        {announceCardToggle && isCardExpanded ? "card expanded" : null}
        {announceCardToggle && !isCardExpanded ? "card collapsed" : null}
      </div>

      <UserInfo>
        <UserImage previewImg={props.previewImg} image={props.image} />

        <UserBasics
          userId={props.userId}
          firstName={props.firstName}
          lastName={props.lastName}
          currentLocation={props.currentLocation}
          title={props.title}
        />

        <UserSummary userId={props.userId} summary={props.summary} />

        <UserIcons
          github={props.github}
          twitter={props.twitter}
          linkedin={props.linkedin}
          portfolio={props.portfolio}
        />

        <UserSkills
          topSkills={props.topSkills}
          additionalSkills={props.additionalSkills}
        />
      </UserInfo>

      {isCardExpanded ? (
        <UserExtras userExtras={userExtras} noExtras={noExtras} />
      ) : null}

      <section>
        {!isCardExpanded ? (
          <button
            type="button"
            disabled={cardStatus === CARD_STATUS.loading}
            onClick={expandUserCard}
          >
            {cardStatus === CARD_STATUS.idle ? "Expand Profile" : null}
            {cardStatus === CARD_STATUS.loading ? "Loading..." : null}
            {cardStatus === CARD_STATUS.error ? "Error - Retry" : null}
          </button>
        ) : (
          <button type="button" onClick={closeUserCard}>
            Collapse Profile
          </button>
        )}
      </section>
    </UserCardContainer>
  );
});

const UserCardContainer = styled.article`
  max-width: 850px;
  padding: 10px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px 0 hsla(0, 0%, 0%, 0.2);
`;

const UserInfo = styled.section`
  display: grid;
  grid-gap: 20px;
  grid-template-areas:
    "name"
    "location"
    "image"
    "title"
    "summary"
    "icons"
    "skills";

  @media (min-width: 1050px) {
    grid-gap: 10px;
    grid-template-areas:
      "image    name      icons"
      "image    location  icons"
      "image    title     icons"
      "summary  summary   icons"
      "skills   skills    icons";
  }

  .image {
    grid-area: image;
  }
  .name {
    grid-area: name;
  }
  .location {
    grid-area: location;
  }
  .title {
    grid-area: title;
  }
  .summary {
    grid-area: summary;
  }
  .icons {
    grid-area: icons;
  }
  .skills {
    grid-area: skills;
  }
`;

export default UserCard;
