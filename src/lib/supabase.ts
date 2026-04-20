import { createClient } from '@supabase/supabase-js';

// Supabase credentials from environment variables (for production)
// Falls back to hardcoded values for development
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://anwwtjnvmgsbubvovrlu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFud3d0am52bWdzYnVidm92cmx1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMTg0MjgsImV4cCI6MjA2NTg5NDQyOH0.X3JlWmtF5y_3hJYqX4qh9t1PpDoEa2Gy4u6NBg7pRyk';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database helper functions

// Get user profile by ID
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<any>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Create a new transaction (pending status)
export const createTransaction = async (
  senderId: string,
  recipientEmail: string,
  amount: number,
  description: string
) => {
  // First find recipient by email
  const { data: recipient, error: recipientError } = await supabase
    .from('users')
    .select('id')
    .eq('email', recipientEmail)
    .single();

  if (recipientError || !recipient) {
    throw new Error('Recipient not found');
  }

  if (recipient.id === senderId) {
    throw new Error('Cannot send money to yourself');
  }

  const { data, error } = await supabase
    .from('transactions')
    .insert([
      {
        sender_id: senderId,
        recipient_id: recipient.id,
        amount,
        description,
        status: 'pending',
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get transactions for a user (both sent and received)
export const getUserTransactions = async (userId: string) => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      sender:users!transactions_sender_id_fkey(email, full_name),
      recipient:users!transactions_recipient_id_fkey(email, full_name)
    `)
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map((t: any) => ({
    ...t,
    sender_email: t.sender?.email,
    sender_name: t.sender?.full_name,
    recipient_email: t.recipient?.email,
    recipient_name: t.recipient?.full_name,
  })) || [];
};

// Get all pending transactions (for admin)
export const getPendingTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      sender:users!transactions_sender_id_fkey(email, full_name),
      recipient:users!transactions_recipient_id_fkey(email, full_name)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map((t: any) => ({
    ...t,
    sender_email: t.sender?.email,
    sender_name: t.sender?.full_name,
    recipient_email: t.recipient?.email,
    recipient_name: t.recipient?.full_name,
  })) || [];
};

// Get all completed/rejected transactions (for admin)
export const getAllTransactions = async () => {
  const { data, error } = await supabase
    .from('transactions')
    .select(`
      *,
      sender:users!transactions_sender_id_fkey(email, full_name),
      recipient:users!transactions_recipient_id_fkey(email, full_name),
      admin:users!transactions_approved_by_fkey(email, full_name)
    `)
    .neq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data?.map((t: any) => ({
    ...t,
    sender_email: t.sender?.email,
    sender_name: t.sender?.full_name,
    recipient_email: t.recipient?.email,
    recipient_name: t.recipient?.full_name,
    approved_by_name: t.admin?.full_name,
  })) || [];
};

// Approve a transaction (admin)
export const approveTransaction = async (transactionId: string, adminId: string) => {
  const { data: tx, error: txError } = await supabase
    .from('transactions')
    .select('*, sender:users!transactions_sender_id_fkey(id, balance), recipient:users!transactions_recipient_id_fkey(id, balance)')
    .eq('id', transactionId)
    .single();

  if (txError) throw txError;
  if (!tx) throw new Error('Transaction not found');
  if (tx.status !== 'pending') throw new Error('Transaction is not pending');

  const senderBalance = tx.sender?.balance || 0;
  const recipientBalance = tx.recipient?.balance || 0;

  if (senderBalance < tx.amount) {
    throw new Error('Insufficient funds');
  }

  // Update transaction status
  const { error: updateTxError } = await supabase
    .from('transactions')
    .update({
      status: 'completed',
      approved_at: new Date().toISOString(),
      approved_by: adminId,
    })
    .eq('id', transactionId);

  if (updateTxError) throw updateTxError;

  // Deduct from sender
  const { error: senderError } = await supabase
    .from('users')
    .update({ balance: senderBalance - tx.amount })
    .eq('id', tx.sender_id);

  if (senderError) throw senderError;

  // Add to recipient
  const { error: recipientError } = await supabase
    .from('users')
    .update({ balance: recipientBalance + tx.amount })
    .eq('id', tx.recipient_id);

  if (recipientError) throw recipientError;

  return { success: true };
};

// Reject a transaction (admin)
export const rejectTransaction = async (transactionId: string, adminId: string) => {
  const { error } = await supabase
    .from('transactions')
    .update({
      status: 'rejected',
      approved_at: new Date().toISOString(),
      approved_by: adminId,
    })
    .eq('id', transactionId);

  if (error) throw error;
  return { success: true };
};

// Get all users (admin)
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
};

// Toggle card blocked status
export const toggleCardBlocked = async (userId: string, blocked: boolean) => {
  const { data, error } = await supabase
    .from('users')
    .update({ card_blocked: blocked })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
