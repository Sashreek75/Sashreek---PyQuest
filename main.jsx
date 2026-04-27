import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import StorageManager from './utils/storageManager'
import { initializeAppRecovery } from './utils/appRecovery'

// Initialize StorageManager - cleanup expired data on app startup
setTimeout(() => {
    StorageManager.cleanup();
    const stats = StorageManager.getStats();
    console.log('Storage initialized:', stats);
}, 100);

// Initialize app recovery handlers
initializeAppRecovery();
console.log('App recovery handlers initialized');

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
