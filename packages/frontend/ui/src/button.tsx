import React, { ButtonHTMLAttributes, FC } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
}

export const Button: FC<ButtonProps> = ({ children, ...props }) => {
  return <button {...props}>{children}</button>;
};

