import { ReactNode } from "react";
import clsx from "clsx";

interface CustomButtonProps {
  icon?: ReactNode;
  title?: string;
  description?: string;
  onClick?: () => void;
  className?: string;
  variant?: "default" | "primary" | "outline" | "shadow";
  disabled?: boolean;
  children?: ReactNode;
}

const variantStyles = {
  default: "bg-neutral-50 hover:bg-neutral-100",
  primary: "bg-primary-100 hover:bg-primary-200",
  outline: "bg-white border border-neutral-200 hover:bg-neutral-100",
  shadow: "bg-white shadow hover:bg-neutral-100",
};

const CustomButton = ({
  icon,
  title,
  description,
  onClick,
  className,
  variant = "default",
  disabled,
  children,
}: CustomButtonProps) => (
  <button
    type="button"
    className={clsx(
      "flex flex-row items-center w-full max-w-[380px] rounded-2xl px-5 py-4 mb-3 transition cursor-pointer",
      variantStyles[variant],
      disabled && "opacity-50 cursor-not-allowed",
      className
    )}
    onClick={onClick}
    disabled={disabled}
  >
    {icon && <div className="mr-4 pl-2 flex-shrink-0">{icon}</div>}
    <div className="flex-1 flex flex-col items-center justify-center text-center">
      {title && <span className="font-bold text-lg text-neutral-800">{title}</span>}
      {description && <span className="text-sm text-neutral-500">{description}</span>}
      {children}
    </div>
  </button>
);

export default CustomButton; 