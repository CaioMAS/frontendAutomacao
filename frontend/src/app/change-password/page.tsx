"use client";

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
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

    // TODO: Obtain idToken securely from HttpOnly cookie
    // For now, we'll simulate getting it. In a real app, you'd fetch it from a secure endpoint
    // or through a server component context.
    // Example: const idToken = await fetch('/api/get-id-token').then(res => res.json()).then(data => data.idToken);
    const idToken = "YOUR_ID_TOKEN_HERE"; // Placeholder

    if (!idToken || idToken === "YOUR_ID_TOKEN_HERE") {
        setError('Token de autenticação não encontrado. Faça login novamente.');
        // router.push('/'); // Redirect to login if no token
        return;
    }

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/change-password`, 
        { newPassword },
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      setMessage('Sua senha foi alterada com sucesso!');
      setNewPassword('');
      setConfirmPassword('');
      console.log('Change password response:', response.data);
      // Optionally redirect to a profile page or dashboard after successful change
      // router.push('/dashboard');
    } catch (err: any) {
      console.error('Change password error:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error.message || 'Erro ao alterar a senha.');
      } else {
        setError('Erro ao alterar a senha. Tente novamente mais tarde.');
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Alterar Senha</h2>
        {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline"> {message}</span>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong className="font-bold">Erro:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Nova Senha:
            </label>
            <input
              type="password"
              id="newPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">
              Confirmar Senha:
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Alterar Senha
          </button>
        </form>
        <div className="text-center mt-4">
          <Link href="/dashboard" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Voltar para o Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
