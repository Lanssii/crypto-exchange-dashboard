import type { ReactNode } from "react";

type ButtonProps = {
  type: "button" | "submit" | "reset";
  children: ReactNode;
};

const Button = () => {
  return <button></button>;
};

export default Button;
