import { Button as ShadcnButton, ButtonProps as ShadcnButtonProps } from "@/components/ui/button";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: ShadcnButtonProps['variant'];
  size?: ShadcnButtonProps['size'];
  asChild?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  className,
  onClick,
  variant,
  size,
  disabled,
  type = 'button',
  asChild = false,
  ...props
}) => {
  return (
    <ShadcnButton
      className={className}
      onClick={onClick}
      variant={variant}
      size={size}
      disabled={disabled}
      type={type}
      asChild={asChild}
      {...props}
    >
      {children}
    </ShadcnButton>
  );
};

export default Button;
