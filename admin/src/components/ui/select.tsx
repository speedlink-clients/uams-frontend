import { Select as ChakraSelect, Portal } from "@chakra-ui/react"
import * as React from "react"

interface SelectTriggerProps extends ChakraSelect.TriggerProps {
  clearable?: boolean
}

export const SelectTrigger = React.forwardRef<
  HTMLButtonElement,
  SelectTriggerProps
>(function SelectTrigger(props, ref) {
  const { children, clearable, ...rest } = props
  return (
    <ChakraSelect.Trigger ref={ref} {...rest}>
      {children}
      <ChakraSelect.IndicatorGroup>
        {clearable && <ChakraSelect.ClearTrigger />}
        <ChakraSelect.Indicator />
      </ChakraSelect.IndicatorGroup>
    </ChakraSelect.Trigger>
  )
})

export const SelectContent = React.forwardRef<
  HTMLDivElement,
  ChakraSelect.ContentProps
>(function SelectContent(props, ref) {
  const { ...rest } = props
  return (
    <Portal>
      <ChakraSelect.Positioner>
        <ChakraSelect.Content ref={ref} {...rest} />
      </ChakraSelect.Positioner>
    </Portal>
  )
})

export const SelectItem = React.forwardRef<
  HTMLDivElement,
  ChakraSelect.ItemProps
>(function SelectItem(props, ref) {
  const { item, children, ...rest } = props
  return (
    <ChakraSelect.Item key={item.value} item={item} ref={ref} {...rest}>
      {children || item.label}
      <ChakraSelect.ItemIndicator />
    </ChakraSelect.Item>
  )
})

export const SelectValueText = ChakraSelect.ValueText
export const SelectRoot = ChakraSelect.Root
export const SelectLabel = ChakraSelect.Label
export const SelectItemGroup = ChakraSelect.ItemGroup
export const SelectItemText = ChakraSelect.ItemText
