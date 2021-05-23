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
  resetFilterToggle,
  headerHeight
}) {
  const [areFiltersShowing, setAreFiltersShowing] = useState(false);

  function setFilters() {
    setAreFiltersShowing(!areFiltersShowing);
  }

  return (
    <FilterNav headerHeight={headerHeight} aria-label="filters">
      <div className="filters-bar">
        <div
          className="info"
          aria-live="assertive"
          aria-relevant="additions text"
        >
          {/* if full str isn't dynamic, sr will not announce full str */}
          <p>{`Showing ${currentUsers} of ${totalUsers} Profiles`}</p>
        </div>
        <button
          type="button"
          className="control-mobile top"
          aria-label={`${areFiltersShowing ? "hide" : "show"} filters`}
          aria-expanded={areFiltersShowing}
          data-filter-content={!areFiltersShowing}
          onClick={setFilters}
        >
          filters
        </button>
      </div>

      {/* not too happy about this workaround, found this to be the
      least hacky way to reset filters without having to make big
      changes, this will reset all state of children.
      using fragments to bypass reacts optimization */}

      <FiltersForm showForm={areFiltersShowing}>
        <div className="grid-container">
          <div className="sorting">
            {resetFilterToggle ? (
              <>
                <SortingFilter updateUsers={updateUsers} />
              </>
            ) : (
              <SortingFilter updateUsers={updateUsers} />
            )}
          </div>
          <div className="area-of-work">
            {resetFilterToggle ? (
              <>
                <AreaOfWorkFilter updateUsers={updateUsers} />
              </>
            ) : (
              <AreaOfWorkFilter updateUsers={updateUsers} />
            )}
          </div>

          <fieldset className="locations">
            <legend>Filter by Locations</legend>
            <div className="flex-container">
              {resetFilterToggle ? (
                <>
                  <CurrentLocationFilter updateUsers={updateUsers} />
                </>
              ) : (
                <CurrentLocationFilter updateUsers={updateUsers} />
              )}
              {resetFilterToggle ? (
                <>
                  <RelocateToFilter updateUsers={updateUsers} />
                </>
              ) : (
                <RelocateToFilter updateUsers={updateUsers} />
              )}
            </div>
          </fieldset>

          <div className="controls-container">
            <button
              type="button"
              className="control-mobile"
              aria-label="done filtering"
              aria-expanded="true"
              onClick={setFilters}
            >
              done
            </button>
            <button
              type="reset"
              aria-label="reset filters"
              onClick={resetFilters}
            >
              reset
            </button>
          </div>
        </div>
      </FiltersForm>
    </FilterNav>
  );
}

const FilterNav = styled.nav`
  background-color: white;
  max-height: ${(props) => `calc(100vh - ${props.headerHeight}px);`};
  overflow-y: auto;
  padding: 5px;

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
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
    grid-gap: 5px;
    justify-items: center;
    align-items: center;

    @media (min-width: 850px) {
      display: block;
    }

    .info {
      grid-column: 1 / 2;
      grid-row: 1 / 2;
    }

    .control-mobile .top {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }
  }

  .control-mobile {
    @media (min-width: 850px) {
      display: none;
    }
  }
`;

const FiltersForm = styled.form`
  display: ${(props) => (props.showForm ? "block" : "none")};
  padding-top: 10px;

  @media (min-width: 850px) {
    display: block;
  }

  & > .grid-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    grid-gap: 30px;
  }

  .sorting {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .area-of-work {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }

  .locations {
    grid-column: 1 / 2;
    grid-row: 3 / 4;

    & > .flex-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
  }

  .controls-container {
    grid-column: 1 / 2;
    grid-row: 4 / 5;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    gap: 10px;
  }
`;

const MemoFilters = React.memo(Filters);

export default MemoFilters;
