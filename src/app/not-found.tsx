import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#080808] text-center px-4">
      <h1 className="text-6xl font-bold text-white">404</h1>
      <p className="text-lg text-[rgba(255,255,255,0.6)]">Página não encontrada</p>
      <p className="text-sm text-[rgba(255,255,255,0.4)] max-w-md">A página que você está procurando não existe ou foi movida.</p>
      <Link href="/" className="mt-4 rounded-lg bg-indigo-500 hover:bg-indigo-400 px-6 py-2.5 text-sm font-medium text-white transition-colors">
        Voltar ao início
      </Link>
    </div>
  )
}
