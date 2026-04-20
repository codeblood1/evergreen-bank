import { useEffect, useState } from 'react';
import { getAllTransactions } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, Filter, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import type { Transaction } from '@/types';

export default function CompletedTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    let result = [...transactions];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.sender_email?.toLowerCase().includes(q) ||
          t.recipient_email?.toLowerCase().includes(q) ||
          t.sender_name?.toLowerCase().includes(q) ||
          t.recipient_name?.toLowerCase().includes(q) ||
          t.description?.toLowerCase().includes(q)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter((t) => t.status === statusFilter);
    }

    setFiltered(result);
  }, [transactions, search, statusFilter]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions();
      setTransactions(data);
      setFiltered(data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400 hover:bg-green-500/20">Completed</Badge>;
      case 'rejected':
        return <Badge className="bg-red-500/20 text-red-400 hover:bg-red-500/20">Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Completed Transactions</h1>
        <p className="text-gray-400">View all processed transactions</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by user email or name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] bg-gray-800 border-gray-700 text-white">
            <Filter className="w-4 h-4 mr-1" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Receipt className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p>No transactions found</p>
              {(search || statusFilter !== 'all') && (
                <p className="text-sm mt-1">Try adjusting your filters</p>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-400">Sender</TableHead>
                    <TableHead className="text-gray-400">Recipient</TableHead>
                    <TableHead className="text-gray-400">Amount</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Approved By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((tx) => (
                    <TableRow key={tx.id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">{tx.sender_name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400">{tx.sender_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">{tx.recipient_name || 'Unknown'}</p>
                          <p className="text-xs text-gray-400">{tx.recipient_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-white font-semibold">
                          ${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                      <TableCell>{getStatusBadge(tx.status)}</TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        <div>
                          <p>{new Date(tx.created_at).toLocaleDateString()}</p>
                          {tx.approved_at && (
                            <p className="text-xs text-gray-500">
                              Approved: {new Date(tx.approved_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {tx.approved_by_name || tx.approved_by || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
