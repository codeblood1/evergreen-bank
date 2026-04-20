import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getUserTransactions } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send, TrendingDown, Receipt, Search, Filter } from 'lucide-react';
import type { Transaction } from '@/types';

export default function Transactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  useEffect(() => {
    let result = [...transactions];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          (t.recipient_email?.toLowerCase().includes(q) || t.sender_email?.toLowerCase().includes(q)) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    if (typeFilter !== 'all') {
      result = result.filter((t) =>
        typeFilter === 'sent' ? t.sender_id === user?.id : t.recipient_id === user?.id
      );
    }

    setFiltered(result);
  }, [transactions, search, statusFilter, typeFilter]);

  const fetchTransactions = async () => {
    if (!user?.id) return;
    try {
      setLoading(true);
      const data = await getUserTransactions(user.id);
      setTransactions(data);
      setFiltered(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
        <p className="text-gray-500">View all your transactions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by email or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex gap-3">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="w-4 h-4 mr-1" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="sent">Sent</SelectItem>
              <SelectItem value="received">Received</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Receipt className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No transactions found</p>
              {(search || statusFilter !== 'all' || typeFilter !== 'all') && (
                <p className="text-sm mt-1">Try adjusting your filters</p>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filtered.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.sender_id === user?.id ? 'bg-red-50' : 'bg-green-50'
                      }`}
                    >
                      {tx.sender_id === user?.id ? (
                        <Send className="w-5 h-5 text-red-600" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {tx.sender_id === user?.id ? 'Sent' : 'Received'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tx.sender_id === user?.id
                          ? `To: ${tx.recipient_name || tx.recipient_email}`
                          : `From: ${tx.sender_name || tx.sender_email}`}
                      </p>
                      {tx.description && (
                        <p className="text-xs text-gray-400 mt-0.5">{tx.description}</p>
                      )}
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
                    <div className="mt-1">{getStatusBadge(tx.status)}</div>
                    <p className="text-xs text-gray-400 mt-1">
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
