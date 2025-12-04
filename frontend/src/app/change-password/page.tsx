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
    <div className="flex h-screen items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg max-w-md w-full border border-slate-700">
        <h2 className="text-3xl font-bold text-slate-100 mb-6 text-center">Alterar Senha</h2>
        {message && (
          <div className="bg-green-900/30 border border-green-600/50 text-green-200 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline"> {message}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-900/30 border border-red-600/50 text-red-200 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-slate-300 text-sm font-bold mb-2">
              Nova Senha:
            </label>
            <input
              type="password"
              id="newPassword"
              className="shadow appearance-none border border-slate-700 rounded w-full py-2 px-3 bg-slate-900 text-slate-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-slate-300 text-sm font-bold mb-2">
              Confirmar Senha:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="shadow appearance-none border border-slate-700 rounded w-full py-2 px-3 bg-slate-900 text-slate-100 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition-colors"
          >
            Alterar Senha
          </button>
        </form>
        <div className="text-center mt-4">
          <Link href="/dashboard" className="inline-block align-baseline font-bold text-sm text-indigo-400 hover:text-indigo-300">
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
