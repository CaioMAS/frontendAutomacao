"use client";

import { useState, useEffect } from 'react';
import { CreateInstanceResponse, ListInstancesResponse, UserInstance } from '@/types/whatsapp';
import Image from 'next/image';

export default function WhatsAppInstancesPage() {
    const [instanceName, setInstanceName] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingList, setLoadingList] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [instanceData, setInstanceData] = useState<CreateInstanceResponse | null>(null);
    const [instances, setInstances] = useState<ListInstancesResponse | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Load instances on mount
    useEffect(() => {
        loadInstances();
    }, []);

    const loadInstances = async () => {
        try {
            setLoadingList(true);
            const response = await fetch('/api/whatsapp/instances', {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setInstances(data);
            } else {
                console.error('Error loading instances');
            }
        } catch (err) {
            console.error('Exception loading instances:', err);
        } finally {
            setLoadingList(false);
        }
    };

    const handleCreateInstance = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setInstanceData(null);

        try {
            console.log('📱 Creating WhatsApp instance:', instanceName);

            const response = await fetch('/api/whatsapp/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ instanceName }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('✅ Instance created successfully');
                setInstanceData(data);
                setInstanceName('');
                // Reload instances list
                loadInstances();
            } else {
                console.error('❌ Error creating instance:', data);
                // Handle specific error codes
                if (response.status === 400) {
                    setError('Limite de 2 instâncias atingido. Exclua uma instância antiga para criar uma nova.');
                } else if (response.status === 409) {
                    setError('Já existe uma instância com este nome. Escolha outro.');
                } else if (response.status === 401) {
                    setError('Sessão expirada. Faça login novamente.');
                    setTimeout(() => window.location.href = '/', 2000);
                } else {
                    setError(data.message || 'Erro ao criar instância');
                }
            }
        } catch (err: any) {
            console.error('❌ Exception during instance creation:', err);
            setError('Erro ao criar instância. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInstance = async (instanceName: string) => {
        try {
            const response = await fetch(`/api/whatsapp/instances/${instanceName}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                console.log('✅ Instance deleted successfully');
                setDeleteConfirm(null);
                // Reload instances list
                loadInstances();
                // Clear QR code if it was the deleted instance
                if (instanceData?.instance.instanceName === instanceName) {
                    setInstanceData(null);
                }
            } else {
                const data = await response.json();
                setError(data.message || 'Erro ao deletar instância');
            }
        } catch (err) {
            console.error('❌ Exception during instance deletion:', err);
            setError('Erro ao deletar instância. Tente novamente mais tarde.');
        }
    };

    const isLimitReached = !!(instances && instances.count >= instances.limit);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
                    Gerenciar Instâncias WhatsApp
                </h1>
                {instances && (
                    <div className="text-right">
                        <p className="text-sm text-gray-600">Instâncias criadas</p>
                        <p className={`text-2xl font-bold ${isLimitReached ? 'text-red-600' : 'text-blue-600'}`}>
                            {instances.count} / {instances.limit}
                        </p>
                    </div>
                )}
            </div>

            {/* Instances List */}
            {loadingList ? (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <p className="text-center text-gray-600">Carregando instâncias...</p>
                </div>
            ) : instances && instances.instances.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Suas Instâncias
                    </h2>
                    <div className="space-y-3">
                        {instances.instances.map((instance) => (
                            <div
                                key={instance.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-800">{instance.instanceName}</h3>
                                    <p className="text-sm text-gray-500">
                                        Criada em: {new Date(instance.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setDeleteConfirm(instance.instanceName)}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                                >
                                    Excluir
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}

            {/* Create Instance Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    Criar Nova Instância
                </h2>

                {isLimitReached && (
                    <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded">
                        <strong className="font-bold">Limite atingido! </strong>
                        <span>Você já possui {instances?.limit} instâncias. Exclua uma para criar uma nova.</span>
                    </div>
                )}

                <form onSubmit={handleCreateInstance} className="space-y-4">
                    <div>
                        <label htmlFor="instanceName" className="block text-sm font-medium text-gray-700 mb-2">
                            Nome da Instância
                        </label>
                        <input
                            type="text"
                            id="instanceName"
                            value={instanceName}
                            onChange={(e) => setInstanceName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Ex: minha-instancia"
                            required
                            disabled={loading || !!isLimitReached}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !instanceName || !!isLimitReached}
                        className="w-full md:w-auto bg-blue-500 hover:bg-blue-700 disabled:bg-blue-300 text-white font-bold py-2 px-6 rounded transition-colors"
                    >
                        {loading ? 'Criando...' : 'Criar Instância'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        <strong className="font-bold">Erro: </strong>
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* QR Code Display */}
            {instanceData && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Conectar WhatsApp
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Instance Info */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Nome da Instância</h3>
                                <p className="text-lg text-gray-900 font-semibold">{instanceData.instance.instanceName}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Status</h3>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${instanceData.instance.status === 'connected'
                                    ? 'bg-green-100 text-green-800'
                                    : instanceData.instance.status === 'connecting'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}>
                                    {instanceData.instance.status === 'connected' ? 'Conectado' :
                                        instanceData.instance.status === 'connecting' ? 'Conectando' : 'Desconectado'}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">ID da Instância</h3>
                                <p className="text-sm text-gray-700 break-all">{instanceData.instance.instanceId}</p>
                            </div>

                            <div className="pt-4 border-t">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Instruções:</h3>
                                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                                    <li>Abra o WhatsApp no seu celular</li>
                                    <li>Toque em Menu ou Configurações</li>
                                    <li>Toque em Aparelhos conectados</li>
                                    <li>Toque em Conectar um aparelho</li>
                                    <li>Aponte seu celular para esta tela para capturar o código QR</li>
                                </ol>
                            </div>
                        </div>

                        {/* QR Code */}
                        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-lg p-6">
                            {instanceData.qrcode.base64 ? (
                                <div className="space-y-4">
                                    <div className="bg-white p-4 rounded-lg shadow-sm">
                                        <Image
                                            src={instanceData.qrcode.base64}
                                            alt="QR Code"
                                            width={300}
                                            height={300}
                                            className="w-full h-auto"
                                        />
                                    </div>
                                    <p className="text-center text-sm text-gray-600">
                                        Escaneie o QR Code com seu WhatsApp
                                    </p>
                                </div>
                            ) : (
                                <div className="text-center text-gray-500">
                                    <p>QR Code não disponível</p>
                                    <p className="text-sm mt-2">A instância pode já estar conectada</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmar Exclusão</h3>
                        <p className="text-gray-600 mb-6">
                            Tem certeza que deseja excluir a instância <strong>{deleteConfirm}</strong>?
                            Isso desconectará o WhatsApp e não pode ser desfeito.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDeleteInstance(deleteConfirm)}
                                className="flex-1 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
