'use client';

import React from 'react';

const WindowsTitleBar: React.FC = () => {
  const handleMinimize = () => {
    if (window.api) {
      window.api.send('window-minimize', {});
    }
  };

  const handleMaximize = () => {
    if (window.api) {
      window.api.send('window-maximize', {});
    }
  };

  const handleClose = () => {
    if (window.api) {
      window.api.send('window-close', {});
    }
  };

  return (
    <div className="windows-title-bar">
      <div className="windows-title">UK Flood Monitor</div>
      <div className="windows-controls">
        <div className="windows-control-button" onClick={handleMinimize}>
          <svg viewBox="0 0 10 1">
            <path d="M0 0h10v1H0z" />
          </svg>
        </div>
        <div className="windows-control-button" onClick={handleMaximize}>
          <svg viewBox="0 0 10 10">
            <path d="M0 0v10h10V0H0zm1 1h8v8H1V1z" />
          </svg>
        </div>
        <div className="windows-control-button close" onClick={handleClose}>
          <svg viewBox="0 0 10 10">
            <path d="M1 0L0 1l4 4-4 4 1 1 4-4 4 4 1-1-4-4 4-4-1-1-4 4-4-4z" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default WindowsTitleBar; 