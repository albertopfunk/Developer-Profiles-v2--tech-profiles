import React from "react";
import styled from "styled-components";

const ControlButton = React.forwardRef(
  (
    {
      children,
      type,
      classNames = "",
      disabled,
      buttonText,
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
          <span className="text">{buttonText}</span>
          {children}
        </span>
        {ariaLabel ? <span className="sr-only">{ariaLabel}</span> : null}
      </Button>
    );
  }
);

const Button = styled.button`
  background: hsl(340deg 100% 32%);
  border-radius: 10px;
  transition: filter 50ms ease-in;
  -webkit-tap-highlight-color: transparent;
  outline-offset: 1px;

  &:focus {
    outline: 2.5px solid transparent;
  }

  &:focus .button-text {
    filter: brightness(110%);
    transition: filter 50ms ease-in;
    box-shadow: inset 0 0 4px 2.5px #2727ad;
    transform: translateY(-5px);
    transition: transform 75ms ease-out;
  }

  &:focus:not(:focus-visible) .button-text {
    filter: none;
    box-shadow: 0;
    transition: none;
  }

  &:hover {
    transition: filter 50ms ease-in;
    filter: brightness(110%);
  }

  &:hover .button-text {
    transform: translateY(-5px);
    transition: transform 75ms ease-out;
  }

  &:active .button-text {
    transform: translateY(-2px);
    transition: transform ease-out;
  }

  .button-text {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 7px;
    padding: 12px 5px;
    border-radius: 10px;
    background: hsl(345deg 100% 47%);
    color: white;
    transform: translateY(-4px);
    will-change: transform;
    transition: transform 75ms ease-out;

    @media (min-width: 750px) {
      padding: 15px 0;
    }
  }
`;

ControlButton.displayName = "ControlButton";

export default ControlButton;
