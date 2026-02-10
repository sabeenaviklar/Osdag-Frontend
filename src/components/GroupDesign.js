import React, { useState } from 'react';
import '../GroupDesign.css';
import BasicInputs from './BasicInputs';

const GroupDesign = () => {
  const [activeTab, setActiveTab] = useState('basic');

  return (
    <div className="group-design-container">
      <div className="header">
        <h1>Group Design</h1>
      </div>

      <div className="main-content">
        <div className="left-panel">
          <div className="tabs">
            <button
              className={`tab ${activeTab === 'basic' ? 'active' : ''}`}
              onClick={() => setActiveTab('basic')}
            >
              Basic Inputs
            </button>
            <button
              className={`tab ${activeTab === 'additional' ? 'active' : ''}`}
              onClick={() => setActiveTab('additional')}
            >
              Additional Inputs
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'basic' ? (
              <BasicInputs />
            ) : (
              <div className="placeholder">
                <p>Additional Inputs - Not implemented in this task</p>
              </div>
            )}
          </div>
        </div>

        <div className="right-panel">
          <div className="image-container">
            <h3>Bridge Cross-Section and Plan</h3>
            <div className="image-placeholder">
              <svg width="100%" height="400" viewBox="0 0 600 400">
                <rect x="50" y="200" width="500" height="20" fill="#666" />
                <rect x="100" y="150" width="20" height="50" fill="#444" />
                <rect x="250" y="150" width="20" height="50" fill="#444" />
                <rect x="400" y="150" width="20" height="50" fill="#444" />
                <text x="300" y="250" textAnchor="middle" fill="#333">
                  Bridge Cross-Section Reference
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupDesign;