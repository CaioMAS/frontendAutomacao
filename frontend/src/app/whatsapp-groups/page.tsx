"use client";

import { useState, useEffect } from 'react';
import { ListInstancesResponse, ListGroupsResponse, WhatsAppGroup } from '@/types/whatsapp';

export default function WhatsAppGroupsPage() {
    const [instances, setInstances] = useState<ListInstancesResponse | null>(null);
    const [selectedInstance, setSelectedInstance] = useState<string>('');
    const [groups, setGroups] = useState<WhatsAppGroup[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Load instances on mount
    useEffect(() => {
        loadInstances();
    }, []);

    const loadInstances = async () => {
        try {
            const response = await fetch('/api/whatsapp/instances', {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setInstances(data);
            }
        } catch (err) {
            console.error('Error loading instances:', err);
        }
    };

    const loadGroups = async (instanceName: string) => {
        setLoading(true);
        setError(null);
        setGroups([]);

        try {
            console.log('📱 Loading groups for instance:', instanceName);

            // Using instanceName as the ID for the route
            const response = await fetch(`/api/whatsapp/${instanceName}/groups`, {
                credentials: 'include',
            });

            const data = await response.json();

            if (response.ok) {
                console.log('✅ Groups loaded:', data);
                // Backend returns array directly, or object with groups property
                const groupsList = Array.isArray(data) ? data : (data.groups || []);
                setGroups(groupsList);
            } else {
                console.error('❌ Error loading groups:', data);
                setError(data.message || 'Erro ao carregar grupos');
            }
        } catch (err: any) {
            console.error('❌ Exception loading groups:', err);
            setError('Erro ao carregar grupos. Tente novamente mais tarde.');
        } finally {
            setLoading(false);
        }
    };

    const handleInstanceChange = (instanceName: string) => {
        setSelectedInstance(instanceName);
        if (instanceName) {
            loadGroups(instanceName);
        } else {
            setGroups([]);
        }
    };

    const copyToClipboard = (text: string, groupId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(groupId);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg mb-6">
                Grupos do WhatsApp
            </h1>

            {/* Instance Selector */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 mb-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Selecione uma Instância
                </h2>

                {instances && instances.instances.length > 0 ? (
                    <div>
                        <label htmlFor="instance" className="block text-sm font-semibold text-gray-700 mb-2">
                            Instância WhatsApp
                        </label>
                        <select
                            id="instance"
                            value={selectedInstance}
                            onChange={(e) => handleInstanceChange(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:ring-2 focus:ring-[#100a30] focus:border-transparent outline-none transition-all"
                        >
                            <option value="">Selecione uma instância...</option>
                            {instances.instances.map((instance) => (
                                <option key={instance.id} value={instance.instanceName}>
                                    {instance.instanceName}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">
                            Você não possui instâncias do WhatsApp criadas.
                        </p>
                        <a
                            href="/whatsapp-instances"
                            className="inline-block bg-[#1ECC5D] hover:bg-[#1AB84E] text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                        >
                            Criar Instância
                        </a>
                    </div>
                )}
            </div>

            {/* Groups List */}
            {selectedInstance && (
                <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Grupos Disponíveis
                    </h2>

                    {loading ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">Carregando grupos...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                            <strong className="font-bold">Erro: </strong>
                            <span>{error}</span>
                        </div>
                    ) : groups.length > 0 ? (
                        <div className="space-y-3">
                            {groups.map((group) => (
                                <div
                                    key={group.id}
                                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors gap-3"
                                >
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 text-lg">
                                            {group.subject}
                                        </h3>
                                        <p className="text-sm text-gray-600 font-mono break-all">
                                            ID: {group.id}
                                        </p>
                                        {group.participants && (
                                            <p className="text-xs text-gray-500 mt-1">
                                                {group.participants} participantes
                                            </p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard(group.id, group.id)}
                                        className={`px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${copiedId === group.id
                                            ? 'bg-emerald-600 text-white'
                                            : 'bg-[#1ECC5D] hover:bg-[#1AB84E] text-white transform hover:scale-[1.02]'
                                            }`}
                                    >
                                        {copiedId === group.id ? '✓ Copiado!' : 'Copiar ID'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-600">
                                Nenhum grupo encontrado para esta instância.
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Certifique-se de que a instância está conectada e participa de grupos.
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
