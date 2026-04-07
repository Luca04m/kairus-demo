export type Locale = 'pt-BR' | 'en-US'

const translations: Record<Locale, Record<string, string>> = {
  'pt-BR': {
    'nav.dashboard': 'Dashboard',
    'nav.financeiro': 'Financeiro',
    'nav.marketing': 'Marketing',
    'nav.equipe': 'Equipe',
    'nav.inbox': 'Caixa de entrada',
    'nav.tasks': 'Tarefas',
    'nav.integrations': 'Integracoes',
    'nav.settings': 'Configuracoes',
    'action.save': 'Salvar',
    'action.cancel': 'Cancelar',
    'action.create': 'Criar',
    'action.send': 'Enviar',
    'chat.placeholder': 'Pergunte, construa ou automatize...',
    'chat.greeting': 'Como posso te ajudar hoje?',
  },
  'en-US': {
    'nav.dashboard': 'Dashboard',
    'nav.financeiro': 'Financial',
    'nav.marketing': 'Marketing',
    'nav.equipe': 'Team',
    'nav.inbox': 'Inbox',
    'nav.tasks': 'Tasks',
    'nav.integrations': 'Integrations',
    'nav.settings': 'Settings',
    'action.save': 'Save',
    'action.cancel': 'Cancel',
    'action.create': 'Create',
    'action.send': 'Send',
    'chat.placeholder': 'Ask, build or automate...',
    'chat.greeting': 'How can I help you today?',
  },
}

/** Simple i18n translation function */
export function t(key: string, locale: Locale = 'pt-BR'): string {
  return translations[locale]?.[key] ?? key
}

/** Map settings store idioma string to Locale */
export function resolveLocale(idioma: string): Locale {
  if (idioma === 'English' || idioma === 'en-US') return 'en-US'
  return 'pt-BR'
}
