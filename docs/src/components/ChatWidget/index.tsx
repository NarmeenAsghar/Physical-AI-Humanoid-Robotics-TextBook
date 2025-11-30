/**
 * ChatWidget Component
 * Floating chatbot widget with RAG capabilities
 */
import React, { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './styles.module.css';
import type { Message, Source, SSEMessage, ChatWidgetProps } from './types';

export default function ChatWidget({
  apiBaseUrl = 'http://localhost:3001/api',
  selectedText: externalSelectedText,
  currentPage,
  selectionTimestamp,
}: ChatWidgetProps): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();
  const baseUrl = siteConfig.baseUrl || '/';

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextText, setContextText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const prevTimestampRef = useRef<number>(0);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle external text selection from TextSelectionHandler
  useEffect(() => {
    console.log('ChatWidget useEffect triggered!');
    console.log('ChatWidget: Previous timestamp:', prevTimestampRef.current);
    console.log('ChatWidget: New selectionTimestamp:', selectionTimestamp);
    console.log('ChatWidget: Timestamp changed?', selectionTimestamp !== prevTimestampRef.current);
    console.log('ChatWidget: externalSelectedText:', externalSelectedText?.substring(0, 50));

    // Always update context when timestamp changes (even if empty to clear)
    if (selectionTimestamp && selectionTimestamp > 0 && selectionTimestamp !== prevTimestampRef.current) {
      console.log('ChatWidget: Timestamp is new and valid');
      prevTimestampRef.current = selectionTimestamp;

      if (externalSelectedText && externalSelectedText.length > 3) {
        console.log('ChatWidget: Replacing contextText with new selection');
        console.log('ChatWidget: New context text:', externalSelectedText);
        setContextText(externalSelectedText);
        // Auto-open chat widget when text is selected
        setIsOpen(true);
      }
    }
  }, [selectionTimestamp, externalSelectedText]);

  // Helper function to construct full URL with baseUrl
  const getFullUrl = (url: string): string => {
    // If URL already starts with baseUrl, return as is
    if (url.startsWith(baseUrl)) {
      return url;
    }
    // Otherwise prepend baseUrl
    return baseUrl.replace(/\/$/, '') + url;
  };

  // Helper function to remove duplicate sources
  const getUniqueSources = (sources: Source[]): Source[] => {
    const seen = new Set<string>();
    return sources.filter((source) => {
      const key = `${source.url}-${source.section}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const queryText = inputValue;
    const selectedContext = contextText;
    setInputValue('');
    // DON'T clear contextText here - keep it visible until user selects new text or manually closes
    // setContextText(''); // Removed - context stays visible
    // clearSelection(); // Removed - allow new selections while context is visible
    setIsLoading(true);

    try {
      await streamChatResponse(queryText, userMessage, selectedContext);
    } catch (error) {
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Failed to get response'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Stream chat response using SSE
  const streamChatResponse = async (query: string, userMessage: Message, selectedContext: string = '') => {
    const conversationHistory = messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const requestBody = {
      message: query,
      selected_text: selectedContext || externalSelectedText || null,
      current_page: currentPage || null,
      conversation_history: conversationHistory,
    };

    const response = await fetch(`${apiBaseUrl}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('ReadableStream not supported');
    }

    const decoder = new TextDecoder();
    let assistantMessage: Message = {
      id: `assistant-${Date.now()}`,
      role: 'assistant',
      content: '',
      sources: [],
      timestamp: new Date(),
    };

    // Add empty assistant message
    setMessages((prev) => [...prev, assistantMessage]);

    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim() || !line.startsWith('data: ')) continue;

        const data = line.slice(6); // Remove 'data: ' prefix
        if (data === '[DONE]') continue;

        try {
          const parsed: SSEMessage = JSON.parse(data);

          if (parsed.type === 'sources' && parsed.sources) {
            assistantMessage.sources = parsed.sources;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, sources: parsed.sources }
                  : msg
              )
            );
          } else if (parsed.type === 'content' && parsed.chunk) {
            assistantMessage.content += parsed.chunk;
            setMessages((prev) =>
              prev.map((msg) =>
                msg.id === assistantMessage.id
                  ? { ...msg, content: assistantMessage.content }
                  : msg
              )
            );
          } else if (parsed.type === 'error') {
            throw new Error(parsed.message || 'Unknown error');
          }
        } catch (e) {
          console.error('Failed to parse SSE message:', e);
        }
      }
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        className={clsx(styles.chatButton, isOpen && styles.chatButtonOpen)}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
        type="button"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className={styles.chatPanel}>
          {/* Header */}
          <div className={styles.chatHeader}>
            <h3>Physical AI Assistant</h3>
            <p>Ask me anything about robotics!</p>
          </div>

          {/* Messages Area */}
          <div className={styles.messagesContainer}>
            {/* Show selected text context if present */}
            {contextText && (
              <div className={styles.contextCard}>
                <div className={styles.contextHeader}>
                  <span>📝 Selected Text Context</span>
                  <button
                    className={styles.contextCloseButton}
                    onClick={() => {
                      setContextText('');
                    }}
                    aria-label="Clear context"
                    type="button"
                  >
                    ✕
                  </button>
                </div>
                <div className={styles.contextContent}>
                  {contextText}
                </div>
                <div className={styles.contextFooter}>
                  Ask a question about this text below
                </div>
              </div>
            )}
            
            {messages.length === 0 && !contextText ? (
              <div className={styles.emptyState}>
                <p>👋 Hello! I'm your Physical AI & Robotics learning assistant.</p>
                <p>Ask me anything about the course content!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={clsx(
                    styles.message,
                    message.role === 'user' ? styles.userMessage : styles.assistantMessage
                  )}
                >
                  <div className={styles.messageContent}>{message.content}</div>

                  {/* Sources */}
                  {message.sources && message.sources.length > 0 && (
                    <div className={styles.sources}>
                      <p className={styles.sourcesTitle}>Sources:</p>
                      <ul className={styles.sourcesList}>
                        {getUniqueSources(message.sources).map((source, idx) => (
                          <li key={idx}>
                            <a href={getFullUrl(source.url)} target="_blank" rel="noopener noreferrer">
                              Chapter {source.chapter}, Lesson {source.lesson}: {source.section}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className={clsx(styles.message, styles.assistantMessage)}>
                <div className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={styles.inputContainer}>
            <div>
              <input
                type="text"
                className={styles.input}
                placeholder={contextText ? "Ask a question about the selected text..." : "Ask a question..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
              />
              <button
                className={styles.sendButton}
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                aria-label="Send message"
                type="button"
              >
                ➤
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
