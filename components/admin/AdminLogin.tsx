import React from 'react';
import { Lock } from 'lucide-react';

interface AdminLoginProps {
  email: string;
  password: string;
  error: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit
}) => {
  return (
    <div className="admin-panel min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-green-900 to-gray-900 opacity-90"></div>
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
          className="w-full h-full object-cover"
          alt="Background"
        />
      </div>

      <div className="bg-white p-6 md:p-10 rounded-xl shadow-2xl w-full max-w-md relative z-10 backdrop-blur-sm bg-white/95 border border-white/20 mx-4">
        <div className="flex justify-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 shadow-inner">
            <Lock size={32} />
          </div>
        </div>
        <h2 className="text-3xl font-display text-center text-gray-800 mb-2">Admin Login</h2>
        <p className="text-center text-gray-500 text-sm mb-8">Manage your real estate content securely</p>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
            <input
              type="email"
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-500 ml-1">Password</label>
            <input
              type="password"
              className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg px-4 py-3 focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
            />
          </div>
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg text-center font-medium">{error}</div>}

          <button
            type="submit"
            className="w-full bg-green-700 text-white font-bold py-4 rounded-lg hover:bg-green-800 transition-transform active:scale-95 shadow-lg uppercase tracking-wider text-sm"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};
