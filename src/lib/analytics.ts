// Lightweight analytics stub used during local development.
// Replace with your real analytics SDK calls when ready.

export const analytics = {
  getChatbotMetrics: async () => ({
    totalInteractions: 0,
    uniqueSessions: 0,
    messagesSent: 0,
    leadsGenerated: 0,
    voiceUsage: 0,
    walletConnections: 0,
    dailyStats: {},
  }),
};

export default analytics;
