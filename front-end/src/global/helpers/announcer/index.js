import React, { useEffect, useState } from "react";
import styled from "styled-components";

function Announcer({ announcement, ariaId, ariaLive = "assertive" }) {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    const announcementWait = setTimeout(() => {
      setPageLoaded(true);
    }, 500);

    return () => {
      clearTimeout(announcementWait);
    };
  }, []);

  return (
    <Alert
      id={ariaId}
      aria-live={ariaLive}
      aria-atomic="true"
      aria-relevant="additions text"
    >
      {pageLoaded ? announcement : null}
    </Alert>
  );
}

const Alert = styled.div`
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
