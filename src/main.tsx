import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './styles/Game.css';
import './styles/AchievementTab.css';
import './styles/OptionsTab.css';
import './styles/StatsTab.css';

// 确保DOM完全加载后再渲染React应用
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error('Root element not found in the DOM');
  }
});
