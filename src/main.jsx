import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App.jsx'
import { applyTheme, getThemePreference, watchSystemTheme } from './lib/theme.js'
import './css/index.css'

applyTheme()
watchSystemTheme(() => {
  if (getThemePreference() === 'system') applyTheme('system')
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
