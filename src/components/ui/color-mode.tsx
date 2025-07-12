import type { IconButtonProps, SpanProps } from "@chakra-ui/react"
import { Icon, Span, Switch } from "@chakra-ui/react"
import { ThemeProvider, useTheme } from "next-themes"
import type { ThemeProviderProps } from "next-themes"
import * as React from "react"
import { Moon, Sun } from "lucide-react"

export interface ColorModeProviderProps extends ThemeProviderProps {}

export function ColorModeProvider(props: ColorModeProviderProps) {
  return (
    <ThemeProvider attribute="class" disableTransitionOnChange {...props} />
  )
}

export type ColorMode = "light" | "dark"

export interface UseColorModeReturn {
  colorMode: ColorMode
  setColorMode: (colorMode: ColorMode) => void
  toggleColorMode: () => void
}

export function useColorMode(): UseColorModeReturn {
  const { resolvedTheme, setTheme, forcedTheme } = useTheme()
  const colorMode = forcedTheme || resolvedTheme
  const toggleColorMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }
  return {
    colorMode: colorMode as ColorMode,
    setColorMode: setTheme,
    toggleColorMode,
  }
}

export function useColorModeValue<T>(light: T, dark: T) {
  const { colorMode } = useColorMode()
  return colorMode === "dark" ? dark : light
}

interface ColorModeSwitchProps extends Omit<IconButtonProps, "aria-label"> {
  colorMode: "light" | "dark";
  setColorMode: (value: "light" | "dark" | ((prev: "light" | "dark") => "light" | "dark")) => void;
}

export const ColorModeSwitch = React.forwardRef<
  HTMLButtonElement,
  ColorModeSwitchProps
>(function ColorModeSwitch({ colorMode, setColorMode, ...props }, ref) {
  // Toggle between light and dark using the provided setColorMode
  const handleToggle = () => {
    setColorMode((prev) => (prev === "dark" ? "light" : "dark"));
  };
  return (
    <Switch.Root colorPalette="purple" size="lg" checked={colorMode === "dark"}>
      <Switch.HiddenInput />
      <Switch.Control onClick={handleToggle} ref={ref} {...props}>
        <Switch.Thumb />
        <Switch.Indicator fallback={<Icon as={Moon} color="gray.600" />}>
          <Icon as={Sun} color="yellow.400" />
        </Switch.Indicator>
      </Switch.Control>
    </Switch.Root>
  );
});

export const LightMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function LightMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme light"
        colorPalette="gray"
        colorScheme="light"
        ref={ref}
        {...props}
      />
    )
  },
)

export const DarkMode = React.forwardRef<HTMLSpanElement, SpanProps>(
  function DarkMode(props, ref) {
    return (
      <Span
        color="fg"
        display="contents"
        className="chakra-theme dark"
        colorPalette="gray"
        colorScheme="dark"
        ref={ref}
        {...props}
      />
    )
  },
)
