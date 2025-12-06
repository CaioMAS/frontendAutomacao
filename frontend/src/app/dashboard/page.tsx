"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
  instances: { count: number; limit: number };
  numbers: { count: number; limit: number };
  userConfigured: boolean;
}

export default function Dashboard() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      // Load instances
      const instancesRes = await fetch('/api/whatsapp/instances');
      const instancesData = instancesRes.ok ? await instancesRes.json() : { count: 0, limit: 2 };

      // Load numbers
      const numbersRes = await fetch('/api/user-numbers');
      const numbersData = numbersRes.ok ? await numbersRes.json() : [];
      const numbersList = Array.isArray(numbersData) ? numbersData : numbersData.numbers || [];

      // Load user config
      const configRes = await fetch('/api/config-user');
      const configData = configRes.ok ? await configRes.json() : null;
      const userConfigured = !!(configData?.data && configData.data.length > 0);

      setStats({
        instances: { count: instancesData.count || 0, limit: instancesData.limit || 2 },
        numbers: { count: numbersList.length, limit: 4 },
        userConfigured,
      });
    } catch (err) {
      console.error('Error loading dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/logoff', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        const data = await response.json();
        setError(data.message || 'Erro ao sair');
      }
    } catch (error) {
      console.error('❌ Error during logout:', error);
      setError('Erro inesperado');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-2">
          Dashboard
        </h1>
        <p className="text-base md:text-lg text-white/80 drop-shadow">
          Bem-vindo(a) ao Copilot Ally
        </p>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-200 mb-8">
          <p className="text-center text-gray-600">Carregando estatísticas...</p>
        </div>
      ) : stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Instances Card */}
          <Link href="/whatsapp-instances">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-200 hover:shadow-[#100a30]/30 hover:scale-[1.02] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-[#100a30] to-[#17113e] p-3 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.instances.count}
                    <span className="text-lg text-gray-500">/{stats.instances.limit}</span>
                  </p>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Instâncias WhatsApp</h3>
              <p className="text-xs text-gray-500">
                {stats.instances.count === stats.instances.limit ? 'Limite atingido' : `${stats.instances.limit - stats.instances.count} disponível(is)`}
              </p>
            </div>
          </Link>

          {/* Numbers Card */}
          <Link href="/integration-wpp">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-200 hover:shadow-[#100a30]/30 hover:scale-[1.02] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-gradient-to-br from-emerald-600 to-green-600 p-3 rounded-xl">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.numbers.count}
                    <span className="text-lg text-gray-500">/{stats.numbers.limit}</span>
                  </p>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Números Cadastrados</h3>
              <p className="text-xs text-gray-500">
                {stats.numbers.count === stats.numbers.limit ? 'Limite atingido' : `${stats.numbers.limit - stats.numbers.count} disponível(is)`}
              </p>
            </div>
          </Link>

          {/* Config Card */}
          <Link href="/config-user">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-200 hover:shadow-[#100a30]/30 hover:scale-[1.02] transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${stats.userConfigured ? 'bg-gradient-to-br from-blue-600 to-indigo-600' : 'bg-gradient-to-br from-amber-500 to-orange-500'}`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div className="text-right">
                  {stats.userConfigured ? (
                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  ) : (
                    <svg className="w-10 h-10 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  )}
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-700 mb-1">Configuração</h3>
              <p className="text-xs text-gray-500">
                {stats.userConfigured ? 'Configurado' : 'Pendente'}
              </p>
            </div>
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            href="/whatsapp-instances"
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#100a30] to-[#17113e] hover:shadow-lg hover:shadow-[#100a30]/50 text-white rounded-xl transition-all transform hover:scale-[1.02]"
          >
            <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="font-semibold text-center">Instâncias</span>
          </Link>

          <Link
            href="/whatsapp-groups"
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#100a30] to-[#17113e] hover:shadow-lg hover:shadow-[#100a30]/50 text-white rounded-xl transition-all transform hover:scale-[1.02]"
          >
            <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="font-semibold text-center">Grupos</span>
          </Link>

          <Link
            href="/integration-wpp"
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#100a30] to-[#17113e] hover:shadow-lg hover:shadow-[#100a30]/50 text-white rounded-xl transition-all transform hover:scale-[1.02]"
          >
            <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-semibold text-center">Números</span>
          </Link>

          <Link
            href="/config-user"
            className="flex flex-col items-center justify-center p-6 bg-gradient-to-br from-[#100a30] to-[#17113e] hover:shadow-lg hover:shadow-[#100a30]/50 text-white rounded-xl transition-all transform hover:scale-[1.02]"
          >
            <svg className="w-8 h-8 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-semibold text-center">Configurações</span>
          </Link>
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Conta</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/change-password"
            className="flex-1 text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-lg hover:shadow-blue-600/50 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02]"
          >
            Alterar Senha
          </Link>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex-1 text-center bg-gradient-to-r from-red-600 to-rose-600 hover:shadow-lg hover:shadow-red-600/50 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            {isLoggingOut ? 'Saindo...' : 'Sair'}
          </button>
        </div>
        {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}
      </div>
    </div>
  );
}
