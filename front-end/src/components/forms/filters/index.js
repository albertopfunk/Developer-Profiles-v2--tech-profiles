import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as ResetIcon } from "../../../global/assets/button-reset.svg";
import { ReactComponent as LoadingIcon } from "../../../global/assets/page-loading.svg";

import AreaOfWorkFilter from "./AreaOfWorkFilter";
import CurrentLocationFilter from "./CurrentLocationFilter";
import RelocateToFilter from "./RelocateToFilter";
import SortingFilter from "./SortingFilter";
import ControlButton from "../buttons/ControlButton";
import IconButton from "../buttons/IconButton";

import Spacer from "../../../global/helpers/spacer";

function Filters({
  updateUsers,
  filtersLoading,
  currentUsers,
  totalUsers,
  resetFilters,
  resetFilterToggle,
  headerHeight,
  setFilterHeight,
}) {
  const [areFiltersShowing, setAreFiltersShowing] = useState(false);

  const filtersBarRef = useRef();

  useEffect(() => {
    if (!filtersBarRef.current) {
      return;
    }

    const resizeObserver = new ResizeObserver((entries) => {
      setFilterHeight(entries[0].contentRect.height);
    });

    resizeObserver.observe(filtersBarRef.current);

    return () => resizeObserver.disconnect();
  }, []);

  function setFilters() {
    setAreFiltersShowing(!areFiltersShowing);
  }

  return (
    <FilterNav
      id="filters"
      tabIndex="-1"
      aria-label="filters"
      headerHeight={headerHeight}
    >
      <div ref={filtersBarRef} className="filters-bar-container">
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
            classNames="mobile-control"
            buttonText={`${areFiltersShowing ? "close" : "open"} filters`}
            endIcon={filtersLoading ? <LoadingIcon className="icon" /> : null}
            onClick={setFilters}
            attributes={{
              "aria-expanded": `${areFiltersShowing}`,
            }}
          />
        </div>
      </div>

      {/* not too happy about this workaround, found this to be the
      least hacky way to reset filters without having to make big
      changes, this will reset all state of children.
      using fragments to bypass reacts optimization */}
      <FiltersContainer
        showForm={areFiltersShowing}
        headerHeight={headerHeight}
      >
        <form>
          <div className="mobile-reset-container">
            <IconButton
              type="reset"
              size="xl"
              classNames="mobile-reset"
              ariaLabel="reset filters"
              icon={<ResetIcon className="icon" />}
              onClick={resetFilters}
            />
          </div>
          <Spacer axis="vertical" size="10" />
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
            <ControlButton
              type="reset"
              classNames="desktop-reset"
              buttonText="reset"
              ariaLabel="filters"
              onClick={resetFilters}
            />
          </div>
        </form>
      </FiltersContainer>
    </FilterNav>
  );
}

const FilterNav = styled.nav`
  background-color: white;

  @media (min-width: 750px) {
    max-height: ${(props) => `calc(100vh - ${props.headerHeight}px);`};
    overflow-y: auto;
    position: fixed;
    top: 0;
    left: 0;
    z-index: var(--side-nav-layer);
    padding-top: 95px;
    width: 275px;
    min-height: 100vh;
    box-shadow: 0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px 0 rgb(0 0 0 / 6%);
  }

  button {
    width: 100%;
    max-width: 350px;
  }

  .filters-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 5px;

    @media (min-width: 750px) {
      display: block;
    }

    .info {
      flex-basis: 100%;
      text-align: center;
    }

    .mobile-control {
      flex-basis: 100%;

      @media (min-width: 750px) {
        display: none;
      }

      .icon {
        height: 1rem;
        fill: var(--lighter-cyan-2);
      }
    }
  }
`;

const FiltersContainer = styled.div`
  display: ${(props) => (props.showForm ? "block" : "none")};
  /* 100vh should come from window height hook */
  max-height: ${(props) => `calc(100vh - ${props.headerHeight}px);`};
  overflow-y: auto;
  border-top: var(--border-sm);
  border-bottom: var(--border-lg);
  padding: 20px 5px 300px;

  @media (min-width: 500px) {
    padding-bottom: 150px;
  }

  @media (min-width: 750px) {
    max-height: unset;
    overflow-y: unset;
    display: block;
    border: none;
    padding-bottom: 50px;
  }

  .mobile-reset-container {
    width: 95%;
    display: flex;
    justify-content: flex-end;

    @media (min-width: 750px) {
      display: none;
    }
  }

  .grid-container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    grid-gap: 60px;

    @media (min-width: 500px) {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: auto auto;
    }

    @media (min-width: 750px) {
      grid-template-columns: 1fr;
      grid-template-rows: repeat(5, auto);
      grid-gap: 50px;
    }
  }

  .sorting {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .area-of-work {
    grid-column: 1 / 2;
    grid-row: 2 / 3;

    @media (min-width: 500px) {
      grid-column: 2 / 3;
      grid-row: 1 / 2;
    }

    @media (min-width: 750px) {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }
  }

  .current-location {
    grid-column: 1 / 2;
    grid-row: 3 / 4;

    @media (min-width: 500px) {
      grid-column: 1 / 2;
      grid-row: 2 / 3;
    }

    @media (min-width: 750px) {
      grid-column: 1 / 2;
      grid-row: 3 / 4;
    }
  }

  .relocate-locations {
    grid-column: 1 / 2;
    grid-row: 4 / 5;

    @media (min-width: 500px) {
      grid-column: 2 / 3;
      grid-row: 2 / 3;
    }

    @media (min-width: 750px) {
      grid-column: 1 / 2;
      grid-row: 4 / 5;
    }
  }

  .desktop-reset {
    display: none;

    @media (min-width: 750px) {
      display: block;
      grid-column: 1 / 2;
      grid-row: 5 / 6;
    }
  }
`;

const MemoFilters = React.memo(Filters);

export default MemoFilters;
