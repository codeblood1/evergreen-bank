import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Landmark,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  CreditCard,
  Clock,
  CheckCircle,
  Lock,
  BarChart3,
  ChevronRight,
} from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your funds are protected with enterprise-level encryption and security protocols.',
  },
  {
    icon: Zap,
    title: 'Instant Transfers',
    description: 'Send money to anyone, anywhere. Transfers are processed quickly and reliably.',
  },
  {
    icon: CreditCard,
    title: 'Virtual Card',
    description: 'Manage your Evergreen debit card with real-time controls and monitoring.',
  },
  {
    icon: Clock,
    title: 'Transaction History',
    description: 'Track every transaction with detailed history, filters, and search capabilities.',
  },
  {
    icon: Lock,
    title: 'Admin Approval',
    description: 'All transfers require admin approval, adding an extra layer of fraud protection.',
  },
  {
    icon: BarChart3,
    title: 'Portfolio Tracking',
    description: 'Monitor your investments across stocks, crypto, bonds, and cash allocations.',
  },
];

const steps = [
  {
    step: '01',
    title: 'Create Account',
    description: 'Sign up in seconds with just your email and password.',
  },
  {
    step: '02',
    title: 'Get Balance',
    description: 'Receive a starting balance to begin banking immediately.',
  },
  {
    step: '03',
    title: 'Send & Receive',
    description: 'Transfer funds securely with admin-approved transactions.',
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <Landmark className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Evergreen</span>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                Sign In
              </Link>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                Secure Online Banking
              </div>
              <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight">
                Banking made{' '}
                <span className="text-emerald-600">simple</span> and{' '}
                <span className="text-emerald-600">secure</span>
              </h1>
              <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
                Send money, track transactions, and manage your finances all in one place.
                Built with modern security and a clean experience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
                  <Link to="/register">
                    Open Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-lg px-8">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Free to use
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Instant setup
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  Secure transfers
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative bg-emerald-600 rounded-3xl p-8 shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 rounded-full translate-y-1/2 -translate-x-1/4 opacity-30" />
                <div className="relative z-10">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-4">
                    <p className="text-emerald-100 text-sm mb-1">Available Balance</p>
                    <p className="text-4xl font-bold text-white">$10,000.00</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <SendIcon className="w-6 h-6 text-white mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">Send</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center">
                      <Clock className="w-6 h-6 text-white mx-auto mb-2" />
                      <p className="text-white text-sm font-medium">History</p>
                    </div>
                  </div>
                  <div className="mt-4 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-white text-sm font-medium">Recent Activity</p>
                      <ChevronRight className="w-4 h-4 text-emerald-200" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white text-sm">Transfer to John</span>
                        </div>
                        <span className="text-emerald-200 text-sm font-medium">-$250.00</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                            <Globe className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-white text-sm">Deposit from Bank</span>
                        </div>
                        <span className="text-emerald-200 text-sm font-medium">+$1,500.00</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600">$0</p>
              <p className="text-gray-500 mt-1">Fees</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600">24/7</p>
              <p className="text-gray-500 mt-1">Support</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600">100%</p>
              <p className="text-gray-500 mt-1">Secure</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-emerald-600">Instant</p>
              <p className="text-gray-500 mt-1">Setup</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to bank smarter
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              A complete suite of banking tools designed for the modern user.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 transition-colors">
                  <feature.icon className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              How it works
            </h2>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Get started with Evergreen Bank in three simple steps.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <span className="text-2xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-emerald-600 rounded-3xl p-12 sm:p-16 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500 rounded-full -translate-y-1/2 translate-x-1/3 opacity-50" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400 rounded-full translate-y-1/2 -translate-x-1/4 opacity-30" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to get started?
              </h2>
              <p className="text-emerald-100 text-xl mb-8 max-w-lg mx-auto">
                Create your free account today and start banking with Evergreen.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8">
                  <Link to="/register">
                    Create Free Account
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8">
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-emerald-600 rounded-md flex items-center justify-center">
                <Landmark className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-gray-900">Evergreen Bank</span>
            </div>
            <p className="text-sm text-gray-500">
              Modern banking built with React, TypeScript, and Supabase.
            </p>
            <div className="flex items-center gap-6">
              <Link to="/login" className="text-sm text-gray-500 hover:text-gray-900">
                Sign In
              </Link>
              <Link to="/register" className="text-sm text-gray-500 hover:text-gray-900">
                Register
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SendIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  );
}
