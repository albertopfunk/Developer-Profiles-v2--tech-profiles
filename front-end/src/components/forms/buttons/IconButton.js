import React from "react";
import styled from "styled-components";

const IconButton = React.forwardRef(
  (
    {
      icon,
      type,
      classNames = "",
      disabled,
      ariaLabel = "",
      onClick,
      onKeyDown,
      attributes,
    },
    buttonRef
  ) => {
    function preventFocus(e) {
      e.preventDefault();
    }

    return (
      <Button
        ref={buttonRef}
        type={type}
        className={`button-icon ${classNames}`}
        disabled={disabled === true || disabled === "true" ? true : false}
        {...attributes}
        onClick={onClick}
        onMouseDown={preventFocus}
        onKeyDown={onKeyDown}
      >
        {ariaLabel ? <span className="sr-only">{ariaLabel}</span> : null}
        <span className="icon-container">{icon}</span>
      </Button>
    );
  }
);

const Button = styled.button`
  width: 100%;
  max-width: 35px;
  height: 35px;
  border-radius: var(--border-radius-md);
  padding: 7px;

  &:hover .icon {
    fill: var(--dark-green-3);
  }

  &:focus {
    outline: 2.5px solid transparent;
    box-shadow: none;
    box-shadow: 0 0 0 2.5px var(--dark-cyan-1);
    filter: brightness(105%);
  }

  &:active .icon {
    filter: brightness(110%);
  }

  .icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .icon {
    fill: var(--dark-cyan-2);
  }
`;

IconButton.displayName = "IconButton";

export default IconButton;
