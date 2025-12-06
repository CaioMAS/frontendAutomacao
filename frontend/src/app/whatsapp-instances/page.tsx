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

    // Modal state
    const [selectedInstance, setSelectedInstance] = useState<UserInstance | null>(null);
    const [statusData, setStatusData] = useState<any>(null);
    const [qrCodeData, setQrCodeData] = useState<string | null>(null);
    const [loadingStatus, setLoadingStatus] = useState(false);
    const [loadingConnect, setLoadingConnect] = useState(false);

    // Load instances on mount
    useEffect(() => {
        loadInstances();
    }, []);

    // Reload instances when page becomes visible (user returns to tab/page)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('📱 Page visible, reloading instances...');
                loadInstances();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const loadInstances = async () => {
        try {
            setLoadingList(true);
            console.log('🔍 [Frontend] Loading instances...');

            const response = await fetch('/api/whatsapp/instances', {
                credentials: 'include',
            });

            console.log('🔍 [Frontend] Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('🔍 [Frontend] Received data:', data);
                console.log('🔍 [Frontend] Instances count:', data.instances?.length || 0);
                setInstances(data);
            } else {
                console.error('❌ [Frontend] Error loading instances, status:', response.status);
            }
        } catch (err) {
            console.error('❌ [Frontend] Exception loading instances:', err);
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
                if (selectedInstance?.instanceName === instanceName) {
                    closeModal();
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

    const openInstanceDetails = async (instance: UserInstance) => {
        setSelectedInstance(instance);
        setStatusData(null);
        setQrCodeData(null);
        setLoadingStatus(true);

        try {
            // Use instanceName as the ID for the API call
            const response = await fetch(`/api/whatsapp/${instance.instanceName}/status`);
            if (response.ok) {
                const data = await response.json();
                setStatusData(data);
            }
        } catch (err) {
            console.error('Error fetching status:', err);
        } finally {
            setLoadingStatus(false);
        }
    };

    const handleConnect = async () => {
        if (!selectedInstance) return;
        setLoadingConnect(true);
        setQrCodeData(null);

        try {
            // Use instanceName as the ID for the API call
            const response = await fetch(`/api/whatsapp/${selectedInstance.instanceName}/connect`);
            if (response.ok) {
                const data = await response.json();
                if (data.base64) {
                    setQrCodeData(data.base64);
                }
            }
        } catch (err) {
            console.error('Error connecting:', err);
        } finally {
            setLoadingConnect(false);
        }
    };

    const closeModal = () => {
        setSelectedInstance(null);
        setStatusData(null);
        setQrCodeData(null);
    };

    const isLimitReached = !!(instances && instances.count >= instances.limit);

    return (
        <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                    Gerenciar Instâncias WhatsApp
                </h1>
                {instances && (
                    <div className="text-right">
                        <p className="text-sm text-white/80 drop-shadow">Instâncias criadas</p>
                        <p className={`text-2xl font-bold drop-shadow-lg ${isLimitReached ? 'text-red-300' : 'text-white'}`}>
                            {instances.count} / {instances.limit}
                        </p>
                    </div>
                )}
            </div>

            {/* Instances List */}
            {loadingList ? (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-6 border border-gray-200">
                    <p className="text-center text-gray-600">Carregando instâncias...</p>
                </div>
            ) : instances && instances.instances.length > 0 ? (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Suas Instâncias
                    </h2>
                    <div className="space-y-3">
                        {instances.instances.map((instance) => (
                            <div
                                key={instance.id}
                                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                                onClick={() => openInstanceDetails(instance)}
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900">{instance.instanceName}</h3>
                                    <p className="text-sm text-gray-600">
                                        Criada em: {new Date(instance.createdAt).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-[#100a30] hover:text-[#17113e] hover:underline font-medium">Gerenciar</span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteConfirm(instance.instanceName);
                                        }}
                                        className="bg-[#EF4343] hover:bg-[#DC2626] text-white font-semibold py-2 px-4 rounded-xl transition-all"
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}

            {/* Create Instance Form */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Criar Nova Instância
                </h2>

                {isLimitReached && (
                    <div className="mb-4 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-xl">
                        <strong className="font-bold">Limite atingido! </strong>
                        <span>Você já possui {instances?.limit} instâncias. Exclua uma para criar uma nova.</span>
                    </div>
                )}

                <form onSubmit={handleCreateInstance} className="space-y-4">
                    <div>
                        <label htmlFor="instanceName" className="block text-sm font-semibold text-gray-700 mb-2">
                            Nome da Instância
                        </label>
                        <input
                            type="text"
                            id="instanceName"
                            value={instanceName}
                            onChange={(e) => setInstanceName(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#100a30] focus:border-transparent placeholder-gray-400 outline-none transition-all"
                            placeholder="Ex: minha-instancia"
                            required
                            disabled={loading || !!isLimitReached}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !instanceName || !!isLimitReached}
                        className="w-full md:w-auto bg-[#1ECC5D] hover:bg-[#1AB84E] disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                    >
                        {loading ? 'Criando...' : 'Criar Instância'}
                    </button>
                </form>

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                        <strong className="font-bold">Erro: </strong>
                        <span>{error}</span>
                    </div>
                )}
            </div>

            {/* QR Code Display (Initial Creation) */}
            {instanceData && (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Conectar WhatsApp
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Instance Info */}
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700">Nome da Instância</h3>
                                <p className="text-lg text-gray-900 font-semibold">{instanceData.instance.instanceName}</p>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-700">Status</h3>
                                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${instanceData.instance.status === 'connected'
                                    ? 'bg-green-900/30 text-green-400'
                                    : instanceData.instance.status === 'connecting'
                                        ? 'bg-yellow-900/30 text-yellow-400'
                                        : 'bg-red-900/30 text-red-400'
                                    }`}>
                                    {instanceData.instance.status === 'connected' ? 'Conectado' :
                                        instanceData.instance.status === 'connecting' ? 'Conectando' : 'Desconectado'}
                                </span>
                            </div>

                            <div>
                                <h3 className="text-sm font-semibold text-gray-700">ID da Instância</h3>
                                <p className="text-sm text-gray-600 break-all">{instanceData.instance.instanceId}</p>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Instruções:</h3>
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
                        <div className="flex flex-col items-center justify-center bg-gray-50 rounded-xl p-6 border border-gray-200">
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

            {/* Instance Details Modal */}
            {selectedInstance && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-2xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">
                                Detalhes da Instância: {selectedInstance.instanceName}
                            </h3>
                            <button onClick={closeModal} className="text-gray-600 hover:text-gray-900">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Status Section */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                <h4 className="font-semibold text-gray-700 mb-2">Status da Conexão</h4>
                                {loadingStatus ? (
                                    <p className="text-gray-500">Verificando status...</p>
                                ) : statusData ? (
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-block w-3 h-3 rounded-full ${statusData.instance?.state === 'open' ? 'bg-green-500' : 'bg-red-500'
                                            }`}></span>
                                        <span className="font-medium text-gray-900">
                                            {statusData.instance?.state === 'open' ? 'Conectado' : 'Desconectado'}
                                        </span>
                                    </div>
                                ) : (
                                    <p className="text-red-600">Não foi possível obter o status.</p>
                                )}
                            </div>

                            {/* Connection Action */}
                            {(!statusData || statusData.instance?.state !== 'open') && (
                                <div className="border-t border-gray-200 pt-6">
                                    <h4 className="font-semibold text-gray-700 mb-4">Conectar WhatsApp</h4>

                                    {!qrCodeData ? (
                                        <button
                                            onClick={handleConnect}
                                            disabled={loadingConnect}
                                            className="bg-[#1ECC5D] hover:bg-[#1AB84E] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
                                        >
                                            {loadingConnect ? 'Gerando QR Code...' : 'Gerar QR Code'}
                                        </button>
                                    ) : (
                                        <div className="flex flex-col items-center space-y-4">
                                            <div className="bg-white p-4 rounded-lg shadow border">
                                                <Image
                                                    src={qrCodeData}
                                                    alt="QR Code para conexão"
                                                    width={250}
                                                    height={250}
                                                />
                                            </div>
                                            <p className="text-sm text-gray-600">
                                                Escaneie o QR Code acima com seu WhatsApp para conectar.
                                            </p>
                                            <button
                                                onClick={() => setQrCodeData(null)}
                                                className="text-sm text-[#100a30] hover:text-[#17113e] hover:underline font-medium"
                                            >
                                                Gerar novo código
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteConfirm && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 shadow-2xl">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirmar Exclusão</h3>
                        <p className="text-gray-600 mb-6">
                            Tem certeza que deseja excluir a instância <strong>{deleteConfirm}</strong>?
                            Isso desconectará o WhatsApp e não pode ser desfeito.
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setDeleteConfirm(null)}
                                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-all"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={() => handleDeleteInstance(deleteConfirm)}
                                className="flex-1 bg-[#EF4343] hover:bg-[#DC2626] text-white font-semibold py-3 px-4 rounded-xl transition-all"
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
