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
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Esqueci minha Senha</h2>
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
            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Seu e-mail cadastrado"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          >
            Redefinir Senha
          </button>
        </form>
        <div className="text-center mt-4">
          <Link href="/" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Voltar para o Login
          </Link>
        </div>
      </div>
    </div>
  );
}
