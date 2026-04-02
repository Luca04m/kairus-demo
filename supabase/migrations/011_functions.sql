-- ============================================================
-- 011_functions.sql — Database functions for dashboard,
-- department stats, agent performance, financial summary,
-- and sales metrics.
-- All functions are SECURITY DEFINER with tenant_id checks.
-- ============================================================

-- ============================================================
-- get_dashboard_stats(p_tenant_id uuid)
-- Returns high-level KPIs for the main dashboard
-- ============================================================

CREATE OR REPLACE FUNCTION get_dashboard_stats(p_tenant_id UUID)
RETURNS TABLE (
  total_agents      BIGINT,
  active_agents     BIGINT,
  total_departments BIGINT,
  pending_approvals BIGINT,
  active_alerts     BIGINT,
  total_clients     BIGINT,
  conversion_rate   NUMERIC,
  monthly_revenue   NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    (SELECT COUNT(*) FROM agents a WHERE a.tenant_id = p_tenant_id)::BIGINT
      AS total_agents,

    (SELECT COUNT(*) FROM agents a WHERE a.tenant_id = p_tenant_id AND a.status = 'ativo')::BIGINT
      AS active_agents,

    (SELECT COUNT(*) FROM departments d WHERE d.tenant_id = p_tenant_id)::BIGINT
      AS total_departments,

    (SELECT COUNT(*) FROM approvals ap WHERE ap.tenant_id = p_tenant_id AND ap.status = 'pendente')::BIGINT
      AS pending_approvals,

    (SELECT COUNT(*) FROM alerts al WHERE al.tenant_id = p_tenant_id AND al.status IN ('ativo', 'reconhecido'))::BIGINT
      AS active_alerts,

    (SELECT COUNT(*) FROM clients c WHERE c.tenant_id = p_tenant_id AND c.status != 'churned')::BIGINT
      AS total_clients,

    COALESCE(
      (SELECT AVG(sm.conversion_rate)
       FROM sales_metrics sm
       WHERE sm.tenant_id = p_tenant_id
         AND sm.period = TO_CHAR(CURRENT_DATE, 'YYYY-MM')),
      0
    )::NUMERIC
      AS conversion_rate,

    COALESCE(
      (SELECT SUM(fr.amount)
       FROM financial_records fr
       WHERE fr.tenant_id = p_tenant_id
         AND fr.type = 'receita'
         AND fr.period = TO_CHAR(CURRENT_DATE, 'YYYY-MM')),
      0
    )::NUMERIC
      AS monthly_revenue;
END;
$$;

COMMENT ON FUNCTION get_dashboard_stats IS
  'Returns aggregate dashboard KPIs for a given tenant: agent counts, pending approvals, active alerts, client count, conversion rate, and current month revenue.';

-- ============================================================
-- get_department_stats(p_tenant_id uuid)
-- Returns per-department statistics
-- ============================================================

CREATE OR REPLACE FUNCTION get_department_stats(p_tenant_id UUID)
RETURNS TABLE (
  department_id   UUID,
  department_name TEXT,
  department_color TEXT,
  department_emoji TEXT,
  agent_count     BIGINT,
  active_count    BIGINT,
  alert_count     BIGINT,
  performance_avg NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    d.id                AS department_id,
    d.name              AS department_name,
    d.color             AS department_color,
    d.emoji             AS department_emoji,

    (SELECT COUNT(*)
     FROM agents a
     WHERE a.department_id = d.id AND a.tenant_id = p_tenant_id
    )::BIGINT AS agent_count,

    (SELECT COUNT(*)
     FROM agents a
     WHERE a.department_id = d.id AND a.tenant_id = p_tenant_id AND a.status = 'ativo'
    )::BIGINT AS active_count,

    (SELECT COUNT(*)
     FROM alerts al
     WHERE al.tenant_id = p_tenant_id
       AND al.department = d.name
       AND al.status IN ('ativo', 'reconhecido')
    )::BIGINT AS alert_count,

    COALESCE(
      (SELECT AVG((a.performance_metrics->>'approval_rate')::NUMERIC)
       FROM agents a
       WHERE a.department_id = d.id
         AND a.tenant_id = p_tenant_id
         AND a.performance_metrics->>'approval_rate' IS NOT NULL
      ),
      0
    )::NUMERIC AS performance_avg

  FROM departments d
  WHERE d.tenant_id = p_tenant_id
  ORDER BY d.order_index;
END;
$$;

COMMENT ON FUNCTION get_department_stats IS
  'Returns per-department stats: agent counts, active alerts, and average approval rate for a given tenant.';

-- ============================================================
-- get_agent_performance(p_agent_id uuid)
-- Returns performance metrics for a single agent
-- ============================================================

CREATE OR REPLACE FUNCTION get_agent_performance(p_agent_id UUID)
RETURNS TABLE (
  agent_name          TEXT,
  agent_status        agent_status,
  department_name     TEXT,
  squad_name          TEXT,
  tasks_completed     INTEGER,
  tasks_failed        INTEGER,
  approval_rate       NUMERIC,
  avg_response_time   INTERVAL,
  total_conversations BIGINT,
  resolved_conversations BIGINT,
  satisfaction_score  NUMERIC,
  uptime_percent      NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  -- Get the tenant for this agent
  SELECT a.tenant_id INTO v_tenant_id
  FROM agents a WHERE a.id = p_agent_id;

  IF v_tenant_id IS NULL THEN
    RAISE EXCEPTION 'Agent not found: %', p_agent_id;
  END IF;

  RETURN QUERY
  SELECT
    a.name                                                     AS agent_name,
    a.status                                                   AS agent_status,
    d.name                                                     AS department_name,
    s.name                                                     AS squad_name,
    COALESCE((a.performance_metrics->>'tasks_completed')::INTEGER, 0) AS tasks_completed,
    COALESCE((a.performance_metrics->>'tasks_failed')::INTEGER, 0)    AS tasks_failed,
    COALESCE((a.performance_metrics->>'approval_rate')::NUMERIC, 0)   AS approval_rate,

    -- Average response time from sales_metrics (last period)
    (SELECT sm.avg_response_time
     FROM sales_metrics sm
     WHERE sm.agent_id = p_agent_id
     ORDER BY sm.period DESC
     LIMIT 1
    ) AS avg_response_time,

    -- Total conversations assigned
    (SELECT COUNT(*)
     FROM conversations c
     WHERE c.agent_id = p_agent_id
    )::BIGINT AS total_conversations,

    -- Resolved conversations
    (SELECT COUNT(*)
     FROM conversations c
     WHERE c.agent_id = p_agent_id AND c.status = 'resolvida'
    )::BIGINT AS resolved_conversations,

    -- Satisfaction: average positive sentiment ratio from messages
    COALESCE(
      (SELECT
        ROUND(
          COUNT(*) FILTER (WHERE m.sentiment = 'positivo')::NUMERIC
          / NULLIF(COUNT(*) FILTER (WHERE m.sentiment IS NOT NULL), 0)
          * 100, 1
        )
       FROM messages m
       JOIN conversations c ON c.id = m.conversation_id
       WHERE c.agent_id = p_agent_id
         AND m.source = 'cliente'
      ),
      0
    )::NUMERIC AS satisfaction_score,

    -- Uptime: percentage based on tasks_completed / (completed + failed)
    CASE
      WHEN COALESCE((a.performance_metrics->>'tasks_completed')::INTEGER, 0) +
           COALESCE((a.performance_metrics->>'tasks_failed')::INTEGER, 0) = 0
      THEN 100.0
      ELSE ROUND(
        COALESCE((a.performance_metrics->>'tasks_completed')::INTEGER, 0)::NUMERIC /
        (COALESCE((a.performance_metrics->>'tasks_completed')::INTEGER, 0) +
         COALESCE((a.performance_metrics->>'tasks_failed')::INTEGER, 0))::NUMERIC
        * 100, 1
      )
    END AS uptime_percent

  FROM agents a
  LEFT JOIN departments d ON d.id = a.department_id
  LEFT JOIN squads s ON s.id = a.squad_id
  WHERE a.id = p_agent_id;
END;
$$;

COMMENT ON FUNCTION get_agent_performance IS
  'Returns detailed performance metrics for a specific agent including tasks, conversations, satisfaction, and uptime.';

-- ============================================================
-- get_financial_summary(p_tenant_id uuid, p_period text)
-- Returns financial breakdown by category for a period
-- ============================================================

CREATE OR REPLACE FUNCTION get_financial_summary(p_tenant_id UUID, p_period TEXT DEFAULT NULL)
RETURNS TABLE (
  category      TEXT,
  total_revenue NUMERIC,
  total_expenses NUMERIC,
  total_costs   NUMERIC,
  total_investments NUMERIC,
  margin        NUMERIC,
  growth_rate   NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_period TEXT;
  v_prev_period TEXT;
BEGIN
  -- Default to current month if not specified
  v_period := COALESCE(p_period, TO_CHAR(CURRENT_DATE, 'YYYY-MM'));

  -- Calculate previous period for growth rate
  v_prev_period := TO_CHAR(
    (TO_DATE(v_period || '-01', 'YYYY-MM-DD') - INTERVAL '1 month'),
    'YYYY-MM'
  );

  RETURN QUERY
  WITH current_period AS (
    SELECT
      fr.category,
      SUM(CASE WHEN fr.type = 'receita' THEN fr.amount ELSE 0 END) AS revenue,
      SUM(CASE WHEN fr.type = 'despesa' THEN fr.amount ELSE 0 END) AS expenses,
      SUM(CASE WHEN fr.type = 'custo' THEN fr.amount ELSE 0 END) AS costs,
      SUM(CASE WHEN fr.type = 'investimento' THEN fr.amount ELSE 0 END) AS investments
    FROM financial_records fr
    WHERE fr.tenant_id = p_tenant_id
      AND fr.period = v_period
    GROUP BY fr.category
  ),
  previous_period AS (
    SELECT
      fr.category,
      SUM(CASE WHEN fr.type = 'receita' THEN fr.amount ELSE 0 END) AS prev_revenue,
      SUM(CASE WHEN fr.type = 'despesa' THEN fr.amount ELSE 0 END) AS prev_expenses
    FROM financial_records fr
    WHERE fr.tenant_id = p_tenant_id
      AND fr.period = v_prev_period
    GROUP BY fr.category
  )
  SELECT
    cp.category,
    cp.revenue          AS total_revenue,
    cp.expenses         AS total_expenses,
    cp.costs            AS total_costs,
    cp.investments      AS total_investments,

    -- Margin: (revenue - costs - expenses) / revenue * 100
    CASE
      WHEN cp.revenue > 0
      THEN ROUND((cp.revenue - cp.costs - cp.expenses) / cp.revenue * 100, 2)
      ELSE 0
    END AS margin,

    -- Growth rate vs previous period (revenue-based)
    CASE
      WHEN COALESCE(pp.prev_revenue, 0) > 0
      THEN ROUND((cp.revenue - pp.prev_revenue) / pp.prev_revenue * 100, 2)
      WHEN cp.revenue > 0 THEN 100.00
      ELSE 0
    END AS growth_rate

  FROM current_period cp
  LEFT JOIN previous_period pp ON pp.category = cp.category
  ORDER BY cp.revenue DESC NULLS LAST;
END;
$$;

COMMENT ON FUNCTION get_financial_summary IS
  'Returns financial summary by category for a given period: revenue, expenses, costs, investments, margin, and MoM growth rate.';

-- ============================================================
-- get_sales_metrics(p_tenant_id uuid)
-- Returns current sales KPIs
-- ============================================================

CREATE OR REPLACE FUNCTION get_sales_metrics(p_tenant_id UUID)
RETURNS TABLE (
  active_conversations BIGINT,
  carts_recovered      BIGINT,
  conversion_rate      NUMERIC,
  leads_today          BIGINT,
  revenue_this_month   NUMERIC,
  avg_ticket           NUMERIC,
  total_orders         BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
DECLARE
  v_current_period TEXT;
BEGIN
  v_current_period := TO_CHAR(CURRENT_DATE, 'YYYY-MM');

  RETURN QUERY
  SELECT
    -- Active conversations (not resolved)
    (SELECT COUNT(*)
     FROM conversations c
     WHERE c.tenant_id = p_tenant_id
       AND c.status IN ('aberta', 'em_andamento', 'aguardando')
    )::BIGINT AS active_conversations,

    -- Carts recovered (conversations with subject containing 'carrinho' that resolved)
    (SELECT COUNT(*)
     FROM conversations c
     WHERE c.tenant_id = p_tenant_id
       AND c.status = 'resolvida'
       AND LOWER(c.subject) LIKE '%carrinho%'
    )::BIGINT AS carts_recovered,

    -- Average conversion rate this month
    COALESCE(
      (SELECT AVG(sm.conversion_rate)
       FROM sales_metrics sm
       WHERE sm.tenant_id = p_tenant_id
         AND sm.period = v_current_period),
      0
    )::NUMERIC AS conversion_rate,

    -- Leads created today
    (SELECT COUNT(*)
     FROM clients cl
     WHERE cl.tenant_id = p_tenant_id
       AND cl.status = 'lead'
       AND cl.created_at >= CURRENT_DATE
    )::BIGINT AS leads_today,

    -- Revenue this month
    COALESCE(
      (SELECT SUM(fr.amount)
       FROM financial_records fr
       WHERE fr.tenant_id = p_tenant_id
         AND fr.type = 'receita'
         AND fr.period = v_current_period),
      0
    )::NUMERIC AS revenue_this_month,

    -- Average ticket (revenue / orders count from financial description)
    COALESCE(
      (SELECT
        CASE WHEN SUM(sm.conversations_total) > 0
          THEN SUM(sm.revenue_generated) / SUM(sm.conversations_total)
          ELSE 0
        END
       FROM sales_metrics sm
       WHERE sm.tenant_id = p_tenant_id
         AND sm.period = v_current_period
         AND sm.revenue_generated > 0),
      0
    )::NUMERIC AS avg_ticket,

    -- Total orders (sum of conversations_total from sales agents)
    COALESCE(
      (SELECT SUM(sm.conversations_total)
       FROM sales_metrics sm
       WHERE sm.tenant_id = p_tenant_id
         AND sm.period = v_current_period),
      0
    )::BIGINT AS total_orders;
END;
$$;

COMMENT ON FUNCTION get_sales_metrics IS
  'Returns current sales KPIs: active conversations, carts recovered, conversion rate, leads today, monthly revenue, average ticket, and total orders.';

-- ============================================================
-- get_alert_summary(p_tenant_id uuid)
-- Returns alert counts grouped by severity and department
-- ============================================================

CREATE OR REPLACE FUNCTION get_alert_summary(p_tenant_id UUID)
RETURNS TABLE (
  department       TEXT,
  critico_count    BIGINT,
  alto_count       BIGINT,
  medio_count      BIGINT,
  baixo_count      BIGINT,
  info_count       BIGINT,
  total_active     BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    al.department,
    COUNT(*) FILTER (WHERE al.severity = 'critico' AND al.status IN ('ativo', 'reconhecido'))::BIGINT AS critico_count,
    COUNT(*) FILTER (WHERE al.severity = 'alto'    AND al.status IN ('ativo', 'reconhecido'))::BIGINT AS alto_count,
    COUNT(*) FILTER (WHERE al.severity = 'medio'   AND al.status IN ('ativo', 'reconhecido'))::BIGINT AS medio_count,
    COUNT(*) FILTER (WHERE al.severity = 'baixo'   AND al.status IN ('ativo', 'reconhecido'))::BIGINT AS baixo_count,
    COUNT(*) FILTER (WHERE al.severity = 'info'    AND al.status IN ('ativo', 'reconhecido'))::BIGINT AS info_count,
    COUNT(*) FILTER (WHERE al.status IN ('ativo', 'reconhecido'))::BIGINT AS total_active
  FROM alerts al
  WHERE al.tenant_id = p_tenant_id
  GROUP BY al.department
  ORDER BY total_active DESC;
END;
$$;

COMMENT ON FUNCTION get_alert_summary IS
  'Returns active alert counts grouped by severity and department for a given tenant.';

-- ============================================================
-- get_world_overview(p_tenant_id uuid)
-- Returns room data with agent presence counts
-- ============================================================

CREATE OR REPLACE FUNCTION get_world_overview(p_tenant_id UUID)
RETURNS TABLE (
  room_id          UUID,
  room_name        TEXT,
  room_domain      TEXT,
  room_status      room_status,
  room_color       TEXT,
  room_icon        TEXT,
  room_x           NUMERIC,
  room_y           NUMERIC,
  agents_online    BIGINT,
  agents_total     BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    wr.id       AS room_id,
    wr.name     AS room_name,
    wr.domain   AS room_domain,
    wr.status   AS room_status,
    wr.color    AS room_color,
    wr.icon     AS room_icon,
    wr.x        AS room_x,
    wr.y        AS room_y,

    (SELECT COUNT(*)
     FROM agent_presence ap
     WHERE ap.room_id = wr.id AND ap.status IN ('online', 'ocupado')
    )::BIGINT AS agents_online,

    (SELECT COUNT(*)
     FROM agent_presence ap
     WHERE ap.room_id = wr.id
    )::BIGINT AS agents_total

  FROM world_rooms wr
  WHERE wr.tenant_id = p_tenant_id
  ORDER BY wr.y, wr.x;
END;
$$;

COMMENT ON FUNCTION get_world_overview IS
  'Returns all world rooms with online/total agent presence counts for the map visualization.';

-- ============================================================
-- get_recent_activity(p_tenant_id uuid, p_limit integer)
-- Returns recent audit log entries enriched with agent names
-- ============================================================

CREATE OR REPLACE FUNCTION get_recent_activity(p_tenant_id UUID, p_limit INTEGER DEFAULT 20)
RETURNS TABLE (
  log_id      UUID,
  agent_name  TEXT,
  action      TEXT,
  entity_type TEXT,
  entity_id   UUID,
  details     JSONB,
  created_at  TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
STABLE
AS $$
BEGIN
  RETURN QUERY
  SELECT
    al.id          AS log_id,
    a.name         AS agent_name,
    al.action,
    al.entity_type,
    al.entity_id,
    COALESCE(al.new_data, '{}'::jsonb) AS details,
    al.created_at
  FROM audit_log al
  LEFT JOIN agents a ON a.id = al.agent_id
  WHERE al.tenant_id = p_tenant_id
  ORDER BY al.created_at DESC
  LIMIT p_limit;
END;
$$;

COMMENT ON FUNCTION get_recent_activity IS
  'Returns the most recent audit log entries with agent names for the activity feed.';
