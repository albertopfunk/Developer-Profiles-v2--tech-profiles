import React, { useEffect, useState } from "react";
import styled from "styled-components";

let announcementWait;
function Announcer({ announcement, ariaId, ariaLive = "assertive" }) {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    return () => {
      clearTimeout(announcementWait);
    };
  }, []);

  useEffect(() => {
    announcementWait = setTimeout(() => {
      setPageLoaded(true);
    }, 150);
  }, []);

  console.log("-- announcer --");

  return (
    <div aria-live={ariaLive} aria-atomic="true" aria-relevant="additions text">
      {pageLoaded ? <Alert id={ariaId}>{announcement}</Alert> : null}
    </div>
  );
}

const Alert = styled.p`
  position: absolute;
  clip: rect(0, 0, 0, 0);
  height: 1px;
  width: 1px;
  margin: -1px;
  padding: 0;
  border: 0;
  overflow: hidden;
`;

export default Announcer;
