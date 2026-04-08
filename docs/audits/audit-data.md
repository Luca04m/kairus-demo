# Auditoria de Dados Mock — Kairus OS Demo

**Data:** 2026-04-06
**Escopo:** Todos os arquivos em `src/data/`, API routes em `src/app/api/`, navegacao e coerencia cross-page.

---

## 1. Resumo Executivo

O conjunto de dados mock e **notavelmente consistente** para um demo. Os numeros financeiros (receita, pedidos, ticket medio) batem entre dashboard, financeiro, relatorios e inbox. Os agentes (Leo, Mia, Rex, Sol, Iris) sao consistentemente referenciados com os mesmos departamentos e acoes em todos os arquivos. No entanto, existem **23 issues** identificadas abaixo, agrupadas por severidade.

---

## 2. Analise Cross-Page de Numeros Financeiros

### 2.1 Receita Mar/2026

| Fonte | Valor | Status |
|-------|-------|--------|
| `dashboard.ts` KPIS_VISAO_GERAL | R$ 33.755 | -- |
| `financeiro.ts` FINANCEIRO_KPIS | R$ 33.755 | OK |
| `financeiro.ts` VENDAS_MENSAIS Mar/26 | 33.756 (numerico) | **DIVERGENCIA** |
| `relatorios.ts` rel-001 (Semana 13) | R$ 8.200/semana | Plausivel (4 semanas ~ R$ 32.800) |

**Issue F-01** [APERFEICOAR] Receita Mar/26 no KPI e R$ 33.755 mas em VENDAS_MENSAIS e 33.756 (diferenca de R$ 1). Alinhar para 33.755 ou 33.756 consistentemente.

### 2.2 Ticket Medio Mar/2026

| Fonte | Valor | Calculo |
|-------|-------|---------|
| `dashboard.ts` | R$ 217,78 | -- |
| `financeiro.ts` FINANCEIRO_KPIS | R$ 217,78 (155 pedidos) | OK |
| `financeiro.ts` VENDAS_MENSAIS | 33756 / 155 = R$ 217,78 | OK |
| `inbox.ts` inbox-msg-009 (Rex) | R$ 235 Fev, R$ 217 Mar | **DIVERGENCIA** |

**Issue F-02** [APERFEICOAR] Rex na inbox diz ticket medio caiu de R$ 235 (Fev) para R$ 217 (Mar). Mas Fev real: 54412/231 = R$ 235,55. O R$ 217 esta arredondado de R$ 217,78. Pequena inconsistencia de arredondamento — aceitavel para demo, mas idealmente alinhar.

### 2.3 Variacao Receita Mar vs Fev

- Dashboard: "-38%" => 33755/54412 = 0.620 => queda de 38%. **OK, correto.**
- Alerta alerta-005: "Receita Mar/26 -38% vs Fev/26". **OK.**

### 2.4 Pedidos Mar/2026

- Dashboard: 155 pedidos, variacao "-33%". Fev: 231 pedidos. 155/231 = 0.671 => queda de 32,9%. **OK, arredondado para -33%.**

### 2.5 Chargebacks Fev/2026

| Fonte | Valor |
|-------|-------|
| Alerta alerta-003 | R$ 6.132 (7,9% do faturamento) |
| `relatorios.ts` rel-002 | Chargebacks R$ 6.132 (7,9% — CRITICO) |
| `inbox.ts` inbox-msg-010 | R$ 6.132, 7,9% |
| Faturamento Fev: R$ 54.412 | 6132/54412 = 11,3% |

**Issue F-03** [MELHORAR] Chargebacks de R$ 6.132 representam 11,3% de R$ 54.412, nao 7,9% como declarado em 3 fontes. Para que 7,9% esteja correto, o faturamento bruto deveria ser ~R$ 77.600. **Corrigir a porcentagem para ~11,3% ou ajustar o valor de chargebacks para ~R$ 4.300.**

### 2.6 Receita Anual Acumulada (Abr/25 - Mar/26)

Soma de VENDAS_MENSAIS: 59680 + 78440 + 149426 + 91620 + 93360 + 57254 + 56566 + 491372 + 199412 + 67068 + 54412 + 33756 = **R$ 1.432.366**

TOP_PRODUTOS soma das receitas: 453684 + 448159 + 398201 + 223566 + 121585 + 94668 + 89628 + 72976 = **R$ 1.902.467**

**Issue F-04** [MELHORAR] TOP_PRODUTOS soma R$ 1.902.467 mas receita acumulada do periodo e R$ 1.432.366. Diferenca de R$ 470.101 (33% a mais). E a lista de TOP_PRODUTOS sequer inclui todos os produtos. Os percentuais somam 90,5%, implicando total de ~R$ 2.102.000. **Divergencia grave — recalcular TOP_PRODUTOS para bater com VENDAS_MENSAIS ou explicitar que TOP_PRODUTOS cobre um periodo diferente.**

### 2.7 Pico Nov/2025

VENDAS_MENSAIS Nov/25: R$ 491.372 (2.588 pedidos). Ticket medio: R$ 189,83.
- Muito acima dos outros meses (proximo maior: Dez/25 R$ 199.412).
- Para Black Friday de e-commerce de bebidas brasileiro, esse volume e **plausivel** mas o salto de ~5x vs meses normais e agressivo.

**Issue F-05** [APERFEICOAR] O pico de Nov/25 e 5,3x o mes anterior (Set/25). Embora Black Friday justifique pico, considerar suavizar para 3-4x para maior realismo (ex: R$ 280.000-350.000).

### 2.8 CMV e Margem

- FINANCEIRO_KPIS: Margem Bruta ~50%, CMV ~R$ 16.800 para receita R$ 33.755.
- 16800/33755 = 49,7%. **OK.**
- Relatorio Jan/26: CMV 53,4%, Margem bruta 46,6%. **Coerente (soma 100%).**
- Relatorio Fev/26: CMV 45,3%. **OK, variacao aceitavel.**

### 2.9 ROI Timeline vs Realidade

ROI_TIMELINE mostra "valor gerado" acumulado de R$ 142.000 em 6 meses (Out/25-Mar/26).
- ROI_CATEGORIAS soma: 45000 + 18000 + 32000 + 27000 + 20000 = R$ 142.000. **OK.**
- Investimento total: setup R$ 12.000 + 6 x R$ 7.500 = R$ 57.000. **OK.**
- ROI: (142000 - 57000) / 57000 = 149%. **OK.**
- Break-even no mes 3 (Dez/25): investimento acumulado R$ 34.500, valor R$ 58.000. **OK.**

**Issue F-06** [APERFEICOAR] "Otimizacao de campanhas" gerando R$ 45.000 e alto considerando que receita total Set/25-Mar/26 e ~R$ 468.000 e ROAS medio ta "1,1x". Considerar reduzir para ~R$ 25.000-30.000 para maior credibilidade.

---

## 3. Marketing — Consistencia de Metricas

### 3.1 ROAS

- Dashboard: ROAS "1,1x", periodo "Acumulado Set/25-Mar/26".
- CAMPANHAS_META: Set/25 ROAS "10,3x", todos outros meses "—" (sem dados).
- Se so temos 1 mes com ROAS, o acumulado nao pode ser calculado como "1,1x".

**Issue M-01** [MELHORAR] ROAS "1,1x" no dashboard nao bate com os dados de CAMPANHAS_META onde so Set/25 tem ROAS (10,3x) e o resto e "—". **Adicionar valores de ROAS para mais meses ou mudar o KPI para "10,3x (Set/25)" com nota de que meses recentes nao tem tracking de purchase.**

### 3.2 Variacao ROAS "-89%"

- Dashboard: variacao "-89%". Se ROAS era 10,3x e agora e 1,1x: (1,1-10,3)/10,3 = -89,3%. **Matematicamente correto**, mas so faz sentido se o 1,1x for um valor real calculado em algum lugar, o que nao e evidenciado nos dados de campanhas.

**Issue M-02** [APERFEICOAR] A variacao de ROAS faz sentido matematicamente, mas o valor atual "1,1x" nao tem lastro nos dados de campanha. Definir a fonte de calculo.

### 3.3 CPC e CTR

- Dashboard alerta: "CTR Meta Ads caiu de 4,59% para 1,64% (Set/25 -> Mar/26)". CAMPANHAS_META confirma: Set/25 CTR 4,59%, Mar/26 CTR 1,64%. **OK.**
- Alerta alerta-006: "CPC subiu de R$ 0,15 para R$ 0,32". CAMPANHAS_META: Set/25 CPC R$ 0,15, Mar/26 CPC R$ 0,32. **OK.**
- Inbox msg-008: "CTR caiu 64%". Calculo: (1,64 - 4,59) / 4,59 = -64,3%. **OK.**

### 3.4 Trafego vs Campanhas

- TRAFEGO_MENSAL Mar/26: 18.661 sessoes. MARKETING_KPIS: 18.661 sessoes. **OK.**
- CAMPANHAS_META Mar/26: 16.610 clicks. Sessoes site: 18.661. Clicks > sessoes deveria ser impossivel normalmente, mas clicks incluem todo tipo de click (nao so link clicks). Sessoes vindas de Meta + organico > clicks. **Plausivel.**

---

## 4. Agentes — Consistencia Cross-File

### 4.1 Status dos Agentes

| Agente | agentes.ts status | Dashboard "4/5" | Obs |
|--------|-------------------|-----------------|-----|
| Leo | ativo | -- | OK |
| Mia | ativo | -- | OK |
| Rex | ativo | -- | OK |
| Sol | ativo | -- | OK |
| Iris | **pausado** | -- | OK |

Dashboard diz "4/5 agentes ativos" e Iris esta pausada. **OK, consistente.**

### 4.2 Acoes dos Agentes Cross-Reference

| Agente | agentes.ts ultimaAcao | ATIVIDADE_RECENTE | INBOX | Consistente? |
|--------|----------------------|-------------------|-------|-------------|
| Leo | Detectou margem negativa Honey Pingente | OK (ativ-006) | OK (inbox-006) | OK |
| Mia | Otimizou campanha Verao 2026 CPC -18% | OK (ativ-002) | -- | OK |
| Rex | Lembrete recompra 12 clientes B2B | OK (ativ-004) | OK (inbox-004) | OK |
| Sol | Alerta estoque Honey Garrafa < 50 | OK (ativ-001) | OK (inbox-001) | OK |
| Iris | 23 msgs WhatsApp automaticamente | OK (ativ-005) | OK (inbox-005) | OK |

**Excelente consistencia cross-file nos agentes.**

### 4.3 Tarefas Concluidas do Agent Analytics

- AGENT_ANALYTICS_DEMO: 47 concluidas, 2 falhadas, taxa 96%.
- Leo em agentes.ts: 47 concluidas, 2 falhadas, 96%. **OK, analytics parece ser do Leo.**
- tarefasPorDia soma: concluidas = 1+2+1+2+3+0+0+2+1+3+2+1+0+0+2+1+3+2+1+0+0+2+3+2+1+2+0+0+3+2 = 42.

**Issue A-01** [MELHORAR] tarefasPorDia soma 42 concluidas, mas tarefasConcluidas diz 47. Faltam 5 tarefas. **Ajustar os valores diarios para somar 47, ou reduzir tarefasConcluidas para 42.**

### 4.4 Tarefas Falhadas do Agent Analytics

- tarefasPorDia soma falhadas: 0+0+0+1+0+0+0+0+0+0+0+0+0+0+0+1+0+0+0+0+0+0+0+0+0+0+0+0+0+0 = 2. **OK, bate com tarefasFalhadas: 2.**

---

## 5. Datas — Consistencia Temporal

### 5.1 Contexto Temporal

O demo opera como se "hoje" fosse inicio de Abril/2026. A maioria dos dados referencia Mar/2026 como ultimo mes completo. **OK, consistente.**

### 5.2 Timestamps Relativos

Todas as referencias "ha Xh" sao relativas e nao ancoradas a datas absolutas. **OK para demo.**

### 5.3 Roadmap Dates

- rm-002 "Dashboard ROI": done, data_fim 2026-02-15. Pagina /roi existe. **OK.**
- rm-001 "WhatsApp Business": in_progress, data_fim 2026-04-30. Iris ja usa WhatsApp. **Coerente.**

**Issue D-01** [APERFEICOAR] Tarefas em tarefas.ts tem datas de 01/04/2026 e 02/04/2026, mas a data de hoje no app e 06/04. Tarefas "em_progresso" criadas ha 4-5 dias sem atualizacao de progresso podem parecer estagnadas. Considerar datas mais recentes (03-05/04) para tarefas in-progress.

---

## 6. Configuracoes — Inconsistencias

### 6.1 Email de Recuperacao

- `configuracoes.ts`: email recuperacao "carlos@mrlion.com.br".
- USUARIO em `dashboard.ts`: "luca@mrlion.com.br".
- `agent-demo.ts` demo-004: relatorio enviado para "carlos@mrlion.com.br".

**Issue C-01** [MELHORAR] O usuario logado e "Luca Moreno" (luca@mrlion.com.br) mas o email de recuperacao em configuracoes e "carlos@mrlion.com.br". Se Carlos e o dono da empresa e Luca o operador, isso pode fazer sentido, mas nao esta explicito. No agent-demo, o relatorio tambem e enviado para carlos@. **Alinhar para luca@ ou adicionar contexto de que Carlos e o dono.**

### 6.2 Integracao WhatsApp

- Configuracoes: WhatsApp Business API toggle = true (ativado).
- Iris esta com status "pausado".
- Iris respondeu 23 msgs ha 30min.

**Issue C-02** [APERFEICOAR] Iris esta "pausado" mas teria respondido msgs "ha 30min". Se pausado significa "nao executando novas tarefas", a acao recente deveria ter timestamp maior (ex: "ha 2h" antes de ser pausada).

---

## 7. Honey Pingente — Margem Negativa

- Inbox msg-006: preco R$ 89,90, CMV R$ 52,00, frete R$ 38,00. Total custo: R$ 90,00. Prejuizo: -R$ 0,10/unidade.
- TOP_PRODUTOS: Honey Pingente, R$ 121.585, 834 unidades. Preco medio: R$ 121585/834 = R$ 145,78.

**Issue P-01** [MELHORAR] A inbox diz preco do Honey Pingente e R$ 89,90 mas TOP_PRODUTOS implica preco medio de R$ 145,78/unidade. **Divergencia significativa. Ajustar: ou o preco na inbox esta errado, ou TOP_PRODUTOS inclui vendas em kit/bundle a preco maior.**

---

## 8. Analise de Rotas e Navegacao

### 8.1 Sidebar vs Pages Existentes

| Sidebar Link | Page Existente? | Status |
|-------------|----------------|--------|
| / | src/app/page.tsx (BeamHomeContent) | OK |
| /agent-templates | src/app/agent-templates/page.tsx | OK |
| /views | src/app/views/page.tsx | OK |
| /agent/demo-agent | src/app/agent/[id]/page.tsx | OK |
| /agent/demo-agent/tasks | src/app/agent/[id]/tasks/page.tsx | OK |
| /agent/demo-agent/flow | src/app/agent/[id]/flow/page.tsx | OK |
| /agent/demo-agent/settings | src/app/agent/[id]/settings/page.tsx | OK |
| /agent/demo-agent/analytics | src/app/agent/[id]/analytics/page.tsx | OK |
| /dashboard | src/app/dashboard/page.tsx | OK |
| /world | src/app/world/page.tsx | OK |
| /equipe | src/app/equipe/page.tsx | OK |
| /sales-room | src/app/sales-room/page.tsx | OK |
| /roadmap | src/app/roadmap/page.tsx | OK |
| /tasks | src/app/tasks/page.tsx | OK |
| /marketing | src/app/marketing/page.tsx | OK |
| /financeiro | src/app/financeiro/page.tsx | OK |
| /roi | src/app/roi/page.tsx | OK |
| /relatorios | src/app/relatorios/page.tsx | OK |
| /configuracoes | src/app/configuracoes/page.tsx | OK |
| /integrations | src/app/integrations/page.tsx | OK |
| /inbox | src/app/inbox/page.tsx | OK |
| /settings | src/app/settings/page.tsx | OK |

**Todas as rotas da sidebar tem paginas correspondentes. Nenhuma rota orfan na sidebar.**

### 8.2 Paginas sem Link na Sidebar

| Page | Na Sidebar? | Status |
|------|------------|--------|
| /login | Nao (excluida do shell) | OK, rota de auth |

### 8.3 Rotas Duplicadas / Sobrepostas

**Issue R-01** [MELHORAR] `/configuracoes` e `/settings` sao duas paginas separadas na sidebar. "Configuracoes" esta na secao "Sistema" e "Settings" no rodape. Ambas tratam de configuracoes do usuario/app. **Consolidar em uma unica rota ou diferenciar claramente (ex: /configuracoes = config do Kairus, /settings = config da conta pessoal).**

### 8.4 API Routes vs Uso nas Paginas

Todas as API routes (`/api/agents`, `/api/alerts`, `/api/campaigns`, etc.) dependem de Supabase via `getAuthContext()`. Em modo demo (Supabase pausado), todas retornam 401. As paginas usam dados mock de `src/data/` diretamente.

**Issue R-02** [APERFEICOAR] API routes existem mas sao inacessiveis em modo demo (retornam 401 sem Supabase). Nao e um problema funcional (paginas usam mock data), mas e codigo morto no contexto do demo. Considerar adicionar fallback para mock data nas API routes ou documentar que sao preparacao para producao.

### 8.5 API Routes sem Pagina Correspondente

| API Route | Pagina Consumer | Status |
|-----------|----------------|--------|
| /api/approvals | Nenhuma visivel | **Orfan** |
| /api/clients | Nenhuma visivel | **Orfan** |
| /api/sales/conversations | /sales-room (possivel) | Verificar |
| /api/sales/metrics | /sales-room (possivel) | Verificar |
| /api/world/rooms | /world (possivel) | Verificar |
| /api/world/presence | /world (possivel) | Verificar |
| /api/world/notifications | /world (possivel) | Verificar |

**Issue R-03** [APERFEICOAR] `/api/approvals` e `/api/clients` nao tem paginas visualmente correspondentes na sidebar. Podem ser usadas internamente por componentes, mas no modo demo nao funcionam (Supabase). Baixa prioridade.

---

## 9. Dados do Roadmap

### 9.1 Departamentos no Roadmap vs DEPARTAMENTOS

DEPARTAMENTOS: financeiro, marketing, vendas, operacoes, atendimento.
Roadmap usa: Vendas, Marketing, Financeiro, Operacoes, Atendimento, **Tech**.

**Issue RD-01** [APERFEICOAR] Roadmap inclui departamento "Tech" que nao existe em DEPARTAMENTOS. O world-layout mapeia Tech sob "operacoes" com nota explicativa. Consistencia aceitavel, mas pode confundir.

### 9.2 Squads no Roadmap

Roadmap usa squads: Growth, Analytics, Platform, CX. Essas nao estao definidas em nenhum arquivo de dados (foram deletadas: `src/lib/squads/` aparece como deleted no git status).

**Issue RD-02** [APERFEICOAR] Squads referenciadas no roadmap (Growth, Analytics, Platform, CX) nao tem definicao local. Aceitavel para demo, mas poderia confundir se alguem procurar a fonte.

---

## 10. Realismo para PME Brasileira de Bebidas

### 10.1 Faixa de Receita

Receita anual ~R$ 1.4M. Para e-commerce de bebidas artesanais, **plausivel** — corresponde a uma micro/pequena empresa em crescimento.

### 10.2 Investimento em Marketing

Meta Ads investimento mensal: R$ 4.000-10.000. **Realista** para PME de e-commerce.

### 10.3 Ticket Medio

R$ 189-235 por pedido. Para bebidas artesanais premium (honey, cappuccino), **plausivel** — indica compras de multiplos itens ou kits.

### 10.4 Quantidade de SKUs

Inbox msg-007: 12 SKUs ativos. TOP_PRODUTOS lista 8. **Realista para marca de bebidas artesanais.**

### 10.5 Taxa de Chargebacks

7,9-11,3% e **extremamente alta** — bandeiras de cartao consideram >1% como excessivo. Mas o dado e apresentado como problema critico, o que e a narrativa correta.

---

## 11. Tabela Consolidada de Issues

| ID | Severidade | Arquivo(s) | Descricao | Classificacao |
|----|-----------|-----------|-----------|---------------|
| F-01 | Baixa | dashboard.ts, financeiro.ts | Receita R$ 33.755 vs 33.756 (R$ 1 de diferenca) | APERFEICOAR |
| F-02 | Baixa | inbox.ts | Ticket medio R$ 217 arredondado vs R$ 217,78 | APERFEICOAR |
| F-03 | **Alta** | dashboard.ts, relatorios.ts, inbox.ts | Chargeback 7,9% esta errado (deveria ser ~11,3% de R$ 54.412) | MELHORAR |
| F-04 | **Alta** | financeiro.ts | TOP_PRODUTOS soma R$ 1.9M vs receita anual R$ 1.4M | MELHORAR |
| F-05 | Baixa | financeiro.ts | Pico Nov/25 de 5,3x pode ser exagerado | APERFEICOAR |
| F-06 | Media | roi.ts | ROI "otimizacao campanhas" R$ 45k alto vs ROAS fraco | APERFEICOAR |
| M-01 | **Alta** | dashboard.ts, marketing.ts | ROAS "1,1x" sem lastro nos dados de campanha | MELHORAR |
| M-02 | Media | dashboard.ts | Variacao ROAS -89% sem fonte clara | APERFEICOAR |
| A-01 | Media | agent-demo.ts | tarefasPorDia soma 42, deveria ser 47 | MELHORAR |
| D-01 | Baixa | tarefas.ts | Datas de tarefas in-progress podem parecer estagnadas | APERFEICOAR |
| C-01 | Media | configuracoes.ts, agent-demo.ts | Email "carlos@" vs usuario "luca@" sem contexto | MELHORAR |
| C-02 | Baixa | agentes.ts, inbox.ts | Iris "pausado" mas com acao "ha 30min" | APERFEICOAR |
| P-01 | **Alta** | inbox.ts, financeiro.ts | Honey Pingente preco R$ 89,90 vs media R$ 145,78 | MELHORAR |
| R-01 | Media | AppSidebar.tsx | /configuracoes e /settings duplicam funcao | MELHORAR |
| R-02 | Baixa | src/app/api/ | API routes inacessiveis em demo mode | APERFEICOAR |
| R-03 | Baixa | src/app/api/ | /api/approvals e /api/clients sem pagina na sidebar | APERFEICOAR |
| RD-01 | Baixa | roadmapSeed.ts | Departamento "Tech" nao existe em DEPARTAMENTOS | APERFEICOAR |
| RD-02 | Baixa | roadmapSeed.ts | Squads (Growth, etc.) sem definicao local | APERFEICOAR |

---

## 12. Recomendacoes Prioritarias

### MELHORAR (corrigir para demo crivel)

1. **F-03**: Recalcular porcentagem de chargeback. Se quiser manter 7,9%, ajustar valor para ~R$ 4.300. Se quiser manter R$ 6.132, corrigir para ~11,3%.

2. **F-04**: Recalcular TOP_PRODUTOS para que a soma bata com receita acumulada de R$ 1.432.366. Ajustar receitas individuais proporcionalmente (dividir por ~1.33).

3. **M-01**: Ou remover ROAS do dashboard KPI (ja que nao ha dados de purchase), ou adicionar ROAS estimados nas CAMPANHAS_META para meses alem de Set/25.

4. **P-01**: Alinhar preco do Honey Pingente. Se R$ 89,90 e o preco unitario, entao TOP_PRODUTOS deveria mostrar ~R$ 74.976 (834 x R$ 89,90) ao inves de R$ 121.585.

5. **A-01**: Ajustar tarefasPorDia para somar 47. Adicionar 5 tarefas distribuidas nos dias existentes.

6. **C-01**: Trocar email de recuperacao para "luca@mrlion.com.br" ou adicionar campo visivel "Dono: Carlos Moreno" no perfil.

7. **R-01**: Diferenciar /configuracoes (config do Kairus OS) de /settings (conta pessoal) com subtitulos claros, ou consolidar.

### APERFEICOAR (polish para impressionar)

8. **F-01**: Alinhar R$ 33.755 vs 33.756.
9. **F-05**: Suavizar pico Nov/25 para ~R$ 300.000-350.000.
10. **F-06**: Reduzir "Otimizacao de campanhas" no ROI para ~R$ 25.000.
11. **M-02**: Documentar fonte do ROAS 1,1x.
12. **C-02**: Mudar timestamp da Iris para "ha 2h" e status para "idle" ou manter "ativo" com timestamp atual.
13. **D-01**: Atualizar datas de tarefas em_progresso para 04-05/04.
14. **R-02**: Adicionar comentario nos API routes explicando que sao prep para producao.

### REMOVER

Nenhum arquivo ou rota precisa ser removido. Todo o codigo tem proposito, mesmo que as API routes sejam inativas em modo demo.

---

## 13. Conclusao

O dataset mock e de **alta qualidade** para um demo. A narrativa e coerente (empresa em dificuldade pos-Black Friday, receita caindo, chargebacks altos, agentes de IA ajudando a identificar problemas). Os 4 issues de alta prioridade (F-03, F-04, M-01, P-01) devem ser corrigidos antes de qualquer apresentacao ao cliente, pois envolvem numeros que um dono de PME atento perceberia. Os demais sao refinamentos cosmeticos.
