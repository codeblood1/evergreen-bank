import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toggleCardBlocked } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { CreditCard, Shield, ShieldAlert, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function CardPage() {
  const { user, refreshUser } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const [toggling, setToggling] = useState(false);

  const handleToggleBlock = async () => {
    setToggling(true);
    try {
      await toggleCardBlocked(user!.id, !user?.card_blocked);
      await refreshUser();
      toast.success(user?.card_blocked ? 'Card unblocked successfully' : 'Card blocked successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update card status');
    } finally {
      setToggling(false);
    }
  };

  // Mock card expiry - generated from user created date
  const getExpiryDate = () => {
    if (!user?.created_at) return '12/28';
    const date = new Date(user.created_at);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear() + 3).slice(-2);
    return `${month}/${year}`;
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Your Card</h1>
        <p className="text-gray-500">Manage your Evergreen debit card</p>
      </div>

      {/* Card Visual */}
      <div className="relative">
        <div
          className={`rounded-2xl p-6 aspect-[1.586/1] relative overflow-hidden transition-all ${
            user?.card_blocked
              ? 'bg-gray-700'
              : 'bg-emerald-600'
          }`}
        >
          {/* Card Background Pattern */}
          {!user?.card_blocked && (
            <>
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 rounded-full translate-y-1/2 -translate-x-1/4 opacity-30" />
            </>
          )}

          {/* Card Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-white" />
                <span className="text-white font-semibold">Evergreen</span>
              </div>
              {user?.card_blocked && (
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                  BLOCKED
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-emerald-200 hover:text-white transition-colors"
                >
                  {showDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-white text-2xl font-mono tracking-wider">
                {showDetails ? `•••• •••• •••• ${user?.card_last4 || '****'}` : '•••• •••• •••• ••••'}
              </p>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-emerald-200 text-xs mb-0.5">CARDHOLDER</p>
                <p className="text-white font-medium text-sm uppercase">{user?.full_name || 'YOUR NAME'}</p>
              </div>
              <div>
                <p className="text-emerald-200 text-xs mb-0.5">EXPIRES</p>
                <p className="text-white font-medium text-sm">{getExpiryDate()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Actions */}
      <Card>
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {user?.card_blocked ? (
                <ShieldAlert className="w-5 h-5 text-red-500" />
              ) : (
                <Shield className="w-5 h-5 text-emerald-600" />
              )}
              <div>
                <Label className="text-sm font-medium">
                  {user?.card_blocked ? 'Card is Blocked' : 'Card is Active'}
                </Label>
                <p className="text-xs text-gray-500">
                  {user?.card_blocked
                    ? 'Your card is currently blocked and cannot be used'
                    : 'Your card is active and ready for use'}
                </p>
              </div>
            </div>
            <Switch
              checked={!user?.card_blocked}
              onCheckedChange={handleToggleBlock}
              disabled={toggling}
            />
          </div>

          <div className="border-t border-gray-100 pt-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Card Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Card Type</span>
                <span className="font-medium">Evergreen Debit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Last 4 Digits</span>
                <span className="font-medium">{user?.card_last4}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Expiry Date</span>
                <span className="font-medium">{getExpiryDate()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span
                  className={`font-medium ${user?.card_blocked ? 'text-red-600' : 'text-green-600'}`}
                >
                  {user?.card_blocked ? 'Blocked' : 'Active'}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
