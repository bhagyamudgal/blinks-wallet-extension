import { cn } from "../libs/style";

export function LoadingSkeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                "animate-pulse bg-gray-600 h-6 w-full rounded-md",
                className
            )}
        />
    );
}
