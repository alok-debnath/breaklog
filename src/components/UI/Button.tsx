import { Button as ShadcnButton } from "@/components/ui/button";

interface ButtonProps {
  className?: string;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ className, onClick, children, variant, size, disabled }) => {
  return (
    <ShadcnButton
      className={className}
      onClick={onClick}
      variant={variant}
      size={size}
      disabled={disabled}
    >
      {children}
    </ShadcnButton>
  );
};

export default Button;
