"use client";

import React, { useEffect, useRef, useState } from 'react';

interface WaterLevelAnimationProps {
  currentLevel: number;
  maxLevel: number;
  minLevel: number;
  isLoading?: boolean;
}

interface Ripple {
  id: number;
  x: number;
  y: number;
}

const WaterLevelAnimation: React.FC<WaterLevelAnimationProps> = ({ 
  currentLevel, 
  maxLevel, 
  minLevel,
  isLoading = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const nextRippleId = useRef(0);
  
  // Normalize the water level to a percentage (0-100)
  const normalizedLevel = Math.max(0, Math.min(100, 
    ((currentLevel - minLevel) / (maxLevel - minLevel)) * 100
  ));
  
  // Add ripple effect
  useEffect(() => {
    if (isLoading) return;
    
    // Create a new ripple when data changes
    const container = containerRef.current;
    if (!container) return;
    
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    
    // Create 1-3 random ripples
    const newRipples: Ripple[] = [];
    const rippleCount = Math.floor(Math.random() * 3) + 1;
    
    for (let i = 0; i < rippleCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * (height * normalizedLevel / 100);
      newRipples.push({ id: nextRippleId.current++, x, y });
    }
    
    setRipples(prev => [...prev, ...newRipples]);
    
    // Remove ripples after animation completes
    const timer = setTimeout(() => {
      setRipples(prev => prev.filter(r => !newRipples.some(nr => nr.id === r.id)));
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [currentLevel, isLoading, normalizedLevel]);
  
  return (
    <div 
      className="water-level-container"
      ref={containerRef}
      style={{ 
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none'
      }}
    >
      {/* Water body */}
      <div 
        className="water-body"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: `${normalizedLevel}%`,
          backgroundColor: 'rgba(0, 112, 243, 0.2)',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Animated waves */}
        <div className="wave-container">
          <div className="wave wave1"></div>
          <div className="wave wave2"></div>
        </div>
        
        {/* Ripples */}
        {ripples.map(ripple => (
          <div 
            key={ripple.id}
            className="ripple"
            style={{
              position: 'absolute',
              left: `${ripple.x}px`,
              bottom: `${ripple.y}px`
            }}
          />
        ))}
      </div>
      
      {/* Rain drops (only show when loading) */}
      {isLoading && (
        <div className="rain-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <div 
              key={i} 
              className="raindrop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${0.5 + Math.random()}s`
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WaterLevelAnimation; 