export default function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-900 p-4">
            <div className="bg-slate-800 p-8 rounded-lg shadow-lg max-w-2xl w-full text-center border border-slate-700">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-slate-200">Carregando configurações...</h2>
            </div>
        </div>
    );
}
