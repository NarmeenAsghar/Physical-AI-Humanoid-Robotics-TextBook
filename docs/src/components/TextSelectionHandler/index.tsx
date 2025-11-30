/**
 * TextSelectionHandler Component
 * Shows a floating "Ask about this" button when text is selected
 */
import React, { useState, useEffect, useCallback } from 'react';
import styles from './styles.module.css';

interface TextSelectionHandlerProps {
  onTextSelected: (text: string) => void;
}

export default function TextSelectionHandler({
  onTextSelected,
}: TextSelectionHandlerProps): React.ReactElement | null {
  const [selectedText, setSelectedText] = useState('');
  const [buttonPosition, setButtonPosition] = useState<{ x: number; y: number } | null>(null);
  const [justShown, setJustShown] = useState(false);

  const handleSelection = useCallback(() => {
    const selection = window.getSelection();
    const text = selection?.toString().trim() || '';

    console.log('TextSelectionHandler: Selection detected, length:', text.length);

    if (text && text.length > 3) {
      // Get selection bounding rect for positioning
      const range = selection?.getRangeAt(0);
      const rect = range?.getBoundingClientRect();

      if (rect) {
        // Calculate button position within viewport bounds
        // Use viewport-relative coordinates (fixed positioning)
        let x = rect.right + 10; // 10px to the right of selection
        let y = rect.bottom + 5;  // 5px below selection

        // Keep button within viewport
        const buttonWidth = 150; // Approximate button width
        const buttonHeight = 40; // Approximate button height
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // If button would go off right edge, position to the left of selection
        if (x + buttonWidth > viewportWidth) {
          x = rect.left - buttonWidth - 10;
          // If still off left edge, align to right edge of viewport
          if (x < 0) {
            x = viewportWidth - buttonWidth - 10;
          }
        }

        // If button would go off bottom edge, position above selection
        if (y + buttonHeight > viewportHeight) {
          y = rect.top - buttonHeight - 5;
          // If still off top edge, position at top of viewport
          if (y < 0) {
            y = 10;
          }
        }

        console.log('TextSelectionHandler: Showing button at', x, y);
        setButtonPosition({ x, y });
        setSelectedText(text);
        setJustShown(true);
        // Clear the justShown flag after 300ms to allow button clicks
        setTimeout(() => setJustShown(false), 300);
      }
    } else {
      // Clear button if selection is too short
      console.log('TextSelectionHandler: Selection too short, hiding button');
      setButtonPosition(null);
      setSelectedText('');
    }
  }, []);

  const handleButtonClick = () => {
    console.log('TextSelectionHandler: Button clicked!');
    console.log('TextSelectionHandler: Selected text length:', selectedText.length);
    console.log('TextSelectionHandler: Selected text preview:', selectedText.substring(0, 100));
    if (selectedText) {
      console.log('TextSelectionHandler: Calling onTextSelected callback');
      onTextSelected(selectedText);
      // Clear selection and button
      setButtonPosition(null);
      setSelectedText('');
      setJustShown(false);
      window.getSelection()?.removeAllRanges();
    }
  };

  const handleClickOutside = useCallback((e: MouseEvent) => {
    // Ignore clicks right after showing the button
    if (justShown) {
      console.log('TextSelectionHandler: Ignoring click - button just shown');
      return;
    }

    const target = e.target as HTMLElement;
    // Don't clear if clicking on the selection button itself
    const clickedButton = target.closest(`.${styles.selectionButton}`);
    if (!clickedButton) {
      console.log('TextSelectionHandler: Clicked outside, clearing button');
      setButtonPosition(null);
      setSelectedText('');
    }
  }, [justShown]);

  useEffect(() => {
    // Listen for text selection events
    document.addEventListener('mouseup', handleSelection);
    document.addEventListener('touchend', handleSelection);
    
    // Listen for clicks to hide button (not capture phase)
    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleSelection);
      document.removeEventListener('touchend', handleSelection);
      document.removeEventListener('click', handleClickOutside);
    };
  }, [handleSelection, handleClickOutside]);

  if (!buttonPosition || !selectedText) {
    return null;
  }

  return (
    <button
      className={styles.selectionButton}
      style={{
        position: 'fixed',
        left: `${buttonPosition.x}px`,
        top: `${buttonPosition.y}px`,
      }}
      onClick={handleButtonClick}
      aria-label="Ask about selected text"
      type="button"
    >
      💬 Ask about this
    </button>
  );
}

