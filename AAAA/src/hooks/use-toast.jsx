import { toast as toastify } from "react-toastify";
import React from "react";

export function useToast() {
  return {
    toast: ({ title, description, ...options }) =>
      toastify(
        <div>
          <strong>{title}</strong>
          <div>{description}</div>
        </div>,
        options
      ),
  };
} 