import React, { useState } from "react";

function UserExperience(props) {
  const [sliderPage, setSliderPage] = useState(0);

  function nextExtra(direction) {
    if (direction === "left") {
      if (sliderPage === 0) {
        setSliderPage(props.experience.length - 1);
      } else {
        setSliderPage(sliderPage - 1);
      }
    } else if (direction === "right") {
      if (sliderPage === props.experience.length - 1) {
        setSliderPage(0);
      } else {
        setSliderPage(sliderPage + 1);
      }
    } else {
      return;
    }
  }

  return (
    <section>
      <p>{props.experience[sliderPage].company_name}</p>
      {props.experience.length > 1 ? (
        <div>
          <button onClick={() => nextExtra("left")}>PREV</button>
          <button onClick={() => nextExtra("right")}>NEXT</button>
        </div>
      ) : null}
    </section>
  );
}

export default UserExperience;
