/**
 * Root component wrapper for Docusaurus
 * Swizzled to inject ChatWidget, TextSelectionHandler, and AuthProvider globally
 */
import React, { useState, useCallback, useEffect } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ChatWidget from '@site/src/components/ChatWidget';
import TextSelectionHandler from '@site/src/components/TextSelectionHandler';
import { AuthProvider } from '@site/src/contexts/AuthContext';

export default function Root({ children }: { children: React.ReactNode }): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  const apiBaseUrl = siteConfig.customFields?.chatbotApiUrl as string || 'http://localhost:3001/api';
  const [selectedText, setSelectedText] = useState('');
  const [textTimestamp, setTextTimestamp] = useState(0);

  const handleTextSelection = useCallback((text: string) => {
    const timestamp = Date.now();
    console.log('Root: handleTextSelection called');
    console.log('Root: New text length:', text.length);
    console.log('Root: New text preview:', text.substring(0, 50));
    console.log('Root: New timestamp:', timestamp);
    setSelectedText(text);
    setTextTimestamp(timestamp); // Update timestamp to trigger useEffect
  }, []);

  return (
    <AuthProvider>
      {children}
      <TextSelectionHandler onTextSelected={handleTextSelection} />
      <ChatWidget
        apiBaseUrl={apiBaseUrl}
        selectedText={selectedText}
        selectionTimestamp={textTimestamp}
      />
    </AuthProvider>
  );
}
