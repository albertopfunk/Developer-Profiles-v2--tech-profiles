import React from "react";

function SortingFilter(props) {
  return (
    <section>
      <button onClick={props.sortUsers}>SORT USERS</button>
    </section>
  );
}

export default SortingFilter;
