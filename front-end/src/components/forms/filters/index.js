import React, { useState } from "react";
import styled from "styled-components";

import AreaOfWorkFilter from "./AreaOfWorkFilter";
import CurrentLocationFilter from "./CurrentLocationFilter";
import RelocateToFilter from "./RelocateToFilter";
import SortingFilter from "./SortingFilter";

function Filters({
  updateUsers,
  currentUsers,
  totalUsers,
  resetFilters,
  resetFilterChange,
}) {
  const [areFiltersShowing, setAreFiltersShowing] = useState(false);

  function setFilters() {
    setAreFiltersShowing(!areFiltersShowing);
  }

  return (
    <FilterNav aria-label="filters">
      <div className="filters-bar">
        <div
          className="filters-info"
          aria-live="assertive"
          aria-relevant="additions text"
        >
          {/* if full str isn't dynamic, sr will not announce full str */}
          <p>{`Showing ${currentUsers} of ${totalUsers} Profiles`}</p>
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
      {/* not too happy about this workaround, found this to be the
      least hacky way to reset filters without having to make big
      changes, this will reset all state of children.
      using fragments to bypass reacts optimization */}
      <FiltersForm showForm={areFiltersShowing}>
        {resetFilterChange ? (
          <>
            <SortingFilter updateUsers={updateUsers} />
          </>
        ) : (
          <SortingFilter updateUsers={updateUsers} />
        )}

        {resetFilterChange ? (
          <>
            <AreaOfWorkFilter updateUsers={updateUsers} />
          </>
        ) : (
          <AreaOfWorkFilter updateUsers={updateUsers} />
        )}

        <fieldset>
          <legend>Filter by Locations</legend>

          {resetFilterChange ? (
            <>
              <CurrentLocationFilter updateUsers={updateUsers} />
            </>
          ) : (
            <CurrentLocationFilter updateUsers={updateUsers} />
          )}
          {resetFilterChange ? (
            <>
              <RelocateToFilter updateUsers={updateUsers} />
            </>
          ) : (
            <RelocateToFilter updateUsers={updateUsers} />
          )}
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
        <div>
          <button
            type="reset"
            aria-label="reset filters"
            onClick={resetFilters}
          >
            reset
          </button>
        </div>
      </FiltersForm>
    </FilterNav>
  );
}

const FilterNav = styled.nav`
  background-color: white;
  
  @media (min-width: 850px) {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 5;
    padding-top: 100px;
    width: 300px;
    height: 100vh;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
  }

  .filters-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto;
    justify-items: center;
    align-items: center;

    @media (min-width: 850px) {
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
    @media (min-width: 850px) {
      display: none;
    }
  }
`;

const FiltersForm = styled.form`
  display: ${(props) => (props.showForm ? "block" : "none")};

  @media (min-width: 850px) {
    display: block;
  }
`;

const MemoFilters = React.memo(Filters);

export default MemoFilters;
