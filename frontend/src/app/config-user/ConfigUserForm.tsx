"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { UserConfig } from '@/types/auth';

interface ConfigUserFormProps {
  initialData: UserConfig | null;
  onCancel?: () => void;
  onSuccess?: (config: UserConfig) => void;
}

export default function ConfigUserForm({ initialData, onCancel, onSuccess }: ConfigUserFormProps) {
  const [formData, setFormData] = useState<UserConfig>({
    instancia_sdr: '',
    fixed_nome: '',
    numero_destino: '',
    instancia_ia: '',
    numero_fixo_grupo: '',
    google_calendar_id: '',
  });
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      // The request now goes to the internal BFF endpoint
      const response = await axios.post('/api/config-user',
        formData,
        {
          // withCredentials ensures the HttpOnly cookie is sent with the request
          withCredentials: true,
        }
      );
      setMessage('Configurações salvas com sucesso!');
      console.log('User config saved:', response.data);
      if (onSuccess) {
        // Pass the latest data back to the parent component
        onSuccess(formData);
      }
    } catch (err: any) {
      console.error('Error saving user config:', err);
      if (err.response && err.response.data && err.response.message) {
        setError(err.response.data.message || 'Erro ao salvar as configurações.');
      } else {
        setError('Erro ao salvar as configurações. Tente novamente mais tarde.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline"> {message}</span>
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Erro:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {/* Instancia Whatsapp SDR */}
      <div>
        <label htmlFor="instancia_sdr" className="block text-gray-700 text-sm font-bold mb-2">
          Instância Whatsapp SDR:
        </label>
        <input
          type="text"
          id="instancia_sdr"
          name="instancia_sdr"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={formData.instancia_sdr}
          onChange={handleChange}
          required
        />
      </div>

      {/* Nome do closer */}
      <div>
        <label htmlFor="fixed_nome" className="block text-gray-700 text-sm font-bold mb-2">
          Nome do Closer:
        </label>
        <input
          type="text"
          id="fixed_nome"
          name="fixed_nome"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={formData.fixed_nome}
          onChange={handleChange}
          required
        />
      </div>

      {/* Whatsapp do closer */}
      <div>
        <label htmlFor="numero_destino" className="block text-gray-700 text-sm font-bold mb-2">
          Whatsapp do Closer:
        </label>
        <input
          type="text"
          id="numero_destino"
          name="numero_destino"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={formData.numero_destino}
          onChange={handleChange}
          required
        />
      </div>

      {/* Instancia Whatsapp Agente de IA */}
      <div>
        <label htmlFor="instancia_ia" className="block text-gray-700 text-sm font-bold mb-2">
          Instância Whatsapp Agente de IA:
        </label>
        <input
          type="text"
          id="instancia_ia"
          name="instancia_ia"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={formData.instancia_ia}
          onChange={handleChange}
          required
        />
      </div>

      {/* Numero do grupo whatsapp */}
      <div>
        <label htmlFor="numero_fixo_grupo" className="block text-gray-700 text-sm font-bold mb-2">
          Número do Grupo Whatsapp:
        </label>
        <input
          type="text"
          id="numero_fixo_grupo"
          name="numero_fixo_grupo"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={formData.numero_fixo_grupo}
          onChange={handleChange}
          required
        />
      </div>

      {/* Email do google calendar */}
      <div>
        <label htmlFor="google_calendar_id" className="block text-gray-700 text-sm font-bold mb-2">
          Email do Google Calendar:
        </label>
        <input
          type="email"
          id="google_calendar_id"
          name="google_calendar_id"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={formData.google_calendar_id}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            disabled={loading}
          >
            Cancelar
          </button>
        )}
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
          disabled={loading}
        >
          {loading ? 'Salvando...' : 'Salvar Configurações'}
        </button>
      </div>
    </form>
  );
}
