export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl w-full text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-gray-700">Carregando configurações...</h2>
            </div>
        </div>
    );
}
