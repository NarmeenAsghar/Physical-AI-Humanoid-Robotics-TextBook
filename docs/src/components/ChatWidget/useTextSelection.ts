/**
 * Custom hook for handling text selection
 * Detects when user selects text on the page
 */
import { useState, useEffect } from 'react';

interface UseTextSelectionResult {
  selectedText: string;
  clearSelection: () => void;
}

export function useTextSelection(): UseTextSelectionResult {
  const [selectedText, setSelectedText] = useState('');

  useEffect(() => {
    const handleSelection = () => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || '';

      // Only update if text is selected and has substantial content
      if (text && text.length > 3) {
        setSelectedText(text);
      }
    };

    // Listen for mouseup (end of selection)
    document.addEventListener('mouseup', handleSelection);

    // Also listen for keyup (keyboard selection)
    document.addEventListener('keyup', handleSelection);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('keyup', handleSelection);
    };
  }, []);

  const clearSelection = () => {
    setSelectedText('');
  };

  return { selectedText, clearSelection };
}
