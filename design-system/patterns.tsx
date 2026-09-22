import type { ComponentProps, ReactNode } from "react"

import { cn } from "cn"

import {
  FieldGroup,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"

type FieldsetGroupProps = ComponentProps<"fieldset"> & {
  legend: ReactNode
  legendClassName?: string
}

/**
 * A named fieldset for one logical group of related controls.
 *
 * The legend is required so a new grouped form cannot be created without a
 * programmatic group name. Child controls still own their individual labels.
 */
function FieldsetGroup({
  children,
  className,
  legend,
  legendClassName,
  ...props
}: FieldsetGroupProps) {
  return (
    <FieldSet className={cn("min-w-0 border-0 p-0", className)} {...props}>
      <FieldLegend className={legendClassName}>{legend}</FieldLegend>
      <FieldGroup>{children}</FieldGroup>
    </FieldSet>
  )
}

export { FieldsetGroup }
