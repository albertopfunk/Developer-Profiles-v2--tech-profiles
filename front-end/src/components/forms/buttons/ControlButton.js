import React from "react";
import styled from "styled-components";

const ControlButton = React.forwardRef(
  (
    {
      type,
      classNames = "",
      disabled,
      startIcon,
      buttonText,
      endIcon,
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
        className={`button-control ${classNames}`}
        disabled={disabled === true || disabled === "true" ? true : false}
        {...attributes}
        onClick={onClick}
        onMouseDown={preventFocus}
        onKeyDown={onKeyDown}
      >
        <span className="button-text">
          {startIcon}
          {buttonText}
          {endIcon}
        </span>
        {ariaLabel ? <span className="sr-only">{ariaLabel}</span> : null}
      </Button>
    );
  }
);

const Button = styled.button`
  color: white;
  text-transform: capitalize;
  letter-spacing: 0.8px;
  padding: 7px 10px;
  border-radius: var(--border-radius-md);
  box-shadow: rgba(0, 0, 0, 0.2) 0 3px 1px -2px, rgba(0, 0, 0, 0.14) 0 2px 2px 0,
    rgba(0, 0, 0, 0.12) 0 1px 5px 0;

  &:disabled {
    color: rgba(0, 0, 0, 0.37);
    background-color: rgba(0, 0, 0, 0.12);
    box-shadow: rgba(0, 0, 0, 0.2) 0 0 0 0, rgba(0, 0, 0, 0.14) 0 0 0 0,
      rgba(0, 0, 0, 0.12) 0 0 0 0;
  }

  &:not(:disabled) {
    background-color: var(--dark-cyan-1);
  }

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.2) 0 2px 4px -1px,
      rgba(0, 0, 0, 0.14) 0 4px 5px 0, rgba(0, 0, 0, 0.12) 0 1px 10px 0;
    filter: brightness(105%);
  }

  &:focus {
    outline: 2.5px solid transparent;
    box-shadow: none;
    box-shadow: var(--box-shadow-focus);
    filter: brightness(105%);
  }

  &:active {
    box-shadow: rgba(0, 0, 0, 0.2) 0 5px 5px -3px,
      rgba(0, 0, 0, 0.14) 0 8px 10px 1px, rgba(0, 0, 0, 0.12) 0 3px 14px 2px;
    filter: brightness(110%);
  }

  .button-text {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
  }
`;

ControlButton.displayName = "ControlButton";

export default ControlButton;
