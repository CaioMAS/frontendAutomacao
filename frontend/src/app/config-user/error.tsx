'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Config User Page Error:', error);
    }, [error]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full text-center">
                <h2 className="text-2xl font-bold text-red-600 mb-4">Algo deu errado!</h2>
                <p className="text-gray-600 mb-6">Não foi possível carregar as configurações do usuário.</p>
                <p className="text-sm text-gray-500 mb-6">{error.message}</p>
                <button
                    onClick={() => reset()}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Tentar novamente
                </button>
            </div>
        </div>
    );
}
