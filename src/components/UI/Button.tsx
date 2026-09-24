import type { ReactNode } from "react";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  children: ReactNode;
}

const Button = () => {
  return <button></button>;
};

export default Button;
