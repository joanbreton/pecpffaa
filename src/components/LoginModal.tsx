import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  User, 
  KeyRound, 
  X, 
  AlertCircle, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { isLoginModalOpen, setIsLoginModalOpen, login, setActiveView } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isLoginModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const res = login(username, password);
    if (res.success) {
      setActiveView('dashboard');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header in Military Blue #0D3671 */}
        <div className="bg-[#0D3671] text-white p-6 relative">
          <button
            onClick={() => setIsLoginModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-[#B91C1C] flex items-center justify-center text-white shadow">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Autenticación CMS</h3>
              <p className="text-xs text-slate-300">Panel de Gestión PECPFFAA</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 text-xs">
          
          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-[#B91C1C] border border-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Usuario o Correo Institucional</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuario o correo"
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0D3671] focus:border-transparent outline-none bg-slate-50 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Contraseña</label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-[#0D3671] focus:border-transparent outline-none bg-slate-50 text-xs font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#B91C1C] hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Ingresar al CMS</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
