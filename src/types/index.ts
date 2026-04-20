// User profile type extending Supabase auth user
export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  balance: number;
  portfolio: Portfolio | null;
  is_admin: boolean;
  card_blocked: boolean;
  card_last4: string;
  created_at: string;
}

// Portfolio data structure
export interface Portfolio {
  stocks: number;
  crypto: number;
  bonds: number;
  cash: number;
}

// Transaction type
export interface Transaction {
  id: string;
  sender_id: string;
  recipient_id: string;
  amount: number;
  description: string | null;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
  approved_at: string | null;
  approved_by: string | null;
  sender_email?: string;
  sender_name?: string;
  recipient_email?: string;
  recipient_name?: string;
  approved_by_name?: string;
}

// Notification preferences
export interface NotificationPreferences {
  email_notifications: boolean;
  transaction_alerts: boolean;
  marketing_emails: boolean;
  security_alerts: boolean;
}

// Auth state
export interface AuthState {
  user: UserProfile | null;
  session: any | null;
  loading: boolean;
  isAdmin: boolean;
}
