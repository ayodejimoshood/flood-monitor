'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// Use dynamic imports to avoid SSR issues with Electron-specific components
const WindowsTitleBar = dynamic(() => import('./WindowsTitleBar'), { ssr: false });
const LinuxAppMenu = dynamic(() => import('./LinuxAppMenu'), { ssr: false });

const PlatformUI: React.FC = () => {
  const [platform, setPlatform] = useState<string | null>(null);

  useEffect(() => {
    // Access the platform from the preload script
    if (typeof window !== 'undefined' && window.api) {
      setPlatform(window.api.platform);
      // Add platform class to body
      if (window.api.platform) {
        document.body.classList.add(`platform-${window.api.platform}`);
      }
    }
  }, []);

  if (!platform) return null;

  return (
    <>
      {/* Windows custom title bar */}
      {platform === 'win32' && <WindowsTitleBar />}
      
      {/* Linux app menu */}
      {platform === 'linux' && <LinuxAppMenu />}
      
      {/* Platform indicator in footer */}
      <p className="platform-indicator" style={{ 
        margin: 0, 
        fontSize: '0.75rem', 
        color: 'var(--text-secondary)',
        opacity: 0.6,
        textAlign: 'center',
      }}>
        Running on {platform === 'darwin' ? 'macOS' : platform === 'win32' ? 'Windows' : 'Linux'}
      </p>
    </>
  );
};

export default PlatformUI; 