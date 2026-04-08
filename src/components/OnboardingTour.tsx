'use client'
import { useState, useEffect } from 'react'

const STEPS = [
  { title: 'Bem-vindo ao Kairus OS', description: 'Seu painel inteligente para gerenciar tudo em um so lugar.', position: 'center' as const },
  { title: 'Converse com IA', description: 'Use o chat para perguntar, criar agentes ou automatizar tarefas.', position: 'center' as const },
  { title: 'Navegue pelo painel', description: 'Use a sidebar para acessar Dashboard, Financeiro, Marketing e mais.', position: 'left' as const },
  { title: 'Monitore metricas', description: 'Acompanhe vendas, estoque e campanhas em tempo real.', position: 'center' as const },
  { title: 'Pronto para comecar!', description: 'Explore o Kairus OS e descubra o poder da gestao inteligente.', position: 'center' as const },
]

export function OnboardingTour() {
  const [step, setStep] = useState(0)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !localStorage.getItem('kairus-onboarding-done')) {
      setShow(true)
    }
  }, [])

  if (!show) return null

  function next() {
    if (step < STEPS.length - 1) setStep(s => s + 1)
    else complete()
  }

  function complete() {
    localStorage.setItem('kairus-onboarding-done', 'true')
    setShow(false)
  }

  const current = STEPS[step]

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(15,15,20,0.95)] backdrop-blur-xl p-8 shadow-2xl"
        style={{ animation: 'fade-in-up 0.4s ease both' }}
      >
        {/* Step indicator */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[rgba(1,196,97,0.2)] border border-[rgba(1,196,97,0.3)] px-3 py-0.5 text-xs text-[#5eead4] font-medium">
          {step + 1} / {STEPS.length}
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-6 mt-2">
          {STEPS.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-[#01C461]' : i < step ? 'w-1.5 bg-[#01C461]/50' : 'w-1.5 bg-[rgba(255,255,255,0.2)]'
              }`}
            />
          ))}
        </div>

        {/* Icon area */}
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-xl bg-[rgba(1,196,97,0.1)] border border-[rgba(1,196,97,0.2)] flex items-center justify-center">
            {step === 0 && <span className="text-2xl">&#x1F680;</span>}
            {step === 1 && <span className="text-2xl">&#x1F4AC;</span>}
            {step === 2 && <span className="text-2xl">&#x1F5C2;</span>}
            {step === 3 && <span className="text-2xl">&#x1F4CA;</span>}
            {step === 4 && <span className="text-2xl">&#x2705;</span>}
          </div>
        </div>

        <h2 className="text-xl font-bold text-white text-center mb-2">{current.title}</h2>
        <p className="text-sm text-[rgba(255,255,255,0.6)] text-center mb-8 leading-relaxed">{current.description}</p>

        <div className="flex items-center justify-between">
          <button
            onClick={complete}
            className="text-sm text-[rgba(255,255,255,0.4)] hover:text-white transition-colors"
          >
            Pular tour
          </button>
          <button
            onClick={next}
            className="rounded-lg bg-[rgba(255,255,255,0.12)] hover:bg-[rgba(255,255,255,0.18)] border border-[rgba(255,255,255,0.1)] px-6 py-2 text-sm font-medium text-white transition-colors"
          >
            {step < STEPS.length - 1 ? 'Proximo' : 'Iniciar'}
          </button>
        </div>
      </div>
    </div>
  )
}
