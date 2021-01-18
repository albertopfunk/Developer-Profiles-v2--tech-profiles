import React, { useState } from "react";
import styled from "styled-components";

import AreaOfWorkFilter from "./AreaOfWorkFilter";
import CurrentLocationFilter from "./CurrentLocationFilter";
import RelocateToFilter from "./RelocateToFilter";
import SortingFilter from "./SortingFilter";

function Filters(props) {
  const [areFiltersShowing, setAreFiltersShowing] = useState(false);
  const [resetFilterChange, setResetFilterChange] = useState(false);

  function setFilters() {
    setAreFiltersShowing(!areFiltersShowing);
  }

  function resetLocalFilters() {
    setResetFilterChange(!resetFilterChange);
    props.resetFilters(false);
  }

  return (
    <FiltersContainer aria-labelledby="filters-heading">
      <h2 id="filters-heading" className="sr-only">
        Profile Filters
      </h2>
      <div className="filters-bar">
        <div
          className="filters-info"
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
      </div>

      <FiltersForm showForm={areFiltersShowing}>
        {resetFilterChange ? (
          <div>
            <SortingFilter updateUsers={props.updateUsers} />
            <AreaOfWorkFilter updateUsers={props.updateUsers} />
            <fieldset>
              <legend>Filter by Locations</legend>
              <CurrentLocationFilter updateUsers={props.updateUsers} />
              <RelocateToFilter updateUsers={props.updateUsers} />
            </fieldset>
          </div>
        ) : (
          <>
            <SortingFilter updateUsers={props.updateUsers} />
            <AreaOfWorkFilter updateUsers={props.updateUsers} />
            <fieldset>
              <legend>Filter by Locations</legend>
              <CurrentLocationFilter updateUsers={props.updateUsers} />
              <RelocateToFilter updateUsers={props.updateUsers} />
            </fieldset>
          </>
        )}

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
        <div>
          <button
            type="reset"
            aria-label="reset filters"
            onClick={resetLocalFilters}
          >
            reset
          </button>
        </div>
      </FiltersForm>
    </FiltersContainer>
  );
}

const FiltersContainer = styled.aside`
  width: 100%;

  @media (min-width: 1100px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    padding-top: 100px;
    width: 300px;
    height: 100vh;
    border-right: solid 0.5px;
  }

  .filters-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    justify-items: center;
    align-items: center;

    @media (min-width: 1100px) {
      display: block;
    }

    .filters-info {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }

    .filters-control.top {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
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
