import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp, 
  Download,
  Mail,
  Wallet,
  Calendar,
  Eye,
  EyeOff
} from 'lucide-react';
import { analytics } from '../lib/analytics';
import { supabase } from '../lib/supabase';

interface DashboardMetrics {
  totalInteractions: number;
  uniqueSessions: number;
  messagesSent: number;
  leadsGenerated: number;
  voiceUsage: number;
  walletConnections: number;
  dailyStats: Record<string, number>;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  wallet_address?: string;
  source: string;
  interests: string[];
  messages: string[];
  created_at: string;
}

const AdminDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Load metrics
      const metricsData = await analytics.getChatbotMetrics();
      setMetrics(metricsData);

      // Load leads
      const { data: leadsData, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLeads(leadsData || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportLeads = () => {
    const csvContent = [
      ['Name', 'Email', 'Wallet Address', 'Source', 'Interests', 'Created At'],
      ...leads.map(lead => [
        lead.name,
        lead.email,
        lead.wallet_address || '',
        lead.source,
        lead.interests.join('; '),
        new Date(lead.created_at).toLocaleDateString()
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leads_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <button
          onClick={() => setIsVisible(true)}
          className="p-3 bg-slate-800 text-white rounded-full shadow-lg hover:bg-slate-700 transition-colors"
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -300 }}
      className="fixed left-4 top-4 bottom-4 w-96 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden z-50"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Chatbot Analytics
          </h2>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200"
          >
            <EyeOff className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex gap-2 mt-4">
          {['24h', '7d', '30d'].map((range) => (
            <button
              key={range}
              onClick={() => setSelectedTimeRange(range)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                selectedTimeRange === range
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <>
            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-600">Messages</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics?.messagesSent || 0}
                </div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Sessions</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics?.uniqueSessions || 0}
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-600">Leads</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics?.leadsGenerated || 0}
                </div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-600">Wallets</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {metrics?.walletConnections || 0}
                </div>
              </div>
            </div>

            {/* Recent Leads */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Recent Leads
                </h3>
                <button
                  onClick={exportLeads}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
              </div>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {leads.slice(0, 10).map((lead) => (
                  <div
                    key={lead.id}
                    className="p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {lead.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-slate-400">
                        {new Date(lead.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-slate-300 mb-1">
                      {lead.email}
                    </div>
                    {lead.wallet_address && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mb-1">
                        🔗 {lead.wallet_address.slice(0, 6)}...{lead.wallet_address.slice(-4)}
                      </div>
                    )}
                    {lead.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {lead.interests.slice(0, 2).map((interest, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full"
                          >
                            {interest}
                          </span>
                        ))}
                        {lead.interests.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-slate-600 text-gray-600 dark:text-slate-300 text-xs rounded-full">
                            +{lead.interests.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-xl text-white">
              <h3 className="font-semibold mb-2">Performance Summary</h3>
              <div className="text-sm opacity-90">
                <div className="flex justify-between mb-1">
                  <span>Conversion Rate:</span>
                  <span>
                    {metrics?.uniqueSessions && metrics?.leadsGenerated
                      ? ((metrics.leadsGenerated / metrics.uniqueSessions) * 100).toFixed(1)
                      : 0}%
                  </span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Avg. Messages/Session:</span>
                  <span>
                    {metrics?.uniqueSessions && metrics?.messagesSent
                      ? (metrics.messagesSent / metrics.uniqueSessions).toFixed(1)
                      : 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Voice Usage:</span>
                  <span>{metrics?.voiceUsage || 0} times</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default AdminDashboard;