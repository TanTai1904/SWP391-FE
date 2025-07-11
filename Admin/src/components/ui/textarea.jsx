import React from "react";

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 resize-none ${className}`}
      {...props}
    />
  );
}
