import React from "react";
import styled from "styled-components";

const IconButton = React.forwardRef(
  (
    {
      children,
      icon,
      type,
      classNames = "",
      disabled,
      ariaLabel = "",
      onClick,
      onKeyDown,
      attributes,
      size = "sm",
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
        className={`button-icon ${size} ${classNames}`}
        disabled={disabled === true || disabled === "true" ? true : false}
        {...attributes}
        onClick={onClick}
        onMouseDown={preventFocus}
        onKeyDown={onKeyDown}
      >
        {ariaLabel ? <span className="sr-only">{ariaLabel}</span> : null}
        {icon}
        {children}
      </Button>
    );
  }
);

const Button = styled.button`
  border-radius: var(--border-radius-md);

  &.sm {
    width: 27px;
    height: 27px;
    padding: 5px;
  }

  &.lg {
    width: 35px;
    height: 35px;
    padding: 7px;
  }

  &.xl {
    width: 55px;
    height: 55px;
    padding: 10px;
  }

  &:hover .icon {
    fill: var(--dark-green-3);
  }

  &:focus {
    outline: 2.5px solid transparent;
    box-shadow: var(--box-shadow-focus);
    filter: brightness(105%);
  }

  &:active .icon {
    filter: brightness(110%);
  }

  .icon {
    fill: var(--dark-cyan-2);
    height: 100%;
  }
`;

IconButton.displayName = "IconButton";

export default IconButton;
