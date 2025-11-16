import React, { useState, useEffect } from 'react';
import { WagmiConfig } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ChatbotIcon from './ChatbotIcon';
import ChatWindow from './ChatWindow';
import { config } from '../../lib/web3';
import { useTheme } from '../../hooks/useTheme';

const queryClient = new QueryClient();

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    // Simulate unread messages after some time
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasUnreadMessages(true);
      }
    }, 30000); // Show notification after 30 seconds

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setHasUnreadMessages(false);
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      {config ? (
        <WagmiConfig config={config}>
          <div className="chatbot-container">
            <ChatbotIcon
              isOpen={isOpen}
              onClick={handleToggle}
              hasUnreadMessages={hasUnreadMessages}
              isDarkMode={isDark}
            />
            <ChatWindow
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              isDarkMode={isDark}
            />
          </div>
        </WagmiConfig>
      ) : (
        <div className="chatbot-container">
          <ChatbotIcon
            isOpen={isOpen}
            onClick={handleToggle}
            hasUnreadMessages={hasUnreadMessages}
            isDarkMode={isDark}
          />
          <ChatWindow
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            isDarkMode={isDark}
          />
        </div>
      )}
    </QueryClientProvider>
  );
};

export default Chatbot;