/**
 * #file:ui
 * Spinner Component
 * 
 * Loading spinner component using animated Loader2 icon.
 * Provides visual feedback during asynchronous operations.
 */

import { Loader2Icon } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
