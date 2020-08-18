import React, { useEffect, useState } from "react";
import styled from "styled-components";

let announcementWait;
function Announcer({ announcement, ariaId }) {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    return () => {
      clearTimeout(announcementWait);
    };
  }, []);

  useEffect(() => {
    announcementWait = setTimeout(() => {
      setPageLoaded(true);
    }, 500);
  }, []);

  return (
    <>
      {pageLoaded ? (
        <Alert id={ariaId} aria-live="assertive" aria-relevant="all" aria-atomic="true">
          {announcement}
        </Alert>
      ) : null}
    </>
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
