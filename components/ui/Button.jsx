import React from "react";
import { motion } from "framer-motion";

const Button = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
  isLoading = false,
  icon: Icon,
  disabled = false,
  as: Component = "button",
  ...props
}) => {
  const variants = {
    primary:
      "bg-amu-green text-white shadow-amu-green/20 hover:shadow-amu-green/40 hover:bg-[#004d26]",
    secondary:
      "bg-amu-gold text-white shadow-amu-gold/20 hover:shadow-amu-gold/40 hover:bg-[#a67c00]",
    outline:
      "bg-white text-amu-green border-2 border-amu-green hover:bg-amu-green/5",
    ghost: "bg-transparent text-gray-500 hover:bg-gray-100 hover:text-gray-900",
    danger: "bg-red-50 text-red-500 border border-red-100 hover:bg-red-100",
    dark: "bg-gray-900 text-white shadow-gray-900/20 hover:bg-black",
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-6 py-3.5 text-xs",
    lg: "px-8 py-4 text-sm",
  };

  const baseStyles =
    "flex items-center justify-center gap-2 font-black uppercase tracking-widest rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed";

  // Determine the component type
  const Tag =
    typeof Component === "string"
      ? motion[Component] || motion.button
      : motion(Component);

  return React.createElement(
    Tag,
    {
      whileHover: !disabled && !isLoading ? { y: -2 } : {},
      whileTap: !disabled && !isLoading ? { scale: 0.98 } : {},
      className: `${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`,
      disabled: disabled || isLoading,
      ...props,
    },
    <>
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </>,
  );
};

export default Button;
