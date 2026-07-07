import { useEffect, useState } from 'react'
import { FiSun, FiMoon } from 'react-icons/fi'
import { getThemePreference, resolveTheme, toggleTheme, watchSystemTheme } from '../lib/theme.js'
import '../css/theme.css'

const Theme = ({ className = '' }) => {
  const [theme, setTheme] = useState(() => resolveTheme(getThemePreference()))

  useEffect(() => {
    return watchSystemTheme(systemTheme => {
      if (getThemePreference() === 'system') setTheme(systemTheme)
    })
  }, [])

  const handleToggle = () => {
    const { theme: resolved } = toggleTheme(getThemePreference())
    setTheme(resolved)
  }

  return (
    <button
      className={`theme-toggle${className ? ` ${className}` : ''}`}
      onClick={handleToggle}
      aria-label={theme === 'dark' ? 'Attiva tema chiaro' : 'Attiva tema scuro'}
      title={theme === 'dark' ? 'Tema chiaro' : 'Tema scuro'}
    >
      {theme === 'dark' ? <FiSun /> : <FiMoon />}
    </button>
  )
}

export default Theme
