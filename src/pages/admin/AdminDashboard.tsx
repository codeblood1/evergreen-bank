import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, getPendingTransactions, getAllUsers } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Users,
  Clock,
  CheckCircle,
  DollarSign,
  ArrowRight,
  Activity,
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingCount: 0,
    completedToday: 0,
    totalVolume: 0,
  });
  const [recentPending, setRecentPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Get all users count
      const users = await getAllUsers();

      // Get pending transactions
      const pending = await getPendingTransactions();

      // Get completed transactions
      const { data: completed } = await supabase
        .from('transactions')
        .select('amount, created_at')
        .eq('status', 'completed');

      const today = new Date().toISOString().split('T')[0];
      const completedToday = completed?.filter(
        (t) => t.created_at >= today
      ).length || 0;

      const totalVolume = completed?.reduce((sum: number, t: any) => sum + (t.amount || 0), 0) || 0;

      setStats({
        totalUsers: users.length,
        pendingCount: pending.length,
        completedToday,
        totalVolume,
      });

      setRecentPending(pending.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-gray-400">Overview of the banking system</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Users</p>
                <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Pending</p>
                <p className="text-2xl font-bold text-white">{stats.pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Completed Today</p>
                <p className="text-2xl font-bold text-white">{stats.completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-400">Total Volume</p>
                <p className="text-2xl font-bold text-white">
                  ${stats.totalVolume.toLocaleString('en-US', { minimumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
          onClick={() => navigate('/admin/pending')}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Review Pending</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
          onClick={() => navigate('/admin/completed')}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Activity className="w-5 h-5 text-green-400" />
              <span className="text-white font-medium">View Completed</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700 hover:border-purple-500 transition-colors cursor-pointer"
          onClick={() => navigate('/admin/users')}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-blue-400" />
              <span className="text-white font-medium">Manage Users</span>
            </div>
            <ArrowRight className="w-4 h-4 text-gray-400" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Pending Transactions */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg text-white">Recent Pending Transfers</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            className="text-purple-400 hover:text-purple-300"
            onClick={() => navigate('/admin/pending')}
          >
            View All
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
            </div>
          ) : recentPending.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <CheckCircle className="w-10 h-10 mx-auto mb-3 text-gray-600" />
              <p>No pending transactions</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentPending.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-700/50"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {tx.sender_name || tx.sender_email}
                    </p>
                    <p className="text-xs text-gray-400">
                      To: {tx.recipient_name || tx.recipient_email}
                    </p>
                    {tx.description && (
                      <p className="text-xs text-gray-500 mt-0.5">{tx.description}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">
                      ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(tx.created_at).toLocaleString()}
                    </p>
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
