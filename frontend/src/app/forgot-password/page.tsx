"use client";

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      // Assuming the API endpoint for forgot password is directly accessible or proxied
      // The prompt specifies POST /api/auth/forgot-password
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`, { email });
      setMessage('Um link para redefinir sua senha foi enviado para o seu e-mail, se a conta existir.');
      console.log('Forgot password response:', response.data);
    } catch (err: any) {
      console.error('Forgot password error:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error.message || 'Erro ao solicitar a recuperação de senha.');
      } else {
        setError('Erro ao solicitar a recuperação de senha. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0520] via-[#100a30] to-[#17113e] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 relative z-10 border border-white/20">
        {/* Logo/Title with gradient */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#100a30] via-[#17113e] to-[#100a30] bg-clip-text text-transparent mb-2">
            Esqueci minha Senha
          </h2>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-transparent via-[#100a30] to-transparent rounded-full"></div>
          <p className="text-sm text-gray-600 mt-4">
            Digite seu e-mail para receber as instruções de recuperação
          </p>
        </div>

        {message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm" role="alert">
            <span className="block sm:inline">{message}</span>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 backdrop-blur-sm" role="alert">
            <strong className="font-bold">Erro: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100a30] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
              placeholder="seu@email.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#100a30] via-[#17113e] to-[#100a30] hover:shadow-lg hover:shadow-[#100a30]/50 text-white font-semibold py-3.5 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Redefinir Senha
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <Link href="/" className="text-sm font-medium text-[#100a30] hover:text-[#17113e] transition-colors">
            ← Voltar para o Login
          </Link>
        </div>

        {/* Decorative bottom element */}
        <div className="mt-4">
          <p className="text-center text-xs text-gray-500">
            Protegido por autenticação segura
          </p>
        </div>
      </div>
    </div>
  );
}
