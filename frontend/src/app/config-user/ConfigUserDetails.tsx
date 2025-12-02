import { UserConfig } from '@/types/auth';

interface ConfigUserDetailsProps {
    config: UserConfig;
    onEdit: () => void;
}

export default function ConfigUserDetails({ config, onEdit }: ConfigUserDetailsProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
                <div className="border-b pb-2 flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-500">Instância Whatsapp SDR:</h3>
                    <p className="text-lg text-gray-900">{config.instancia_sdr}</p>
                </div>

                <div className="border-b pb-2 flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-500">Nome do Closer:</h3>
                    <p className="text-lg text-gray-900">{config.fixed_nome}</p>
                </div>

                <div className="border-b pb-2 flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-500">Whatsapp do Closer:</h3>
                    <p className="text-lg text-gray-900">{config.numero_destino}</p>
                </div>

                <div className="border-b pb-2 flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-500">Instância Whatsapp Agente de IA:</h3>
                    <p className="text-lg text-gray-900">{config.instancia_ia}</p>
                </div>

                <div className="border-b pb-2 flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-500">Número do Grupo Whatsapp:</h3>
                    <p className="text-lg text-gray-900">{config.numero_fixo_grupo}</p>
                </div>

                <div className="border-b pb-2 flex items-center gap-2">
                    <h3 className="text-sm font-medium text-gray-500">Email do Google Calendar:</h3>
                    <p className="text-lg text-gray-900">{config.google_calendar_id}</p>
                </div>
            </div>

            <div className="flex justify-end mt-6">
                <button
                    onClick={onEdit}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Editar Configurações
                </button>
            </div>
        </div>
    );
}
