import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { createTransaction } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Send, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function SendMoney() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [recipientEmail, setRecipientEmail] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipientEmail || !amount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (numAmount > (user?.balance || 0)) {
      toast.error('Insufficient balance');
      return;
    }

    setLoading(true);

    try {
      await createTransaction(user!.id, recipientEmail, numAmount, description);
      setSuccess(true);
      toast.success('Transfer request submitted for approval');
      refreshUser();
    } catch (error: any) {
      toast.error(error.message || 'Failed to send money');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-md mx-auto">
        <Card className="text-center py-12">
          <CardContent>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Transfer Submitted!</h2>
            <p className="text-gray-500 mb-6">
              Your transfer of ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} to{' '}
              {recipientEmail} has been submitted and is pending admin approval.
            </p>
            <div className="flex gap-3 justify-center">
              <Button variant="outline" onClick={() => navigate('/transactions')}>
                View Transactions
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  setSuccess(false);
                  setRecipientEmail('');
                  setAmount('');
                  setDescription('');
                }}
              >
                Send Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Send Money</h1>
        <p className="text-gray-500">Transfer funds to another account</p>
      </div>

      <Card className="border-yellow-200 bg-yellow-50 mb-4">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-yellow-800">Admin Approval Required</p>
            <p className="text-xs text-yellow-700 mt-0.5">
              All transfers require admin approval before funds are moved. The amount will remain in your account until approved.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Transfer Details</CardTitle>
          <CardDescription>
            Available Balance:{' '}
            <span className="font-semibold text-emerald-600">
              ${user?.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient Email</Label>
              <Input
                id="recipient"
                type="email"
                placeholder="recipient@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                placeholder="What's this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700"
              disabled={loading}
            >
              {loading ? (
                'Processing...'
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Submit Transfer
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
