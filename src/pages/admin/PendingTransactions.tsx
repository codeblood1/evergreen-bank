import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getPendingTransactions, approveTransaction, rejectTransaction } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { Transaction } from '@/types';

export default function PendingTransactions() {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getPendingTransactions();
      setTransactions(data);
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
      toast.error('Failed to load pending transactions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (txId: string) => {
    setProcessing(txId);
    try {
      await approveTransaction(txId, user!.id);
      toast.success('Transaction approved successfully');
      await fetchTransactions();
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve transaction');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (txId: string) => {
    setProcessing(txId);
    try {
      await rejectTransaction(txId, user!.id);
      toast.success('Transaction rejected');
      await fetchTransactions();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject transaction');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Pending Transactions</h1>
          <p className="text-gray-400">Review and approve transfer requests</p>
        </div>
        <Badge className="bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20">
          <Clock className="w-3 h-3 mr-1" />
          {transactions.length} Pending
        </Badge>
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p className="text-lg font-medium">All caught up!</p>
              <p className="text-sm">No pending transactions to review</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-400">Sender</TableHead>
                    <TableHead className="text-gray-400">Recipient</TableHead>
                    <TableHead className="text-gray-400">Amount</TableHead>
                    <TableHead className="text-gray-400">Description</TableHead>
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => (
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
                      <TableCell className="text-gray-300 max-w-xs truncate">
                        {tx.description || '-'}
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {new Date(tx.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApprove(tx.id)}
                            disabled={processing === tx.id}
                          >
                            {processing === tx.id ? (
                              <div className="w-4 h-4 animate-spin border-2 border-white border-t-transparent rounded-full" />
                            ) : (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            )}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                            onClick={() => handleReject(tx.id)}
                            disabled={processing === tx.id}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
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
