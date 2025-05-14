import React, { useState } from 'react';
import { useProfile } from '../../contexts/ProfileContext';

interface Props {
  onSearch: (address: string) => void;
}

export const TokenSearch: React.FC<Props> = ({ onSearch }) => {
  const [input, setInput] = useState('');
  const { currentProfile } = useProfile();
  const buttonColor = currentProfile?.color || '#3B82F6';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSearch(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste the Contract Address"
        className="flex-1 px-4 py-2 bg-card border border-border rounded-lg 
          focus:outline-none focus:ring-2 text-foreground placeholder:text-muted-foreground"
        style={{ 
          '--tw-ring-color': `${buttonColor}40`,
          '--tw-ring-opacity': 0.4
        } as React.CSSProperties}
      />
      <button
        type="submit"
        style={{ backgroundColor: buttonColor }}
        className="px-6 py-2 text-white rounded-lg transition-colors duration-200 
          hover:opacity-90 font-medium"
      >
        Analyze
      </button>
    </form>
  );
};