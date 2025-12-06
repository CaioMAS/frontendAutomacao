"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ChangePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    try {
      console.log('🔐 Changing password...');

      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('✅ Password changed successfully');

        // Call logoff to clear session since backend revoked it
        await fetch('/api/auth/logoff', {
          method: 'POST',
          credentials: 'include',
        });

        // Redirect to login with success message
        alert('Senha alterada com sucesso! Faça login novamente com sua nova senha.');
        window.location.href = '/';
      } else {
        console.error('❌ Error changing password:', data);
        setError(data.message || 'Erro ao alterar a senha.');
      }
    } catch (err: any) {
      console.error('❌ Exception during password change:', err);
      setError('Erro ao alterar a senha. Tente novamente mais tarde.');
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 relative overflow-hidden">


      <div className="max-w-md w-full bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 relative z-10 border border-white/20">
        {/* Logo/Title with gradient */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white drop-shadow-lg mb-2">
            Alterar Senha
          </h2>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-transparent via-[#100a30] to-transparent rounded-full"></div>
          <p className="text-sm text-gray-600 mt-4">
            Crie uma nova senha para sua conta
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
            <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Nova Senha
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100a30] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
              placeholder="Digite sua nova senha"
              required
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirmar Senha
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#100a30] focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400"
              placeholder="Confirme sua nova senha"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#1ECC5D] hover:bg-[#1AB84E] text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
          >
            Alterar Senha
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <Link href="/dashboard" className="text-sm font-medium text-[#100a30] hover:text-[#17113e] transition-colors">
            ← Voltar para o Dashboard
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
