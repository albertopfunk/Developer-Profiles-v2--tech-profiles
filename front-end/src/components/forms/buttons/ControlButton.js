import React from "react";
import styled from "styled-components";

function ControlButton({
  children,
  type,
  buttonText,
  ariaLabel,
  onClick,
  attributes,
  classNames = "",
}) {
  function preventFocus(e) {
    e.preventDefault();
  }

  return (
    <Button
      type={type}
      className={`button button-control ${classNames}`}
      aria-label={ariaLabel}
      {...attributes}
      onClick={onClick}
      onMouseDown={preventFocus}
    >
      <span className="button-text">{buttonText}</span>
      {children}
    </Button>
  );
}

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
    display: block;
    padding: 10px 0;
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

export default ControlButton;
