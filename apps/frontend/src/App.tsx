import React, { useState } from 'react';
import './App.css';
import PackingVisualizer from './components/PackingVisualizer';

function App() {
  // State to manage the active tab
  const [activeTab, setActiveTab] = useState(1);

  return (
    <div className="App">
      <header className="App-header">
        {/* Top Navigation Bar */}
        <nav className="bg-gray-800 text-white p-4">
          <ul className="flex space-x-6">
            <li>
              <button
                className={`${
                  activeTab === 1 ? 'text-yellow-500' : 'hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(1)}
              >
                Feature 1
              </button>
            </li>
            <li>
              <button
                className={`${
                  activeTab === 2 ? 'text-yellow-500' : 'hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(2)}
              >
                Feature 2
              </button>
            </li>
            <li>
              <button
                className={`${
                  activeTab === 3 ? 'text-yellow-500' : 'hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(3)}
              >
                Feature 3
              </button>
            </li>
            <li>
              <button
                className={`${
                  activeTab === 4 ? 'text-yellow-500' : 'hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(4)}
              >
                Feature 4
              </button>
            </li>
          </ul>
        </nav>

        {/* Render the content based on the active tab */}
        <div className="mt-6">
          {activeTab === 1 && (
            <div>
              <PackingVisualizer /> 
            </div>
          )}
          {activeTab === 2 && <div>Tab 2 Content</div>}
          {activeTab === 3 && <div>Tab 3 Content</div>}
          {activeTab === 4 && <div>Tab 4 Content</div>} 
        </div>
      </header>
    </div>
  );
}

export default App;
