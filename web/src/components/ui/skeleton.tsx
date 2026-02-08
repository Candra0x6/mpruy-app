/**
 * #file:ui
 * Skeleton Component
 * 
 * Placeholder skeleton loader component.
 * Provides animated pulsing effect for loading states.
 */

import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }
