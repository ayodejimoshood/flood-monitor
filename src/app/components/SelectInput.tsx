import { useState, useRef, useEffect } from 'react';

interface SelectOption {
  value: string;
  label: string;
  group?: string;
}

interface SelectInputProps {
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function SelectInput({
  label,
  options,
  value,
  onChange,
  placeholder = "-- Select an option --"
}: SelectInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Group options by their group property
  const groupedOptions: Record<string, SelectOption[]> = {};
  options.forEach(option => {
    const group = option.group || '';
    if (!groupedOptions[group]) {
      groupedOptions[group] = [];
    }
    groupedOptions[group].push(option);
  });

  // Find the selected option label
  const selectedOption = options.find(option => option.value === value);
  
  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="form-group" ref={dropdownRef} style={{ position: 'relative', zIndex: isOpen ? 1001 : 1 }}>
      <label htmlFor="custom-select">{label}</label>
      
      <div className="select-input-wrapper">
        <div 
          className="select-field"
          onClick={() => setIsOpen(!isOpen)}
        >
          <div className="select-value">
            {selectedOption ? selectedOption.label : placeholder}
          </div>
          
          <div className="select-icon">
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
              <polyline points={isOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
            </svg>
          </div>
        </div>
        
        {isOpen && (
          <div className="select-dropdown">
            <div className="select-options">
              <div 
                className={`select-option ${value === '' ? 'active' : ''}`}
                onClick={() => {
                  onChange('');
                  setIsOpen(false);
                }}
              >
                {placeholder}
              </div>
              
              {Object.entries(groupedOptions).map(([group, groupOptions]) => (
                <div key={group || 'default'} className="select-group">
                  {group && <div className="select-group-label">{group}</div>}
                  
                  {groupOptions.map(option => (
                    <div 
                      key={option.value}
                      className={`select-option ${value === option.value ? 'active' : ''}`}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="select-stats">
        {options.length} options available
      </div>
    </div>
  );
} 