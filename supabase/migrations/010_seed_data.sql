-- ============================================================
-- 010_seed_data.sql — Realistic production seed data
-- All text in Portuguese (pt-BR), amounts in BRL
-- ============================================================

-- ============================================================
-- TENANT
-- ============================================================

INSERT INTO tenants (id, name, slug, settings) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Mr. Lion',
  'mrlion',
  '{"plan": "enterprise", "max_agents": 50, "segmento": "E-commerce de Bebidas", "cnpj": "XX.XXX.XXX/0001-XX", "fundacao": "2024"}'::jsonb
);

-- ============================================================
-- DEPARTMENTS (5 departments matching mrlion.ts)
-- ============================================================

INSERT INTO departments (id, tenant_id, name, description, color, icon, emoji, order_index) VALUES
  ('00000000-0000-0000-0000-0000dept0001', '00000000-0000-0000-0000-000000000001', 'Financeiro',   'Controle financeiro, DRE, fluxo de caixa, chargebacks e margens',   '#22c55e', 'DollarSign',  '💰', 1),
  ('00000000-0000-0000-0000-0000dept0002', '00000000-0000-0000-0000-000000000001', 'Marketing',    'Campanhas, trafego, conteudo, Meta Ads, Instagram e analytics',     '#6366f1', 'Megaphone',   '📢', 2),
  ('00000000-0000-0000-0000-0000dept0003', '00000000-0000-0000-0000-000000000001', 'Vendas',       'Vendas B2B e B2C, recompra, pipeline, ticket medio',                '#ec4899', 'ShoppingCart', '🛒', 3),
  ('00000000-0000-0000-0000-0000dept0004', '00000000-0000-0000-0000-000000000001', 'Operacoes',    'Logistica, estoque, entregas, reenvios e auditoria de inventario',  '#f59e0b', 'Settings',    '⚙️', 4),
  ('00000000-0000-0000-0000-0000dept0005', '00000000-0000-0000-0000-000000000001', 'Atendimento',  'Suporte ao cliente, WhatsApp, pos-venda, trocas e devolucoes',      '#06b6d4', 'MessageCircle','💬', 5);

-- ============================================================
-- SQUADS (13 squads, 2-3 per department)
-- ============================================================

INSERT INTO squads (id, tenant_id, department_id, name, description, status) VALUES
  -- Financeiro
  ('00000000-0000-0000-0000-00squad0001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Cobrancas Squad',      'Gestao de cobrancas, inadimplencia e chargebacks',           'ativo'),
  ('00000000-0000-0000-0000-00squad0002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Controladoria Squad',  'DRE, margens, fluxo de caixa e relatorios financeiros',      'ativo'),
  -- Marketing
  ('00000000-0000-0000-0000-00squad0003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Growth Squad',         'Aquisicao, trafego pago, Meta Ads e Google Ads',             'ativo'),
  ('00000000-0000-0000-0000-00squad0004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Conteudo Squad',       'Conteudo Instagram, blog, email marketing e criativos',      'ativo'),
  ('00000000-0000-0000-0000-00squad0005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Analytics Squad',      'Analise de dados, metricas de campanha e atribuicao',        'ativo'),
  -- Vendas
  ('00000000-0000-0000-0000-00squad0006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'SDR Squad',            'Prospeccao, qualificacao de leads e primeiro contato',       'ativo'),
  ('00000000-0000-0000-0000-00squad0007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Closers Squad',        'Negociacao, fechamento e upsell de contas B2B',              'ativo'),
  ('00000000-0000-0000-0000-00squad0008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Pos-Venda Squad',      'Recompra, fidelizacao e reativacao de clientes inativos',    'ativo'),
  -- Operacoes
  ('00000000-0000-0000-0000-00squad0009', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Logistica Squad',      'Entregas, frete, rastreamento e reenvios',                   'ativo'),
  ('00000000-0000-0000-0000-00squad0010', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Processos Squad',      'Estoque, auditoria de inventario e otimizacao de processos', 'ativo'),
  -- Atendimento
  ('00000000-0000-0000-0000-00squad0011', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0005', 'Suporte N1 Squad',     'Atendimento automatizado, FAQ e respostas padrao',           'ativo'),
  ('00000000-0000-0000-0000-00squad0012', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0005', 'Suporte N2 Squad',     'Atendimento especializado, reclamacoes e escalacoes',        'ativo'),
  ('00000000-0000-0000-0000-00squad0013', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0005', 'Triagem Squad',        'Classificacao de tickets, roteamento e prioridade',          'ativo');

-- ============================================================
-- AGENTS (30 agents across 5 departments)
-- First 5 match mrlion.ts AGENTES (Leo, Mia, Rex, Sol, Iris)
-- Remaining 25 fill squads realistically
-- ============================================================

INSERT INTO agents (id, tenant_id, squad_id, department_id, name, initials, type, status, description, skills, performance_metrics, last_action, last_action_at) VALUES
  -- === FINANCEIRO (6 agents) ===
  ('00000000-0000-0000-0000-000agent0001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0002', '00000000-0000-0000-0000-0000dept0001',
   'Leo', 'LE', 'ai', 'ativo',
   'Monitora DRE, alertas de margem, fluxo de caixa e chargebacks',
   ARRAY['dre', 'margem', 'fluxo-caixa', 'chargeback', 'relatorios'],
   '{"tasks_completed": 47, "tasks_failed": 2, "approval_rate": 96}'::jsonb,
   'Detectou margem negativa no Honey Pingente', NOW() - INTERVAL '2 hours'),

  ('00000000-0000-0000-0000-000agent0002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0001', '00000000-0000-0000-0000-0000dept0001',
   'Nilo', 'NI', 'ai', 'ativo',
   'Gestao de cobrancas, inadimplencia e conciliacao bancaria',
   ARRAY['cobranca', 'inadimplencia', 'conciliacao', 'pix', 'boletos'],
   '{"tasks_completed": 38, "tasks_failed": 1, "approval_rate": 97}'::jsonb,
   'Conciliou 340 transacoes PIX do dia', NOW() - INTERVAL '4 hours'),

  ('00000000-0000-0000-0000-000agent0003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0002', '00000000-0000-0000-0000-0000dept0001',
   'Dina', 'DI', 'ai', 'ativo',
   'Projecoes financeiras, orcamento e planejamento tributario',
   ARRAY['projecao', 'orcamento', 'tributario', 'forecast', 'cenarios'],
   '{"tasks_completed": 29, "tasks_failed": 3, "approval_rate": 91}'::jsonb,
   'Gerou projecao de fluxo de caixa para Abril/2026', NOW() - INTERVAL '6 hours'),

  ('00000000-0000-0000-0000-000agent0004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0001', '00000000-0000-0000-0000-0000dept0001',
   'Cleo', 'CL', 'ai', 'idle',
   'Auditoria de notas fiscais e compliance fiscal',
   ARRAY['nfe', 'compliance', 'auditoria-fiscal', 'sped'],
   '{"tasks_completed": 22, "tasks_failed": 0, "approval_rate": 100}'::jsonb,
   'Validou 85 notas fiscais de Marco/2026', NOW() - INTERVAL '1 day'),

  ('00000000-0000-0000-0000-000agent0005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0002', '00000000-0000-0000-0000-0000dept0001',
   'Rafa', 'RA', 'ai', 'ativo',
   'Analise de custos, CMV e precificacao de produtos',
   ARRAY['cmv', 'precificacao', 'custos', 'markup', 'breakeven'],
   '{"tasks_completed": 34, "tasks_failed": 2, "approval_rate": 94}'::jsonb,
   'Recalculou markup de 8 SKUs apos reajuste de fornecedor', NOW() - INTERVAL '3 hours'),

  ('00000000-0000-0000-0000-000agent0006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0001', '00000000-0000-0000-0000-0000dept0001',
   'Vito', 'VI', 'ai', 'pausado',
   'Controle de contas a pagar e a receber',
   ARRAY['contas-pagar', 'contas-receber', 'vencimentos', 'aging'],
   '{"tasks_completed": 18, "tasks_failed": 1, "approval_rate": 95}'::jsonb,
   'Agendou 12 pagamentos para fornecedores', NOW() - INTERVAL '2 days'),

  -- === MARKETING (6 agents) ===
  ('00000000-0000-0000-0000-000agent0007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0003', '00000000-0000-0000-0000-0000dept0002',
   'Mia', 'MI', 'ai', 'ativo',
   'Gerencia campanhas Meta Ads, conteudo Instagram, ROAS',
   ARRAY['meta-ads', 'instagram', 'roas', 'criativos', 'segmentacao'],
   '{"tasks_completed": 83, "tasks_failed": 5, "approval_rate": 94}'::jsonb,
   'Otimizou campanha Verao 2026 — CPC reduzido 18%', NOW() - INTERVAL '45 minutes'),

  ('00000000-0000-0000-0000-000agent0008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0004', '00000000-0000-0000-0000-0000dept0002',
   'Zara', 'ZA', 'ai', 'ativo',
   'Producao de conteudo, copywriting e calendario editorial',
   ARRAY['copywriting', 'conteudo', 'calendario-editorial', 'storytelling'],
   '{"tasks_completed": 64, "tasks_failed": 4, "approval_rate": 94}'::jsonb,
   'Publicou 3 posts Instagram — alcance 12.400', NOW() - INTERVAL '8 hours'),

  ('00000000-0000-0000-0000-000agent0009', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0005', '00000000-0000-0000-0000-0000dept0002',
   'Davi', 'DA', 'ai', 'ativo',
   'Analise de dados de trafego, GA4, atribuicao e funil',
   ARRAY['ga4', 'atribuicao', 'funil', 'cohort', 'utm'],
   '{"tasks_completed": 41, "tasks_failed": 2, "approval_rate": 95}'::jsonb,
   'Gerou relatorio de funil de conversao Marco/2026', NOW() - INTERVAL '5 hours'),

  ('00000000-0000-0000-0000-000agent0010', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0003', '00000000-0000-0000-0000-0000dept0002',
   'Luna', 'LU', 'ai', 'ativo',
   'Gestao de Google Ads, Shopping e Performance Max',
   ARRAY['google-ads', 'shopping', 'pmax', 'keywords', 'lances'],
   '{"tasks_completed": 37, "tasks_failed": 3, "approval_rate": 93}'::jsonb,
   'Pausou 4 keywords com CPA acima do limite', NOW() - INTERVAL '2 hours'),

  ('00000000-0000-0000-0000-000agent0011', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0004', '00000000-0000-0000-0000-0000dept0002',
   'Teo', 'TE', 'ai', 'idle',
   'Email marketing, automacao de fluxos e segmentacao de base',
   ARRAY['email-marketing', 'automacao', 'segmentacao', 'nurturing'],
   '{"tasks_completed": 28, "tasks_failed": 1, "approval_rate": 97}'::jsonb,
   'Enviou campanha de reengajamento para 1.200 leads', NOW() - INTERVAL '1 day'),

  ('00000000-0000-0000-0000-000agent0012', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0005', '00000000-0000-0000-0000-0000dept0002',
   'Nina', 'NA', 'ai', 'ativo',
   'Monitoramento de concorrencia e tendencias de mercado',
   ARRAY['concorrencia', 'tendencias', 'benchmark', 'share-of-voice'],
   '{"tasks_completed": 19, "tasks_failed": 0, "approval_rate": 100}'::jsonb,
   'Identificou nova campanha de concorrente no segmento honey', NOW() - INTERVAL '7 hours'),

  -- === VENDAS (6 agents) ===
  ('00000000-0000-0000-0000-000agent0013', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0007', '00000000-0000-0000-0000-0000dept0003',
   'Rex', 'RE', 'ai', 'ativo',
   'Acompanha vendas B2B, reorder alerts, ticket medio',
   ARRAY['b2b', 'recompra', 'ticket-medio', 'pipeline', 'upsell'],
   '{"tasks_completed": 61, "tasks_failed": 3, "approval_rate": 95}'::jsonb,
   'Enviou lembrete de recompra para 12 clientes B2B', NOW() - INTERVAL '1 hour'),

  ('00000000-0000-0000-0000-000agent0014', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0006', '00000000-0000-0000-0000-0000dept0003',
   'Bia', 'BI', 'ai', 'ativo',
   'Prospeccao outbound B2B, qualificacao e primeiro contato',
   ARRAY['outbound', 'prospeccao', 'qualificacao', 'cold-outreach'],
   '{"tasks_completed": 52, "tasks_failed": 4, "approval_rate": 93}'::jsonb,
   'Qualificou 8 novos leads B2B do segmento restaurantes', NOW() - INTERVAL '3 hours'),

  ('00000000-0000-0000-0000-000agent0015', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0006', '00000000-0000-0000-0000-0000dept0003',
   'Hugo', 'HU', 'ai', 'ativo',
   'SDR automatizado, triagem de leads inbound e scoring',
   ARRAY['sdr', 'lead-scoring', 'inbound', 'triagem', 'mql'],
   '{"tasks_completed": 44, "tasks_failed": 2, "approval_rate": 96}'::jsonb,
   'Classificou 15 leads inbound — 6 MQLs identificados', NOW() - INTERVAL '4 hours'),

  ('00000000-0000-0000-0000-000agent0016', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0007', '00000000-0000-0000-0000-0000dept0003',
   'Gael', 'GA', 'ai', 'idle',
   'Negociacao B2B, proposta comercial e fechamento',
   ARRAY['negociacao', 'proposta', 'fechamento', 'desconto', 'contrato'],
   '{"tasks_completed": 31, "tasks_failed": 2, "approval_rate": 94}'::jsonb,
   'Gerou proposta comercial para rede Sabor & Cia', NOW() - INTERVAL '6 hours'),

  ('00000000-0000-0000-0000-000agent0017', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0008', '00000000-0000-0000-0000-0000dept0003',
   'Fabi', 'FA', 'ai', 'ativo',
   'Pos-venda, pesquisa de satisfacao e programa de fidelidade',
   ARRAY['pos-venda', 'nps', 'fidelidade', 'reativacao', 'churn'],
   '{"tasks_completed": 39, "tasks_failed": 1, "approval_rate": 97}'::jsonb,
   'Enviou pesquisa NPS para 45 clientes de Marco/2026', NOW() - INTERVAL '2 hours'),

  ('00000000-0000-0000-0000-000agent0018', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0008', '00000000-0000-0000-0000-0000dept0003',
   'Caio', 'CA', 'ai', 'ativo',
   'Recuperacao de carrinho abandonado e remarketing',
   ARRAY['carrinho-abandonado', 'remarketing', 'whatsapp', 'sms', 'recuperacao'],
   '{"tasks_completed": 56, "tasks_failed": 3, "approval_rate": 95}'::jsonb,
   'Recuperou 7 carrinhos abandonados — R$ 1.540 em vendas', NOW() - INTERVAL '90 minutes'),

  -- === OPERACOES (6 agents) ===
  ('00000000-0000-0000-0000-000agent0019', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0010', '00000000-0000-0000-0000-0000dept0004',
   'Sol', 'SO', 'ai', 'ativo',
   'Logistica, controle de estoque, entregas, reenvios',
   ARRAY['estoque', 'logistica', 'entregas', 'reenvios', 'inventario'],
   '{"tasks_completed": 52, "tasks_failed": 1, "approval_rate": 98}'::jsonb,
   'Alerta: estoque Honey Garrafa abaixo de 50 un.', NOW() - INTERVAL '3 hours'),

  ('00000000-0000-0000-0000-000agent0020', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0009', '00000000-0000-0000-0000-0000dept0004',
   'Enzo', 'EN', 'ai', 'ativo',
   'Rastreamento de entregas, SLA de transportadoras e ocorrencias',
   ARRAY['rastreamento', 'sla', 'transportadora', 'ocorrencia', 'prazo'],
   '{"tasks_completed": 67, "tasks_failed": 2, "approval_rate": 97}'::jsonb,
   'Identificou 3 entregas atrasadas na transportadora Loggi', NOW() - INTERVAL '1 hour'),

  ('00000000-0000-0000-0000-000agent0021', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0009', '00000000-0000-0000-0000-0000dept0004',
   'Maya', 'MA', 'ai', 'ativo',
   'Gestao de frete, cotacao e otimizacao de rotas',
   ARRAY['frete', 'cotacao', 'rotas', 'melhor-envio', 'transportadora'],
   '{"tasks_completed": 43, "tasks_failed": 2, "approval_rate": 95}'::jsonb,
   'Renegociou tabela de frete com Correios — economia de 8%', NOW() - INTERVAL '5 hours'),

  ('00000000-0000-0000-0000-000agent0022', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0010', '00000000-0000-0000-0000-0000dept0004',
   'Kiko', 'KI', 'ai', 'idle',
   'Compras, relacionamento com fornecedores e reposicao',
   ARRAY['compras', 'fornecedores', 'reposicao', 'lead-time', 'pedido-compra'],
   '{"tasks_completed": 25, "tasks_failed": 1, "approval_rate": 96}'::jsonb,
   'Emitiu pedido de compra para fornecedor de embalagens', NOW() - INTERVAL '1 day'),

  ('00000000-0000-0000-0000-000agent0023', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0010', '00000000-0000-0000-0000-0000dept0004',
   'Lina', 'LI', 'ai', 'ativo',
   'Qualidade de produto, shelf life e conformidade',
   ARRAY['qualidade', 'shelf-life', 'anvisa', 'lote', 'validade'],
   '{"tasks_completed": 21, "tasks_failed": 0, "approval_rate": 100}'::jsonb,
   'Verificou validade de 4 lotes proximos ao vencimento', NOW() - INTERVAL '8 hours'),

  ('00000000-0000-0000-0000-000agent0024', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0009', '00000000-0000-0000-0000-0000dept0004',
   'Dudu', 'DU', 'ai', 'pausado',
   'Devolucoes, logistica reversa e controle de avarias',
   ARRAY['devolucao', 'logistica-reversa', 'avaria', 'nf-devolucao'],
   '{"tasks_completed": 33, "tasks_failed": 2, "approval_rate": 94}'::jsonb,
   'Processou 5 devolucoes de Marco/2026', NOW() - INTERVAL '2 days'),

  -- === ATENDIMENTO (6 agents) ===
  ('00000000-0000-0000-0000-000agent0025', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0011', '00000000-0000-0000-0000-0000dept0005',
   'Iris', 'IR', 'ai', 'pausado',
   'WhatsApp automatico, pos-venda, trocas e devolucoes',
   ARRAY['whatsapp', 'pos-venda', 'trocas', 'devolucoes', 'faq'],
   '{"tasks_completed": 156, "tasks_failed": 8, "approval_rate": 95}'::jsonb,
   'Respondeu 23 mensagens WhatsApp automaticamente', NOW() - INTERVAL '30 minutes'),

  ('00000000-0000-0000-0000-000agent0026', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0012', '00000000-0000-0000-0000-0000dept0005',
   'Yara', 'YA', 'ai', 'ativo',
   'Suporte especializado, reclamacoes complexas e Reclame Aqui',
   ARRAY['reclamacao', 'reclame-aqui', 'escalacao', 'compensacao'],
   '{"tasks_completed": 48, "tasks_failed": 3, "approval_rate": 94}'::jsonb,
   'Resolveu reclamacao no Reclame Aqui com nota 9/10', NOW() - INTERVAL '4 hours'),

  ('00000000-0000-0000-0000-000agent0027', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0013', '00000000-0000-0000-0000-0000dept0005',
   'Tina', 'TI', 'ai', 'ativo',
   'Triagem de tickets, classificacao e roteamento inteligente',
   ARRAY['triagem', 'classificacao', 'roteamento', 'prioridade', 'sla'],
   '{"tasks_completed": 89, "tasks_failed": 4, "approval_rate": 96}'::jsonb,
   'Classificou 34 tickets — 12 urgentes roteados para N2', NOW() - INTERVAL '1 hour'),

  ('00000000-0000-0000-0000-000agent0028', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0011', '00000000-0000-0000-0000-0000dept0005',
   'Rui', 'RU', 'ai', 'ativo',
   'Chat do site, FAQ inteligente e base de conhecimento',
   ARRAY['chat', 'faq', 'base-conhecimento', 'self-service'],
   '{"tasks_completed": 72, "tasks_failed": 3, "approval_rate": 96}'::jsonb,
   'Atualizou 8 artigos da base de conhecimento', NOW() - INTERVAL '6 hours'),

  ('00000000-0000-0000-0000-000agent0029', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0012', '00000000-0000-0000-0000-0000dept0005',
   'Jaci', 'JA', 'ai', 'ativo',
   'Atendimento por email, respostas padrao e follow-up',
   ARRAY['email', 'follow-up', 'template', 'resposta-padrao'],
   '{"tasks_completed": 45, "tasks_failed": 2, "approval_rate": 96}'::jsonb,
   'Respondeu 18 emails de suporte — tempo medio 12min', NOW() - INTERVAL '3 hours'),

  ('00000000-0000-0000-0000-000agent0030', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00squad0013', '00000000-0000-0000-0000-0000dept0005',
   'Nico', 'NC', 'ai', 'idle',
   'Pesquisa de satisfacao, NPS e analise de sentimento',
   ARRAY['nps', 'satisfacao', 'sentimento', 'csat', 'feedback'],
   '{"tasks_completed": 27, "tasks_failed": 1, "approval_rate": 96}'::jsonb,
   'Calculou NPS de Marco/2026: score 62 (zona de qualidade)', NOW() - INTERVAL '1 day');

-- ============================================================
-- ALERTS (22 alerts: mix of active/resolved, all severities)
-- ============================================================

INSERT INTO alerts (id, tenant_id, agent_id, department, severity, title, message, status, metadata, created_at, resolved_at) VALUES
  -- Criticos
  ('00000000-0000-0000-0000-000alert0001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0019', 'Operacoes',    'critico', 'Estoque Honey Garrafa abaixo de 50 unidades',
   'Restam apenas 47 unidades do Mr. Lion Honey Garrafa 375ml. Com a taxa de venda atual, o produto esgota em 3 dias.', 'ativo', '{"sku": "HONEY-GAR-375", "qtd_atual": 47, "dias_estimados": 3}'::jsonb, NOW() - INTERVAL '3 hours', NULL),

  ('00000000-0000-0000-0000-000alert0002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0001', 'Financeiro',   'critico', 'Taxa de chargeback Fev/2026: 7,9% — acima do limite',
   '18 contestacoes totalizando R$ 6.132. Taxa 4x acima do aceitavel (2%). Padrao suspeito de CEP identificado.', 'reconhecido', '{"mes": "2026-02", "total": 6132, "taxa": 7.9}'::jsonb, NOW() - INTERVAL '1 day', NULL),

  -- Altos
  ('00000000-0000-0000-0000-000alert0003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0001', 'Financeiro',   'alto', 'Prejuizo detectado em Fev/2026: R$ -2.329',
   'Receita R$ 54.412 contra custos totais de R$ 56.741. Chargebacks e custo de marketing foram os principais viloes.', 'ativo', '{"mes": "2026-02", "prejuizo": -2329}'::jsonb, NOW() - INTERVAL '1 day', NULL),

  ('00000000-0000-0000-0000-000alert0004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0001', 'Financeiro',   'alto', 'Margem bruta do Honey Pingente negativa',
   'Preco R$ 89,90 — CMV R$ 52,00 + frete medio R$ 38,00 = prejuizo de R$ 0,10 por unidade.', 'ativo', '{"sku": "HONEY-PING", "preco": 89.90, "cmv": 52.00, "frete_medio": 38.00}'::jsonb, NOW() - INTERVAL '2 hours', NULL),

  ('00000000-0000-0000-0000-000alert0005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0020', 'Operacoes',    'alto', '3 entregas atrasadas na transportadora Loggi',
   'Pedidos #4521, #4528 e #4533 estao com SLA estourado. Prazo era 5 dias uteis, ja se passaram 7.', 'ativo', '{"transportadora": "Loggi", "pedidos": ["4521", "4528", "4533"]}'::jsonb, NOW() - INTERVAL '1 hour', NULL),

  ('00000000-0000-0000-0000-000alert0006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0013', 'Vendas',       'alto', 'Receita Mar/26 -38% vs Fev/26',
   'Queda significativa de faturamento: R$ 33.756 contra R$ 54.412 do mes anterior.', 'ativo', '{"mes_atual": 33756, "mes_anterior": 54412, "variacao": -38}'::jsonb, NOW() - INTERVAL '12 hours', NULL),

  -- Medios
  ('00000000-0000-0000-0000-000alert0007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0007', 'Marketing',    'medio', 'CTR Meta Ads caiu de 4,59% para 1,64%',
   'Queda de 64% no CTR entre Set/25 e Mar/26. Possivel saturacao de audiencia ou criativos desatualizados.', 'ativo', '{"ctr_set25": 4.59, "ctr_mar26": 1.64, "queda_pct": 64}'::jsonb, NOW() - INTERVAL '6 hours', NULL),

  ('00000000-0000-0000-0000-000alert0008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0013', 'Vendas',       'medio', 'Ticket medio caiu 7,5% (R$ 235 para R$ 217)',
   'Tendencia de queda no valor medio dos pedidos nos ultimos 2 meses.', 'ativo', '{"ticket_fev": 235, "ticket_mar": 217.78, "variacao": -7.5}'::jsonb, NOW() - INTERVAL '8 hours', NULL),

  ('00000000-0000-0000-0000-000alert0009', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0023', 'Operacoes',    'medio', '4 lotes proximos ao vencimento (< 30 dias)',
   'Lotes de Capuccino Garrafa e Black Honey precisam de acao comercial para acelerar giro.', 'reconhecido', '{"lotes": 4, "produtos": ["Capuccino Garrafa", "Black Honey"]}'::jsonb, NOW() - INTERVAL '8 hours', NULL),

  ('00000000-0000-0000-0000-000alert0010', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0026', 'Atendimento',  'medio', '3 reclamacoes abertas no Reclame Aqui sem resposta',
   'Tempo medio de resposta atual: 48h. Meta: 24h. Risco de queda de reputacao.', 'ativo', '{"qtd": 3, "tempo_medio_h": 48, "meta_h": 24}'::jsonb, NOW() - INTERVAL '4 hours', NULL),

  ('00000000-0000-0000-0000-000alert0011', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0010', 'Marketing',    'medio', 'Credenciais Google Ads expiradas',
   'Integracao com Google Ads esta inativa desde 28/03. Dados nao estao sendo importados.', 'ativo', '{"provider": "google-ads", "desde": "2026-03-28"}'::jsonb, NOW() - INTERVAL '5 days', NULL),

  -- Baixos
  ('00000000-0000-0000-0000-000alert0012', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0007', 'Marketing',    'baixo', 'CPC Meta Ads subiu de R$ 0,15 para R$ 0,32',
   'Aumento gradual no custo por clique ao longo de 6 meses. Sugestao: renovar criativos e testar novas audiencias.', 'ativo', '{"cpc_set25": 0.15, "cpc_mar26": 0.32}'::jsonb, NOW() - INTERVAL '1 day', NULL),

  ('00000000-0000-0000-0000-000alert0013', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0011', 'Marketing',    'baixo', 'Taxa de abertura de emails caiu para 18%',
   'Media do setor: 22%. Recomendo limpeza de base e testes A/B de assunto.', 'ativo', '{"taxa_abertura": 18, "benchmark": 22}'::jsonb, NOW() - INTERVAL '2 days', NULL),

  ('00000000-0000-0000-0000-000alert0014', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0017', 'Vendas',       'baixo', '5 clientes B2B sem compra ha mais de 60 dias',
   'Risco de churn em contas com historico de recompra mensal.', 'ativo', '{"clientes_inativos": 5, "dias": 60}'::jsonb, NOW() - INTERVAL '1 day', NULL),

  -- Info
  ('00000000-0000-0000-0000-000alert0015', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0001', 'Financeiro',   'info', 'Relatorio semanal Semana 13 pronto para revisao',
   'Disponivel na aba Relatorios. Receita R$ 8.200, 2 chargebacks registrados.', 'ativo', '{"relatorio_id": "rel-001"}'::jsonb, NOW() - INTERVAL '5 hours', NULL),

  ('00000000-0000-0000-0000-000alert0016', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0019', 'Operacoes',    'info', 'Auditoria de estoque Marco/2026 concluida',
   '12 SKUs ativos. 3 produtos com giro lento (> 45 dias sem venda).', 'resolvido', '{"skus_ativos": 12, "giro_lento": 3}'::jsonb, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),

  ('00000000-0000-0000-0000-000alert0017', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0025', 'Atendimento',  'info', 'Pico de atendimento processado: 23 mensagens em 2h',
   '20 resolvidas automaticamente, 3 escaladas para atendimento humano.', 'resolvido', '{"total": 23, "automaticas": 20, "escaladas": 3}'::jsonb, NOW() - INTERVAL '30 minutes', NOW() - INTERVAL '20 minutes'),

  -- Resolvidos historicos
  ('00000000-0000-0000-0000-000alert0018', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0019', 'Operacoes',    'critico', 'Estoque zerado: Mr. Lion Honey Completo',
   'Produto esgotou em 15/02. Reposicao recebida em 18/02.', 'resolvido', '{"sku": "HONEY-COMP"}'::jsonb, NOW() - INTERVAL '45 days', NOW() - INTERVAL '42 days'),

  ('00000000-0000-0000-0000-000alert0019', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0001', 'Financeiro',   'alto', 'Divergencia na conciliacao bancaria de Janeiro/2026',
   'R$ 3.200 em transacoes nao conciliadas. Resolvido apos ajuste manual.', 'resolvido', '{"valor": 3200}'::jsonb, NOW() - INTERVAL '60 days', NOW() - INTERVAL '58 days'),

  ('00000000-0000-0000-0000-000alert0020', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0020', 'Operacoes',    'medio', 'Transportadora Jadlog com SLA abaixo de 90%',
   'Performance da transportadora ficou em 84% no periodo. Renegociado contrato.', 'resolvido', '{"transportadora": "Jadlog", "sla": 84}'::jsonb, NOW() - INTERVAL '30 days', NOW() - INTERVAL '25 days'),

  ('00000000-0000-0000-0000-000alert0021', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0007', 'Marketing',    'alto', 'Campanha Black Friday com ROAS < 1',
   'ROAS da campanha principal caiu para 0,7x. Campanha pausada e reestruturada.', 'resolvido', '{"campanha": "Black Friday 2025", "roas": 0.7}'::jsonb, NOW() - INTERVAL '120 days', NOW() - INTERVAL '118 days'),

  ('00000000-0000-0000-0000-000alert0022', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0027', 'Atendimento',  'medio', 'Fila de atendimento acima de 15 minutos',
   'Tempo medio de espera subiu para 18min durante Black Friday. Normalizado em 48h.', 'resolvido', '{"tempo_espera_min": 18}'::jsonb, NOW() - INTERVAL '125 days', NOW() - INTERVAL '123 days');

-- ============================================================
-- APPROVALS (15 approvals: mix of pending/approved/rejected)
-- ============================================================

INSERT INTO approvals (id, tenant_id, requester_id, type, title, description, status, amount, urgency, metadata, created_at, resolved_at) VALUES
  -- Pendentes
  ('00000000-0000-0000-0000-000approv001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0007', 'marketing',
   'Aumento de budget campanha Honey Premium',
   'Campanha com ROAS 3,2x nas ultimas 48h. Proposta: aumentar orcamento diario de R$ 180 para R$ 320.',
   'pendente', 4480.00, 'media', '{"campanha": "Honey Premium", "roas_atual": 3.2}'::jsonb, NOW() - INTERVAL '45 minutes', NULL),

  ('00000000-0000-0000-0000-000approv002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0019', 'operacional',
   'Pedido de compra urgente: Honey Garrafa 375ml',
   'Estoque critico (47 un.). Solicito autorizacao para pedido de 500 unidades ao fornecedor.',
   'pendente', 12500.00, 'critica', '{"sku": "HONEY-GAR-375", "qtd": 500}'::jsonb, NOW() - INTERVAL '3 hours', NULL),

  ('00000000-0000-0000-0000-000approv003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0005', 'financeiro',
   'Reajuste de preco: Honey Pingente',
   'Margem negativa detectada. Proposta: aumentar de R$ 89,90 para R$ 99,90 (margem positiva de R$ 9,80/un).',
   'pendente', NULL, 'alta', '{"preco_atual": 89.90, "preco_proposto": 99.90}'::jsonb, NOW() - INTERVAL '2 hours', NULL),

  ('00000000-0000-0000-0000-000approv004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0018', 'campanha',
   'Campanha de recuperacao de carrinho via WhatsApp',
   'Automatizar envio de mensagem para carrinhos abandonados ha mais de 2h. Custo estimado: R$ 0,08/mensagem.',
   'pendente', 240.00, 'media', '{"canal": "whatsapp", "estimativa_msgs": 3000}'::jsonb, NOW() - INTERVAL '4 hours', NULL),

  ('00000000-0000-0000-0000-000approv005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0013', 'financeiro',
   'Desconto de 12% para conta B2B Sabor & Cia',
   'Cliente com historico de 18 pedidos. Pediu desconto de volume para contrato trimestral. Valor estimado: R$ 24.000/trimestre.',
   'pendente', 2880.00, 'media', '{"cliente": "Sabor & Cia", "desconto_pct": 12}'::jsonb, NOW() - INTERVAL '6 hours', NULL),

  -- Aprovados
  ('00000000-0000-0000-0000-000approv006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0007', 'marketing',
   'Renovacao de criativos Meta Ads — Abril 2026',
   'Producao de 8 novos criativos (4 video + 4 imagem) para campanhas de abril.',
   'aprovado', 3200.00, 'media', '{"criativos": 8, "videos": 4, "imagens": 4}'::jsonb, NOW() - INTERVAL '3 days', NOW() - INTERVAL '2 days'),

  ('00000000-0000-0000-0000-000approv007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0019', 'operacional',
   'Contratacao de transportadora adicional (Total Express)',
   'Para cobrir regiao Norte/Nordeste com melhor SLA. Custo: R$ 1.800/mes fixo + variavel.',
   'aprovado', 1800.00, 'alta', '{"transportadora": "Total Express"}'::jsonb, NOW() - INTERVAL '10 days', NOW() - INTERVAL '8 days'),

  ('00000000-0000-0000-0000-000approv008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0001', 'financeiro',
   'Ferramenta anti-fraude para chargebacks',
   'Integracao com ClearSale para prevencao de fraude. Custo: R$ 0,45/transacao.',
   'aprovado', 2700.00, 'critica', '{"provider": "ClearSale", "custo_por_transacao": 0.45}'::jsonb, NOW() - INTERVAL '20 days', NOW() - INTERVAL '18 days'),

  ('00000000-0000-0000-0000-000approv009', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0025', 'integracao',
   'Integracao WhatsApp Business API via Z-API',
   'Migrar do WhatsApp Web para API oficial. Custo mensal: R$ 297.',
   'aprovado', 297.00, 'alta', '{"provider": "Z-API", "tipo": "whatsapp-business"}'::jsonb, NOW() - INTERVAL '45 days', NOW() - INTERVAL '43 days'),

  ('00000000-0000-0000-0000-000approv010', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0005', 'financeiro',
   'Reajuste de preco: Capuccino Completo',
   'Aumento de R$ 113,16 para R$ 119,90 para manter margem acima de 40%.',
   'aprovado', NULL, 'media', '{"preco_anterior": 113.16, "preco_novo": 119.90}'::jsonb, NOW() - INTERVAL '15 days', NOW() - INTERVAL '14 days'),

  -- Rejeitados
  ('00000000-0000-0000-0000-000approv011', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0007', 'marketing',
   'Contratacao de influenciador para TikTok',
   'Parceria com @saboresdobrasil para 4 posts. Custo: R$ 8.000.',
   'rejeitado', 8000.00, 'baixa', '{"influenciador": "@saboresdobrasil", "plataforma": "tiktok"}'::jsonb, NOW() - INTERVAL '25 days', NOW() - INTERVAL '24 days'),

  ('00000000-0000-0000-0000-000approv012', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0013', 'financeiro',
   'Desconto de 20% para cliente Bar do Ze',
   'Desconto acima do limite permitido (max 15%). Sugerido renegociar para 15%.',
   'rejeitado', 1600.00, 'media', '{"cliente": "Bar do Ze", "desconto_pct": 20, "motivo_rejeicao": "acima_limite"}'::jsonb, NOW() - INTERVAL '12 days', NOW() - INTERVAL '11 days'),

  ('00000000-0000-0000-0000-000approv013', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0019', 'operacional',
   'Troca de embalagem para caixa premium',
   'Custo adicional de R$ 2,50/unidade sem evidencia de impacto em vendas.',
   'rejeitado', 7500.00, 'baixa', '{"custo_adicional_un": 2.50, "motivo_rejeicao": "sem_roi_comprovado"}'::jsonb, NOW() - INTERVAL '30 days', NOW() - INTERVAL '28 days'),

  -- Expirado e Cancelado
  ('00000000-0000-0000-0000-000approv014', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0010', 'integracao',
   'Integracao com Google Ads API',
   'Credenciais fornecidas expiraram antes da aprovacao.',
   'expirado', NULL, 'media', '{"provider": "google-ads"}'::jsonb, NOW() - INTERVAL '7 days', NULL),

  ('00000000-0000-0000-0000-000approv015', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0014', 'campanha',
   'Campanha de prospecao fria via LinkedIn',
   'Cancelada pois foco mudou para canais de maior ROI.',
   'cancelado', 1500.00, 'baixa', '{"canal": "linkedin", "motivo_cancelamento": "repriorizado"}'::jsonb, NOW() - INTERVAL '20 days', NOW() - INTERVAL '15 days');

-- ============================================================
-- FINANCIAL RECORDS (55 records across departments and periods)
-- ============================================================

INSERT INTO financial_records (id, tenant_id, department_id, category, subcategory, description, amount, type, period, reference_date) VALUES
  -- === RECEITAS MENSAIS (12 meses matching VENDAS_MENSAIS) ===
  ('00000000-0000-0000-0000-000finan0001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Vendas', 'E-commerce', 'Receita bruta Abr/2025',  59680.00, 'receita', '2025-04', '2025-04-30'),
  ('00000000-0000-0000-0000-000finan0002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Vendas', 'E-commerce', 'Receita bruta Mai/2025',  78440.00, 'receita', '2025-05', '2025-05-31'),
  ('00000000-0000-0000-0000-000finan0003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Vendas', 'E-commerce', 'Receita bruta Jun/2025', 149426.00, 'receita', '2025-06', '2025-06-30'),
  ('00000000-0000-0000-0000-000finan0004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Vendas', 'E-commerce', 'Receita bruta Jul/2025',  91620.00, 'receita', '2025-07', '2025-07-31'),
  ('00000000-0000-0000-0000-000finan0005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Vendas', 'E-commerce', 'Receita bruta Ago/2025',  93360.00, 'receita', '2025-08', '2025-08-31'),
  ('00000000-0000-0000-0000-000finan0006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Vendas', 'E-commerce', 'Receita bruta Set/2025',  57254.00, 'receita', '2025-09', '2025-09-30'),
  ('00000000-0000-0000-0000-000finan0007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Vendas', 'E-commerce', 'Receita bruta Out/2025',  56566.00, 'receita', '2025-10', '2025-10-31'),
  ('00000000-0000-0000-0000-000finan0008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Vendas', 'E-commerce', 'Receita bruta Nov/2025', 491372.00, 'receita', '2025-11', '2025-11-30'),
  ('00000000-0000-0000-0000-000finan0009', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Vendas', 'E-commerce', 'Receita bruta Dez/2025', 199412.00, 'receita', '2025-12', '2025-12-31'),
  ('00000000-0000-0000-0000-000finan0010', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Vendas', 'E-commerce', 'Receita bruta Jan/2026',  67068.00, 'receita', '2026-01', '2026-01-31'),
  ('00000000-0000-0000-0000-000finan0011', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Vendas', 'E-commerce', 'Receita bruta Fev/2026',  54412.00, 'receita', '2026-02', '2026-02-28'),
  ('00000000-0000-0000-0000-000finan0012', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Vendas', 'E-commerce', 'Receita bruta Mar/2026',  33756.00, 'receita', '2026-03', '2026-03-31'),

  -- === CMV (custo) — ultimos 6 meses ===
  ('00000000-0000-0000-0000-000finan0013', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'CMV', 'Producao', 'CMV Out/2025',  25800.00, 'custo', '2025-10', '2025-10-31'),
  ('00000000-0000-0000-0000-000finan0014', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'CMV', 'Producao', 'CMV Nov/2025', 221100.00, 'custo', '2025-11', '2025-11-30'),
  ('00000000-0000-0000-0000-000finan0015', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'CMV', 'Producao', 'CMV Dez/2025',  89700.00, 'custo', '2025-12', '2025-12-31'),
  ('00000000-0000-0000-0000-000finan0016', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'CMV', 'Producao', 'CMV Jan/2026',  35800.00, 'custo', '2026-01', '2026-01-31'),
  ('00000000-0000-0000-0000-000finan0017', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'CMV', 'Producao', 'CMV Fev/2026',  24650.00, 'custo', '2026-02', '2026-02-28'),
  ('00000000-0000-0000-0000-000finan0018', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'CMV', 'Producao', 'CMV Mar/2026',  16800.00, 'custo', '2026-03', '2026-03-31'),

  -- === FRETE (despesa) — ultimos 6 meses ===
  ('00000000-0000-0000-0000-000finan0019', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Frete', 'Logistica', 'Frete total Out/2025',  4200.00, 'despesa', '2025-10', '2025-10-31'),
  ('00000000-0000-0000-0000-000finan0020', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Frete', 'Logistica', 'Frete total Nov/2025', 38200.00, 'despesa', '2025-11', '2025-11-30'),
  ('00000000-0000-0000-0000-000finan0021', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Frete', 'Logistica', 'Frete total Dez/2025', 15800.00, 'despesa', '2025-12', '2025-12-31'),
  ('00000000-0000-0000-0000-000finan0022', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Frete', 'Logistica', 'Frete total Jan/2026',  7200.00, 'despesa', '2026-01', '2026-01-31'),
  ('00000000-0000-0000-0000-000finan0023', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Frete', 'Logistica', 'Frete total Fev/2026',  5800.00, 'despesa', '2026-02', '2026-02-28'),
  ('00000000-0000-0000-0000-000finan0024', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Frete', 'Logistica', 'Frete total Mar/2026',  6103.00, 'despesa', '2026-03', '2026-03-31'),

  -- === MARKETING — Meta Ads (despesa) ===
  ('00000000-0000-0000-0000-000finan0025', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Marketing', 'Meta Ads', 'Investimento Meta Ads Set/2025', 4395.00, 'despesa', '2025-09', '2025-09-30'),
  ('00000000-0000-0000-0000-000finan0026', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Marketing', 'Meta Ads', 'Investimento Meta Ads Nov/2025', 10799.00, 'despesa', '2025-11', '2025-11-30'),
  ('00000000-0000-0000-0000-000finan0027', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Marketing', 'Meta Ads', 'Investimento Meta Ads Dez/2025', 8708.00, 'despesa', '2025-12', '2025-12-31'),
  ('00000000-0000-0000-0000-000finan0028', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Marketing', 'Meta Ads', 'Investimento Meta Ads Jan/2026', 5051.00, 'despesa', '2026-01', '2026-01-31'),
  ('00000000-0000-0000-0000-000finan0029', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Marketing', 'Meta Ads', 'Investimento Meta Ads Fev/2026', 8216.00, 'despesa', '2026-02', '2026-02-28'),
  ('00000000-0000-0000-0000-000finan0030', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Marketing', 'Meta Ads', 'Investimento Meta Ads Mar/2026', 5377.00, 'despesa', '2026-03', '2026-03-31'),

  -- === CHARGEBACKS (despesa) ===
  ('00000000-0000-0000-0000-000finan0031', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Chargebacks', 'Fraude', 'Chargebacks Nov/2025', 2400.00, 'despesa', '2025-11', '2025-11-30'),
  ('00000000-0000-0000-0000-000finan0032', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Chargebacks', 'Fraude', 'Chargebacks Dez/2025', 3100.00, 'despesa', '2025-12', '2025-12-31'),
  ('00000000-0000-0000-0000-000finan0033', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Chargebacks', 'Fraude', 'Chargebacks Jan/2026', 1800.00, 'despesa', '2026-01', '2026-01-31'),
  ('00000000-0000-0000-0000-000finan0034', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Chargebacks', 'Fraude', 'Chargebacks Fev/2026', 6132.00, 'despesa', '2026-02', '2026-02-28'),
  ('00000000-0000-0000-0000-000finan0035', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Chargebacks', 'Fraude', 'Chargebacks Mar/2026', 1340.00, 'despesa', '2026-03', '2026-03-31'),

  -- === OPERACIONAL (despesas fixas) ===
  ('00000000-0000-0000-0000-000finan0036', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Operacional', 'Infraestrutura', 'Aluguel deposito Jan/2026', 3500.00, 'despesa', '2026-01', '2026-01-31'),
  ('00000000-0000-0000-0000-000finan0037', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Operacional', 'Infraestrutura', 'Aluguel deposito Fev/2026', 3500.00, 'despesa', '2026-02', '2026-02-28'),
  ('00000000-0000-0000-0000-000finan0038', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Operacional', 'Infraestrutura', 'Aluguel deposito Mar/2026', 3500.00, 'despesa', '2026-03', '2026-03-31'),

  -- === KAIRUS (investimento) ===
  ('00000000-0000-0000-0000-000finan0039', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Tecnologia', 'SaaS', 'Kairus AI — Setup inicial',          12000.00, 'investimento', '2025-10', '2025-10-15'),
  ('00000000-0000-0000-0000-000finan0040', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Tecnologia', 'SaaS', 'Kairus AI — Mensalidade Nov/2025',   7500.00, 'investimento', '2025-11', '2025-11-01'),
  ('00000000-0000-0000-0000-000finan0041', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Tecnologia', 'SaaS', 'Kairus AI — Mensalidade Dez/2025',   7500.00, 'investimento', '2025-12', '2025-12-01'),
  ('00000000-0000-0000-0000-000finan0042', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Tecnologia', 'SaaS', 'Kairus AI — Mensalidade Jan/2026',   7500.00, 'investimento', '2026-01', '2026-01-01'),
  ('00000000-0000-0000-0000-000finan0043', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Tecnologia', 'SaaS', 'Kairus AI — Mensalidade Fev/2026',   7500.00, 'investimento', '2026-02', '2026-02-01'),
  ('00000000-0000-0000-0000-000finan0044', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0001', 'Tecnologia', 'SaaS', 'Kairus AI — Mensalidade Mar/2026',   7500.00, 'investimento', '2026-03', '2026-03-01'),

  -- === EMBALAGENS (custo) ===
  ('00000000-0000-0000-0000-000finan0045', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Embalagens', 'Insumos', 'Embalagens Jan/2026', 2100.00, 'custo', '2026-01', '2026-01-31'),
  ('00000000-0000-0000-0000-000finan0046', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Embalagens', 'Insumos', 'Embalagens Fev/2026', 1800.00, 'custo', '2026-02', '2026-02-28'),
  ('00000000-0000-0000-0000-000finan0047', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0004', 'Embalagens', 'Insumos', 'Embalagens Mar/2026', 1200.00, 'custo', '2026-03', '2026-03-31'),

  -- === GOOGLE ADS (despesa) ===
  ('00000000-0000-0000-0000-000finan0048', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Marketing', 'Google Ads', 'Investimento Google Ads Nov/2025', 4200.00, 'despesa', '2025-11', '2025-11-30'),
  ('00000000-0000-0000-0000-000finan0049', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Marketing', 'Google Ads', 'Investimento Google Ads Dez/2025', 3800.00, 'despesa', '2025-12', '2025-12-31'),
  ('00000000-0000-0000-0000-000finan0050', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Marketing', 'Google Ads', 'Investimento Google Ads Jan/2026', 5200.00, 'despesa', '2026-01', '2026-01-31'),
  ('00000000-0000-0000-0000-000finan0051', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0002', 'Marketing', 'Google Ads', 'Investimento Google Ads Fev/2026', 3784.00, 'despesa', '2026-02', '2026-02-28'),

  -- === TAXAS MARKETPLACE ===
  ('00000000-0000-0000-0000-000finan0052', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Taxas', 'Marketplace', 'Comissoes Shopee Jan/2026',           3200.00, 'despesa', '2026-01', '2026-01-31'),
  ('00000000-0000-0000-0000-000finan0053', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Taxas', 'Marketplace', 'Comissoes Shopee Fev/2026',           2800.00, 'despesa', '2026-02', '2026-02-28'),
  ('00000000-0000-0000-0000-000finan0054', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Taxas', 'Marketplace', 'Comissoes Shopee Mar/2026',           1700.00, 'despesa', '2026-03', '2026-03-31'),
  ('00000000-0000-0000-0000-000finan0055', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-0000dept0003', 'Taxas', 'Gateway',     'Taxas gateway pagamento Mar/2026',    980.00, 'despesa', '2026-03', '2026-03-31');

-- ============================================================
-- FINANCIAL MARGINS
-- ============================================================

INSERT INTO financial_margins (tenant_id, category, subcategory, margin_percent, period) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Geral',             NULL,         50.20, '2026-03'),
  ('00000000-0000-0000-0000-000000000001', 'Honey Garrafa',     'Produto',    52.40, '2026-03'),
  ('00000000-0000-0000-0000-000000000001', 'Honey Completo',    'Produto',    48.10, '2026-03'),
  ('00000000-0000-0000-0000-000000000001', 'Capuccino Garrafa', 'Produto',    45.30, '2026-03'),
  ('00000000-0000-0000-0000-000000000001', 'Honey Pingente',    'Produto',    -0.11, '2026-03'),
  ('00000000-0000-0000-0000-000000000001', 'Black Honey',       'Produto',    38.60, '2026-03'),
  ('00000000-0000-0000-0000-000000000001', 'Geral',             NULL,         45.30, '2026-02'),
  ('00000000-0000-0000-0000-000000000001', 'Geral',             NULL,         46.60, '2026-01');

-- ============================================================
-- CLIENTS (10 clients)
-- ============================================================

INSERT INTO clients (id, tenant_id, name, email, phone, company, segment, status, source, lifetime_value, tags, last_purchase) VALUES
  ('00000000-0000-0000-0000-00client0001', '00000000-0000-0000-0000-000000000001', 'Sabor & Cia Distribuidora',  'compras@saborecia.com.br',   '11987654321', 'Sabor & Cia',            'b2b',        'ativo',   'outbound',    48200.00, ARRAY['b2b', 'trimestral', 'premium'],       NOW() - INTERVAL '8 days'),
  ('00000000-0000-0000-0000-00client0002', '00000000-0000-0000-0000-000000000001', 'Bar do Ze',                  'barze@email.com',            '11976543210', 'Bar do Ze ME',           'b2b',        'ativo',   'indicacao',   22400.00, ARRAY['b2b', 'mensal', 'bar'],               NOW() - INTERVAL '15 days'),
  ('00000000-0000-0000-0000-00client0003', '00000000-0000-0000-0000-000000000001', 'Restaurante Bella Vita',     'contato@bellavita.com.br',   '11965432109', 'Bella Vita Ltda',        'b2b',        'ativo',   'inbound',     18600.00, ARRAY['b2b', 'restaurante', 'quinzenal'],    NOW() - INTERVAL '12 days'),
  ('00000000-0000-0000-0000-00client0004', '00000000-0000-0000-0000-000000000001', 'Marina Costa',               'marina.costa@gmail.com',     '11954321098', NULL,                     'b2c',        'ativo',   'instagram',    1890.00, ARRAY['b2c', 'recorrente', 'honey'],         NOW() - INTERVAL '20 days'),
  ('00000000-0000-0000-0000-00client0005', '00000000-0000-0000-0000-000000000001', 'Pedro Henrique Oliveira',    'pedro.h.oliveira@email.com', '11943210987', NULL,                     'b2c',        'ativo',   'meta-ads',      756.00, ARRAY['b2c', 'capuccino'],                   NOW() - INTERVAL '5 days'),
  ('00000000-0000-0000-0000-00client0006', '00000000-0000-0000-0000-000000000001', 'Emporio Natural Brasil',     'compras@emporionatural.com', '21987654321', 'Emporio Natural Ltda',   'revendedor', 'ativo',   'outbound',    35800.00, ARRAY['revendedor', 'rj', 'mensal'],         NOW() - INTERVAL '18 days'),
  ('00000000-0000-0000-0000-00client0007', '00000000-0000-0000-0000-000000000001', 'Ana Beatriz Santos',         'anab.santos@hotmail.com',    '11932109876', NULL,                     'b2c',        'lead',    'google-ads',      0.00, ARRAY['lead', 'interesse-honey'],            NULL),
  ('00000000-0000-0000-0000-00client0008', '00000000-0000-0000-0000-000000000001', 'Cafe Premium Express',       'pedidos@cafepremium.com.br', '41987654321', 'Cafe Premium Express ME','b2b',        'inativo', 'outbound',     8900.00, ARRAY['b2b', 'curitiba', 'inativo-60d'],     NOW() - INTERVAL '72 days'),
  ('00000000-0000-0000-0000-00client0009', '00000000-0000-0000-0000-000000000001', 'Joao Vitor Almeida',         'jvalmeida@email.com',        '11921098765', NULL,                     'vip',        'ativo',   'indicacao',    4200.00, ARRAY['vip', 'recorrente', 'kit-completo'],  NOW() - INTERVAL '10 days'),
  ('00000000-0000-0000-0000-00client0010', '00000000-0000-0000-0000-000000000001', 'Distribuidora Norte Bebidas','vendas@nortebebidas.com.br', '92987654321', 'Norte Bebidas Ltda',     'b2b',        'prospect','inbound',         0.00, ARRAY['prospect', 'manaus', 'grande-volume'],NULL);

-- ============================================================
-- CONVERSATIONS (10 conversations)
-- ============================================================

INSERT INTO conversations (id, tenant_id, client_id, agent_id, channel, status, subject, started_at, last_message_at, resolved_at) VALUES
  ('00000000-0000-0000-0000-000conv00001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00client0001', '00000000-0000-0000-0000-000agent0013', 'whatsapp',  'em_andamento', 'Recompra trimestral — proposta comercial',  NOW() - INTERVAL '2 days',  NOW() - INTERVAL '1 hour',  NULL),
  ('00000000-0000-0000-0000-000conv00002', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00client0004', '00000000-0000-0000-0000-000agent0025', 'whatsapp',  'resolvida',    'Rastreamento de pedido #4510',              NOW() - INTERVAL '3 days',  NOW() - INTERVAL '3 days',  NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-000conv00003', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00client0005', '00000000-0000-0000-0000-000agent0025', 'whatsapp',  'resolvida',    'Duvida sobre ingredientes Capuccino',       NOW() - INTERVAL '5 days',  NOW() - INTERVAL '5 days',  NOW() - INTERVAL '5 days'),
  ('00000000-0000-0000-0000-000conv00004', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00client0002', '00000000-0000-0000-0000-000agent0016', 'email',     'em_andamento', 'Renegociacao de contrato B2B',              NOW() - INTERVAL '6 hours', NOW() - INTERVAL '2 hours', NULL),
  ('00000000-0000-0000-0000-000conv00005', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00client0006', '00000000-0000-0000-0000-000agent0013', 'whatsapp',  'em_andamento', 'Pedido urgente — reposicao de estoque',     NOW() - INTERVAL '4 hours', NOW() - INTERVAL '1 hour',  NULL),
  ('00000000-0000-0000-0000-000conv00006', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00client0007', '00000000-0000-0000-0000-000agent0015', 'instagram', 'aberta',       'Interesse em Honey — lead qualificado',     NOW() - INTERVAL '1 hour',  NOW() - INTERVAL '1 hour',  NULL),
  ('00000000-0000-0000-0000-000conv00007', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00client0009', '00000000-0000-0000-0000-000agent0018', 'whatsapp',  'resolvida',    'Carrinho abandonado — recuperacao',         NOW() - INTERVAL '2 days',  NOW() - INTERVAL '2 days',  NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000conv00008', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00client0003', '00000000-0000-0000-0000-000agent0029', 'email',     'resolvida',    'Reclamacao de avaria na entrega',           NOW() - INTERVAL '8 days',  NOW() - INTERVAL '7 days',  NOW() - INTERVAL '7 days'),
  ('00000000-0000-0000-0000-000conv00009', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00client0010', '00000000-0000-0000-0000-000agent0014', 'email',     'aberta',       'Primeiro contato — distribuidora Norte',    NOW() - INTERVAL '3 hours', NOW() - INTERVAL '3 hours', NULL),
  ('00000000-0000-0000-0000-000conv00010', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-00client0008', '00000000-0000-0000-0000-000agent0017', 'whatsapp',  'aguardando',   'Reativacao — ultima compra ha 72 dias',     NOW() - INTERVAL '1 day',   NOW() - INTERVAL '1 day',   NULL);

-- ============================================================
-- MESSAGES (30 messages across conversations)
-- ============================================================

INSERT INTO messages (conversation_id, direction, content, source, sentiment, created_at) VALUES
  -- Conversa 1: Recompra B2B Sabor & Cia
  ('00000000-0000-0000-0000-000conv00001', 'inbound',  'Ola, gostaria de renovar nosso contrato trimestral. Podemos conversar sobre desconto de volume?', 'cliente', 'positivo', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000conv00001', 'outbound', 'Ola! Que bom que deseja renovar. Com base no seu historico de 18 pedidos, preparei uma proposta com 12% de desconto para contrato trimestral. Valor estimado: R$ 24.000.', 'agente', 'positivo', NOW() - INTERVAL '2 days' + INTERVAL '5 minutes'),
  ('00000000-0000-0000-0000-000conv00001', 'inbound',  'Interessante! Vou avaliar com meu socio e retorno amanha.', 'cliente', 'positivo', NOW() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000conv00001', 'outbound', 'Perfeito! Fico no aguardo. A proposta tem validade de 7 dias.', 'agente', 'neutro', NOW() - INTERVAL '1 hour'),
  -- Conversa 2: Rastreamento
  ('00000000-0000-0000-0000-000conv00002', 'inbound',  'Oi, quero rastrear meu pedido #4510', 'cliente', 'neutro', NOW() - INTERVAL '3 days'),
  ('00000000-0000-0000-0000-000conv00002', 'outbound', 'Ola Marina! Seu pedido #4510 esta em transito com previsao de entrega para amanha. Codigo de rastreio: LX123456789BR.', 'agente', 'positivo', NOW() - INTERVAL '3 days' + INTERVAL '2 minutes'),
  ('00000000-0000-0000-0000-000conv00002', 'inbound',  'Obrigada! Rapido demais!', 'cliente', 'positivo', NOW() - INTERVAL '3 days' + INTERVAL '3 minutes'),
  -- Conversa 3: Duvida ingredientes
  ('00000000-0000-0000-0000-000conv00003', 'inbound',  'O Mr. Lion Capuccino tem lactose?', 'cliente', 'neutro', NOW() - INTERVAL '5 days'),
  ('00000000-0000-0000-0000-000conv00003', 'outbound', 'Ola Pedro! O Mr. Lion Capuccino contem derivados de leite, portanto possui lactose. Caso tenha restricao, recomendo o Mr. Lion Honey que e 100% vegano.', 'agente', 'neutro', NOW() - INTERVAL '5 days' + INTERVAL '1 minute'),
  ('00000000-0000-0000-0000-000conv00003', 'inbound',  'Entendi, vou experimentar o Honey entao. Obrigado!', 'cliente', 'positivo', NOW() - INTERVAL '5 days' + INTERVAL '5 minutes'),
  -- Conversa 4: Renegociacao B2B
  ('00000000-0000-0000-0000-000conv00004', 'inbound',  'Precisamos renegociar nosso contrato. O preco do concorrente esta 15% mais baixo.', 'cliente', 'negativo', NOW() - INTERVAL '6 hours'),
  ('00000000-0000-0000-0000-000conv00004', 'outbound', 'Entendo a preocupacao. Estou analisando uma proposta que mantenha nossa parceria com condicoes competitivas. Posso apresentar algo em 24h?', 'agente', 'neutro', NOW() - INTERVAL '5 hours'),
  ('00000000-0000-0000-0000-000conv00004', 'inbound',  'OK, aguardo. Mas preciso de resposta rapida.', 'cliente', 'negativo', NOW() - INTERVAL '2 hours'),
  -- Conversa 5: Pedido urgente Emporio
  ('00000000-0000-0000-0000-000conv00005', 'inbound',  'Precisamos de 200 unidades Honey Garrafa para sexta. Conseguem?', 'cliente', 'neutro', NOW() - INTERVAL '4 hours'),
  ('00000000-0000-0000-0000-000conv00005', 'outbound', 'Ola! No momento nosso estoque esta em 47 unidades de Honey Garrafa. Estamos com pedido de reposicao em andamento. Posso confirmar disponibilidade amanha pela manha.', 'agente', 'neutro', NOW() - INTERVAL '3 hours'),
  ('00000000-0000-0000-0000-000conv00005', 'inbound',  'Hmm, complicado. Me avise assim que tiver novidades.', 'cliente', 'negativo', NOW() - INTERVAL '1 hour'),
  -- Conversa 6: Lead Instagram
  ('00000000-0000-0000-0000-000conv00006', 'inbound',  'Vi o post de voces no Instagram. Quero saber mais sobre o Mr. Lion Honey. Qual o preco?', 'cliente', 'positivo', NOW() - INTERVAL '1 hour'),
  -- Conversa 7: Carrinho abandonado
  ('00000000-0000-0000-0000-000conv00007', 'outbound', 'Ola Joao! Vi que voce adicionou o Kit Honey Completo ao carrinho mas nao finalizou. Posso ajudar com alguma duvida? Temos frete gratis para compras acima de R$ 150!', 'agente', 'positivo', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000conv00007', 'inbound',  'Ah sim, esqueci! Vou finalizar agora. Obrigado pelo lembrete!', 'cliente', 'positivo', NOW() - INTERVAL '2 days' + INTERVAL '30 minutes'),
  ('00000000-0000-0000-0000-000conv00007', 'outbound', 'Pedido confirmado! Obrigado pela preferencia. Voce recebera o rastreio em ate 24h.', 'agente', 'positivo', NOW() - INTERVAL '2 days' + INTERVAL '35 minutes'),
  -- Conversa 8: Reclamacao avaria
  ('00000000-0000-0000-0000-000conv00008', 'inbound',  'Recebi o pedido mas 2 garrafas chegaram quebradas. Muito decepcionada com a embalagem.', 'cliente', 'negativo', NOW() - INTERVAL '8 days'),
  ('00000000-0000-0000-0000-000conv00008', 'outbound', 'Lamentamos muito pelo ocorrido! Ja estou providenciando o reenvio das 2 unidades sem custo. Pode enviar fotos da avaria para nosso registro?', 'agente', 'neutro', NOW() - INTERVAL '8 days' + INTERVAL '15 minutes'),
  ('00000000-0000-0000-0000-000conv00008', 'inbound',  'Enviei as fotos. Espero que nao se repita.', 'cliente', 'negativo', NOW() - INTERVAL '8 days' + INTERVAL '30 minutes'),
  ('00000000-0000-0000-0000-000conv00008', 'outbound', 'Fotos recebidas. O reenvio sai hoje com embalagem reforcada. Pedimos desculpas e enviamos um brinde como cortesia.', 'agente', 'positivo', NOW() - INTERVAL '7 days'),
  ('00000000-0000-0000-0000-000conv00008', 'inbound',  'Recebi tudo certinho agora. Obrigada pela resolucao rapida.', 'cliente', 'positivo', NOW() - INTERVAL '5 days'),
  -- Conversa 9: Primeiro contato distribuidora
  ('00000000-0000-0000-0000-000conv00009', 'outbound', 'Ola! Sou da equipe comercial Mr. Lion. Vi seu interesse em distribuir nossos produtos na regiao Norte. Podemos agendar uma apresentacao?', 'agente', 'positivo', NOW() - INTERVAL '3 hours'),
  -- Conversa 10: Reativacao
  ('00000000-0000-0000-0000-000conv00010', 'outbound', 'Ola! Sentimos sua falta! Sua ultima compra foi ha 72 dias. Preparamos uma condicao especial: 10% de desconto no proximo pedido. Tem interesse?', 'agente', 'positivo', NOW() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000conv00010', 'inbound',  'Ola, estou avaliando trocar de fornecedor. Me envia o catalogo atualizado?', 'cliente', 'neutro', NOW() - INTERVAL '1 day' + INTERVAL '3 hours'),
  ('00000000-0000-0000-0000-000conv00010', 'outbound', 'Claro! Segue nosso catalogo atualizado com novos sabores. Alem do desconto de 10%, temos frete gratis para pedidos acima de R$ 500.', 'agente', 'positivo', NOW() - INTERVAL '1 day' + INTERVAL '4 hours');

-- ============================================================
-- SALES METRICS (per agent per period)
-- ============================================================

INSERT INTO sales_metrics (tenant_id, agent_id, period, conversations_total, resolved, conversion_rate, avg_response_time, revenue_generated) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0013', '2026-03', 42,  35,  28.50, '00:15:00', 18200.00),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0014', '2026-03', 28,  22,  18.20, '00:22:00',  8400.00),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0015', '2026-03', 65,  58,  12.30, '00:08:00',  4200.00),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0018', '2026-03', 120, 98,   5.80, '00:03:00',  7600.00),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0025', '2026-03', 340, 318,  2.10, '00:02:00',     0.00),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0013', '2026-02', 55,  48,  32.10, '00:12:00', 28400.00),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0014', '2026-02', 38,  30,  21.00, '00:18:00', 12800.00),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0025', '2026-02', 420, 395,  1.90, '00:02:00',     0.00);

-- ============================================================
-- ROADMAP ITEMS (12 items)
-- ============================================================

INSERT INTO roadmap_items (id, tenant_id, title, description, status, priority, category, owner_department_id, start_date, end_date, progress, tags) VALUES
  ('00000000-0000-0000-0000-000road00001', '00000000-0000-0000-0000-000000000001', 'Integracao Google Ads',
   'Conectar dados do Google Ads para visao unificada de investimento em trafego pago', 'em_progresso', 'alta', 'Integracao',
   '00000000-0000-0000-0000-0000dept0002', '2026-03-15', '2026-04-15', 35, ARRAY['google', 'ads', 'integracao']),

  ('00000000-0000-0000-0000-000road00002', '00000000-0000-0000-0000-000000000001', 'Dashboard de ROI por Canal',
   'Criar painel com ROI detalhado por canal de aquisicao (Meta, Google, Organico, Direto)', 'planejado', 'alta', 'Analytics',
   '00000000-0000-0000-0000-0000dept0002', '2026-04-01', '2026-04-30', 0, ARRAY['roi', 'analytics', 'dashboard']),

  ('00000000-0000-0000-0000-000road00003', '00000000-0000-0000-0000-000000000001', 'Agente de Anti-Fraude',
   'Implementar agente especializado em deteccao de fraude e prevencao de chargebacks', 'em_progresso', 'critica', 'Seguranca',
   '00000000-0000-0000-0000-0000dept0001', '2026-03-01', '2026-04-15', 65, ARRAY['fraude', 'chargeback', 'seguranca']),

  ('00000000-0000-0000-0000-000road00004', '00000000-0000-0000-0000-000000000001', 'Automacao de Recompra B2B',
   'Automatizar ciclo completo de recompra para clientes B2B com base em historico e frequencia', 'concluido', 'alta', 'Vendas',
   '00000000-0000-0000-0000-0000dept0003', '2026-01-15', '2026-03-15', 100, ARRAY['b2b', 'recompra', 'automacao']),

  ('00000000-0000-0000-0000-000road00005', '00000000-0000-0000-0000-000000000001', 'Chatbot Multicanal',
   'Expandir atendimento automatizado para Instagram DM e chat do site alem do WhatsApp', 'planejado', 'media', 'Atendimento',
   '00000000-0000-0000-0000-0000dept0005', '2026-04-15', '2026-06-15', 0, ARRAY['chatbot', 'multicanal', 'atendimento']),

  ('00000000-0000-0000-0000-000road00006', '00000000-0000-0000-0000-000000000001', 'Gestao de Estoque Preditiva',
   'Implementar previsao de demanda com IA para otimizar pontos de reposicao automaticamente', 'em_progresso', 'alta', 'Operacoes',
   '00000000-0000-0000-0000-0000dept0004', '2026-02-15', '2026-05-15', 40, ARRAY['estoque', 'previsao', 'ia']),

  ('00000000-0000-0000-0000-000road00007', '00000000-0000-0000-0000-000000000001', 'Integracao Shopee e ML',
   'Conectar plataformas de marketplace para gestao centralizada de pedidos e estoque', 'backlog', 'media', 'Integracao',
   '00000000-0000-0000-0000-0000dept0004', NULL, NULL, 0, ARRAY['shopee', 'mercadolivre', 'marketplace']),

  ('00000000-0000-0000-0000-000road00008', '00000000-0000-0000-0000-000000000001', 'Relatorios Automaticos Diarios',
   'Gerar e enviar resumo diario automatico com KPIs principais para o gestor', 'concluido', 'media', 'Relatorios',
   '00000000-0000-0000-0000-0000dept0001', '2026-01-01', '2026-02-28', 100, ARRAY['relatorio', 'automacao', 'diario']),

  ('00000000-0000-0000-0000-000road00009', '00000000-0000-0000-0000-000000000001', 'Programa de Fidelidade',
   'Criar sistema de pontos e recompensas para clientes recorrentes B2C', 'backlog', 'baixa', 'Vendas',
   '00000000-0000-0000-0000-0000dept0003', NULL, NULL, 0, ARRAY['fidelidade', 'pontos', 'b2c']),

  ('00000000-0000-0000-0000-000road00010', '00000000-0000-0000-0000-000000000001', 'Otimizacao de Criativos com IA',
   'Usar IA generativa para testar variacoes de criativos e headlines automaticamente', 'planejado', 'media', 'Marketing',
   '00000000-0000-0000-0000-0000dept0002', '2026-05-01', '2026-06-30', 0, ARRAY['criativos', 'ia', 'ab-test']),

  ('00000000-0000-0000-0000-000road00011', '00000000-0000-0000-0000-000000000001', 'Modulo de Precificacao Dinamica',
   'Ajustar precos automaticamente com base em estoque, demanda e margem-alvo', 'backlog', 'alta', 'Financeiro',
   '00000000-0000-0000-0000-0000dept0001', NULL, NULL, 0, ARRAY['precificacao', 'dinamica', 'margem']),

  ('00000000-0000-0000-0000-000road00012', '00000000-0000-0000-0000-000000000001', 'App Mobile para Gestao',
   'Desenvolver aplicativo mobile para acompanhamento de KPIs e aprovacoes em tempo real', 'backlog', 'baixa', 'Produto',
   NULL, NULL, NULL, 0, ARRAY['mobile', 'app', 'gestao']);

-- ============================================================
-- ROADMAP MILESTONES
-- ============================================================

INSERT INTO roadmap_milestones (tenant_id, title, date, status) VALUES
  ('00000000-0000-0000-0000-000000000001', 'MVP Kairus — Go Live',             '2025-10-15', 'concluido'),
  ('00000000-0000-0000-0000-000000000001', 'Black Friday 2025 — Automacoes',   '2025-11-20', 'concluido'),
  ('00000000-0000-0000-0000-000000000001', 'Integracao WhatsApp Business API', '2026-01-15', 'concluido'),
  ('00000000-0000-0000-0000-000000000001', 'Agente Anti-Fraude — Deploy',      '2026-04-15', 'em_progresso'),
  ('00000000-0000-0000-0000-000000000001', 'Estoque Preditivo — Beta',         '2026-05-15', 'pendente'),
  ('00000000-0000-0000-0000-000000000001', 'Chatbot Multicanal — Launch',      '2026-06-15', 'pendente');

-- ============================================================
-- WORLD ROOMS (18 rooms across 6 domains)
-- ============================================================

INSERT INTO world_rooms (id, tenant_id, name, domain, description, x, y, width, height, status, color, icon) VALUES
  -- Financeiro
  ('00000000-0000-0000-0000-000room00001', '00000000-0000-0000-0000-000000000001', 'Sala DRE',            'financeiro',  'Monitoramento de Demonstrativo de Resultados',    50,   50,  220, 160, 'ativo', '#22c55e', 'DollarSign'),
  ('00000000-0000-0000-0000-000room00002', '00000000-0000-0000-0000-000000000001', 'Sala Cobrancas',      'financeiro',  'Gestao de cobrancas e chargebacks',               300,   50,  220, 160, 'ativo', '#22c55e', 'CreditCard'),
  ('00000000-0000-0000-0000-000room00003', '00000000-0000-0000-0000-000000000001', 'Sala Precificacao',   'financeiro',  'Analise de custos e precificacao',                550,   50,  220, 160, 'ativo', '#22c55e', 'Calculator'),
  -- Marketing
  ('00000000-0000-0000-0000-000room00004', '00000000-0000-0000-0000-000000000001', 'Sala Meta Ads',       'marketing',   'Gestao de campanhas Meta Ads',                    50,  250,  220, 160, 'ativo', '#6366f1', 'Target'),
  ('00000000-0000-0000-0000-000room00005', '00000000-0000-0000-0000-000000000001', 'Sala Conteudo',       'marketing',   'Producao de conteudo e calendario editorial',    300,  250,  220, 160, 'ativo', '#6366f1', 'PenTool'),
  ('00000000-0000-0000-0000-000room00006', '00000000-0000-0000-0000-000000000001', 'Sala Analytics',      'marketing',   'Analise de trafego e atribuicao',                550,  250,  220, 160, 'ativo', '#6366f1', 'BarChart'),
  -- Vendas
  ('00000000-0000-0000-0000-000room00007', '00000000-0000-0000-0000-000000000001', 'Sala Pipeline',       'vendas',      'Pipeline de vendas B2B',                          50,  450,  220, 160, 'ativo', '#ec4899', 'Funnel'),
  ('00000000-0000-0000-0000-000room00008', '00000000-0000-0000-0000-000000000001', 'Sala Closers',        'vendas',      'Negociacao e fechamento de contas',              300,  450,  220, 160, 'ativo', '#ec4899', 'Handshake'),
  ('00000000-0000-0000-0000-000room00009', '00000000-0000-0000-0000-000000000001', 'Sala Recompra',       'vendas',      'Automacao de recompra e fidelizacao',            550,  450,  220, 160, 'ativo', '#ec4899', 'RefreshCw'),
  -- Operacoes
  ('00000000-0000-0000-0000-000room00010', '00000000-0000-0000-0000-000000000001', 'Sala Estoque',        'operacoes',   'Controle de inventario e reposicao',              50,  650,  220, 160, 'ativo', '#f59e0b', 'Package'),
  ('00000000-0000-0000-0000-000room00011', '00000000-0000-0000-0000-000000000001', 'Sala Logistica',      'operacoes',   'Entregas, rastreamento e transportadoras',       300,  650,  220, 160, 'ativo', '#f59e0b', 'Truck'),
  ('00000000-0000-0000-0000-000room00012', '00000000-0000-0000-0000-000000000001', 'Sala Qualidade',      'operacoes',   'Controle de qualidade e shelf life',             550,  650,  220, 160, 'ativo', '#f59e0b', 'ShieldCheck'),
  -- Atendimento
  ('00000000-0000-0000-0000-000room00013', '00000000-0000-0000-0000-000000000001', 'Sala WhatsApp',       'atendimento', 'Atendimento automatizado via WhatsApp',           50,  850,  220, 160, 'ativo', '#06b6d4', 'MessageCircle'),
  ('00000000-0000-0000-0000-000room00014', '00000000-0000-0000-0000-000000000001', 'Sala Suporte N2',     'atendimento', 'Atendimento especializado e escalacoes',         300,  850,  220, 160, 'ativo', '#06b6d4', 'Headphones'),
  ('00000000-0000-0000-0000-000room00015', '00000000-0000-0000-0000-000000000001', 'Sala Triagem',        'atendimento', 'Classificacao e roteamento de tickets',          550,  850,  220, 160, 'ativo', '#06b6d4', 'Filter'),
  -- Compartilhadas
  ('00000000-0000-0000-0000-000room00016', '00000000-0000-0000-0000-000000000001', 'Central de Comando',  'geral',       'Visao geral de todos os departamentos',          300, 1050,  280, 180, 'ativo', '#8b5cf6', 'Monitor'),
  ('00000000-0000-0000-0000-000room00017', '00000000-0000-0000-0000-000000000001', 'Sala de Relatorios',  'geral',       'Geracao e revisao de relatorios consolidados',    50, 1050,  220, 160, 'ativo', '#8b5cf6', 'FileText'),
  ('00000000-0000-0000-0000-000room00018', '00000000-0000-0000-0000-000000000001', 'Sala de Integracoes', 'integracao',  'Conexoes com sistemas externos',                610, 1050,  220, 160, 'ativo', '#8b5cf6', 'Plug');

-- ============================================================
-- WORLD CONNECTIONS
-- ============================================================

INSERT INTO world_connections (room_a_id, room_b_id, type, label) VALUES
  ('00000000-0000-0000-0000-000room00001', '00000000-0000-0000-0000-000room00002', 'bidirecional',  'DRE <-> Cobrancas'),
  ('00000000-0000-0000-0000-000room00001', '00000000-0000-0000-0000-000room00003', 'bidirecional',  'DRE <-> Precificacao'),
  ('00000000-0000-0000-0000-000room00004', '00000000-0000-0000-0000-000room00006', 'unidirecional', 'Ads -> Analytics'),
  ('00000000-0000-0000-0000-000room00005', '00000000-0000-0000-0000-000room00004', 'unidirecional', 'Conteudo -> Ads'),
  ('00000000-0000-0000-0000-000room00007', '00000000-0000-0000-0000-000room00008', 'unidirecional', 'Pipeline -> Closers'),
  ('00000000-0000-0000-0000-000room00008', '00000000-0000-0000-0000-000room00009', 'unidirecional', 'Closers -> Recompra'),
  ('00000000-0000-0000-0000-000room00010', '00000000-0000-0000-0000-000room00011', 'bidirecional',  'Estoque <-> Logistica'),
  ('00000000-0000-0000-0000-000room00010', '00000000-0000-0000-0000-000room00012', 'dependencia',   'Estoque <- Qualidade'),
  ('00000000-0000-0000-0000-000room00013', '00000000-0000-0000-0000-000room00015', 'unidirecional', 'WhatsApp -> Triagem'),
  ('00000000-0000-0000-0000-000room00015', '00000000-0000-0000-0000-000room00014', 'unidirecional', 'Triagem -> N2'),
  ('00000000-0000-0000-0000-000room00016', '00000000-0000-0000-0000-000room00017', 'bidirecional',  'Comando <-> Relatorios'),
  ('00000000-0000-0000-0000-000room00016', '00000000-0000-0000-0000-000room00018', 'bidirecional',  'Comando <-> Integracoes');

-- ============================================================
-- AGENT PRESENCE (agents in rooms)
-- ============================================================

INSERT INTO agent_presence (agent_id, room_id, status, current_task, last_seen) VALUES
  -- Financeiro
  ('00000000-0000-0000-0000-000agent0001', '00000000-0000-0000-0000-000room00001', 'online',  'Monitorando DRE Mar/2026',              NOW() - INTERVAL '5 minutes'),
  ('00000000-0000-0000-0000-000agent0002', '00000000-0000-0000-0000-000room00002', 'online',  'Conciliacao PIX do dia',                NOW() - INTERVAL '10 minutes'),
  ('00000000-0000-0000-0000-000agent0003', '00000000-0000-0000-0000-000room00001', 'online',  'Projecao fluxo de caixa Abril',         NOW() - INTERVAL '15 minutes'),
  ('00000000-0000-0000-0000-000agent0005', '00000000-0000-0000-0000-000room00003', 'online',  'Recalculando markup apos reajuste',     NOW() - INTERVAL '8 minutes'),
  -- Marketing
  ('00000000-0000-0000-0000-000agent0007', '00000000-0000-0000-0000-000room00004', 'online',  'Otimizando campanha Verao 2026',        NOW() - INTERVAL '3 minutes'),
  ('00000000-0000-0000-0000-000agent0008', '00000000-0000-0000-0000-000room00005', 'online',  'Preparando conteudo Instagram',         NOW() - INTERVAL '12 minutes'),
  ('00000000-0000-0000-0000-000agent0009', '00000000-0000-0000-0000-000room00006', 'online',  'Analisando funil de conversao',         NOW() - INTERVAL '7 minutes'),
  ('00000000-0000-0000-0000-000agent0010', '00000000-0000-0000-0000-000room00004', 'ocupado', 'Aguardando credenciais Google Ads',     NOW() - INTERVAL '2 hours'),
  ('00000000-0000-0000-0000-000agent0012', '00000000-0000-0000-0000-000room00006', 'online',  'Monitorando concorrencia',              NOW() - INTERVAL '20 minutes'),
  -- Vendas
  ('00000000-0000-0000-0000-000agent0013', '00000000-0000-0000-0000-000room00008', 'online',  'Negociando com Sabor & Cia',            NOW() - INTERVAL '5 minutes'),
  ('00000000-0000-0000-0000-000agent0014', '00000000-0000-0000-0000-000room00007', 'online',  'Prospeccao B2B restaurantes',           NOW() - INTERVAL '10 minutes'),
  ('00000000-0000-0000-0000-000agent0015', '00000000-0000-0000-0000-000room00007', 'online',  'Classificando leads inbound',           NOW() - INTERVAL '8 minutes'),
  ('00000000-0000-0000-0000-000agent0018', '00000000-0000-0000-0000-000room00009', 'online',  'Recuperando carrinhos abandonados',     NOW() - INTERVAL '4 minutes'),
  -- Operacoes
  ('00000000-0000-0000-0000-000agent0019', '00000000-0000-0000-0000-000room00010', 'online',  'Monitorando estoque critico',           NOW() - INTERVAL '2 minutes'),
  ('00000000-0000-0000-0000-000agent0020', '00000000-0000-0000-0000-000room00011', 'online',  'Rastreando entregas atrasadas',         NOW() - INTERVAL '6 minutes'),
  ('00000000-0000-0000-0000-000agent0021', '00000000-0000-0000-0000-000room00011', 'ocupado', 'Renegociando frete Correios',           NOW() - INTERVAL '30 minutes'),
  ('00000000-0000-0000-0000-000agent0023', '00000000-0000-0000-0000-000room00012', 'online',  'Verificando validade de lotes',         NOW() - INTERVAL '15 minutes'),
  -- Atendimento
  ('00000000-0000-0000-0000-000agent0025', '00000000-0000-0000-0000-000room00013', 'idle',    NULL,                                    NOW() - INTERVAL '30 minutes'),
  ('00000000-0000-0000-0000-000agent0026', '00000000-0000-0000-0000-000room00014', 'online',  'Resolvendo reclamacao Reclame Aqui',    NOW() - INTERVAL '8 minutes'),
  ('00000000-0000-0000-0000-000agent0027', '00000000-0000-0000-0000-000room00015', 'online',  'Classificando tickets do dia',          NOW() - INTERVAL '3 minutes'),
  ('00000000-0000-0000-0000-000agent0028', '00000000-0000-0000-0000-000room00013', 'online',  'Atualizando base de conhecimento',      NOW() - INTERVAL '12 minutes'),
  ('00000000-0000-0000-0000-000agent0029', '00000000-0000-0000-0000-000room00014', 'online',  'Respondendo emails de suporte',         NOW() - INTERVAL '5 minutes'),
  -- Central de Comando (Leo also monitors from here)
  ('00000000-0000-0000-0000-000agent0001', '00000000-0000-0000-0000-000room00016', 'online',  'Gerando relatorio consolidado',         NOW() - INTERVAL '10 minutes');

-- ============================================================
-- CAMPAIGNS (5 campaigns)
-- ============================================================

INSERT INTO campaigns (id, tenant_id, name, description, channel, status, budget, spent, reach, impressions, clicks, conversions, ctr, cpc, roas, start_date, end_date) VALUES
  ('00000000-0000-0000-0000-000campa0001', '00000000-0000-0000-0000-000000000001',
   'Verao 2026 — Honey', 'Campanha principal de verao focada na linha Honey',
   'meta_ads', 'ativa', 8000.00, 5377.00, 280000, 1010466, 16610, 155, 1.6400, 0.3200, NULL, '2026-01-15', '2026-03-31'),

  ('00000000-0000-0000-0000-000campa0002', '00000000-0000-0000-0000-000000000001',
   'Honey Premium — Retargeting', 'Retargeting para visitantes que visualizaram produto mas nao compraram',
   'meta_ads', 'ativa', 2500.00, 1800.00, 45000, 320000, 8500, 42, 2.6600, 0.2100, 3.2000, '2026-03-01', '2026-04-30'),

  ('00000000-0000-0000-0000-000campa0003', '00000000-0000-0000-0000-000000000001',
   'Black Friday 2025', 'Campanha de Black Friday com descontos de ate 30%',
   'meta_ads', 'encerrada', 15000.00, 10799.00, 850000, 2072041, 90072, 2588, 4.3500, 0.1200, NULL, '2025-11-01', '2025-11-30'),

  ('00000000-0000-0000-0000-000campa0004', '00000000-0000-0000-0000-000000000001',
   'Email Reengajamento Q1/2026', 'Campanha de email para base inativa ha mais de 30 dias',
   'email', 'encerrada', 500.00, 380.00, 1200, 1200, 216, 18, 18.0000, 1.7600, 4.5000, '2026-02-15', '2026-03-15'),

  ('00000000-0000-0000-0000-000campa0005', '00000000-0000-0000-0000-000000000001',
   'Lancamento Capuccino — Instagram', 'Campanha de lancamento do novo sabor Capuccino via Instagram Stories e Reels',
   'instagram', 'agendada', 4000.00, 0.00, 0, 0, 0, 0, NULL, NULL, NULL, '2026-04-15', '2026-05-15');

-- ============================================================
-- REPORTS (8 reports)
-- ============================================================

INSERT INTO reports (id, tenant_id, type, title, summary, period, agent_id, department_id, status, data) VALUES
  ('00000000-0000-0000-0000-000repor0001', '00000000-0000-0000-0000-000000000001', 'semanal',
   'Relatorio Semanal — Semana 13/2026',
   'Receita semanal R$ 8.200 (-12% vs semana anterior). Ticket medio R$ 218. Estoque Honey Garrafa critico. 2 chargebacks resolvidos.',
   '2026-W13', '00000000-0000-0000-0000-000agent0001', '00000000-0000-0000-0000-0000dept0001', 'pronto',
   '{"receita": 8200, "pedidos": 38, "ticket_medio": 218, "chargebacks": 2}'::jsonb),

  ('00000000-0000-0000-0000-000repor0002', '00000000-0000-0000-0000-000000000001', 'mensal',
   'Relatorio Mensal — Fevereiro 2026',
   'Receita R$ 54.412 (231 pedidos). PREJUIZO de R$ -2.329. CMV 45,3%. Marketing R$ 12.000. Chargebacks R$ 6.132 (7,9%).',
   '2026-02', '00000000-0000-0000-0000-000agent0001', '00000000-0000-0000-0000-0000dept0001', 'pronto',
   '{"receita": 54412, "pedidos": 231, "prejuizo": -2329, "cmv_pct": 45.3, "chargebacks": 6132}'::jsonb),

  ('00000000-0000-0000-0000-000repor0003', '00000000-0000-0000-0000-000000000001', 'mensal',
   'Relatorio Mensal — Janeiro 2026',
   'Receita R$ 67.067 (324 pedidos). Lucro R$ 1.130. CMV 53,4%. Marketing R$ 16.708. Margem bruta 46,6%.',
   '2026-01', '00000000-0000-0000-0000-000agent0001', '00000000-0000-0000-0000-0000dept0001', 'pronto',
   '{"receita": 67067, "pedidos": 324, "lucro": 1130, "cmv_pct": 53.4, "margem_bruta": 46.6}'::jsonb),

  ('00000000-0000-0000-0000-000repor0004', '00000000-0000-0000-0000-000000000001', 'semanal',
   'Relatorio Marketing — Semana 13/2026',
   'Meta Ads: R$ 1.200 investidos, CTR 1,64%, CPC R$ 0,32. Instagram: 3 posts publicados, alcance 12.400. Sessoes site: 4.800.',
   '2026-W13', '00000000-0000-0000-0000-000agent0007', '00000000-0000-0000-0000-0000dept0002', 'pronto',
   '{"meta_ads_spend": 1200, "ctr": 1.64, "cpc": 0.32, "posts": 3, "alcance": 12400, "sessoes": 4800}'::jsonb),

  ('00000000-0000-0000-0000-000repor0005', '00000000-0000-0000-0000-000000000001', 'mensal',
   'Relatorio Vendas — Marco 2026',
   'Receita R$ 33.756 (155 pedidos). 42 conversas comerciais. Carrinho recuperado: R$ 7.600. Pipeline B2B: 8 contas ativas.',
   '2026-03', '00000000-0000-0000-0000-000agent0013', '00000000-0000-0000-0000-0000dept0003', 'pronto',
   '{"receita": 33756, "pedidos": 155, "conversas": 42, "carrinho_recuperado": 7600, "pipeline_b2b": 8}'::jsonb),

  ('00000000-0000-0000-0000-000repor0006', '00000000-0000-0000-0000-000000000001', 'mensal',
   'Relatorio Operacoes — Marco 2026',
   'Entregas: 155 pedidos, SLA 92%. Frete total R$ 6.103. 3 ocorrencias de avaria. Estoque: 2 SKUs criticos.',
   '2026-03', '00000000-0000-0000-0000-000agent0019', '00000000-0000-0000-0000-0000dept0004', 'pronto',
   '{"entregas": 155, "sla_pct": 92, "frete": 6103, "avarias": 3, "skus_criticos": 2}'::jsonb),

  ('00000000-0000-0000-0000-000repor0007', '00000000-0000-0000-0000-000000000001', 'mensal',
   'Relatorio Atendimento — Marco 2026',
   'Total atendimentos: 340. Resolucao automatica: 93%. Tempo medio: 2min. NPS: 62. Escalacoes: 24.',
   '2026-03', '00000000-0000-0000-0000-000agent0025', '00000000-0000-0000-0000-0000dept0005', 'pronto',
   '{"atendimentos": 340, "resolucao_auto_pct": 93, "tempo_medio_min": 2, "nps": 62, "escalacoes": 24}'::jsonb),

  ('00000000-0000-0000-0000-000repor0008', '00000000-0000-0000-0000-000000000001', 'trimestral',
   'Relatorio Trimestral Q1/2026',
   'Receita Q1: R$ 155.236. Margem media: 47,3%. Chargebacks em queda. 30 agentes operacionais.',
   '2026-Q1', '00000000-0000-0000-0000-000agent0001', NULL, 'gerando',
   '{}'::jsonb);

-- ============================================================
-- INTEGRATIONS (3 integrations)
-- ============================================================

INSERT INTO integrations (id, tenant_id, provider, type, display_name, config, status, health, last_sync_at) VALUES
  ('00000000-0000-0000-0000-000integ0001', '00000000-0000-0000-0000-000000000001', 'whatsapp', 'messaging',
   'WhatsApp Business API (Z-API)',
   '{"provider": "z-api", "instance": "mrlion-prod", "webhook": true}'::jsonb,
   'ativo', 'healthy', NOW() - INTERVAL '5 minutes'),

  ('00000000-0000-0000-0000-000integ0002', '00000000-0000-0000-0000-000000000001', 'supabase', 'database',
   'Supabase — Banco de Dados Principal',
   '{"project": "kairus-demo", "region": "sa-east-1"}'::jsonb,
   'ativo', 'healthy', NOW() - INTERVAL '1 minute'),

  ('00000000-0000-0000-0000-000integ0003', '00000000-0000-0000-0000-000000000001', 'meta', 'advertising',
   'Meta Business Suite',
   '{"account_id": "act_123456", "pixel_id": "px_789012"}'::jsonb,
   'ativo', 'healthy', NOW() - INTERVAL '30 minutes');

-- ============================================================
-- AUDIT LOG (15 recent entries)
-- ============================================================

INSERT INTO audit_log (tenant_id, agent_id, action, entity_type, entity_id, new_data, created_at) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0019', 'alerta_criado',       'alert',            '00000000-0000-0000-0000-000alert0001', '{"titulo": "Estoque critico Honey Garrafa"}'::jsonb,         NOW() - INTERVAL '3 hours'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0007', 'campanha_otimizada',  'campaign',          '00000000-0000-0000-0000-000campa0001', '{"acao": "CPC reduzido 18%"}'::jsonb,                        NOW() - INTERVAL '45 minutes'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0001', 'relatorio_gerado',    'report',            '00000000-0000-0000-0000-000repor0001', '{"tipo": "semanal"}'::jsonb,                                 NOW() - INTERVAL '5 hours'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0013', 'recompra_enviada',    'client',            '00000000-0000-0000-0000-00client0001', '{"clientes_b2b": 12}'::jsonb,                                NOW() - INTERVAL '1 hour'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0025', 'mensagens_respondidas','conversation',     NULL,                                    '{"total": 23, "automaticas": 20}'::jsonb,                    NOW() - INTERVAL '30 minutes'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0001', 'margem_detectada',    'financial_record',  NULL,                                    '{"produto": "Honey Pingente", "margem": -0.11}'::jsonb,      NOW() - INTERVAL '2 hours'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0008', 'conteudo_publicado',  'campaign',          NULL,                                    '{"plataforma": "Instagram", "posts": 3, "alcance": 12400}'::jsonb, NOW() - INTERVAL '8 hours'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0018', 'carrinho_recuperado', 'conversation',      '00000000-0000-0000-0000-000conv00007', '{"valor": 1540, "carrinhos": 7}'::jsonb,                     NOW() - INTERVAL '90 minutes'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0020', 'alerta_criado',       'alert',             '00000000-0000-0000-0000-000alert0005', '{"entregas_atrasadas": 3}'::jsonb,                           NOW() - INTERVAL '1 hour'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0002', 'conciliacao_feita',   'financial_record',  NULL,                                    '{"transacoes_pix": 340}'::jsonb,                             NOW() - INTERVAL '4 hours'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0027', 'tickets_classificados','alert',            NULL,                                    '{"total": 34, "urgentes": 12}'::jsonb,                       NOW() - INTERVAL '1 hour'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0005', 'preco_recalculado',   'financial_record',  NULL,                                    '{"skus": 8, "motivo": "reajuste_fornecedor"}'::jsonb,        NOW() - INTERVAL '3 hours'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0026', 'reclamacao_resolvida','conversation',      NULL,                                    '{"plataforma": "Reclame Aqui", "nota": "9/10"}'::jsonb,      NOW() - INTERVAL '4 hours'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0021', 'frete_renegociado',   'integration',       NULL,                                    '{"transportadora": "Correios", "economia_pct": 8}'::jsonb,   NOW() - INTERVAL '5 hours'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000agent0009', 'relatorio_gerado',    'report',            NULL,                                    '{"tipo": "funil_conversao", "periodo": "2026-03"}'::jsonb,   NOW() - INTERVAL '5 hours');
