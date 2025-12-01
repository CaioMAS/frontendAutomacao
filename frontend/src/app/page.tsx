"use client";

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

// A separate component to access search params because it requires Suspense
function ErrorDisplay() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (!error) return null;

  return (
    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong className="font-bold">Erro:</strong>
      <span className="block sm:inline"> {error}</span>
    </div>
  );
}

export default function Login() {
  return (
    <div className="flex h-screen">
      {/* Left 50% */}
      <div className="w-1/2 h-full bg-gradient-to-l from-[#100a30] to-[#17113e] flex items-center justify-center">
        <h1 className="text-white text-4xl font-bold">Welcome</h1>
      </div>

      {/* Right 50% */}
      <div className="w-1/2 h-full bg-white flex items-center justify-center p-8">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Login</h2>
          
          <Suspense fallback={<div>Loading...</div>}>
            <ErrorDisplay />
          </Suspense>

          <form action="/api/auth/login-action" method="POST" className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email" // Add name attribute for form submission
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">
                Senha:
              </label>
              <input
                type="password"
                id="password"
                name="password" // Add name attribute for form submission
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              >
                Entrar
              </button>
            </div>
            <div className="text-center mt-4">
              <Link href="/forgot-password" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                Esqueci minha senha
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}