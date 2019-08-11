import React, { useState } from "react";

function RelocateToFilter(props) {
  const [relocateTo, setRelocateTo] = useState("");

  console.log(relocateTo)
  return (
    <section>
      <input
        type="text"
        value={relocateTo}
        onChange={e => setRelocateTo(e.target.value)}
      />
      <button onClick={props.relocateToFilter}>RELOCATE TO</button>
    </section>
  );
}

export default RelocateToFilter;
