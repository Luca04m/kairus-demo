'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center p-8">
      <div className="text-center space-y-4">
        <div className="text-4xl">⚠️</div>
        <h2 className="text-xl font-semibold text-white">Algo deu errado</h2>
        <p className="text-sm text-white/60 max-w-md">
          Ocorreu um erro inesperado. Tente novamente ou volte para o inicio.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  )
}
