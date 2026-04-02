-- ============================================================
-- 009_rls_policies.sql — Row Level Security for all tables
-- Enforces tenant isolation via auth.users metadata
-- ============================================================

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT tenant_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION get_user_role_enum()
RETURNS user_role LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE squads ENABLE ROW LEVEL SECURITY;
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_margins ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE approval_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmap_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE world_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- TENANTS — users see only their tenant
-- ============================================================

CREATE POLICY tenants_select ON tenants FOR SELECT
  USING (id = get_user_tenant_id());

CREATE POLICY tenants_update ON tenants FOR UPDATE
  USING (id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));

-- ============================================================
-- PROFILES — users see their tenant; update own or admin
-- ============================================================

CREATE POLICY profiles_select ON profiles FOR SELECT
  USING (tenant_id = get_user_tenant_id());

CREATE POLICY profiles_update ON profiles FOR UPDATE
  USING (
    tenant_id = get_user_tenant_id()
    AND (id = auth.uid() OR get_user_role_enum() IN ('owner', 'admin'))
  );

-- ============================================================
-- TENANT-SCOPED TABLES — standard read/write by tenant
-- ============================================================

-- Macro: all authenticated users in the tenant can SELECT;
-- owner/admin/operator can INSERT/UPDATE; only owner/admin can DELETE.

-- DEPARTMENTS
CREATE POLICY departments_select ON departments FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY departments_insert ON departments FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));
CREATE POLICY departments_update ON departments FOR UPDATE
  USING (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));
CREATE POLICY departments_delete ON departments FOR DELETE
  USING (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));

-- SQUADS
CREATE POLICY squads_select ON squads FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY squads_insert ON squads FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));
CREATE POLICY squads_update ON squads FOR UPDATE
  USING (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));
CREATE POLICY squads_delete ON squads FOR DELETE
  USING (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));

-- AGENTS
CREATE POLICY agents_select ON agents FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY agents_insert ON agents FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));
CREATE POLICY agents_update ON agents FOR UPDATE
  USING (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin', 'operator'));
CREATE POLICY agents_delete ON agents FOR DELETE
  USING (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));

-- ALERTS
CREATE POLICY alerts_select ON alerts FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY alerts_insert ON alerts FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());
CREATE POLICY alerts_update ON alerts FOR UPDATE
  USING (tenant_id = get_user_tenant_id());

-- FINANCIAL RECORDS
CREATE POLICY financial_records_select ON financial_records FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY financial_records_insert ON financial_records FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin', 'operator'));
CREATE POLICY financial_records_update ON financial_records FOR UPDATE
  USING (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));

-- FINANCIAL MARGINS
CREATE POLICY financial_margins_select ON financial_margins FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY financial_margins_insert ON financial_margins FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());
CREATE POLICY financial_margins_update ON financial_margins FOR UPDATE
  USING (tenant_id = get_user_tenant_id());

-- APPROVALS
CREATE POLICY approvals_select ON approvals FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY approvals_insert ON approvals FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());
CREATE POLICY approvals_update ON approvals FOR UPDATE
  USING (tenant_id = get_user_tenant_id());

-- APPROVAL ACTIONS (via approval's tenant check)
CREATE POLICY approval_actions_select ON approval_actions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM approvals WHERE approvals.id = approval_actions.approval_id
    AND approvals.tenant_id = get_user_tenant_id()
  ));
CREATE POLICY approval_actions_insert ON approval_actions FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM approvals WHERE approvals.id = approval_actions.approval_id
    AND approvals.tenant_id = get_user_tenant_id()
  ));

-- CLIENTS
CREATE POLICY clients_select ON clients FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY clients_insert ON clients FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());
CREATE POLICY clients_update ON clients FOR UPDATE
  USING (tenant_id = get_user_tenant_id());

-- CONVERSATIONS
CREATE POLICY conversations_select ON conversations FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY conversations_insert ON conversations FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());
CREATE POLICY conversations_update ON conversations FOR UPDATE
  USING (tenant_id = get_user_tenant_id());

-- MESSAGES (via conversation's tenant check)
CREATE POLICY messages_select ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id
    AND conversations.tenant_id = get_user_tenant_id()
  ));
CREATE POLICY messages_insert ON messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversations WHERE conversations.id = messages.conversation_id
    AND conversations.tenant_id = get_user_tenant_id()
  ));

-- SALES METRICS
CREATE POLICY sales_metrics_select ON sales_metrics FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY sales_metrics_insert ON sales_metrics FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());
CREATE POLICY sales_metrics_update ON sales_metrics FOR UPDATE
  USING (tenant_id = get_user_tenant_id());

-- ROADMAP ITEMS
CREATE POLICY roadmap_items_select ON roadmap_items FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY roadmap_items_insert ON roadmap_items FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());
CREATE POLICY roadmap_items_update ON roadmap_items FOR UPDATE
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY roadmap_items_delete ON roadmap_items FOR DELETE
  USING (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));

-- ROADMAP MILESTONES
CREATE POLICY roadmap_milestones_select ON roadmap_milestones FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY roadmap_milestones_insert ON roadmap_milestones FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());
CREATE POLICY roadmap_milestones_update ON roadmap_milestones FOR UPDATE
  USING (tenant_id = get_user_tenant_id());

-- ROADMAP COMMENTS (via item's tenant check)
CREATE POLICY roadmap_comments_select ON roadmap_comments FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM roadmap_items WHERE roadmap_items.id = roadmap_comments.item_id
    AND roadmap_items.tenant_id = get_user_tenant_id()
  ));
CREATE POLICY roadmap_comments_insert ON roadmap_comments FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM roadmap_items WHERE roadmap_items.id = roadmap_comments.item_id
    AND roadmap_items.tenant_id = get_user_tenant_id()
  ));

-- WORLD ROOMS
CREATE POLICY world_rooms_select ON world_rooms FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY world_rooms_insert ON world_rooms FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));
CREATE POLICY world_rooms_update ON world_rooms FOR UPDATE
  USING (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));

-- WORLD CONNECTIONS (via room's tenant check)
CREATE POLICY world_connections_select ON world_connections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM world_rooms WHERE world_rooms.id = world_connections.room_a_id
    AND world_rooms.tenant_id = get_user_tenant_id()
  ));
CREATE POLICY world_connections_insert ON world_connections FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM world_rooms WHERE world_rooms.id = world_connections.room_a_id
    AND world_rooms.tenant_id = get_user_tenant_id()
  ));

-- AGENT PRESENCE (via agent's tenant check)
CREATE POLICY agent_presence_select ON agent_presence FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM agents WHERE agents.id = agent_presence.agent_id
    AND agents.tenant_id = get_user_tenant_id()
  ));
CREATE POLICY agent_presence_insert ON agent_presence FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM agents WHERE agents.id = agent_presence.agent_id
    AND agents.tenant_id = get_user_tenant_id()
  ));
CREATE POLICY agent_presence_update ON agent_presence FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM agents WHERE agents.id = agent_presence.agent_id
    AND agents.tenant_id = get_user_tenant_id()
  ));

-- WORLD NOTIFICATIONS
CREATE POLICY world_notifications_select ON world_notifications FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY world_notifications_insert ON world_notifications FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());
CREATE POLICY world_notifications_update ON world_notifications FOR UPDATE
  USING (tenant_id = get_user_tenant_id());

-- CAMPAIGNS
CREATE POLICY campaigns_select ON campaigns FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY campaigns_insert ON campaigns FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());
CREATE POLICY campaigns_update ON campaigns FOR UPDATE
  USING (tenant_id = get_user_tenant_id());

-- REPORTS
CREATE POLICY reports_select ON reports FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY reports_insert ON reports FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());
CREATE POLICY reports_update ON reports FOR UPDATE
  USING (tenant_id = get_user_tenant_id());

-- INTEGRATIONS
CREATE POLICY integrations_select ON integrations FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY integrations_insert ON integrations FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));
CREATE POLICY integrations_update ON integrations FOR UPDATE
  USING (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));
CREATE POLICY integrations_delete ON integrations FOR DELETE
  USING (tenant_id = get_user_tenant_id() AND get_user_role_enum() IN ('owner', 'admin'));

-- AUDIT LOG (read-only for non-admins, append by system)
CREATE POLICY audit_log_select ON audit_log FOR SELECT
  USING (tenant_id = get_user_tenant_id());
CREATE POLICY audit_log_insert ON audit_log FOR INSERT
  WITH CHECK (tenant_id = get_user_tenant_id());

-- ============================================================
-- REALTIME (enable for key tables)
-- ============================================================

ALTER PUBLICATION supabase_realtime ADD TABLE alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE agent_presence;
ALTER PUBLICATION supabase_realtime ADD TABLE world_notifications;
