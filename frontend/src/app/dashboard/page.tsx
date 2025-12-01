// frontend/src/app/dashboard/page.tsx
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Dashboard</h1>
      <p className="text-lg text-gray-600 mb-8">Bem-vindo(a) ao seu painel!</p>
      <div className="space-y-4">
        <Link href="/config-user" className="block text-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Configurações do Usuário
        </Link>
        <Link href="/change-password" className="block text-center bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
          Alterar Senha
        </Link>
        {/* TODO: Add logout functionality */}
        <button className="block text-center bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Sair
        </button>
      </div>
    </div>
  );
}
