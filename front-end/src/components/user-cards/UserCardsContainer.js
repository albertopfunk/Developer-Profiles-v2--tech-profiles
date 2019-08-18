import React, { useEffect, useState } from "react";
import UserCard from "./UserCard";
// import styled from "styled-components";

function UserCardsContainer(props) {
  let scrollSectionRef = React.createRef();
  const [isScrolling, setIsScrolling] = useState(false)

  useEffect(() => {
    window.addEventListener("scroll", onInfinite, true);
    return () => {
      window.removeEventListener("scroll", onInfinite, true);
    };
  });

  function onInfinite() {
    // console.log("Blup0", scrollSectionRef.current);
    
    // console.log("BlupOF", scrollSectionRef.current.offsetTop);
    
    // console.log("Blup2", scrollSectionRef.current.clientHeight);
    // console.log("Blup3", scrollSectionRef.current.scrollHeight);
    // console.log("Blup3.5", scrollSectionRef.current.offsetHeight);
    
    // console.log("Blup4", window.scrollY);
    // console.log("+Blup1", document.documentElement.scrollTop);
    // console.log("Blup5", window.pageYOffset);
    
    // console.log("Blup6+", window.innerHeight);
    // console.log("=Blup1", document.documentElement.offsetHeight);

    // console.log(window.innerHeight)
    // console.log(window.scrollY)
    // console.log(document.body.offsetHeight)
    // if (
    //   (window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)) {
    //     console.log("OIIOIO")
    //   }



      // console.log(scrollSectionRef.current.scrollTop)
      // console.log(scrollSectionRef.current.clientHeight)
      // console.log(scrollSectionRef.current.scrollHeight)
      // if (
      //   scrollSectionRef.current.scrollTop + scrollSectionRef.current.clientHeight >=
      //   scrollSectionRef.current.scrollHeight
      // ) {
      //   console.log("OIIOIO")
      // }



      // var lastLiOffset = scrollSectionRef.current.offsetTop + scrollSectionRef.current.clientHeight;
      // var pageOffset = window.pageYOffset + window.innerHeight;
      // if (pageOffset > lastLiOffset) {
      //   console.log("OIIOIO")
      //   }

      // works!
      // need to keep testing
      // case for no more users
      // button=loading working
      // better handling of !props.isBusy && !isScrolling
      if (scrollSectionRef.current) {
        if (scrollSectionRef.current.scrollHeight - window.scrollY < scrollSectionRef.current.scrollHeight / 4) {
          console.log("JGKFVK")
          console.log(!props.isBusy && !isScrolling)
          setIsScrolling(true);
          props.infiniteScroll();
        }
      }
  }

  return (
    <section
      role="feed"
      aria-busy={props.isBusy}
      ref={scrollSectionRef}
    >
      {props.users.length === 0 ? (
        <h1>No Users Here! - Reset filters BTN</h1>
      ) : (
        <>
          {props.users.map((user, i) => {
            return (
              <UserCard
                usersLength={props.users.length}
                index={i}
                key={user.id}
                id={user.id}
                email={user.public_email}
                firstName={user.first_name}
                lastName={user.last_name}
                image={user.image}
                title={user.desired_title}
                areaOfWork={user.area_of_work}
                summary={user.summary}
                currentLocation={user.current_location_name}
                interestedLocations={user.interested_location_names}
                github={user.github}
                linkedin={user.linkedin}
                portfolio={user.portfolio}
                topSkills={user.top_skills}
                additionalSkills={user.additional_skills}
              />
            );
          })}
        </>
      )}
    </section>
  );
}

const MemoUserCardsContainer = React.memo(UserCardsContainer);

export default MemoUserCardsContainer;
