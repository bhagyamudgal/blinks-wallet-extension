import React from "react";
import { cn } from "../libs/style";

type ButtonProps = React.ComponentProps<"button"> & {
    isDisabled?: boolean;
    isLoading?: boolean;
};

export function Button({
    children,
    className,
    isDisabled,
    isLoading,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(
                "bg-primary-dark text-white p-2 rounded-lg w-full disabled:cursor-not-allowed disabled:opacity-70",
                className,
                isLoading && ""
            )}
            disabled={isDisabled || isLoading}
            {...props}
        >
            {isLoading ? "Loading..." : children}
        </button>
    );
}
