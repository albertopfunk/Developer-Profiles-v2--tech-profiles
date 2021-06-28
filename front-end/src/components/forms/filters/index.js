import React, { useState } from "react";
import styled from "styled-components";

import AreaOfWorkFilter from "./AreaOfWorkFilter";
import CurrentLocationFilter from "./CurrentLocationFilter";
import RelocateToFilter from "./RelocateToFilter";
import SortingFilter from "./SortingFilter";
import ControlButton from "../buttons/ControlButton";

function Filters({
  updateUsers,
  currentUsers,
  totalUsers,
  resetFilters,
  resetFilterToggle,
  headerHeight,
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
        <ControlButton
          type="button"
          buttonText="filters"
          ariaLabel={`${areFiltersShowing ? "close" : "open"} filters`}
          onClick={setFilters}
          classNames="control-mobile top"
          attributes={{
            "aria-expanded": `${areFiltersShowing}`,
            "data-filter-content": `${!areFiltersShowing}`,
          }}
        />
      </div>

      {/* not too happy about this workaround, found this to be the
      least hacky way to reset filters without having to make big
      changes, this will reset all state of children.
      using fragments to bypass reacts optimization */}
      <FiltersContainer showForm={areFiltersShowing}>
        <form>
          <div className="grid-container">
            <div className="sorting">
              {resetFilterToggle ? (
                <SortingFilter updateUsers={updateUsers} />
              ) : null}
              {!resetFilterToggle ? (
                <SortingFilter updateUsers={updateUsers} />
              ) : null}
            </div>
            <div className="area-of-work">
              {resetFilterToggle ? (
                <AreaOfWorkFilter updateUsers={updateUsers} />
              ) : null}
              {!resetFilterToggle ? (
                <AreaOfWorkFilter updateUsers={updateUsers} />
              ) : null}
            </div>

            <div className="current-location">
              {resetFilterToggle ? (
                <CurrentLocationFilter updateUsers={updateUsers} />
              ) : null}
              {!resetFilterToggle ? (
                <CurrentLocationFilter updateUsers={updateUsers} />
              ) : null}
            </div>

            <div className="relocate-locations">
              {resetFilterToggle ? (
                <RelocateToFilter updateUsers={updateUsers} />
              ) : null}
              {!resetFilterToggle ? (
                <RelocateToFilter updateUsers={updateUsers} />
              ) : null}
            </div>

            <div className="controls-container">
              <ControlButton
                type="button"
                buttonText="close"
                ariaLabel="close filters"
                onClick={setFilters}
                classNames="control-mobile"
                attributes={{ "aria-expanded": "true" }}
              />
              <ControlButton
                type="reset"
                buttonText="reset"
                ariaLabel="reset filters"
                onClick={resetFilters}
              />
            </div>
          </div>
        </form>
      </FiltersContainer>
    </FilterNav>
  );
}

const FilterNav = styled.nav`
  background-color: white;
  max-height: ${(props) => `calc(100vh - ${props.headerHeight}px);`};
  overflow-y: auto;

  @media (min-width: 600px) {
    position: fixed;
    top: 0;
    left: 0;
    /* third desktop */
    z-index: 20;
    padding-top: 75px;
    width: 200px;
    min-height: 100vh;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
  }

  @media (min-width: 750px) {
    padding-top: 95px;
  }

  @media (min-width: 800px) {
    width: 275px;
  }

  .filters-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 5px;

    @media (min-width: 600px) {
      display: block;
    }

    .info {
      flex-basis: 100%;
      text-align: center;
    }

    .control-mobile.top {
      flex-basis: 100%;
      max-width: 350px;
    }
  }

  .control-mobile {
    .button-text {
      padding: 5px 0;
    }

    @media (min-width: 600px) {
      display: none;
    }
  }
`;

const FiltersContainer = styled.div`
  display: ${(props) => (props.showForm ? "block" : "none")};
  border-top: solid 1px rgba(229, 231, 235, 0.5);
  padding: 5px;

  @media (min-width: 600px) {
    display: block;
    border: none;
    padding-top: 20px;
  }

  .grid-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(5, auto);
    grid-gap: 40px;

    @media (min-width: 400px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto auto;
    }

    @media (min-width: 600px) {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(5, auto);
    }
  }

  .sorting {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .area-of-work {
    grid-column: 1 / 2;
    grid-row: 2 / 3;

    @media (min-width: 400px) {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }

    @media (min-width: 600px) {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }
  }

  .current-location {
    grid-column: 1 / 2;
    grid-row: 3 / 4;

    @media (min-width: 400px) {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }

    @media (min-width: 600px) {
      grid-column: 1 / 2;
      grid-row: 3 / 4;
    }
  }

  .relocate-locations {
    grid-column: 1 / 2;
    grid-row: 4 / 5;

    @media (min-width: 400px) {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
    }

    @media (min-width: 600px) {
      grid-column: 1 / 2;
      grid-row: 4 / 5;
    }
  }

  .controls-container {
    grid-column: 1 / 2;
    grid-row: 5 / 6;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 10px;

    @media (min-width: 400px) {
      grid-column: 1 / -1;
      grid-row: 3 / 4;
    }

    @media (min-width: 600px) {
      grid-column: 1 / 2;
      grid-row: 5 / 6;
    }

    button {
      width: 100%;
      max-width: 350px;

      .button-text {
        padding: 7px 0;
      }
    }
  }
`;

const MemoFilters = React.memo(Filters);

export default MemoFilters;
