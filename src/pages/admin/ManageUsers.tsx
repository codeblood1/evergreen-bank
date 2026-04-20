import { useEffect, useState } from 'react';
import { supabase, getAllUsers } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Users, Search, Edit, Trash2, Shield, DollarSign, TrendingUp, Wallet } from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  balance: number;
  portfolio: any;
  is_admin: boolean;
  card_blocked: boolean;
  created_at: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [filtered, setFiltered] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<UserData | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editForm, setEditForm] = useState({
    full_name: '',
    balance: 0,
    stocks: 0,
    crypto: 0,
    bonds: 0,
    cash: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (u) =>
          u.full_name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }
    setFiltered(result);
  }, [users, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
      setFiltered(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    const portfolio = user.portfolio || { stocks: 0, crypto: 0, bonds: 0, cash: user.balance || 0 };
    setEditForm({
      full_name: user.full_name || '',
      balance: user.balance || 0,
      stocks: portfolio.stocks || 0,
      crypto: portfolio.crypto || 0,
      bonds: portfolio.bonds || 0,
      cash: portfolio.cash || 0,
    });
  };

  const handleSave = async () => {
    if (!editingUser) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: editForm.full_name,
          balance: editForm.balance,
          portfolio: {
            stocks: editForm.stocks,
            crypto: editForm.crypto,
            bonds: editForm.bonds,
            cash: editForm.cash,
          },
        })
        .eq('id', editingUser.id);

      if (error) throw error;

      toast.success('User updated successfully');
      setEditingUser(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update user');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;

    try {
      // Soft delete - just mark as deleted or actually delete from auth
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', deleteConfirm.id);

      if (error) throw error;

      toast.success('User deleted successfully');
      setDeleteConfirm(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    }
  };

  const handleToggleAdmin = async (user: UserData) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_admin: !user.is_admin })
        .eq('id', user.id);

      if (error) throw error;

      toast.success(`Admin status ${user.is_admin ? 'removed' : 'granted'} successfully`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update admin status');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Manage Users</h1>
        <p className="text-gray-400">View and manage all registered users</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-gray-800 border-gray-700 text-white"
        />
      </div>

      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-600" />
              <p>No users found</p>
              {search && <p className="text-sm mt-1">Try adjusting your search</p>}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-700 hover:bg-transparent">
                    <TableHead className="text-gray-400">User</TableHead>
                    <TableHead className="text-gray-400">Balance</TableHead>
                    <TableHead className="text-gray-400">Portfolio</TableHead>
                    <TableHead className="text-gray-400">Role</TableHead>
                    <TableHead className="text-gray-400">Joined</TableHead>
                    <TableHead className="text-gray-400 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((u) => (
                    <TableRow key={u.id} className="border-gray-700 hover:bg-gray-700/50">
                      <TableCell>
                        <div>
                          <p className="text-white font-medium">{u.full_name || 'N/A'}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-white font-semibold">
                          ${u.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </span>
                      </TableCell>
                      <TableCell>
                        {u.portfolio ? (
                          <div className="text-xs text-gray-300 space-y-0.5">
                            {u.portfolio.stocks > 0 && (
                              <p className="flex items-center gap-1">
                                <TrendingUp className="w-3 h-3 text-blue-400" />
                                Stocks: ${u.portfolio.stocks}
                              </p>
                            )}
                            {u.portfolio.crypto > 0 && (
                              <p className="flex items-center gap-1">
                                <DollarSign className="w-3 h-3 text-yellow-400" />
                                Crypto: ${u.portfolio.crypto}
                              </p>
                            )}
                            {u.portfolio.bonds > 0 && (
                              <p className="flex items-center gap-1">
                                <Wallet className="w-3 h-3 text-green-400" />
                                Bonds: ${u.portfolio.bonds}
                              </p>
                            )}
                            <p className="flex items-center gap-1">
                              <DollarSign className="w-3 h-3 text-gray-400" />
                              Cash: ${u.portfolio.cash || u.balance}
                            </p>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {u.is_admin ? (
                          <Badge className="bg-purple-500/20 text-purple-400 hover:bg-purple-500/20">
                            <Shield className="w-3 h-3 mr-1" />
                            Admin
                          </Badge>
                        ) : (
                          <Badge className="bg-gray-500/20 text-gray-400 hover:bg-gray-500/20">
                            User
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {new Date(u.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-blue-500 text-blue-400 hover:bg-blue-500/20 hover:text-blue-300"
                            onClick={() => handleEdit(u)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className={`${
                              u.is_admin
                                ? 'border-yellow-500 text-yellow-400 hover:bg-yellow-500/20'
                                : 'border-purple-500 text-purple-400 hover:bg-purple-500/20'
                            }`}
                            onClick={() => handleToggleAdmin(u)}
                          >
                            <Shield className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/20 hover:text-red-300"
                            onClick={() => setDeleteConfirm(u)}
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Edit Dialog */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Modify user details, balance, and portfolio
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Full Name</Label>
              <Input
                value={editForm.full_name}
                onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Email</Label>
              <Input value={editingUser?.email || ''} disabled className="bg-gray-700 border-gray-600 text-gray-400" />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Balance ($)</Label>
              <Input
                type="number"
                step="0.01"
                value={editForm.balance}
                onChange={(e) => setEditForm({ ...editForm, balance: parseFloat(e.target.value) || 0 })}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div className="border-t border-gray-700 pt-4">
              <Label className="text-gray-300 mb-3 block">Portfolio</Label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Stocks ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.stocks}
                    onChange={(e) => setEditForm({ ...editForm, stocks: parseFloat(e.target.value) || 0 })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Crypto ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.crypto}
                    onChange={(e) => setEditForm({ ...editForm, crypto: parseFloat(e.target.value) || 0 })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Bonds ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.bonds}
                    onChange={(e) => setEditForm({ ...editForm, bonds: parseFloat(e.target.value) || 0 })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-400">Cash ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={editForm.cash}
                    onChange={(e) => setEditForm({ ...editForm, cash: parseFloat(e.target.value) || 0 })}
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUser(null)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-purple-600 hover:bg-purple-700">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription className="text-gray-400">
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteConfirm && (
            <div className="py-4">
              <p className="text-white font-medium">{deleteConfirm.full_name}</p>
              <p className="text-gray-400 text-sm">{deleteConfirm.email}</p>
              <p className="text-gray-400 text-sm mt-1">
                Balance: ${deleteConfirm.balance?.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)} className="border-gray-600 text-gray-300 hover:bg-gray-700">
              Cancel
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
