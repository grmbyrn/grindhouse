import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'system'

// Must match the inline script in index.html, which applies the theme before first paint
const STORAGE_KEY = 'theme'

const ThemeContext = createContext<{
    theme: Theme
    resolvedTheme: 'light' | 'dark'
    setTheme: (theme: Theme) => void
} | null>(null)

const readStoredTheme = (): Theme => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored === 'light' || stored === 'dark') return stored
    } catch {
        // Storage can be blocked (private mode, cookies disabled); fall back to the OS setting
    }
    return 'system'
}

const systemQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setThemeState] = useState<Theme>(readStoredTheme)
    const [systemDark, setSystemDark] = useState(() => systemQuery().matches)

    // Follow OS changes live while on "system"
    useEffect(() => {
        const query = systemQuery()
        const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches)
        query.addEventListener('change', onChange)
        return () => query.removeEventListener('change', onChange)
    }, [])

    const resolvedTheme = theme === 'system' ? (systemDark ? 'dark' : 'light') : theme

    useEffect(() => {
        document.documentElement.classList.toggle('dark', resolvedTheme === 'dark')
        document.documentElement.style.colorScheme = resolvedTheme
    }, [resolvedTheme])

    const setTheme = (next: Theme) => {
        setThemeState(next)
        try {
            if (next === 'system') localStorage.removeItem(STORAGE_KEY)
            else localStorage.setItem(STORAGE_KEY, next)
        } catch {
            // Not persisted, but still applied for this visit
        }
    }

    return <ThemeContext value={{ theme, resolvedTheme, setTheme }}>{children}</ThemeContext>
}

export const useTheme = () => {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within <ThemeProvider>')
    return context
}
