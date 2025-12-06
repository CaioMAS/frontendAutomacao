import { UserConfig } from '@/types/auth';

interface ConfigUserDetailsProps {
    config: UserConfig;
    onEdit: () => void;
}

export default function ConfigUserDetails({ config, onEdit }: ConfigUserDetailsProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <div className="border-b border-gray-200 pb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-700 whitespace-nowrap">Instância Whatsapp SDR:</h3>
                    <p className="text-lg text-gray-900 break-words">{config.instancia_sdr}</p>
                </div>

                <div className="border-b border-gray-200 pb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-700 whitespace-nowrap">Nome do Closer:</h3>
                    <p className="text-lg text-gray-900 break-words">{config.fixed_nome}</p>
                </div>

                <div className="border-b border-gray-200 pb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-700 whitespace-nowrap">Whatsapp do Closer:</h3>
                    <p className="text-lg text-gray-900 break-words">{config.numero_destino}</p>
                </div>

                <div className="border-b border-gray-200 pb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-700 whitespace-nowrap">Instância Whatsapp Agente de IA:</h3>
                    <p className="text-lg text-gray-900 break-words">{config.instancia_ia}</p>
                </div>

                <div className="border-b border-gray-200 pb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-700 whitespace-nowrap">Número do Grupo Whatsapp:</h3>
                    <p className="text-lg text-gray-900 break-words">{config.numero_fixo_grupo}</p>
                </div>

                <div className="border-b border-gray-200 pb-2 flex flex-col sm:flex-row sm:items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-700 whitespace-nowrap">Email do Google Calendar:</h3>
                    <p className="text-lg text-gray-900 break-words">{config.google_calendar_id}</p>
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={onEdit}
                    className="bg-gradient-to-r from-[#100a30] via-[#17113e] to-[#100a30] hover:shadow-lg hover:shadow-[#100a30]/50 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-[1.02]"
                >
                    Editar Configurações
                </button>
            </div>
        </div>
    );
}
