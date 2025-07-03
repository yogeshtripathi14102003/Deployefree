// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import { AuthContext } from './Context/AuthContext .jsx'

createRoot(document.getElementById('root')).render(
<AuthContext>
  <App />
</AuthContext>
)
