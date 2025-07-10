import React from "react";

export function Badge({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  let variants = {
    default: "bg-blue-100 text-blue-700",
    secondary: "bg-gray-100 text-gray-700",
    outline: "border border-gray-300 bg-white text-gray-900",
    destructive: "bg-red-100 text-red-700",
  };
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${variants[variant] || ""} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
