import React, { useState } from "react";
import styled from "styled-components";

import AreaOfWorkFilter from "./AreaOfWorkFilter";
import CurrentLocationFilter from "./CurrentLocationFilter";
import RelocateToFilter from "./RelocateToFilter";
import SortingFilter from "./SortingFilter";

function Filters(props) {
  const [areFiltersShowing, setAreFiltersShowing] = useState(false);

  function setFilters() {
    setAreFiltersShowing(!areFiltersShowing);
  }

  return (
    <FiltersContainer aria-labelledby="filters-heading">
      <h2 id="filters-heading">Profile Filters</h2>
      <section className="filters-bar">
        <div
          aria-live="assertive"
          aria-relevant="additions text"
        >
          {/* if full str isn't dynamic, sr will not announce full str */}
          <p>{`Showing ${props.currentUsers} of ${props.totalUsers} Profiles`}</p>
        </div>
        <div className="filters-control top">
          <button
            type="button"
            aria-label={`${areFiltersShowing ? "hide" : "show"} filters`}
            aria-expanded={areFiltersShowing}
            data-filter-content={!areFiltersShowing}
            onClick={setFilters}
          >
            filters
          </button>
        </div>
      </section>
      <FiltersForm showForm={areFiltersShowing}>
        <SortingFilter updateUsers={props.updateUsers} />
        <AreaOfWorkFilter updateUsers={props.updateUsers} />
        <fieldset>
          <legend>Filter by Locations</legend>
          <CurrentLocationFilter updateUsers={props.updateUsers} />
          <RelocateToFilter updateUsers={props.updateUsers} />
        </fieldset>
        <div className="filters-control bottom">
          <button
            type="button"
            aria-label="done filtering"
            aria-expanded="true"
            onClick={setFilters}
          >
            done
          </button>
        </div>
      </FiltersForm>
    </FiltersContainer>
  );
}

const FiltersContainer = styled.aside`
  border: solid blue;
  width: 100%;

  .filters-bar {
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    @media (min-width: 1100px) {
      display: block;
    }
  }
  
  .filters-control {
    @media (min-width: 1100px) {
      display: none;
    }
  }
`;

const FiltersForm = styled.form`
  display: ${(props) => (props.showForm ? "block" : "none")};

  @media (min-width: 1100px) {
    display: block;
  }
`;

const MemoFilters = React.memo(Filters);

export default MemoFilters;
