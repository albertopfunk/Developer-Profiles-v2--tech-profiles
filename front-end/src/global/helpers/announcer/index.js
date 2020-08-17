import React, { useEffect, useState } from "react";
import styled from "styled-components";

let announcementWait;
function Announcer({ announcement }) {
  const [pageLoaded, setPageLoaded] = useState(false);

  useEffect(() => {
    return () => {
      clearTimeout(announcementWait);
    };
  }, []);

  useEffect(() => {
    announcementWait = setTimeout(() => {
      setPageLoaded(true);
    }, 300);
  }, []);

  return <>{pageLoaded ? <Alert role="alert">{announcement}</Alert> : null}</>;
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
