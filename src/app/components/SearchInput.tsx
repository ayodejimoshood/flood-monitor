import React, { useEffect, useRef } from 'react';

interface SearchInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onClear?: () => void;
  onToggleDropdown?: () => void;
  isDropdownOpen?: boolean;
}

export default function SearchInput({
  placeholder,
  value,
  onChange,
  onFocus,
  onClear,
  onToggleDropdown,
  isDropdownOpen
}: SearchInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
//   const [placeholderVisible, setPlaceholderVisible] = useState(true);
  
  useEffect(() => {
    if (value || !inputRef.current) {
      return; // Don't animate if there's a value or no input ref
    }
    
    const input = inputRef.current;
    const terms = ["station name", "river", "town"];
    const prefix = "Search by ";
    let currentIndex = 0;
    let isDeleting = false;
    let currentText = "";
    
    const updatePlaceholder = () => {
      input.placeholder = currentText;
    };
    
    const typeText = () => {
      const fullText = prefix + terms[currentIndex] + "...";
      
      if (isDeleting) {
        // Deleting phase
        if (currentText.length > prefix.length) {
          currentText = currentText.slice(0, -1);
          updatePlaceholder();
          setTimeout(typeText, 50);
        } else {
          // Move to next term
          isDeleting = false;
          currentIndex = (currentIndex + 1) % terms.length;
          setTimeout(typeText, 500);
        }
      } else {
        // Typing phase
        if (currentText.length === 0) {
          currentText = prefix;
          updatePlaceholder();
          setTimeout(typeText, 100);
        } else if (currentText.length < fullText.length) {
          currentText = fullText.slice(0, currentText.length + 1);
          updatePlaceholder();
          setTimeout(typeText, 100);
        } else {
          // Pause at the end before deleting
          setTimeout(() => {
            isDeleting = true;
            typeText();
          }, 2000);
        }
      }
    };
    
    // Start the animation
    const animationTimeout = setTimeout(typeText, 500);
    
    return () => {
      clearTimeout(animationTimeout);
    };
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
    if (onClear) onClear();
  };

  return (
    <div className="search-input-wrapper" style={{ position: 'relative', zIndex: isDropdownOpen ? 1001 : 1 }}>
      <div className="search-field">
        <div className="search-icon">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
        
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          value={value}
          onChange={handleChange}
          onClick={onFocus}
          placeholder={placeholder}
          aria-controls="search-dropdown"
        />
        
        {value && (
          <button 
            className="clear-button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}
        
        {onToggleDropdown && (
          <button
            className="clear-button"
            onClick={onToggleDropdown}
            aria-label={isDropdownOpen ? "Close dropdown" : "Open dropdown"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <polyline points={isDropdownOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
            </svg>
          </button>
        )}
      </div>
    </div>
  );
} 