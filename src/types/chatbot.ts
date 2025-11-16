export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

export interface ChatSession {
  id: string;
  userId?: string;
  walletAddress?: string;
  messages: ChatMessage[];
  context: ChatContext;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChatContext {
  userName?: string;
  userEmail?: string;
  previousTopics: string[];
  userInterests: string[];
  leadCaptured: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  walletAddress?: string;
  source: 'chatbot' | 'contact_form';
  interests: string[];
  messages: string[];
  createdAt: Date;
}

export interface ChatbotConfig {
  openaiApiKey: string;
  model: 'gpt-4' | 'gpt-4o-mini';
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}

export interface VoiceSettings {
  enabled: boolean;
  language: string;
  voice: string;
  rate: number;
  pitch: number;
}

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
}