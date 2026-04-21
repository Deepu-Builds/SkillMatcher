import React from "react";

/**
 * CustomButton Component
 * Implements the skew animation button style with orange primary color
 * Replaces all btn-primary and btn-secondary buttons throughout the app
 */
const CustomButton = ({
  children,
  onClick,
  disabled = false,
  type = "button",
  variant = "primary", // 'primary' | 'secondary' | 'danger'
  className = "",
  ...props
}) => {
  // Base classes for all button variants
  const baseClasses = `
    relative inline-block min-w-[150px] h-[50px] rounded-[10px]
    border-2 overflow-hidden transition-all duration-500 ease-in
    z-1 flex items-center justify-center font-medium text-lg
    disabled:opacity-60 disabled:cursor-not-allowed
    ${className}
  `;

  // Variant-specific classes
  const variantClasses = {
    primary: "border-orange-600 text-orange-600 hover:text-orange-200",
    secondary: "border-gray-300 text-gray-600 hover:text-orange-200",
    danger: "border-red-600 text-red-600 hover:text-orange-200",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]}`}
      style={{
        "--tw-ring-offset-shadow": "0 0 0 0 rgba(0, 0, 0, 0)",
      }}
      {...props}
    >
      {/* Before pseudo-element (left skew) */}
      <span
        className="absolute left-[-10px] top-0 h-full bg-gradient-to-r from-purple-900 to-purple-700 
                   transition-all duration-500 z-[-1] skew-x-[15deg]"
        style={{
          width: "0%",
          "--clip-path": "polygon(0 0, 100% 0, 85% 100%, 0 100%)",
        }}
      />

      {/* After pseudo-element (right skew) */}
      <span
        className="absolute right-[-10px] top-0 h-full bg-gradient-to-l from-purple-700 to-purple-500 
                   transition-all duration-500 z-[-1] skew-x-[15deg]"
        style={{
          width: "0%",
          "--clip-path": "polygon(15% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      />

      {/* Text content */}
      <span className="relative z-10 transition-colors duration-300">
        {children}
      </span>

      {/* Hover effect - extend pseudo-elements */}
      <style>{`
        button:hover::before,
        button:hover::after {
          width: 58%;
        }
      `}</style>
    </button>
  );
};

export default CustomButton;
