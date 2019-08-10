import React from "react";

function CurrentLocationFilter(props) {
  return (
    <section>
      <button onClick={props.currentLocationFilter}>LOCATE WITHIN</button>
    </section>
  );
}

export default CurrentLocationFilter;
