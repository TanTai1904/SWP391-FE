import React from "react";

const Input = React.forwardRef(({ className = "", ...props }, ref) => (
  <input
    ref={ref}
    className={
      "border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 " +
      className
    }
    {...props}
  />
));

export { Input };
export default Input; 