"use client"; // added the directive, as we are using react hooks

import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Raindrop {
  id: number;
  x: number;
  delay: number;
  duration: number;
  hasSplashed: boolean;
  size: number;
}

interface RainAnimationProps {
  intensity?: 'light' | 'medium' | 'heavy' | 'storm'; // Added 'storm' intensity
}

const RainAnimation: React.FC<RainAnimationProps> = ({ 
  intensity = 'medium'
}) => {
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);
  const nextRaindropId = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [thunderEffect, setThunderEffect] = useState(false);
  
  // Determine raindrop count based on intensity - using useCallback to memoize
  const getRaindropCount = useCallback(() => {
    switch (intensity) {
      case 'light': return 30;
      case 'heavy': return 100;
      case 'storm': return 200;
      case 'medium':
      default: return 60;
    }
  }, [intensity]);
  
  // Determine raindrop creation interval based on intensity - using useCallback to memoize
  const getCreationInterval = useCallback(() => {
    switch (intensity) {
      case 'light': return 300;
      case 'heavy': return 50;
      case 'storm': return 20;
      case 'medium':
      default: return 100;
    }
  }, [intensity]);

  // Thunder effect for storm intensity
  useEffect(() => {
    if (intensity !== 'storm') return;
    
    const thunderInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        setThunderEffect(true);
        setTimeout(() => setThunderEffect(false), 200);
      }
    }, 5000);
    
    return () => clearInterval(thunderInterval);
  }, [intensity]);
  
  // Create raindrops
  useEffect(() => {
    console.log("RainAnimation mounted, creating raindrops...");
    
    // Create initial raindrops
    const initialCount = getRaindropCount();
    const newRaindrops: Raindrop[] = [];
    
    for (let i = 0; i < initialCount; i++) {
      newRaindrops.push({
        id: nextRaindropId.current++,
        x: Math.random() * 100, // percentage position
        delay: Math.random() * 3, // random delay up to 3 seconds
        duration: 0.5 + Math.random() * 1.5, // random duration between 0.5 and 2 seconds
        hasSplashed: false,
        size: 0.7 + Math.random() * 0.6 // random size between 0.7 and 1.3
      });
    }
    
    setRaindrops(newRaindrops);
    console.log(`Created ${newRaindrops.length} initial raindrops`);
    
    // Create new raindrops periodically
    const interval = setInterval(() => {
      const newDrop: Raindrop = {
        id: nextRaindropId.current++,
        x: Math.random() * 100,
        delay: Math.random() * 0.5, // shorter delay for continuous effect
        duration: 0.5 + Math.random() * 1.5,
        hasSplashed: false,
        size: 0.7 + Math.random() * 0.6
      };
      
      setRaindrops(prev => [...prev, newDrop]);
    }, getCreationInterval());
    
    // Handle splash effect and cleanup
    const splashInterval = setInterval(() => {
      setRaindrops(prev => {
        return prev.map(drop => {
          // Calculate if the drop should have splashed by now
          const dropLifetime = (Date.now() % (drop.duration * 1000)) / (drop.duration * 1000);
          if (dropLifetime > 0.9 && !drop.hasSplashed) {
            return { ...drop, hasSplashed: true };
          }
          return drop;
        }).filter(drop => {
          // Remove drops that have completed their animation cycle
          const dropAge = Date.now() % ((drop.duration + drop.delay) * 1000);
          return dropAge < (drop.duration + drop.delay) * 900; // Keep drops that haven't completed 90% of their cycle
        });
      });
    }, 100);
    
    return () => {
      clearInterval(interval);
      clearInterval(splashInterval);
      console.log("RainAnimation cleanup");
    };
  }, [getRaindropCount, getCreationInterval]);
  
  return (
    <div 
      className="rain-animation-container"
      ref={containerRef}
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: 9999,
        pointerEvents: 'none',
        opacity: 1,
        animation: 'none',
        backgroundColor: thunderEffect ? 'rgba(255, 255, 255, 0.3)' : 'transparent',
        transition: 'background-color 0.1s ease'
      }}
    >
      {/* Rain drops with splash effect */}
      <div className="rain-container">
        {raindrops.map((drop) => (
          <React.Fragment key={drop.id}>
            <div 
              className={`raindrop ${intensity === 'storm' ? 'raindrop-storm' : ''}`}
              style={{
                left: `${drop.x}%`,
                animationDelay: `${drop.delay}s`,
                animationDuration: `${drop.duration}s`,
                width: `${drop.size * (intensity === 'storm' ? 3 : 2)}px`,
                height: `${drop.size * (intensity === 'storm' ? 30 : 20)}px`
              }}
            />
            {drop.hasSplashed && (
              <div 
                className="splash"
                style={{
                  left: `${drop.x}%`,
                  bottom: `0`,
                  animationDelay: `${drop.delay + drop.duration * 0.9}s`,
                  transform: `translateX(-50%) scale(${drop.size * (intensity === 'storm' ? 1.5 : 1)})`
                }}
              >
                <div className="splash-drop splash-drop-left"></div>
                <div className="splash-drop splash-drop-center"></div>
                <div className="splash-drop splash-drop-right"></div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default RainAnimation; 