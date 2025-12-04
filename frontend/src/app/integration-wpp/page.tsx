"use client";

import { useState, useEffect } from 'react';

interface UserNumber {
  id: string;
  userEmail: string;
  number: string;
  createdAt: string;
}

export default function WhatsAppNumbersPage() {
  const [numbers, setNumbers] = useState<UserNumber[]>([]);
  const [newNumber, setNewNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    loadNumbers();
  }, []);

  const loadNumbers = async () => {
    try {
      setLoadingList(true);
      const response = await fetch('/api/user-numbers');

      if (response.ok) {
        const data = await response.json();
        // Handle if data is array or object with property
        const list = Array.isArray(data) ? data : data.numbers || [];
        setNumbers(list);
      } else {
        console.error('Error loading numbers:', response.status);
      }
    } catch (err) {
      console.error('Exception loading numbers:', err);
    } finally {
      setLoadingList(false);
    }
  };

  const handleAddNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/user-numbers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ number: newNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        setNewNumber('');
        loadNumbers();
      } else {
        setError(data.message || 'Erro ao adicionar número');
      }
    } catch (err) {
      console.error('Exception adding number:', err);
      setError('Erro ao adicionar número. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNumber = async (id: string) => {
    try {
      const response = await fetch(`/api/user-numbers/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDeleteConfirm(null);
        loadNumbers();
      } else {
        const data = await response.json();
        setError(data.message || 'Erro ao deletar número');
      }
    } catch (err) {
      console.error('Exception deleting number:', err);
      setError('Erro ao deletar número.');
    }
  };

  const isLimitReached = numbers.length >= 4;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-100">
          Números de WhatsApp
        </h1>
        <div className="text-right">
          <p className="text-sm text-slate-400">Números cadastrados</p>
          <p className={`text-2xl font-bold ${isLimitReached ? 'text-red-400' : 'text-indigo-400'}`}>
            {numbers.length} / 4
          </p>
        </div>
      </div>

      {/* Numbers List */}
      {loadingList ? (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border border-slate-700">
          <p className="text-center text-slate-400">Carregando números...</p>
        </div>
      ) : numbers.length > 0 ? (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border border-slate-700">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            Seus Números
          </h2>
          <div className="space-y-3">
            {numbers.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-slate-700 rounded-lg hover:bg-slate-700/50 transition-colors"
              >
                <div>
                  <h3 className="font-semibold text-slate-100">{item.number.split('@')[0]}</h3>
                  <p className="text-sm text-slate-400">
                    Cadastrado em: {item.createdAt ? new Date(item.createdAt).toLocaleDateString('pt-BR') : '-'}
                  </p>
                </div>
                <button
                  onClick={() => setDeleteConfirm(item.id)}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border border-slate-700">
          <p className="text-center text-slate-500">Nenhum número cadastrado.</p>
        </div>
      )}

      {/* Add Number Form */}
      <div className="bg-slate-800 rounded-lg shadow-lg p-6 mb-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">
          Cadastrar Novo Número
        </h2>

        {isLimitReached && (
          <div className="mb-4 bg-yellow-900/30 border border-yellow-600/50 text-yellow-200 px-4 py-3 rounded">
            <strong className="font-bold">Limite atingido! </strong>
            <span>Você já possui 4 números. Exclua um para cadastrar outro.</span>
          </div>
        )}

        <form onSubmit={handleAddNumber} className="space-y-4">
          <div>
            <label htmlFor="number" className="block text-sm font-medium text-slate-300 mb-2">
              Número (com DDD)
            </label>
            <input
              type="text"
              id="number"
              value={newNumber}
              onChange={(e) => setNewNumber(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-md text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder-slate-500"
              placeholder="Ex: 11999999999"
              required
              disabled={loading || isLimitReached}
            />
          </div>

          <button
            type="submit"
            disabled={loading || !newNumber || isLimitReached}
            className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900/50 text-white font-bold py-2 px-6 rounded transition-colors"
          >
            {loading ? 'Cadastrando...' : 'Cadastrar Número'}
          </button>
        </form>

        {error && (
          <div className="mt-4 bg-red-900/30 border border-red-600/50 text-red-200 px-4 py-3 rounded">
            <strong className="font-bold">Erro: </strong>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-700 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-100 mb-4">Confirmar Exclusão</h3>
            <p className="text-slate-400 mb-6">
              Tem certeza que deseja excluir este número?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold py-2 px-4 rounded transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDeleteConfirm(deleteConfirm)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  function handleDeleteConfirm(id: string) {
    handleDeleteNumber(id);
  }
}
