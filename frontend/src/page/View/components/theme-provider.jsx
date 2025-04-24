

import { createContext, useContext, useEffect, useState } from "react"

const ThemeContext = createContext({
  theme: "light",
  setTheme: () => null,
})

export function ThemeProvider({ children, defaultTheme = "light", enableSystem = true }) {
  const [theme, setTheme] = useState(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement

    // Remove old theme class
    root.classList.remove("light", "dark")

    // Add new theme class
    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)

      // Listen for changes in system preference
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = (e) => {
        const newTheme = e.matches ? "dark" : "light"
        root.classList.remove("light", "dark")
        root.classList.add(newTheme)
      }

      mediaQuery.addEventListener("change", handleChange)
      return () => mediaQuery.removeEventListener("change", handleChange)
    } else {
      root.classList.add(theme)
    }
  }, [theme, enableSystem])

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
