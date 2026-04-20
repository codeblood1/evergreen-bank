import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { getUserTransactions } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Receipt, CreditCard, TrendingUp, TrendingDown, ArrowRight, Clock } from 'lucide-react';
import type { Transaction } from '@/types';

export default function Dashboard() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ sent: 0, received: 0, pending: 0 });

  useEffect(() => {
    fetchRecentTransactions();
    const interval = setInterval(() => {
      refreshUser();
      fetchRecentTransactions();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchRecentTransactions = async () => {
    if (!user?.id) return;
    try {
      const data = await getUserTransactions(user.id);
      setTransactions(data.slice(0, 5));

      // Calculate stats
      const sent = data
        .filter((t: Transaction) => t.sender_id === user.id && t.status === 'completed')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
      const received = data
        .filter((t: Transaction) => t.recipient_id === user.id && t.status === 'completed')
        .reduce((sum: number, t: Transaction) => sum + t.amount, 0);
      const pending = data.filter((t: Transaction) => t.status === 'pending').length;

      setStats({ sent, received, pending });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name?.split(' ')[0]}</h1>
        <p className="text-gray-500">Here&apos;s your financial overview</p>
      </div>

      {/* Balance Card */}
      <Card className="bg-emerald-600 border-emerald-600">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-medium">Available Balance</p>
              <p className="text-3xl font-bold text-white mt-1">
                ${user?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-white" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button
              variant="secondary"
              className="bg-white text-emerald-700 hover:bg-emerald-50"
              onClick={() => navigate('/send')}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Money
            </Button>
            <Button
              variant="outline"
              className="border-emerald-400 text-white hover:bg-emerald-500 hover:text-white"
              onClick={() => navigate('/transactions')}
            >
              <Receipt className="w-4 h-4 mr-2" />
              View All
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Sent</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${stats.sent.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Received</p>
                <p className="text-lg font-semibold text-gray-900">
                  ${stats.received.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <p className="text-lg font-semibold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Recent Transactions</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => navigate('/transactions')}>
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Receipt className="w-10 h-10 mx-auto mb-3 text-gray-300" />
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        tx.sender_id === user?.id ? 'bg-red-50' : 'bg-green-50'
                      }`}
                    >
                      {tx.sender_id === user?.id ? (
                        <Send className="w-4 h-4 text-red-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {tx.sender_id === user?.id
                          ? `To: ${tx.recipient_name || tx.recipient_email}`
                          : `From: ${tx.sender_name || tx.sender_email}`}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(tx.created_at).toLocaleDateString()}
                        {tx.description && ` · ${tx.description}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className={`text-sm font-semibold ${
                        tx.sender_id === user?.id ? 'text-red-600' : 'text-green-600'
                      }`}
                    >
                      {tx.sender_id === user?.id ? '-' : '+'}
                      ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusBadge(
                        tx.status
                      )}`}
                    >
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
