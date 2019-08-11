import React from "react";

// sort choices
//  descending(newest-oldest)
//  acending(oldest-newest)

function SortingFilter(props) {
  return (
    <section>
      <button onClick={props.sortUsers}>SORT USERS</button>
    </section>
  );
}

export default SortingFilter;
